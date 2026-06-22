'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation'
import { useLogStream } from '../features/logs/hooks/use-log-stream';
import { LogConsole } from '../features/logs/components/log-console';
import { ErrorDistribution } from '../features/logs/components/error-distribution';
import { SystemPerformance } from '../features/logs/components/system-performance';
import { LogFilters } from '../features/logs/components/log-filters';

export default function HomePage() {
  const { logs } = useLogStream();
  
  const searchParams = useSearchParams();
  const activeLevel = searchParams.get('level') || '';
  const activeService = searchParams.get('service') || '';

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchLevel = !activeLevel || log.level === activeLevel;
      const matchService = !activeService || log.service === activeService;
      return matchLevel && matchService;
    });
  }, [logs, activeLevel, activeService]);

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Metrics Workspace</h1>
      </header>
      <LogFilters />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ErrorDistribution logs={filteredLogs} />
        </div>
        <div className="md:col-span-2">
          <SystemPerformance logs={filteredLogs} />
        </div>
      </div>
      <div className="w-full">
        <LogConsole logs={filteredLogs} />
      </div>
    </div>
  );
}