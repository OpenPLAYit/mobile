/** @format */

import { cn } from "@/lib/utils";
import { VideoView, type VideoSource, type VideoViewProps } from "expo-video";
import React from "react";
import { useWindowDimensions } from "react-native";
import { cssInterop } from "react-native-css-interop";
import { VIDEO_GAP, WINDOW_SCREEN_PADDING } from "../constants";

export const PLAYER_ASPECT_RATIO = 16 / 9;

export const usePlayerDimensions = () => {
	const { width } = useWindowDimensions();

	const totalHorizontalSpace = WINDOW_SCREEN_PADDING * 2 + VIDEO_GAP;
	const playerWidth = (width - totalHorizontalSpace) / 2;
	const playerHeight = playerWidth / PLAYER_ASPECT_RATIO;

	return { width: playerWidth, height: playerHeight } satisfies {
		width: number;
		height: number;
	};
};

export interface PlayerItemProps extends VideoViewProps {
	source: VideoSource;
}

cssInterop(VideoView, {
	className: "style",
});

export const PlayerItem: React.FC<PlayerItemProps> = ({
	source,
	player,
	className,
	style,
	...props
}) => {
	React.useEffect(() => {
		player.replaceAsync(source).catch((e) => console.error(e));
	}, [player, source]);

	// const { isPlaying } = useEvent(player, "playingChange", {
	// 	isPlaying: player.playing,
	// });
	const { width } = usePlayerDimensions();

	return (
		<VideoView
			{...props}
			player={player}
			className={cn(className)}
			style={[
				{
					width,
					aspectRatio: PLAYER_ASPECT_RATIO,
				},
				style,
			]}
		/>
	);
};
