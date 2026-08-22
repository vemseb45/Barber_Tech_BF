'use client';
import React, { useState, useEffect, forwardRef } from "react";
import { History, CheckCircle2, DollarSign, CalendarCheck, User, Clock, Scissors, TrendingUp, Search, Calendar } from 'lucide-react';
import { jwtDecode } from "jwt-decode";

// Importaciones para el calendario profesional
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar el idioma español para el calendario
registerLocale('es', es);

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
  cedula?: string;
  id?: string;
  sub?: string;
}

// Componente personalizado para el input del calendario
const CustomDateInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      className="bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-semibold outline-none cursor-pointer px-4 py-2.5 rounded-xl border-2 border-slate-200 dark:border-slate-800 focus:border-primary hover:border-primary/50 transition-all text-sm shadow-sm flex items-center justify-between min-w-[160px] w-full"
    >
      <span className="tracking-wide text-left">
        {value ? (
          <span>{value}</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
        )}
      </span>
      <Calendar size={16} className="text-slate-400 ml-3" />
    </button>
  )
);
CustomDateInput.displayName = 'CustomDateInput';

export default function ViewHistorial() {
  const [serviciosRealizados, setServiciosRealizados] = useState<ServicioRealizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [miIdBarbero, setMiIdBarbero] = useState<string | null>(null);

  // Estados para los filtros
  const [fechaFiltro, setFechaFiltro] = useState<Date | null>(null);
  const [busquedaCliente, setBusquedaCliente] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const idDetectado = decoded.user_id || decoded.id || decoded.sub || decoded.cedula;
      if (idDetectado) {
        setMiIdBarbero(String(idDetectado));
      }
    } catch (error) {
      console.error("Error al decodificar el token");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch(`/api/citas/historial`, {
      credentials: "include"
    })
      .then(res => res.json())
      .then(response => {
        if (response.success && Array.isArray(response.data)) {
          setServiciosRealizados(response.data);
        }
      })
      .catch(() => setServiciosRealizados([]))
      .finally(() => setLoading(false));
  }, []);

  // Lógica de filtrado iterativa
  const serviciosFiltrados = serviciosRealizados.filter(servicio => {
    let cumpleFecha = true;
    let cumpleCliente = true;

    // Validar coincidencia de fecha (la BD envía YYYY-MM-DD)
    if (fechaFiltro) {
      const fechaString = format(fechaFiltro, 'yyyy-MM-dd');
      cumpleFecha = servicio.fecha === fechaString;
    }

    // Validar coincidencia de texto en el nombre del cliente
    if (busquedaCliente.trim() !== "") {
      cumpleCliente = servicio.cliente.toLowerCase().includes(busquedaCliente.toLowerCase());
    }

    return cumpleFecha && cumpleCliente;
  });

  // Los totales se calculan en base a la lista filtrada
  const totalGenerado = serviciosFiltrados.reduce((acc, s) => acc + s.precio, 0);

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 p-2 sm:p-6">

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

      {/* BARRA DE FILTROS */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-[24px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row items-center gap-4 relative z-20">
        
        {/* Filtro de Fecha */}
        <div className="w-full sm:w-auto">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Filtrar por Fecha</label>
          <DatePicker
            selected={fechaFiltro}
            onChange={(date: Date | null) => setFechaFiltro(date)}
            locale="es"
            dateFormat="dd MMM yyyy"
            placeholderText="Todas las fechas"
            customInput={<CustomDateInput />}
            isClearable={false}
          />
        </div>

        {/* Filtro de Cliente */}
        <div className="w-full sm:flex-1 max-w-md">
          <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 mb-1 block">Buscar Cliente</label>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Ej. Juan Pérez..."
              value={busquedaCliente}
              onChange={(e) => setBusquedaCliente(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 text-sm font-medium border-2 border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-primary transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Botón de limpiar filtros (solo aparece si hay algún filtro activo) */}
        {(fechaFiltro || busquedaCliente) && (
          <div className="w-full sm:w-auto self-end sm:self-auto sm:mt-5">
            <button
              onClick={() => {
                setFechaFiltro(null);
                setBusquedaCliente("");
              }}
              className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all"
            >
              Limpiar
            </button>
          </div>
        )}
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card de Ingresos */}
        <div className="relative overflow-hidden bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex items-center gap-5">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl text-emerald-500 z-10">
            <TrendingUp size={32} />
          </div>
          <div className="z-10">
            <p className="text-[11px] font-black uppercase tracking-widest text-slate-400">Total Generado</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
              ${totalGenerado.toLocaleString('es-CO')}
            </h3>
          </div>
          <div className="absolute top-[-10px] right-[-10px] opacity-[0.03] dark:opacity-[0.05] text-emerald-500 rotate-12 z-0 pointer-events-none">
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
              {serviciosFiltrados.length} <span className="text-sm font-medium text-slate-400">Finalizados</span>
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
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
                  </td>
                </tr>
              ) : serviciosFiltrados.length > 0 ? (
                serviciosFiltrados.map((item) => (
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
                        <span className="font-bold text-slate-800 dark:text-white capitalize">{item.cliente}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                        <Scissors size={14} className="text-primary/60" />
                        <span className="text-sm font-medium capitalize">{item.servicio}</span>
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
                      <p className="font-bold">
                        {serviciosRealizados.length === 0 
                          ? "Aún no hay servicios registrados en el historial"
                          : "No se encontraron coincidencias para los filtros aplicados"
                        }
                      </p>
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