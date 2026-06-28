import React from 'react';

export function LoadingSkeleton() {
  return (
    <div className="flex flex-col gap-6 animate-pulse select-none w-full">
      <header className="h-6 w-48 bg-slate-800 rounded mb-2" />
      <div className="h-16 w-full bg-slate-900 border border-slate-800 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 h-[260px] bg-slate-900 border border-slate-800 rounded-lg" />
        <div className="col-span-2 h-[260px] bg-slate-900 border border-slate-800 rounded-lg" />
      </div>
      <div className="h-[400px] w-full bg-slate-900 border border-slate-800 rounded-lg" />
    </div>
  );
}