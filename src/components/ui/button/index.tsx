/** @format */

"use client";
import React from "react";
import { createButton } from "@gluestack-ui/button";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	withStyleContext,
	useStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { cssInterop } from "nativewind";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";

const SCOPE = "BUTTON";

const Root = withStyleContext(Pressable, SCOPE);

const UIButton = createButton({
	Root: Root,
	Text,
	Group: View,
	Spinner: ActivityIndicator,
	Icon: UIIcon,
});

cssInterop(PrimitiveIcon, {
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

const buttonStyle = tva({
	base: "group/button rounded flex-row items-center justify-center data-[disabled=true]:opacity-40 gap-2",
	variants: {
		variant: {
			default:
				"bg-primary-500 data-[hover=true]:bg-primary-600 data-[active=true]:bg-primary-700 border border-primary-300 data-[hover=true]:border-primary-400 data-[active=true]:border-primary-500",
			destructive:
				"bg-error-500 data-[hover=true]:bg-error-600 data-[active=true]:bg-error-700 border border-error-300 data-[hover=true]:border-error-400 data-[active=true]:border-error-500",
			secondary:
				"bg-secondary-500 data-[hover=true]:bg-secondary-600 data-[active=true]:bg-secondary-700 border border-secondary-300 data-[hover=true]:border-secondary-400 data-[active=true]:border-secondary-500",
			outline:
				"bg-transparent border border-outline-500 data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
			ghost: "bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-background-100",
			link: "px-0 bg-transparent data-[hover=true]:bg-background-50 data-[active=true]:bg-transparent",
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9",
		},
	},
});

const buttonTextStyle = tva({
	base: "font-medium",
	parentVariants: {
		variant: {
			default:
				"text-typography-950 data-[hover=true]:text-typography-950 data-[active=true]:text-typography-950",
			destructive:
				"text-typography-50 data-[hover=true]:text-typography-50 data-[active=true]:text-typography-50",
			secondary:
				"text-typography-50 data-[hover=true]:text-typography-50 data-[active=true]:text-typography-50",
			outline:
				"text-typography-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-600",
			ghost: "text-typography-500 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-600",
			link: "text-primary-500 underline-offset-4 data-[hover=true]:underline data-[active=true]:underline",
		},
		size: {
			default: "text-sm",
			sm: "text-xs",
			lg: "text-base",
			icon: "",
		},
	},
});

const buttonIconStyle = tva({
	base: "fill-none",
	parentVariants: {
		variant: {
			default: "text-typography-950",
			destructive: "text-typography-50",
			secondary: "text-typography-50",
			outline:
				"text-typography-600 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-600",
			ghost: "text-typography-600 data-[hover=true]:text-primary-500 data-[active=true]:text-primary-600",
			link: "text-primary-500 data-[hover=true]:text-primary-600 data-[active=true]:text-primary-700",
		},
		size: {
			default: "h-4 w-4",
			sm: "h-3.5 w-3.5",
			lg: "h-[18px] w-[18px]",
			icon: "h-5 w-5",
		},
	},
});

const buttonGroupStyle = tva({
	base: "",
	variants: {
		space: {
			xs: "gap-1",
			sm: "gap-2",
			md: "gap-3",
			lg: "gap-4",
			xl: "gap-5",
			"2xl": "gap-6",
			"3xl": "gap-7",
			"4xl": "gap-8",
		},
		isAttached: {
			true: "gap-0",
		},
		flexDirection: {
			row: "flex-row",
			column: "flex-col",
			"row-reverse": "flex-row-reverse",
			"column-reverse": "flex-col-reverse",
		},
	},
});

type ButtonProps = Prettify<
	SafeOmit<React.ComponentProps<typeof UIButton>, "context"> &
		VariantProps<typeof buttonStyle>
>;

const Button: React.FC<ButtonProps> = ({
	className,
	variant = "default",
	size = "default",
	hitSlop,
	...props
}) => {
	return (
		<UIButton
			{...props}
			className={buttonStyle({ variant, size, class: className })}
			context={{ variant, size }}
			hitSlop={hitSlop ?? (size === "icon" ? 16 : undefined)}
		/>
	);
};

type ButtonTextProps = Prettify<
	React.ComponentProps<typeof UIButton.Text> &
		VariantProps<typeof buttonTextStyle>
>;

const ButtonText: React.FC<ButtonTextProps> = ({
	className,
	variant,
	size,
	...props
}) => {
	const { variant: parentVariant, size: parentSize } = useStyleContext(
		SCOPE,
	) as VariantProps<typeof buttonTextStyle>;

	return (
		<UIButton.Text
			{...props}
			className={buttonTextStyle({
				parentVariants: {
					variant: parentVariant,
					size: parentSize,
				},
				variant,
				size,
				class: className,
			})}
		/>
	);
};

const ButtonSpinner = UIButton.Spinner;

type BaseButtonIconProps = React.ComponentProps<typeof UIButton.Icon> &
	VariantProps<typeof buttonIconStyle> & {
		as?: React.ElementType;
		height?: number;
		width?: number;
	};
type ButtonIconProps = Prettify<
	| BaseButtonIconProps
	| (SafeOmit<BaseButtonIconProps, "size"> & { size?: number })
>;

const ButtonIcon: React.FC<ButtonIconProps> = ({
	className,
	size,
	...props
}) => {
	const { variant: parentVariant, size: parentSize } = useStyleContext(
		SCOPE,
	) as VariantProps<typeof buttonIconStyle>;

	if (typeof size === "number") {
		return (
			<UIButton.Icon
				{...props}
				className={buttonIconStyle({ class: className })}
				size={size}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIButton.Icon
				{...props}
				className={buttonIconStyle({ class: className })}
			/>
		);
	}
	return (
		<UIButton.Icon
			{...props}
			className={buttonIconStyle({
				parentVariants: {
					size: parentSize,
					variant: parentVariant,
				},
				size,
				class: className,
			})}
		/>
	);
};

type ButtonGroupProps = Prettify<
	React.ComponentProps<typeof UIButton.Group> &
		VariantProps<typeof buttonGroupStyle>
>;

const ButtonGroup: React.FC<ButtonGroupProps> = ({
	className,
	space = "md",
	isAttached = false,
	flexDirection = "column",
	...props
}) => {
	return (
		<UIButton.Group
			{...props}
			className={buttonGroupStyle({
				class: className,
				space,
				isAttached,
				flexDirection,
			})}
		/>
	);
};

export { Button, ButtonText, ButtonSpinner, ButtonIcon, ButtonGroup };

export type { ButtonProps, ButtonTextProps, ButtonIconProps, ButtonGroupProps };
