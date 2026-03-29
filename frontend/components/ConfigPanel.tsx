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
    
    if (field === 'auto_max_characters' && value) {
      newConfig.max_characters = Math.floor(newConfig.tag_width / (newConfig.font_size * 0.20));
    } else if ((field === 'tag_width' || field === 'font_size') && config.auto_max_characters) {
      newConfig.max_characters = Math.floor(newConfig.tag_width / (newConfig.font_size * 0.20));
    }
    
    onConfigChange(newConfig);
  };

  return (
    <div className="glass-card rounded-2xl p-6 space-y-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Configuration</h2>
      </div>
      
      {/* Orientation */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-3">Orientation</label>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => updateConfig('portrait_landscape', 'P')}
            className={`
              px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200
              ${config.portrait_landscape === 'P'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }
            `}
          >
            Portrait
          </button>
          <button
            onClick={() => updateConfig('portrait_landscape', 'L')}
            className={`
              px-4 py-3 rounded-lg border-2 font-medium text-sm transition-all duration-200
              ${config.portrait_landscape === 'L'
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-slate-200 hover:border-slate-300 text-slate-700'
              }
            `}
          >
            Landscape
          </button>
        </div>
      </div>

      {/* Tag Height */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tag Height (mm)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={config.tag_height}
          onChange={(e) => updateConfig('tag_height', parseFloat(e.target.value))}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Tag Width */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Tag Width (mm)
        </label>
        <input
          type="number"
          min="0"
          max="100"
          value={config.tag_width}
          onChange={(e) => updateConfig('tag_width', parseFloat(e.target.value))}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Font Size
        </label>
        <input
          type="number"
          min="8"
          max="100"
          value={config.font_size}
          onChange={(e) => updateConfig('font_size', parseInt(e.target.value))}
          className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
      </div>

      {/* Auto Max Characters */}
      <div className="pt-2 border-t border-slate-200">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={config.auto_max_characters}
            onChange={(e) => updateConfig('auto_max_characters', e.target.checked)}
            className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-500"
          />
          <span className="ml-3 text-sm font-medium text-slate-700 group-hover:text-slate-900">
            Auto Max Characters
          </span>
        </label>
      </div>

      {/* Max Characters */}
      {!config.auto_max_characters && (
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Max Characters
          </label>
          <input
            type="number"
            min="18"
            max="60"
            value={config.max_characters}
            onChange={(e) => updateConfig('max_characters', parseInt(e.target.value))}
            className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
        </div>
      )}
    </div>
  );
}
