/** @format */

import {
	useVideoPlayback,
	VideoPlaybackProvider,
} from "@/app-colocation/(tabs)/contexts/video-playback";
import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { PortalHost } from "@/components/ui/portal";
import { VIDEO_FULLSCREEN_PORTAL_HOST } from "@/constants";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Stack, Tabs } from "expo-router";
import { Music, User, Video, type LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import type { ViewStyle } from "react-native";
import {
	useSafeAreaInsets,
	type EdgeInsets,
} from "react-native-safe-area-context";

const tabsMap = [
	{ name: "index", title: "Video", icon: Video },
	{ name: "music", title: "Music", icon: Music },
	{ name: "user", title: "Me", icon: User },
] satisfies {
	name: string;
	title: string;
	icon: LucideIcon;
}[];

interface TabIconProps {
	icon: LucideIcon;
	color: string;
	size: number;
	focused: boolean;
}
const TabIcon: React.FC<TabIconProps> = ({ icon, ...props }) => {
	return <Icon as={icon} {...props} />;
};

type BaseTabProps = Prettify<React.ComponentProps<typeof Tabs>>;
type CustomTabsProps = SafeOmit<BaseTabProps, "screenOptions"> & {
	screenOptions?: SafeOmit<
		BottomTabNavigationOptions,
		"tabBarStyle" | "tabBarActiveTintColor" | "tabBarInactiveTintColor"
	>;
} & {
	tabBarStyle?: ViewStyle;
	tabBarActiveTintColor?: string;
	tabBarInactiveTintColor?: string;
};

const CustomTabs = cssInterop(
	({
		tabBarStyle,
		tabBarActiveTintColor,
		tabBarInactiveTintColor,
		screenOptions,
		...props
	}: CustomTabsProps) => (
		<Tabs
			{...props}
			screenOptions={{
				...screenOptions,
				tabBarStyle,
				tabBarActiveTintColor,
				tabBarInactiveTintColor,
			}}
		/>
	),
	{
		tabBarClassName: "tabBarStyle",
		tabBarActiveTintColor: {
			target: true,
			nativeStyleToProp: {
				color: "tabBarActiveTintColor",
			},
		},
		tabBarInactiveTintColor: {
			target: true,
			nativeStyleToProp: {
				color: "tabBarInactiveTintColor",
			},
		},
	},
);

/**
 * Preserves the previous bottom inset when a video is in fullscreen playback.
 * This prevents UI layout shifts that occur when the navigation bar's
 * visibility changes.
 */
const useVideoAwareSafeAreaInsets = (): EdgeInsets => {
	const insets = useSafeAreaInsets();
	const prevInsetsRef = React.useRef(insets);
	const { isVideoInPlaybackRef } = useVideoPlayback();
	React.useEffect(() => {
		if (isVideoInPlaybackRef.current) return;
		prevInsetsRef.current = insets;
	}, [insets, isVideoInPlaybackRef]);

	if (isVideoInPlaybackRef.current) {
		return {
			...insets,
			bottom: prevInsetsRef.current.bottom,
		};
	}

	return insets;
};

const VideoAwareSafeArea = () => {
	const insets = useVideoAwareSafeAreaInsets();
	return (
		<Box
			style={{
				paddingTop: insets.top,
				paddingLeft: insets.left,
				paddingBottom: insets.bottom,
				paddingRight: insets.right,
			}}
			className="flex-1">
			<CustomTabs
				tabBarActiveTintColor="text-primary-500"
				tabBarInactiveTintColor="text-secondary-800"
				tabBarClassName="border-t-[0.5px] border-outline-200 h-16 overflow-hidden py-0 bg-background-0">
				{tabsMap.map(({ name, title, icon }) => (
					<Tabs.Screen
						key={name}
						name={name}
						options={{
							title,
							headerShown: false,
							tabBarIcon: (props) => (
								<TabIcon icon={icon} {...props} />
							),
						}}
					/>
				))}
			</CustomTabs>
		</Box>
	);
};

export default function TabLayout() {
	return (
		<VideoPlaybackProvider>
			<Stack.Screen options={{ headerShown: false }} />
			<VideoAwareSafeArea />

			<PortalHost name={VIDEO_FULLSCREEN_PORTAL_HOST} />
		</VideoPlaybackProvider>
	);
}
