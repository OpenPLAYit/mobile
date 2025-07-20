/** @format */

import { Icon } from "@/components/ui/icon";
import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import { Stack, Tabs } from "expo-router";
import { Music, User, Video, type LucideIcon } from "lucide-react-native";
import { cssInterop } from "nativewind";
import React from "react";
import type { ViewStyle } from "react-native";

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

export default function TabLayout() {
	return (
		<>
			<Stack.Screen options={{ headerShown: false }} />
			<CustomTabs
				tabBarActiveTintColor="text-green-500"
				tabBarInactiveTintColor="text-stone-400"
				tabBarClassName="border-t-[0.5px] border-stone-800 h-16 overflow-hidden py-0 bg-black">
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
		</>
	);
}
