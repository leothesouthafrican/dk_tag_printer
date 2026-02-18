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
    <main className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-2 text-center">DasKasas Tag Tool</h1>
        <p className="text-center text-gray-600 mb-8">
          Generate custom price tags from DEAR Inventory CSV exports
        </p>

        <div className="mb-8">
          <CSVUploader onFileUpload={handleFileUpload} isLoading={isUploading} />
        </div>

        {csvData.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <ConfigPanel config={config} onConfigChange={setConfig} />
            </div>

            <div className="lg:col-span-2 space-y-6">
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
                <PDFGenerator
                  csvData={csvData}
                  selectedProducts={selectedProducts}
                  priceColumn={selectedPriceColumn}
                  config={config}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
