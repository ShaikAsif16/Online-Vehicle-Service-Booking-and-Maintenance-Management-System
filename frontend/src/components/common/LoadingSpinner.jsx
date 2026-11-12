import React from 'react';
import { Wrench } from 'lucide-react';

const LoadingSpinner = ({ text = 'Loading precision automotive data...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 space-y-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-dark-700 border-t-automotive-orange animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-automotive-orange">
          <Wrench className="w-6 h-6 animate-pulse" />
        </div>
      </div>
      <p className="text-slate-400 text-sm font-medium tracking-wide animate-pulse">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
