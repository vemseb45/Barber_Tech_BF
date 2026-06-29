"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import { CalendarDays } from "lucide-react";
import Calendario from "@/frontend/modules/cliente/components/Calendario"; 
import type { Bloque } from "@/frontend/modules/cliente/components/Calendario";

interface JwtPayload {
  user_id?: string;
  sub?: string;
  id?: string;
  exp?: number;
}

interface Barbero {
  id: string;
  username: string;
  especialidad: string;
}

interface Servicio {
  id_servicio: number; 
  nombre: string;
  precio: string;
  duracion_minutos: number;
}

export default function AgendaCitasCliente() {
  const [barberos, setBarberos] = useState<Barbero[]>([]);
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<string | null>(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState<number | null>(null);
  const [fechaSeleccionada, setFechaSeleccionada] = useState<string>("");
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");
  const [horaDbSeleccionada, setHoraDbSeleccionada] = useState<string>("");
  const [bloquesDisponibles, setBloquesDisponibles] = useState<Bloque[]>([]);
  const [cedulaCliente, setCedulaCliente] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const inicializarModulo = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") { 
        console.warn("No hay un token válido, redirigiendo a login...");
        router.push("/login"); 
        return; 
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            console.warn("El token ha expirado. Redirigiendo a login...");
            localStorage.removeItem("token");
            router.push("/login");
            return;
        }

        const idCliente = decoded.user_id || decoded.sub || decoded.id;
        if (idCliente) {
            setCedulaCliente(Number(idCliente));
        }

        const [resBarberos, resServicios] = await Promise.all([
          fetch("/api/barberos", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("/api/servicios", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (resServicios.status === 401 || resServicios.status === 403) {
            console.warn(`Error de autorización (${resServicios.status}). El backend rechazó el token.`);
            localStorage.removeItem("token");
            router.push("/login");
            return;
        }

        try {
           const dataBarberos = await resBarberos.json();
           if (dataBarberos.success && Array.isArray(dataBarberos.data)) {
               // Añadimos el 'index' como segundo parámetro
               const barberosFormateados: Barbero[] = dataBarberos.data.map((item: any, index: number) => {
                    console.log("🔍 Item barbero:", JSON.stringify(item, null, 2)); // 👈 AGREGA ESTO

                   const nombre = item.usuario?.nombre || item.nombre || "";
                   const apellidos = item.usuario?.apellidos || item.apellidos || "";
                   const especialidadSede = item.barberia?.nombre || item.detalle_barbero?.barberia?.nombre || "Barbero";

                   // Buscamos el ID en distintas propiedades, con un respaldo de seguridad (fallback)
                   const idSeguro = item.cedula || item.id || item.id_usuario || `temp-id-${index}`;
                   const nombreCompleto = [nombre, apellidos]
                    .filter(Boolean)       // elimina strings vacíos
                    .join(" ")             // une con un solo espacio
                    || "Sin Nombre";

                   return {
                       id: String(idSeguro),
                       username: item.username || "Sin Nombre",
                       especialidad: especialidadSede
                   };
               });

               setBarberos(barberosFormateados);
           }
        } catch (e) {
           console.error("Error leyendo los barberos:", e);
        }

        try {
           const dataServicios = await resServicios.json();
           if (dataServicios.success && Array.isArray(dataServicios.data)) {
               setServicios(dataServicios.data);
           }
        } catch (e) {
           console.error("Error leyendo los servicios:", e);
        }

      } catch (err) {
        console.error("Error general inicializando el módulo:", err);
      }
    };

    inicializarModulo();
  }, [router]);

  useEffect(() => {
    if (!barberoSeleccionado || !fechaSeleccionada || servicioSeleccionado === null) {
      setBloquesDisponibles([]);
      return;
    }

    const fetchDisponibilidad = async () => {
      try {
        const token = localStorage.getItem("token");
        
        const params = new URLSearchParams({
            barbero_id: barberoSeleccionado,
            fecha: fechaSeleccionada,
            servicio_id: String(servicioSeleccionado)
        });

        const res = await fetch(`/api/agenda/disponibilidad?${params.toString()}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });
        
        if (!res.ok) throw new Error("Error cargando disponibilidad");

        const response = await res.json();
        let bloquesRaw: Bloque[] = response.success ? response.data : (Array.isArray(response) ? response : []);

        const filtrados = bloquesRaw.filter((b) => {
          if (!b.estado) return true;
          return b.estado.toLowerCase() === "disponible";
        });
        setBloquesDisponibles(filtrados);
      } catch (err) {
        console.error("Error al consultar disponibilidad:", err);
        setBloquesDisponibles([]);
      }
    };
    
    fetchDisponibilidad();
  }, [barberoSeleccionado, fechaSeleccionada, servicioSeleccionado]);

  const handleConfirmar = async () => {
    const horaFinal = horaDbSeleccionada || horaSeleccionada;
    const token = localStorage.getItem("token");

    if (!barberoSeleccionado || !fechaSeleccionada || !horaFinal || !cedulaCliente || servicioSeleccionado === null) {
      alert("Por favor selecciona todos los campos.");
      return;
    }

    setIsSubmitting(true);

    const reservaData = {
      fecha: fechaSeleccionada,
      hora: horaFinal, 
      cedula_barbero: barberoSeleccionado,
      cedula_cliente: String(cedulaCliente),
      servicio: servicioSeleccionado
    };

    try {
      const response = await fetch("/api/citas/reservar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaData)
      });

      const responseData = await response.json();
      
      if (!response.ok) {
        alert("Error: " + (responseData.error || responseData.message || "Error desconocido al procesar la cita"));
        setIsSubmitting(false);
        return;
      }

      alert("¡Cita agendada con éxito!");
      window.location.reload();
    } catch (error) {
      alert("Error al conectar con el servidor.");
      setIsSubmitting(false);
    }
  };

  const generarDias = (cantidad = 14) => {
    const hoy = new Date();
    const dias = [];

    for (let i = 0; i < cantidad; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);

      dias.push({
        fecha,
        label: fecha.toLocaleDateString("es-CO", { weekday: "short" }),
        dia: fecha.getDate(),
        iso: fecha.toLocaleDateString("sv-SE"),
      });
    }

    return dias;
  };

  return (
    <div className="landing-page py-12 px-4 sm:px-6 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl p-5 sm:p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-white/10">
        <h2 className="text-3xl font-extrabold text-center mb-10 text-slate-900 dark:text-white">
          Reserva tu cita
        </h2>

        {/* PASO 1: BARBERO */}
        <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">1. Elige tu Barbero</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          {barberos.map((barbero) => (
            <motion.button
              key={`barber-${barbero.id}`}
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={() => {
                setBarberoSeleccionado(barbero.id);
                setServicioSeleccionado(null);
                setFechaSeleccionada("");
                setHoraSeleccionada("");
              }}
              className={`p-4 rounded-xl border text-left transition-all ${barberoSeleccionado === barbero.id
                ? "bg-primary text-white border-primary shadow-lg"
                : "bg-slate-50 dark:bg-slate-800 border-slate-200"
                }`}
            >
              <p className="font-bold">{barbero.username}</p>
              <p className="text-sm opacity-80">{barbero.especialidad}</p>
            </motion.button>
          ))}
        </div>

        {/* PASO 2: SERVICIO */}
        {barberoSeleccionado && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">2. Selecciona un Servicio</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {servicios.map((serv) => (
                <button
                  key={`service-${serv.id_servicio}`}
                  onClick={() => {
                    setServicioSeleccionado(serv.id_servicio);
                    setFechaSeleccionada("");
                    setHoraSeleccionada("");
                  }}
                  className={`p-4 rounded-xl border flex justify-between items-center transition-all ${servicioSeleccionado === serv.id_servicio
                    ? "bg-slate-800 text-white border-slate-800 shadow-md"
                    : "bg-white dark:bg-slate-800 border-slate-200 text-slate-700 dark:text-slate-200"
                    }`}
                >
                  <div className="text-left">
                    <p className="font-bold text-sm">{serv.nombre}</p>
                    <p className="text-xs opacity-70">{serv.duracion_minutos} min</p>
                  </div>
                  <p className="font-black text-primary">
                    ${Number(serv.precio).toLocaleString('es-CO')}
                  </p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {/* PASO 3: DÍA */}
        {servicioSeleccionado !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-primary" />
              3. Selecciona el Día
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2">
              {generarDias(14).map((diaObj, index) => {
                const isSelected = fechaSeleccionada === diaObj.iso;

                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFechaSeleccionada(diaObj.iso);
                      setHoraSeleccionada("");
                    }}
                    className={`min-w-[80px] flex flex-col items-center justify-center p-3 rounded-xl border transition-all
              ${isSelected
                        ? "bg-primary text-white border-primary shadow-md scale-105"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-primary/10"
                      }
            `}
                  >
                    <span className="text-xs uppercase">
                      {index === 0 ? "Hoy" : index === 1 ? "Mañana" : diaObj.label}
                    </span>
                    <span className="text-lg font-bold">{diaObj.dia}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* PASO 4: HORA */}
        {fechaSeleccionada && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
            <h3 className="text-lg font-bold mb-4 text-slate-800 dark:text-slate-200">4. Selecciona la Hora</h3>
            <Calendario
              bloquesDelDia={bloquesDisponibles}
              horaSeleccionada={horaSeleccionada}
              onSeleccionarHora={(hora, hora_db) => {
                setHoraSeleccionada(hora);
                setHoraDbSeleccionada(hora_db);
              }}
            />
          </motion.div>
        )}

        <button
          disabled={!barberoSeleccionado || servicioSeleccionado === null || !fechaSeleccionada || !horaSeleccionada || isSubmitting}
          onClick={handleConfirmar}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:brightness-110 transition-all shadow-xl shadow-primary/20 flex justify-center items-center"
        >
          {isSubmitting ? "Procesando reserva..." : "Confirmar Cita"}
        </button>
      </div>
    </div>
  );
}