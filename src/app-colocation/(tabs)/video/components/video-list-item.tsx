/** @format */

import React from "react";
import type { VideoAsset } from "../types";
import { Box, type BoxProps } from "@/components/ui/box";
import { useThumbnailDimensions, VideoMediaThumbnail } from "./video-thumbnail";
import { Text } from "@/components/ui/text";
import { Button, ButtonIcon } from "@/components/ui/button";
import { MoreVertical } from "lucide-react-native";
import { cn } from "@/lib/utils";

interface VideoListItemProps extends Pick<BoxProps, "style" | "className"> {
	video: VideoAsset;
}
const VideoListItem_: React.FC<VideoListItemProps> = ({
	video,
	style,
	className,
}) => {
	const thumbnailDimensions = useThumbnailDimensions();

	const truncatedName = React.useMemo(() => {
		const ellipsis = "...";

		const maxLength = Math.floor(thumbnailDimensions.width / 6);

		if (video.filename.length > maxLength) {
			return video.filename.slice(0, maxLength) + ellipsis;
		}

		return video.filename;
	}, [thumbnailDimensions.width, video.filename]);

	return (
		<Box
			style={[
				{
					width: thumbnailDimensions.width,
					height: thumbnailDimensions.height + 52,
				},
				style,
			]}
			className={cn("gap-2", className)}>
			<VideoMediaThumbnail video={video} />

			<Box className="w-full flex-row items-start justify-between gap-1">
				<Text size="xs" className="flex-1 truncate text-[0.65rem]">
					{truncatedName}
				</Text>

				{/* TODO: Button click should open drop down menu */}
				<Button size="icon" variant="ghost">
					<ButtonIcon as={MoreVertical} />
				</Button>
			</Box>
		</Box>
	);
};

export const VideoListItem = React.memo(
	VideoListItem_,
) as typeof VideoListItem_;
