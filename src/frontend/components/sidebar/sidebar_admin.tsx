"use client";
import React, { useState } from 'react';
// 1. Cambiamos la importación al enrutador de Next.js
import { useRouter } from 'next/navigation'; 
import {
  Home, Users, Scissors, Store, BarChart3,
  LogOut, ChevronRight, ChevronDown,
  UserRound, UserCog
} from 'lucide-react';
import type { AdminView } from '@/frontend/types/types_admin';

interface SidebarProps {
  activeView: AdminView;
  onViewChange: (view: AdminView) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  // 2. Usamos useRouter
  const router = useRouter(); 

  const [isUsersOpen, setIsUsersOpen] = useState(
    activeView === 'Clientes' || activeView === 'Barberos'
  );

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') || 'Admin' : 'Admin';
  const initial = username.charAt(0).toUpperCase();

  const handleLogout = () => {
    localStorage.clear();
    // 3. Cambiamos navigate por router.push
    router.push('/login'); 
  };

  const isUserViewActive = activeView === 'Clientes' || activeView === 'Barberos';

  return (
    <aside className="w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      {/* BRANDING */}
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-[#7924c7] rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shrink-0">B</div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black tracking-tighter dark:text-white leading-none mb-0.5">
            BARBER<span className="text-[#7924c7] text-2xl leading-none">.</span>TECH
          </h1>
          <span className="text-[10px] font-bold text-[#7924c7] uppercase tracking-widest">Control Panel</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
        <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">
          Gestión Global
        </p>

        {/* DASHBOARD */}
        <button
          onClick={() => onViewChange('Inicio')}
          className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all ${
            activeView === 'Inicio'
              ? 'bg-[#7924c7] text-white shadow-md'
              : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
          }`}
        >
          <Home size={20} />
          <span className="font-bold text-sm">Inicio</span>
        </button>

        {/* USUARIOS */}
        <div className="space-y-1">
          <button
            onClick={() => setIsUsersOpen(!isUsersOpen)}
            className={`w-full flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all ${
              isUserViewActive
                ? 'text-[#7924c7] bg-purple-50 dark:bg-purple-900/10'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <div className="flex items-center gap-4 font-bold text-sm">
              <Users size={20} />
              <span>Usuarios</span>
            </div>
            {isUsersOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>

          {isUsersOpen && (
            <div className="pl-4 space-y-1">
              <button
                onClick={() => onViewChange('Clientes')}
                className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold ${
                  activeView === 'Clientes'
                    ? 'text-[#7924c7] bg-purple-100/50'
                    : 'text-slate-400 hover:text-[#7924c7]'
                }`}
              >
                <UserRound size={16} /> <span>Clientes</span>
              </button>

              <button
                onClick={() => onViewChange('Barberos')}
                className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold ${
                  activeView === 'Barberos'
                    ? 'text-[#7924c7] bg-purple-100/50'
                    : 'text-slate-400 hover:text-[#7924c7]'
                }`}
              >
                <UserCog size={16} /> <span>Barberos</span>
              </button>
            </div>
          )}
        </div>

        {/* OTROS */}
        {[
          { id: 'Servicios', icon: Scissors, label: 'Catálogo' },
          { id: 'Barberías', icon: Store, label: 'Sucursales' },
          { id: 'Reportes', icon: BarChart3, label: 'Analíticas' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id as AdminView)}
            className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl ${
              activeView === item.id
                ? 'bg-[#7924c7] text-white'
                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          >
            <item.icon size={20} />
            <span className="font-bold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* USER PROFILE & FOOTER */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-3 mb-4 transition-all hover:border-[#7924c7]/30 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-[#7924c7]/20 border-2 border-[#7924c7] flex items-center justify-center text-[#7924c7] font-black uppercase">
              {initial}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">{username}</p>
            <p className="text-[10px] font-bold text-[#7924c7] uppercase tracking-widest mt-0.5">Administrador</p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 cursor-pointer"
        >
          <LogOut size={18} strokeWidth={2.5} />
          <span className="font-black tracking-tighter uppercase text-sm">CERRAR SESIÓN</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;