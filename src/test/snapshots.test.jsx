import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Flame } from 'lucide-react';
import StatCard from '../components/StatCard';
import ChallengeCard from '../components/ChallengeCard';
import EmissionsPreview from '../components/EmissionsPreview';

describe('Snapshot Tests', () => {
  it('StatCard matches snapshot', () => {
    const { asFragment } = render(
      <StatCard 
        title="Test Stat" 
        value="42" 
        unit="kg" 
        icon={Flame} 
        trend="up" 
        trendValue="Above avg" 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('ChallengeCard matches snapshot', () => {
    const mockChallenge = {
      id: '1',
      title: 'Bike to work',
      difficulty: 'Medium',
      description: 'Use a bike',
      saving: 5.5,
      progress: 50,
      completed: false,
    };
    const { asFragment } = render(
      <ChallengeCard 
        challenge={mockChallenge} 
        onAddProgress={() => {}} 
        onComplete={() => {}} 
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('EmissionsPreview with value=0 matches snapshot', () => {
    const { asFragment } = render(
      <EmissionsPreview 
        estimatedEmissions={0} 
        category="Transport"
        transportDistance=""
        transportVehicle="Car"
        foodMealType="Veg meal"
        energyUsage=""
        shoppingType="Electronics"
        shoppingAmount=""
        otherManualCo2=""
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('EmissionsPreview with value=12.5 matches snapshot', () => {
    const { asFragment } = render(
      <EmissionsPreview 
        estimatedEmissions={12.5} 
        category="Transport"
        transportDistance="10"
        transportVehicle="Car"
        foodMealType="Veg meal"
        energyUsage=""
        shoppingType="Electronics"
        shoppingAmount=""
        otherManualCo2=""
      />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
