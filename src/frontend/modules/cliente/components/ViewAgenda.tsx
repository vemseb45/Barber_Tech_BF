"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { jwtDecode } from 'jwt-decode';
import { CalendarDays, ChevronLeft, ChevronRight, Clock, Scissors, User } from "lucide-react";
import Calendario from "@/frontend/modules/cliente/components/Calendario";
import type { Bloque } from "@/frontend/modules/cliente/components/Calendario";

interface JwtPayload {
  user_id?: string;
  sub?: string;
  id?: string;
  cedula?: string;
  exp?: number;
}

interface Barbero {
  id: string;
  username: string;
  especialidad: string;
  imagen?: string | null;
}

interface Servicio {
  id_servicio: number;
  nombre: string;
  precio: string;
  duracion_minutos: number;
  imagen?: string | null;
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

  // Referencias y estados para el carrusel de Barberos
  const barberosRef = useRef<HTMLDivElement>(null);
  const [pausarBarberos, setPausarBarberos] = useState(false);

  // Referencias y estados para el carrusel de Servicios
  const serviciosRef = useRef<HTMLDivElement>(null);
  const [pausarServicios, setPausarServicios] = useState(false);

  const router = useRouter();

  const renderizarImagenBase64 = (base64String: string | null | undefined) => {
    if (!base64String) return null;
    return base64String.startsWith("data:image")
      ? base64String
      : `data:image/jpeg;base64,${base64String}`;
  };

