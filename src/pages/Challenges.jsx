import React, { useState, useEffect } from 'react';
import { Trophy, Flame, RotateCcw, AlertTriangle, ShieldCheck, TreePine } from 'lucide-react';
import { saveChallengeProgress, getChallengeProgress, saveStreak, getStreak } from '../utils/storage';

const INITIAL_CHALLENGES = [
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

export default function Challenges() {
  useEffect(() => {
    document.title = 'Eco Challenges — CarbonSense';
  }, []);

  // Streak state - persisted in localStorage via storage utils
  const [streak, setStreak] = useState(() => {
    const saved = getStreak();
    return saved !== null && saved !== undefined ? saved : 0;
  });

  // Challenges list state - persisted in localStorage via storage utils
  const [challenges, setChallenges] = useState(() => {
    const saved = getChallengeProgress();
    return saved && saved.length > 0 ? saved : INITIAL_CHALLENGES;
  });

  // Keep localStorage synced
  useEffect(() => {
    saveStreak(streak);
  }, [streak]);

  useEffect(() => {
    saveChallengeProgress(challenges);
  }, [challenges]);

  // Handle increasing progress by 10%
  const handleAddProgress = (id) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          const newProgress = Math.min(ch.progress + 10, 100);
          const isNowCompleted = newProgress === 100;
          if (isNowCompleted) {
            setStreak((s) => s + 1);
          }
          return { ...ch, progress: newProgress, completed: isNowCompleted };
        }
        return ch;
      })
    );
  };

  // Handle immediate completion
  const handleComplete = (id) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          setStreak((s) => s + 1);
          return { ...ch, progress: 100, completed: true };
        }
        return ch;
      })
    );
  };

  // Reset helper
  const handleReset = () => {
    if (window.confirm('Reset all challenges and streak to default states?')) {
      setStreak(3);
      setChallenges(INITIAL_CHALLENGES);
    }
  };

  // Calculations
  const totalSaved = challenges
    .filter((ch) => ch.completed)
    .reduce((sum, ch) => sum + ch.saving, 0);

  const treeEquivalence = (totalSaved / 21).toFixed(2);

  // Badge styles helper
  const getDifficultyStyle = (diff) => {
    switch (diff) {
      case 'Easy':
        return 'bg-green-50 text-green-700 border-green-100';
      case 'Medium':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Hard':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-100';
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#1D9E75]/10 rounded-xl text-[#1D9E75]">
            <Trophy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Eco Challenges</h1>
            <p className="text-sm text-gray-500 mt-1">Complete challenges to reduce your footprint.</p>
          </div>
        </div>

        {/* Action Panel: Streak counter & Reset */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm text-sm">
            <Flame size={18} className="fill-amber-500 text-amber-500 animate-bounce" />
            <span>Streak: {streak} days</span>
          </div>
          
          <button
            onClick={handleReset}
            type="button"
            title="Reset Challenges"
            className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      {/* Grid of Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const isCompleted = challenge.completed;
          const diffBadge = getDifficultyStyle(challenge.difficulty);

          return (
            <div
              key={challenge.id}
              className={`border rounded-[12px] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
                isCompleted
                  ? 'bg-green-50/40 border-green-200'
                  : 'bg-white border-gray-100 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              <div className="space-y-3">
                {/* Top header line */}
                <div className="flex justify-between items-start gap-4">
                  <h3 className="text-base font-bold text-gray-900 leading-snug">{challenge.title}</h3>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border uppercase tracking-wider ${diffBadge}`}>
                      {challenge.difficulty}
                    </span>
                    {isCompleted && (
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-green-100 text-green-800 border border-green-200 uppercase tracking-wider">
                        ✅ Completed
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-gray-500 font-medium leading-relaxed">
                  {challenge.description}
                </p>

                {/* Saves emission detail */}
                <div className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100/50 rounded-lg px-2.5 py-1.5 w-fit">
                  Saves: <span className="text-[#1D9E75] font-extrabold">{challenge.saving} kg CO₂</span>
                </div>
              </div>

              {/* Progress and buttons block */}
              <div className="mt-6 space-y-4">
                {/* Progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-[11px] font-bold text-gray-400">
                    <span>Progress</span>
                    <span>{challenge.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 rounded-full ${
                        isCompleted ? 'bg-[#1D9E75]' : 'bg-[#EF9F27]'
                      }`}
                      style={{ width: `${challenge.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Control Buttons */}
                {!isCompleted && (
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => handleAddProgress(challenge.id)}
                      type="button"
                      aria-label={`Increase progress for ${challenge.title}`}
                      className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      +10%
                    </button>
                    <button
                      onClick={() => handleComplete(challenge.id)}
                      type="button"
                      aria-label={`Mark ${challenge.title} as complete`}
                      className="flex-1 text-center bg-[#1D9E75] hover:bg-[#0F6E56] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
                    >
                      Complete
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Impact Box */}
      <div className="bg-[#1D9E75] text-white rounded-[12px] p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        {/* Soft decorative visual element */}
        <div className="absolute right-0 bottom-0 w-36 h-36 bg-white/5 rounded-full blur-xl group-hover:scale-110 transition-transform duration-500"></div>

        <div className="space-y-2.5 text-center sm:text-left">
          <h2 className="text-xl font-bold flex items-center justify-center sm:justify-start gap-2">
            <ShieldCheck size={24} />
            Your Impact Summary
          </h2>
          <p className="text-xs text-white/80 font-medium max-w-md">
            Every green choice reduces emissions. By completing eco challenges, you have directly decreased your environmental footprint.
          </p>
        </div>

        <div className="flex items-center gap-6 divide-x divide-white/20 shrink-0">
          <div className="text-center pl-0">
            <span className="text-3xl font-black block tracking-tight">{totalSaved.toFixed(1)}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 mt-0.5 block">CO₂ Saved (kg)</span>
          </div>
          <div className="text-center pl-6 flex flex-col items-center justify-center">
            <TreePine size={22} className="text-[#639922] mb-1 animate-pulse" />
            <span className="text-2xl font-black block tracking-tight">{treeEquivalence}</span>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/75 mt-0.5 block">Tree Equivalents</span>
          </div>
        </div>
      </div>
    </div>
  );
}
