/** @format */

import * as MediaLibrary from "expo-media-library";
import { type VideoSource } from "expo-video";
import React from "react";

const MONTH_NAMES = [
	"january",
	"february",
	"march",
	"april",
	"may",
	"june",
	"july",
	"august",
	"september",
	"october",
	"november",
	"december",
] as const;

type MonthName = (typeof MONTH_NAMES)[number];
type Year = number;

interface DatedVideoCollection {
	month: MonthName;
	year: Year;
	/**
	 * An array of video assets belonging to this specific collection.
	 */
	videos: VideoSource[];
}

type UserMediaVideosState =
	// Initial loading state: The very first batch of videos is being fetched.
	| {
			/**
			 * Indicates that the initial fetch of videos is in progress.
			 */
			isInitialLoading: true;
			videoCollection?: never;
			isFetchingMore?: never;
			endCursor?: never;
			hasNextPage?: never;
			error?: never;
	  }
	// Error state during initial fetch: No videos could be loaded initially.
	| {
			/**
			 * Indicates that the initial fetch has completed.
			 */
			isInitialLoading: false;
			/**
			 * An error object if the initial fetch failed.
			 */
			error: Error;
			videoCollection?: never;
			isFetchingMore?: never;
			endCursor?: never;
			hasNextPage?: never;
	  }
	// Data loaded state: Videos are available, and potentially more can be fetched.
	| {
			/**
			 * Indicates that the initial fetch has completed.
			 */
			isInitialLoading: false;
			videoCollection: DatedVideoCollection[];
			isFetchingMore: boolean;
			/**
			 * The cursor to use for fetching the next batch of videos, or `null` if no cursor exists yet.
			 */
			endCursor: string | null;
			hasNextPage: boolean;
			error?: never;
	  }
	// Error during subsequent fetch: Existing videos are still available, but fetching more failed.
	| {
			/**
			 * Indicates that the initial fetch has completed.
			 */
			isInitialLoading: false;
			videoCollection: DatedVideoCollection[];
			isFetchingMore: false;
			/**
			 * The cursor to use for potentially retrying the next batch, or `null`.
			 */
			endCursor: string | null;
			hasNextPage: boolean;
			/**
			 * An error object if a subsequent fetch for more videos failed.
			 */
			error: Error;
	  };

type UseUserMediaVideosReturn = UserMediaVideosState & {
	permissionResponse: MediaLibrary.PermissionResponse | null;
	requestPermission: () => Promise<MediaLibrary.PermissionResponse>;
};

export const useUserMediaVideos = (): UseUserMediaVideosReturn => {
	const [state, setState] = React.useState<UserMediaVideosState>({
		isInitialLoading: true,
	});

	const [permissionResponse, requestPermission] =
		MediaLibrary.usePermissions();

	React.useEffect(() => {
		const fetchVideos = async () => {
			let { status } = permissionResponse || {};
			if (status !== MediaLibrary.PermissionStatus.GRANTED) {
				const permissionResult = await requestPermission();
				status = permissionResult.status;
			}

			if (status !== MediaLibrary.PermissionStatus.GRANTED) {
				setState({
					error: new Error(
						"Permission to access media library not granted.",
					),
					isInitialLoading: false,
				});
				return;
			}

			try {
				// --- Initial getAssetsAsync Call ---
				const { assets, endCursor, hasNextPage } =
					await MediaLibrary.getAssetsAsync({
						mediaType: MediaLibrary.MediaType.video,
						sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
						first: 50,
					});

				// Process and group raw assets into DatedVideoCollection
				type GroupKey = `${MonthName}-${Year}`;
				const groupedCollectionsMap = new Map<
					GroupKey,
					DatedVideoCollection
				>();

				assets.forEach((asset) => {
					const modificationDate = new Date(asset.modificationTime);
					const year = modificationDate.getFullYear();
					const month = MONTH_NAMES[modificationDate.getMonth()];
					if (!month) {
						throw new Error(
							"invalid month from modification date.",
						);
					}

					const groupKey = `${month}-${year}` satisfies GroupKey;

					let collection = groupedCollectionsMap.get(groupKey);

					if (!collection) {
						collection = {
							month: month,
							year: year,
							videos: [],
						};
						groupedCollectionsMap.set(groupKey, collection);
					}
					collection.videos = [...collection.videos, asset];
				});

				// --- Convert to final videoCollection from map ---
				// TODO: Might require sorting later on.
				const videoCollection = [
					...groupedCollectionsMap.values(),
				] satisfies DatedVideoCollection[];

				// Update State with Initial Data and Pagination Info
				setState({
					isInitialLoading: false,
					videoCollection,
					isFetchingMore: false,
					endCursor,
					hasNextPage,
				});
			} catch (e) {
				const error: Error =
					e instanceof Error
						? e
						: new Error("An unknown error occurred.");
				setState({
					error,
					isInitialLoading: false,
				});
			}
		};

		fetchVideos().catch(console.error);
	}, [permissionResponse, requestPermission]);

	return {
		...state,
		permissionResponse,
		requestPermission,
	};
};
