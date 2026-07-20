"use client";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CalendarDays, Clock, User, Timer, AlertCircle, CheckCircle2, XCircle, CalendarClock } from "lucide-react";

interface CitaPendiente {
  id: number;
  id_cita?: number;
  fecha: string;
  hora: string;
  estado: string;
  servicio_nombre?: string;
  servicio_precio?: string | number;
  barbero_nombre?: string;
  url_pago?: string;
  cedula_barbero?: string; // Útil si la API lo requiere
}

export default function ViewPendientes() {
  const [citas, setCitas] = useState<CitaPendiente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ================= ESTADOS DEL MODAL =================
  const [citaAReagendar, setCitaAReagendar] = useState<CitaPendiente | null>(null);
  const [nuevaFecha, setNuevaFecha] = useState("");
  const [nuevaHora, setNuevaHora] = useState("");
  const [loadingReagendar, setLoadingReagendar] = useState(false);

  useEffect(() => {
    const fetchCitas = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/citas/pendientes/cliente/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Error al obtener las citas pendientes");
        const data = await res.json();
        
        const listaCitas = Array.isArray(data) ? data : (data.data || []);
        setCitas(listaCitas);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCitas();
  }, []);

  const handleCancelar = async (idCita: number) => {
    const confirmar = window.confirm("¿Estás seguro de que deseas cancelar esta cita?");
    if (!confirmar) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/citas/cancelar`, {
        method: "PATCH", 
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id_cita: idCita })
      });

      if (res.ok) {
        setCitas(prev => prev.filter(c => (c.id || c.id_cita) !== idCita));
        alert("Cita cancelada exitosamente");
      } else {
        alert("No se pudo cancelar la cita");
      }
    } catch (e) {
      console.error(e);
      alert("Error de red al intentar cancelar");
    }
  };

  // ================= LÓGICA DE REAGENDAR =================
  const abrirModalReagendar = (cita: CitaPendiente) => {
    setCitaAReagendar(cita);
    setNuevaFecha(cita.fecha.split("T")[0]); // Ajusta si la fecha viene con timezones
    
    // Extraemos solo HH:mm para el input type="time"
    const horaLimpia = cita.hora.length > 5 ? cita.hora.substring(0, 5) : cita.hora;
    setNuevaHora(horaLimpia);
  };

  const submitReagendar = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!citaAReagendar) return;

    setLoadingReagendar(true);
    const idCita = citaAReagendar.id || citaAReagendar.id_cita;

    // Prisma espera el formato de hora HH:mm:ss
    const horaFormateada = nuevaHora.length === 5 ? `${nuevaHora}:00` : nuevaHora;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/citas/reagendar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id_cita: idCita,
          nueva_fecha: nuevaFecha,
          nueva_hora: horaFormateada,
        })
      });

      const data = await res.json();

      if (res.ok) {
        // Actualizamos la cita en el estado local para reflejar el cambio inmediato
        setCitas(prev => prev.map(c => 
          (c.id === idCita || c.id_cita === idCita) 
            ? { ...c, fecha: nuevaFecha, hora: nuevaHora } 
            : c
        ));
        alert("Cita reagendada exitosamente");
        setCitaAReagendar(null); // Cerramos modal
      } else {
        alert(data.message || "Error al reagendar la cita");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión al reagendar");
    } finally {
      setLoadingReagendar(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 relative">
      <header className="mb-10 relative">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-amber-500/10 dark:bg-amber-500/20 rounded-2xl ring-1 ring-amber-500/20">
            <Timer className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-none">Citas Próximas</h2>
            <p className="text-slate-500 font-medium mt-1 text-sm sm:text-base">Gestiona tus próximas visitas a la barbería</p>
          </div>
        </div>
      </header>

      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div key={i} animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }} className="w-3 h-3 bg-primary rounded-full" />
            ))}
          </div>
          <p className="text-slate-400 text-sm font-bold animate-pulse uppercase tracking-widest">Cargando tu agenda</p>
        </div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-red-50 dark:bg-red-500/5 border border-red-200 dark:border-red-500/20 p-6 rounded-3xl text-red-600 dark:text-red-400 text-center shadow-xl shadow-red-500/5">
          <p className="font-bold flex items-center justify-center gap-2"><AlertCircle size={20}/> {error}</p>
        </motion.div>
      )}

      {!loading && citas.length === 0 && !error && (
        <div className="text-center py-20 bg-slate-50/50 dark:bg-slate-800/20 rounded-[40px] border-2 border-dashed border-slate-200 dark:border-slate-800">
          <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <CalendarDays className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
          <p className="text-xl font-black text-slate-400 dark:text-slate-500">Tu agenda está vacía</p>
          <p className="text-slate-400 text-sm mt-1">No tienes citas próximas programadas.</p>
        </div>
      )}

      <div className="grid gap-6">
        <AnimatePresence>
          {citas.map((cita, index) => {
            const isConfirmada = cita.estado === 'CONF' || cita.estado === 'Confirmada';
            const uniqueId = cita.id || cita.id_cita || index;

            return (
              <motion.div 
                key={uniqueId} 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, scale: 0.9, height: 0 }}
                transition={{ delay: index * 0.05 }} 
                className="group relative bg-white dark:bg-[#1e293b] hover:shadow-xl rounded-[32px] p-1 border border-slate-100 dark:border-slate-700/50 transition-all duration-300"
              >
                <div className="p-6 md:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  
                  {/* Info Izquierda... (Se mantiene igual que tu código original) */}
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center justify-center px-6 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700 shrink-0">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Día</span>
                      <span className="text-3xl font-black text-primary leading-none">
                        {cita.fecha ? cita.fecha.split("-")[2].substring(0,2) : "00"}
                      </span>
                      <span className="text-xs font-bold text-slate-500 uppercase mt-1">
                        {cita.fecha ? new Date(cita.fecha).toLocaleDateString('es-CO', { month: 'short' }) : "Mes"}
                      </span>
                    </div>

                    <div className="flex flex-col justify-center gap-3">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <h4 className="font-black text-slate-800 dark:text-slate-100 text-xl leading-tight">
                            {cita.servicio_nombre || "Servicio"}
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
                        <p className="text-sm font-bold text-primary">${Number(cita.servicio_precio || 0).toLocaleString('es-CO')}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          <Clock size={14} className="text-slate-400" /> {cita.hora}
                        </div>
                        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-100 dark:border-slate-700">
                          <User size={14} className="text-slate-400" /> {cita.barbero_nombre || "Especialista"}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ================= ACCIONES ACTUALIZADAS ================= */}
                  <div className="flex flex-wrap lg:flex-col items-center lg:items-end gap-3 pt-4 lg:pt-0 border-t lg:border-none border-slate-100 dark:border-slate-800 w-full lg:w-auto">
                    
                    {!isConfirmada && cita.url_pago && (
                       <a href={cita.url_pago} target="_blank" rel="noreferrer" className="flex-1 lg:flex-none w-full lg:w-auto text-center px-6 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold shadow-lg hover:scale-105 transition-all">
                         Pagar Anticipo
                       </a>
                    )}
                    
                    <div className="flex w-full lg:w-auto gap-2">
                      {/* Botón Reagendar */}
                      <button 
                        onClick={() => abrirModalReagendar(cita)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-sm font-bold hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all border border-transparent hover:border-blue-200 dark:hover:border-blue-500/30"
                      >
                        <CalendarClock size={18} /> Reagendar
                      </button>

                      {/* Botón Cancelar */}
                      <button 
                        onClick={() => handleCancelar(uniqueId as number)}
                        className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 rounded-xl text-sm font-bold hover:bg-red-100 dark:hover:bg-red-500/20 transition-all border border-transparent hover:border-red-200 dark:hover:border-red-500/30"
                      >
                        <XCircle size={18} /> Cancelar
                      </button>
                    </div>

                  </div>
                </div>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      {/* ================= MODAL REAGENDAR ================= */}
      <AnimatePresence>
        {citaAReagendar && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[32px] p-8 w-full max-w-md shadow-2xl border border-slate-100 dark:border-slate-800"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
                  <CalendarClock size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">Reagendar Cita</h3>
                  <p className="text-sm text-slate-500">Elige un nuevo horario</p>
                </div>
              </div>

              <form onSubmit={submitReagendar} className="space-y-5">
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nueva Fecha</label>
                  <input 
                    type="date" 
                    required
                    value={nuevaFecha}
                    onChange={(e) => setNuevaFecha(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Nueva Hora</label>
                  <input 
                    type="time" 
                    required
                    value={nuevaHora}
                    onChange={(e) => setNuevaHora(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>

                <div className="flex gap-3 pt-4 mt-6 border-t border-slate-100 dark:border-slate-800">
                  <button 
                    type="button" 
                    onClick={() => setCitaAReagendar(null)}
                    disabled={loadingReagendar}
                    className="flex-1 px-4 py-3 rounded-xl font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all disabled:opacity-50"
                  >
                    Cerrar
                  </button>
                  <button 
                    type="submit" 
                    disabled={loadingReagendar}
                    className="flex-1 px-4 py-3 rounded-xl font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingReagendar ? (
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full" />
                    ) : (
                      "Confirmar"
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}