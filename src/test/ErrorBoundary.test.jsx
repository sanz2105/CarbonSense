import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import ErrorBoundary from '../components/ErrorBoundary'

const ThrowError = () => {
  throw new Error('Test error')
}

const SafeChild = () => <div>Safe content</div>

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <SafeChild />
      </ErrorBoundary>
    )
    expect(screen.getByText('Safe content')).toBeInTheDocument()
  })

  it('renders fallback UI when child throws', () => {
    const consoleSpy = vi.spyOn(console, 'error')
      .mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(
      screen.getByText('Something went wrong')
    ).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('shows refresh button in error state', () => {
    const consoleSpy = vi.spyOn(console, 'error')
      .mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(
      screen.getByText('Refresh Page')
    ).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })
})
