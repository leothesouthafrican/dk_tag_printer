'use client';

interface TagConfig {
  portrait_landscape: string;
  tag_height: number;
  tag_width: number;
  font_size: number;
  max_characters: number;
  auto_max_characters: boolean;
}

interface ConfigPanelProps {
  config: TagConfig;
  onConfigChange: (config: TagConfig) => void;
}

export default function ConfigPanel({ config, onConfigChange }: ConfigPanelProps) {
  const updateConfig = (field: keyof TagConfig, value: any) => {
    const newConfig = { ...config, [field]: value };
    
    // Auto-calculate max characters if enabled
    if (field === 'auto_max_characters' && value) {
      newConfig.max_characters = Math.floor(newConfig.tag_width / (newConfig.font_size * 0.20));
    } else if ((field === 'tag_width' || field === 'font_size') && config.auto_max_characters) {
      newConfig.max_characters = Math.floor(newConfig.tag_width / (newConfig.font_size * 0.20));
    }
    
    onConfigChange(newConfig);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-xl font-bold mb-4">Tag Configuration</h2>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Orientation</label>
        <div className="flex gap-4">
          <label className="flex items-center">
            <input
              type="radio"
              value="P"
              checked={config.portrait_landscape === 'P'}
              onChange={(e) => updateConfig('portrait_landscape', e.target.value)}
              className="mr-2"
            />
            Portrait
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              value="L"
              checked={config.portrait_landscape === 'L'}
              onChange={(e) => updateConfig('portrait_landscape', e.target.value)}
              className="mr-2"
            />
            Landscape
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tag Height (mm)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={config.tag_height}
          onChange={(e) => updateConfig('tag_height', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tag Width (mm)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={config.tag_width}
          onChange={(e) => updateConfig('tag_width', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Font Size
        </label>
        <input
          type="number"
          min="8"
          max="100"
          value={config.font_size}
          onChange={(e) => updateConfig('font_size', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        />
      </div>

      <div>
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={config.auto_max_characters}
            onChange={(e) => updateConfig('auto_max_characters', e.target.checked)}
            className="mr-2"
          />
          Auto Max Characters
        </label>
      </div>

      {!config.auto_max_characters && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Max Characters
          </label>
          <input
            type="number"
            min="18"
            max="60"
            value={config.max_characters}
            onChange={(e) => updateConfig('max_characters', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>
      )}
    </div>
  );
}
