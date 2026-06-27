'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {  SeverityLevel } from '../schemas';

const severities: SeverityLevel[] = ['info', 'notice', 'critical', 'fatal'];
const magnitudeTresholds = [
  { label: 'All Magnitudes', value: '0' },
  { label: 'Minor Tremors (M2.5+)', value: '2.5' },
  { label: 'Strong Incidents (M4.5+)', value: '4.5' },
  { label: 'Major Catastrophes (M5.5+)', value: '5.5' },
];

export function LogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeLevel = searchParams.get('level') || '';
  const activeMinMag = searchParams.get('minMag') || '0';

  const updateFilter = (key: 'level' | 'minMag', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
   <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-900 border border-slate-800 rounded-lg select-none">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Severity Filter</label>
        <select
          value={activeLevel}
          onChange={(e) => updateFilter('level', e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-8 min-w-[140px]"
        >
          <option value="">All Severities</option>
          {severities.map((lvl) => (
            <option key={lvl} value={lvl} className="uppercase font-mono">{lvl}</option>
          ))}
        </select>
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Intensity Boundary</label>
        <select
          value={activeMinMag}
          onChange={(e) => updateFilter('minMag', e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-8 min-w-[200px]"
        >
          {magnitudeTresholds.map((thresh) => (
            <option key={thresh.value} value={thresh.value}>
              {thresh.label}
            </option>
          ))}
        </select>
      </div>

      {(activeLevel || activeMinMag !== '0') && (
        <button
          onClick={() => router.replace(pathname)}
          className="mt-5 text-[11px] font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer self-center"
        >
          Reset View
        </button>
      )}
    </div>
  );
}