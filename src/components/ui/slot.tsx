/** @format */

import { cn, isObject } from "@/lib/utils";
import React from "react";
import { StyleSheet } from "react-native";

interface PropSlotProps extends Record<string, unknown> {
	children?: React.ReactNode;
}

const checkHasClassNameProp = (
	value: unknown,
): value is { className?: string } => isObject(value) && "className" in value;

/**
 * PropSlot component, similar to Radix UI's Slot.
 * Named PropSlot to avoid conflicts with Expo Router's Slot component.
 */
const PropSlot: React.FC<PropSlotProps> = ({ children, ...slotProps }) => {
	const singleChild = React.Children.only(children);

	if (!React.isValidElement(singleChild)) {
		throw new Error(
			"[Slot]: props.children must be a valid React Element.",
		);
	}

	const childProps = isObject(singleChild.props) ? singleChild.props : {};

	const childStyle =
		"style" in childProps && isObject(childProps.style)
			? childProps.style
			: undefined;
	const childClassName = checkHasClassNameProp(childProps)
		? childProps.className
		: undefined;

	const slotStyle =
		"style" in slotProps && isObject(slotProps.style)
			? slotProps.style
			: undefined;
	const slotClassName = checkHasClassNameProp(slotProps)
		? slotProps.className
		: undefined;

	const mergedStyle = StyleSheet.flatten([
		childStyle, // Child's style (lower precedence)
		slotStyle, // Slot's style (higher precedence)
	]);
	const mergedClassName = cn(childClassName, slotClassName); // order matters

	const mergedProps = {
		...childProps, // Child's props (lower precedence)
		...slotProps, // Slot's props (higher precedence)
		style: mergedStyle,
		className: mergedClassName,
	};

	return React.cloneElement(singleChild, mergedProps);
};

/**
 * Props to enable the 'asChild' pattern for components utilizing
 * {@link PropSlot},
 * allowing component props to be passed directly to its child.
 */
type AsChildProps<TProps> = Prettify<
	| (TProps & { asChild?: false })
	| (TProps & {
			asChild: true;
			children: React.ReactElement;
	  })
>;

/**Extracts the original component props (TProps) from a type that has had
 * the {@link AsChildProps} pattern applied to it. */
type NoAsChildProps<T> = T extends AsChildProps<infer P> ? P : never;

export { PropSlot };
export type { AsChildProps, NoAsChildProps, PropSlotProps };
