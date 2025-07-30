/** @format */

import { PrimitiveIcon, UIIcon } from "@gluestack-ui/icon";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import {
	useStyleContext,
	withStyleContext,
} from "@gluestack-ui/nativewind-utils/withStyleContext";
import { createRadio } from "@gluestack-ui/radio";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { cssInterop } from "react-native-css-interop";

const SCOPE = "Radio";

const UIRadio = createRadio({
	Root: withStyleContext(Pressable, SCOPE),
	Group: View,
	Icon: UIIcon,
	Indicator: View,
	Label: Text,
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

const radioStyle = tva({
	base: "group/radio flex-row justify-start items-center",
	variants: {
		size: {
			sm: "gap-1.5",
			md: "gap-2",
			lg: "gap-2",
		},
	},
});

const radioGroupStyle = tva({
	base: "gap-2",
});

const radioIconStyle = tva({
	base: "rounded-full justify-center items-center text-primary-800 fill-primary-800",

	parentVariants: {
		size: {
			sm: "h-[9px] w-[9px]",
			md: "h-3 w-3",
			lg: "h-4 w-4",
		},
	},
});

const radioIndicatorStyle = tva({
	base: "justify-center items-center bg-transparent border-outline-400 border-2 rounded-full data-[checked=true]:border-primary-600 data-[checked=true]:bg-transparent data-[hover=true]:border-outline-500 data-[hover=true]:bg-transparent data-[hover=true]:data-[checked=true]:bg-transparent data-[hover=true]:data-[checked=true]:border-primary-700 data-[hover=true]:data-[invalid=true]:border-error-700 data-[hover=true]:data-[disabled=true]:opacity-40 data-[hover=true]:data-[disabled=true]:border-outline-400 data-[hover=true]:data-[disabled=true]:data-[invalid=true]:border-error-400 data-[active=true]:bg-transparent data-[active=true]:border-primary-800 data-[invalid=true]:border-error-700 data-[disabled=true]:opacity-40 data-[disabled=true]:data-[checked=true]:border-outline-400 data-[disabled=true]:data-[checked=true]:bg-transparent data-[disabled=true]:data-[invalid=true]:border-error-400",
	parentVariants: {
		size: {
			sm: "h-4 w-4",
			md: "h-5 w-5",
			lg: "h-6 w-6",
		},
	},
});

const radioLabelStyle = tva({
	base: "text-typography-600 data-[checked=true]:text-typography-900 data-[hover=true]:text-typography-900 data-[hover=true]:data-[disabled=true]:text-typography-600 data-[hover=true]:data-[disabled=true]:data-[checked=true]:text-typography-900 data-[active=true]:text-typography-900 data-[active=true]:data-[checked=true]:text-typography-900 data-[disabled=true]:opacity-40",
	parentVariants: {
		size: {
			"2xs": "text-2xs",
			xs: "text-xs",
			sm: "text-sm",
			md: "text-base",
			lg: "text-lg",
			xl: "text-xl",
			"2xl": "text-2xl",
			"3xl": "text-3xl",
			"4xl": "text-4xl",
			"5xl": "text-5xl",
			"6xl": "text-6xl",
		},
	},
});

type RadioProps = Prettify<
	SafeOmit<React.ComponentProps<typeof UIRadio>, "context"> &
		VariantProps<typeof radioStyle>
>;

const Radio: React.FC<RadioProps> = ({ className, size = "md", ...props }) => {
	return (
		<UIRadio
			{...props}
			className={radioStyle({ class: className, size })}
			context={{ size }}
		/>
	);
};

type RadioGroupProps = Prettify<
	React.ComponentProps<typeof UIRadio.Group> &
		VariantProps<typeof radioGroupStyle>
>;

const RadioGroup: React.FC<RadioGroupProps> = ({ className, ...props }) => {
	return (
		<UIRadio.Group
			{...props}
			className={radioGroupStyle({ class: className })}
		/>
	);
};

type RadioIndicatorProps = Prettify<
	React.ComponentProps<typeof UIRadio.Indicator> &
		VariantProps<typeof radioIndicatorStyle>
>;

const RadioIndicator: React.FC<RadioIndicatorProps> = ({
	className,
	...props
}) => {
	const { size } = useStyleContext(SCOPE) as VariantProps<
		typeof radioIndicatorStyle
	>;

	return (
		<UIRadio.Indicator
			{...props}
			className={radioIndicatorStyle({
				parentVariants: { size },
				class: className,
			})}
		/>
	);
};

type RadioLabelProps = Prettify<
	React.ComponentProps<typeof UIRadio.Label> &
		VariantProps<typeof radioIndicatorStyle>
>;

const RadioLabel: React.FC<RadioLabelProps> = ({ className, ...props }) => {
	const { size } = useStyleContext(SCOPE) as VariantProps<
		typeof radioLabelStyle
	>;

	return (
		<UIRadio.Label
			{...props}
			className={radioLabelStyle({
				parentVariants: { size },
				class: className,
			})}
		/>
	);
};

type BaseRadioIconProps = React.ComponentProps<typeof UIRadio.Icon> &
	VariantProps<typeof radioIconStyle> & {
		height?: number;
		width?: number;
	};
type RadioIconProps = Prettify<
	| BaseRadioIconProps
	| (SafeOmit<BaseRadioIconProps, "size"> & { size?: number })
>;

const RadioIcon: React.FC<RadioIconProps> = ({ className, size, ...props }) => {
	const { size: parentSize } = useStyleContext(SCOPE) as VariantProps<
		typeof radioIconStyle
	>;

	if (typeof size === "number") {
		return (
			<UIRadio.Icon
				{...props}
				className={radioIconStyle({ class: className })}
				size={size}
			/>
		);
	} else if (
		(props.height !== undefined || props.width !== undefined) &&
		size === undefined
	) {
		return (
			<UIRadio.Icon
				{...props}
				className={radioIconStyle({ class: className })}
			/>
		);
	}

	return (
		<UIRadio.Icon
			{...props}
			className={radioIconStyle({
				parentVariants: {
					size: parentSize,
				},
				size,
				class: className,
			})}
		/>
	);
};

export { Radio, RadioGroup, RadioIcon, RadioIndicator, RadioLabel };

export type {
	RadioProps,
	RadioGroupProps,
	RadioIconProps,
	RadioIndicatorProps,
	RadioLabelProps,
};
