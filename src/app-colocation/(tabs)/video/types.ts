/** @format */

import * as MediaLibrary from "expo-media-library";

export type VideoAsset = AssertSubtype<
	MediaLibrary.Asset,
	MediaLibrary.Asset & {
		mediaType: "video";
	}
>;
