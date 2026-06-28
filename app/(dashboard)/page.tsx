'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation'
import { useLogStream } from '../features/logs/hooks/use-log-stream';
import { LogConsole } from '../features/logs/components/log-console';
import { SeverityDistribution } from '../features/logs/components/severity-distribution';
import { IntensityTimeline } from '../features/logs/components/intensity-timeline';
import { LogFilters } from '../features/logs/components/log-filters';

export default function HomePage() {
const { logs } = useLogStream();
const searchParams = useSearchParams();
const activeLevel = searchParams.get('level') || '';
const activeMinMag = Number(searchParams.get('minMag')) || 0; 

const filteredLogs = useMemo(() => {
  if (!logs || logs.length === 0) return [];
  return logs.filter((event) => {
    const matchLevel = !activeLevel || event.severity === activeLevel;
    const matchMagnitude = (event.metadata?.metricValue ?? 0) >= activeMinMag;
    return matchLevel && matchMagnitude;
  });
}, [logs, activeLevel, activeMinMag]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Earthquake Metrics Workspace</h1>
      </header>
      <LogFilters />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <SeverityDistribution logs={filteredLogs} />
        </div>
        <div className="md:col-span-2">
          <IntensityTimeline logs={filteredLogs} />
        </div>
      </div>
      <div className="w-full">
        <LogConsole logs={filteredLogs} />
      </div>
    </div>
  );
}