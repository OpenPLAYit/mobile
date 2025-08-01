/** @format */

import * as MediaLibrary from "expo-media-library";
import React from "react";
import type { SortingState } from "../../components/video-sorting-modal";
import { normalizeError } from "../../utils";
import { userVideosStateReducer } from "./state-reducer";
import { type UserVideosState } from "./types";
import {
	canFetchMore,
	createCollectionsFromAssets,
	getVideoAssets,
} from "./utils";

export type UseUserVideosReturn = UserVideosState & {
	permissionResponse: MediaLibrary.PermissionResponse | null;
	requestPermission: () => Promise<MediaLibrary.PermissionResponse>;
	fetchMore: () => Promise<void>;
	changeSorting: (newSortingState: SortingState) => void;
};

export const useUserVideos = (): UseUserVideosReturn => {
	const [state, dispatch] = React.useReducer(userVideosStateReducer, {
		isInitialLoading: true,
		sortedBy: {
			key: "date",
			selected: "descending",
		},
		videoCollections: null,
		isFetchingMore: false,
		hasNextPage: false,
		endCursor: null,
		error: null,
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
				const { assets, endCursor, hasNextPage } = await getVideoAssets(
					{
						afterCursor: null,
						sortedBy: state.sortedBy,
					},
				);

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
	}, [permissionResponse, requestPermission, state.sortedBy]);

	const fetchMore = React.useCallback(async () => {
		if (!canFetchMore(state)) return;

		dispatch({ type: "FETCH_MORE_REQUEST" });

		try {
			const {
				assets: newlyFetchedAssets,
				endCursor: newEndCursor,
				hasNextPage: newHasNextPage,
			} = await getVideoAssets({
				afterCursor: state.endCursor,
				sortedBy: state.sortedBy,
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
	}, [state]);

	const changeSorting = React.useCallback(
		(newSortingState: SortingState) => {
			const hasSortingChanged =
				newSortingState.key !== state.sortedBy.key ||
				(newSortingState.key === state.sortedBy.key &&
					newSortingState.selected !== state.sortedBy.selected);

			if (hasSortingChanged) {
				dispatch({ type: "CHANGE_SORTING", payload: newSortingState });
			}
		},
		[state.sortedBy.key, state.sortedBy.selected],
	);

	return {
		...state,
		permissionResponse,
		requestPermission,
		fetchMore,
		changeSorting,
	};
};
