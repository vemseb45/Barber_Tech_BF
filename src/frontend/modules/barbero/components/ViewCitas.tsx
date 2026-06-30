'use client';
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, User, CheckCircle2, XCircle, Coffee, AlertTriangle, Scissors } from "lucide-react";
import { jwtDecode } from "jwt-decode";

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

export default function ViewCitas() {
  const [citasDelDia, setCitasDelDia] = useState<Cita[]>([]);
  const [fechaFiltro, setFechaFiltro] = useState<string>(new Date().toISOString().split('T')[0]);
  const [cargando, setCargando] = useState<boolean>(false);
  const [miIdBarbero, setMiIdBarbero] = useState<string | null>(null);

  // 1. OBTENER Y DECODIFICAR EL TOKEN AL MONTAR EL COMPONENTE
  useEffect(() => {
    console.log("🔍 [1] Componente montado. Buscando token en localStorage...");
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("❌ [1.1] No se encontró ningún 'token' en el localStorage. Revisa cómo lo estás guardando al iniciar sesión.");
      return;
    }

    try {
      const decoded: any = jwtDecode(token);
      console.log("📦 [1.2] Token decodificado correctamente. Contenido del payload:", decoded);

      // Intentamos leer el ID desde las propiedades más comunes en payloads JWT
      const idDetectado = decoded.user_id || decoded.id || decoded.sub || decoded.cedula;

      if (idDetectado) {
        console.log(`✅ [1.3] ID del barbero detectado con éxito: ${idDetectado}`);
        setMiIdBarbero(String(idDetectado));
      } else {
        console.warn("⚠️ [1.4] El token existe pero no contiene las propiedades 'user_id', 'id', 'sub' ni 'cedula'. Revisa la estructura de tu JWT.");
      }
    } catch (error) {
      console.error("❌ [1.5] Error crítico al decodificar el token JWT:", error);
    }
  }, []);

  useEffect(() => {
    console.log(`🔄 [2] useEffect de carga disparado. BarberoID actual: '${miIdBarbero}', Fecha Filtro: '${fechaFiltro}'`);

    const cargarAgenda = async () => {
      if (!miIdBarbero) {
        console.warn("⏳ [2.1] Esperando a que se establezca miIdBarbero antes de disparar el fetch...");
        return;
      }

      setCargando(true);
      const token = localStorage.getItem("token");

      const urlApi = `/api/agenda/miAgenda?barberoId=${miIdBarbero}&fecha=${fechaFiltro}`;
      console.log(`🚀 [2.2] Enviando petición HTTP FETCH a: ${urlApi}`);

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

        console.log(`📡 [2.3] Respuesta recibida del servidor. Status Code: ${res.status}`);
        const response = await res.json();
        console.log("📊 [2.4] Datos parseados de la respuesta de la API:", response);

        let citas: Cita[] = [];
        if (response.success && Array.isArray(response.data)) {
          citas = response.data;
        } else if (Array.isArray(response)) {
          citas = response;
        }

        console.log(`✨ [2.5] Total de citas mapeadas en estado: ${citas.length}`);
        setCitasDelDia(citas);
      } catch (error) {
        console.error("❌ [2.6] Error de conexión o de red al intentar ejecutar el fetch:", error);
        setCitasDelDia([]);
      } finally {
        setCargando(false);
      }
    };

    cargarAgenda();
  }, [fechaFiltro, miIdBarbero]);

  const handleFinalizar = async (id: number) => {
    const token = localStorage.getItem("token");
    try {
      // La URL ahora es estática: /api/citas/finalizar
      const res = await fetch(`/api/citas/finalizar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        // Enviamos el ID en el body
        body: JSON.stringify({ id })
      });

      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.message || "No se pudo finalizar la cita"));
        return;
      }
      setCitasDelDia(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Error al conectar con el servidor");
    }
  };

  const handleCancelar = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas cancelar esta cita?")) return;
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/citas/cancelar`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ id })
      });
      const data = await res.json();
      if (!res.ok) {
        alert("Error: " + (data.message || "No se pudo cancelar la cita"));
        return;
      }
      setCitasDelDia(prev => prev.filter(c => c.id !== id));
    } catch (error) {
      alert("Error al conectar con el servidor");
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

        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-800/50 p-2 pl-5 rounded-[20px] border border-slate-100 dark:border-slate-700 w-full md:w-auto">
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha</span>
          <input
            type="date"
            value={fechaFiltro}
            onChange={(e) => setFechaFiltro(e.target.value)}
            className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold outline-none cursor-pointer px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-primary/20 transition-all text-sm shadow-sm"
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
                        onClick={() => handleFinalizar(cita.id)}
                        className="flex items-center justify-center gap-2 py-3.5 bg-primary text-white rounded-2xl font-bold text-xs shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                      >
                        <CheckCircle2 size={16} /> Finalizar
                      </motion.button>
                      <motion.button
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleCancelar(cita.id)}
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
    </div>
  );
}