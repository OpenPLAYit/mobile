/** @format */

import React from "react";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { Text as RNText, type TextProps as RNTextProps } from "react-native";
import { textStyle } from "./styles";
import { PropSlot, type AsChildProps } from "../slot";

type BaseTextProps = Prettify<
	RNTextProps & VariantProps<typeof textStyle> & { ref?: React.Ref<RNText> }
>;

const TextSlot = PropSlot as React.FC<BaseTextProps>;

type TextProps = AsChildProps<BaseTextProps>;

const Text: React.FC<TextProps> = ({
	className,
	isTruncated,
	bold,
	underline,
	strikeThrough,
	size = "md",
	sub,
	italic,
	highlight,
	asChild,
	...props
}) => {
	const Comp = asChild ? TextSlot : RNText;
	return (
		<Comp
			{...props}
			className={textStyle({
				isTruncated,
				bold,
				underline,
				strikeThrough,
				size,
				sub,
				italic,
				highlight,
				class: className,
			})}
		/>
	);
};

export { Text, TextSlot };
export type { TextProps };
