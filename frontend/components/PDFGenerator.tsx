'use client';

import axios from 'axios';
import { useState } from 'react';

interface TagConfig {
  portrait_landscape: string;
  tag_height: number;
  tag_width: number;
  font_size: number;
  max_characters: number;
  auto_max_characters: boolean;
}

interface PDFGeneratorProps {
  csvData: any[];
  selectedProducts: string[];
  priceColumn: string;
  config: TagConfig;
}

export default function PDFGenerator({
  csvData,
  selectedProducts,
  priceColumn,
  config,
}: PDFGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (selectedProducts.length === 0) {
      alert('Please select at least one product');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(
        `${apiUrl}/api/generate-pdf`,
        {
          csv_data: csvData,
          selected_products: selectedProducts,
          price_column: priceColumn,
          config: config,
        },
        {
          responseType: 'blob',
        }
      );

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'PriceTags.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error generating PDF:', err);
      setError(err.response?.data?.detail || 'Failed to generate PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <button
        onClick={handleGenerate}
        disabled={isGenerating || selectedProducts.length === 0}
        className={`w-full py-3 px-4 rounded-lg font-semibold text-white ${
          isGenerating || selectedProducts.length === 0
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-700'
        }`}
      >
        {isGenerating ? 'Generating PDF...' : 'Generate & Download PDF'}
      </button>
      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
