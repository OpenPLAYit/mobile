/** @format */

"use client";
import { vars } from "nativewind";

type ColorKey = `--color-${string}-${string}`;
type ColorValue = `${number} ${number} ${number}`;
type ColorMap = Record<ColorKey, ColorValue>;

// Derived shade 0 for colors: Average of 50 and 100, then slightly desaturated and lightened/darkened towards white/black respectively.
// For example, for green-0, the values for green-50 (240 253 244) and green-100 (220 252 231) are averaged
// (230 252.5 237.5) and then adjusted. For dark theme, it's adjusted towards black.

const lightThemeMap = {
	"--color-primary-0": "252 252 251", // Derived from Stone-50 (250 250 249) #FCFCFB
	"--color-primary-50": "250 250 249", // Stone-50 #FAFAFA
	"--color-primary-100": "245 245 244", // Stone-100 #F5F5F4
	"--color-primary-200": "231 229 228", // Stone-200 #E7E5E4
	"--color-primary-300": "214 211 209", // Stone-300 #D6D3D1
	"--color-primary-400": "168 162 158", // Stone-400 #A8A29E
	"--color-primary-500": "120 113 108", // Stone-500 #78716C
	"--color-primary-600": "87 83 78", // Stone-600 #57534A
	"--color-primary-700": "68 64 60", // Stone-700 #44403C
	"--color-primary-800": "41 37 36", // Stone-800 #292524
	"--color-primary-900": "28 25 23", // Stone-900 #1C1917
	"--color-primary-950": "12 10 9", // Stone-950 #0C0A09

	/* Secondary (Stone) */
	"--color-secondary-0": "252 252 251", // Derived from Stone-50 (250 250 249) #FCFCFB
	"--color-secondary-50": "250 250 249", // Stone-50 #FAFAFA
	"--color-secondary-100": "245 245 244", // Stone-100 #F5F5F4
	"--color-secondary-200": "231 229 228", // Stone-200 #E7E5E4
	"--color-secondary-300": "214 211 209", // Stone-300 #D6D3D1
	"--color-secondary-400": "168 162 158", // Stone-400 #A8A29E
	"--color-secondary-500": "120 113 108", // Stone-500 #78716C
	"--color-secondary-600": "87 83 78", // Stone-600 #57534A
	"--color-secondary-700": "68 64 60", // Stone-700 #44403C
	"--color-secondary-800": "41 37 36", // Stone-800 #292524
	"--color-secondary-900": "28 25 23", // Stone-900 #1C1917
	"--color-secondary-950": "12 10 9", // Stone-950 #0C0A09

	/* Tertiary (Amber) */
	"--color-tertiary-0": "255 255 250", // Derived from Amber-50 (255 247 237) #FFFFFA
	"--color-tertiary-50": "255 247 237", // Amber-50 #FFF7ED
	"--color-tertiary-100": "255 237 213", // Amber-100 #FFEDD5
	"--color-tertiary-200": "254 215 170", // Amber-200 #FED7AA
	"--color-tertiary-300": "253 186 116", // Amber-300 #FDBA74
	"--color-tertiary-400": "251 146 60", // Amber-400 #FB923C
	"--color-tertiary-500": "249 115 22", // Amber-500 #F97316
	"--color-tertiary-600": "234 88 12", // Amber-600 #EA580C
	"--color-tertiary-700": "194 65 12", // Amber-700 #C2410C
	"--color-tertiary-800": "154 52 18", // Amber-800 #9A3412
	"--color-tertiary-900": "124 45 18", // Amber-900 #7C2D12
	"--color-tertiary-950": "67 21 8", // Amber-950 #431508

	/* Error (Red) */
	"--color-error-0": "254 250 250", // Derived from Red-50 (254 242 242) #FEFAFA
	"--color-error-50": "254 242 242", // Red-50 #FEF2F2
	"--color-error-100": "254 226 226", // Red-100 #FEE2E2
	"--color-error-200": "254 202 202", // Red-200 #FECACA
	"--color-error-300": "252 165 165", // Red-300 #FCA5A5
	"--color-error-400": "248 113 113", // Red-400 #F87171
	"--color-error-500": "239 68 68", // Red-500 #EF4444
	"--color-error-600": "220 38 38", // Red-600 #DC2626
	"--color-error-700": "185 28 28", // Red-700 #B91C1C
	"--color-error-800": "153 27 27", // Red-800 #991B1B
	"--color-error-900": "127 29 29", // Red-900 #7F1D1D
	"--color-error-950": "69 10 10", // Red-950 #450A0A

	/* Success (Green) */
	"--color-success-0": "245 255 249", // Derived from Green-50 (240 253 244) #F5FFF9
	"--color-success-50": "240 253 244", // Green-50 #F0FDD4
	"--color-success-100": "220 252 231", // Green-100 #DCFCE7
	"--color-success-200": "185 248 207", // Green-200 #B9F8CF
	"--color-success-300": "123 241 168", // Green-300 #7BF1A8
	"--color-success-400": "5 223 114", // Green-400 #05DF72
	"--color-success-500": "0 201 80", // Green-500 #00C950
	"--color-success-600": "0 166 62", // Green-600 #00A63E
	"--color-success-700": "0 130 54", // Green-700 #008236
	"--color-success-800": "1 102 48", // Green-800 #016630
	"--color-success-900": "13 84 43", // Green-900 #0D542B
	"--color-success-950": "3 46 21", // Green-950 #032E15

	/* Warning (Yellow) */
	"--color-warning-0": "255 255 250", // Derived from Yellow-50 (254 252 232) #FFFFFA
	"--color-warning-50": "254 252 232", // Yellow-50 #FEFCE8
	"--color-warning-100": "254 249 195", // Yellow-100 #FEF9C3
	"--color-warning-200": "254 240 138", // Yellow-200 #FEEB8A
	"--color-warning-300": "253 224 71", // Yellow-300 #FDE047
	"--color-warning-400": "250 204 21", // Yellow-400 #FAC015
	"--color-warning-500": "234 179 8", // Yellow-500 #EAB308
	"--color-warning-600": "202 138 4", // Yellow-600 #CA8A04
	"--color-warning-700": "161 98 7", // Yellow-700 #A16207
	"--color-warning-800": "133 77 14", // Yellow-800 #854D0E
	"--color-warning-900": "113 63 18", // Yellow-900 #713F12
	"--color-warning-950": "66 32 6", // Yellow-950 #422006

	/* Info (Sky) */
	"--color-info-0": "240 252 255", // Derived from Sky-50 (240 249 255) #F0FCFF
	"--color-info-50": "240 249 255", // Sky-50 #F0F9FF
	"--color-info-100": "224 242 254", // Sky-100 #E0F2FE
	"--color-info-200": "186 230 253", // Sky-200 #BAE6FD
	"--color-info-300": "125 211 252", // Sky-300 #7DD3FC
	"--color-info-400": "56 189 248", // Sky-400 #38BDF8
	"--color-info-500": "14 165 233", // Sky-500 #0EA5E9
	"--color-info-600": "2 132 199", // Sky-600 #0284C7
	"--color-info-700": "3 105 161", // Sky-700 #0369A1
	"--color-info-800": "7 89 133", // Sky-800 #075985
	"--color-info-900": "12 74 110", // Sky-900 #0C4A6E
	"--color-info-950": "8 47 73", // Sky-950 #082F49

	/* Typography (Stone) */
	"--color-typography-0": "252 252 251", // Derived from Stone-50 (250 250 249) #FCFCFB
	"--color-typography-50": "250 250 249", // Stone-50 #FAFAFA
	"--color-typography-100": "245 245 244", // Stone-100 #F5F5F4
	"--color-typography-200": "231 229 228", // Stone-200 #E7E5E4
	"--color-typography-300": "214 211 209", // Stone-300 #D6D3D1
	"--color-typography-400": "168 162 158", // Stone-400 #A8A29E
	"--color-typography-500": "120 113 108", // Stone-500 #78716C
	"--color-typography-600": "87 83 78", // Stone-600 #57534A
	"--color-typography-700": "68 64 60", // Stone-700 #44403C
	"--color-typography-800": "41 37 36", // Stone-800 #292524
	"--color-typography-900": "28 25 23", // Stone-900 #1C1917
	"--color-typography-950": "12 10 9", // Stone-950 #0C0A09

	/* Outline (Stone) */
	"--color-outline-0": "252 252 251", // Derived from Stone-50 (250 250 249) #FCFCFB
	"--color-outline-50": "250 250 249", // Stone-50 #FAFAFA
	"--color-outline-100": "245 245 244", // Stone-100 #F5F5F4
	"--color-outline-200": "231 229 228", // Stone-200 #E7E5E4
	"--color-outline-300": "214 211 209", // Stone-300 #D6D3D1
	"--color-outline-400": "168 162 158", // Stone-400 #A8A29E
	"--color-outline-500": "120 113 108", // Stone-500 #78716C
	"--color-outline-600": "87 83 78", // Stone-600 #57534A
	"--color-outline-700": "68 64 60", // Stone-700 #44403C
	"--color-outline-800": "41 37 36", // Stone-800 #292524
	"--color-outline-900": "28 25 23", // Stone-900 #1C1917
	"--color-outline-950": "12 10 9", // Stone-950 #0C0A09

	/* Background (Stone) */
	"--color-background-0": "252 252 251", // Derived from Stone-50 (250 250 249) #FCFCFB
	"--color-background-50": "250 250 249", // Stone-50 #FAFAFA
	"--color-background-100": "245 245 244", // Stone-100 #F5F5F4
	"--color-background-200": "231 229 228", // Stone-200 #E7E5E4
	"--color-background-300": "214 211 209", // Stone-300 #D6D3D1
	"--color-background-400": "168 162 158", // Stone-400 #A8A29E
	"--color-background-500": "120 113 108", // Stone-500 #78716C
	"--color-background-600": "87 83 78", // Stone-600 #57534A
	"--color-background-700": "68 64 60", // Stone-700 #44403C
	"--color-background-800": "41 37 36", // Stone-800 #292524
	"--color-background-900": "28 25 23", // Stone-900 #1C1917
	"--color-background-950": "12 10 9", // Stone-950 #0C0A09

	/* Background Special */
	"--color-background-error": "254 242 242", // Red-50 #FEF2F2
	"--color-background-warning": "254 252 232", // Yellow-50 #FEFCE8
	"--color-background-success": "240 253 244", // Green-50 #F0FDD4
	"--color-background-muted": "250 250 249", // Stone-50 #FAFAFA
	"--color-background-info": "240 249 255", // Sky-50 #F0F9FF

	/* Focus Ring Indicator */
	"--color-indicator-primary": "120 113 108", // Stone-500 #78716C
	"--color-indicator-info": "14 165 233", // Sky-500 #0EA5E9
	"--color-indicator-error": "185 28 28", // Red-700 #B91C1C
} satisfies ColorMap;

