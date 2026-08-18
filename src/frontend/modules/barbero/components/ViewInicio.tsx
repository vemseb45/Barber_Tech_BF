'use client';
import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  Clock,
} from 'lucide-react';
import type { BarberoView } from '@/frontend/types/types_barbero'; 
import { jwtDecode } from "jwt-decode";

interface ViewInicioProps {
  onViewChange: (view: BarberoView) => void;
}

interface JwtPayload {
  cedula: string;
  email?: string;
  nombre?: string;
  rol?: string;
}

export default function ViewInicio({ onViewChange }: ViewInicioProps) {
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [proximasCitas, setProximasCitas] = useState<any[]>([]);
  const [username, setUsername] = useState<string>('Barbero');

  const [stats, setStats] = useState({
    citasHoy: 0,
    citasCrecimiento: 0
  });

  const tipsDelDia = [
    "Planifica tu semana y revisa el inventario. ¡La preparación es clave!",
    "Recuerda a tus clientes frecuentes que agenden su cita.",
    "Día de mantenimiento: esteriliza tus herramientas a fondo.",
    "Promueve los servicios menos populares en tus redes sociales.",
    "Ofrece el combo 'Corte + Barba' con un pequeño incentivo.",
    "Viernes de alta demanda: mantén tu estación impecable.",
    "¡Recomienda productos de cuidado al terminar cada servicio!"
  ];

  const tipActual = tipsDelDia[new Date().getDay()];

  useEffect(() => {
    const intervalo = setInterval(() => setTiempoActual(new Date()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        if (typeof window !== 'undefined') {
          setUsername(localStorage.getItem('username') || 'Barbero');
        }

        const token = localStorage.getItem("token");
        if (!token) return;

        const decoded = jwtDecode<JwtPayload>(token);
        const barberoId = decoded.cedula; 

        if (!barberoId) {
          console.error("No se pudo obtener el barberoId del token");
          return;
        }

        // --- SOLUCIÓN ZONA HORARIA ---
        // Extraemos la fecha local exacta evitando el desfase de toISOString() que usa UTC
        const obtenerFechaLocal = (fecha: Date) => {
          const year = fecha.getFullYear();
          const month = String(fecha.getMonth() + 1).padStart(2, '0');
          const day = String(fecha.getDate()).padStart(2, '0');
          return `${year}-${month}-${day}`;
        };

        const ahora = new Date();
        const hoyStr = obtenerFechaLocal(ahora);
        
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const ayerStr = obtenerFechaLocal(ayer);

        const futura = new Date();
        futura.setDate(futura.getDate() + 7);
        const fechaFinStr = obtenerFechaLocal(futura);

        const url = `/api/agenda/miAgenda?barberoId=${barberoId}&fechaInicio=${ayerStr}&fechaFin=${fechaFinStr}`;

        const res = await fetch(url, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          }
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          throw new Error(errorData.message || `Error HTTP: ${res.status}`);
        }

        const data = await res.json();
        const lista = data.data || [];

        // --- CÁLCULO DE CITAS HOY ---
        const citasHoyArr = lista.filter((c: any) => c.fecha === hoyStr);
        const citasAyerArr = lista.filter((c: any) => c.fecha === ayerStr);

        const countHoy = citasHoyArr.length;
        const countAyer = citasAyerArr.length;
        let citasCrecimiento = 0;
        
        if (countAyer === 0 && countHoy > 0) citasCrecimiento = 100;
        else if (countAyer > 0) citasCrecimiento = Math.round(((countHoy - countAyer) / countAyer) * 100);

        setStats({
          citasHoy: countHoy,
          citasCrecimiento: citasCrecimiento
        });

        // Filtrar próximas citas (solo las que aún no han pasado en el día de hoy)
        const citasTransformadas = lista
          .map((cita: any) => {
            const fechaCompleta = new Date(`${cita.fecha}T${cita.hora}:00`);
            return {
              cedula: cita.cedula_cliente_id,
              cliente: cita.cliente_nombre,
              servicio: cita.nombre_servicio,
              fecha: fechaCompleta,
              estadoBase: cita.estado,
              horaFormateada: cita.hora_formateada 
            };
          })
          .filter((cita: any) => {
            return !isNaN(cita.fecha.getTime()) && cita.fecha.getTime() >= ahora.getTime();
          })
          .sort((a: any, b: any) => a.fecha.getTime() - b.fecha.getTime())
          .slice(0, 3); 

        setProximasCitas(citasTransformadas);

      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    };
    
    cargarDatos();
  }, []); 

  const formatearHora = (cita: any) => {
    if (cita.horaFormateada) return cita.horaFormateada;
    return cita.fecha.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ================= WELCOME SECTION ================= */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-gradient-to-r from-slate-100 to-white dark:from-slate-900 dark:to-slate-800 p-8 rounded-[40px] shadow-sm border border-slate-200 dark:border-transparent dark:shadow-none relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tight">
            ¡Buen día, {username.split(' ')[0]}!
          </h2>
          <p className="text-slate-500 dark:text-slate-300 mt-2 font-medium flex items-center gap-2">
            <Clock size={16} className="text-primary" />
            Tienes <span className="text-slate-800 dark:text-white font-bold">{stats.citasHoy} citas</span> programadas para hoy.
          </p>
        </div>
        <button
          onClick={() => onViewChange('Citas')}
          className="relative z-10 flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-sm hover:bg-primary/90 transition-all hover:shadow-xl hover:shadow-primary/40 group"
        >
          <CalendarDays size={20} />
          GESTIONAR AGENDA
          <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* ================= UPCOMING APPOINTMENTS TABLE ================= */}
        <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
          <div className="flex justify-between items-center mb-8">
            <h4 className="font-black text-xl text-slate-800 dark:text-white flex items-center gap-3">
              Próximas en Agenda
              <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 text-[10px] rounded-md font-black uppercase tracking-widest">Top 3</span>
            </h4>
            <button
              onClick={() => onViewChange('Citas' as any)}
              className="text-primary text-xs font-black uppercase tracking-widest hover:opacity-70 flex items-center gap-2 transition-all"
            >
              Ver Todas <ArrowRight size={14} />
            </button>
          </div>

          <div className="space-y-4">
            {proximasCitas.length === 0 ? (
              <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-[24px] border border-dashed border-slate-200 dark:border-slate-700">
                <CalendarDays className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm font-bold text-slate-400">No tienes citas próximas para mostrar.</p>
              </div>
            ) : (
              proximasCitas.map((cita) => {
                const diferenciaMs = cita.fecha.getTime() - tiempoActual.getTime();
                const faltanMinutos = Math.max(0, Math.floor(diferenciaMs / 60000));
                const esHoy = cita.fecha.getDate() === tiempoActual.getDate() && cita.fecha.getMonth() === tiempoActual.getMonth();
                const muyProximo = faltanMinutos <= 60 && esHoy && faltanMinutos > 0;

                return (
                  <div key={cita.cedula + cita.fecha.getTime()} className="flex items-center justify-between p-5 rounded-[24px] bg-slate-50/50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="flex flex-col items-center justify-center min-w-[70px] p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                        <span className="text-sm font-black text-slate-800 dark:text-white uppercase">
                          {formatearHora(cita)}
                        </span>
                      </div>
                      <div>
                        <h5 className="font-black text-slate-800 dark:text-white text-lg tracking-tight group-hover:text-primary transition-colors capitalize">
                          {cita.cliente}
                        </h5>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cita.servicio}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      {muyProximo ? (
                        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-xl font-black text-[10px] uppercase animate-pulse">
                            <div className="w-2 h-2 rounded-full bg-rose-500" />
                            En {faltanMinutos} min
                        </div>
                      ) : (
                        <span className={`px-4 py-2 rounded-xl font-black text-[10px] uppercase tracking-widest border ${
                          cita.estadoBase === 'PENT' || cita.estadoBase === 'Pendiente'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20' 
                            : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'
                        }`}>
                          {cita.estadoBase === 'PENT' ? 'Pendiente' : cita.estadoBase}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ================= RIGHT COLUMN (METRICS & TIPS) ================= */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CITAS HOY CARD */}
          <div className="group p-8 rounded-[35px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">Citas Hoy</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white">{stats.citasHoy}</h3>
              </div>
              <div className="p-4 rounded-2xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform duration-500">
                <CalendarDays size={28} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className={`flex items-center px-2 py-1 rounded-lg text-xs font-black ${
                stats.citasCrecimiento >= 0 
                  ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400' 
                  : 'bg-red-500/10 text-red-600 dark:text-red-400'
              }`}>
                {stats.citasCrecimiento >= 0 && <ArrowUpRight size={14} className="mr-0.5" />}
                {stats.citasCrecimiento}%
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">vs. ayer</span>
            </div>
          </div>

          {/* CONSEJO DEL DÍA */}
          <div className="p-8 rounded-[35px] bg-primary/5 dark:bg-primary/10 border border-primary/10 relative overflow-hidden group">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30">
                <Lightbulb size={20} />
              </div>
              <span className="text-sm font-black uppercase tracking-[0.15em] text-primary">Consejo del Día</span>
            </div>
            <p className="text-base text-slate-700 dark:text-slate-300 font-medium italic leading-relaxed z-10 relative">
              "{tipActual}"
            </p>
            <Lightbulb size={120} className="absolute -right-6 -bottom-6 text-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
          </div>

        </div>
      </div>
    </div>
  );
}