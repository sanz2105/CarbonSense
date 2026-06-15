import React, { useState, useEffect, useCallback } from 'react';
import { Trophy, Flame, RotateCcw, ShieldCheck, TreePine } from 'lucide-react';
import { saveChallengeProgress, getChallengeProgress, saveStreak, getStreak } from '../utils/storage';
import ChallengeCard from '../components/ChallengeCard';
import { INITIAL_CHALLENGES, UI, EMISSIONS } from '../constants';

export default function Challenges() {
  useEffect(() => {
    document.title = 'Eco Challenges — CarbonSense';
  }, []);

  const [streak, setStreak] = useState(() => {
    const saved = getStreak();
    return saved !== null && saved !== undefined ? saved : 0;
  });

  const [challenges, setChallenges] = useState(() => {
    const saved = getChallengeProgress();
    return saved && saved.length > 0 ? saved : INITIAL_CHALLENGES;
  });

  useEffect(() => {
    saveStreak(streak);
  }, [streak]);

  useEffect(() => {
    saveChallengeProgress(challenges);
  }, [challenges]);

  const handleAddProgress = useCallback((id) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          const newProgress = Math.min(ch.progress + UI.PROGRESS_INCREMENT, 100);
          const isNowCompleted = newProgress === 100;
          if (isNowCompleted) {
            setStreak((s) => s + 1);
          }
          return { ...ch, progress: newProgress, completed: isNowCompleted };
        }
        return ch;
      })
    );
  }, []);

  const handleComplete = useCallback((id) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === id && !ch.completed) {
          setStreak((s) => s + 1);
          return { ...ch, progress: 100, completed: true };
        }
        return ch;
      })
    );
  }, []);

  const handleReset = useCallback(() => {
    if (window.confirm('Reset all challenges and streak to default states?')) {
      setStreak(UI.DEFAULT_STREAK);
      setChallenges(INITIAL_CHALLENGES);
    }
  }, []);

  const totalSaved = challenges
    .filter((ch) => ch.completed)
    .reduce((sum, ch) => sum + ch.saving, 0);

  const treeEquivalence = (totalSaved / EMISSIONS.TREE_CO2_ABSORPTION_KG).toFixed(2);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fadeIn space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-[#166E52]/10 rounded-xl text-[#166E52]">
            <Trophy size={28} />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Eco Challenges</h1>
            <p className="text-sm text-gray-500 mt-1">Complete challenges to reduce your footprint.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="bg-amber-50 border border-amber-100 text-amber-800 font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm text-sm">
            <Flame size={18} className="fill-amber-500 text-amber-500 animate-bounce" />
            <span>Streak: {streak} days</span>
          </div>
          
          <button
            onClick={handleReset}
            type="button"
            title="Reset Challenges"
            aria-label="Reset Challenges"
            className="p-2 bg-gray-50 text-gray-400 hover:text-gray-600 rounded-xl border border-gray-100 hover:border-gray-200 transition-colors shadow-sm cursor-pointer"
          >
            <RotateCcw size={16} aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => (
          <ChallengeCard
            key={challenge.id}
            challenge={challenge}
            onAddProgress={handleAddProgress}
            onComplete={handleComplete}
          />
        ))}
      </div>

      {/* Summary Impact Box */}
      <div className="bg-[#166E52] text-white rounded-[12px] p-6 sm:p-8 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden group">
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
