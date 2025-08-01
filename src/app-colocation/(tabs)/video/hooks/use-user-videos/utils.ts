/** @format */

import type { SortingState } from "../../components/video-sorting-modal";
import {
	MONTH_NAMES,
	type DatedVideoCollection,
	type LoadedFetchingMoreState,
	type LoadedIdleHasNextPageState,
	type MonthName,
	type UserVideosState,
	type VideoAsset,
	type Year,
} from "./types";
import * as MediaLibrary from "expo-media-library";

type GroupKey = `${MonthName}-${Year}`;

const addAssetToCollectionMap = ({
	collectionMap,
	asset,
}: {
	collectionMap: Map<GroupKey, DatedVideoCollection>;
	asset: VideoAsset;
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
	assets: VideoAsset[],
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
	newAssets: VideoAsset[];
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

type EXSupportedSortKey = AssertSubtype<
	SortingState["key"],
	"date" | "duration"
>;

type EXSupportedSortingState = AssertSubtype<
	SortingState,
	{
		key: EXSupportedSortKey;
		selected: SortingState["selected"];
	}
>;

const EXSUPPORTED_SORTING_KEYS = [
	"date",
	"duration",
] satisfies EXSupportedSortKey[];

export const isEXSupportedSorting = (
	sorting: SortingState,
): sorting is EXSupportedSortingState =>
	EXSUPPORTED_SORTING_KEYS.some((key) => key === sorting.key);

interface GetVideoAssetsOptions {
	/**Only date and duration sorting is supported internally. */
	sortedBy: EXSupportedSortingState;
	afterCursor: string | null;
}
export const getVideoAssets = async ({
	sortedBy,
	afterCursor,
}: GetVideoAssetsOptions) => {
	// NOTE: Support for name and size sorting is handled externally.
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
		first: 200,
		mediaType: MediaLibrary.MediaType.video,
		sortBy: [sorting], // must be nested in an array to work
	} satisfies MediaLibrary.AssetsOptions;

	const assetsResult = await MediaLibrary.getAssetsAsync(assetsOptions);

	return assetsResult as MediaLibrary.PagedInfo<VideoAsset>;
};
