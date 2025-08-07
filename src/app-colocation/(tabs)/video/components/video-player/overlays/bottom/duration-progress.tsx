/** @format */

import { useVideoPlayback } from "@/app-colocation/(tabs)/contexts/video-playback";
import { Box } from "@/components/ui/box";
import {
	Slider,
	SliderFilledTrack,
	SliderThumb,
	SliderTrack,
} from "@/components/ui/slider";
import { Text } from "@/components/ui/text";
import { formatDuration } from "@/lib/utils";
import { useEventListener } from "expo";
import React from "react";

export const DurationProgress = () => {
	const { player } = useVideoPlayback();
	React.useEffect(() => {
		player.timeUpdateEventInterval = 1;
	}, [player]);

	const [optimisticCurrentTime, setOptimisticCurrentTime] = React.useState(
		player.currentTime,
	);
	const isNewCurrentTimeScheduledRef = React.useRef(false);
	useEventListener(player, "timeUpdate", ({ currentTime: newTime }) => {
		if (!isNewCurrentTimeScheduledRef.current) {
			setOptimisticCurrentTime(newTime);
		}
	});

	return (
		<Box className="flex-row items-center justify-between gap-4">
			<Text size="sm">{formatDuration(optimisticCurrentTime)}</Text>
			<Slider
				value={optimisticCurrentTime}
				onChange={(slidingTime) => {
					isNewCurrentTimeScheduledRef.current = true;
					setOptimisticCurrentTime(slidingTime);
				}}
				onChangeEnd={(newTime) => {
					isNewCurrentTimeScheduledRef.current = false;
					player.currentTime = newTime;
				}}
				minValue={0}
				maxValue={player.duration}
				step={1.5}
				size="sm"
				className="w-auto flex-1">
				<SliderTrack>
					<SliderFilledTrack />
				</SliderTrack>
				<SliderThumb />
			</Slider>
			<Text size="sm">
				{formatDuration(player.duration - optimisticCurrentTime)}
			</Text>
		</Box>
	);
};
