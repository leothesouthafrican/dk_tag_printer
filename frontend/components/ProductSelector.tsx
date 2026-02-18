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
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-3">Price Column</h3>
        <select
          value={selectedPriceColumn}
          onChange={(e) => onPriceColumnChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          {priceColumns.map((col) => (
            <option key={col} value={col}>
              {col}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">Select Products</h3>
          <button
            onClick={handleSelectAll}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {selectedProducts.length === productCodes.length ? 'Deselect All' : 'Select All'}
          </button>
        </div>
        <div className="max-h-64 overflow-y-auto space-y-2">
          {productCodes.map((code) => (
            <label key={code} className="flex items-center p-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                checked={selectedProducts.includes(code)}
                onChange={() => handleProductToggle(code)}
                className="mr-3"
              />
              <span className="text-sm">{code}</span>
            </label>
          ))}
        </div>
        <div className="mt-3 text-sm text-gray-600">
          {selectedProducts.length} of {productCodes.length} products selected
        </div>
      </div>

      {filteredData.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-3">Selected Products Preview</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {Object.keys(filteredData[0]).slice(0, 5).map((key) => (
                    <th
                      key={key}
                      className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase"
                    >
                      {key}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((row, idx) => (
                  <tr key={idx}>
                    {Object.values(row).slice(0, 5).map((value: any, colIdx) => (
                      <td key={colIdx} className="px-4 py-2 text-sm text-gray-900">
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
