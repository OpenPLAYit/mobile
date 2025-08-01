/** @format */

import * as MediaLibrary from "expo-media-library";
import type { SortingState } from "../../components/video-sorting-modal";

export const MONTH_NAMES = [
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

export type MonthName = (typeof MONTH_NAMES)[number];
export type Year = number;

export type VideoAsset = AssertSubtype<
	MediaLibrary.Asset,
	MediaLibrary.Asset & {
		mediaType: "video";
	}
>;

export interface DatedVideoCollection {
	month: MonthName;
	year: Year;
	videos: VideoAsset[];
}

export interface BaseVideosState {
	isInitialLoading: boolean;
	videoCollections: DatedVideoCollection[] | null;
	isFetchingMore: boolean;
	endCursor: string | null;
	hasNextPage: boolean;
	error: Error | null;
	sortedBy: SortingState;
}

/**
 * State when the initial fetch of user videos is in progress.
 */
export interface InitialLoadingState extends BaseVideosState {
	isInitialLoading: true;
	videoCollections: null;
	isFetchingMore: false;
	endCursor: null;
	hasNextPage: false;
	error: null;
}

/**
 * State when an error occurred during the initial fetch of user videos.
 */
export interface InitialErrorState extends BaseVideosState {
	isInitialLoading: false;
	error: Error;
	videoCollections: null;
	isFetchingMore: false;
	endCursor: null;
	hasNextPage: false;
}

/**
 * State when user videos are loaded, no active fetch is in progress,
 * and there are more pages of videos to fetch.
 */
export interface LoadedIdleHasNextPageState extends BaseVideosState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string;
	hasNextPage: true;
	error: null;
}

/**
 * State when user videos are loaded, no active fetch is in progress,
 * and there are no more pages of videos to fetch.
 */
export interface LoadedIdleNoNextPageState extends BaseVideosState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string | null; // 'string | null' to allow API's actual return when hasNextPage is false
	hasNextPage: false;
	error: null;
}

/**
 * State when user videos are loaded and no active fetch is in progress.
 */
export type LoadedIdleState =
	| LoadedIdleHasNextPageState
	| LoadedIdleNoNextPageState;

/**
 * State when media videos are loaded and a new batch is being fetched.
 */
export interface LoadedFetchingMoreState extends BaseVideosState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: true;
	endCursor: string;
	hasNextPage: true;
	error: null;
}

/**
 * State when a subsequent fetch for more user videos failed.
 */
export interface SubsequentErrorState extends BaseVideosState {
	isInitialLoading: false;
	videoCollections: DatedVideoCollection[];
	isFetchingMore: false;
	endCursor: string | null;
	hasNextPage: boolean;
	error: Error;
}

export type UserVideosState =
	| InitialLoadingState
	| InitialErrorState
	| LoadedIdleState
	| LoadedFetchingMoreState
	| SubsequentErrorState;

export type UserVideosStateAction =
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
	  }
	| {
			type: "CHANGE_SORTING";
			payload: SortingState;
	  };
