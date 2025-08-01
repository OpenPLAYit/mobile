/** @format */

export const normalizeError = (err: unknown): Error =>
	err instanceof Error
		? err
		: new Error(
				typeof err === "string" ? err : "An unknown error occurred.",
			);
