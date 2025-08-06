/** @format */

module.exports = function (api) {
	api.cache(true);

	return {
		presets: [
			[
				"babel-preset-expo",
				{
					jsxImportSource: "nativewind",
					reanimated: false, // react-native-reanimated/plugin moved to react-native-worklets/plugin in v4
				},
			],
			"nativewind/babel",
		],

		plugins: [
			[
				"module-resolver",
				{
					root: ["./"],

					alias: {
						"@": "./src",
						"tailwind.config": "./tailwind.config.js",
					},
				},
			],
			"react-native-worklets/plugin",
		],
	};
};
