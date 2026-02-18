'use client';

import { ChangeEvent, useState } from 'react';

interface CSVUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function CSVUploader({ onFileUpload, isLoading }: CSVUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState<string>('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('File selected:', file?.name);
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      console.error('Invalid file type');
      alert('Please upload a valid CSV file');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    console.log('File dropped:', file?.name);
    if (file && file.name.endsWith('.csv')) {
      setFileName(file.name);
      onFileUpload(file);
    } else {
      console.error('Invalid file type');
      alert('Please upload a valid CSV file');
    }
  };

  return (
    <div className="w-full">
      <label 
        className={`
          relative flex flex-col items-center justify-center w-full h-48 
          border-2 border-dashed rounded-2xl cursor-pointer 
          transition-all duration-300
          ${isDragging 
            ? 'border-blue-500 bg-blue-50/50' 
            : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/50'
          }
          ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-sm text-slate-600">Processing your file...</p>
            </>
          ) : (
            <>
              <svg className="w-12 h-12 mb-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="mb-2 text-sm font-medium text-slate-700">
                {fileName || 'Click to upload or drag and drop'}
              </p>
              <p className="text-xs text-slate-500">
                DEAR Inventory CSV export
              </p>
            </>
          )}
        </div>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={isLoading}
          className="hidden"
        />
      </label>
      {fileName && !isLoading && (
        <div className="mt-3 flex items-center text-sm text-slate-600">
          <svg className="w-4 h-4 mr-2 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          {fileName}
        </div>
      )}
    </div>
  );
}
