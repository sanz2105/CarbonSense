import React from 'react';
import PropTypes from 'prop-types';
import { EMISSIONS } from '../constants';

function EmissionsPreview({
  estimatedEmissions,
  category,
  transportDistance,
  foodMealType,
  energyUsage,
  shoppingAmount,
  otherManualCo2,
}) {
  return (
    <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm p-6 sticky top-24 space-y-6">
      <h2 className="text-lg font-bold text-gray-900">Calculated Impact</h2>
      
      <div className="bg-[#F8FAF9] rounded-2xl border border-gray-100 p-6 flex flex-col items-center justify-center text-center py-10 transition-all duration-500 hover:shadow-inner relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#166E52]/5 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500"></div>
        
        <span className="text-xs font-extrabold uppercase tracking-widest text-[#166E52] bg-[#166E52]/5 px-3 py-1 rounded-full border border-[#166E52]/10 mb-4">
          Estimated Emissions
        </span>
        
        <div className="flex items-baseline justify-center gap-1.5 mb-1.5">
          <span className="text-5xl font-black text-gray-900 tracking-tight transition-all duration-300">
            {estimatedEmissions}
          </span>
          <span className="text-base font-extrabold text-gray-400">kg</span>
        </div>
        <span className="text-xs font-semibold text-gray-500">CO₂ Equivalent</span>

        {estimatedEmissions > 0 && (
          <div className="mt-6 pt-5 border-t border-gray-200/60 w-full text-left space-y-2.5 animate-fadeIn">
            <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400">Environmental Equivalence</p>
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                🌲 <span>Requires <b>{Math.max(1, Math.round(estimatedEmissions * EMISSIONS.TREE_DAYS_MULTIPLIER * 10) / 10)}</b> tree-days to absorb</span>
              </p>
              <p className="text-xs font-semibold text-gray-700 flex items-center gap-2">
                💡 <span>Same as running a LED bulb for <b>{Math.round(estimatedEmissions * EMISSIONS.LED_HOURS_MULTIPLIER)}</b> hours</span>
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-[#166E52]/5 border border-[#166E52]/10 rounded-xl">
        <h2 className="text-xs font-bold text-[#166E52] uppercase tracking-wider mb-1">Calculation Method</h2>
        <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
          {category === 'Transport' && `Calculated as: Distance (${transportDistance || 0} km) × Factor based on vehicle selection.`}
          {category === 'Food' && `Static factor based on average regional food-cycle emissions for a ${foodMealType}.`}
          {category === 'Energy' && `Calculated as: Electricity (${energyUsage || 0} kWh) × Factor (${EMISSIONS.ELECTRICITY_FACTOR_DEFAULT} kg/kWh).`}
          {category === 'Shopping' && `Calculated as: Amount spent (₹${shoppingAmount || 0}) × Item-cycle multiplier.`}
          {category === 'Other' && `Direct emissions override entered manually: ${otherManualCo2 || 0} kg CO₂.`}
        </p>
      </div>
    </div>
  );
}

EmissionsPreview.propTypes = {
  estimatedEmissions: PropTypes.number.isRequired,
  category: PropTypes.string.isRequired,
  transportDistance: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  foodMealType: PropTypes.string.isRequired,
  energyUsage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  shoppingAmount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  otherManualCo2: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default React.memo(EmissionsPreview);
