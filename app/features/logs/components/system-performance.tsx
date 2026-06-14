'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LogEntry } from '../schemas';

interface SystemPerformanceProps {
  logs: LogEntry[];
}

export function SystemPerformance({ logs }: SystemPerformanceProps) {
  
  const metrics = useMemo(() => {
    const recentLogs = logs.slice(0, 200); 
    
    if (recentLogs.length === 0) {
      return { avgLatency: 0, errorPercentage: 0, timelineData: [] };
    }

    const totalLatency = recentLogs.reduce((sum, log) => sum + (log.latencyMs || 0), 0);
    const errorCount = recentLogs.filter((log) => log.level === 'error').length;

    const avgLatency = Math.round(totalLatency / recentLogs.length);
    const errorPercentage = Math.round((errorCount / recentLogs.length) * 100);

    const timelineData = recentLogs
      .slice(0, 15)
      .reverse()
      .map((log) => ({
        time: log.timestamp.slice(14, 19), 
        latency: log.latencyMs || 0,
      }));

    return { avgLatency, errorPercentage, timelineData };
  }, [logs]);

  return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-md h-[260px] flex flex-col justify-between font-sans">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">System Health Telemetry</h3>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Moving Avg Latency</p>
            <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">{metrics.avgLatency}ms</p>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Failure Ratio</p>
            <p className={`text-xl font-bold font-mono mt-0.5 ${metrics.errorPercentage > 15 ? 'text-rose-500' : 'text-emerald-400'}`}>
              {metrics.errorPercentage}%
            </p>
          </div>
        </div>
      </div>

      <div className="w-full h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics.timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={9} tickLine={false} unit="ms" />
            <Tooltip
              contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px' }}
              labelStyle={{ color: '#94a3b8' }}
            />
            <Line type="monotone" dataKey="latency" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
