'use client';
import React, { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, XCircle, Coffee, AlertTriangle, Scissors } from "lucide-react";
import { jwtDecode } from "jwt-decode";

// Nuevas importaciones para el calendario profesional
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar el idioma español para el calendario
registerLocale('es', es);

interface Cita {
  id: number;
  cedula_cliente_id: string;
  cliente_nombre: string;
  fecha: string;
  hora: string;
  hora_formateada: string;
  id_servicio: number;
  nombre_servicio: string;
  estado: string;
}

// Componente personalizado para el input del calendario
const CustomDateInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 hover:border-primary/50 transition-all text-sm shadow-sm flex items-center justify-between min-w-[140px]"
    >
      <span className="tracking-wide">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
        )}
      </span>
    </button>
  )
);
CustomDateInput.displayName = 'CustomDateInput';


export default function ViewCitas() {
  const [citasDelDia, setCitasDelDia] = useState<Cita[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState<Date>(new Date());
  const [cargando, setCargando] = useState<boolean>(false);
  const [miIdBarbero, setMiIdBarbero] = useState<string | null>(null);
  
  // Estados para controlar los modales de cancelación y finalización
  const [citaACancelar, setCitaACancelar] = useState<number | null>(null);
  const [citaAFinalizar, setCitaAFinalizar] = useState<number | null>(null);

  // 1. OBTENER Y DECODIFICAR EL TOKEN AL MONTAR EL COMPONENTE
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No se encontró ningún 'token' en el localStorage.");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      const idDetectado = decoded.user_id || decoded.id || decoded.sub || decoded.cedula;

      if (idDetectado) {
        setMiIdBarbero(String(idDetectado));
      } else {
        console.warn("El token no contiene un ID válido.");
      }
    } catch (error) {
      console.error("Error al decodificar el token JWT:", error);
    }
  }, []);

  useEffect(() => {
    const cargarAgenda = async () => {
      if (!miIdBarbero) return;

      setCargando(true);
      const token = localStorage.getItem("token");
      const fechaFormatStr = format(fechaFiltro, 'yyyy-MM-dd');
      const urlApi = `/api/agenda/miAgenda?barberoId=${miIdBarbero}&fecha=${fechaFormatStr}`;

      try {
        const res = await fetch(urlApi, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
          cache: "no-store"
        });

        const response = await res.json();

        let citas: Cita[] = [];
        if (response.success && Array.isArray(response.data)) {
          citas = response.data;
        } else if (Array.isArray(response)) {
          citas = response;
        }

        setCitasDelDia(citas);
      } catch (error) {
        console.error("Error al cargar la agenda:", error);
        setCitasDelDia([]);
      } finally {
        setCargando(false);
      }
    };

    cargarAgenda();
  }, [fechaFiltro, miIdBarbero]);

  // Función modificada para procesar la finalización desde el modal
  const confirmarFinalizacion = async () => {
    if (citaAFinalizar === null) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/citas/finalizar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: citaAFinalizar })
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.message || "No se pudo finalizar la cita"));
        setCitaAFinalizar(null);
        return;
      }
      
      // Si fue exitoso, cerramos modal y removemos la cita
      setCitasDelDia(prev => prev.filter(c => c.id !== citaAFinalizar));
      setCitaAFinalizar(null);
    } catch (error) {
      alert("Error al conectar con el servidor");
      setCitaAFinalizar(null);
    }
  };

  // Función modificada para procesar la cancelación desde el modal
  const confirmarCancelacion = async () => {
    if (citaACancelar === null) return;
    
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/citas/cancelar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id: citaACancelar })
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.message || "No se pudo cancelar la cita"));
        setCitaACancelar(null);
        return;
      }
      // Si fue exitoso, cerramos modal y removemos la cita
      setCitasDelDia(prev => prev.filter(c => c.id !== citaACancelar));
      setCitaACancelar(null);
    } catch (error) {
      alert("Error al conectar con el servidor");
      setCitaACancelar(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-2 sm:p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* HEADER DE AGENDA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
            <Calendar size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Mi Agenda
            </h2>
            <p className="text-slate-500 font-medium">Gestiona tu flujo de trabajo diario</p>
          </div>
        </div>

        {/* INPUT DE CALENDARIO CUSTOMIZADO */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 pl-5 rounded-[20px] border border-slate-100 dark:border-slate-700 w-full md:w-auto relative z-20">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</span>
          <DatePicker
            selected={fechaFiltro}
            onChange={(date: Date | null) => setFechaFiltro(date || new Date())}
            locale="es"
            dateFormat="dd MMM yyyy"
            placeholderText="Seleccionar fecha"
            customInput={<CustomDateInput />}
          />
        </div>
      </div>

      {/* BANNER DE INFORMACIÓN */}
      <div className="bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded-3xl p-5 flex items-center gap-4">
        <div className="p-2.5 bg-indigo-500 text-white rounded-xl shadow-md">
          <AlertTriangle size={18} />
        </div>
        <p className="text-sm text-indigo-900 dark:text-indigo-200 font-semibold">
          <span className="opacity-70 uppercase text-[10px] block font-black tracking-widest mb-0.5">Aviso de seguridad</span>
          Las citas no se pueden anular si falta menos de 1 hora para el servicio.
        </p>
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div className="min-h-[450px]">
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Actualizando servicios...</p>
          </div>
        ) : citasDelDia.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-slate-50 dark:bg-slate-900/50 rounded-[50px] border-2 border-dashed border-slate-200 dark:border-slate-800"
          >
            <div className="bg-white dark:bg-slate-800 w-24 h-24 rounded-[30px] flex items-center justify-center mx-auto mb-6 shadow-xl text-slate-300">
              <Coffee size={48} strokeWidth={1.5} />
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white">Todo despejado</h3>
            <p className="text-slate-500 font-medium max-w-xs mx-auto mt-2 italic">Parece que no tienes citas agendadas para este día.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {citasDelDia.map((cita, index) => (
                <motion.div
                  key={cita.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05 }}
                  className="group bg-white dark:bg-slate-900 rounded-[35px] border border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg shadow-slate-200/40 dark:shadow-none hover:shadow-2xl transition-all duration-300"
                >
                  <div className="p-7">
                    {/* HORA Y STATUS */}
                    <div className="flex justify-between items-start mb-8">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                          <Clock size={24} />
                        </div>
                        <div>
                          <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">
                            {cita.hora_formateada || cita.hora}
                          </p>
                          <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Horario</span>
                        </div>
                      </div>
                      <div className="px-3 py-1 bg-emerald-50 dark:bg-emerald-500/10 rounded-full border border-emerald-100 dark:border-emerald-500/20">
                        <span className="text-[9px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">En cola</span>
                      </div>
                    </div>

                    {/* DATOS DEL CLIENTE Y SERVICIO */}
                    <div className="space-y-4 mb-8">
                      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
                          <User size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Cliente</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{cita.cliente_nombre || "Desconocido"}</p>
                          <p className="text-[11px] text-slate-400 font-medium">C.C. {cita.cedula_cliente_id}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-transparent group-hover:border-slate-100 dark:group-hover:border-slate-700 transition-colors">
                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 shadow-sm flex items-center justify-center text-slate-400">
                          <Scissors size={18} />
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Servicio</p>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 capitalize">{cita.nombre_servicio || `Ref: #${cita.id_servicio}`}</p>
                        </div>
                      </div>
                    </div>

                    {/* ACCIONES */}
                    <div className="grid grid-cols-2 gap-4">
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        // Actualizado para abrir el modal de finalizar
                        onClick={() => setCitaAFinalizar(cita.id)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                      >
                        <CheckCircle2 size={16} /> Finalizar
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setCitaACancelar(cita.id)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-2xl font-bold text-xs hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-all"
                      >
                        <XCircle size={16} /> Cancelar
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* MODAL DE CONFIRMACIÓN DE FINALIZACIÓN */}
      <AnimatePresence>
        {citaAFinalizar !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[30px] p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-500">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">¿Finalizar Cita?</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">
                Esta acción marcará el servicio como completado. ¿Estás seguro de que deseas continuar?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCitaAFinalizar(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={confirmarFinalizacion}
                  className="flex-1 py-3 bg-emerald-500 text-white rounded-xl font-bold text-sm hover:bg-emerald-600 shadow-lg shadow-emerald-500/30 transition-all"
                >
                  Sí, finalizar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MODAL DE CONFIRMACIÓN DE CANCELACIÓN */}
      <AnimatePresence>
        {citaACancelar !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-white dark:bg-slate-900 rounded-[30px] p-6 max-w-sm w-full shadow-2xl border border-slate-100 dark:border-slate-800 text-center"
            >
              <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <AlertTriangle size={32} />
              </div>
              <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">¿Cancelar Cita?</h3>
              <p className="text-slate-500 text-sm font-medium mb-6">
                Esta acción cancelará el turno y notificará al cliente. ¿Estás seguro de que deseas continuar?
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setCitaACancelar(null)}
                  className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-xl font-bold text-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  Volver
                </button>
                <button
                  onClick={confirmarCancelacion}
                  className="flex-1 py-3 bg-red-500 text-white rounded-xl font-bold text-sm hover:bg-red-600 shadow-lg shadow-red-500/30 transition-all"
                >
                  Sí, cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}