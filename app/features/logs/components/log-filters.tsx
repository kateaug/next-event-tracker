'use client';

import React from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Services, LogLevel } from '../schemas';

const levels: LogLevel[] = ['info', 'warn', 'error', 'debug'];

export function LogFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeLevel = searchParams.get('level') || '';
  const activeService = searchParams.get('service') || '';

  const updateFilter = (key: 'level' | 'service', value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex flex-wrap gap-4 items-center p-4 bg-slate-900 border border-slate-800 rounded-lg select-none">
      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Severity Layer</label>
        <select
          value={activeLevel}
          onChange={(e) => updateFilter('level', e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-8 min-w-[140px]"
        >
          <option value="">All Severities</option>
          {levels.map((lvl) => (
            <option key={lvl} value={lvl} className="uppercase font-mono">
              {lvl}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-[10px] uppercase font-bold tracking-wider text-slate-400 font-mono">Microservice Origin</label>
        <select
          value={activeService}
          onChange={(e) => updateFilter('service', e.target.value)}
          className="bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-blue-500 cursor-pointer h-8 min-w-[180px]"
        >
          <option value="">All Core Modules</option>
          {Services.map((svc) => (
            <option key={svc} value={svc}>
              {svc}
            </option>
          ))}
        </select>
      </div>

      {(activeLevel || activeService) && (
        <button
          onClick={() => router.replace(pathname)}
          className="mt-5 text-[11px] font-medium text-blue-400 hover:text-blue-300 underline underline-offset-4 cursor-pointer self-center"
        >
          Reset Filters
        </button>
      )}
    </div>
  );
}