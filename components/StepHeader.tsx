import React from 'react';

interface StepHeaderProps {
  step: number;
  title: string;
}

const StepHeader: React.FC<StepHeaderProps> = ({ step, title }) => {
  return (
    <div className="flex items-center space-x-3 mb-4">
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
        {step}
      </div>
      <h2 className="text-lg font-semibold text-slate-100">{title}</h2>
    </div>
  );
};

export default StepHeader;