  useEffect(() => {
    const inicializarModulo = async () => {
      const token = localStorage.getItem("token");

      if (!token || token === "undefined" || token === "null") {
        router.push("/login");
        return;
      }

      try {
        const decoded = jwtDecode<JwtPayload>(token);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp && decoded.exp < currentTime) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        const idCliente = decoded.cedula || decoded.user_id || decoded.sub || decoded.id;
        if (idCliente) setCedulaCliente(Number(idCliente));

        const [resBarberos, resServicios] = await Promise.all([
          fetch("/api/barberos", { headers: { "Authorization": `Bearer ${token}` } }),
          fetch("/api/servicios", { headers: { "Authorization": `Bearer ${token}` } })
        ]);

        if (resServicios.status === 401 || resServicios.status === 403) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        try {
          const dataBarberos = await resBarberos.json();
          if (dataBarberos.success && Array.isArray(dataBarberos.data)) {
            const barberosFormateados: Barbero[] = dataBarberos.data.map((item: any, index: number) => {
              const especialidadSede = item.barberia?.nombre || item.detalle_barbero?.barberia?.nombre || "Barbero";
              const idSeguro = item.cedula || item.id || item.id_usuario || `temp-id-${index}`;

              return {
                id: String(idSeguro),
                username: item.username || "Sin Nombre",
                especialidad: especialidadSede,
                imagen: item.imagen || null 
              };
            });
            setBarberos(barberosFormateados);
          }
        } catch (e) { console.error("Error barberos:", e); }

        try {
          const dataServicios = await resServicios.json();
          if (dataServicios.success && Array.isArray(dataServicios.data)) {
            setServicios(dataServicios.data);
          }
        } catch (e) { console.error("Error servicios:", e); }

      } catch (err) {
        console.error("Error inicializando:", err);
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

        const filtrados = bloquesRaw.filter((b) => b.estado?.toLowerCase() === "disponible");
        setBloquesDisponibles(filtrados);
      } catch (err) {
        setBloquesDisponibles([]);
      }
    };
    fetchDisponibilidad();
  }, [barberoSeleccionado, fechaSeleccionada, servicioSeleccionado]);

  // SOLUCIÓN AL ERROR DE REFERENCIAS: Funciones específicas para cada carrusel
  const scrollBarberos = (direccion: "izq" | "der") => {
    if (barberosRef.current) {
      const cantidad = 260; // Ancho aproximado de la tarjeta
      barberosRef.current.scrollBy({ left: direccion === "izq" ? -cantidad : cantidad, behavior: "smooth" });
    }
  };

  const scrollServicios = (direccion: "izq" | "der") => {
    if (serviciosRef.current) {
      const cantidad = 260;
      serviciosRef.current.scrollBy({ left: direccion === "izq" ? -cantidad : cantidad, behavior: "smooth" });
    }
  };

  // Efecto Auto-scroll Barberos
  useEffect(() => {
    if (pausarBarberos || barberos.length <= 1) return;
    const intervalo = setInterval(() => {
      if (barberosRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = barberosRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          barberosRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          barberosRef.current.scrollBy({ left: 260, behavior: "smooth" });
        }
      }
    }, 3500);
    return () => clearInterval(intervalo);
  }, [pausarBarberos, barberos.length]);

  // Efecto Auto-scroll Servicios
  useEffect(() => {
    if (pausarServicios || servicios.length <= 1 || !barberoSeleccionado) return;
    const intervalo = setInterval(() => {
      if (serviciosRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = serviciosRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          serviciosRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          serviciosRef.current.scrollBy({ left: 260, behavior: "smooth" });
        }
      }
    }, 4000); 
    return () => clearInterval(intervalo);
  }, [pausarServicios, servicios.length, barberoSeleccionado]);

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
      if (responseData.url_pago) {
        window.location.href = responseData.url_pago;
      } else {
        alert("¡Cita agendada con éxito!");
        window.location.reload();
      }

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
      const año = fecha.getFullYear();
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const dia = String(fecha.getDate()).padStart(2, '0');
      const isoSeguro = `${año}-${mes}-${dia}`;

      dias.push({
        fecha,
        label: fecha.toLocaleDateString("es-CO", { weekday: "short" }),
        dia: fecha.getDate(),
        iso: isoSeguro,
      });
    }
    return dias;
  };

  return (
    <div className="landing-page py-12 px-4 sm:px-6 flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-[#0B1120]">
      <div className="w-full max-w-4xl p-6 sm:p-10 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-white/5">
        <h2 className="text-3xl font-black text-center mb-10 text-slate-900 dark:text-white tracking-tight">
          Reserva tu cita
        </h2>

        {/* PASO 1: BARBERO - NUEVO ESTILO DE TARJETA DE PRODUCTO */}
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">1</span>
            Elige tu Barbero
          </h3>
          {barberos.length > 2 && (
            <div className="flex gap-2">
              <button 
                onClick={() => scrollBarberos("izq")}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => scrollBarberos("der")}
                className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </div>

        <div 
          className="relative mb-12"
          onMouseEnter={() => setPausarBarberos(true)}
          onMouseLeave={() => setPausarBarberos(false)}
          onTouchStart={() => setPausarBarberos(true)}
          onTouchEnd={() => setTimeout(() => setPausarBarberos(false), 2000)}
        >
          <div 
            ref={barberosRef}
            className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {barberos.map((barbero) => (
              <button
                key={`barber-${barbero.id}`}
                onClick={() => {
                  setBarberoSeleccionado(barbero.id);
                  setServicioSeleccionado(null);
                  setFechaSeleccionada("");
                  setHoraSeleccionada("");
                }}
                className={`shrink-0 snap-start w-[240px] flex flex-col p-4 rounded-3xl border transition-all duration-300 relative text-left bg-white dark:bg-slate-800 ${
                  barberoSeleccionado === barbero.id
                    ? "border-primary ring-2 ring-primary/20 shadow-xl scale-[1.02] dark:border-primary"
                    : "border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1"
                }`}
              >
                {/* Badge superior (Rol) */}
                <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <User size={12} className="text-primary" /> 
                  Barbero
                </div>

                {/* Contenedor de Imagen */}
                <div className="w-full h-36 mt-8 mb-4 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                  {barbero.imagen ? (
                    <img
                      src={renderizarImagenBase64(barbero.imagen)!}
                      alt={barbero.username}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="font-black text-5xl text-slate-300 dark:text-slate-600 uppercase">
                      {barbero.username.charAt(0)}
                    </span>
                  )}
                </div>

                {/* Info del Barbero */}
                <div className="flex flex-col flex-grow w-full">
                  <h4 className="font-bold text-slate-800 dark:text-white text-base leading-snug line-clamp-2">
                    {barbero.username}
                  </h4>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">
                    {barbero.especialidad}
                  </p>
                  
                  {/* Selector inferior */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-col">
                    <span className={`text-sm font-black ${barberoSeleccionado === barbero.id ? "text-primary" : "text-slate-400 dark:text-slate-500"}`}>
                      {barberoSeleccionado === barbero.id ? "Seleccionado ✓" : "Seleccionar"}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* PASO 2: SERVICIO - ESTILO TARJETA DE PRODUCTO / E-COMMERCE */}
        {barberoSeleccionado && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">2</span>
                Selecciona un Servicio
              </h3>
              {servicios.length > 2 && (
                <div className="flex gap-2">
                  <button 
                    onClick={() => scrollServicios("izq")}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button 
                    onClick={() => scrollServicios("der")}
                    className="p-2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </div>
            
            <div 
              className="relative"
              onMouseEnter={() => setPausarServicios(true)}
              onMouseLeave={() => setPausarServicios(false)}
              onTouchStart={() => setPausarServicios(true)}
              onTouchEnd={() => setTimeout(() => setPausarServicios(false), 2000)}
            >
              <div 
                ref={serviciosRef}
                className="flex gap-5 overflow-x-auto pb-6 pt-2 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
              >
                {servicios.map((serv) => (
                  <button
                    key={`service-${serv.id_servicio}`}
                    onClick={() => {
                      setServicioSeleccionado(serv.id_servicio);
                      setFechaSeleccionada("");
                      setHoraSeleccionada("");
                    }}
                    className={`shrink-0 snap-start w-[240px] flex flex-col p-4 rounded-3xl border transition-all duration-300 relative text-left bg-white dark:bg-slate-800 ${
                      servicioSeleccionado === serv.id_servicio
                        ? "border-orange-500 ring-2 ring-orange-500/20 shadow-xl scale-[1.02] dark:border-orange-500"
                        : "border-slate-200 dark:border-slate-700 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    {/* Badge superior (Duración) */}
                    <div className="absolute top-4 left-4 z-10 bg-slate-900/80 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-lg flex items-center gap-1.5 shadow-sm">
                      <Clock size={12} className="text-orange-400" /> 
                      {serv.duracion_minutos} min
                    </div>

                    {/* Contenedor de Imagen */}
                    <div className="w-full h-36 mt-8 mb-4 rounded-2xl overflow-hidden bg-slate-50 dark:bg-slate-700/50 flex items-center justify-center">
                      {serv.imagen ? (
                        <img
                          src={renderizarImagenBase64(serv.imagen)!}
                          alt={serv.nombre}
                          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
                        />
                      ) : (
                        <Scissors size={40} className="text-slate-300 dark:text-slate-600" />
                      )}
                    </div>

                    {/* Info del Servicio */}
                    <div className="flex flex-col flex-grow">
                      <h4 className="font-bold text-slate-800 dark:text-white text-base leading-snug line-clamp-2 min-h-[44px]">
                        {serv.nombre}
                      </h4>
                      <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest font-bold">
                        Básicos
                      </p>
                      
                      {/* Precio estilo E-commerce */}
                      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex flex-col">
                        <span className="text-2xl font-black text-orange-500 dark:text-orange-400">
                          ${Number(serv.precio).toLocaleString('es-CO')}
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* PASO 3: DÍA */}
        {servicioSeleccionado !== null && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="mb-12">
            <h3 className="text-lg font-bold mb-5 text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">3</span>
              Selecciona el Día
            </h3>

            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {generarDias(14).map((diaObj, index) => {
                const isSelected = fechaSeleccionada === diaObj.iso;
                return (
                  <button
                    key={index}
                    onClick={() => {
                      setFechaSeleccionada(diaObj.iso);
                      setHoraSeleccionada("");
                    }}
                    className={`min-w-[85px] shrink-0 flex flex-col items-center justify-center py-4 px-3 rounded-2xl border transition-all ${
                      isSelected
                        ? "bg-primary text-white border-primary shadow-lg shadow-primary/30 scale-105"
                        : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700"
                    }`}
                  >
                    <span className={`text-[10px] uppercase font-bold tracking-wider mb-1 ${isSelected ? "text-primary-100" : "text-slate-400"}`}>
                      {index === 0 ? "Hoy" : index === 1 ? "Mañana" : diaObj.label}
                    </span>
                    <span className="text-2xl font-black">{diaObj.dia}</span>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* PASO 4: HORA */}
        {fechaSeleccionada && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
            <h3 className="text-lg font-bold mb-5 text-slate-800 dark:text-slate-200 flex items-center gap-2">
               <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">4</span>
               Selecciona la Hora
            </h3>
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
          className="w-full py-4 bg-primary text-white rounded-2xl font-black text-lg disabled:opacity-50 hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 flex justify-center items-center active:scale-[0.98]"
        >
          {isSubmitting ? "Procesando reserva..." : "Confirmar Cita"}
        </button>
      </div>
    </div>
  );
}