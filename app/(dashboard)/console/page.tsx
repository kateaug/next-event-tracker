'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLogStream } from '../../features/logs/hooks/use-log-stream';
import { LogConsole } from '../../features/logs/components/log-console';
import { LogFilters } from '../../features/logs/components/log-filters';

export default function ConsolePage() {
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
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-bold tracking-tight text-white">Live Console</h1>
      </header>
      <LogFilters />
      <LogConsole logs={filteredLogs} />
    </div>
  );
}