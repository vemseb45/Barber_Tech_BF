"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, User, CheckCircle2, Receipt, CreditCard } from "lucide-react";

// 👇 Ajusta esta ruta a donde realmente tengas tu ModalPago en Next.js
//import ModalPago from "@/components/pago/ModalPago"; 

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  servicio_nombre?: string;
  servicio_precio?: string | number;
  barbero_nombre?: string;
}

export default function ViewTerminadas() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCita, setSelectedCita] = useState<{ id: number, valor: string } | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/citas/terminadas/cliente/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener el historial");
        const data = await res.json();
        setCitas(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, [refreshTrigger]); 

  const abrirModalPago = (id: number, precio: string | number) => {
    setSelectedCita({ id, valor: String(precio || 0) });
    setIsModalOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8">
      <header className="mb-10 relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-2xl ring-1 ring-primary/20"><Receipt className="w-6 h-6 text-primary" /></div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Historial de Visitas</h2>
            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Revise el registro detallado de sus servicios finalizados</p>
          </div>
        </div>
      </header>

      {loading && citas.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-3 h-3 bg-primary rounded-full shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
            ))}
          </div>
          <p className="text-slate-400 text-sm font-bold animate-pulse uppercase tracking-widest">Cargando historial</p>
        </div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-6 rounded-3xl text-red-600 dark:text-red-400 text-center shadow-xl shadow-red-500/5">
          <p className="font-bold">{error}</p>
        </motion.div>
      )}

      {!loading && citas.length === 0 && !error && (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-xl font-black text-slate-400 dark:text-slate-500">No hay registros disponibles</p>
          <p className="text-slate-400 text-sm mt-1">Sus citas completadas aparecerán listadas aquí.</p>
        </div>
      )}

      <div className="grid gap-4">
        <AnimatePresence>
          {citas.map((cita, index) => (
            <motion.div key={cita.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.05 }} className="group relative bg-white dark:bg-slate-900 hover:shadow-2xl hover:shadow-slate-200 dark:hover:shadow-black/40 rounded-[32px] p-1 border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:-translate-y-1">
              <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="relative shrink-0">
                    <div className="w-14 h-14 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-500">
                      <CheckCircle2 size={28} strokeWidth={2.5} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-3">
                    <div className="col-span-2 lg:col-span-1">
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Servicio Realizado</p>
                      <h4 className="font-black text-slate-800 dark:text-slate-100 text-lg leading-tight group-hover:text-primary transition-colors">{cita.servicio_nombre || "Corte Standard"}</h4>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Especialista</p>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <div className="w-5 h-5 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center"><User size={12} className="text-slate-500" /></div>
                        <span className="text-sm font-bold">{cita.barbero_nombre || "Especialista"}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Fecha</p>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm"><CalendarDays size={14} className="text-primary" /><span>{cita.fecha}</span></div>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 mb-1">Hora</p>
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 font-bold text-sm"><Clock size={14} className="text-primary" /><span>{cita.hora}</span></div>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center border-t md:border-none pt-4 md:pt-0 gap-3">
                  <div className="flex flex-col items-start md:items-end">
                    <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">${Number(cita.servicio_precio || 0).toLocaleString('es-CO')}</span>
                    <div className="flex items-center gap-1.5 px-3 py-1 mt-1 bg-green-100 dark:bg-green-500/10 text-green-600 dark:text-green-400 rounded-full">
                       <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /><span className="text-[10px] font-black uppercase tracking-wider">Completado</span>
                    </div>
                  </div>
                  <button onClick={() => abrirModalPago(cita.id, cita.servicio_precio || 0)} className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                    <CreditCard size={16} /> Pagar
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* <ModalPago 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        citaId={selectedCita?.id || null}
        valorSugerido={selectedCita?.valor || ""}
        onPagoExitoso={() => { setRefreshTrigger(prev => prev + 1); }}
      /> */}
    </div>
  );
}