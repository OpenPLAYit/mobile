/** @format */

import { Box } from "@/components/ui/box";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { Image } from "@/components/ui/image";
import { BRAND_NAME } from "@/constants";
import { ArrowDownToLine, Search, Trash, Trash2 } from "lucide-react-native";

import { VideoMediaPlayer } from "@/app-colocation/(tabs)/video/components/video-media-player";
import {
	VIDEO_GAP,
	WINDOW_SCREEN_PADDING,
} from "@/app-colocation/(tabs)/video/constants";
import { useUserMediaVideos } from "@/app-colocation/(tabs)/video/hooks/use-user-media-videos";
import { PlayerProvider } from "@/app-colocation/(tabs)/video/player-context";
import { Text } from "@/components/ui/text";
import { isObject } from "@/lib/utils";
import { type VideoSource } from "expo-video";
import React from "react";
import { ActivityIndicator, FlatList, ScrollView } from "react-native";

interface RecentlyWatchedVideosProps {
	videos: VideoSource[];
}
const RecentlyWatchedVideos: React.FC<RecentlyWatchedVideosProps> = ({
	videos,
}) => {
	return (
		<ScrollView
			horizontal
			showsHorizontalScrollIndicator={false}
			className="flex-row">
			{videos.map((video, index) => (
				<VideoMediaPlayer
					key={
						(isObject(video)
							? (video.uri ?? video.assetId)
							: video) ?? index
					}
					source={video}
					style={{
						marginRight:
							index === videos.length - 1 ? 0 : VIDEO_GAP,
					}}
				/>
			))}
		</ScrollView>
	);
};

export default function VideoTab() {
	const { videoCollection, isInitialLoading, error } = useUserMediaVideos();
	return (
		<PlayerProvider>
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
				{isInitialLoading ? (
					<ActivityIndicator />
				) : error ? (
					<Text>{error.message}</Text>
				) : videoCollection.length ? (
					<Box className="flex-1 gap-4">
						<Box className="gap-2">
							<Box className="flex-row items-center justify-between">
								<Heading size="xs">History</Heading>
								<Icon as={Trash2} />
							</Box>

							{/* TODO: Add recently RecentlyWatchedVideos */}
							<RecentlyWatchedVideos videos={[]} />
						</Box>

						<Box className="gap-2">
							<Heading size="xs">Video</Heading>

							<FlatList
								data={videoCollection}
								keyExtractor={({ month, year }, index) =>
									month + year + index
								}
								showsVerticalScrollIndicator={false}
								renderItem={({ item }) => {
									return (
										<Box className="mb-2 gap-2">
											<Heading
												size="xs"
												className="!text-2xs capitalize">
												{item.month.slice(0, 3)},{" "}
												{item.year}
											</Heading>

											<FlatList
												data={item.videos}
												keyExtractor={(item, index) =>
													String(
														isObject(item)
															? (item.uri ??
																	item.assetId)
															: index,
													)
												}
												renderItem={({
													item,
													index: videoIndex,
												}) => {
													return (
														<VideoMediaPlayer
															source={item}
															style={{
																marginRight:
																	videoIndex %
																		2 ===
																	0
																		? VIDEO_GAP
																		: 0,
																marginBottom:
																	VIDEO_GAP,
															}}
														/>
													);
												}}
												numColumns={2}
											/>
										</Box>
									);
								}}
							/>
						</Box>
					</Box>
				) : (
					<Text className="mt-20 text-center text-gray-500">
						No videos found in your library.
					</Text>
				)}
			</Box>
		</PlayerProvider>
	);
}
