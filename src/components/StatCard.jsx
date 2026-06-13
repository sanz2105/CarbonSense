import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';
import PropTypes from 'prop-types';

export default function StatCard({ title, value, unit, icon: Icon, trend = 'neutral', trendValue = '' }) {
  const isTrendDown = trend === 'down';
  const isTrendUp = trend === 'up';
  
  let trendColor = 'text-gray-500 bg-gray-50';
  let TrendIcon = Minus;

  if (isTrendDown) {
    trendColor = 'text-green-600 bg-green-50 border border-green-100';
    TrendIcon = ArrowDownRight;
  } else if (isTrendUp) {
    trendColor = 'text-red-600 bg-red-50 border border-red-100';
    TrendIcon = ArrowUpRight;
  }

  return (
    <div className="bg-white rounded-[12px] p-6 border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        {Icon && (
          <div className="p-2.5 bg-[#1D9E75]/10 rounded-xl text-[#1D9E75]">
            <Icon size={20} strokeWidth={2.2} />
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
        {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
      </div>

      {trendValue && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-xs font-semibold ${trendColor}`}>
            <TrendIcon size={14} className="shrink-0" />
            {trendValue}
          </span>
          <span className="text-xs text-gray-400">vs last period</span>
        </div>
      )}
    </div>
  );
}

StatCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string, 
    PropTypes.number
  ]).isRequired,
  unit: PropTypes.string.isRequired,
  icon: PropTypes.node,
  trend: PropTypes.oneOf(['up', 'down', 'neutral']),
  trendValue: PropTypes.string
};


