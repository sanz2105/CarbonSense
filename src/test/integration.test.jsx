import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import LogActivity from '../pages/LogActivity';
import Dashboard from '../pages/Dashboard';
import { clearAllData, getActivities } from '../utils/storage';

describe('Integration Tests', () => {
  beforeEach(() => {
    clearAllData();
  });

  it('saves an activity and updates dashboard stats', async () => {
    // 1. Render LogActivity
    const { unmount } = render(
      <MemoryRouter>
        <LogActivity />
      </MemoryRouter>
    );

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Drove to gym' } });

    const distanceInput = screen.getByLabelText(/Distance \(km\)/i);
    fireEvent.change(distanceInput, { target: { value: '10' } });

    const submitBtn = screen.getByRole('button', { name: /Add Log Entry/i });
    
    await act(async () => {
      fireEvent.click(submitBtn);
    });

    // 2. Read localStorage
    const activities = getActivities();
    expect(activities).toHaveLength(1);
    expect(activities[0].description).toBe('Drove to gym');
    expect(activities[0].details.distance).toBe(10);
    expect(activities[0].emissions).toBeGreaterThan(0);

    // Unmount LogActivity to clean up
    unmount();

    // 3. Render Dashboard
    render(
      <MemoryRouter>
        <Dashboard />
      </MemoryRouter>
    );

    // Assert the new total is reflected
    const valueStr = activities[0].emissions.toFixed(1);
    expect(screen.getAllByText(valueStr).length).toBeGreaterThan(0);
  });
});
