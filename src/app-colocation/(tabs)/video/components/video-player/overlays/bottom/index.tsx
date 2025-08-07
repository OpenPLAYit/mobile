/** @format */

import { SafeAreaView } from "react-native-safe-area-context";
import { DurationProgress } from "./duration-progress";
import { ControlsBar } from "./controls-bar";

export const BottomOverlay = () => {
	return (
		<SafeAreaView
			edges={["bottom", "left", "right"]}
			className="absolute bottom-0 left-0 right-0 gap-4 px-4">
			<DurationProgress />

			<ControlsBar />
		</SafeAreaView>
	);
};
