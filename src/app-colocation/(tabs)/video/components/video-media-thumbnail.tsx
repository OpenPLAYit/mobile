/** @format */

import { Box, type BoxProps } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { cn, isObject } from "@/lib/utils";
import type { VideoSource } from "expo-video";
import * as EXVideoThumbnails from "expo-video-thumbnails";
import { Play } from "lucide-react-native";
import React from "react";

export interface VideoThumbnailProps extends Pick<BoxProps, "ref"> {
	videoSource: VideoSource;
	setThumbnailResult?: (
		thumbnail: EXVideoThumbnails.VideoThumbnailsResult,
	) => void;
	className?: string;
}
export const VideoMediaThumbnail: React.FC<VideoThumbnailProps> = ({
	videoSource,
	setThumbnailResult,
	className,
	ref,
}) => {
	const [thumbnail, setThumbnail] =
		React.useState<EXVideoThumbnails.VideoThumbnailsResult | null>(null);
	React.useEffect(() => {
		const generateThumbnail = async (videoUri: string) => {
			try {
				const result = await EXVideoThumbnails.getThumbnailAsync(
					videoUri,
					{ time: 10000 },
				);

				setThumbnail(result);
			} catch (e) {
				console.error(e);
			}
		};

		const videoUri: string | null = isObject(videoSource)
			? (videoSource.uri ?? null)
			: typeof videoSource === "string"
				? videoSource
				: null;

		if (videoUri) {
			generateThumbnail(videoUri).catch(console.error);
		}
	}, [videoSource]);

	React.useEffect(() => {
		if (!thumbnail || !setThumbnailResult) {
			return;
		}

		setThumbnailResult(thumbnail);
	}, [setThumbnailResult, thumbnail]);

	return (
		<Box ref={ref} className={cn("items-center justify-center", className)}>
			{thumbnail ? (
				<Image
					source={{ uri: thumbnail.uri }}
					alt="video thumbnail"
					contentFit="cover"
					size="full"
				/>
			) : (
				<Icon as={Play} classNameColor="text-green-500" />
			)}
		</Box>
	);
};
