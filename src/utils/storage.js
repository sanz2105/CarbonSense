// ─────────────────────────────────────────────────────────
// CarbonSense — localStorage persistence helpers
// Robust error handling + storage quota management
// ─────────────────────────────────────────────────────────

import { MAX_ACTIVITIES_STORED } from './constants';

const KEYS = {
  activities: 'carbonsense_activities',
  challenges: 'carbonsense_challenges',
  streak: 'carbonsense_streak',
  lastVisit: 'carbonsense_last_visit',
};

const safeGet = (key, fallback) => {
  try {
    const val = localStorage.getItem(key);
    return val ? JSON.parse(val) : fallback;
  } catch {
    return fallback;
  }
};

const safeSet = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    if (e.name === 'QuotaExceededError') {
      // Free up space by clearing old activities, then retry
      localStorage.removeItem(KEYS.activities);
      try {
        localStorage.setItem(key, JSON.stringify(value));
        return true;
      } catch {
        return false;
      }
    }
    return false;
  }
};

// ── Activities ──────────────────────────────────────────

/**
 * Saves a single new activity. Keeps max 100 entries to prevent quota issues.
 * @param {{ id, category, description, emissions, date, details }} activity
 */
export const saveActivity = (activity) => {
  const existing = getActivities();
  const updated = [activity, ...existing].slice(0, MAX_ACTIVITIES_STORED);
  return safeSet(KEYS.activities, updated);
};

/**
 * Returns all logged activities (newest first).
 * @returns {Array}
 */
export const getActivities = () => safeGet(KEYS.activities, []);

// ── Challenges ──────────────────────────────────────────

/**
 * Persists the full challenges array.
 * @param {Array} challenges
 */
export const saveChallengeProgress = (challenges) =>
  safeSet(KEYS.challenges, challenges);

/**
 * Returns the saved challenges array, or empty array if never saved.
 * @returns {Array}
 */
export const getChallengeProgress = () => safeGet(KEYS.challenges, []);

// ── Streak ───────────────────────────────────────────────

/**
 * Saves the streak number.
 * @param {number} streak
 */
export const saveStreak = (streak) => safeSet(KEYS.streak, streak);

/**
 * Returns the saved streak, or 0 as default.
 * @returns {number}
 */
export const getStreak = () => safeGet(KEYS.streak, 0);

// ── Utility ──────────────────────────────────────────────

/**
 * Clears all CarbonSense data from localStorage.
 */
export const clearAllData = () => {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
};
