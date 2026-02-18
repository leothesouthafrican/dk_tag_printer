'use client';

import { ChangeEvent } from 'react';

interface CSVUploaderProps {
  onFileUpload: (file: File) => void;
  isLoading?: boolean;
}

export default function CSVUploader({ onFileUpload, isLoading }: CSVUploaderProps) {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith('.csv')) {
      onFileUpload(file);
    } else {
      alert('Please upload a valid CSV file');
    }
  };

  return (
    <div className="w-full">
      <label className="block mb-2 text-sm font-medium text-gray-700">
        Upload CSV Export from DEAR Inventory
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={isLoading}
        className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none p-2.5"
      />
    </div>
  );
}
