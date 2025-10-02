import React from 'react';
import { DiaryEntry } from '../types';

interface DailySummaryProps {
  entries: DiaryEntry[];
}

const DailySummary: React.FC<DailySummaryProps> = ({ entries }) => {
  const dailyGoal = 2000;

  const totals = entries.reduce(
    (acc, entry) => {
      acc.calories += entry.totalCalories;
      acc.protein += entry.macronutrients.proteinG;
      acc.carbs += entry.macronutrients.carbohydratesG;
      acc.fat += entry.macronutrients.fatG;
      return acc;
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  );

  const progress = Math.min((totals.calories / dailyGoal) * 100, 100);

  const totalMacros = totals.protein + totals.carbs + totals.fat;
  const proteinPercentage = totalMacros > 0 ? (totals.protein / totalMacros) * 100 : 0;
  const carbsPercentage = totalMacros > 0 ? (totals.carbs / totalMacros) * 100 : 0;
  const fatPercentage = totalMacros > 0 ? (totals.fat / totalMacros) * 100 : 0;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 text-white mt-8">
      <h2 className="text-2xl font-bold text-center mb-4">Daily Summary</h2>
      <div className="flex justify-center items-center mb-6">
        <div className="relative w-32 h-32">
          <svg className="w-full h-full" viewBox="0 0 36 36">
            <path
              className="text-gray-700"
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            />
            <path
              className="text-brand-cyan-400"
              strokeDasharray={`${progress}, 100`}
              d="M18 2.0845
                a 15.9155 15.9155 0 0 1 0 31.831
                a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              transform="rotate(90 18 18)"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{Math.round(totals.calories)}</span>
            <span className="text-sm text-gray-400">/ {dailyGoal} kcal</span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 text-center mb-6">
        <div>
          <p className="text-sm text-red-400">Protein</p>
          <p className="text-lg font-bold">{totals.protein.toFixed(1)}g</p>
        </div>
        <div>
          <p className="text-sm text-blue-400">Carbs</p>
          <p className="text-lg font-bold">{totals.carbs.toFixed(1)}g</p>
        </div>
        <div>
          <p className="text-sm text-yellow-400">Fat</p>
          <p className="text-lg font-bold">{totals.fat.toFixed(1)}g</p>
        </div>
      </div>
      
      <div>
        <h3 className="text-md font-semibold text-center text-gray-400 mb-2">Macronutrient Distribution</h3>
        <div className="flex w-full h-3 rounded-full overflow-hidden bg-gray-700">
            <div className="bg-red-500 transition-all duration-500" style={{ width: `${proteinPercentage}%` }} title={`Protein: ${proteinPercentage.toFixed(1)}%`}></div>
            <div className="bg-blue-500 transition-all duration-500" style={{ width: `${carbsPercentage}%` }} title={`Carbs: ${carbsPercentage.toFixed(1)}%`}></div>
            <div className="bg-yellow-500 transition-all duration-500" style={{ width: `${fatPercentage}%` }} title={`Fat: ${fatPercentage.toFixed(1)}%`}></div>
        </div>
      </div>
    </div>
  );
};

export default DailySummary;