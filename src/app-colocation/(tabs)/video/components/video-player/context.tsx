/** @format */

import React from "react";
import type { VideoAsset } from "../../types";

export interface VideoMediaPlayerContextType {
	isInPlayback: boolean;
	setIsInPlayback: (isInPlayback: boolean) => void;
	video: VideoAsset;
}

const VideoMediaPlayerContext =
	React.createContext<VideoMediaPlayerContextType | null>(null);

export const useVideoMediaPlayer = () => {
	const context = React.use(VideoMediaPlayerContext);
	if (!context) {
		throw new Error(
			"useVideoMediaPlayer must be used within a VideoMediaPlayerContext provider.",
		);
	}
	return context;
};

interface VideoMediaPlayerProviderProps {
	children?: React.ReactNode;
	context: VideoMediaPlayerContextType;
}

const VideoMediaPlayerProvider_: React.FC<VideoMediaPlayerProviderProps> = ({
	context,
	children,
}) => {
	return (
		<VideoMediaPlayerContext value={context}>
			{children}
		</VideoMediaPlayerContext>
	);
};
export const VideoMediaPlayerProvider = React.memo(
	VideoMediaPlayerProvider_,
) as typeof VideoMediaPlayerProvider_;
