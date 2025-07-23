/** @format */

import * as MediaLibrary from "expo-media-library";
import { type VideoSource } from "expo-video";
import React from "react";

// Define the type for your combined state
export type UserMediaVideosState =
	| {
			videos?: never;
			isLoading: true;
			error?: never;
	  }
	| {
			videos?: never;
			isLoading: false;
			error: Error;
	  }
	| {
			videos: VideoSource[];
			isLoading: false;
			error?: never;
	  };

type UseUserMediaVideosReturn = UserMediaVideosState & {
	permissionResponse: MediaLibrary.PermissionResponse | null;
	requestPermission: () => Promise<MediaLibrary.PermissionResponse>;
};

export const useUserMediaVideos = (): UseUserMediaVideosReturn => {
	const [state, setState] = React.useState<UserMediaVideosState>({
		isLoading: false,
		videos: [],
	});

	const [permissionResponse, requestPermission] =
		MediaLibrary.usePermissions();

	React.useEffect(() => {
		const fetchVideos = async () => {
			setState({ isLoading: true });

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
					isLoading: false,
				});
				return;
			}

			try {
				const assets = await MediaLibrary.getAssetsAsync({
					mediaType: MediaLibrary.MediaType.video,
					sortBy: [[MediaLibrary.SortBy.modificationTime, false]],
					first: 50,
				});

				setState({
					videos: assets.assets,
					isLoading: false,
				});
			} catch (e) {
				const error: Error =
					e instanceof Error
						? e
						: new Error("An unknown error occurred.");
				setState({
					error,
					isLoading: false,
				});
			}
		};

		fetchVideos().catch(() => {});
	}, [permissionResponse, requestPermission]);

	return {
		...state,
		permissionResponse,
		requestPermission,
	};
};
