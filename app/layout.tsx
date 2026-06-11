import React, { Suspense } from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Logs tracker console',
  description: 'Logs platform.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-blue-500/30 selection:text-blue-200">
        <div className="flex min-h-screen font-sans">
          <main className="flex-1 min-w-0 p-6 overflow-x-hidden">
            <Suspense fallback={null}>
              {children}
            </Suspense>
          </main>
        </div>
      </body>
    </html>
  );
}