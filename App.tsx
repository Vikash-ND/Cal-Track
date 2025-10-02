
import React, { useState, useCallback } from 'react';
import { DiaryEntry as DiaryEntryType, NutritionInfo } from './types';
import { analyzeImageWithGemini } from './services/geminiService';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import NutritionCard from './components/NutritionCard';
import DailySummary from './components/DailySummary';
import DiaryEntry from './components/DiaryEntry';
import Chatbot from './components/Chatbot';
import { RefreshIcon, ChatIcon } from './components/IconComponents';

const App: React.FC = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<NutritionInfo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dailyDiary, setDailyDiary] = useState<DiaryEntryType[]>([]);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleImageSelect = useCallback((file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysisResult(null);
    setError(null);
  }, []);

  const handleAnalyzeClick = async () => {
    if (!imageFile) return;
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);
    try {
      const result = await analyzeImageWithGemini(imageFile);
      setAnalysisResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToDiary = () => {
    if (analysisResult && previewUrl) {
      const newEntry: DiaryEntryType = {
        ...analysisResult,
        id: new Date().toISOString(),
        imageUrl: previewUrl,
      };
      setDailyDiary(prev => [...prev, newEntry]);
      resetState();
    }
  };

  const resetState = () => {
    setImageFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setIsLoading(false);
    setError(null);
  };
  
  const LoadingSpinner: React.FC = () => (
    <div className="flex flex-col items-center justify-center text-white bg-gray-800 p-8 rounded-2xl">
      <svg className="animate-spin h-10 w-10 text-brand-cyan-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      <p className="text-lg font-semibold">Analyzing your meal...</p>
      <p className="text-sm text-gray-400">The AI is working its magic!</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <div className="container mx-auto max-w-lg p-4 pb-24">
        <Header />
        <main className="mt-6">
          {!imageFile && <ImageUploader onImageSelect={handleImageSelect} />}
          
          {previewUrl && !analysisResult && (
            <div className="w-full max-w-md mx-auto text-center space-y-4">
              <img src={previewUrl} alt="Food preview" className="rounded-2xl shadow-lg w-full" />
              {isLoading ? <LoadingSpinner/> : (
                <div className="flex gap-4">
                    <button onClick={resetState} className="w-full flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105">
                        <RefreshIcon className="w-5 h-5" /> Change Photo
                    </button>
                    <button onClick={handleAnalyzeClick} disabled={isLoading} className="w-full bg-brand-cyan-600 hover:bg-brand-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed">
                        Analyze
                    </button>
                </div>
              )}
            </div>
          )}

          {error && (
             <div className="w-full max-w-md mx-auto bg-red-900/50 border border-red-500 text-red-300 px-4 py-3 rounded-lg text-center" role="alert">
                <strong className="font-bold">Analysis Failed: </strong>
                <span className="block sm:inline">{error}</span>
                <button onClick={resetState} className="mt-4 bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-lg">Try Again</button>
             </div>
          )}

          {analysisResult && (
            <NutritionCard data={analysisResult} onAddToDiary={handleAddToDiary} />
          )}

          {dailyDiary.length > 0 && (
            <div className="mt-12">
              <DailySummary entries={dailyDiary} />
              <div className="w-full max-w-md mx-auto mt-6">
                <h3 className="text-xl font-bold mb-4 text-center">Today's Diary</h3>
                <div className="space-y-3">
                  {dailyDiary.map(entry => <DiaryEntry key={entry.id} entry={entry} />)}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      <button
        onClick={() => setIsChatbotOpen(true)}
        className="fixed bottom-6 right-6 bg-brand-cyan-500 hover:bg-brand-cyan-400 text-white rounded-full p-4 shadow-lg transform transition-transform hover:scale-110"
        aria-label="Open AI nutritionist chatbot"
      >
        <ChatIcon className="w-8 h-8" />
      </button>

      {isChatbotOpen && <Chatbot onClose={() => setIsChatbotOpen(false)} />}
    </div>
  );
};

export default App;
