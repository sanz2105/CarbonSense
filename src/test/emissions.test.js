import { describe, it, expect } from 'vitest'
import { emissionFactors } from '../data/mockData'

const calculateTransport = (km, vehicle) => {
  const factors = emissionFactors.transport || {}
  return parseFloat((km * (factors[vehicle] || 0)).toFixed(2))
}

const calculateFood = (mealType) => {
  const factors = emissionFactors.food || {}
  return factors[mealType] || 0
}

describe('emission calculations', () => {
  it('calculates car emissions correctly', () => {
    expect(calculateTransport(10, 'Car')).toBe(2.1)
  })

  it('calculates bus emissions correctly', () => {
    expect(calculateTransport(10, 'Bus')).toBe(0.89)
  })

  it('calculates train emissions correctly', () => {
    expect(calculateTransport(10, 'Train')).toBe(0.41)
  })

  it('calculates flight emissions correctly', () => {
    expect(calculateTransport(100, 'Flight')).toBe(25.5)
  })

  it('bike has zero emissions', () => {
    expect(calculateTransport(100, 'Bike')).toBe(0)
  })

  it('veg meal has lowest emissions', () => {
    expect(calculateFood('Veg meal')).toBeLessThan(calculateFood('Non-veg meal'))
    expect(calculateFood('Veg meal')).toBeLessThan(calculateFood('Beef meal'))
  })

  it('beef meal has highest emissions', () => {
    expect(calculateFood('Beef meal')).toBeGreaterThan(calculateFood('Non-veg meal'))
    expect(calculateFood('Beef meal')).toBeGreaterThan(calculateFood('Dairy-heavy'))
  })

  it('emission factors exist and non-transport are positive', () => {
    const { Bike, ...nonBike } = emissionFactors.transport || {}
    expect(Bike).toBe(0)
    
    const allFactors = [
      ...Object.values(nonBike),
      ...Object.values(emissionFactors.food || {}),
      ...Object.values(emissionFactors.energy || {}),
      ...Object.values(emissionFactors.shopping || {})
    ]
    allFactors.forEach(val => {
      expect(typeof val).toBe('number')
      expect(val).toBeGreaterThan(0)
    })
  })

  it('handles negative input values gracefully', () => {
    expect(calculateTransport(-10, 'Car')).toBe(-2.1)
  })

  it('string/NaN inputs do not throw', () => {
    expect(() => calculateTransport('abc', 'Car')).not.toThrow()
    expect(Number.isNaN(calculateTransport('abc', 'Car'))).toBe(true)
  })

  it('maximum reasonable input values do not overflow', () => {
    const maxVal = 9999999
    expect(calculateTransport(maxVal, 'Flight')).toBe(2549999.75)
  })

  it('returns 0 for bike regardless of distance', () => {
    expect(calculateTransport(0, 'Bike')).toBe(0)
    expect(calculateTransport(100, 'Bike')).toBe(0)
    expect(calculateTransport(999, 'Bike')).toBe(0)
  })

  it('handles zero distance correctly', () => {
    expect(calculateTransport(0, 'Car')).toBe(0)
    expect(calculateTransport(0, 'Flight')).toBe(0)
  })
})
