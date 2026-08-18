"use client";
import React, { useState, useEffect } from 'react';
import { CalendarDays, TrendingUp, MapPin, Clock, ArrowUpRight, User, Timer, CheckCircle2, Sparkles, PlusCircle } from 'lucide-react';

interface ViewInicioProps {
  onViewChange: (view: any) => void;
}

/** Lee el valor de una cookie por su nombre. Retorna null si no existe. */
function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

/** Decodifica el payload de un JWT (sin validar la firma, solo para leer claims en el cliente). */
function decodeJwtPayload(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

export default function ViewInicioCliente({ onViewChange }: ViewInicioProps) {
  const [nombre, setNombre] = useState('Cliente');
  const [loaded, setLoaded] = useState(false);
  const [citasLoading, setCitasLoading] = useState(true);
  const [citasPendientes, setCitasPendientes] = useState<any[]>([]);
  const [citasTerminadas, setCitasTerminadas] = useState<any[]>([]);

  useEffect(() => {
    try {
      // Lee el JWT desde la cookie 'auth_token' (en vez de localStorage)
      const token = getCookie('auth_token');
      if (token) {
        const payload = decodeJwtPayload(token);
        const nombreEnToken =
          payload?.nombre ||
          payload?.name ||
          payload?.first_name ||
          payload?.nombre_completo ||
          payload?.username ||
          payload?.user?.nombre;

        if (nombreEnToken) {
          setNombre(nombreEnToken);
        }
      }
    } catch (error) {
      console.error("Error al leer la sesión del usuario desde la cookie:", error);
    }

    const timer = setTimeout(() => setLoaded(true), 300);

    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const [pendientesRes, terminadasRes] = await Promise.all([
          fetch("/api/citas/pendientes/cliente/", { headers: { Authorization: `Bearer ${token}` } }),
          fetch("/api/citas/terminadas/cliente/", { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const pendientesData = await pendientesRes.json();
        const terminadasData = await terminadasRes.json();

        setCitasPendientes(Array.isArray(pendientesData) ? pendientesData : pendientesData.data || pendientesData.results || []);
        setCitasTerminadas(Array.isArray(terminadasData) ? terminadasData : terminadasData.data || terminadasData.results || []);
      } catch (error) {
        console.error("Error cargando citas:", error);
      } finally {
        setCitasLoading(false);
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

  const isConfirmada = proximaCita?.estado === 'CONF' || proximaCita?.estado === 'Confirmada';

  return (
    <div
      className={`space-y-8 transition-all duration-700 ease-out ${
        loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-primary mb-1">
            <Sparkles size={16} strokeWidth={2.5} />
            <span className="text-xs font-black uppercase tracking-widest">Panel de cliente</span>
          </div>
          <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">
            ¡Qué bueno verte, {nombre}!
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Este es el estado de tus citas.
          </p>
        </div>
        <button
          onClick={() => onViewChange('Reservar Cita')}
          className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-2xl font-bold text-sm hover:scale-105 active:scale-100 transition-all shadow-lg shadow-primary/25 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30"
        >
          <CalendarDays size={18} /> Reservar Nueva Cita
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Citas Pendientes', val: citasPendientes.length.toString(), inc: 'Por asistir', sub: 'Agenda Activa', icon: CalendarDays, color: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20', trend: 'flat' },
          { label: 'Citas Realizadas', val: citasTerminadas.length.toString(), inc: `+${citasTerminadas.length} Citas`, sub: 'Historial', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20', trend: 'up' },
        ].map((item, i) => (
          <div
            key={i}
            className="group p-8 rounded-[32px] bg-white dark:bg-[#1e293b] border border-slate-100 dark:border-slate-700/50 shadow-sm hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-0.5 transition-all duration-300 relative overflow-hidden"
          >
            {/* decorative glow blob */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full ${item.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

            <div className="flex justify-between items-start relative z-10">
              <div>
                <p className="font-bold text-xs uppercase tracking-widest text-slate-400 dark:text-slate-500">{item.label}</p>
                {citasLoading ? (
                  <div className="h-9 w-14 mt-2 rounded-lg bg-slate-100 dark:bg-slate-700/50 animate-pulse" />
                ) : (
                  <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-2">{item.val}</h3>
                )}
              </div>
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} ring-1 ${item.ring} transition-transform group-hover:scale-110 group-hover:rotate-3 duration-300`}>
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

      {/* Próxima cita */}
      <div className="relative rounded-[32px] p-[1px] bg-gradient-to-br from-primary/30 via-slate-200 dark:via-slate-700/50 to-transparent">
        <div className="w-full h-full p-8 rounded-[31px] bg-white dark:bg-[#1e293b] flex flex-col relative overflow-hidden group">
          <div className="flex items-center justify-between mb-6 relative z-10">
            <h4 className="font-black text-xl text-slate-800 dark:text-white">Tu Próxima Cita</h4>
            {proximaCita && (
              <button
                onClick={() => onViewChange('Citas Pendientes')}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 rounded-md px-1"
              >
                Ver detalle <ArrowUpRight size={13} />
              </button>
            )}
          </div>

          {citasLoading ? (
            <div className="flex items-center gap-6 relative z-10">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800/50 animate-pulse shrink-0" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-40 rounded-lg bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
                <div className="h-4 w-64 rounded-lg bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
              </div>
            </div>
          ) : proximaCita ? (
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 relative z-10">
              <div className="flex items-start gap-6 w-full">
                {/* Bloque de Fecha */}
                <div className="flex flex-col items-center justify-center px-6 py-4 bg-gradient-to-b from-primary/10 to-transparent dark:from-primary/15 rounded-2xl border border-primary/20 shrink-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {proximaCita.fecha ? parseFechaLocal(proximaCita.fecha).toLocaleDateString('es-CO', { weekday: 'short' }) : "Día"}
                  </span>
                  <span className="text-3xl font-black text-primary leading-none">
                    {proximaCita.fecha ? parseFechaLocal(proximaCita.fecha).getDate().toString().padStart(2, '0') : "00"}
                  </span>
                  <span className="text-xs font-bold text-slate-500 uppercase mt-1">
                    {proximaCita.fecha ? parseFechaLocal(proximaCita.fecha).toLocaleDateString('es-CO', { month: 'short' }) : "Mes"}
                  </span>
                </div>

                {/* Información de la Cita */}
                <div className="flex flex-col justify-center gap-3">
                  <div>
                    <div className="flex items-center gap-3 mb-1 flex-wrap">
                      <h4 className="font-black text-slate-800 dark:text-slate-100 text-xl leading-tight">
                        {proximaCita.servicio_nombre || proximaCita.servicio?.nombre || "Servicio"}
                      </h4>
                      {isConfirmada ? (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-[10px] font-black uppercase tracking-wider">
                          <CheckCircle2 size={12}/> Confirmada
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 px-2.5 py-1 bg-amber-100 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg text-[10px] font-black uppercase tracking-wider animate-pulse">
                          <Timer size={12}/> Pendiente
                        </span>
                      )}
                    </div>
                    {proximaCita.servicio_precio && (
                      <p className="text-sm font-bold text-primary">${Number(proximaCita.servicio_precio).toLocaleString('es-CO')}</p>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <Clock size={14} className="text-slate-400" /> {proximaCita.hora}
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <User size={14} className="text-slate-400" /> {proximaCita.barbero_nombre || "Especialista"}
                    </div>
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                      <MapPin size={14} className="text-slate-400" /> {proximaCita.sede || "Sede"}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center py-10 relative z-10">
              <div className="p-4 rounded-2xl bg-primary/10 text-primary mb-4">
                <CalendarDays size={28} strokeWidth={2.5} />
              </div>
              <p className="text-slate-600 dark:text-slate-300 font-bold text-lg">No tienes citas próximas</p>
              <p className="text-slate-400 dark:text-slate-500 text-sm font-medium mt-1 mb-5">Agenda tu próxima visita en un par de clics.</p>
              <button
                onClick={() => onViewChange('Reservar Cita')}
                className="flex items-center gap-2 px-5 py-2.5 bg-primary/10 text-primary rounded-xl font-bold text-sm hover:bg-primary hover:text-white transition-all focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                <PlusCircle size={16} /> Reservar cita
              </button>
            </div>
          )}
          <CalendarDays size={180} className="absolute -right-8 -bottom-8 text-slate-50 dark:text-slate-800/20 rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}