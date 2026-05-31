"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, User, Scissors, MapPin, MoreVertical, CheckCircle2, AlertCircle } from "lucide-react";

interface Cita {
  id: number;
  fecha: string;
  hora: string;
  servicio_nombre?: string;
  servicio_precio?: string | number;
  barbero_nombre?: string;
}

export default function ViewPendientes() {
  const [citas, setCitas] = useState<Cita[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [mensajeAccion, setMensajeAccion] = useState<any>(null);

  useEffect(() => {
    const fetchCitas = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/cita/pendientes/cliente/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.ok) throw new Error("No se pudieron cargar las citas");
        const data = await res.json();
        setCitas(data.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);

  const formatearFechaLocal = (fechaStr: string) => {
    const [year, month, day] = fechaStr.split("-");
    return new Date(Number(year), Number(month) - 1, Number(day));
  };

  const handleCancelar = async (cita: Cita) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita? Esta acción no se puede deshacer.")) {
      return;
    }
    const token = localStorage.getItem("token");

    const [year, month, day] = cita.fecha.split("-");
    const [hora, minuto] = cita.hora.split(":");
    const fechaCita = new Date(Number(year), Number(month) - 1, Number(day), Number(hora), Number(minuto));
    const ahora = new Date();
    const diferenciaHoras = (fechaCita.getTime() - ahora.getTime()) / (1000 * 60 * 60);

    if (diferenciaHoras < 2) {
      setMensajeAccion({ type: "error", text: "Solo puedes cancelar con mínimo 2 horas de anticipación" });
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/cita/cancelar/${cita.id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      const data = await res.json();

      if (!res.ok) {
        setMensajeAccion({ type: "error", text: data.message || "No se pudo cancelar" });
        return;
      }
      setCitas(prev => prev.filter(c => c.id !== cita.id));
      setMensajeAccion({ type: "success", text: "Cita cancelada correctamente" });
    } catch (error) {
      setMensajeAccion({ type: "error", text: "Error al conectar con el servidor" });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Mis Citas</h2>
          <p className="text-slate-500 font-medium">Gestiona tus próximos encuentros</p>
        </div>
        <div className="hidden sm:block text-right">
          <span className="text-xs font-bold uppercase tracking-widest text-primary opacity-60">Total: {citas.length}</span>
        </div>
      </header>
      
      {mensajeAccion && (
        <div className={`mb-6 p-4 rounded-2xl font-bold text-sm flex items-center gap-2 ${mensajeAccion.type === "success" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"}`}>
          {mensajeAccion.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
          {mensajeAccion.text}
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          <p className="text-slate-400 font-medium animate-pulse">Buscando tu agenda...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-2xl text-center font-medium border border-red-100 dark:border-red-800">
          {error}
        </div>
      )}

      {!loading && citas.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem]">
          <div className="bg-slate-100 dark:bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarDays className="text-slate-400" size={32} />
          </div>
          <p className="text-slate-500 font-bold text-lg">No hay citas en el horizonte</p>
          <p className="text-slate-400 text-sm">¿Qué tal un nuevo corte hoy?</p>
        </motion.div>
      )}

      <div className="grid gap-6">
        <AnimatePresence>
          {citas.map((cita, index) => (
            <motion.div key={cita.id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }} className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 dark:border-slate-800">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-40 bg-slate-50 dark:bg-slate-800/50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-black uppercase tracking-tighter text-slate-400 mb-1">{formatearFechaLocal(cita.fecha).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                  <span className="text-3xl font-black text-primary leading-none">{formatearFechaLocal(cita.fecha).getDate()}</span>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-300 capitalize">{formatearFechaLocal(cita.fecha).toLocaleDateString('es-ES', { month: 'short' })}</span>
                  <div className="mt-3 flex items-center gap-1 bg-white dark:bg-slate-700 px-3 py-1 rounded-full shadow-sm">
                    <Clock size={12} className="text-primary" />
                    <span className="text-xs font-bold tracking-tight">{cita.hora}</span>
                  </div>
                </div>

                <div className="flex-1 p-6 relative">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-yellow-100 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-500 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" /> Próximamente
                      </span>
                      <h4 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-primary transition-colors">{cita.servicio_nombre || "Corte de Cabello"}</h4>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleCancelar(cita)} className="text-xs font-bold px-3 py-1 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition">Cancelar</button>
                      <button className="text-slate-300 hover:text-slate-600 dark:hover:text-slate-100 transition-colors"><MoreVertical size={20} /></button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><User size={18} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Barbero</p>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{cita.barbero_nombre || "Especialista"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500"><Scissors size={18} /></div>
                      <div>
                        <p className="text-[10px] uppercase font-bold text-slate-400 leading-none mb-1">Inversión</p>
                        <p className="text-sm font-bold text-primary">${Number(cita.servicio_precio || 0).toLocaleString('es-CO')}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}