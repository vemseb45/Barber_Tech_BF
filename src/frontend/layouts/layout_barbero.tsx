'use client';
import React, { useState, useEffect } from 'react';
import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
import Sidebar from '@/frontend/components/sidebar/sidebar_barbero';
import type { BarberoView } from '@/frontend/types/types_barbero'; 

interface BarberoLayoutProps {
  children: React.ReactNode;
  activeView: BarberoView;
  onViewChange: (view: BarberoView) => void;
}

const BarberoLayout: React.FC<BarberoLayoutProps> = ({ children, activeView, onViewChange }) => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') !== 'light';
    }
    return true;
  });

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme !== 'light') {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 transition-colors duration-300 relative">
      
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 transition-transform duration-300`}>
        <Sidebar activeView={activeView} onViewChange={(v) => { onViewChange(v); setIsSidebarOpen(false); }} />
      </div>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        <header className="h-20 bg-white dark:bg-white/5 border-b border-slate-200 dark:border-white/10 flex items-center justify-between px-4 lg:px-8 z-10 transition-all">
          <div className="flex items-center gap-3 lg:gap-4">
            <button 
              className="lg:hidden p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl lg:text-2xl font-black tracking-tight text-slate-800 dark:text-white uppercase italic truncate">
              {activeView === 'Inicio' ? 'Panel Barbero' : activeView}
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center relative group">
              <Search className="absolute left-3 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 dark:bg-white/5 rounded-2xl text-sm border border-transparent focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none w-64 transition-all dark:text-white"
              />
            </div>

            <button 
              onClick={toggleTheme}
              className="p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-all text-slate-600 dark:text-yellow-400 cursor-pointer shadow-sm"
              title="Alternar modo visual"
              aria-label="Cambiar Tema"
            >
              {isDarkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
            </button>

            <button className="relative p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-slate-200 dark:hover:bg-white/10 transition-all text-slate-600 dark:text-slate-400 cursor-pointer shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-white dark:ring-[#111116] animate-pulse"></span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default BarberoLayout;