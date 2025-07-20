/** @format */

import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import React from "react";
import { Text } from "react-native";
import { PropSlot, type AsChildProps } from "../slot";
import { headingStyle } from "./styles";

type BaseHeadingProps = Prettify<
	React.ComponentPropsWithRef<typeof Text> & VariantProps<typeof headingStyle>
>;

type HeadingProps = AsChildProps<BaseHeadingProps>;

const HeadingSlot = PropSlot as React.FC<BaseHeadingProps>;

const Heading: React.FC<HeadingProps> = ({
	className,
	size = "lg",
	asChild,
	...props
}) => {
	const AsComp = asChild ? HeadingSlot : Text;

	const {
		isTruncated,
		bold,
		underline,
		strikeThrough,
		sub,
		italic,
		highlight,
	} = props;
	return (
		<AsComp
			{...props}
			className={headingStyle({
				size,
				isTruncated,
				bold,
				underline,
				strikeThrough,
				sub,
				italic,
				highlight,
				class: className,
			})}
		/>
	);
};

export { Heading, HeadingSlot };
export type { HeadingProps };
