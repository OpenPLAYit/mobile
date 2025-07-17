/** @format */

import type { PlainObject } from "@/types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => {
	return twMerge(clsx(inputs));
};

export const isObject = (object: unknown): object is PlainObject =>
	!!object && typeof object === "object" && !Array.isArray(object);
