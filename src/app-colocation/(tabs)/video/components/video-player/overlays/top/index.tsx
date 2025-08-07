/** @format */

import { Box } from "@/components/ui/box";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { MoveLeft } from "lucide-react-native";
import { Animated } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoMediaPlayer } from "../../context";

const AnimatedText = Animated.createAnimatedComponent(Text);

export const TopOverlay = () => {
	const { setIsInPlayback, video } = useVideoMediaPlayer();

	return (
		<SafeAreaView
			edges={["top", "left", "right"]}
			className="absolute left-0 right-0 top-0 flex-row justify-between px-4">
			<Button
				size="icon"
				variant="ghost"
				onPress={() => setIsInPlayback(false)}>
				<ButtonIcon as={MoveLeft} />
				<Text className="sr-only">Exit video playback</Text>
			</Button>

			<Box className="overflow-clip">
				<AnimatedText numberOfLines={1} className={"w-max"}>
					{/* TODO: Implement marquee animation using css keyframes in reanimated v4*/}
					{video.filename}
				</AnimatedText>
			</Box>

			{/* 
            TODO: Add 
            - HDR button 
            - subtitle button 
            - backgrond play/ play as audio button 
            - and 2 other buttons
            */}
		</SafeAreaView>
	);
};
