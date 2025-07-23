/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { BRAND_NAME } from "@/constants";
import { ArrowDownToLine, Search, Trash, Trash2 } from "lucide-react-native";

import {
	PlayerItem,
	usePlayerDimensions,
} from "@/app-colocation/(tabs)/video/components/player-item";
import { useUserMediaVideos } from "@/app-colocation/(tabs)/video/use-user-media-videos";
import { Text } from "@/components/ui/text";
import { FlashList } from "@shopify/flash-list";
import { createVideoPlayer, VideoPlayer, type VideoSource } from "expo-video";
import React from "react";
import { ActivityIndicator } from "react-native";
import {
	VIDEO_GAP,
	WINDOW_SCREEN_PADDING,
} from "@/app-colocation/(tabs)/video/constants";
import { isObject } from "@/lib/utils";

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

	const { width: playerWidth } = usePlayerDimensions();

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

export default function VideoTab() {
	const { videos, isLoading, error } = useUserMediaVideos();
	return (
		<Box
			className="flex-1 gap-4"
			style={{ padding: WINDOW_SCREEN_PADDING }}>
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
						<Icon
							key={icon.name + icon.displayName}
							as={icon}
							size={"xl"}
						/>
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
				{isLoading ? (
					<ActivityIndicator />
				) : error ? (
					<Text>{error.message}</Text>
				) : (
					<RecentlyWatchedVideos videos={videos} />
				)}
			</Box>
		</Box>
	);
}
