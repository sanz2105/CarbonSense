import '@testing-library/jest-dom'
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatCard from '../components/StatCard'

describe('StatCard component', () => {
  it('renders title and value', () => {
    render(
      <StatCard
        title="Today's Emissions"
        value="4.2"
        unit="kg CO₂"
        trend="down"
        trendValue="12%"
      />
    )
    expect(screen.getByText("Today's Emissions")).toBeInTheDocument()
    expect(screen.getByText('4.2')).toBeInTheDocument()
    expect(screen.getByText('kg CO₂')).toBeInTheDocument()
  })

  it('shows trend value', () => {
    render(
      <StatCard
        title="Test"
        value="10"
        unit="kg"
        trend="up"
        trendValue="5%"
      />
    )
    expect(screen.getByText('5%')).toBeInTheDocument()
  })

  it('renders without crashing when trend is neutral', () => {
    render(
      <StatCard
        title="Monthly"
        value="112"
        unit="kg CO₂"
        trend="neutral"
        trendValue=""
      />
    )
    expect(screen.getByText('Monthly')).toBeInTheDocument()
  })
})
