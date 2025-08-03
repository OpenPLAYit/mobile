/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { BRAND_NAME } from "@/constants";
import {
	ArrowDownToLine,
	ArrowUpDown,
	Search,
	Trash,
	Trash2,
} from "lucide-react-native";

import { VideoCollectionSectionsList } from "@/app-colocation/(tabs)/video/components/video-collection-sections-list";
import {
	VideoSortingModal,
	type VideoSortingModalProps,
} from "@/app-colocation/(tabs)/video/components/video-sorting-modal";
import { WINDOW_SCREEN_PADDING } from "@/app-colocation/(tabs)/video/constants";
import { useUserVideos } from "@/app-colocation/(tabs)/video/hooks/use-user-videos";
import { Button, ButtonIcon } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator } from "react-native";

// Extracted comp to avoid rerendering parent when modal opens or closes.
const SortingModal: React.FC<
	Pick<VideoSortingModalProps, "onSortingChange" | "sortingState">
> = ({ onSortingChange, sortingState }) => {
	const [isOpen, setIsOpen] = React.useState(false);

	return (
		<>
			<Button size="icon" variant="ghost" onPress={() => setIsOpen(true)}>
				<ButtonIcon as={ArrowUpDown} />
			</Button>
			<VideoSortingModal
				sortingState={sortingState}
				onSortingChange={onSortingChange}
				open={isOpen}
				onOpenChange={setIsOpen}
			/>
		</>
	);
};

export default function VideoTab() {
	const {
		videoCollections,
		isInitialLoading,
		error,
		isFetchingMore,
		hasNextPage,
		fetchMore,
		changeSorting,
		sortedBy,
	} = useUserVideos();

	return (
		<Box
			className="flex-1 gap-4"
			style={{ padding: WINDOW_SCREEN_PADDING }}>
			{/* top bar */}
			<Box className="mb-4 flex-row items-center justify-between">
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require("@/assets/images/brand/logo-text.png")}
					alt={`${BRAND_NAME} Logo`}
					size="none"
					className="aspect-[881/177] w-56"
				/>

				<Box className="flex-row items-center gap-4">
					{[Trash, Search, ArrowDownToLine].map((icon) => (
						<Icon
							key={icon.name + icon.displayName}
							as={icon}
							size={"xl"}
						/>
					))}
				</Box>
			</Box>

			{/* History section */}
			{isInitialLoading ? (
				<ActivityIndicator />
			) : error ? (
				<Text>{error.message}</Text>
			) : videoCollections.length ? (
				<Box className="flex-1 gap-4">
					<Box className="gap-2">
						<Box className="flex-row items-center justify-between">
							<Heading size="xs">History</Heading>
							<Icon as={Trash2} />
						</Box>

						{/* TODO: Add recently RecentlyWatchedVideos */}
					</Box>

					<Box className="flex-1 gap-2">
						<Box className="flex-row items-center justify-between">
							<Heading size="xs">Video</Heading>

							<Box>
								<SortingModal
									sortingState={sortedBy}
									onSortingChange={changeSorting}
								/>
							</Box>
						</Box>

						<VideoCollectionSectionsList
							collectionsList={videoCollections}
							hasNextPage={hasNextPage}
							isFetchingMore={isFetchingMore}
							fetchMore={fetchMore}
						/>
					</Box>
				</Box>
			) : (
				<Text className="mt-20 text-center text-gray-500">
					No videos found in your library.
				</Text>
			)}
		</Box>
	);
}
