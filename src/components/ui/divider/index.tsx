/** @format */

"use client";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import React from "react";
import { View } from "react-native";

const dividerStyle = tva({
	base: "bg-background-200",
	variants: {
		orientation: {
			vertical: "w-px h-full",
			horizontal: "h-px w-full",
		},
	},
});

type DividerProps = Prettify<
	React.ComponentProps<typeof View> & VariantProps<typeof dividerStyle>
>;

const Divider: React.FC<DividerProps> = ({
	className,
	orientation = "horizontal",
	...props
}) => {
	return (
		<View
			{...props}
			aria-orientation={orientation}
			role={"separator"}
			className={dividerStyle({
				orientation,
				class: className,
			})}
		/>
	);
};

export { Divider };

export type { DividerProps };
