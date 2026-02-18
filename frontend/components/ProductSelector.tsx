'use client';

interface ProductSelectorProps {
  data: any[];
  productCodes: string[];
  selectedProducts: string[];
  onSelectionChange: (selected: string[]) => void;
  priceColumns: string[];
  selectedPriceColumn: string;
  onPriceColumnChange: (column: string) => void;
}

export default function ProductSelector({
  data,
  productCodes,
  selectedProducts,
  onSelectionChange,
  priceColumns,
  selectedPriceColumn,
  onPriceColumnChange,
}: ProductSelectorProps) {
  const handleProductToggle = (code: string) => {
    if (selectedProducts.includes(code)) {
      onSelectionChange(selectedProducts.filter((p) => p !== code));
    } else {
      onSelectionChange([...selectedProducts, code]);
    }
  };

  const handleSelectAll = () => {
    if (selectedProducts.length === productCodes.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(productCodes);
    }
  };

  const filteredData = data.filter((row) =>
    selectedProducts.includes(row.ProductCode)
  );

  return (
    <div className="space-y-6">
      {/* Price Column Selection */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-emerald-100 rounded-lg">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-slate-800">Price Column</h3>
        </div>
        <select
          value={selectedPriceColumn}
          onChange={(e) => onPriceColumnChange(e.target.value)}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-medium"
        >
          {priceColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      {/* Product Selection */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Select Products</h3>
          </div>
          <button
            onClick={handleSelectAll}
            className="btn-secondary text-sm"
          >
            {selectedProducts.length === productCodes.length ? 'Clear All' : 'Select All'}
          </button>
        </div>
        
        <div className="max-h-80 overflow-y-auto space-y-2 mb-4">
          {productCodes.map((code) => (
            <label
              key={code}
              className="flex items-center p-3 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors group"
            >
              <input
                type="checkbox"
                checked={selectedProducts.includes(code)}
                onChange={() => handleProductToggle(code)}
                className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
                {code}
              </span>
            </label>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 text-sm">
          <span className="text-slate-600">Selected:</span>
          <span className="font-semibold text-blue-600">
            {selectedProducts.length} of {productCodes.length}
          </span>
        </div>
      </div>

      {/* Preview */}
      {filteredData.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-800">Preview</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead>
                <tr>
                  {Object.keys(filteredData[0]).slice(0, 5).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider bg-slate-50 rounded-t-lg"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    {Object.values(row).slice(0, 5).map((value: any, colIdx) => (
                      <td key={colIdx} className="px-4 py-3 text-sm text-slate-700">
                        {String(value)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
