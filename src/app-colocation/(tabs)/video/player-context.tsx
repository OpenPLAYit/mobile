/** @format */

import { useVideoPlayer, type VideoPlayer } from "expo-video";
import React from "react";

export interface PlayerContextType {
	player: VideoPlayer;
}

const PlayerContext = React.createContext<PlayerContextType | null>(null);

export const PlayerProvider = ({ children }: { children: React.ReactNode }) => {
	const player = useVideoPlayer(null, (player) => {
		player.loop = true;
		player.bufferOptions = {
			preferredForwardBufferDuration: 5,
		};
	});

	const value = React.useMemo(
		() => ({
			player,
		}),
		[player],
	);

	return <PlayerContext value={value}>{children}</PlayerContext>;
};

export const usePlayer = () => {
	const context = React.use(PlayerContext);
	if (!context) {
		throw new Error("usePlayer must be used within a PlayerProvider");
	}
	return context;
};
