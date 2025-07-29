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

export interface DatedVideoCollection {
	month: MonthName;
	year: Year;
	/**
	 * An array of video assets belonging to this specific collection.
	 */
	videos: VideoSource[];
}

/**
 * State when the initial fetch of user media videos is in progress.
 */
interface InitialLoadingState {
	isInitialLoading: true;
	videoCollections?: never;
	isFetchingMore?: never;
	endCursor?: never;
	hasNextPage?: never;
	error?: never;
}

/**
 * State when an error occurred during the initial fetch of user media videos.
 */
interface InitialErrorState {
	isInitialLoading: false;
	error: Error;
	videoCollections?: never;
	isFetchingMore?: never;
	endCursor?: never;
	hasNextPage?: never;
}

/**
 * State when user media videos are loaded, no active fetch is in progress,
 * and there are more pages of videos to fetch.
 */
interface LoadedIdleHasNextPageState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string;
	hasNextPage: true;
	error?: never;
}

/**
 * State when user media videos are loaded, no active fetch is in progress,
 * and there are no more pages of videos to fetch.
 */
interface LoadedIdleNoNextPageState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string | null; // 'string | null' to allow API's actual return when hasNextPage is false
	hasNextPage: false;
	error?: never;
}

/**
 * State when user media videos are loaded and no active fetch is in progress.
 */
type LoadedIdleState = LoadedIdleHasNextPageState | LoadedIdleNoNextPageState;

/**
 * State when user media videos are loaded and a new batch is being fetched.
 */
interface LoadedFetchingMoreState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: true;
	endCursor: string;
	hasNextPage: true;
	error?: never;
}

/**
 * State when a subsequent fetch for more user media videos failed.
 */
interface SubsequentErrorState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string | null;
	hasNextPage: boolean;
	error: Error;
}

type UserMediaVideosState =
	| InitialLoadingState
	| InitialErrorState
	| LoadedIdleState
	| LoadedFetchingMoreState
	| SubsequentErrorState;

export type UseUserMediaVideosReturn = UserMediaVideosState & {
	permissionResponse: MediaLibrary.PermissionResponse | null;
	requestPermission: () => Promise<MediaLibrary.PermissionResponse>;
	fetchMore: () => Promise<void>;
};

type UserMediaVideosAction =
	| { type: "INITIAL_FETCH_START" }
	| {
			type: "INITIAL_FETCH_SUCCESS_HAS_NEXT";
			payload: Pick<
				LoadedIdleHasNextPageState,
				"videoCollections" | "endCursor" | "hasNextPage"
			>;
	  }
	| {
			type: "INITIAL_FETCH_SUCCESS_NO_NEXT";
			payload: Pick<
				LoadedIdleNoNextPageState,
				"videoCollections" | "endCursor" | "hasNextPage"
			>;
	  }
	| {
			type: "INITIAL_FETCH_FAILURE";
			payload: Pick<InitialErrorState, "error">;
	  }
	| { type: "FETCH_MORE_REQUEST" }
	| {
			type: "FETCH_MORE_SUCCESS_HAS_NEXT";
			payload: Pick<
				LoadedIdleHasNextPageState,
				"endCursor" | "hasNextPage"
			> & {
				newAssets: MediaLibrary.Asset[];
			};
	  }
	| {
			type: "FETCH_MORE_SUCCESS_NO_NEXT";
			payload: Pick<
				LoadedIdleNoNextPageState,
				"endCursor" | "hasNextPage"
			> & {
				newAssets: MediaLibrary.Asset[];
			};
	  }
	| {
			type: "FETCH_MORE_FAILURE";
			payload: Pick<SubsequentErrorState, "error">;
	  };

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

