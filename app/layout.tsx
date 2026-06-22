import React, { Suspense } from 'react';
import QueryProvider from './providers/query-provider';
import '../styles/globals.css';

export const metadata = {
  title: 'Logs tracker console',
  description: 'Logs platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
            <QueryProvider>
              <Suspense fallback={null}>
                {children}
              </Suspense>
            </QueryProvider>
      </body>
    </html>
  );
}