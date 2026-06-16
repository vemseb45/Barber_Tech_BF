'use client';
import { useState, useEffect } from "react";
import { History, CheckCircle2, DollarSign, CalendarCheck, User, Clock, Scissors, TrendingUp } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

interface ServicioRealizado {
  id: number;
  cliente: string;
  servicio: string;
  fecha: string;
  hora: string;
  precio: number;
}

interface JwtPayload {
  user_id: string;
}

export default function ViewHistorial() {
  const [serviciosRealizados, setServiciosRealizados] = useState<ServicioRealizado[]>([]);
  const [miIdBarbero, setMiIdBarbero] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.user_id) setMiIdBarbero(String(decoded.user_id));
    } catch (error) {
      console.error("Error token");
    }
  }, []);

  useEffect(() => {
    if (!miIdBarbero) return;
    fetch(`http://127.0.0.1:8000/api/cita/historial/?barberoId=${miIdBarbero}`)
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setServiciosRealizados(response.data);
        }
      })
      .catch(() => setServiciosRealizados([]));
  }, [miIdBarbero]);

  const totalGenerado = serviciosRealizados.reduce((acc, s) => acc + s.precio, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER PROFESIONAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-primary/10 rounded-xl">
              <History className="text-primary" size={26} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Servicios Realizados
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Registro detallado de tu productividad y ganancias acumuladas.
          </p>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Ingresos */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500">
            <TrendingUp size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Generado</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${totalGenerado.toLocaleString('es-CO')}
            </h3>
          </div>
          <div className="absolute top-[-10px] right-[-10px] opacity-[0.03] dark:opacity-[0.05] text-emerald-500 rotate-12">
            <DollarSign size={120} />
          </div>
        </div>

        {/* Card de Volumen */}
        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500">
            <CalendarCheck size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Servicios Totales</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              {serviciosRealizados.length} <span className="text-sm font-medium text-slate-400">Finalizados</span>
            </h3>
          </div>
        </div>
      </div>

      {/* TABLA ESTILO PREMIUM */}
      <div className="bg-white dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Fecha y Hora</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Servicio</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Monto</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {serviciosRealizados.length > 0 ? (
                serviciosRealizados.map((item) => (
                  <tr key={item.id} className="group hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{item.fecha}</span>
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Clock size={12} /> {item.hora}
                        </span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                          <User size={14} />
                        </div>
                        <span className="font-bold text-slate-800 dark:text-white">{item.cliente}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Scissors size={14} className="text-primary/60" />
                        <span className="text-sm font-medium">{item.servicio}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-black text-emerald-600 dark:text-emerald-400">
                        +${item.precio.toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-emerald-100 dark:border-emerald-500/20 inline-flex items-center gap-1.5">
                        <CheckCircle2 size={12} strokeWidth={3} />
                        Completado
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <History size={48} />
                      <p className="font-bold">Aún no hay servicios registrados en el historial</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}