/** @format */

import { cn } from "@/lib/utils";
import { usePreventRemove } from "@react-navigation/native";
import * as NavigationBar from "expo-navigation-bar";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { BackHandler } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { Box, type BoxProps } from "./box";
import { Portal, type PortalProps } from "./portal";
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

interface FullscreenContextType {
	isInFullscreen: boolean;
	onFullscreenChange: (isInFullscreen: boolean) => void;
}
const FullscreenContext = React.createContext<FullscreenContextType | null>(
	null,
);

const useFullscreen = () => {
	const context = React.use(FullscreenContext);
	if (!context) {
		throw new Error(
			"useFullscreen must be used within a FullscreenContext provider.",
		);
	}
	return context;
};

type FullscreenPortalProps = PortalProps & FullscreenContextType;

const FullscreenPortal_: React.FC<FullscreenPortalProps> = ({
	children,
	isInFullscreen,
	onFullscreenChange,
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

	const contextValue: FullscreenContextType = React.useMemo(
		() => ({ isInFullscreen, onFullscreenChange }),
		[isInFullscreen, onFullscreenChange],
	);

	return (
		isInFullscreen && (
			<Portal {...props}>
				<FullscreenContext value={contextValue}>
					{children}
				</FullscreenContext>
				<StatusBar hidden />
			</Portal>
		)
	);
};
const FullscreenPortal = React.memo(
	FullscreenPortal_,
) as typeof FullscreenPortal_;

type FullscreenContentProps = NoAsChildProps<BoxProps>;

const FullscreenContent_: React.FC<FullscreenContentProps> = ({
	className,
	...props
}) => {
	const { isInFullscreen } = useFullscreen();
	return (
		isInFullscreen && (
			<AnimatedBox
				{...props}
				className={cn("absolute left-0 top-0 size-full", className)}
				entering={SlideInRight}
				exiting={SlideOutRight}
			/>
		)
	);
};
const FullscreenContent = React.memo(
	FullscreenContent_,
) as typeof FullscreenContent_;

export { FullscreenPortal, FullscreenContent };
export type { FullscreenPortalProps, FullscreenContentProps };
