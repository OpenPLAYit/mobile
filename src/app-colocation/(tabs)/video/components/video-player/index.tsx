/** @format */

import { Box } from "@/components/ui/box";
import {
	FullscreenContent,
	FullscreenPortal,
} from "@/components/ui/fullscreen";
import { VideoView } from "expo-video";
import React from "react";
import { cssInterop } from "react-native-css-interop";
import { useVideoPlayback } from "../../../contexts/video-playback";
import type { VideoAsset } from "../../types";
import {
	VideoMediaPlayerProvider,
	type VideoMediaPlayerContextType,
} from "./context";
import { BottomOverlay } from "./overlays/bottom";
import { TopOverlay } from "./overlays/top";
import { VIDEO_FULLSCREEN_PORTAL_HOST } from "@/constants";

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

	const mediaPlayerContext: VideoMediaPlayerContextType = React.useMemo(
		() => ({ isInPlayback, setIsInPlayback, video }),
		[isInPlayback, setIsInPlayback, video],
	);

	return (
		<FullscreenPortal
			name="fullscreen-portal"
			hostName={VIDEO_FULLSCREEN_PORTAL_HOST}
			isInFullscreen={isInPlayback}
			onFullscreenChange={setIsInPlayback}>
			<VideoMediaPlayerProvider context={mediaPlayerContext}>
				<FullscreenContent>
					<Box className="relative size-full bg-background-0">
						<VideoView
							player={player}
							nativeControls={false}
							className="flex-1"
						/>

						{/* 
                        TODO: Add 
                        - Add hide/show overlays based on click of video area 
                        - Add double-click video area to play/pause 
                        - Add, drag gesture to change video currentTime progress, logic
                        - Add other mid screen overlays, 2 left, 2 right
                        */}
						<TopOverlay />
						<BottomOverlay />
					</Box>
				</FullscreenContent>
			</VideoMediaPlayerProvider>
		</FullscreenPortal>
	);
};

export const VideoMediaPlayer = React.memo(
	VideoMediaPlayer_,
) as typeof VideoMediaPlayer_;
