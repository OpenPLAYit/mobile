/** @format */

import { useVideoPlayback } from "@/app-colocation/(tabs)/contexts/video-playback";
import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { useEventListener } from "expo";
import { Pause, Play } from "lucide-react-native";
import React from "react";

export const ControlsBar = () => {
	const { player } = useVideoPlayback();
	const [isPlaying, setIsPlaying] = React.useState(player.playing);
	useEventListener(player, "playingChange", ({ isPlaying }) => {
		setIsPlaying(isPlaying);
	});

	return (
		<Box>
			<Button
				size="icon"
				variant="outline"
				className="rounded-full"
				onPress={() => {
					if (isPlaying) {
						player.pause();
					} else {
						player.play();
					}
				}}>
				<ButtonIcon
					className="fill-typography-600"
					as={isPlaying ? Pause : Play}
				/>
			</Button>

			{/* 
            TODO: Add 
            - prev video button 
            - next video button 
            - speed control 
            - video resizing button 
            - picture-in-picture button
            */}
		</Box>
	);
};
