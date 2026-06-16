'use client';
import React, { useState } from 'react';
import { 
  Home, 
  CalendarDays, 
  Settings, 
  LogOut, 
  ChevronRight, 
  ChevronDown,
  CalendarCheck,
  History,
  CalendarX
} from 'lucide-react';
import { useRouter } from 'next/navigation'; 
import type { BarberoView } from '@/frontend/types/types_barbero'; 

interface SidebarProps {
  activeView: BarberoView;
  onViewChange: (view: BarberoView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const router = useRouter(); // Usamos useRouter de Next.js
  
  const [isCitasOpen, setIsCitasOpen] = useState(
    activeView === 'Citas' || 
    activeView === ('Agenda' as any) || 
    activeView === ('Historial' as any) || 
    activeView === ('Canceladas' as any)
  );

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login'); // Redirección estilo Next.js
  };

  const isCitasActive = 
    activeView === 'Citas' || 
    activeView === ('Agenda' as any) || 
    activeView === ('Historial' as any) || 
    activeView === ('Canceladas' as any);

  // Verificamos si estamos en el navegador para evitar errores de hidratación
  const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'Barbero' : 'Barbero';
  const initial = username.charAt(0).toUpperCase();

  return (
    <aside className="w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      
      {/* BRAND / LOGO */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shrink-0">B</div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black tracking-tighter dark:text-white leading-none mb-0.5">
            BARBER<span className="text-primary text-2xl leading-none">.</span>TECH
          </h1>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Professional</span>
        </div>
      </div>

      {/* NAVIGATION */}
      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
        <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Menú Principal</p>
        
        {/* INICIO */}
        <button
          onClick={() => onViewChange('Inicio')}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
            activeView === 'Inicio' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Home size={20} />
          <span className="font-bold text-sm">Inicio</span>
        </button>

        {/* ACORDEÓN CITAS */}
        <div className="space-y-1">
          <button
            onClick={() => setIsCitasOpen(!isCitasOpen)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all ${
              isCitasActive 
                ? 'text-primary bg-primary/10' 
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-4 font-bold text-sm">
              <CalendarDays size={20} />
              <span>Citas</span>
            </div>
            {isCitasOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {/* SUBMENÚ */}
          {isCitasOpen && (
            <div className="pl-4 space-y-1">
              <button
                onClick={() => onViewChange('Agenda' as any)}
                className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeView === ('Agenda' as any) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-slate-400 hover:text-primary dark:hover:text-slate-200'
                }`}
              >
                <CalendarCheck size={18} />
                <span>Agenda</span>
              </button>
              
              <button
                onClick={() => onViewChange('Historial' as any)}
                className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeView === ('Historial' as any) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-slate-400 hover:text-primary dark:hover:text-slate-200'
                }`}
              >
                <History size={18} />
                <span>Servicios Realizados</span>
              </button>

              {/* BOTÓN DE CITAS CANCELADAS */}
              <button
                onClick={() => onViewChange('Canceladas' as any)}
                className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${
                  activeView === ('Canceladas' as any) 
                    ? 'text-red-400 bg-red-50 dark:bg-red-400/10 shadow-sm' 
                    : 'text-slate-400 hover:text-red-400 dark:hover:text-red-400'
                }`}
              >
                <CalendarX size={18} />
                <span>Citas Canceladas</span>
              </button>
            </div>
          )}
        </div>

        {/* AJUSTES */}
        <button
          onClick={() => onViewChange('Ajustes')}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
            activeView === 'Ajustes' 
              ? 'bg-primary text-white shadow-md' 
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Settings size={20} />
          <span className="font-bold text-sm">Ajustes</span>
        </button>
      </nav>

      {/* USER PROFILE & FOOTER */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-3 mb-4 transition-all hover:border-primary/30 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-black uppercase">
              {initial}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">{username}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Master Barber</p>
          </div>
        </div>

        <button 
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 cursor-pointer"
          onClick={handleLogout}
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span className="font-black tracking-tighter uppercase text-sm">CERRAR SESIÓN</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;