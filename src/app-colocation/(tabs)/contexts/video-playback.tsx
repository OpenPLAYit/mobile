/** @format */

import { useVideoPlayer, type VideoPlayer } from "expo-video";
import React from "react";

interface VideoPlaybackContextType {
	/**This ref is meant to be written to by a video playback handler to signal
	 * when the UI should adjust to account for a video taking up the entire screen.
	 *
	 * Writes should happen before hiding/showing the navigation bar.
	 */
	isVideoInPlaybackRef: React.RefObject<boolean>;
	player: VideoPlayer;
}

const VideoPlaybackContext =
	React.createContext<VideoPlaybackContextType | null>(null);

export const useVideoPlayback = () => {
	const context = React.use(VideoPlaybackContext);
	if (!context) {
		throw new Error(
			"useVideoPlayback must be used within a VideoPlaybackContext provider.",
		);
	}
	return context;
};

export const VideoPlaybackProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const isVideoInPlaybackRef = React.useRef(false);

	const player = useVideoPlayer(null, (player) => {
		player.bufferOptions = {
			preferredForwardBufferDuration: 5,
		};
	});

	const contextValue = React.useMemo(
		() =>
			({
				isVideoInPlaybackRef,
				player,
			}) satisfies VideoPlaybackContextType,
		[player],
	);

	return (
		<VideoPlaybackContext value={contextValue}>
			{children}
		</VideoPlaybackContext>
	);
};
