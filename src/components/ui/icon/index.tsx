/** @format */

import { createIcon, PrimitiveIcon, Svg } from "@gluestack-ui/icon";
import { type VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import { cssInterop } from "nativewind";
import React from "react";
import type { SvgProps } from "react-native-svg";

export const UIIcon = createIcon({
	Root: PrimitiveIcon,
}) as React.ForwardRefExoticComponent<
	React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
		React.RefAttributes<React.ComponentRef<typeof Svg>>
>;

const iconStyle = tva({
	base: "text-typography-950 fill-none pointer-events-none",
	variants: {
		size: {
			"2xs": "h-3 w-3",
			xs: "h-3.5 w-3.5",
			sm: "h-4 w-4",
			md: "h-[18px] w-[18px]",
			lg: "h-5 w-5",
			xl: "h-6 w-6",
		},
	},
});

cssInterop(UIIcon, {
	className: {
		target: "style",
		nativeStyleToProp: {
			height: true,
			width: true,
			fill: true,
			color: "classNameColor",
			stroke: true,
		},
	},
});

type BaseIconProps = SafeOmit<
	VariantProps<typeof iconStyle> & React.ComponentProps<typeof UIIcon>,
	"style"
> &
	Pick<SvgProps, "style">;
type IconProps = Prettify<
	BaseIconProps | (SafeOmit<BaseIconProps, "size"> & { size?: number })
>;

const Icon: React.FC<IconProps> = ({ size = "md", className, ...props }) => {
	if (typeof size === "number") {
		return (
			<UIIcon
				{...props}
				className={iconStyle({ class: className })}
				size={size}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIIcon {...props} className={iconStyle({ class: className })} />
		);
	}
	return (
		<UIIcon {...props} className={iconStyle({ size, class: className })} />
	);
};

export { Icon };
export type { IconProps };

type ParameterTypes = Omit<Parameters<typeof createIcon>[0], "Root">;

const createIconUI = ({ ...props }: ParameterTypes) => {
	const UIIconCreateIcon = createIcon({
		Root: Svg,
		...props,
	}) as React.ForwardRefExoticComponent<
		React.ComponentPropsWithoutRef<typeof PrimitiveIcon> &
			React.RefAttributes<React.ComponentRef<typeof Svg>>
	>;

	const UIIcon: React.FC<
		Prettify<
			React.ComponentProps<typeof UIIconCreateIcon> &
				VariantProps<typeof iconStyle>
		>
	> = ({ ref, className, size, ...inComingProps }) => {
		return (
			<UIIconCreateIcon
				{...inComingProps}
				className={iconStyle({ size, class: className })}
			/>
		);
	};

	return UIIcon;
};
export { createIconUI as createIcon };
