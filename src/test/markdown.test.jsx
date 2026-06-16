import { describe, it, expect } from 'vitest'
import { renderMarkdown } from '../utils/markdown'

describe('renderMarkdown utility', () => {
  it('renders plain text as paragraph', () => {
    const result = renderMarkdown('Hello world')
    expect(result).toHaveLength(1)
  })

  it('renders numbered list items', () => {
    const result = renderMarkdown('1. First item\n2. Second item')
    expect(result).toHaveLength(2)
  })

  it('renders bullet list items', () => {
    const result = renderMarkdown('- Item one\n- Item two')
    expect(result).toHaveLength(2)
  })

  it('skips empty lines', () => {
    const result = renderMarkdown('\n\nHello\n\n')
    expect(result).toHaveLength(1)
  })

  it('renders emoji header lines', () => {
    const result = renderMarkdown('🌍 Your Daily Footprint')
    expect(result).toHaveLength(1)
  })

  it('handles empty string without crashing', () => {
    const result = renderMarkdown('')
    expect(result).toHaveLength(0)
  })

  it('renders multiple sections correctly', () => {
    const input = `🌍 Footprint\nYou emitted 2kg\n\n🔥 Sources\n1. Car: 1kg\n\n💡 Tips\n- Walk more`
    const result = renderMarkdown(input)
    expect(result.length).toBeGreaterThan(3)
  })
})