const createCollectionsFromAssets = (
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

const addAssetsToExistingCollections = ({
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

const canFetchMore = (
	s: UserMediaVideosState,
): s is LoadedIdleHasNextPageState =>
	!!s.hasNextPage &&
	!!s.endCursor &&
	!s.isInitialLoading &&
	!s.isFetchingMore;

const wasFetchingMore = (
	s: UserMediaVideosState,
): s is LoadedFetchingMoreState =>
	!!s.isFetchingMore &&
	!s.isInitialLoading &&
	!!s.videoCollections &&
	!s.error;

const userMediaVideosReducer = (
	state: UserMediaVideosState,
	action: UserMediaVideosAction,
): UserMediaVideosState => {
	switch (action.type) {
		case "INITIAL_FETCH_START":
			return { isInitialLoading: true } satisfies InitialLoadingState;

		case "INITIAL_FETCH_SUCCESS_HAS_NEXT":
			return {
				isInitialLoading: false,
				isFetchingMore: false,
				videoCollections: action.payload.videoCollections,
				endCursor: action.payload.endCursor,
				hasNextPage: true,
			} satisfies LoadedIdleHasNextPageState;

		case "INITIAL_FETCH_SUCCESS_NO_NEXT":
			return {
				isInitialLoading: false,
				isFetchingMore: false,
				videoCollections: action.payload.videoCollections,
				endCursor: action.payload.endCursor,
				hasNextPage: false,
			} satisfies LoadedIdleNoNextPageState;

		case "INITIAL_FETCH_FAILURE":
			return {
				isInitialLoading: false,
				error: action.payload.error,
			} satisfies InitialErrorState;

		case "FETCH_MORE_REQUEST":
			if (canFetchMore(state)) {
				return {
					...state,
					isFetchingMore: true,
				};
			}
			console.error(
				`[Reducer] ${action.type}: Not in expected idle state.`,
				state,
			);
			return state;

		case "FETCH_MORE_SUCCESS_HAS_NEXT":
			if (wasFetchingMore(state)) {
				const updatedvideoCollections = addAssetsToExistingCollections({
					existingCollections: state.videoCollections,
					newAssets: action.payload.newAssets,
				});
				return {
					...state,
					isFetchingMore: false,
					videoCollections: updatedvideoCollections,
					endCursor: action.payload.endCursor,
					hasNextPage: true,
				} satisfies LoadedIdleHasNextPageState;
			}
			console.error(
				`[Reducer] ${action.type}: Not in expected fetching state.`,
				state,
			);
			return state;

		case "FETCH_MORE_SUCCESS_NO_NEXT":
			if (wasFetchingMore(state)) {
				const updatedvideoCollections = addAssetsToExistingCollections({
					existingCollections: state.videoCollections,
					newAssets: action.payload.newAssets,
				});
				return {
					...state,
					isFetchingMore: false,
					videoCollections: updatedvideoCollections,
					endCursor: action.payload.endCursor,
					hasNextPage: false,
				} satisfies LoadedIdleNoNextPageState;
			}
			console.error(
				`[Reducer] ${action.type}: Not in expected fetching state.`,
				state,
			);
			return state;

		case "FETCH_MORE_FAILURE":
			if (wasFetchingMore(state)) {
				return {
					...state,
					isFetchingMore: false,
					error: action.payload.error,
				} satisfies SubsequentErrorState;
			}
			console.error(
				`[Reducer] ${action.type}: Not in expected fetching state.`,
				state,
			);
			return state;

		default:
			return state;
	}
};

const normalizeError = (err: unknown): Error =>
	err instanceof Error
		? err
		: new Error(
				typeof err === "string" ? err : "An unknown error occurred.",
			);

export const useUserMediaVideos = (): UseUserMediaVideosReturn => {
	const [state, dispatch] = React.useReducer(userMediaVideosReducer, {
		isInitialLoading: true,
	});

	/**stateRef to always hold the latest state for stable async operations */
	const stateRef = React.useRef(state);
	React.useEffect(() => {
		stateRef.current = state;
	}, [state]);

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
				dispatch({
					type: "INITIAL_FETCH_FAILURE",
					payload: {
						error: new Error(
							"Permission to access media library not granted.",
						),
					},
				});
				return;
			}

			dispatch({ type: "INITIAL_FETCH_START" });
			try {
				const { assets, endCursor, hasNextPage } =
					await MediaLibrary.getAssetsAsync({
						mediaType: MediaLibrary.MediaType.video,
						sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
						first: 50,
					});

				const videoCollections = createCollectionsFromAssets(assets);

				if (hasNextPage) {
					dispatch({
						type: "INITIAL_FETCH_SUCCESS_HAS_NEXT",
						payload: {
							videoCollections,
							endCursor: endCursor,
							hasNextPage: true,
						},
					});
					return;
				}

				dispatch({
					type: "INITIAL_FETCH_SUCCESS_NO_NEXT",
					payload: {
						videoCollections,
						endCursor,
						hasNextPage: false,
					},
				});
			} catch (e) {
				dispatch({
					type: "INITIAL_FETCH_FAILURE",
					payload: { error: normalizeError(e) },
				});
			}
		};

		fetchVideos().catch(console.error);
	}, [permissionResponse, requestPermission]);

	const fetchMore = React.useCallback(async () => {
		const currentState = stateRef.current;

		if (!canFetchMore(currentState)) {
			console.warn(
				"[fetchMore] Cannot fetch more, current state:",
				currentState,
			);
			return;
		}

		dispatch({ type: "FETCH_MORE_REQUEST" });

		try {
			const {
				assets: newlyFetchedAssets,
				endCursor: newEndCursor,
				hasNextPage: newHasNextPage,
			} = await MediaLibrary.getAssetsAsync({
				after: currentState.endCursor,
				first: 50,
				mediaType: MediaLibrary.MediaType.video,
				sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
			});

			if (newHasNextPage) {
				dispatch({
					type: "FETCH_MORE_SUCCESS_HAS_NEXT",
					payload: {
						newAssets: newlyFetchedAssets,
						endCursor: newEndCursor,
						hasNextPage: true,
					},
				});
				return;
			}

			dispatch({
				type: "FETCH_MORE_SUCCESS_NO_NEXT",
				payload: {
					newAssets: newlyFetchedAssets,
					endCursor: newEndCursor,
					hasNextPage: false,
				},
			});
		} catch (e) {
			dispatch({
				type: "FETCH_MORE_FAILURE",
				payload: { error: normalizeError(e) },
			});
		}
	}, []);

	return {
		...state,
		permissionResponse,
		requestPermission,
		fetchMore,
	};
};
