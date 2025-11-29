import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
  selected: AspectRatio;
  onChange: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ selected, onChange }) => {
  const ratios: { value: AspectRatio; label: string; iconClass: string }[] = [
    { value: '1:1', label: 'Square (1:1)', iconClass: 'w-6 h-6 border-2 border-current rounded-sm' },
    { value: '9:16', label: 'Portrait (9:16)', iconClass: 'w-4 h-7 border-2 border-current rounded-sm' },
    { value: '16:9', label: 'Landscape (16:9)', iconClass: 'w-7 h-4 border-2 border-current rounded-sm' },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {ratios.map((ratio) => (
        <button
          key={ratio.value}
          onClick={() => onChange(ratio.value)}
          className={`
            flex flex-col items-center justify-center p-4 rounded-xl border transition-all duration-200
            ${selected === ratio.value 
              ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/25' 
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:border-slate-600'
            }
          `}
        >
          <div className={`mb-2 ${ratio.iconClass}`}></div>
          <span className="text-sm font-medium">{ratio.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AspectRatioSelector;