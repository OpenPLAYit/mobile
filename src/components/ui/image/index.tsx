/** @format */

import React from "react";
import { createImage } from "@gluestack-ui/image";
import { Image as EXImage } from "expo-image";
import { tva } from "@gluestack-ui/nativewind-utils/tva";
import type { VariantProps } from "@gluestack-ui/nativewind-utils";
import { cssInterop } from "react-native-css-interop";

cssInterop(EXImage, {
	className: "style",
});

const imageStyle = tva({
	base: "max-w-full",
	variants: {
		size: {
			"2xs": "h-6 w-6",
			xs: "h-10 w-10",
			sm: "h-16 w-16",
			md: "h-20 w-20",
			lg: "h-24 w-24",
			xl: "h-32 w-32",
			"2xl": "h-64 w-64",
			full: "h-full w-full",
			none: "",
		},
	},
});

const UIImage = createImage({ Root: EXImage });

type ImageProps = Prettify<
	VariantProps<typeof imageStyle> &
		RequireKeys<React.ComponentProps<typeof UIImage>, "alt"> & {
			ref?: React.Ref<EXImage>;
		}
>;

const Image: React.FC<ImageProps> = ({ size = "md", className, ...props }) => {
	return (
		<UIImage
			{...props}
			className={imageStyle({ size, class: className })}
		/>
	);
};

export { Image };
export type { ImageProps };
