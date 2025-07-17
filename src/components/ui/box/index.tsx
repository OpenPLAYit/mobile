/** @format */

import React from "react";
import { View, type ViewProps } from "react-native";

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { boxStyle } from "./styles";
import { PropSlot, type AsChildProps } from "../slot";

type BaseBoxProps = Prettify<
	ViewProps &
		VariantProps<typeof boxStyle> & {
			className?: string;
			ref?: React.Ref<View>;
		}
>;

const BoxSlot = PropSlot as React.FC<BaseBoxProps>;

type BoxProps = AsChildProps<BaseBoxProps>;

const Box: React.FC<BoxProps> = ({ className, asChild, ...props }) => {
	const Comp = asChild ? BoxSlot : View;
	return <Comp {...props} className={boxStyle({ class: className })} />;
};

export { Box, BoxSlot };
export type { BoxProps };
