'use client';
import { useState, useEffect } from "react";
import { XCircle, CalendarX, User, Scissors, Clock, DollarSign, TrendingDown } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

interface CitaCancelada {
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

export default function ViewCanceladas() {
  const [citasCanceladas, setCitasCanceladas] = useState<CitaCancelada[]>([])

  useEffect(() => {
    fetch(`/api/citas/historial?estado=CANC`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setCitasCanceladas(response.data);
        }
      })
      .catch(() => setCitasCanceladas([]));
  }, []);
  const totalPerdido = citasCanceladas.reduce((acc, s) => acc + s.precio, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER PROFESIONAL */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-100 dark:border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-red-50 dark:bg-red-500/10 rounded-xl">
              <CalendarX className="text-red-500 dark:text-red-400" size={26} />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-white">
              Citas Canceladas
            </h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Análisis y registro de servicios no concretados.
          </p>
        </div>
      </div>

      {/* STATS CARDS CON DISEÑO MODERNO */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-2xl text-red-500">
            <TrendingDown size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Monto No Percibido</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">
              ${totalPerdido.toLocaleString('es-CO')}
            </h3>
          </div>
          <div className="absolute top-[-10px] right-[-10px] opacity-[0.03] dark:opacity-[0.05] text-red-500 rotate-12">
            <DollarSign size={120} />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-500">
            <XCircle size={32} />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Volumen</p>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">{citasCanceladas.length} <span className="text-sm font-medium text-slate-400">Citas</span></h3>
          </div>
        </div>
      </div>

      {/* TABLA ESTILO DASHBOARD */}
      <div className="bg-white dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Información Temporal</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Cliente</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Servicio</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Valor</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Estado</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
              {citasCanceladas.length > 0 ? (
                citasCanceladas.map((item) => (
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
                        <span className="font-bold text-slate-800 dark:text-slate-200">{item.cliente}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <Scissors size={14} className="text-primary/60" />
                        <span className="text-sm font-medium text-slate-600 dark:text-slate-300">{item.servicio}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <span className="font-black text-slate-900 dark:text-white">
                        ${item.precio.toLocaleString('es-CO')}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center">
                      <span className="px-4 py-1.5 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-xl text-[10px] font-black uppercase tracking-tighter border border-red-100 dark:border-red-500/20">
                        Cancelado
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-30">
                      <CalendarX size={48} />
                      <p className="font-bold">No se encontraron registros de cancelaciones</p>
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