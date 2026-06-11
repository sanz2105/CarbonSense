import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { weeklyEmissions as defaultData } from '../data/mockData';
import PropTypes from 'prop-types';

// Custom Tooltip component to display "{day}: {value} kg CO₂"
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const { day, emissions } = payload[0].payload;
    return (
      <div className="bg-white px-3 py-2 border border-gray-100 rounded-xl shadow-md text-xs font-semibold text-gray-800">
        <span className="text-gray-900">{day}: </span>
        <span className="text-[#1D9E75] font-bold">{emissions} kg CO₂</span>
      </div>
    );
  }
  return null;
};

export default function FootprintChart({ data }) {
  const chartData = data || defaultData;
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-950">Weekly Emissions</h3>
          <p className="text-xs text-gray-500 font-medium">Daily CO₂ output compared against global daily target</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-[#1D9E75]"></span>
            Emissions (kg)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-0.5 border-t-2 border-dashed border-[#EF9F27]"></span>
            Global Daily Avg (5.5)
          </span>
        </div>
      </div>

      <div className="w-full" style={{ height: 280 }}>
        <div role="img" aria-label="Bar chart showing weekly CO₂ emissions in kilograms for the past 7 days" style={{ width: '100%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 5, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
              <XAxis 
                dataKey="day" 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                domain={[0, 10]} 
                tick={{ fill: '#9ca3af', fontSize: 12, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                ticks={[0, 2, 4, 6, 8, 10]}
              />
              <Tooltip 
                content={<CustomTooltip />} 
                cursor={{ fill: '#f8faf9', opacity: 0.8 }} 
              />
              <Legend verticalAlign="bottom" height={1} content={() => null} />
              <ReferenceLine 
                y={5.5} 
                stroke="#EF9F27" 
                strokeDasharray="4 4" 
                strokeWidth={1.5}
                label={{
                  value: 'Global Avg',
                  position: 'insideBottomRight',
                  fill: '#EF9F27',
                  fontSize: 10,
                  fontWeight: 600,
                  offset: 6
                }}
              />
              <Bar 
                dataKey="emissions" 
                fill="#1D9E75" 
                radius={[6, 6, 0, 0]}
                maxBarSize={44}
                activeBar={{ fill: '#0F6E56' }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="sr-only">
          Weekly emissions chart showing your daily carbon footprint.
          Log activities to see your data update here.
        </p>
      </div>
    </div>
  );
}

FootprintChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      day: PropTypes.string.isRequired,
      emissions: PropTypes.number.isRequired
    })
  )
};
