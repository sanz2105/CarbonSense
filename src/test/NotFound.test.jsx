import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import NotFound from '../pages/NotFound'

describe('NotFound page', () => {
  it('renders 404 message', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(
      screen.getByText('Page Not Found')
    ).toBeInTheDocument()
  })

  it('renders back to dashboard link', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(
      screen.getByText('Back to Dashboard')
    ).toBeInTheDocument()
  })

  it('sets document title on mount', () => {
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    )
    expect(document.title).toBe(
      'Page Not Found — CarbonSense'
    )
  })
})
