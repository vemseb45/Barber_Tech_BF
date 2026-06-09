"use client";
import React, { useState, useEffect } from 'react';
import { Users, DollarSign, Calendar, ArrowUpRight, CheckCircle2 } from 'lucide-react';

const ViewInicio: React.FC = () => {
  const [loaded, setLoaded] = useState(false);
  const [username, setUsername] = useState('Administrador');

  useEffect(() => {
    // Leemos el localStorage solo después de montar el componente (en el cliente)
    const storedUser = localStorage.getItem('username');
    if (storedUser) {
      setUsername(storedUser);
    }
    
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const stats = [
    {
      label: 'Usuarios Totales',
      value: '1,284',
      change: '+12%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10'
    },
    {
      label: 'Ingresos Mes',
      value: '$4,520.00',
      change: '+8.4%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10'
    },
    {
      label: 'Citas Hoy',
      value: '42',
      pendientes: 5,
      change: '+15%',
      trend: 'up',
      icon: Calendar,
      color: 'text-primary',
      bg: 'bg-primary/10'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ¡Hola de nuevo, {username}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Esto es lo que está pasando en tu barbería hoy.
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="group p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 relative overflow-hidden"
          >
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  {stat.label}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none">
                    {stat.value}
                  </h3>
                </div>
              </div>
              <div className="relative group/icon cursor-help">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} transition-transform group-hover:scale-110 duration-300`}>
                  <stat.icon size={24} strokeWidth={2.5} />
                </div>
                {stat.pendientes !== undefined && (
                  <>
                    <div className="absolute -top-1.5 -right-1.5 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center border-2 border-white dark:border-[#1e293b] text-[10px] font-black text-white shadow-sm ring-2 ring-rose-500/20 z-20">
                      {stat.pendientes}
                    </div>
                    {/* Tooltip on hover */}
                    <div className="absolute top-16 right-0 translate-x-2 w-max px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white text-[10px] font-bold rounded-lg opacity-0 invisible group-hover/icon:opacity-100 group-hover/icon:visible transition-all shadow-xl z-50 pointer-events-none">
                      {stat.pendientes} Citas pendientes
                      <div className="absolute -top-1 right-5 w-2 h-2 bg-slate-800 dark:bg-slate-700 rotate-45"></div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 relative z-10">
              <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${stat.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'}`}>
                {stat.trend === 'up' && <ArrowUpRight size={14} className="mr-1" />}
                {stat.change}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">vs periodo anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* GRÁFICO DE RENDIMIENTO */}
        <div className="lg:col-span-3 p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col min-h-[400px]">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h4 className="font-black text-xl text-slate-800 dark:text-white tracking-tight">Rendimiento Semanal</h4>
              <p className="text-xs text-slate-400 font-medium">Volumen de citas completadas</p>
            </div>
            <select className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-xs font-bold text-slate-500 outline-none focus:ring-2 focus:ring-primary/20">
              <option>Últimos 7 días</option>
              <option>Este mes</option>
            </select>
          </div>

          <div className="flex-1 flex items-end justify-between gap-3 px-2">
            {[45, 60, 40, 85, 75, 100, 65].map((height, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-4 group">
                <div className="w-full relative">
                  <div
                    className="w-full rounded-t-2xl transition-all duration-1000 ease-out relative bg-gradient-to-t from-slate-400 dark:from-white/20 to-primary shadow-sm border-t border-white/10"
                    style={{ height: loaded ? `${height * 2.2}px` : '0px' }}
                  >
                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] font-bold py-1.5 px-2.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all transform group-hover:-translate-y-1 shadow-xl z-20">
                      {height}%
                    </div>
                  </div>
                </div>
                <span className="text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'][i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* PRÓXIMAS CITAS */}
        <div className="lg:col-span-2 p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-xl text-slate-800 dark:text-white">Próximas Citas</h4>
            <CheckCircle2 className="text-primary opacity-40" size={20} />
          </div>

          <div className="space-y-3">
            {[
              { name: 'Juan Pérez', service: 'Fade + Barba', time: '10:30', color: 'bg-blue-500' },
              { name: 'Mario Gómez', service: 'Facial', time: '11:15', color: 'bg-primary' },
              { name: 'Luis Rivas', service: 'Corte', time: '12:00', color: 'bg-orange-500' },
              { name: 'Ana Torres', service: 'Tratamiento', time: '13:30', color: 'bg-emerald-500' },
              { name: 'Roberto S.', service: 'Afeitado', time: '14:15', color: 'bg-red-500' },
            ].map((cita, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border border-transparent hover:border-slate-100 dark:hover:border-slate-700 group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${cita.color} flex items-center justify-center text-white font-black text-xs shadow-md`}>
                    {cita.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-white leading-none">{cita.name}</p>
                    <p className="text-[11px] font-medium text-slate-400 mt-1.5">{cita.service}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-primary bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/10">
                    {cita.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-8 py-4 text-xs font-black text-slate-400 uppercase tracking-[0.2em] border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-2xl hover:border-primary hover:text-primary transition-all">
            Ver Agenda Completa
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewInicio;