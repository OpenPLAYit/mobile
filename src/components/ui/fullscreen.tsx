/** @format */

import { cn } from "@/lib/utils";
import { usePreventRemove } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { BackHandler } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { Box, type BoxProps } from "./box";
import { Portal } from "./portal";
import type { NoAsChildProps } from "./slot";

const useLeaveFullscreenOnExit = ({
	isInFullscreen,
	onLeaveFullscreen,
}: {
	isInFullscreen: boolean;
	onLeaveFullscreen: () => void;
}) => {
	usePreventRemove(isInFullscreen, () => {
		if (isInFullscreen) {
			onLeaveFullscreen();
		}
	});
	React.useEffect(() => {
		const subscription = BackHandler.addEventListener(
			"hardwareBackPress",
			() => {
				if (isInFullscreen) {
					onLeaveFullscreen();
					return true;
				}
				return false;
			},
		);

		return () => subscription.remove();
	}, [isInFullscreen, onLeaveFullscreen]);
};

const AnimatedBox = Animated.createAnimatedComponent(Box);

type FullscreenProps = Prettify<
	NoAsChildProps<BoxProps> & {
		isInFullscreen: boolean;
		onFullscreenChange: (isInFullscreen: boolean) => void;
	}
>;

const Fullscreen_: React.FC<FullscreenProps> = ({
	children,
	isInFullscreen,
	onFullscreenChange,
	className,
	...props
}) => {
	React.useEffect(() => {
		NavigationBar.setVisibilityAsync(
			isInFullscreen ? "hidden" : "visible",
		).catch(console.error);
	}, [isInFullscreen]);

	useLeaveFullscreenOnExit({
		isInFullscreen,
		onLeaveFullscreen: () => onFullscreenChange(false),
	});

	return (
		<>
			{isInFullscreen && (
				<Portal name="fullscreen-portal">
					<AnimatedBox
						{...props}
						className={cn(
							"absolute left-0 top-0 size-full",
							className,
						)}
						entering={SlideInRight}
						exiting={SlideOutRight}>
						{children}
					</AnimatedBox>
				</Portal>
			)}
			{isInFullscreen && <StatusBar hidden />}
		</>
	);
};

const Fullscreen = React.memo(Fullscreen_) as typeof Fullscreen_;

export { Fullscreen };
export type { FullscreenProps };
