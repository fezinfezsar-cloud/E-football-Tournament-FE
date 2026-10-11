import React from 'react';
import { Gamepad2 } from 'lucide-react';

const LoadingSpinner = ({ fullScreen = false, message = 'Loading details...' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4 py-8">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-[#FFD600] animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Gamepad2 className="w-6 h-6 text-[#FFD600] animate-pulse" />
        </div>
      </div>
      <p className="text-sm font-medium text-zinc-400 tracking-wider uppercase">
        {message}
      </p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 bg-[#09090b]/90 backdrop-blur-md flex items-center justify-center">
        {content}
      </div>
    );
  }

  return content;
};

export default LoadingSpinner;
