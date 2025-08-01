/** @format */

import React from "react";
import type { VideoAsset } from "../types";
import * as EXVideoThumbnails from "expo-video-thumbnails";
import { normalizeError } from "../utils";
import { useWindowDimensions } from "react-native";
import {
	THUMBNAIL_ASPECT_RATIO,
	VIDEO_GAP,
	WINDOW_SCREEN_PADDING,
} from "../constants";
import { Box, type BoxProps } from "@/components/ui/box";
import { cn } from "@/lib/utils";
import { Image } from "@/components/ui/image";
import { Icon } from "@/components/ui/icon";
import { Play } from "lucide-react-native";
import { Text } from "@/components/ui/text";

const formatDuration = (totalSeconds: number): string => {
	const pad = (num: number) => num.toString().padStart(2, "0");

	const secondsInDay = 86400; // 24 * 60 * 60

	const days = Math.floor(totalSeconds / secondsInDay);
	const hours = Math.floor((totalSeconds % secondsInDay) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	let formattedString = "";

	if (days > 0) {
		formattedString += `${pad(days)}:`;
		formattedString += `${pad(hours)}:`;
	} else if (hours > 0) {
		formattedString += `${pad(hours)}:`;
	}

	formattedString += `${pad(minutes)}:${pad(seconds)}`;

	return formattedString;
};

const DurationBanner: React.FC<{
	duration: number;
	className?: string;
}> = ({ duration, className }) => {
	return (
		<Box
			className={cn(
				"h-4 flex-row items-center justify-center gap-0.5 rounded-sm bg-background-100/50 pl-0.5 pr-px",
				className,
			)}>
			<Icon size={8} className="fill-typography-950" as={Play} />
			<Text className="font-medium text-[0.5rem] text-typography-950">
				{formatDuration(duration)}
			</Text>
		</Box>
	);
};

const useThumbnailDimensions = () => {
	const { width } = useWindowDimensions();

	const totalHorizontalSpace = WINDOW_SCREEN_PADDING * 2 + VIDEO_GAP;
	const playerWidth = (width - totalHorizontalSpace) / 2;
	const playerHeight = playerWidth / THUMBNAIL_ASPECT_RATIO;

	return {
		width: playerWidth,
		height: playerHeight,
	} satisfies {
		width: number;
		height: number;
	};
};

type ThumbnailState =
	| {
			thumbnail: null;
			error: null;
	  }
	| {
			thumbnail: EXVideoThumbnails.VideoThumbnailsResult;
			error: null;
	  }
	| {
			thumbnail: null;
			error: Error;
	  };

interface VideoMediaThumbnailProps
	extends Pick<BoxProps, "className" | "style"> {
	video: VideoAsset;
}
const VideoMediaThumbnail_: React.FC<VideoMediaThumbnailProps> = ({
	video,
	className,
	style,
}) => {
	const [thumbnailState, setThumbnailState] = React.useState<ThumbnailState>({
		thumbnail: null,
		error: null,
	});

	React.useEffect(() => {
		const generateThumbnail = async () => {
			try {
				const result = await EXVideoThumbnails.getThumbnailAsync(
					video.uri,
					{
						time: 10000,
						quality: 0.2, // High quality is very unnecessary for our use case
					},
				);

				setThumbnailState({
					thumbnail: result,
					error: null,
				});
			} catch (e) {
				setThumbnailState({
					error: normalizeError(e),
					thumbnail: null,
				});
			}
		};

		void generateThumbnail();
	}, [video.uri]);

	const dimensions = useThumbnailDimensions();

	return (
		<Box
			style={[dimensions, style]}
			className={cn("relative items-center justify-center", className)}>
			{thumbnailState.thumbnail ? (
				<Image
					source={{ uri: thumbnailState.thumbnail.uri }}
					alt="video thumbnail"
					contentFit="cover"
					size="full"
				/>
			) : thumbnailState.error ? (
				<Text className="text-center text-xs">
					{thumbnailState.error.message}
				</Text>
			) : (
				<Icon as={Play} className="text-success-500" />
			)}

			<DurationBanner
				duration={video.duration}
				className="absolute bottom-1 right-1"
			/>
		</Box>
	);
};

export const VideoMediaThumbnail = React.memo(
	VideoMediaThumbnail_,
) as typeof VideoMediaThumbnail_;