type ThemeColorKey = keyof typeof lightThemeMap;
type ThemeColorMap = Record<ThemeColorKey, ColorValue>;

const darkThemeMap = {
	"--color-primary-0": "10 8 7", // Derived from Stone-950 (12 10 9) #0A0807
	"--color-primary-50": "12 10 9", // Stone-950 #0C0A09
	"--color-primary-100": "28 25 23", // Stone-900 #1C1917
	"--color-primary-200": "41 37 36", // Stone-800 #292524
	"--color-primary-300": "68 64 60", // Stone-700 #44403C
	"--color-primary-400": "87 83 78", // Stone-600 #57534A
	"--color-primary-500": "120 113 108", // Stone-500 #78716C
	"--color-primary-600": "168 162 158", // Stone-400 #A8A29E
	"--color-primary-700": "214 211 209", // Stone-300 #D6D3D1
	"--color-primary-800": "231 229 228", // Stone-200 #E7E5E4
	"--color-primary-900": "245 245 244", // Stone-100 #F5F5F4
	"--color-primary-950": "250 250 249", // Stone-50 #FAFAFA

	/* Secondary (Stone) */
	"--color-secondary-0": "10 8 7", // Derived from Stone-950 (12 10 9) #0A0807
	"--color-secondary-50": "12 10 9", // Stone-950 #0C0A09
	"--color-secondary-100": "28 25 23", // Stone-900 #1C1917
	"--color-secondary-200": "41 37 36", // Stone-800 #292524
	"--color-secondary-300": "68 64 60", // Stone-700 #44403C
	"--color-secondary-400": "87 83 78", // Stone-600 #57534A
	"--color-secondary-500": "120 113 108", // Stone-500 #78716C
	"--color-secondary-600": "168 162 158", // Stone-400 #A8A29E
	"--color-secondary-700": "214 211 209", // Stone-300 #D6D3D1
	"--color-secondary-800": "231 229 228", // Stone-200 #E7E5E4
	"--color-secondary-900": "245 245 244", // Stone-100 #F5F5F4
	"--color-secondary-950": "250 250 249", // Stone-50 #FAFAFA

	/* Tertiary (Amber) */
	"--color-tertiary-0": "65 21 8", // Derived from Amber-950 (67 21 8) #411508
	"--color-tertiary-50": "67 21 8", // Amber-950 #431508
	"--color-tertiary-100": "124 45 18", // Amber-900 #7C2D12
	"--color-tertiary-200": "154 52 18", // Amber-800 #9A3412
	"--color-tertiary-300": "194 65 12", // Amber-700 #C2410C
	"--color-tertiary-400": "234 88 12", // Amber-600 #EA580C
	"--color-tertiary-500": "249 115 22", // Amber-500 #F97316
	"--color-tertiary-600": "251 146 60", // Amber-400 #FB923C
	"--color-tertiary-700": "254 215 170", // Amber-200 #FED7AA
	"--color-tertiary-800": "255 237 213", // Amber-100 #FFEDD5
	"--color-tertiary-900": "255 247 237", // Amber-50 #FFF7ED
	"--color-tertiary-950": "255 255 250", // Derived from Amber-50 (255 247 237) #FFFFFA

	/* Error (Red) */
	"--color-error-0": "66 9 9", // Derived from Red-950 (69 10 10) #420909
	"--color-error-50": "69 10 10", // Red-950 #450A0A
	"--color-error-100": "127 29 29", // Red-900 #7F1D1D
	"--color-error-200": "153 27 27", // Red-800 #991B1B
	"--color-error-300": "185 28 28", // Red-700 #B91C1C
	"--color-error-400": "220 38 38", // Red-600 #DC2626
	"--color-error-500": "239 68 68", // Red-500 #EF4444
	"--color-error-600": "248 113 113", // Red-400 #F87171
	"--color-error-700": "252 165 165", // Red-300 #FCA5A5
	"--color-error-800": "254 202 202", // Red-200 #FECACA
	"--color-error-900": "254 226 226", // Red-100 #FEE2E2
	"--color-error-950": "254 242 242", // Red-50 #FEF2F2

	/* Success (Green) */
	"--color-success-0": "3 46 21", // Derived from Green-950 (3 46 21) #032E15
	"--color-success-50": "3 46 21", // Green-950 #032E15
	"--color-success-100": "13 84 43", // Green-900 #0D542B
	"--color-success-200": "1 102 48", // Green-800 #016630
	"--color-success-300": "0 130 54", // Green-700 #008236
	"--color-success-400": "0 166 62", // Green-600 #00A63E
	"--color-success-500": "0 201 80", // Green-500 #00C950
	"--color-success-600": "5 223 114", // Green-400 #05DF72
	"--color-success-700": "123 241 168", // Green-300 #7BF1A8
	"--color-success-800": "185 248 207", // Green-200 #B9F8CF
	"--color-success-900": "220 252 231", // Green-100 #DCFCE7
	"--color-success-950": "240 253 244", // Green-50 #F0FDD4

	/* Warning (Yellow) */
	"--color-warning-0": "64 29 5", // Derived from Yellow-950 (66 32 6) #401D05
	"--color-warning-50": "66 32 6", // Yellow-950 #422006
	"--color-warning-100": "113 63 18", // Yellow-900 #713F12
	"--color-warning-200": "133 77 14", // Yellow-800 #854D0E
	"--color-warning-300": "161 98 7", // Yellow-700 #A16207
	"--color-warning-400": "202 138 4", // Yellow-600 #CA8A04
	"--color-warning-500": "234 179 8", // Yellow-500 #EAB308
	"--color-warning-600": "250 204 21", // Yellow-400 #FAC015
	"--color-warning-700": "253 224 71", // Yellow-300 #FDE047
	"--color-warning-800": "254 240 138", // Yellow-200 #FEEB8A
	"--color-warning-900": "254 249 195", // Yellow-100 #FEF9C3
	"--color-warning-950": "254 252 232", // Yellow-50 #FEFCE8

	/* Info (Sky) */
	"--color-info-0": "6 41 65", // Derived from Sky-950 (8 47 73) #062941
	"--color-info-50": "8 47 73", // Sky-950 #082F49
	"--color-info-100": "12 74 110", // Sky-900 #0C4A6E
	"--color-info-200": "7 89 133", // Sky-800 #075985
	"--color-info-300": "3 105 161", // Sky-700 #0369A1
	"--color-info-400": "2 132 199", // Sky-600 #0284C7
	"--color-info-500": "14 165 233", // Sky-500 #0EA5E9
	"--color-info-600": "56 189 248", // Sky-400 #38BDF8
	"--color-info-700": "125 211 252", // Sky-300 #7DD3FC
	"--color-info-800": "186 230 253", // Sky-200 #BAE6FD
	"--color-info-900": "224 242 254", // Sky-100 #E0F2FE
	"--color-info-950": "240 249 255", // Sky-50 #F0F9FF

	/* Typography (Stone) */
	"--color-typography-0": "10 8 7", // Derived from Stone-950 (12 10 9) #0A0807
	"--color-typography-50": "12 10 9", // Stone-950 #0C0A09
	"--color-typography-100": "28 25 23", // Stone-900 #1C1917
	"--color-typography-200": "41 37 36", // Stone-800 #292524
	"--color-typography-300": "68 64 60", // Stone-700 #44403C
	"--color-typography-400": "87 83 78", // Stone-600 #57534A
	"--color-typography-500": "120 113 108", // Stone-500 #78716C
	"--color-typography-600": "168 162 158", // Stone-400 #A8A29E
	"--color-typography-700": "214 211 209", // Stone-300 #D6D3D1
	"--color-typography-800": "231 229 228", // Stone-200 #E7E5E4
	"--color-typography-900": "245 245 244", // Stone-100 #F5F5F4
	"--color-typography-950": "250 250 249", // Stone-50 #FAFAFA

	/* Outline (Stone) */
	"--color-outline-0": "10 8 7", // Derived from Stone-950 (12 10 9) #0A0807
	"--color-outline-50": "12 10 9", // Stone-950 #0C0A09
	"--color-outline-100": "28 25 23", // Stone-900 #1C1917
	"--color-outline-200": "41 37 36", // Stone-800 #292524
	"--color-outline-300": "68 64 60", // Stone-700 #44403C
	"--color-outline-400": "87 83 78", // Stone-600 #57534A
	"--color-outline-500": "120 113 108", // Stone-500 #78716C
	"--color-outline-600": "168 162 158", // Stone-400 #A8A29E
	"--color-outline-700": "214 211 209", // Stone-300 #D6D3D1
	"--color-outline-800": "231 229 228", // Stone-200 #E7E5E4
	"--color-outline-900": "245 245 244", // Stone-100 #F5F5F4
	"--color-outline-950": "250 250 249", // Stone-50 #FAFAFA

	/* Background (Stone) */
	"--color-background-0": "10 8 7", // Derived from Stone-950 (12 10 9) #0A0807
	"--color-background-50": "12 10 9", // Stone-950 #0C0A09
	"--color-background-100": "28 25 23", // Stone-900 #1C1917
	"--color-background-200": "41 37 36", // Stone-800 #292524
	"--color-background-300": "68 64 60", // Stone-700 #44403C
	"--color-background-400": "87 83 78", // Stone-600 #57534A
	"--color-background-500": "120 113 108", // Stone-500 #78716C
	"--color-background-600": "168 162 158", // Stone-400 #A8A29E
	"--color-background-700": "214 211 209", // Stone-300 #D6D3D1
	"--color-background-800": "231 229 228", // Stone-200 #E7E5E4
	"--color-background-900": "245 245 244", // Stone-100 #F5F5F4
	"--color-background-950": "250 250 249", // Stone-50 #FAFAFA

	/* Background Special */
	"--color-background-error": "69 10 10", // Red-950 #450A0A
	"--color-background-warning": "66 32 6", // Yellow-950 #422006
	"--color-background-success": "3 46 21", // Green-950 #032E15
	"--color-background-muted": "12 10 9", // Stone-950 #0C0A09
	"--color-background-info": "8 47 73", // Sky-950 #082F49

	/* Focus Ring Indicator */
	"--color-indicator-primary": "168 162 158", // Stone-400 #A8A29E
	"--color-indicator-info": "14 165 233", // Sky-500 #0EA5E9
	"--color-indicator-error": "239 68 68", // Red-500 #EF4444
} satisfies ThemeColorMap;

const config = {
	light: vars(lightThemeMap),
	dark: vars(darkThemeMap),
};

export { config, lightThemeMap, darkThemeMap };
export type { ThemeColorMap, ThemeColorKey, ColorKey, ColorValue };
