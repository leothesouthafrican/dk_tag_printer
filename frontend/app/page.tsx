'use client';

import { useState } from 'react';
import axios from 'axios';
import CSVUploader from '@/components/CSVUploader';
import ConfigPanel from '@/components/ConfigPanel';
import ProductSelector from '@/components/ProductSelector';
import PDFGenerator from '@/components/PDFGenerator';

interface TagConfig {
  portrait_landscape: string;
  tag_height: number;
  tag_width: number;
  font_size: number;
  max_characters: number;
  auto_max_characters: boolean;
}

export default function Home() {
  const [isUploading, setIsUploading] = useState(false);
  const [csvData, setCsvData] = useState<any[]>([]);
  const [priceColumns, setPriceColumns] = useState<string[]>([]);
  const [productCodes, setProductCodes] = useState<string[]>([]);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [selectedPriceColumn, setSelectedPriceColumn] = useState<string>('');
  
  const [config, setConfig] = useState<TagConfig>({
    portrait_landscape: 'P',
    tag_height: 34,
    tag_width: 60,
    font_size: 8,
    max_characters: 37,
    auto_max_characters: false,
  });

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await axios.post(`${apiUrl}/api/upload-csv`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setCsvData(response.data.data);
      setPriceColumns(response.data.price_columns);
      setProductCodes(response.data.product_codes);
      setSelectedPriceColumn(response.data.price_columns[4] || response.data.price_columns[0] || '');
      setSelectedProducts([]);
    } catch (error) {
      console.error('Error uploading CSV:', error);
      alert('Error uploading CSV file. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block mb-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent mb-3">
            DasKasas Tag Tool
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Generate professional price tags from DEAR Inventory exports
          </p>
        </div>

        {/* Upload Section */}
        <div className="mb-8 glass-card rounded-2xl p-8 transition-all duration-300 hover:shadow-xl">
          <CSVUploader onFileUpload={handleFileUpload} isLoading={isUploading} />
        </div>

        {/* Main Content */}
        {csvData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Configuration Panel */}
            <div className="lg:col-span-4">
              <div className="sticky top-8">
                <ConfigPanel config={config} onConfigChange={setConfig} />
              </div>
            </div>

            {/* Product Selection & Generation */}
            <div className="lg:col-span-8 space-y-6">
              <ProductSelector
                data={csvData}
                productCodes={productCodes}
                selectedProducts={selectedProducts}
                onSelectionChange={setSelectedProducts}
                priceColumns={priceColumns}
                selectedPriceColumn={selectedPriceColumn}
                onPriceColumnChange={setSelectedPriceColumn}
              />

              {selectedProducts.length > 0 && (
                <div className="glass-card rounded-2xl p-6 transition-all duration-300 hover:shadow-xl">
                  <PDFGenerator
                    csvData={csvData}
                    selectedProducts={selectedProducts}
                    priceColumn={selectedPriceColumn}
                    config={config}
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Empty State */}
        {csvData.length === 0 && !isUploading && (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-slate-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-slate-700 mb-2">Upload a CSV to get started</h3>
            <p className="text-slate-500">Select your DEAR Inventory export file above</p>
          </div>
        )}
      </div>
    </main>
  );
}
