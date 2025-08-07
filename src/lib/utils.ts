/** @format */

import type { PlainObject } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const isObject = (object: unknown): object is PlainObject =>
	!!object && typeof object === "object" && !Array.isArray(object);

export const formatDuration = (totalSeconds: number): string => {
	const pad = (num: number) => Math.max(0, num).toString().padStart(2, "0");

	const secondsInDay = 86400; // 24 * 60 * 60

	const days = Math.floor(totalSeconds / secondsInDay);
	const hours = Math.floor((totalSeconds % secondsInDay) / 3600);
	const minutes = Math.floor((totalSeconds % 3600) / 60);
	const seconds = Math.floor(totalSeconds % 60);

	let formattedString = "";

	if (days > 0) {
		formattedString += `${pad(days)}:`;
		formattedString += `${pad(hours)}:`;
	} else if (hours > 0) {
		formattedString += `${pad(hours)}:`;
	}

	formattedString += `${pad(minutes)}:${pad(seconds)}`;

	return formattedString;
};
