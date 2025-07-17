/** @format */
import {
	useColorScheme as useRNColorScheme,
	type ColorSchemeName,
} from "react-native";
import { useColorScheme as useNWColorScheme } from "nativewind";

/**
 * Hook to get the device's current system color scheme preference.
 * This is a direct wrapper around React Native's useColorScheme.
 */
const useSystemColorScheme = () => {
	const colorScheme = useRNColorScheme();

	return (colorScheme ?? "dark") satisfies ColorSchemeName;
};

/**
 * Hook to get and set the application's active color scheme.
 * This is a direct wrapper around Nativewind's useColorScheme,
 * which supports user overrides and persistence.
 */
const useAppColorScheme = () => {
	const colorSchemeControl = useNWColorScheme();
	return {
		...colorSchemeControl,
		colorScheme: colorSchemeControl.colorScheme ?? "dark",
	} satisfies typeof colorSchemeControl;
};

export { useSystemColorScheme, useAppColorScheme };
