'use client';

import React from 'react';
import { useLogStream } from './features/logs/hooks/use-log-stream';
export default function HomePage() {

const { logs } = useLogStream();

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-col gap-1 select-none">
        <h1 className="text-2xl font-bold tracking-tight text-white font-sans">Metrics</h1>
      </header>
    </div>
  );
}