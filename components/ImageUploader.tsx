
import React, { useCallback, useRef } from 'react';
import { UploadIcon, CameraIcon } from './IconComponents';

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageSelect(event.target.files[0]);
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.add('border-brand-cyan-400');
  }, []);

  const onDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-brand-cyan-400');
  }, []);

  const onDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.currentTarget.classList.remove('border-brand-cyan-400');
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
        onImageSelect(event.dataTransfer.files[0]);
    }
  }, [onImageSelect]);

  return (
    <div 
        className="w-full max-w-md mx-auto p-8 bg-gray-800 rounded-2xl shadow-2xl"
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
    >
      <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-600 rounded-xl transition-all duration-300">
        <UploadIcon className="w-16 h-16 text-gray-500 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Upload Your Meal</h2>
        <p className="text-gray-400 text-center mb-6">Drag & drop an image here or click to select a file.</p>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        <button
          onClick={handleButtonClick}
          className="w-full flex items-center justify-center gap-2 bg-brand-cyan-600 hover:bg-brand-cyan-500 text-white font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105"
        >
          <CameraIcon className="w-6 h-6" />
          <span>Choose Image</span>
        </button>
      </div>
    </div>
  );
};

export default ImageUploader;
