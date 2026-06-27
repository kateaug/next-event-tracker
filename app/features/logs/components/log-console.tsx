'use client';

import React, { useRef, useState, useMemo } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
import { NormalizedEvent } from '../schemas';
import { ChevronLeft, ChevronRight, Activity } from 'lucide-react';

const pageSize = 100;

const severityColors: Record<string, string> = {
  info: 'text-emerald-400',
  notice: 'text-sky-400 font-medium',
  critical: 'text-amber-500 font-semibold',
  fatal: 'text-rose-500 font-bold animate-pulse',
};

const getMetricStyle = (mag: number): string => {
  if (mag >= 5.5) return 'bg-rose-950/60 text-rose-400 border border-rose-800/50';
  if (mag >= 4.0) return 'bg-amber-950/60 text-amber-400 border border-amber-800/50';
  if (mag >= 2.5) return 'bg-sky-950/60 text-sky-400 border border-sky-800/50';
  return 'bg-slate-900 text-slate-400 border border-slate-800';
};

interface LogConsoleProps {
  logs: NormalizedEvent[];
}

export function LogConsole({ logs }: LogConsoleProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.max(1, Math.ceil(logs.length / pageSize));
  const sanitizedPage = Math.min(currentPage, totalPages);

  const paginatedLogs = useMemo(() => {
    const startIndex = (sanitizedPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return logs.slice(startIndex, endIndex);
  }, [logs, sanitizedPage, pageSize]);

  const rowVirtualizer = useVirtualizer({
    count: paginatedLogs.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
    overscan: 10,
  });

 return (
    <div className="flex flex-col h-[520px] w-full bg-slate-950 rounded-lg border border-slate-800 text-xs font-mono shadow-2xl overflow-hidden font-sans">
      <div className="flex flex-wrap items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-800 text-slate-400 select-none gap-2">
        <span className="flex items-center gap-2 text-slate-300">
          <Activity size={14} className="text-emerald-500 shrink-0" />
          Active Dataset: <b className="text-white font-mono font-medium">{logs.length.toLocaleString()}</b> records
        </span>
        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-400">
            Page <b className="text-slate-200 font-mono font-medium">{sanitizedPage}</b> of <b className="text-slate-200 font-mono font-medium">{totalPages}</b>
          </span>
          <div className="flex items-center gap-1">
            <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={sanitizedPage === 1} className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"><ChevronLeft size={14} /></button>
            <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={sanitizedPage === totalPages} className="p-1 rounded bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 disabled:opacity-30 cursor-pointer"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>
      <div ref={parentRef} className="flex-1 overflow-auto p-2 min-h-0 bg-slate-950/60" style={{ contain: 'strict' }}>
        {paginatedLogs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-slate-500 font-sans italic">No records match filters.</div>
        ) : (
          <div style={{ height: `${rowVirtualizer.getTotalSize()}px`, width: '100%', position: 'relative' }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const event = paginatedLogs[virtualItem.index];
              if (!event) return null;
              return (
                <div key={virtualItem.key} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: `${virtualItem.size}px`, transform: `translateY(${virtualItem.start}px)` }} className="flex items-center gap-4 px-2 hover:bg-slate-900/60 transition-colors border-b border-slate-900/10 text-slate-300 whitespace-nowrap text-[11px]">
                  <span className="text-slate-500 shrink-0 select-none font-mono min-w-[145px]">{event.readableTime}</span>
                  <span className={`w-14 uppercase shrink-0 font-mono tracking-wider ${severityColors[event.severity]}`}>[{event.severity}]</span>
                  <span className="text-purple-400 shrink-0 w-16 truncate font-mono uppercase">{event.source}</span>
                  <span className={`shrink-0 px-1.5 py-0.5 rounded text-[10px] font-mono font-bold tracking-wide ${getMetricStyle(event.metadata.metricValue)}`}>M{event.metadata.metricValue.toFixed(1)}</span>
                  <span className="truncate flex-1 text-slate-200 font-mono tracking-wide font-medium">{event.title}</span>
                  <span className="text-slate-500 shrink-0 text-[10px] font-mono">{event.metadata.secondaryLabel}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}