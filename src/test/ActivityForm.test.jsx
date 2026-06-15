import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ActivityForm from '../components/ActivityForm';
import * as storage from '../utils/storage';

vi.mock('../utils/storage', () => ({
  saveActivity: vi.fn(),
}));

describe('ActivityForm Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockProps = {
    onFormChange: vi.fn(),
    onSuccess: vi.fn(),
    estimatedEmissions: 15.5
  };

  it('shows validation error for description when empty on submit', () => {
    render(<ActivityForm {...mockProps} />);
    const submitBtn = screen.getByRole('button', { name: /Add Log Entry/i });
    
    // Description is empty by default
    fireEvent.click(submitBtn);
    
    expect(screen.getByText('Description is required')).toBeInTheDocument();
    expect(storage.saveActivity).not.toHaveBeenCalled();
  });

  it('shows validation error when negative value entered for transport distance', () => {
    render(<ActivityForm {...mockProps} />);
    
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Driving' } });
    
    const distanceInput = screen.getByLabelText(/Distance \(km\)/i);
    fireEvent.change(distanceInput, { target: { value: '-5' } });
    
    const submitBtn = screen.getByRole('button', { name: /Add Log Entry/i });
    fireEvent.click(submitBtn);
    
    expect(screen.getByText('Enter distance in km (> 0)')).toBeInTheDocument();
    expect(storage.saveActivity).not.toHaveBeenCalled();
  });

  it('calls saveActivity exactly once with valid data and resets fields', () => {
    render(<ActivityForm {...mockProps} />);
    
    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Drove to work' } });
    
    const distanceInput = screen.getByLabelText(/Distance \(km\)/i);
    fireEvent.change(distanceInput, { target: { value: '15' } });
    
    const submitBtn = screen.getByRole('button', { name: /Add Log Entry/i });
    fireEvent.click(submitBtn);
    
    expect(storage.saveActivity).toHaveBeenCalledTimes(1);
    
    // Check reset
    expect(descriptionInput.value).toBe('');
    expect(distanceInput.value).toBe('');
    expect(mockProps.onSuccess).toHaveBeenCalledTimes(1);
  });
});
