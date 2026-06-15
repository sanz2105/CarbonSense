import '@testing-library/jest-dom';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Challenges from '../pages/Challenges';
import { clearAllData } from '../utils/storage';

describe('Challenges', () => {
  beforeEach(() => {
    clearAllData();
  });

  it('renders the challenges list without crashing', () => {
    render(<Challenges />);
    expect(screen.getByText('Eco Challenges')).toBeInTheDocument();
  });

  it('streak counter starts at 0 for a new user', () => {
    render(<Challenges />);
    expect(screen.getByText('Streak: 0 days')).toBeInTheDocument();
  });

  it('completing a challenge increments progress and streak', () => {
    render(<Challenges />);
    
    const completeButtons = screen.getAllByText('Complete');
    expect(completeButtons.length).toBeGreaterThan(0);
    
    // Click the first complete button
    fireEvent.click(completeButtons[0]);
    
    expect(screen.getByText('✅ Completed')).toBeInTheDocument();
    expect(screen.getByText('Streak: 1 days')).toBeInTheDocument();
  });
});
