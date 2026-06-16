import React, { useState, useEffect, useMemo } from 'react';
import { Calendar, ShieldCheck, X } from 'lucide-react';
import InsightsPanel from '../components/InsightsPanel';
import SummaryCards from '../components/SummaryCards';
import WeeklyChart from '../components/WeeklyChart';
import RecentActivities from '../components/RecentActivities';
import { getActivities } from '../utils/storage';
import { UI } from '../constants';
import { weeklyEmissions as mockWeekly, recentActivities as mockActivities } from '../data/mockData';
import { calculateTotals, buildChartData } from '../utils/emissionsHelper';

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard — CarbonSense';
  }, []);

  const [activities, setActivities] = useState(() => getActivities());
  const [isBannerVisible, setIsBannerVisible] = useState(!sessionStorage.getItem('banner_dismissed'));
  
  useEffect(() => {
    const handleActivitySaved = () => setActivities(getActivities());
    window.addEventListener('carbonsense-activity-saved', handleActivitySaved);
    return () => window.removeEventListener('carbonsense-activity-saved', handleActivitySaved);
  }, []);

  const hasRealData = activities.length > 0;

  const handleDismissBanner = () => {
    sessionStorage.setItem('banner_dismissed', 'true');
    setIsBannerVisible(false);
  };

  const todayDate = useMemo(() => 
    new Date().toLocaleDateString('en-US', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    }), 
  []);

  const { todayEmissions, weeklyTotal, monthlyTotal, vsGlobal } = useMemo(() => calculateTotals(activities), [activities]);
  const recentToShow = useMemo(() => hasRealData ? activities.slice(0, UI.RECENT_ACTIVITIES_LIMIT) : mockActivities.slice(0, UI.RECENT_ACTIVITIES_LIMIT), [activities, hasRealData]);
  const chartData = useMemo(() => hasRealData ? buildChartData(activities) : mockWeekly, [activities, hasRealData]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">
      {isBannerVisible && (
        <div className="flex items-center justify-between gap-3 mb-6 bg-[#166E52]/8 border border-[#166E52]/20 text-[#0F6E56] rounded-xl px-4 py-3 text-sm font-medium">
          <span>💾 Your data is saved locally in this browser. It won't sync across devices or browsers.</span>
          <button
            onClick={handleDismissBanner}
            aria-label="Dismiss"
            className="shrink-0 p-1 hover:bg-[#166E52]/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Carbon Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
            <Calendar size={16} className="text-[#166E52]" />
            {todayDate}
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-[#166E52]/10 text-[#166E52] text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit">
          <ShieldCheck size={14} />
          {vsGlobal <= 0 ? 'Eco-Score: Good 🌱' : 'Eco-Score: Needs Work ⚠️'}
        </span>
      </div>

      <SummaryCards 
        todayEmissions={todayEmissions}
        weeklyTotal={weeklyTotal}
        monthlyTotal={monthlyTotal}
        vsGlobal={vsGlobal}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <WeeklyChart hasRealData={hasRealData} chartData={chartData} />
          <RecentActivities recentToShow={recentToShow} />
        </div>

        <div className="h-full">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}
