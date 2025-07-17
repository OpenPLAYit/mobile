/** @format */

// This file was introduced to suppress the TypeScript error for importing .css files.

declare module "*.css" {
	const content: string;
	export default content;
}
