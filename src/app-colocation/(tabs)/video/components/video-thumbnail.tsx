/** @format */

import { Box, type BoxProps } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { Text } from "@/components/ui/text";
import { cn, formatDuration } from "@/lib/utils";
import * as EXVideoThumbnails from "expo-video-thumbnails";
import { Play } from "lucide-react-native";
import React from "react";
import { useWindowDimensions } from "react-native";
import {
	THUMBNAIL_ASPECT_RATIO,
	VIDEO_GAP,
	WINDOW_SCREEN_PADDING,
} from "../constants";
import type { VideoAsset } from "../types";
import { normalizeError } from "../utils";

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

export const useThumbnailDimensions = () => {
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
				<Icon as={Play} className="text-primary-500" />
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
