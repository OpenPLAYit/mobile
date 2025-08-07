/** @format */

import { Box, type BoxProps } from "@/components/ui/box";
import {
	Button,
	ButtonGroup,
	ButtonIcon,
	ButtonText,
} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MoreVertical } from "lucide-react-native";
import React from "react";
import { Pressable } from "react-native";
import type { VideoAsset } from "../types";
import { VideoMediaPlayer } from "./video-player";
import { useThumbnailDimensions, VideoMediaThumbnail } from "./video-thumbnail";

interface VideoListItemProps extends Pick<BoxProps, "style" | "className"> {
	video: VideoAsset;
}
const VideoListItem_: React.FC<VideoListItemProps> = ({
	video,
	style,
	className,
}) => {
	const thumbnailDimensions = useThumbnailDimensions();

	const [isInPlayback, setIsInPlayback] = React.useState(false);

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
			<VideoMediaPlayer
				video={video}
				isInPlayback={isInPlayback}
				setIsInPlayback={setIsInPlayback}
			/>

			<Pressable onPress={() => setIsInPlayback(true)}>
				<VideoMediaThumbnail video={video} />
			</Pressable>

			<ButtonGroup className="w-full flex-row items-start justify-between gap-1">
				<Button
					variant="ghost"
					size="lg"
					className="h-auto flex-1 p-1"
					onPress={() => setIsInPlayback(true)}>
					<ButtonText
						numberOfLines={2}
						className="text-[0.65rem] text-primary-800">
						{video.filename}
					</ButtonText>
				</Button>

				{/* TODO: Button click should open drop down menu */}
				<Button size="icon" variant="ghost">
					<ButtonIcon as={MoreVertical} />
				</Button>
			</ButtonGroup>
		</Box>
	);
};

export const VideoListItem = React.memo(
	VideoListItem_,
) as typeof VideoListItem_;
