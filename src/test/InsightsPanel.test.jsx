import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import InsightsPanel from '../components/InsightsPanel';

// Mock fetch globally
global.fetch = vi.fn();

describe('InsightsPanel Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it('shows error message when API call is rejected', async () => {
    fetch.mockRejectedValueOnce(new Error('Network failure'));

    render(<InsightsPanel />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Get Insights/i });

    fireEvent.change(input, { target: { value: 'I ate a burger' } });
    
    await act(async () => {
      fireEvent.click(button);
    });

    expect(await screen.findByText(/Could not connect to AI Coach/i)).toBeInTheDocument();
    expect(screen.getByText(/Network failure/i)).toBeInTheDocument();
  });

  it('shows loading spinner while Promise is pending', async () => {
    vi.useFakeTimers();
    let resolvePromise;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });

    fetch.mockReturnValueOnce(promise);

    render(<InsightsPanel />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Get Insights/i });

    fireEvent.change(input, { target: { value: 'I drove my car' } });
    
    fireEvent.click(button);

    // After clicking, spinner and "Gemini is calculating" should be visible
    expect(screen.getByText(/Gemini is calculating your impact/i)).toBeInTheDocument();
    expect(screen.getByText(/Analyzing/i)).toBeInTheDocument();

    await act(async () => {
      resolvePromise({
        ok: true,
        json: async () => ({ result: 'Done calculating' })
      });
      // advance timers if necessary, though fetching is microtask
      await vi.runAllTimersAsync();
    });

    expect(screen.queryByText(/Gemini is calculating your impact/i)).not.toBeInTheDocument();
  });

  it('renders markdown response properly instead of raw asterisks', async () => {
    fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        result: 'Here is your insight:\n**bold text** and *italic text*\n- bullet one\n- bullet two'
      })
    });

    render(<InsightsPanel />);
    const input = screen.getByRole('textbox');
    const button = screen.getByRole('button', { name: /Get Insights/i });

    fireEvent.change(input, { target: { value: 'I drove my car' } });
    
    await act(async () => {
      fireEvent.click(button);
    });

    // We shouldn't see raw **bold text**
    expect(screen.queryByText(/\*\*bold text\*\*/)).not.toBeInTheDocument();
    expect(screen.queryByText(/\*italic text\*/)).not.toBeInTheDocument();
    
    // We should see rendered <strong> and <em>
    const boldElement = screen.getByText('bold text');
    expect(boldElement.tagName).toBe('STRONG');
    
    const italicElement = screen.getByText('italic text');
    expect(italicElement.tagName).toBe('EM');
    
    // Bullet items
    expect(screen.getByText('bullet one')).toBeInTheDocument();
  });
});
