import React from 'react';
import { SidebarNav } from '../features/logs/components/sidebar-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
         <div className="flex flex-col min-h-screen font-sans md:flex-row">
            <SidebarNav />
            <main className="flex-1 min-w-0 p-4 overflow-x-hidden sm:p-6">
                {children}
            </main>
        </div>
    );
}