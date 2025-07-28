/** @format */

import React from "react";
import { useWindowDimensions } from "react-native";
import {
	runOnJS,
	useAnimatedStyle,
	useSharedValue,
	withTiming,
} from "react-native-reanimated";

export interface ElementLayout {
	pageX: number;
	pageY: number;
	width: number;
	height: number;
}

export const useThumbnailToFullscreenTransition = () => {
	// Animation values
	const scaleX = useSharedValue(1);
	const scaleY = useSharedValue(1);
	const translateX = useSharedValue(0);
	const translateY = useSharedValue(0);

	// Animated style for the thumbnail wrapper
	const animatedStyle = useAnimatedStyle(() => {
		return {
			transform: [
				{ translateX: translateX.value },
				{ translateY: translateY.value },
				{ scaleX: scaleX.value },
				{ scaleY: scaleY.value },
			],
		};
	});

	const backgroundTop = useSharedValue(0);
	const backgroundLeft = useSharedValue(0);
	const backgroundWidth = useSharedValue(0);
	const backgroundHeight = useSharedValue(0);
	const backgroundColorOpacity = useSharedValue(0);

	const animatedBackgroundStyle = useAnimatedStyle(() => {
		return {
			position: "absolute",
			top: backgroundTop.value,
			left: backgroundLeft.value,
			width: backgroundWidth.value,
			height: backgroundHeight.value,
			backgroundColor: `rgba(0, 0, 0, ${backgroundColorOpacity.value})`, // Black with animated opacity
		};
	});

	const windowDimensions = useWindowDimensions();
	/**
	 * Returns a promise that resolves when the transition is complete
	 * (thumbnail now in fullscreen).
	 */
	const startTransition = React.useCallback(
		({
			videoIntrisincAspectRatio,
			initialThumbnailLayout,
		}: {
			videoIntrisincAspectRatio: number;
			initialThumbnailLayout: ElementLayout;
		}) => {
			return new Promise<void>((resolve, reject) => {
				const ANIMATION_DURATION = 300;

				// --- Foreground Thumbnail Calculations ---
				const targetScaledWidth = windowDimensions.width;
				const targetScaledHeight =
					targetScaledWidth / videoIntrisincAspectRatio;

				const targetScaleX =
					targetScaledWidth / initialThumbnailLayout.width;
				const targetScaleY =
					targetScaledHeight / initialThumbnailLayout.height;

				const CENTERING_OFFSET_FACTOR = 1 / 2;
				const targetXOnScreen =
					(windowDimensions.width - targetScaledWidth) *
					CENTERING_OFFSET_FACTOR;
				const targetYOnScreen =
					(windowDimensions.height - targetScaledHeight) *
					CENTERING_OFFSET_FACTOR;

				// Constant for compensating for scale transformation's default center origin
				const SCALE_ORIGIN_COMPENSATION_FACTOR = 1 / 2;

				// Calculate the horizontal offset caused by scaling from the center
				const horizontalScaleOffset =
					(targetScaledWidth - initialThumbnailLayout.width) *
					SCALE_ORIGIN_COMPENSATION_FACTOR;
				const targetTranslateX =
					targetXOnScreen -
					initialThumbnailLayout.pageX +
					horizontalScaleOffset;

				// Calculate the vertical offset caused by scaling from the center
				const verticalScaleOffset =
					(targetScaledHeight - initialThumbnailLayout.height) *
					SCALE_ORIGIN_COMPENSATION_FACTOR;
				const targetTranslateY =
					targetYOnScreen -
					initialThumbnailLayout.pageY +
					verticalScaleOffset;

				// --- Background Box Animations ---
				// Set initial values synchronously before starting animation
				backgroundTop.value = initialThumbnailLayout.pageY;
				backgroundLeft.value = initialThumbnailLayout.pageX;
				backgroundWidth.value = initialThumbnailLayout.width;
				backgroundHeight.value = initialThumbnailLayout.height;

				// Animate to target full screen values
				backgroundTop.value = withTiming(0, {
					duration: ANIMATION_DURATION,
				});
				backgroundLeft.value = withTiming(0, {
					duration: ANIMATION_DURATION,
				});
				backgroundWidth.value = withTiming(windowDimensions.width, {
					duration: ANIMATION_DURATION,
				});
				backgroundHeight.value = withTiming(windowDimensions.height, {
					duration: ANIMATION_DURATION,
				});
				backgroundColorOpacity.value = withTiming(1, {
					duration: ANIMATION_DURATION,
				});

				// --- Foreground Thumbnail Animations ---
				scaleX.value = withTiming(
					targetScaleX,
					{ duration: ANIMATION_DURATION },
					(isFinished) => {
						if (isFinished) {
							runOnJS(resolve)();
						} else {
							runOnJS(() =>
								reject(
									new Error(
										"The transition couldn't finished",
									),
								),
							);
						}
					},
				);
				scaleY.value = withTiming(targetScaleY, {
					duration: ANIMATION_DURATION,
				});
				translateX.value = withTiming(targetTranslateX, {
					duration: ANIMATION_DURATION,
				});
				translateY.value = withTiming(targetTranslateY, {
					duration: ANIMATION_DURATION,
				});
			});
		},
		[
			backgroundColorOpacity,
			backgroundHeight,
			backgroundLeft,
			backgroundTop,
			backgroundWidth,
			scaleX,
			scaleY,
			translateX,
			translateY,
			windowDimensions.height,
			windowDimensions.width,
		],
	);

	// TODO: Fix this reset transition to be smooth
	/**
	 * Returns a promise that resolves when the animatedStyle values are
	 * back to original.
	 */
	const resetTransition = React.useCallback(
		({
			initialThumbnailLayout,
		}: {
			initialThumbnailLayout: ElementLayout;
		}) => {
			return new Promise<void>((resolve, reject) => {
				const ANIMATION_DURATION = 300;

				// --- Foreground Thumbnail Reset ---
				scaleX.value = withTiming(
					1,
					{ duration: ANIMATION_DURATION },
					(isFinished) => {
						if (isFinished) {
							runOnJS(resolve)();
						} else {
							runOnJS(reject)(
								new Error("Reset transition failed"),
							);
						}
					},
				);
				scaleY.value = withTiming(1, { duration: ANIMATION_DURATION });
				translateX.value = withTiming(0, {
					duration: ANIMATION_DURATION,
				});
				translateY.value = withTiming(0, {
					duration: ANIMATION_DURATION,
				});

				// --- Background Box Reset ---
				backgroundTop.value = withTiming(initialThumbnailLayout.pageY, {
					duration: ANIMATION_DURATION,
				});
				backgroundLeft.value = withTiming(
					initialThumbnailLayout.pageX,
					{
						duration: ANIMATION_DURATION,
					},
				);
				backgroundWidth.value = withTiming(
					initialThumbnailLayout.width,
					{
						duration: ANIMATION_DURATION,
					},
				);
				backgroundHeight.value = withTiming(
					initialThumbnailLayout.height,
					{
						duration: ANIMATION_DURATION,
					},
				);
				backgroundColorOpacity.value = withTiming(0, {
					duration: ANIMATION_DURATION,
				});
			});
		},
		[
			backgroundColorOpacity,
			backgroundHeight,
			backgroundLeft,
			backgroundTop,
			backgroundWidth,
			scaleX,
			scaleY,
			translateX,
			translateY,
		],
	);

	return {
		animatedStyle,
		animatedBackgroundStyle,
		startTransition,
		resetTransition,
	};
};
