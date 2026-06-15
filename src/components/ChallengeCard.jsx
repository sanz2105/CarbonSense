import React from 'react';
import PropTypes from 'prop-types';

function ChallengeCard({ challenge, onAddProgress, onComplete }) {
  const isCompleted = challenge.completed;

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

  const diffBadge = getDifficultyStyle(challenge.difficulty);

  return (
    <div
      className={`border rounded-[12px] p-6 shadow-sm flex flex-col justify-between transition-all duration-300 ${
        isCompleted
          ? 'bg-green-50/40 border-green-200'
          : 'bg-white border-gray-100 hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <div className="space-y-3">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-base font-bold text-gray-900 leading-snug">{challenge.title}</h2>
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

        <div className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100/50 rounded-lg px-2.5 py-1.5 w-fit">
          Saves: <span className="text-[#166E52] font-extrabold">{challenge.saving} kg CO₂</span>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        <div className="space-y-1.5">
          <div className="flex justify-between text-[11px] font-bold text-gray-400">
            <span>Progress</span>
            <span>{challenge.progress}%</span>
          </div>
          <div 
            className="w-full bg-gray-100 rounded-full h-2 overflow-hidden"
            role="progressbar"
            aria-label={`${challenge.title} progress`}
            aria-valuenow={challenge.progress}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                isCompleted ? 'bg-[#166E52]' : 'bg-[#EF9F27]'
              }`}
              style={{ width: `${challenge.progress}%` }}
            ></div>
          </div>
        </div>

        {!isCompleted && (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={() => onAddProgress(challenge.id)}
              type="button"
              aria-label={`Increase progress for ${challenge.title}`}
              className="flex-1 text-center bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-200 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
            >
              +10%
            </button>
            <button
              onClick={() => onComplete(challenge.id)}
              type="button"
              aria-label={`Mark ${challenge.title} as complete`}
              className="flex-1 text-center bg-[#166E52] hover:bg-[#0F6E56] text-white py-2 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer"
            >
              Complete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

ChallengeCard.propTypes = {
  challenge: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    title: PropTypes.string.isRequired,
    difficulty: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    saving: PropTypes.number.isRequired,
    progress: PropTypes.number.isRequired,
    completed: PropTypes.bool.isRequired,
  }).isRequired,
  onAddProgress: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
};

export default React.memo(ChallengeCard);
