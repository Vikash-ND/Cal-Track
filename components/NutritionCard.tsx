
import React from 'react';
import { NutritionInfo } from '../types';
import { FireIcon } from './IconComponents';

interface NutritionCardProps {
  data: NutritionInfo;
  onAddToDiary: () => void;
}

const MacroBar: React.FC<{ label: string; value: number; total: number; color: string }> = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium text-gray-300">{label}</span>
        <span className="text-sm font-bold text-white">{value.toFixed(1)}g</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-2.5">
        <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
      </div>
    </div>
  );
};


const NutritionCard: React.FC<NutritionCardProps> = ({ data, onAddToDiary }) => {
  const { foodName, totalCalories, macronutrients, micronutrients, recommendations } = data;
  const { proteinG, carbohydratesG, fatG } = macronutrients;
  const totalMacros = proteinG + carbohydratesG + fatG;

  return (
    <div className="w-full max-w-md mx-auto bg-gray-800 rounded-2xl shadow-2xl p-6 text-white animate-fade-in">
      <h2 className="text-3xl font-bold text-brand-cyan-400 capitalize mb-2">{foodName}</h2>
      <div className="flex items-center gap-2 text-gray-400 mb-6">
        <FireIcon className="w-6 h-6 text-orange-400" />
        <p className="text-xl">
          <span className="font-bold text-white">{Math.round(totalCalories)}</span> calories
        </p>
        <span className="text-gray-500">|</span>
        <p className="text-lg">{Math.round(data.portionSizeGrams)}g portion</p>
      </div>

      <div className="space-y-4 mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">Macronutrients</h3>
        <MacroBar label="Protein" value={proteinG} total={totalMacros} color="bg-red-500" />
        <MacroBar label="Carbs" value={carbohydratesG} total={totalMacros} color="bg-blue-500" />
        <MacroBar label="Fat" value={fatG} total={totalMacros} color="bg-yellow-500" />
      </div>
      
      {micronutrients && micronutrients.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">Key Micronutrients</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {micronutrients.slice(0, 6).map((nutrient, index) => (
                <div key={index} className="bg-gray-700 p-2 rounded-lg flex justify-between">
                  <span className="text-gray-300">{nutrient.name}</span>
                  <span className="font-bold">{nutrient.amount}</span>
                </div>
              ))}
            </div>
          </div>
      )}

      <div className="bg-gray-900/50 p-4 rounded-lg space-y-3 mb-6">
        <h3 className="text-md font-semibold text-brand-cyan-300">AI Recommendations</h3>
        <div>
            <p className="text-sm font-medium text-gray-300">Portion Advice:</p>
            <p className="text-sm text-gray-400">{recommendations.portionAdvice}</p>
        </div>
        <div>
            <p className="text-sm font-medium text-gray-300">Healthier Alternative:</p>
            <p className="text-sm text-gray-400">{recommendations.healthierAlternative}</p>
        </div>
      </div>

      <button
        onClick={onAddToDiary}
        className="w-full bg-brand-cyan-600 hover:bg-brand-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
      >
        Add to Daily Diary
      </button>
    </div>
  );
};

export default NutritionCard;
