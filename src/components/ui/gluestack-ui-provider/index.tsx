/** @format */

import { useAppColorScheme } from "@/hooks/use-color-scheme";
import { OverlayProvider } from "@gluestack-ui/overlay";
import React from "react";
import { View, type ViewProps } from "react-native";
import { config } from "./config";
import { type ModeType } from "./types";

export function GluestackUIProvider({
	mode = "light",
	...props
}: {
	mode?: ModeType;
	children?: React.ReactNode;
	style?: ViewProps["style"];
}) {
	const { colorScheme, setColorScheme } = useAppColorScheme();

	React.useEffect(() => {
		setColorScheme(mode);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [mode]);

	return (
		<View
			style={[
				config[colorScheme],
				{ flex: 1, height: "100%", width: "100%" },
				props.style,
			]}>
			<OverlayProvider>{props.children}</OverlayProvider>
		</View>
	);
}
