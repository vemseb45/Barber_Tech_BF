"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import { CalendarDays } from "lucide-react";

// Importación corregida a su misma carpeta
import Calendario from "@/frontend/modules/cliente/components/Calendario"; 
import type { Bloque } from "@/frontend/modules/cliente/components/Calendario";

interface JwtPayload {
  user_id: string;
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

  const router = useRouter();

  // 1. Decodificar JWT al cargar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { router.push("/login"); return; }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      if (decoded.user_id) setCedulaCliente(Number(decoded.user_id));
    } catch (err) { router.push("/login"); }
  }, [router]);

  // 2. Cargar datos iniciales (Barberos y Servicios)
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/usuarios/barberos/")
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) setBarberos(response.data);
      }).catch(err => console.error("Error barberos:", err));

    const token = localStorage.getItem("token");
    fetch("http://127.0.0.1:8000/api/servicios/", {
      headers: { "Authorization": `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setServicios(response.data);
        }
      }).catch(err => console.error("Error servicios:", err));
  }, []);

  // 3. Cargar Disponibilidad cuando cambian los requisitos
  useEffect(() => {
    if (!barberoSeleccionado || !fechaSeleccionada || servicioSeleccionado === null) {
      setBloquesDisponibles([]);
      return;
    }

    const fetchDisponibilidad = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/agenda/disponibilidad/?barberoId=${barberoSeleccionado}&fecha=${fechaSeleccionada}&servicioId=${servicioSeleccionado}&_t=${new Date().getTime()}`
        );
        const response = await res.json();
        let bloquesRaw: Bloque[] = response.success ? response.data : (Array.isArray(response) ? response : []);

        const filtrados = bloquesRaw.filter((b) => {
          if (!b.estado) return true;
          return b.estado.toLowerCase() === "disponible";
        });
        setBloquesDisponibles(filtrados);
      } catch (err) {
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

    const reservaData = {
      fecha: fechaSeleccionada,
      hora: horaFinal,
      cedula_barbero: barberoSeleccionado,
      cedula_cliente: String(cedulaCliente),
      servicio: servicioSeleccionado
    };

    try {
      const response = await fetch("http://127.0.0.1:8000/api/cita/reservar/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(reservaData)
      });

      const responseData = await response.json();
      if (!response.ok) {
        alert("Error: " + (responseData.message || JSON.stringify(responseData)));
        return;
      }

      alert("¡Cita agendada con éxito!");
      window.location.reload();
    } catch (error) {
      alert("Error al conectar con el servidor.");
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
              <p className="text-sm opacity-80">{barbero.especialidad || "Barbero"}</p>
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
          disabled={!barberoSeleccionado || servicioSeleccionado === null || !fechaSeleccionada || !horaSeleccionada}
          onClick={handleConfirmar}
          className="w-full py-4 bg-primary text-white rounded-xl font-bold text-lg disabled:opacity-50 hover:brightness-110 transition-all shadow-xl shadow-primary/20"
        >
          Confirmar Cita
        </button>
      </div>
    </div>
  );
}