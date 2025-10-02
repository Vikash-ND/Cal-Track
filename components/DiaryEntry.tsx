
import React from 'react';
import { DiaryEntry as DiaryEntryType } from '../types';

interface DiaryEntryProps {
  entry: DiaryEntryType;
}

const DiaryEntry: React.FC<DiaryEntryProps> = ({ entry }) => {
  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-lg">
      <div className="flex items-center gap-4">
        <img src={entry.imageUrl} alt={entry.foodName} className="w-12 h-12 rounded-md object-cover" />
        <div>
          <p className="font-semibold capitalize text-white">{entry.foodName}</p>
          <p className="text-sm text-gray-400">{entry.portionSizeGrams}g</p>
        </div>
      </div>
      <div className="text-right">
        <p className="font-bold text-lg text-brand-cyan-400">{Math.round(entry.totalCalories)}</p>
        <p className="text-xs text-gray-500">kcal</p>
      </div>
    </div>
  );
};

export default DiaryEntry;
