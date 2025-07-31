/** @format */

import type {
	InitialErrorState,
	InitialLoadingState,
	LoadedIdleHasNextPageState,
	LoadedIdleNoNextPageState,
	SubsequentErrorState,
	UserVideosState,
	UserVideosStateAction,
} from "./types";
import {
	canFetchMore,
	wasFetchingMore,
	addAssetsToExistingCollections,
} from "./utils";

export const userVideosStateReducer = (
	state: UserVideosState,
	action: UserVideosStateAction,
): UserVideosState => {
	switch (action.type) {
		case "INITIAL_FETCH_START":
			return {
				...state,
				isInitialLoading: true,
				isFetchingMore: false,
				videoCollections: null,
				endCursor: null,
				hasNextPage: false,
				error: null,
			} satisfies InitialLoadingState;

		case "INITIAL_FETCH_SUCCESS_HAS_NEXT":
			return {
				...state,
				isInitialLoading: false,
				isFetchingMore: false,
				videoCollections: action.payload.videoCollections,
				endCursor: action.payload.endCursor,
				hasNextPage: true,
				error: null,
			} satisfies LoadedIdleHasNextPageState;

		case "INITIAL_FETCH_SUCCESS_NO_NEXT":
			return {
				...state,
				isInitialLoading: false,
				isFetchingMore: false,
				videoCollections: action.payload.videoCollections,
				endCursor: action.payload.endCursor,
				hasNextPage: false,
				error: null,
			} satisfies LoadedIdleNoNextPageState;

		case "INITIAL_FETCH_FAILURE":
			return {
				...state,
				isInitialLoading: false,
				error: action.payload.error,
				videoCollections: null,
				endCursor: null,
				hasNextPage: false,
				isFetchingMore: false,
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

		case "CHANGE_SORTING":
			return {
				isInitialLoading: true,
				isFetchingMore: false,
				videoCollections: null,
				endCursor: null,
				hasNextPage: false,
				error: null,
				sortedBy: action.payload,
			} satisfies InitialLoadingState;

		default:
			return state;
	}
};
