"use client";
import React, { useState, useEffect } from 'react';
import { Home, Calendar, User, LogOut, ChevronDown, CalendarCheck, History } from 'lucide-react';
import { useRouter } from 'next/navigation'; // Migración a Next.js

interface SidebarProps {
  activeView: string;
  onViewChange: (view: string) => void;
}

const SidebarCliente: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const router = useRouter();
  const [username, setUsername] = useState('Cliente');
  const [openCitas, setOpenCitas] = useState(false);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'Cliente');
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    router.push('/login');
  };

  const menuItems = [
    { id: 'Inicio', label: 'Inicio', icon: <Home size={20} /> },
    { id: 'MisCitas', label: 'Mis Citas', icon: <Calendar size={20} /> },
    { id: 'Perfil', label: 'Perfil', icon: <User size={20} /> },
  ];

  return (
    <aside className="w-72 bg-white dark:bg-[#0f172a] border-r border-slate-200 dark:border-slate-800 flex flex-col h-screen sticky top-0 transition-all duration-300 z-50">
      <div className="px-6 py-8 flex items-center gap-3">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-black italic shadow-lg shrink-0">B</div>
        <div className="flex flex-col justify-center">
          <h1 className="text-xl font-black tracking-tighter dark:text-white leading-none mb-0.5">
            BARBER<span className="text-primary text-2xl leading-none">.</span>TECH
          </h1>
          <span className="text-[10px] font-bold text-primary uppercase tracking-widest">Cliente</span>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4 overflow-y-auto">
        <p className="px-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Menú Principal</p>
        {menuItems.map((item) => {
          if (item.id === 'MisCitas') {
            const isCitasActive = activeView === 'Reservar Cita' || activeView === 'Citas Pendientes' || activeView === 'Citas Terminadas';
            return (
              <div key={item.id} className="space-y-1">
                <button
                  onClick={() => setOpenCitas(!openCitas)}
                  className={`w-full group flex items-center justify-between px-5 py-3.5 rounded-2xl transition-all duration-300 cursor-pointer ${isCitasActive ? 'bg-primary/10 text-primary' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  <div className="flex items-center gap-4 font-bold text-sm">
                    <Calendar size={20} strokeWidth={isCitasActive ? 2.5 : 2} />
                    <span>Mis Citas</span>
                  </div>
                  <ChevronDown size={16} className={`transition-transform ${openCitas ? "rotate-180" : ""}`} />
                </button>

                {openCitas && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    <button onClick={() => onViewChange('Reservar Cita')} className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${activeView === 'Reservar Cita' ? 'text-primary bg-primary/5 shadow-sm' : 'text-slate-400 hover:text-primary dark:hover:text-slate-200'}`}>
                      <CalendarCheck size={18} /><span>Reservar cita</span>
                    </button>
                    <button onClick={() => onViewChange('Citas Pendientes')} className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${activeView === 'Citas Pendientes' ? 'text-primary bg-primary/5 shadow-sm' : 'text-slate-400 hover:text-primary dark:hover:text-slate-200'}`}>
                      <History size={18} /><span>Citas pendientes</span>
                    </button>
                    <button onClick={() => onViewChange('Citas Terminadas')} className={`w-full flex items-center gap-4 px-9 py-3 rounded-2xl text-sm font-bold transition-all ${activeView === 'Citas Terminadas' ? 'text-primary bg-primary/5 shadow-sm' : 'text-slate-400 hover:text-primary dark:hover:text-slate-200'}`}>
                      <History size={18} /><span>Citas terminadas</span>
                    </button>
                  </div>
                )}
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl font-bold text-sm transition-all cursor-pointer ${activeView === item.id ? 'bg-primary text-white shadow-lg shadow-primary/25' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* USER PROFILE & FOOTER */}
      <div className="p-6 mt-auto">
        <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 rounded-2xl p-3 mb-4 transition-all hover:border-primary/30 flex items-center gap-3">
          <div className="relative shrink-0">
            <div className="w-10 h-10 rounded-full bg-primary/20 border-2 border-primary flex items-center justify-center text-primary font-black uppercase">
              {username.charAt(0).toUpperCase()}
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full"></div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-slate-800 dark:text-white leading-tight truncate">{username}</p>
            <p className="text-[10px] font-bold text-primary uppercase tracking-widest mt-0.5">Cliente</p>
          </div>
        </div>

        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-3 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-2xl transition-all duration-300 border border-transparent hover:border-red-200 dark:hover:border-red-900/30 cursor-pointer">
          <LogOut size={18} strokeWidth={2.5} />
          <span className="font-black tracking-tighter uppercase text-sm">CERRAR SESIÓN</span>
        </button>
      </div>
    </aside>
  );
};

export default SidebarCliente;