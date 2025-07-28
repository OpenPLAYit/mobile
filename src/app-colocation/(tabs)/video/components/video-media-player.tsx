/** @format */

import { Box } from "@/components/ui/box";
import { Image } from "@/components/ui/image";
import { Portal } from "@/components/ui/portal";
import { FULLSCREEN_VIDEO_THUMBNAIL_PORTAL_HOST } from "@/constants";
import { cn } from "@/lib/utils";
import { VideoView, type VideoSource, type VideoViewProps } from "expo-video";
import * as VideoThumbnails from "expo-video-thumbnails";
import React from "react";
import {
	Pressable,
	useWindowDimensions,
	View,
	type NativeMethods,
} from "react-native";
import { cssInterop } from "react-native-css-interop";
import Animated from "react-native-reanimated";
import { VIDEO_GAP, WINDOW_SCREEN_PADDING } from "../constants";
import {
	useThumbnailToFullscreenTransition,
	type ElementLayout,
} from "../hooks/use-thumbnail-to-fullscreen-transition";
import { usePlayer } from "../player-context";
import { VideoMediaThumbnail } from "./video-media-thumbnail";

cssInterop(VideoView, {
	className: "style",
});
cssInterop(Animated.View, {
	className: "style",
});

export const PLAYER_ASPECT_RATIO = 16 / 9;

export const usePlayerDimensions = () => {
	const { width } = useWindowDimensions();

	const totalHorizontalSpace = WINDOW_SCREEN_PADDING * 2 + VIDEO_GAP;
	const playerWidth = (width - totalHorizontalSpace) / 2;
	const playerHeight = playerWidth / PLAYER_ASPECT_RATIO;

	return {
		width: playerWidth,
		height: playerHeight,
		aspectRatio: PLAYER_ASPECT_RATIO,
	} satisfies {
		width: number;
		height: number;
		aspectRatio: number;
	};
};

/**Returns a promise that resolves with the measured layout. */
const measureLayout = (view: Pick<NativeMethods, "measureInWindow">) => {
	return new Promise<ElementLayout>((resolve) => {
		view.measureInWindow((pageX, pageY, width, height) => {
			resolve({
				pageX,
				pageY,
				width,
				height,
			});
		});
	});
};

export interface VideoMediaPlayerProps
	extends Pick<VideoViewProps, "className" | "style"> {
	source: VideoSource;
}

export const VideoMediaPlayer: React.FC<VideoMediaPlayerProps> = ({
	source,
	className,
	style,
}) => {
	const [thumbnail, setThumbnail] =
		React.useState<VideoThumbnails.VideoThumbnailsResult | null>(null);

	const [isPlaybackInitiated, setIsPlaybackInitiated] = React.useState(false);
	const { player } = usePlayer();

	const { width } = usePlayerDimensions();

	const {
		animatedStyle,
		animatedBackgroundStyle,
		startTransition,
		resetTransition,
	} = useThumbnailToFullscreenTransition();

	const thumbnailLayoutRef = React.useRef<ElementLayout>({
		pageX: 0,
		pageY: 0,
		width: 0,
		height: 0,
	});
	const thumbnailElementRef = React.useRef<View>(null);

	const videoViewRef = React.useRef<VideoView>(null);
	const onInitiatePlayback = async () => {
		if (!thumbnail || !thumbnailElementRef.current) {
			throw new Error("video thumbnail not ready!");
		}
		if (!videoViewRef.current) {
			throw new Error("Video view not ready!");
		}

		// first measure the thumbnail layout to know exact starting points
		// for the fullscreen transition.
		thumbnailLayoutRef.current = await measureLayout(
			thumbnailElementRef.current,
		);

		// then the state update will use the fresh layout values.
		setIsPlaybackInitiated(true);

		const replaceAsyncPromise = player.replaceAsync(source);

		const startTransitionPromise = startTransition({
			videoIntrisincAspectRatio: thumbnail.width / thumbnail.height,
			initialThumbnailLayout: thumbnailLayoutRef.current,
		});

		// `all` is better than `allSettled` here, because with `all`, if any
		// of the promises rejects, the `all` rejects immediately.
		await Promise.all([replaceAsyncPromise, startTransitionPromise]);

		await videoViewRef.current.enterFullscreen();
		player.play();
	};

	const onExitPlayback = () => {
		player.pause();
		resetTransition({
			initialThumbnailLayout: thumbnailLayoutRef.current,
		})
			.then(() => setIsPlaybackInitiated(false))
			.catch(console.error);
	};

	return (
		<View
			style={[
				{
					width,
					aspectRatio: PLAYER_ASPECT_RATIO,
				},
				style,
			]}
			className={cn("items-center justify-center", className)}>
			<VideoView
				ref={videoViewRef}
				player={player}
				onFullscreenExit={onExitPlayback}
				className="sr-only" // we only need this View to enter video fullscreen
			/>

			{/* thumbnail that initiates playback on press */}
			<Pressable
				onPress={() => {
					onInitiatePlayback().catch(console.error);
				}}
				className="size-full">
				<VideoMediaThumbnail
					videoSource={source}
					ref={thumbnailElementRef}
					setThumbnailResult={setThumbnail}
					className={"size-full"}
				/>
			</Pressable>

			{isPlaybackInitiated && thumbnail && (
				<Portal
					name="video-thumbnail-portal"
					hostName={FULLSCREEN_VIDEO_THUMBNAIL_PORTAL_HOST}>
					{/* Animated.View for the full-screen background overlay */}
					<Animated.View
						className={"size-full"}
						style={[
							animatedBackgroundStyle,
							{ zIndex: 9998 }, // Behind the thumbnail, but above other content
						]}></Animated.View>

					<Box
						style={{
							position: "absolute",
							top: thumbnailLayoutRef.current.pageY,
							left: thumbnailLayoutRef.current.pageX,
							width: thumbnailLayoutRef.current.width,
							height: thumbnailLayoutRef.current.height,
							zIndex: 9999, // Ensure it's on top
						}}>
						<Animated.View
							className={"size-full"}
							style={animatedStyle}>
							<Image
								source={{ uri: thumbnail.uri }}
								alt="animated video thumbnail"
								contentFit="cover"
								size="full"
							/>
						</Animated.View>
					</Box>
				</Portal>
			)}
		</View>
	);
};
