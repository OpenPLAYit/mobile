/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";

import { VideoMediaPlayer } from "@/app-colocation/(tabs)/video/components/video-media-player";
import { VIDEO_GAP } from "@/app-colocation/(tabs)/video/constants";
import { type UseUserVideosReturn } from "@/app-colocation/(tabs)/video/hooks/use-user-videos";
import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator, FlatList } from "react-native";
import type { DatedVideoCollection } from "../hooks/use-user-videos/types";

interface VideoCollectionSectionProps {
	collection: DatedVideoCollection;
}
const VideoCollectionSection_: React.FC<VideoCollectionSectionProps> = ({
	collection,
}) => {
	return (
		<Box className="mb-2 gap-2">
			<Heading size="xs" className="!text-2xs capitalize">
				{collection.month.slice(0, 3)}, {collection.year}
			</Heading>

			<FlatList
				data={collection.videos}
				keyExtractor={(item) => item.id}
				renderItem={({ item, index: videoIndex }) => {
					return (
						<VideoMediaPlayer
							source={item}
							style={{
								marginRight:
									videoIndex % 2 === 0 ? VIDEO_GAP : 0,
								marginBottom: VIDEO_GAP,
							}}
						/>
					);
				}}
				numColumns={2}
			/>
		</Box>
	);
};

const VideoCollectionSection = React.memo(
	VideoCollectionSection_,
) as typeof VideoCollectionSection_;

interface VideoCollectionSectionsListProps
	extends Pick<
		UseUserVideosReturn,
		"hasNextPage" | "isFetchingMore" | "fetchMore"
	> {
	collectionsList: DatedVideoCollection[];
}

const FetchingMoreIndicator: React.FC<{ isFetchingMore: boolean }> = ({
	isFetchingMore,
}) => {
	if (!isFetchingMore) {
		return null;
	}

	return (
		<Box className="items-center justify-center">
			<ActivityIndicator />
			<Text>Loading more videos</Text>
		</Box>
	);
};

const VideoCollectionSectionsList_: React.FC<
	VideoCollectionSectionsListProps
> = ({ collectionsList, isFetchingMore, hasNextPage, fetchMore }) => {
	return (
		<FlatList
			data={collectionsList}
			keyExtractor={({ month, year }, index) => month + year + index}
			onEndReachedThreshold={0.5}
			onEndReached={() => {
				if (isFetchingMore || !hasNextPage) {
					return;
				}
				void fetchMore();
			}}
			showsVerticalScrollIndicator={false}
			renderItem={({ item }) => (
				<VideoCollectionSection collection={item} />
			)}
			ListFooterComponent={
				<FetchingMoreIndicator isFetchingMore={!!isFetchingMore} />
			}
		/>
	);
};

export const VideoCollectionSectionsList = React.memo(
	VideoCollectionSectionsList_,
) as typeof VideoCollectionSectionsList_;
