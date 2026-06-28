'use client';

import React from 'react';
import { AlertCircle } from 'lucide-react';

export default function DashboardErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="p-5 bg-rose-950/40 border border-rose-900/50 rounded-lg text-rose-300 font-sans text-xs flex flex-col gap-3 max-w-xl">
      <div className="flex items-center gap-2 font-semibold">
        <AlertCircle size={16} className="text-rose-400" />
        Data Interruption Detected
      </div>
      <p className="text-rose-400/80 leading-relaxed font-mono text-[11px]">
        {error.message || 'Failed to compile active event observatory telemetry matrix logs.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-3 py-1 bg-rose-900/50 hover:bg-rose-900 border border-rose-800 text-white rounded cursor-pointer self-start transition-colors font-medium"
      >
        Please Retry
      </button>
    </div>
  );
}