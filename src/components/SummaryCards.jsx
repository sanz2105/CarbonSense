import React from 'react';
import PropTypes from 'prop-types';
import { Flame, CloudRain, History, TrendingUp, TrendingDown } from 'lucide-react';
import StatCard from './StatCard';
import { EMISSIONS } from '../constants';

function SummaryCards({ todayEmissions, weeklyTotal, monthlyTotal, vsGlobal }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard
        title="Today's Emissions"
        value={todayEmissions.toFixed(1)}
        unit="kg CO₂"
        icon={Flame}
        trend={todayEmissions > EMISSIONS.GLOBAL_DAILY_AVG ? 'up' : 'down'}
        trendValue={todayEmissions > EMISSIONS.GLOBAL_DAILY_AVG ? 'Above avg' : 'Below avg'}
      />
      <StatCard
        title="This Week"
        value={weeklyTotal.toFixed(1)}
        unit="kg CO₂"
        icon={CloudRain}
        trend={weeklyTotal > EMISSIONS.GLOBAL_WEEKLY_AVG ? 'up' : 'down'}
        trendValue={weeklyTotal > EMISSIONS.GLOBAL_WEEKLY_AVG ? '+' + Math.abs(vsGlobal) + '% vs avg' : '-' + Math.abs(vsGlobal) + '% vs avg'}
      />
      <StatCard
        title="Monthly Total"
        value={monthlyTotal.toFixed(0)}
        unit="kg CO₂"
        icon={History}
        trend="neutral"
        trendValue="This month"
      />
      <StatCard
        title="vs Global Avg"
        value={(vsGlobal > 0 ? '+' : '') + vsGlobal}
        unit="%"
        icon={vsGlobal <= 0 ? TrendingDown : TrendingUp}
        trend={vsGlobal <= 0 ? 'down' : 'up'}
        trendValue={vsGlobal <= 0 ? 'Below average ✅' : 'Above average ⚠️'}
      />
    </div>
  );
}

SummaryCards.propTypes = {
  todayEmissions: PropTypes.number.isRequired,
  weeklyTotal: PropTypes.number.isRequired,
  monthlyTotal: PropTypes.number.isRequired,
  vsGlobal: PropTypes.number.isRequired,
};

export default React.memo(SummaryCards);
