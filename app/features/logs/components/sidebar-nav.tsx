'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ChevronLeft } from 'lucide-react'

const navItems = [
 { label: 'Metrics Workspace', href: '/', icon: LayoutDashboard }
];

export function SidebarNav() {
  const pathname = usePathname();
    const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  return (
    <aside 
      className={`
        bg-slate-900 border-slate-800 font-sans select-none transition-all duration-200 shrink-0
        w-full h-auto border-b flex flex-row justify-between items-center px-4 py-3 sticky top-0 z-50
        md:flex md:flex-col md:justify-between md:h-screen md:sticky md:left-0 md:border-r md:border-b-0 md:px-0 md:py-0
        ${isCollapsed ? 'md:w-16' : 'md:w-64'}
      `}
    >
      <div className="flex flex-row items-center justify-between w-full md:flex-col md:items-stretch md:justify-start">
         <div 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={`
            flex items-center gap-2.5 transition-all cursor-pointer
            border-0 p-0
            md:p-4 md:border-b md:border-slate-800 md:h-16
            ${isCollapsed ? 'md:justify-center md:px-2' : 'md:justify-between'}
          `}
        >
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-6 rounded-md bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center font-bold text-[10px] text-white tracking-wider shrink-0 shadow-sm">
              LEM
            </div>
            <span className={`font-bold tracking-tight text-white text-sm transition-opacity md:block ${isCollapsed ? 'md:hidden' : 'block'}`}>
              Live Event Monitor
            </span>
          </div>
          {!isCollapsed && (
            <ChevronLeft size={14} className="text-slate-500 hover:text-slate-300 transition-colors hidden md:block" />
          )}
        </div>

        <nav className={`
          flex flex-row gap-2 p-0
          md:flex-col md:p-3 md:gap-1 md:w-full
        `}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-xs font-medium transition-all gap-2.5 group ${
                  isActive 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                } ${isCollapsed ? 'md:justify-center md:px-0 md:w-10 md:h-10' : 'md:justify-start md:w-full'}`}
              >
                <Icon size={16} className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'} shrink-0`} />
                <span className={`transition-opacity ${isCollapsed ? 'md:hidden' : 'block'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}