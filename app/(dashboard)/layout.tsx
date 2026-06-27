import React from 'react';
import { SidebarNav } from '../features/logs/components/sidebar-nav';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen font-sans">
            <SidebarNav />
            <main className="flex-1 min-w-0 p-6 overflow-x-hidden">
                {children}
            </main>
        </div>
    );
}