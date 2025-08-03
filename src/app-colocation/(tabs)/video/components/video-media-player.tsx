/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonText } from "@/components/ui/button";
import { Portal } from "@/components/ui/portal";
import { usePreventRemove } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import { VideoView } from "expo-video";
import React from "react";
import { BackHandler } from "react-native";
import { cssInterop } from "react-native-css-interop";
import { useVideoPlayback } from "../../contexts/video-playback";
import type { VideoAsset } from "../types";

cssInterop(VideoView, {
	className: "style",
});

const useStopPlaybackOnExit = ({
	isInPlayback,
	onExitPlayback,
}: {
	isInPlayback: boolean;
	onExitPlayback: () => void;
}) => {
	usePreventRemove(isInPlayback, () => {
		if (isInPlayback) {
			onExitPlayback();
		}
	});
	React.useEffect(() => {
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				if (isInPlayback) {
					onExitPlayback();
					return true;
				}
				return false;
			},
		);

		return () => subscription.remove();
	}, [isInPlayback, onExitPlayback]);
};

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

	const videoViewRef = React.useRef<VideoView>(null);

	const onEnterPlayback = React.useCallback(async () => {
		isVideoInPlaybackRef.current = true;
		await player.replaceAsync(video);
		void NavigationBar.setVisibilityAsync("hidden");
		player.play();
	}, [isVideoInPlaybackRef, player, video]);

	const onExitPlayback = React.useCallback(() => {
		player.pause();
		isVideoInPlaybackRef.current = false;
		setIsInPlayback(false);
		void NavigationBar.setVisibilityAsync("visible");
	}, [isVideoInPlaybackRef, player, setIsInPlayback]);

	React.useEffect(() => {
		if (isInPlayback) {
			onEnterPlayback().catch(console.error);
		} else {
			onExitPlayback();
		}
	}, [isInPlayback, onExitPlayback, onEnterPlayback]);

	useStopPlaybackOnExit({ isInPlayback, onExitPlayback });

	return (
		isInPlayback && (
			<Portal name="video-portal">
				<StatusBar hidden />
				<Box className="absolute left-0 top-0 size-full bg-red-500 pt-24">
					<Button onPress={onExitPlayback}>
						<ButtonText>Back</ButtonText>
					</Button>
					<VideoView
						ref={videoViewRef}
						player={player}
						className="flex-1"
					/>
				</Box>
			</Portal>
		)
	);
};

export const VideoMediaPlayer = React.memo(
	VideoMediaPlayer_,
) as typeof VideoMediaPlayer_;
