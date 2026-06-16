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
 * Saves a new activity to localStorage.
 * Prepends to existing list, capped at MAX_ACTIVITIES_STORED.
 * @param {Object} activity - The activity object to save
 * @param {string} activity.id - Unique identifier
 * @param {string} activity.category - Emission category
 * @param {number} activity.emissions - CO₂ in kg
 * @returns {boolean} True if saved successfully
 */
export const saveActivity = (activity) => {
  const existing = getActivities();
  const updated = [activity, ...existing].slice(0, MAX_ACTIVITIES_STORED);
  return safeSet(KEYS.activities, updated);
};

/**
 * Retrieves all stored activities from localStorage.
 * @returns {Array} Array of activity objects, newest first
 */
export const getActivities = () => safeGet(KEYS.activities, []);

// ── Challenges ──────────────────────────────────────────

/**
 * Saves challenge progress state to localStorage.
 * @param {Array} challenges - Array of challenge objects
 * @returns {boolean} True if saved successfully
 */
export const saveChallengeProgress = (challenges) =>
  safeSet(KEYS.challenges, challenges);

/**
 * Retrieves saved challenge progress from localStorage.
 * @returns {Array} Array of challenge objects
 */
export const getChallengeProgress = () => safeGet(KEYS.challenges, []);

// ── Streak ───────────────────────────────────────────────

/**
 * Saves the current streak count to localStorage.
 * @param {number} streak - Number of consecutive days
 * @returns {boolean} True if saved successfully
 */
export const saveStreak = (streak) => safeSet(KEYS.streak, streak);

/**
 * Retrieves the current streak count from localStorage.
 * @returns {number} Current streak, defaults to 0
 */
export const getStreak = () => safeGet(KEYS.streak, 0);

// ── Utility ──────────────────────────────────────────────

/**
 * Clears all CarbonSense data from localStorage.
 * @returns {void}
 */
export const clearAllData = () => {
  Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
};
