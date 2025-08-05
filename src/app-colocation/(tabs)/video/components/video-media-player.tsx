/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Fullscreen } from "@/components/ui/fullscreen";
import { VideoView } from "expo-video";
import React from "react";
import { cssInterop } from "react-native-css-interop";
import { useVideoPlayback } from "../../contexts/video-playback";
import type { VideoAsset } from "../types";

cssInterop(VideoView, {
	className: "style",
});

interface VideoMediaPlayerProps {
	isInPlayback: boolean;
	setIsInPlayback: (isInPlayback: boolean) => void;
	video: VideoAsset;
}

const VideoMediaPlayer_: React.FC<VideoMediaPlayerProps> = ({
	isInPlayback,
	setIsInPlayback,
	video,
}) => {
	const { player, isVideoInPlaybackRef } = useVideoPlayback();

	const onEnterPlayback = React.useCallback(async () => {
		isVideoInPlaybackRef.current = true;
		await player.replaceAsync(video);
		player.play();
	}, [isVideoInPlaybackRef, player, video]);

	const onExitPlayback = React.useCallback(() => {
		player.pause();
		isVideoInPlaybackRef.current = false;
	}, [isVideoInPlaybackRef, player]);

	React.useEffect(() => {
		if (isInPlayback) {
			onEnterPlayback().catch(console.error);
		} else {
			onExitPlayback();
		}
	}, [isInPlayback, onExitPlayback, onEnterPlayback]);

	return (
		<Fullscreen
			isInFullscreen={isInPlayback}
			onFullscreenChange={setIsInPlayback}>
			<Box className="size-full bg-background-0 pt-24">
				<Button onPress={() => setIsInPlayback(false)}>
					<ButtonText>Back</ButtonText>
				</Button>
				<VideoView player={player} className="flex-1" />
			</Box>
		</Fullscreen>
	);
};

export const VideoMediaPlayer = React.memo(
	VideoMediaPlayer_,
) as typeof VideoMediaPlayer_;
