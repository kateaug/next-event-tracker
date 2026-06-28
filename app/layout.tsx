import React, { Suspense } from 'react';
import QueryProvider from './providers/query-provider';
import '../styles/globals.css';
import { LoadingSkeleton } from './components/ui/loading-skeleton';

export const metadata = {
  title: 'Earthquake tracker console',
  description: 'Logs platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
            <QueryProvider>
              <Suspense fallback={<LoadingSkeleton />}>
                {children}
              </Suspense>
            </QueryProvider>
      </body>
    </html>
  );
}