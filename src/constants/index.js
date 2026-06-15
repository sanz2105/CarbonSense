export const EMISSIONS = {
  GLOBAL_WEEKLY_AVG: 38.5,
  GLOBAL_DAILY_AVG: 5.5,
  TREE_DAYS_MULTIPLIER: 0.045,
  LED_HOURS_MULTIPLIER: 110,
  ELECTRICITY_FACTOR_DEFAULT: 0.82,
  TREE_CO2_ABSORPTION_KG: 21,
};

export const UI = {
  MAX_DESCRIPTION_LENGTH: 200,
  TOAST_DURATION_MS: 1500,
  DEFAULT_STREAK: 3,
  PROGRESS_INCREMENT: 10,
  CHART_TICK_COUNT: 5,
  RECENT_ACTIVITIES_LIMIT: 5,
};

export const COLORS = {
  PRIMARY_GREEN: '#166E52',
  PRIMARY_HOVER: '#0F6E56',
  WARNING_ORANGE: '#EF9F27',
  TREE_GREEN: '#639922',
};

export const CATEGORIES = {
  TRANSPORT: 'Transport',
  FOOD: 'Food',
  ENERGY: 'Energy',
  SHOPPING: 'Shopping',
  OTHER: 'Other',
};

export const INITIAL_CHALLENGES = [
  {
    id: 1,
    title: 'Go Car-Free Day',
    description: 'Avoid car travel for a full day. Use walking, biking, or work from home.',
    saving: 3.2,
    difficulty: 'Easy',
    progress: 0,
    completed: false,
  },
  {
    id: 2,
    title: 'Plant-Based Meals',
    description: 'Eat only plant-based foods (fruits, vegetables, grains, legumes) today.',
    saving: 4.8,
    difficulty: 'Easy',
    progress: 0,
    completed: false,
  },
  {
    id: 3,
    title: 'Unplug Standby Devices',
    description: 'Unplug chargers, appliances, and devices not actively in use.',
    saving: 0.5,
    difficulty: 'Easy',
    progress: 0,
    completed: false,
  },
  {
    id: 4,
    title: '5-Minute Shower',
    description: 'Limit your shower time to 5 minutes to conserve hot water and heating energy.',
    saving: 0.3,
    difficulty: 'Easy',
    progress: 0,
    completed: false,
  },
  {
    id: 5,
    title: 'Zero Waste Day',
    description: 'Produce no landfill waste today. Recycle, compost, and reuse everything.',
    saving: 1.2,
    difficulty: 'Medium',
    progress: 0,
    completed: false,
  },
  {
    id: 6,
    title: 'Public Transport Week',
    description: 'Use only public buses, trains, or carpools for all transit over 7 days.',
    saving: 22.0,
    difficulty: 'Hard',
    progress: 0,
    completed: false,
  },
];
