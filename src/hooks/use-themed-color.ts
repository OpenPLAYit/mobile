/** @format */

import {
	darkThemeMap,
	lightThemeMap,
	type ThemeColorKey,
	type ColorValue,
	type ColorKey,
} from "@/components/ui/gluestack-ui-provider/config";
import { useAppColorScheme } from "./use-color-scheme";
import React from "react";

interface RGBA {
	r: number;
	g: number;
	b: number;
	/**0-100 opacity */
	a?: number;
}

const rgbToHex = ({ r, g, b, a }: RGBA) => {
	const HEX_RADIX = 16;
	const HEX_PREFIX = "#";
	const toHex = (c: number) => {
		const hex = Math.round(c).toString(HEX_RADIX);
		return hex.length === 1 ? `0${hex}` : hex;
	};

	let hexColor = `${HEX_PREFIX}${toHex(r)}${toHex(g)}${toHex(b)}` as const;

	if (a) {
		if (a < 0 || a > 100) {
			throw new Error(
				`[rgbToHex]: Alpha "a" must be a value between 0 and 100. Instead got: "${a}".`
			);
		}

		const alpha255 = (a / 100) * 255;
		hexColor = `${hexColor}${toHex(alpha255)}`;
	}
	return hexColor;
};

type StripColorPrefix<T extends ColorKey> =
	T extends `--color-${infer Catergory}-${infer Shade}`
		? `${Catergory}-${Shade}`
		: never;

type ThemedColorName = StripColorPrefix<ThemeColorKey>;

type TailwindOpacity =
	| 0
	| 5
	| 10
	| 20
	| 25
	| 30
	| 40
	| 50
	| 60
	| 70
	| 75
	| 80
	| 90
	| 95
	| 100;

const OPACITY_SEPERATOR = "/";

type ThemedColorNameWithOpacity =
	`${ThemedColorName}${typeof OPACITY_SEPERATOR}${TailwindOpacity}`;

/**
 * Represents a themed color name, optionally including a Tailwind CSS opacity value.
 * Examples: "primary-500", "primary-500/50"
 */
type ThemedColorReference = ThemedColorName | ThemedColorNameWithOpacity;

type RGBArray<T extends ColorValue = ColorValue> =
	T extends `${infer R extends number} ${infer G extends number} ${infer B extends number}`
		? [R, G, B]
		: never;

const isValidRGBArray = (array: unknown): array is RGBArray =>
	Array.isArray(array) &&
	array.length === 3 &&
	array.every((val) => typeof val === "number");

const useThemedColor = () => {
	const { colorScheme } = useAppColorScheme();

	const colorConfig = colorScheme === "dark" ? darkThemeMap : lightThemeMap;

	const getHexColor = React.useCallback(
		(colorRef: ThemedColorReference): string => {
			const parts = colorRef.split(OPACITY_SEPERATOR);

			const colorName = parts[0] as ThemedColorName;
			const opacity =
				parts.length > 1 && typeof parts[1] === "string"
					? parseFloat(parts[1])
					: undefined;

			const colorKey = `--color-${colorName}` satisfies ThemeColorKey;
			const COLOR_VALUE_SEPERATOR = " ";
			const rgbArray = colorConfig[colorKey]
				.split(COLOR_VALUE_SEPERATOR)
				.map(parseFloat);

			if (!isValidRGBArray(rgbArray)) {
				throw new Error(
					`Unable to parse RGB values from specified colorName: "${colorName}"`
				);
			}

			const [r, g, b] = rgbArray;
			return rgbToHex({ r, g, b, a: opacity });
		},
		[colorConfig]
	);

	return { getHexColor };
};

export { useThemedColor };
export type {
	ThemedColorName,
	ThemedColorNameWithOpacity,
	ThemedColorReference,
};
