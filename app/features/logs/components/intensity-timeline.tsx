'use client';

import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { NormalizedEvent } from '../schemas';

interface IntensityTimelineProps {
  logs: NormalizedEvent[];
}

export function IntensityTimeline({ logs }: IntensityTimelineProps) {

  const metrics = useMemo(() => {
    const recentLogs = logs.slice(0, 500); 
    if (recentLogs.length === 0) return { avgMagnitude: 0, alertPercentage: 0, timelineData: [] };

    const totalMetricValue = recentLogs.reduce((sum, event) => sum + (event.metadata.metricValue || 0), 0);
    const alertCount = recentLogs.filter((event) => event.severity === 'critical' || event.severity === 'fatal').length;

    const avgMagnitude = Number((totalMetricValue / recentLogs.length).toFixed(2));
    const alertPercentage = Math.round((alertCount / recentLogs.length) * 100);

    const timelineData = recentLogs.slice(0, 20).reverse().map((event) => ({
      time: event.timestamp ? event.timestamp.slice(14, 19) : '00:00', 
      intensity: event.metadata.metricValue || 0,
    }));

    return { avgMagnitude, alertPercentage, timelineData };
  }, [logs]);

return (
    <div className="p-4 bg-slate-900 border border-slate-800 rounded-lg shadow-md h-[260px] flex flex-col justify-between font-sans">
      <div>
        <h3 className="text-sm font-semibold text-slate-200 mb-3">Event Intensity Tracking</h3>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Moving Avg Magnitude</p>
            <p className="text-xl font-bold text-blue-400 font-mono mt-0.5">{metrics.avgMagnitude}M</p>
          </div>
          <div className="bg-slate-950 p-2 rounded border border-slate-800">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Alert Ratio (Crit/Fatal)</p>
            <p className={`text-xl font-bold font-mono mt-0.5 ${metrics.alertPercentage > 10 ? 'text-rose-500' : 'text-emerald-400'}`}>{metrics.alertPercentage}%</p>
          </div>
        </div>
      </div>
      <div className="w-full h-[110px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={metrics.timelineData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis dataKey="time" stroke="#64748b" fontSize={9} tickLine={false} />
            <YAxis stroke="#64748b" fontSize={9} tickLine={false} unit="M" />
            <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '4px', fontSize: '10px' }} />
            <Line type="monotone" dataKey="intensity" stroke="#3b82f6" strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

