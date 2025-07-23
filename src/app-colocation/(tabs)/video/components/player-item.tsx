/** @format */

import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { cn, isObject } from "@/lib/utils";
import { VideoView, type VideoSource, type VideoViewProps } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import React from "react";
import { TouchableOpacity, useWindowDimensions } from "react-native";
import { cssInterop } from "react-native-css-interop";
import { VIDEO_GAP, WINDOW_SCREEN_PADDING } from "../constants";
import { usePlayer } from "../player-context";
import { Play } from "lucide-react-native";

export const PLAYER_ASPECT_RATIO = 16 / 9;

export const usePlayerDimensions = () => {
	const { width } = useWindowDimensions();

	const totalHorizontalSpace = WINDOW_SCREEN_PADDING * 2 + VIDEO_GAP;
	const playerWidth = (width - totalHorizontalSpace) / 2;
	const playerHeight = playerWidth / PLAYER_ASPECT_RATIO;

	return { width: playerWidth, height: playerHeight } satisfies {
		width: number;
		height: number;
	};
};

export interface PlayerItemProps
	extends Pick<VideoViewProps, "className" | "style"> {
	source: VideoSource;
}

cssInterop(VideoView, {
	className: "style",
});

export const PlayerItem: React.FC<PlayerItemProps> = ({
	source,
	className,
	style,
}) => {
	const [thumbnailUri, setThumbnailUri] = React.useState<string | null>(null);
	React.useEffect(() => {
		const generateThumbnail = async (videoUri: string) => {
			try {
				const { uri } = await VideoThumbnails.getThumbnailAsync(
					videoUri,
					{ time: 10000 },
				);
				if (!uri) console.warn("invalid thumbnail uri", uri);

				setThumbnailUri(uri);
			} catch (e) {
				console.error(e);
			}
		};

		const videoUri: string | null = isObject(source)
			? (source.uri ?? null)
			: typeof source === "string"
				? source
				: null;

		if (videoUri) {
			generateThumbnail(videoUri).catch(console.error);
		}
	}, [source]);

	const [isPlaybackInitiated, setIsPlaybackInitiated] = React.useState(false);
	const { player } = usePlayer();

	const onInitiatePlayback = () => {
		player.replaceAsync(source).catch(console.error);
		setIsPlaybackInitiated(true);
	};
	const onExitPlayback = () => {
		player.pause();
		setIsPlaybackInitiated(false);
	};

	const { width } = usePlayerDimensions();

	return (
		<TouchableOpacity
			onPress={onInitiatePlayback}
			style={[
				{
					width,
					aspectRatio: PLAYER_ASPECT_RATIO,
				},
				style,
			]}
			className={cn("items-center justify-center", className)}>
			{isPlaybackInitiated ? (
				<VideoView
					ref={(view) => {
						if (view) {
							view.enterFullscreen()
								.then(() => player.play())
								.catch(console.error);
						}
					}}
					player={player}
					onFullscreenExit={onExitPlayback}
					className="size-full"
				/>
			) : thumbnailUri ? (
				<Image
					source={{ uri: thumbnailUri }}
					alt="video thumbnail"
					contentFit="cover"
					size="full"
				/>
			) : (
				<Icon as={Play} />
			)}
		</TouchableOpacity>
	);
};
