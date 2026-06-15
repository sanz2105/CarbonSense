import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { ArrowRight, PenLine, Car, Zap, ShoppingBag, Utensils, MoreHorizontal } from 'lucide-react';

const categoryStyles = {
  Transport: { icon: Car, badge: 'bg-[#166E52]/10 text-[#166E52] border-[#166E52]/20' },
  Food: { icon: Utensils, badge: 'bg-green-50 text-green-700 border-green-100' },
  Energy: { icon: Zap, badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  Shopping: { icon: ShoppingBag, badge: 'bg-blue-50 text-blue-700 border-blue-100' },
  Other: { icon: MoreHorizontal, badge: 'bg-gray-50 text-gray-600 border-gray-100' }
};

function RecentActivities({ recentToShow }) {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
        <Link
          to="/log"
          className="text-xs text-[#166E52] hover:text-[#0F6E56] font-bold flex items-center gap-0.5 transition-colors"
        >
          Log New <ArrowRight size={14} />
        </Link>
      </div>

      {recentToShow.length === 0 ? (
        <div className="bg-white rounded-[12px] border border-dashed border-gray-200 p-10 text-center shadow-sm">
          <div className="text-4xl mb-3">🌱</div>
          <h3 className="text-base font-bold text-gray-800 mb-1">No activities yet</h3>
          <p className="text-xs text-gray-500 mb-5 max-w-xs mx-auto">
            Log your first activity to start seeing your real carbon footprint here.
          </p>
          <Link
            to="/log"
            className="inline-flex items-center gap-2 bg-[#166E52] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#0F6E56] transition-colors shadow-sm"
          >
            <PenLine size={14} />
            Log Activity
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-[12px] border border-gray-100 shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-100">
            {recentToShow.map((activity, index) => {
              const style = categoryStyles[activity.category] || categoryStyles.Other;
              const Icon = style.icon;
              const badgeParts = style.badge.split(' ');
              return (
                <div
                  key={activity.id || index}
                  className={`p-4 flex items-center justify-between gap-4 transition-colors hover:bg-gray-50/80 ${index % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'}`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className={`p-2.5 rounded-xl border shrink-0 ${badgeParts[0]} ${badgeParts[1]}`}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">{activity.description}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${style.badge}`}>
                          {activity.category}
                        </span>
                        <span className="text-[11px] text-gray-400 font-medium">{activity.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-sm font-extrabold text-gray-900">{(activity.emissions || 0).toFixed(2)}</span>
                    <span className="text-[10px] font-semibold text-gray-400 block mt-0.5">kg CO₂</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

RecentActivities.propTypes = {
  recentToShow: PropTypes.array.isRequired,
};

export default React.memo(RecentActivities);
