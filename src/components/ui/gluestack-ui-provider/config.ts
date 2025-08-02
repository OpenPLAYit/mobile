/** @format */

import { vars } from "nativewind";

type ColorKey = `--color-${string}-${string}`;
type ColorValue = `${number} ${number} ${number}`;
type ColorMap = Record<ColorKey, ColorValue>;

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
	/* Primary - Tailwind blue */
	"--color-primary-0": "1 1 8", // blue-dark #010108
	"--color-primary-50": "12 16 42", // blue-950 #0c102a
	"--color-primary-100": "23 37 84", // blue-900 #172554
	"--color-primary-200": "30 64 175", // blue-800 #1e40af
	"--color-primary-300": "29 78 216", // blue-700 #1d4ed8
	"--color-primary-400": "37 99 235", // blue-600 #2563eb
	"--color-primary-500": "59 130 246", // blue-500 #3b82f6
	"--color-primary-600": "96 165 250", // blue-400 #60a5fa
	"--color-primary-700": "147 197 253", // blue-300 #93c5fd
	"--color-primary-800": "191 219 254", // blue-200 #bfdbfe
	"--color-primary-900": "219 234 254", // blue-100 #dbeafe
	"--color-primary-950": "239 246 255", // blue-50 #eff6ff

	/* Secondary - Tailwind slate */
	"--color-secondary-0": "1 1 8", // blue-dark #010108
	"--color-secondary-50": "2 6 23", // slate-950 #020617
	"--color-secondary-100": "15 23 42", // slate-900 #0f172a
	"--color-secondary-200": "30 41 59", // slate-800 #1e293b
	"--color-secondary-300": "51 65 85", // slate-700 #334155
	"--color-secondary-400": "71 85 105", // slate-600 #475569
	"--color-secondary-500": "100 116 139", // slate-500 #64748b
	"--color-secondary-600": "148 163 184", // slate-400 #94a3b8
	"--color-secondary-700": "203 213 225", // slate-300 #cbd5e1
	"--color-secondary-800": "226 232 240", // slate-200 #e2e8f0
	"--color-secondary-900": "241 245 249", // slate-100 #f1f5f9
	"--color-secondary-950": "248 250 252", // slate-50 #f8fafc

	/* Tertiary - Tailwind gray */
	"--color-tertiary-0": "3 7 18", // gray-950 #030712
	"--color-tertiary-50": "3 7 18", // gray-950 #030712
	"--color-tertiary-100": "17 24 39", // gray-900 #111827
	"--color-tertiary-200": "31 41 55", // gray-800 #1f2937
	"--color-tertiary-300": "55 65 81", // gray-700 #374151
	"--color-tertiary-400": "75 85 99", // gray-600 #4b5563
	"--color-tertiary-500": "107 114 128", // gray-500 #6b7280
	"--color-tertiary-600": "156 163 175", // gray-400 #9ca3af
	"--color-tertiary-700": "209 213 219", // gray-300 #d1d5db
	"--color-tertiary-800": "229 231 235", // gray-200 #e5e7eb
	"--color-tertiary-900": "243 244 246", // gray-100 #f3f4f6
	"--color-tertiary-950": "249 250 251", // gray-50 #f9fafb

	/* Error - Tailwind red */
	"--color-error-0": "45 7 10", // red-950 #2c0508
	"--color-error-50": "45 7 10", // red-950 #2c0508
	"--color-error-100": "69 10 16", // red-900 #450a0a
	"--color-error-200": "99 15 25", // red-800 #660e18
	"--color-error-300": "153 27 27", // red-700 #991b1b
	"--color-error-400": "185 28 28", // red-600 #b91c1c
	"--color-error-500": "220 38 38", // red-500 #dc2626
	"--color-error-600": "239 68 68", // red-400 #ef4444
	"--color-error-700": "252 165 165", // red-300 #fca5a5
	"--color-error-800": "254 205 205", // red-200 #fecaca
	"--color-error-900": "254 226 226", // red-100 #fee2e2
	"--color-error-950": "254 242 242", // red-50 #fef2f2

	/* Success - Tailwind green */
	"--color-success-0": "5 16 12", // green-950 #05100c
	"--color-success-50": "5 16 12", // green-950 #05100c
	"--color-success-100": "6 78 59", // green-900 #064e3b
	"--color-success-200": "21 128 61", // green-800 #15803d
	"--color-success-300": "22 163 74", // green-700 #16a34a
	"--color-success-400": "34 197 94", // green-600 #22c55e
	"--color-success-500": "74 222 128", // green-500 #4ade80
	"--color-success-600": "134 239 172", // green-400 #86efac
	"--color-success-700": "187 247 208", // green-300 #bbf7d0
	"--color-success-800": "209 250 229", // green-200 #d1fae5
	"--color-success-900": "220 252 231", // green-100 #dcfce7
	"--color-success-950": "240 253 244", // green-50 #f0fdf4

	/* Warning - Tailwind amber */
	"--color-warning-0": "25 18 10", // amber-950 #19120a
	"--color-warning-50": "25 18 10", // amber-950 #19120a
	"--color-warning-100": "77 47 17", // amber-900 #4d2f11
	"--color-warning-200": "120 53 15", // amber-800 #78350f
	"--color-warning-300": "180 83 9", // amber-700 #b45309
	"--color-warning-400": "217 119 6", // amber-600 #d97706
	"--color-warning-500": "245 158 11", // amber-500 #f59e0b
	"--color-warning-600": "251 191 36", // amber-400 #fbbf24
	"--color-warning-700": "253 224 71", // amber-300 #fde047
	"--color-warning-800": "254 243 199", // amber-200 #fef3c7
	"--color-warning-900": "255 249 216", // amber-100 #fffbe7
	"--color-warning-950": "255 251 235", // amber-50 #fffbeb

	/* Info - Tailwind sky */
	"--color-info-0": "7 14 28", // sky-950 #070e1c
	"--color-info-50": "7 14 28", // sky-950 #070e1c
	"--color-info-100": "8 47 70", // sky-900 #082f49
	"--color-info-200": "14 116 144", // sky-800 #0e7490
	"--color-info-300": "19 154 185", // sky-700 #1399b9
	"--color-info-400": "14 165 233", // sky-600 #0ea5e9
	"--color-info-500": "56 189 248", // sky-500 #38bdf8
	"--color-info-600": "125 211 252", // sky-400 #7dd3fc
	"--color-info-700": "186 230 253", // sky-300 #bae6fd
	"--color-info-800": "224 242 254", // sky-200 #e0f2fe
	"--color-info-900": "239 246 255", // sky-100 #eff6ff
	"--color-info-950": "240 249 255", // sky-50 #f0f9ff

	/* Typography - Tailwind slate */
	"--color-typography-0": "1 1 8", // blue-dark #010108
	"--color-typography-50": "2 6 23", // slate-950 #020617
	"--color-typography-100": "15 23 42", // slate-900 #0f172a
	"--color-typography-200": "30 41 59", // slate-800 #1e293b
	"--color-typography-300": "51 65 85", // slate-700 #334155
	"--color-typography-400": "71 85 105", // slate-600 #475569
	"--color-typography-500": "100 116 139", // slate-500 #64748b
	"--color-typography-600": "148 163 184", // slate-400 #94a3b8
	"--color-typography-700": "203 213 225", // slate-300 #cbd5e1
	"--color-typography-800": "226 232 240", // slate-200 #e2e8f0
	"--color-typography-900": "241 245 249", // slate-100 #f1f5f9
	"--color-typography-950": "248 250 252", // slate-50 #f8fafc

	/* Outline - Tailwind slate */
	"--color-outline-0": "1 1 8", // blue-dark #010108
	"--color-outline-50": "2 6 23", // slate-950 #020617
	"--color-outline-100": "15 23 42", // slate-900 #0f172a
	"--color-outline-200": "30 41 59", // slate-800 #1e293b
	"--color-outline-300": "51 65 85", // slate-700 #334155
	"--color-outline-400": "71 85 105", // slate-600 #475569
	"--color-outline-500": "100 116 139", // slate-500 #64748b
	"--color-outline-600": "148 163 184", // slate-400 #94a3b8
	"--color-outline-700": "203 213 225", // slate-300 #cbd5e1
	"--color-outline-800": "226 232 240", // slate-200 #e2e8f0
	"--color-outline-900": "241 245 249", // slate-100 #f1f5f9
	"--color-outline-950": "248 250 252", // slate-50 #f8fafc

	/* Background - Tailwind slate */
	"--color-background-0": "1 1 8", // blue-dark #010108
	"--color-background-50": "2 6 23", // slate-950 #020617
	"--color-background-100": "15 23 42", // slate-900 #0f172a
	"--color-background-200": "30 41 59", // slate-800 #1e293b
	"--color-background-300": "51 65 85", // slate-700 #334155
	"--color-background-400": "71 85 105", // slate-600 #475569
	"--color-background-500": "100 116 139", // slate-500 #64748b
	"--color-background-600": "148 163 184", // slate-400 #94a3b8
	"--color-background-700": "203 213 225", // slate-300 #cbd5e1
	"--color-background-800": "226 232 240", // slate-200 #e2e8f0
	"--color-background-900": "241 245 249", // slate-100 #f1f5f9
	"--color-background-950": "248 250 252", // slate-50 #f8fafc

	/* Background Special */
	"--color-background-error": "85 15 15", // Red-50 #550F0F
	"--color-background-warning": "80 50 10", // Yellow-50 #50320A
	"--color-background-success": "5 50 25", // Green-50 #053219
	"--color-background-muted": "15 15 15", // Deep Gray #0F0F0F
	"--color-background-info": "8 47 73", // Sky-50 #082F49

	/* Focus Ring Indicator */
	"--color-indicator-primary": "160 160 160", // Gray-600 #A0A0A0
	"--color-indicator-info": "14 165 233", // Sky-500 #0EA5E9
	"--color-indicator-error": "239 68 68", // Red-500 #EF4444
} satisfies ThemeColorMap;

const config = {
	light: vars(lightThemeMap),
	dark: vars(darkThemeMap),
};

export { config, lightThemeMap, darkThemeMap };
export type { ThemeColorMap, ThemeColorKey, ColorKey, ColorValue };
