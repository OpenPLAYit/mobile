/** @format */

"use client";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	useStyleContext,
	withStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { createSlider } from "@gluestack-ui/slider";
import { cssInterop } from "nativewind";
import React from "react";
import { Pressable, View } from "react-native";

const SCOPE = "SLIDER";
const Root = withStyleContext(View, SCOPE);
export const UISlider = createSlider({
	Root: Root,
	Thumb: View,
	Track: Pressable,
	FilledTrack: View,
	ThumbInteraction: View,
});

cssInterop(UISlider.Track, { className: "style" });

const sliderStyle = tva({
	base: "justify-center items-center data-[disabled=true]:opacity-40",
	variants: {
		orientation: {
			horizontal: "w-full",
			vertical: "h-full",
		},
		size: {
			sm: "",
			md: "",
			lg: "",
		},
		isReversed: {
			true: "",
			false: "",
		},
	},
});

const sliderThumbStyle = tva({
	base: "bg-primary-500 absolute rounded-full data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600 data-[disabled=true]:bg-primary-500 shadow-hard-1",

	parentVariants: {
		size: {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		},
	},
});

const sliderTrackStyle = tva({
	base: "bg-background-300 rounded-lg overflow-hidden",
	parentVariants: {
		orientation: {
			horizontal: "w-full",
			vertical: "h-full",
		},
		isReversed: {
			true: "",
			false: "",
		},
		size: {
			sm: "",
			md: "",
			lg: "",
		},
	},
	parentCompoundVariants: [
		{
			orientation: "horizontal",
			size: "sm",
			class: "h-1 flex-row",
		},
		{
			orientation: "horizontal",
			size: "sm",
			isReversed: true,
			class: "h-1 flex-row-reverse",
		},
		{
			orientation: "horizontal",
			size: "md",
			class: "h-1 flex-row",
		},
		{
			orientation: "horizontal",
			size: "md",
			isReversed: true,
			class: "h-[5px] flex-row-reverse",
		},
		{
			orientation: "horizontal",
			size: "lg",
			class: "h-1.5 flex-row",
		},
		{
			orientation: "horizontal",
			size: "lg",
			isReversed: true,
			class: "h-1.5 flex-row-reverse",
		},
		{
			orientation: "vertical",
			size: "sm",
			class: "w-1 flex-col-reverse",
		},
		{
			orientation: "vertical",
			size: "sm",
			isReversed: true,
			class: "w-1 flex-col",
		},
		{
			orientation: "vertical",
			size: "md",
			class: "w-[5px] flex-col-reverse",
		},
		{
			orientation: "vertical",
			size: "md",
			isReversed: true,
			class: "w-[5px] flex-col",
		},
		{
			orientation: "vertical",
			size: "lg",
			class: "w-1.5 flex-col-reverse",
		},
		{
			orientation: "vertical",
			size: "lg",
			isReversed: true,
			class: "w-1.5 flex-col",
		},
	],
});

const sliderFilledTrackStyle = tva({
	base: "bg-primary-500 data-[focus=true]:bg-primary-600 data-[active=true]:bg-primary-600 data-[hover=true]:bg-primary-600",
	parentVariants: {
		orientation: {
			horizontal: "h-full",
			vertical: "w-full",
		},
	},
});

type SliderProps = Prettify<
	React.ComponentProps<typeof UISlider> & VariantProps<typeof sliderStyle>
>;

const Slider: React.FC<SliderProps> = ({
	className,
	size = "md",
	orientation = "horizontal",
	isReversed = false,
	...props
}) => {
	return (
		<UISlider
			{...props}
			isReversed={isReversed}
			orientation={orientation}
			className={sliderStyle({
				orientation,
				isReversed,
				class: className,
			})}
			context={{ size, orientation, isReversed }}
		/>
	);
};

type SliderThumbProps = Prettify<
	React.ComponentProps<typeof UISlider.Thumb> &
		VariantProps<typeof sliderThumbStyle>
>;

const SliderThumb: React.FC<SliderThumbProps> = ({
	className,
	size,
	hitSlop = 16,
	...props
}) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof sliderThumbStyle
	>;

	return (
		<UISlider.Thumb
			{...props}
			className={sliderThumbStyle({
				parentVariants: {
					size: parentSize,
				},
				size,
				class: className,
			})}
			hitSlop={hitSlop}
		/>
	);
};

type SliderTrackProps = Prettify<
	React.ComponentProps<typeof UISlider.Track> &
		VariantProps<typeof sliderTrackStyle>
>;

const SliderTrack: React.FC<SliderTrackProps> = ({
	className,
	hitSlop = 16,
	...props
}) => {
	const {
		orientation: parentOrientation,
		size: parentSize,
		isReversed,
	} = useStyleContext(SCOPE) as VariantProps<typeof sliderTrackStyle>;

	return (
		<UISlider.Track
			{...props}
			className={sliderTrackStyle({
				parentVariants: {
					orientation: parentOrientation,
					size: parentSize,
					isReversed,
				},
				class: className,
			})}
			hitSlop={hitSlop}
		/>
	);
};

type SliderFilledTrackProps = Prettify<
	React.ComponentProps<typeof UISlider.FilledTrack> &
		VariantProps<typeof sliderFilledTrackStyle>
>;

const SliderFilledTrack: React.FC<SliderFilledTrackProps> = ({
	className,
	hitSlop = 16,
	...props
}) => {
	const { orientation: parentOrientation } = useStyleContext(
		SCOPE,
	) as VariantProps<typeof sliderFilledTrackStyle>;

	return (
		<UISlider.FilledTrack
			{...props}
			className={sliderFilledTrackStyle({
				parentVariants: {
					orientation: parentOrientation,
				},
				class: className,
			})}
			hitSlop={hitSlop}
		/>
	);
};

export { Slider, SliderFilledTrack, SliderThumb, SliderTrack };
export type {
	SliderProps,
	SliderFilledTrackProps,
	SliderThumbProps,
	SliderTrackProps,
};
