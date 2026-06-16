import { describe, it, expect, beforeEach } from 'vitest'
import {
  saveActivity,
  getActivities,
  saveChallengeProgress,
  getChallengeProgress,
  saveStreak,
  getStreak,
  clearAllData
} from '../utils/storage'

describe('storage utilities', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns empty array when no activities stored', () => {
    expect(getActivities()).toEqual([])
  })

  it('saves and retrieves a single activity', () => {
    const activity = {
      id: '1',
      category: 'Transport',
      description: 'Drove 10km',
      emissions: 2.1,
      date: '2026-06-11'
    }
    saveActivity(activity)
    const result = getActivities()
    expect(result).toHaveLength(1)
    expect(result[0].description).toBe('Drove 10km')
    expect(result[0].emissions).toBe(2.1)
  })

  it('prepends new activity to the front', () => {
    saveActivity({ id: '1', description: 'First', emissions: 1.0 })
    saveActivity({ id: '2', description: 'Second', emissions: 2.0 })
    const result = getActivities()
    expect(result[0].description).toBe('Second')
  })

  it('caps stored activities at 100', () => {
    for (let i = 0; i < 110; i++) {
      saveActivity({ id: String(i), description: `Activity ${i}`, emissions: 1 })
    }
    expect(getActivities()).toHaveLength(100)
  })

  it('saves and retrieves streak', () => {
    saveStreak(7)
    expect(getStreak()).toBe(7)
  })

  it('returns 0 streak when nothing stored', () => {
    expect(getStreak()).toBe(0)
  })

  it('saves and retrieves challenge progress', () => {
    const challenges = [{ id: 1, completed: true, progress: 100 }]
    saveChallengeProgress(challenges)
    expect(getChallengeProgress()).toEqual(challenges)
  })

  it('clearAllData removes everything', () => {
    saveActivity({ id: '1', description: 'test', emissions: 1 })
    saveStreak(5)
    clearAllData()
    expect(getActivities()).toEqual([])
    expect(getStreak()).toBe(0)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem('carbonsense_activities', 'not-valid-json')
    expect(getActivities()).toEqual([])
  })

  it('handles QuotaExceededError gracefully', () => {
    const originalSetItem = Storage.prototype.setItem
    Storage.prototype.setItem = () => {
      const err = new Error('QuotaExceededError')
      err.name = 'QuotaExceededError'
      throw err
    }
    const result = saveActivity({ 
      id: '999', 
      description: 'test', 
      emissions: 1 
    })
    Storage.prototype.setItem = originalSetItem
    expect(result).toBe(false)
  })
})
