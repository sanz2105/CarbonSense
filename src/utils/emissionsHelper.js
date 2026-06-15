import { emissionFactors } from '../data/mockData';
import { EMISSIONS } from '../constants';

/**
 * Helper: get YYYY-MM-DD string from a Date
 * @param {Date} d - The date object
 * @returns {string} The formatted date string
 */
const toDateStr = (d) => d.toISOString().substring(0, 10);

/**
 * Calculates total emissions for today, this week, and this month, and compares vs global average.
 * @param {Array<{date: string, emissions: number}>} activities - The list of logged activities
 * @returns {{todayEmissions: number, weeklyTotal: number, monthlyTotal: number, vsGlobal: number, avgPerDay: number}}
 */
export const calculateTotals = (activities) => {
  const hasRealData = activities && activities.length > 0;
  const todayStr = toDateStr(new Date());
  
  const todayEmissions = hasRealData
    ? activities.filter((a) => a.date === todayStr).reduce((s, a) => s + (a.emissions || 0), 0)
    : 4.2;

  const weekAgo = new Date(); weekAgo.setDate(weekAgo.getDate() - 7);
  const weeklyTotal = hasRealData
    ? activities.filter((a) => a.date >= toDateStr(weekAgo)).reduce((s, a) => s + (a.emissions || 0), 0)
    : 28.4;

  const monthStart = new Date(); monthStart.setDate(1);
  const monthlyTotal = hasRealData
    ? activities.filter((a) => a.date >= toDateStr(monthStart)).reduce((s, a) => s + (a.emissions || 0), 0)
    : 112;

  const vsGlobal = hasRealData
    ? Math.round(((weeklyTotal - EMISSIONS.GLOBAL_WEEKLY_AVG) / EMISSIONS.GLOBAL_WEEKLY_AVG) * 100)
    : -12;
    
  const avgPerDay = weeklyTotal / 7;

  return { todayEmissions, weeklyTotal, monthlyTotal, vsGlobal, avgPerDay };
};

/**
 * Builds an array of daily emission totals for the past 7 days to be used in charts.
 * @param {Array<{date: string, emissions: number}>} activities - The list of logged activities
 * @returns {Array<{day: string, emissions: number}>} Chart data array
 */
export const buildChartData = (activities) => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date();
  const result = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = toDateStr(d);
    const dayLabel = days[d.getDay()];
    const total = activities
      .filter((a) => a.date === dateStr)
      .reduce((sum, a) => sum + (a.emissions || 0), 0);
    result.push({ day: dayLabel, emissions: Math.round(total * 100) / 100 });
  }
  return result;
};

/**
 * Estimates carbon emissions based on the activity details.
 * @param {Object} details - The activity details
 * @param {string} details.category - The category of the activity
 * @param {string} [details.transportDistance] - The distance for transport activities
 * @param {string} [details.transportVehicle] - The vehicle type for transport activities
 * @param {string} [details.foodMealType] - The meal type for food activities
 * @param {string} [details.energyUsage] - The usage for energy activities
 * @param {string} [details.shoppingType] - The shopping type
 * @param {string} [details.shoppingAmount] - The shopping amount
 * @param {string} [details.otherManualCo2] - The manual override for other activities
 * @returns {number} The estimated emissions in kg CO2
 */
export const estimateEmissions = ({ category, transportDistance, transportVehicle, foodMealType, energyUsage, shoppingType, shoppingAmount, otherManualCo2 }) => {
  let emissions = 0;

  if (category === 'Transport') {
    const distance = parseFloat(transportDistance) || 0;
    const factor = emissionFactors.transport?.[transportVehicle] || 0;
    emissions = distance * factor;
  } else if (category === 'Food') {
    emissions = emissionFactors.food?.[foodMealType] || 0;
  } else if (category === 'Energy') {
    const usage = parseFloat(energyUsage) || 0;
    const factor = emissionFactors.energy?.electricity || EMISSIONS.ELECTRICITY_FACTOR_DEFAULT;
    emissions = usage * factor;
  } else if (category === 'Shopping') {
    const amount = parseFloat(shoppingAmount) || 0;
    const factor = emissionFactors.shopping?.[shoppingType] || 0;
    emissions = amount * factor;
  } else if (category === 'Other') {
    emissions = parseFloat(otherManualCo2) || 0;
  }

  return Math.round(emissions * 1000) / 1000;
};
