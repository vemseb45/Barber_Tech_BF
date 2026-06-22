'use client';
import { useState, useEffect } from 'react';
import {
  CalendarDays,
  Star,
  UserPlus,
  Lightbulb,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Briefcase
} from 'lucide-react';
import type { BarberoView } from '@/frontend/types/types_barbero'; // Ajusta la ruta a donde pongas types.ts
import { jwtDecode } from "jwt-decode";

interface ViewInicioProps {
  onViewChange: (view: BarberoView) => void;
}

interface JwtPayload {
  user_id: string;
}

export default function ViewInicio({ onViewChange }: ViewInicioProps) {
  const [tiempoActual, setTiempoActual] = useState(new Date());
  const [proximasCitas, setProximasCitas] = useState<any[]>([]);
  const [miIdBarbero, setMiIdBarbero] = useState<string | null>(null);
  
  // Agregamos un estado para el username, manejando correctamente Next.js
  const [username, setUsername] = useState<string>('Barbero');

  const [stats, setStats] = useState({
    citasHoy: 0,
    citasCrecimiento: 0,
    ganancias: 450.00,
    gananciasCrecimiento: 10,
    nuevosClientes: 0,
    clientesCrecimiento: 0
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
    // Obtenemos el nombre del usuario solo en el cliente (navegador)
    if (typeof window !== 'undefined') {
      setUsername(localStorage.getItem('username') || 'Barbero');
    }

    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.user_id) setMiIdBarbero(String(decoded.user_id));
    } catch (error) {
      console.error("Error decodificando token");
    }
  }, []);

  useEffect(() => {
    const intervalo = setInterval(() => setTiempoActual(new Date()), 60000);
    return () => clearInterval(intervalo);
  }, []);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        if (!miIdBarbero) return;
        const ayer = new Date();
        ayer.setDate(ayer.getDate() - 1);
        const fechaInicio = ayer.toISOString().split("T")[0]; // Desde ayer

        const futura = new Date();
        futura.setDate(futura.getDate() + 7);
        const fechaFin = futura.toISOString().split("T")[0]; // Hasta en 7 días

        const res = await fetch(
          `/api/agenda/miAgenda/`
        );
        const data = await res.json();
        const lista = data.data || [];
        const ahora = new Date();

        // 1. Calcular KPIs Reales (Hoy vs Ayer)
        const hoy = new Date();
        const hoyStr = hoy.toISOString().split("T")[0];
        const ayerStr = ayer.toISOString().split("T")[0];

        const citasHoyArr = lista.filter((c: any) => c.fecha === hoyStr);
        const citasAyerArr = lista.filter((c: any) => c.fecha === ayerStr);

        const countHoy = citasHoyArr.length;
        const countAyer = citasAyerArr.length;
        let citasCrecimiento = 0;
        if (countAyer === 0 && countHoy > 0) citasCrecimiento = 100;
        else if (countAyer > 0) citasCrecimiento = Math.round(((countHoy - countAyer) / countAyer) * 100);

        const clientesHoy = new Set(citasHoyArr.map((c: any) => c.cedula_cliente_id)).size;
        const clientesAyer = new Set(citasAyerArr.map((c: any) => c.cedula_cliente_id)).size;
        let clientesCrecimiento = 0;
        if (clientesAyer === 0 && clientesHoy > 0) clientesCrecimiento = 100;
        else if (clientesAyer > 0) clientesCrecimiento = Math.round(((clientesHoy - clientesAyer) / clientesAyer) * 100);

        setStats(prev => ({
          ...prev,
          citasHoy: countHoy,
          citasCrecimiento,
          nuevosClientes: clientesHoy,
          clientesCrecimiento
        }));

        // 2. Filtrar próximas citas (solo futuras a partir de este instante)
        const citas = lista
          .map((cita: any) => ({
            cedula: cita.cedula_cliente_id,
            cliente: cita.cliente_nombre || `Cliente ${cita.cedula_cliente_id}`,
            servicio: cita.nombre_servicio || 'Servicio',
            fecha: new Date(`${cita.fecha}T${cita.hora}`),
            estadoBase: cita.estado || 'Pendiente'
          }))
          .filter((cita: any) => cita.fecha.getTime() > ahora.getTime() && cita.fecha.toISOString().split("T")[0] >= hoyStr)
          .sort((a: any, b: any) => a.fecha.getTime() - b.fecha.getTime())
          .slice(0, 3);

        setProximasCitas(citas);
      } catch (error) {
        console.error("Error cargando citas:", error);
      }
    };
    fetchCitas();
  }, [miIdBarbero]);

  const formatearHora = (fecha: Date) => {
    return fecha.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* WELCOME SECTION */}
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
        {/* Decorative elements */}
        <div className="absolute right-[-20px] top-[-20px] w-64 h-64 bg-primary/10 rounded-full blur-3xl"></div>
      </div>

      {/* KEY METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Citas Hoy', val: stats.citasHoy, inc: stats.citasCrecimiento, icon: CalendarDays, color: 'text-blue-500', bg: 'bg-blue-500/10' },
          { label: 'Rating Global', val: '4.9', inc: '+0.2', icon: Star, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'Nuevos Clientes', val: stats.nuevosClientes, inc: stats.clientesCrecimiento, icon: UserPlus, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        ].map((item, i) => (
          <div key={i} className="group p-8 rounded-[35px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 mb-3">{item.label}</p>
                <h3 className="text-4xl font-black text-slate-800 dark:text-white">{item.val}</h3>
              </div>
              <div className={`p-4 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform duration-500`}>
                <item.icon size={28} />
              </div>
            </div>
            <div className="mt-6 flex items-center gap-2">
              <span className="flex items-center px-2 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-black">
                <ArrowUpRight size={14} className="mr-0.5" />
                {typeof item.inc === 'number' ? `${item.inc}%` : item.inc}
              </span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">vs. periodo anterior</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* UPCOMING APPOINTMENTS TABLE */}
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
            {proximasCitas.map((cita) => {
              const diferenciaMs = cita.fecha.getTime() - tiempoActual.getTime();
              const faltanMinutos = Math.max(0, Math.floor(diferenciaMs / 60000));
              const esHoy = cita.fecha.getDate() === tiempoActual.getDate();
              const muyProximo = faltanMinutos <= 60 && esHoy && faltanMinutos > 0;

              return (
                <div key={cita.cedula} className="flex items-center justify-between p-5 rounded-[24px] bg-slate-50/50 dark:bg-slate-800/30 border border-transparent hover:border-slate-200 dark:hover:border-slate-700 transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="flex flex-col items-center justify-center min-w-[60px] p-2 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
                      <span className="text-lg font-black text-slate-800 dark:text-white">{formatearHora(cita.fecha)}</span>
                      <span className="text-[9px] font-black text-primary uppercase">HORA</span>
                    </div>
                    <div>
                      <h5 className="font-black text-slate-800 dark:text-white text-lg tracking-tight group-hover:text-primary transition-colors">
                        {cita.cliente}
                      </h5>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Cédula: {cita.cedula}</span>
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
                        cita.estadoBase === 'PENT' 
                          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' 
                          : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-100 dark:border-slate-700'
                      }`}>
                        {cita.estadoBase === 'PENT' ? 'En espera' : cita.estadoBase}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* PERFORMANCE & TIPS */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-sm">
            <h4 className="font-black text-xl text-slate-800 dark:text-white mb-6">Demanda de Servicios</h4>
            <div className="space-y-5">
              {[
                { name: 'Corte Cabello', pct: 45, color: 'bg-blue-500' },
                { name: 'Recorte Barba', pct: 30, color: 'bg-purple-500' },
                { name: 'Combo Imperial', pct: 20, color: 'bg-amber-500' },
              ].map((s, i) => (
                <div key={i} className="group">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest mb-2">
                    <span className="text-slate-500 group-hover:text-slate-800 dark:group-hover:text-white transition-colors">{s.name}</span>
                    <span className="text-primary">{s.pct}%</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`${s.color} h-full rounded-full transition-all duration-1000 group-hover:brightness-110`} 
                      style={{ width: `${s.pct}%` }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 rounded-[28px] bg-primary/5 dark:bg-primary/10 border border-primary/10 relative overflow-hidden group">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-primary text-white rounded-xl shadow-lg shadow-primary/30">
                  <Lightbulb size={18} />
                </div>
                <span className="text-xs font-black uppercase tracking-[0.15em] text-primary">Consejo del Día</span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 font-medium italic leading-relaxed leading-snug">
                "{tipActual}"
              </p>
              <Lightbulb size={90} className="absolute -right-6 -bottom-6 text-primary/5 rotate-12 group-hover:rotate-0 transition-transform duration-700" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}