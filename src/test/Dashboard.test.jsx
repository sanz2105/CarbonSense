import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import { saveActivity, clearAllData } from '../utils/storage';

describe('Dashboard', () => {
  beforeEach(() => {
    clearAllData();
    sessionStorage.clear();
  });

  const renderDashboard = () => {
    return render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    );
  };

  it('renders without crashing when localStorage is empty', () => {
    renderDashboard();
    expect(screen.getByText('Your Carbon Dashboard')).toBeInTheDocument();
  });

  it('shows "Sample Data" or equivalent empty state when there are no activities', () => {
    renderDashboard();
    expect(screen.getByText('Sample Data')).toBeInTheDocument();
  });

  it('displays the correct total when activities are seeded into localStorage before render', () => {
    const today = new Date().toISOString().substring(0, 10);
    saveActivity({
      id: 'test-1',
      category: 'Transport',
      description: 'Drove car',
      date: today,
      emissions: 15.5
    });

    renderDashboard();
    const elements = screen.getAllByText('15.5');
    expect(elements.length).toBeGreaterThan(0);
    expect(screen.queryByText('Sample Data')).not.toBeInTheDocument();
  });
});
