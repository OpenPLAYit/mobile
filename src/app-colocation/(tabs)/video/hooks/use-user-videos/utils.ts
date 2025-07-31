/** @format */

import type { SortingState } from "../../components/video-sorting-modal";
import {
	MONTH_NAMES,
	type DatedVideoCollection,
	type LoadedFetchingMoreState,
	type LoadedIdleHasNextPageState,
	type MonthName,
	type UserVideosState,
	type Year,
} from "./types";
import * as MediaLibrary from "expo-media-library";

type GroupKey = `${MonthName}-${Year}`;

const addAssetToCollectionMap = ({
	collectionMap,
	asset,
}: {
	collectionMap: Map<GroupKey, DatedVideoCollection>;
	asset: MediaLibrary.Asset;
}) => {
	const modificationDate = new Date(asset.modificationTime);
	const year = modificationDate.getFullYear();
	const month = MONTH_NAMES[modificationDate.getMonth()];

	if (!month) {
		throw new Error("Invalid month derived from asset modification date.");
	}

	const groupKey = `${month}-${year}` satisfies GroupKey;

	let collection = collectionMap.get(groupKey);

	if (!collection) {
		collection = {
			month: month,
			year: year,
			videos: [asset],
		};
		collectionMap.set(groupKey, collection);
	} else {
		collection.videos = [...collection.videos, asset];
	}
};

export const createCollectionsFromAssets = (
	assets: MediaLibrary.Asset[],
): DatedVideoCollection[] => {
	const groupedCollectionsMap = new Map<GroupKey, DatedVideoCollection>();

	assets.forEach((asset) => {
		addAssetToCollectionMap({
			collectionMap: groupedCollectionsMap,
			asset,
		});
	});

	return [...groupedCollectionsMap.values()];
};

export const addAssetsToExistingCollections = ({
	existingCollections,
	newAssets,
}: {
	existingCollections: DatedVideoCollection[];
	newAssets: MediaLibrary.Asset[];
}): DatedVideoCollection[] => {
	const collectionMap = new Map<GroupKey, DatedVideoCollection>();
	existingCollections.forEach((collection) => {
		const groupKey =
			`${collection.month}-${collection.year}` satisfies GroupKey;
		collectionMap.set(groupKey, {
			...collection,
			videos: [...collection.videos],
		});
	});

	newAssets.forEach((asset) => {
		addAssetToCollectionMap({ collectionMap, asset });
	});

	return [...collectionMap.values()];
};

export const canFetchMore = (
	s: UserVideosState,
): s is LoadedIdleHasNextPageState =>
	!!s.hasNextPage &&
	!!s.endCursor &&
	!s.isInitialLoading &&
	!s.isFetchingMore;

export const wasFetchingMore = (
	s: UserVideosState,
): s is LoadedFetchingMoreState =>
	!!s.isFetchingMore &&
	!s.isInitialLoading &&
	!!s.videoCollections &&
	!s.error;

export const normalizeError = (err: unknown): Error =>
	err instanceof Error
		? err
		: new Error(
				typeof err === "string" ? err : "An unknown error occurred.",
			);

interface GetVideoAssetsOptions {
	sortedBy: SortingState;
	afterCursor: string | null;
}
export const getVideoAssets = ({
	sortedBy,
	afterCursor,
}: GetVideoAssetsOptions) => {
	// TODO: Add support for name and size
	let sorting: [
		SafeExtract<MediaLibrary.SortByValue, "modificationTime" | "duration">,
		boolean,
	];

	const isAscending = sortedBy.selected === "ascending";

	switch (sortedBy.key) {
		case "duration":
			sorting = [MediaLibrary.SortBy.duration, isAscending];
			break;

		case "date":
		default:
			sorting = [MediaLibrary.SortBy.modificationTime, isAscending];
			break;
	}

	const assetsOptions = {
		after: afterCursor ?? undefined,
		first: 50,
		mediaType: MediaLibrary.MediaType.video,
		sortBy: [sorting], // must be nested in an array to work
	} satisfies MediaLibrary.AssetsOptions;

	return MediaLibrary.getAssetsAsync(assetsOptions);
};
