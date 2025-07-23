/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { BRAND_NAME } from "@/constants";
import { ArrowDownToLine, Search, Trash, Trash2 } from "lucide-react-native";

import { cn, isObject } from "@/lib/utils";
import { FlashList } from "@shopify/flash-list";
import {
	createVideoPlayer,
	VideoPlayer,
	VideoView,
	type VideoSource,
	type VideoViewProps,
} from "expo-video";
import React from "react";
import { useWindowDimensions } from "react-native";
import { cssInterop } from "react-native-css-interop";

cssInterop(VideoView, {
	className: "style",
});

const WINDOW_SCREEN_PADDING = 16;
const VIDEO_GAP = 12;

const usePlayerWidth = () => {
	const { width } = useWindowDimensions();

	const totalHorizontalSpace = WINDOW_SCREEN_PADDING * 2 + VIDEO_GAP;
	const playerWidth = (width - totalHorizontalSpace) / 2;

	return playerWidth;
};

interface PlayerItemProps extends VideoViewProps {
	source: VideoSource;
}
const PlayerItem: React.FC<PlayerItemProps> = ({
	source,
	player,
	className,
	style,
	...props
}) => {
	React.useEffect(() => {
		// initialize the video into the player after first render only once.
		player.replaceAsync(source).catch((e) => console.error(e));
	}, [player, source]);

	// const { isPlaying } = useEvent(player, "playingChange", {
	// 	isPlaying: player.playing,
	// });

	const width = usePlayerWidth();

	return (
		<VideoView
			{...props}
			player={player}
			className={cn("aspect-video", className)}
			style={[
				{
					width,
				},
				style,
			]}
		/>
	);
};

interface CreatePlayerPoolOptions {
	size: number;
	setup?: (player: VideoPlayer) => void;
}

/**
 * Creates a pool of reusable VideoPlayer instances.
 */
const createPlayerPool = ({
	size,
	setup,
}: CreatePlayerPoolOptions): VideoPlayer[] => {
	return Array.from({ length: size }, () => {
		const player = createVideoPlayer(null);
		setup?.(player);
		return player;
	});
};

/**
 * Manages the lifecycle of a pool of VideoPlayer instances.
 *
 * **NOTE**: Ensure `options` is a stable reference (e.g., via `React.useMemo`)
 * to prevent unnecessary player re-creations.
 */
const useVideoPlayerPool = (
	options: CreatePlayerPoolOptions,
): React.RefObject<VideoPlayer[]> => {
	const playerPoolRef = React.useRef<VideoPlayer[]>([]);

	React.useEffect(() => {
		playerPoolRef.current = createPlayerPool(options);

		return () => {
			playerPoolRef.current.forEach((player) => player.release());
			playerPoolRef.current = [];
		};
	}, [options]);

	return playerPoolRef;
};

interface RecentlyWatchedVideosProps {
	videos: VideoSource[];
}
const RecentlyWatchedVideos: React.FC<RecentlyWatchedVideosProps> = ({
	videos,
}) => {
	const playerPool = useVideoPlayerPool(
		React.useMemo(
			() => ({
				size: 10,
				setup: (player) => {
					player.loop = true;
					player.bufferOptions = {
						preferredForwardBufferDuration: 5,
					};
				},
			}),
			[],
		),
	);

	const playerWidth = usePlayerWidth();

	return (
		<FlashList
			data={videos}
			renderItem={({ item, index }) => {
				const player =
					playerPool.current[index % playerPool.current.length];

				if (!player) {
					return null;
				}

				return (
					<PlayerItem
						source={item}
						player={player}
						style={{
							marginRight:
								index === videos.length - 1 ? 0 : VIDEO_GAP,
						}}
					/>
				);
			}}
			keyExtractor={(item, index) =>
				String(
					(isObject(item) ? (item.uri ?? item.assetId) : item) ??
						index,
				)
			}
			horizontal
			showsHorizontalScrollIndicator={false}
			estimatedItemSize={playerWidth}
		/>
	);
};

const videoSources = [
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnAVacation.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WhatIfWeAddA4thDimension.mp4",
	},
	{
		uri: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
	},
	{
		uri: "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/1080/Big_Buck_Bunny_1080_10s_1MB.mp4",
	},
];

export default function VideoTab() {
	return (
		<Box className="flex-1 gap-4 p-4">
			{/* top bar */}
			<Box className="mb-4 flex-row items-center justify-between">
				<Image
					// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
					source={require("@/assets/images/brand/logo-text.png")}
					alt={`${BRAND_NAME} Logo`}
					size="none"
					className="aspect-[881/177] w-56"
				/>

				<Box className="flex-row items-center gap-4">
					{[Trash, Search, ArrowDownToLine].map((icon) => (
						<Icon key={icon.name} as={icon} size={"xl"} />
					))}
				</Box>
			</Box>

			{/* History section */}
			<Box className="gap-2">
				<Box className="flex-row items-center justify-between">
					<Heading size="xs">History</Heading>
					<Icon as={Trash2} />
				</Box>

				{/* recently last watched videos
                TODO: Replace videoSources with actual data
                */}
				<RecentlyWatchedVideos videos={videoSources} />
			</Box>
		</Box>
	);
}
