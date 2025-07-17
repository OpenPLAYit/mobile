/** @format */

import { Box } from "@/components/ui/box";
import { GluestackUIProvider } from "@/components/ui/gluestack-ui-provider";
import {
	Inter_400Regular,
	Inter_500Medium,
	Inter_600SemiBold,
	Inter_700Bold,
	useFonts,
} from "@expo-google-fonts/inter";
import {
	DarkTheme,
	DefaultTheme,
	ThemeProvider,
} from "@react-navigation/native";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React from "react";
import { StatusBar } from "react-native";
import {
	SafeAreaView,
	useSafeAreaInsets,
} from "react-native-safe-area-context";

import { useSystemColorScheme } from "@/hooks/use-color-scheme";
import { useThemedColor } from "@/hooks/use-themed-color";
import "../../global.css";

export {
	// Catch any errors thrown by the Layout component.
	ErrorBoundary,
} from "expo-router";

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "gluestack",
// };

// Prevent the splash screen from auto-hiding before asset loading is complete.
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [loaded, error] = useFonts({
		Inter_400Regular,
		Inter_500Medium,
		Inter_600SemiBold,
		Inter_700Bold,
	});

	// Expo Router uses Error Boundaries to catch errors in the navigation tree.
	React.useEffect(() => {
		if (error) throw error;
	}, [error]);
	React.useEffect(() => {
		if (loaded) {
			void SplashScreen.hideAsync();
		}
	}, [loaded]);

	return <RootLayoutNav />;
}

const SYSTEM_BARS_BG_COLOR = "background-900";

const NavigationBarBackground = () => {
	const insets = useSafeAreaInsets();
	const navigationBarHeight = insets.bottom;
	const { getHexColor } = useThemedColor();

	return (
		<Box
			style={{
				height: navigationBarHeight,
				backgroundColor: getHexColor(SYSTEM_BARS_BG_COLOR),
			}}
		/>
	);
};

function RootLayoutNav() {
	const colorScheme = useSystemColorScheme();
	const isDarkMode = colorScheme === "dark";
	const { getHexColor } = useThemedColor();
	return (
		<GluestackUIProvider mode={colorScheme}>
			<ThemeProvider value={isDarkMode ? DarkTheme : DefaultTheme}>
				<SafeAreaView
					edges={["top", "left", "right"]}
					className="flex-1 bg-background-500">
					{/* Didn't use Expo StatusBar cause it just won't work */}
					<StatusBar
						animated
						barStyle={isDarkMode ? "light-content" : "dark-content"}
						backgroundColor={getHexColor(SYSTEM_BARS_BG_COLOR)}
					/>

					<Slot />

					<NavigationBarBackground />
				</SafeAreaView>
			</ThemeProvider>
		</GluestackUIProvider>
	);
}
