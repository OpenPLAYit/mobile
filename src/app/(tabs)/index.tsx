/** @format */

import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { BRAND_NAME } from "@/constants";
import { ArrowDownToLine, Search, Trash } from "lucide-react-native";

export default function VideoTab() {
	return (
		<Box className="flex-1 p-4">
			{/* top bar */}
			<Box className="flex-row items-center justify-between">
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require("@/assets/images/brand/logo-text.png")}
					alt={`${BRAND_NAME} Logo`}
					size="none"
					className="aspect-[881/177] w-48"
				/>

				<Box className="flex-row items-center gap-4">
					{[Trash, Search, ArrowDownToLine].map((icon, index) => (
						<Icon key={index} as={icon} size={"xl"} />
					))}
				</Box>
			</Box>
		</Box>
	);
}
