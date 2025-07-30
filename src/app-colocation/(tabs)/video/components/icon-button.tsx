/** @format */

import { Icon, type IconProps } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react-native";
import type React from "react";
import { Pressable, type PressableProps } from "react-native";

interface IconButtonProps
	extends SafeOmit<PressableProps, "className" | "style">,
		Pick<IconProps, "size"> {
	iconClassName?: string;
	containerClassName?: string;
	iconStyle?: IconProps["style"];
	containerStyle?: PressableProps["style"];
	as: LucideIcon;
}

export const IconButton: React.FC<IconButtonProps> = ({
	iconClassName,
	containerClassName,
	iconStyle,
	containerStyle,
	as,
	size,
	...props
}) => {
	return (
		<Pressable
			{...props}
			className={cn(
				"group/button rounded-full p-2 active:bg-background-300",
				containerClassName,
			)}
			style={containerStyle}>
			<Icon
				size={size}
				as={as}
				className={cn(
					"text-typography-600 group-active/button:text-typography-950",
					iconClassName,
				)}
				style={iconStyle}
			/>
		</Pressable>
	);
};
