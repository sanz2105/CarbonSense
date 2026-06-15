import React, { Suspense } from 'react';
import PropTypes from 'prop-types';

const FootprintChart = React.lazy(() => import('./FootprintChart'));

function WeeklyChart({ hasRealData, chartData }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Emissions Trend</h2>
        <span className="text-xs text-[#166E52] font-semibold bg-[#166E52]/5 px-2.5 py-1 rounded-full">
          {hasRealData ? 'Live Data' : 'Sample Data'}
        </span>
      </div>
      <Suspense fallback={<div className="h-40 animate-pulse bg-gray-100 rounded-xl" />}>
        <FootprintChart data={chartData} />
      </Suspense>
    </div>
  );
}

WeeklyChart.propTypes = {
  hasRealData: PropTypes.bool.isRequired,
  chartData: PropTypes.array.isRequired,
};

export default React.memo(WeeklyChart);
