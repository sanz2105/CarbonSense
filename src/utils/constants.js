/**
 * @fileoverview CarbonSense application constants.
 * Centralizes all magic numbers for maintainability.
 * @module constants
 */

/** Emission reference values (kg CO₂) */
export const GLOBAL_DAILY_AVG_KG = 5.5
export const GLOBAL_WEEKLY_AVG_KG = 38.5
export const KG_CO2_PER_TREE_PER_YEAR = 21

/** Storage limits */
export const MAX_ACTIVITIES_STORED = 100
export const MAX_RESPONSE_CHARS = 10000
export const SCROLL_HINT_THRESHOLD = 400

/** API configuration */
export const RATE_LIMIT_MAX = 5
export const RATE_LIMIT_WINDOW_MS = 60 * 1000
export const MAX_INPUT_CHARS = 500
