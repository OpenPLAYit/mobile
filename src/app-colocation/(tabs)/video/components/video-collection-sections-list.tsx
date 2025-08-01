/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";

import { VIDEO_GAP } from "@/app-colocation/(tabs)/video/constants";
import { type UseUserVideosReturn } from "@/app-colocation/(tabs)/video/hooks/use-user-videos";
import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator, FlatList, type ListRenderItem } from "react-native";
import type { DatedVideoCollection } from "../hooks/use-user-videos/types";
import type { VideoAsset } from "../types";
import { VideoMediaThumbnail } from "./video-thumbnail";

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

type FlattenedListItem =
	| {
			type: "heading";
			value: Pick<DatedVideoCollection, "month" | "year">;
	  }
	| {
			type: "separator";
			value: null;
	  }
	| {
			type: "video";
			value: VideoAsset;
	  };

const flattenCollectionsList = (list: DatedVideoCollection[]) => {
	const flatArr: FlattenedListItem[] = [];

	list.forEach(({ month, year, videos }) => {
		flatArr.push({
			type: "heading",
			value: { month, year },
		});
		flatArr.push({
			type: "separator",
			value: null,
		});
		videos.forEach((video) => {
			flatArr.push({
				type: "video",
				value: video,
			});
		});

		const isNumOfVideosOdd = videos.length % 2 !== 0;
		if (isNumOfVideosOdd) {
			flatArr.push({
				type: "separator",
				value: null,
			});
		}
	});

	return flatArr;
};

const renderItem: ListRenderItem<FlattenedListItem> = ({ item, index }) => {
	const { type, value } = item;
	switch (type) {
		case "heading":
			return (
				<Heading size="xs" className="mt-4 h-10 !text-2xs capitalize">
					{value.month.slice(0, 3)}, {value.year}
				</Heading>
			);

		case "separator":
			return null;

		case "video":
			return (
				<VideoMediaThumbnail
					video={value}
					style={{
						marginRight: index % 2 === 0 ? VIDEO_GAP : 0,
						marginBottom: VIDEO_GAP,
					}}
				/>
			);
	}
};

const VideoCollectionSectionsList_: React.FC<
	VideoCollectionSectionsListProps
> = ({ collectionsList, isFetchingMore, hasNextPage, fetchMore }) => {
	const flattenedList = React.useMemo(
		() => flattenCollectionsList(collectionsList),
		[collectionsList],
	);

	return (
		<FlatList
			data={flattenedList}
			renderItem={renderItem}
			numColumns={2}
			removeClippedSubviews
			maxToRenderPerBatch={20}
			updateCellsBatchingPeriod={100}
			windowSize={200}
			keyExtractor={({ type, value }, index) => {
				switch (type) {
					case "heading":
						return value.month + value.year;

					case "separator":
						return "seperator" + index;

					case "video":
						return value.id;
				}
			}}
			onEndReachedThreshold={0.2}
			onEndReached={() => {
				if (isFetchingMore || !hasNextPage) {
					return;
				}
				void fetchMore();
			}}
			showsVerticalScrollIndicator={false}
			ListFooterComponent={
				<FetchingMoreIndicator isFetchingMore={!!isFetchingMore} />
			}
		/>
	);
};

export const VideoCollectionSectionsList = React.memo(
	VideoCollectionSectionsList_,
) as typeof VideoCollectionSectionsList_;
