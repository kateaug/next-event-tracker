'use client';

import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { LogEntry } from '../schemas';

const colours: Record<string, string> = {
    INFO: '#10b981',
    WARN: '#f59e0b',
    ERROR: '#f43f5e',
    DEBUG: '#60a5fa',
};

interface ErrorDistributionProps {
  logs: LogEntry[];
}

export function ErrorDistribution({ logs }: ErrorDistributionProps) {
  
  const chartData = useMemo(() => {
    const counts: Record<string, number> = { info: 0, warn: 0, error: 0, debug: 0 };
    
    logs.slice(0, 1000).forEach((log) => {
      if (counts[log.level] !== undefined) counts[log.level]++;
    });

    return Object.entries(counts).map(([name, value]) => ({ name: name.toUpperCase(), value }));
  }, [logs]);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-md h-[260px]">
      <h3 className="text-sm font-semibold text-slate-200 mb-4 font-sans">Recent Distribution (Last 1k logs)</h3>
      <div className="w-full h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
            <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
            <Tooltip 
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '6px' }}
              labelStyle={{ color: '#94a3b8', fontFamily: 'monospace' }}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colours[entry.name] || '#ffffff'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
