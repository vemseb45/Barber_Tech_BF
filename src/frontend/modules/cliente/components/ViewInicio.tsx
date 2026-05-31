"use client";
import React, { useState, useEffect } from 'react';
import { CalendarDays, TrendingUp, Gift, MapPin, Clock, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

interface ViewInicioProps {
  onViewChange: (view: any) => void;
}

export default function ViewInicioCliente({ onViewChange }: ViewInicioProps) {
  const [username, setUsername] = useState('Cliente');
  const [loaded, setLoaded] = useState(false);
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citasTerminadas, setCitasTerminadas] = useState<any[]>([]);

  useEffect(() => {
    setUsername(localStorage.getItem('username') || 'Cliente');
    const timer = setTimeout(() => setLoaded(true), 300);

    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const [pendientesRes, terminadasRes] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/cita/pendientes/cliente/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("http://127.0.0.1:8000/api/cita/terminadas/cliente/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const pendientesData = await pendientesRes.json();
        const terminadasData = await terminadasRes.json();

        setCitasPendientes(Array.isArray(pendientesData) ? pendientesData : pendientesData.data || pendientesData.results || []);
        setCitasTerminadas(Array.isArray(terminadasData) ? terminadasData : terminadasData.data || terminadasData.results || []);
      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    };

    fetchCitas();
    return () => clearTimeout(timer);
  }, []);

  const parseFechaLocal = (fecha: string, hora?: string) => new Date(`${fecha}T${hora || "00:00:00"}-05:00`);
  const ahora = new Date();
  
  const proximaCita = citasPendientes
    .filter(cita => parseFechaLocal(cita.fecha, cita.hora) >= ahora)
    .sort((a, b) => parseFechaLocal(a.fecha, a.hora).getTime() - parseFechaLocal(b.fecha, b.hora).getTime())[0];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ¡Qué bueno verte, {username}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Tienes <span className="text-primary font-bold">450 puntos</span> acumulados. ¡Casi llegas al premio!
          </p>
        </div>
        <button onClick={() => onViewChange('Reservar Cita')} className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-105 transition-all shadow-lg shadow-primary/25">
          <CalendarDays size={18} /> Reservar Nueva Cita
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Puntos Lealtad', val: '450', inc: 'Nivel Gold', sub: 'Membresía actual', icon: Gift, color: 'text-blue-500', bg: 'bg-blue-500/10', trend: 'flat' },
          { label: 'Citas Realizadas', val: citasTerminadas.length.toString(), inc: `+${citasTerminadas.length} Citas`, sub: 'Historial', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', trend: 'up' },
          { label: 'Beneficios', val: '2', inc: 'Nuevos', sub: 'Cupones disponibles', icon: Sparkles, color: 'text-primary', bg: 'bg-primary/10', trend: 'up' },
        ].map((item, i) => (
          <div key={i} className="group p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 transition-all duration-300 relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.label}</p>
                <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-2">{item.val}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} transition-transform group-hover:scale-110 duration-300`}>
                <item.icon size={24} strokeWidth={2.5} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2 relative z-10">
              <div className={`flex items-center px-2 py-1 rounded-lg text-xs font-bold ${item.trend === 'up' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'}`}>
                {item.trend === 'up' && <ArrowUpRight size={14} className="mr-1" />} {item.inc}
              </div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{item.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3 p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col relative overflow-hidden group">
          <h4 className="font-black text-xl text-slate-800 dark:text-white mb-8 relative z-10">Tu Próxima Cita</h4>
          {proximaCita ? (
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 flex-1 justify-center">
              <div className="flex flex-col items-center justify-center px-8 py-4 bg-primary/5 dark:bg-primary/10 rounded-[20px] border border-primary/20 shadow-sm min-w-[120px]">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{parseFechaLocal(proximaCita.fecha).toLocaleDateString('es-CO', { weekday: 'long' })}</span>
                <span className="text-4xl font-black text-primary leading-none">{parseFechaLocal(proximaCita.fecha).getDate()}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">{parseFechaLocal(proximaCita.fecha).toLocaleDateString('es-CO', { month: 'long' })}</span>
              </div>
              <div className="space-y-4 flex-1">
                <div>
                  <h4 className="text-xl font-bold dark:text-white">{proximaCita.servicio_nombre || proximaCita.servicio?.nombre || "Servicio"}</h4>
                  <p className="text-slate-500 text-sm font-medium">Con el Master Barber: <span className="text-primary">{proximaCita.barbero_nombre || "N/A"}</span></p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"><Clock size={16} className="text-primary" /> {proximaCita.hora}</div>
                  <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-300"><MapPin size={16} className="text-primary" /> {proximaCita.sede || "Sede"}</div>
                </div>
              </div>
            </div>
          ) : (
            <p className="text-slate-500 text-center relative z-10">No tienes citas próximas</p>
          )}
          <CalendarDays size={120} className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-800/20 rotate-12" />
        </div>

        <div className="lg:col-span-2 p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm flex flex-col text-center">
          <h4 className="font-black text-xl text-slate-800 dark:text-white mb-8 text-left">Tu Recompensa</h4>
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-20 h-20 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-blue-500/20 animate-bounce"><Gift size={32} /></div>
            <h4 className="text-sm font-bold dark:text-white uppercase tracking-widest mb-1">Corte Gratis</h4>
            <p className="text-xs text-slate-500 mb-6 font-medium">Estás a 50 puntos de tu beneficio.</p>
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Progreso Actual</span>
              <span className="text-xs font-black text-primary">450 / 500 <span className="text-[10px] text-slate-500">pts</span></span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900/80 rounded-full h-2.5 mb-6 overflow-hidden ring-1 ring-inset ring-slate-200 dark:ring-white/10 shadow-inner">
              <div className="bg-gradient-to-r from-[#BE7AD6] to-slate-400 dark:to-slate-400 h-full transition-all duration-[1500ms] ease-out relative" style={{ width: loaded ? '90%' : '0%' }}>
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 rounded-r-full shadow-[0_0_5px_rgba(255,255,255,0.5)]"></div>
              </div>
            </div>
            <button className="w-full mt-auto mb-2 flex items-center justify-center gap-2 text-primary font-bold text-xs uppercase tracking-widest hover:underline group">
              Ver Catálogo de Premios <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}