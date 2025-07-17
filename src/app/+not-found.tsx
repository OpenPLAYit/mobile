/** @format */

import { Link, Stack } from "expo-router";

import { Box } from "@/src/components/ui/box";
import { Text } from "@/src/components/ui/text";

export default function NotFoundScreen() {
	return (
		<>
			<Stack.Screen options={{ title: "Oops!" }} />
			<Box className="flex-1 items-center justify-center">
				<Text className="text-secondary-200">
					This screen doesn't exist.
				</Text>

				<Link href="/" style={{ marginTop: 10 }}>
					<Text className="text-primary-500">Go to home screen!</Text>
				</Link>
			</Box>
		</>
	);
}
