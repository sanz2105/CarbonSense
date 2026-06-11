import { useState, useEffect } from 'react';
import { Calendar, Flame, CloudRain, ShieldCheck, TrendingUp, TrendingDown, History, Car, Zap, ShoppingBag, Utensils, MoreHorizontal, ArrowRight, PenLine, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../components/StatCard';
import FootprintChart from '../components/FootprintChart';
import InsightsPanel from '../components/InsightsPanel';
import { getActivities } from '../utils/storage';
import { weeklyEmissions as mockWeekly, recentActivities as mockActivities } from '../data/mockData';

// Category mapping for icons and badges
const categoryStyles = {
  Transport: { icon: Car, badge: 'bg-[#1D9E75]/10 text-[#1D9E75] border-[#1D9E75]/20' },
  Food: { icon: Utensils, badge: 'bg-green-50 text-green-700 border-green-100' },
  Energy: { icon: Zap, badge: 'bg-amber-50 text-amber-700 border-amber-100' },
  Shopping: { icon: ShoppingBag, badge: 'bg-blue-50 text-blue-700 border-blue-100' },
  Other: { icon: MoreHorizontal, badge: 'bg-gray-50 text-gray-600 border-gray-100' }
};

// Global weekly avg in kg
const GLOBAL_WEEKLY_AVG = 38.5;

// Helper: get YYYY-MM-DD string from a Date
const toDateStr = (d) => d.toISOString().substring(0, 10);

// Build the 7-day emissions array from stored activities
function buildWeeklyChart(activities) {
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
}

export default function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard — CarbonSense';
  }, []);

  const storedActivities = getActivities();
  const [activities] = useState(storedActivities);
  const [showBanner, setShowBanner] = useState(
    !sessionStorage.getItem('banner_dismissed')
  );
  const hasRealData = activities.length > 0;

  const dismissBanner = () => {
    sessionStorage.setItem('banner_dismissed', 'true');
    setShowBanner(false);
  };

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const todayStr = toDateStr(new Date());

  // ── Dynamic stat calculations ────────────────────────
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
    ? Math.round(((weeklyTotal - GLOBAL_WEEKLY_AVG) / GLOBAL_WEEKLY_AVG) * 100)
    : -12;

  // ── Recent activities (newest 5) ─────────────────────
  const recentToShow = hasRealData ? activities.slice(0, 5) : mockActivities.slice(0, 5);

  // ── Chart data ───────────────────────────────────────
  const chartData = hasRealData ? buildWeeklyChart(activities) : mockWeekly;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fadeIn">

      {/* Storage info banner — shows once per session */}
      {showBanner && (
        <div className="flex items-center justify-between gap-3 mb-6 bg-[#1D9E75]/8 border border-[#1D9E75]/20 text-[#0F6E56] rounded-xl px-4 py-3 text-sm font-medium">
          <span>💾 Your data is saved locally in this browser. It won't sync across devices or browsers.</span>
          <button
            onClick={dismissBanner}
            aria-label="Dismiss"
            className="shrink-0 p-1 hover:bg-[#1D9E75]/10 rounded-lg transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Carbon Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1 flex items-center gap-1.5 font-medium">
            <Calendar size={16} className="text-[#1D9E75]" />
            {todayDate}
          </p>
        </div>
        <span className="px-3.5 py-1.5 bg-[#1D9E75]/10 text-[#1D9E75] text-xs font-semibold rounded-full flex items-center gap-1.5 w-fit">
          <ShieldCheck size={14} />
          {vsGlobal <= 0 ? 'Eco-Score: Good 🌱' : 'Eco-Score: Needs Work ⚠️'}
        </span>
      </div>

      {/* 4 StatCards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Today's Emissions"
          value={todayEmissions.toFixed(1)}
          unit="kg CO₂"
          icon={Flame}
          trend={todayEmissions > 5.5 ? 'up' : 'down'}
          trendValue={todayEmissions > 5.5 ? 'Above avg' : 'Below avg'}
        />
        <StatCard
          title="This Week"
          value={weeklyTotal.toFixed(1)}
          unit="kg CO₂"
          icon={CloudRain}
          trend={weeklyTotal > GLOBAL_WEEKLY_AVG ? 'up' : 'down'}
          trendValue={weeklyTotal > GLOBAL_WEEKLY_AVG ? '+' + Math.abs(vsGlobal) + '% vs avg' : '-' + Math.abs(vsGlobal) + '% vs avg'}
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

      {/* Main 2/3 + 1/3 grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left — Chart + Activities */}
        <div className="lg:col-span-2 space-y-8">
          {/* Chart */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Emissions Trend</h2>
              <span className="text-xs text-[#1D9E75] font-semibold bg-[#1D9E75]/5 px-2.5 py-1 rounded-full">
                {hasRealData ? 'Live Data' : 'Sample Data'}
              </span>
            </div>
            <FootprintChart data={chartData} />
          </div>

          {/* Recent Activities */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Recent Activities</h2>
              <Link
                to="/log"
                className="text-xs text-[#1D9E75] hover:text-[#0F6E56] font-bold flex items-center gap-0.5 transition-colors"
              >
                Log New <ArrowRight size={14} />
              </Link>
            </div>

            {recentToShow.length === 0 ? (
              /* Empty state */
              <div className="bg-white rounded-[12px] border border-dashed border-gray-200 p-10 text-center shadow-sm">
                <div className="text-4xl mb-3">🌱</div>
                <h3 className="text-base font-bold text-gray-800 mb-1">No activities yet</h3>
                <p className="text-xs text-gray-500 mb-5 max-w-xs mx-auto">
                  Log your first activity to start seeing your real carbon footprint here.
                </p>
                <Link
                  to="/log"
                  className="inline-flex items-center gap-2 bg-[#1D9E75] text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-[#0F6E56] transition-colors shadow-sm"
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
        </div>

        {/* Right — AI Coach 1/3 */}
        <div className="h-full">
          <InsightsPanel />
        </div>
      </div>
    </div>
  );
}
