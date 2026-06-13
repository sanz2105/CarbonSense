export const weeklyEmissions = [
  { day: 'Mon', emissions: 4.2 },
  { day: 'Tue', emissions: 5.8 },
  { day: 'Wed', emissions: 3.5 },
  { day: 'Thu', emissions: 6.2 },
  { day: 'Fri', emissions: 7.1 },
  { day: 'Sat', emissions: 4.8 },
  { day: 'Sun', emissions: 3.2 }
];

export const recentActivities = [
  {
    id: 1,
    category: 'Transport',
    description: 'Commuted by gasoline car (15 km)',
    emissions: 2.7,
    date: 'Today, 08:30 AM'
  },
  {
    id: 2,
    category: 'Food',
    description: 'Had a beef burger meal',
    emissions: 2.1,
    date: 'Today, 01:15 PM'
  },
  {
    id: 3,
    category: 'Energy',
    description: 'Ran AC for 4 hours',
    emissions: 1.8,
    date: 'Yesterday, 06:00 PM'
  },
  {
    id: 4,
    category: 'Shopping',
    description: 'Bought fast fashion t-shirt',
    emissions: 6.5,
    date: 'Yesterday, 03:30 PM'
  },
  {
    id: 5,
    category: 'Transport',
    description: 'Rode electric bicycle to grocery store (3 km)',
    emissions: 0.1,
    date: '2 days ago'
  }
];

export const categories = ['Transport', 'Food', 'Energy', 'Shopping', 'Other'];

export const emissionFactors = {
  transport: {
    Car: 0.21,
    Bus: 0.089,
    Train: 0.041,
    Flight: 0.255,
    Bike: 0.0
  },
  food: {
    'Veg meal': 1.5,
    'Non-veg meal': 3.3,
    'Beef meal': 6.8,
    'Dairy-heavy': 2.5
  },
  energy: {
    electricity: 0.82
  },
  shopping: {
    Electronics: 0.003,
    Clothing: 0.002,
    Groceries: 0.001,
    Other: 0.0015
  }
};

