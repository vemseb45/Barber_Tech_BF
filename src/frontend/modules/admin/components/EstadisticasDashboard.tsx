'use client';

import React, { useState, useEffect, useCallback, forwardRef } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import {
  Calendar, DollarSign, Clock, CheckCircle2,
  XCircle, TrendingDown, RotateCcw, User, Search
} from 'lucide-react';

// Nuevas importaciones para el calendario profesional
import DatePicker, { registerLocale } from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Registrar el idioma español para el calendario
registerLocale('es', es);

// 1. Tipado de datos reflejando el DTO del backend
interface EstadisticasResponseDTO {
  totalCitas: number;
  pendientes: number;
  canceladas: number;
  completadas: number;
  ingresos: number;
  perdidas: number;
  nombreBarbero?: string;
  ingresosPorMes: {
    mes: string;
    total: number;
  }[];
}

const COLORES_ESTADOS = {
  Completadas: '#10B981',
  Pendientes: '#F59E0B',
  Canceladas: '#EF4444',
};

// 2. Componente personalizado para que el input del calendario se vea Premium con Tailwind
const CustomDateInput = forwardRef<HTMLButtonElement, any>(
  ({ value, onClick, placeholder }, ref) => (
    <button
      type="button"
      onClick={onClick}
      ref={ref}
      // He ajustado bg y border para ser más flexibles
      className="group flex items-center justify-between w-full min-w-[150px] text-sm border-2 border-slate-200 dark:border-slate-800 rounded-lg px-4 py-2.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-primary focus:outline-none focus:border-primary transition-all shadow-sm"
    >
      <span className="font-medium tracking-wide">
        {value ? (
          <span className="text-primary">{value}</span>
        ) : (
          <span className="text-slate-400 dark:text-slate-500">{placeholder}</span>
        )}
      </span>
      <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-primary transition-colors ml-3" />
    </button>
  )
);
CustomDateInput.displayName = 'CustomDateInput';

export default function EstadisticasPage() {
  const [data, setData] = useState<EstadisticasResponseDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Estados de los inputs de filtro (ahora manejan objetos Date)
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [cedulaBarbero, setCedulaBarbero] = useState<string>('');

  const formatearDinero = (monto: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(monto);
  };

  const cargarEstadisticas = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      // Formateamos las fechas al estándar ISO (YYYY-MM-DD) para el backend
      if (fechaInicio) params.append('fechaInicio', format(fechaInicio, 'yyyy-MM-dd'));
      if (fechaFin) params.append('fechaFin', format(fechaFin, 'yyyy-MM-dd'));
      if (cedulaBarbero) params.append('cedula_barbero', cedulaBarbero);

      const response = await fetch(`/api/estadisticas?${params.toString()}`);
      const result = await response.json();

      if (!result.ok) {
        throw new Error(result.message || 'Error al obtener los datos');
      }

      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error de conexión');
    } finally {
      setLoading(false);
    }
  }, [fechaInicio, fechaFin, cedulaBarbero]);

  useEffect(() => {
    cargarEstadisticas();
  }, [cargarEstadisticas]);

  const limpiarFiltros = () => {
    setFechaInicio(null);
    setFechaFin(null);
    setCedulaBarbero('');
  };

  const datosGraficoEstados = data ? [
    { name: 'Completadas', value: data.completadas, color: COLORES_ESTADOS.Completadas },
    { name: 'Pendientes', value: data.pendientes, color: COLORES_ESTADOS.Pendientes },
    { name: 'Canceladas', value: data.canceladas, color: COLORES_ESTADOS.Canceladas },
  ] : [];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8 bg-slate-50 min-h-screen dark:bg-slate-950">

      {/* HEADER & FILTROS MEJORADOS */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6 transition-all">

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
            {data?.nombreBarbero ? (
              <>
                <User className="w-7 h-7 text-blue-500 bg-blue-50 dark:bg-blue-900/30 p-1.5 rounded-lg" />
                Estadísticas de {data.nombreBarbero}
              </>
            ) : (
              'Módulo Estadístico General'
            )}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Rendimiento operativo y métricas financieras
          </p>
        </div>

        {/* Panel de Filtros */}
        <div className="flex flex-wrap items-end gap-4 w-full xl:w-auto bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-100 dark:border-slate-700/50">

          <div className="flex flex-col relative z-20">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
              Desde
            </label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date: Date | null) => setFechaInicio(date)}
              selectsStart
              startDate={fechaInicio}
              endDate={fechaFin}
              locale="es"
              dateFormat="dd MMM yyyy"
              placeholderText="Seleccionar fecha"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="flex flex-col relative z-10">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
              Hasta
            </label>
            <DatePicker
              selected={fechaFin}
              onChange={(date: Date | null) => setFechaFin(date)}
              selectsEnd
              startDate={fechaInicio}
              endDate={fechaFin}
              minDate={fechaInicio || undefined}
              locale="es"
              dateFormat="dd MMM yyyy"
              placeholderText="Seleccionar fecha"
              customInput={<CustomDateInput />}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-xs text-slate-500 dark:text-slate-400 mb-1.5 font-semibold uppercase tracking-wider">
              Cédula Barbero
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Ej: 10203040"
                value={cedulaBarbero}
                onChange={(e) => setCedulaBarbero(e.target.value)}
                className="text-sm border border-slate-200 dark:border-slate-700 rounded-lg pl-9 pr-3 py-2 bg-white dark:bg-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 w-40 transition-all shadow-sm"
              />
            </div>
          </div>

          <button
            onClick={limpiarFiltros}
            title="Restablecer filtros"
            className="p-2.5 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ESTADO DE ERROR */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl animate-pulse">
          {error}
        </div>
      )}

      {/* SKELETON / LOADING */}
      {loading && !data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          ))}
        </div>
      )}

      {/* TARJETAS DE INDICADORES (KPIs) */}
      {!loading && data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 fade-in">
          <TarjetaKPI titulo="Ingresos Totales" valor={formatearDinero(data.ingresos)} icono={<DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />} colorBorde="border-emerald-500/30" bgIcono="bg-emerald-50 dark:bg-emerald-950/50" />
          <TarjetaKPI titulo="Total Citas Agendadas" valor={data.totalCitas} icono={<Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />} colorBorde="border-blue-500/30" bgIcono="bg-blue-50 dark:bg-blue-950/50" />
          <TarjetaKPI titulo="Citas Completadas" valor={data.completadas} subtexto={`Efectividad: ${((data.completadas / (data.totalCitas || 1)) * 100).toFixed(1)}%`} icono={<CheckCircle2 className="w-6 h-6 text-emerald-500" />} colorBorde="border-emerald-500/30" bgIcono="bg-emerald-50 dark:bg-emerald-950/50" />
          <TarjetaKPI titulo="Citas Pendientes" valor={data.pendientes} icono={<Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />} colorBorde="border-amber-500/30" bgIcono="bg-amber-50 dark:bg-amber-950/50" />
          <TarjetaKPI titulo="Citas Canceladas" valor={data.canceladas} subtexto={`Tasa de abandono: ${((data.canceladas / (data.totalCitas || 1)) * 100).toFixed(1)}%`} icono={<XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />} colorBorde="border-red-500/30" bgIcono="bg-red-50 dark:bg-red-950/50" />
          <TarjetaKPI titulo="Pérdidas (Servicios sin cobrar)" valor={formatearDinero(data.perdidas)} subtexto="Monto dejado de percibir" icono={<TrendingDown className="w-6 h-6 text-purple-600 dark:text-purple-400" />} colorBorde="border-purple-500/30" bgIcono="bg-purple-50 dark:bg-purple-950/50" />
        </div>
      )}

      {/* SECCIÓN DE GRÁFICOS */}
      {!loading && data && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 fade-in">
          {/* GRÁFICO DE BARRAS */}
          <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-4">Evolución de Ingresos</h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.ingresosPorMes}>
                  <XAxis dataKey="mes" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} tickFormatter={(val) => val === 0 ? '$0' : new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0, notation: 'compact', compactDisplay: 'short' }).format(val)} />
                  <Tooltip formatter={(val: any) => [formatearDinero(Number(val)), 'Ingresos']} labelStyle={{ color: '#0f172a', fontWeight: 600 }} cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="total" fill="#3b82f6" radius={[6, 6, 0, 0]} barSize={40} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* GRÁFICO DE DONA */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col justify-between">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100 mb-2">Distribución Operativa</h3>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={datosGraficoEstados} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                    {datosGraficoEstados.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Citas']} itemStyle={{ color: '#0f172a', fontWeight: 500 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-around items-center pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
              {datosGraficoEstados.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }}></span>
                  <span className="text-slate-600 dark:text-slate-400 font-medium">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TarjetaKPIProps {
  titulo: string;
  valor: string | number;
  subtexto?: string;
  icono: React.ReactNode;
  colorBorde: string;
  bgIcono: string;
}

function TarjetaKPI({ titulo, valor, subtexto, icono, colorBorde, bgIcono }: TarjetaKPIProps) {
  return (
    <div className={`bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border ${colorBorde} dark:border-slate-800 flex items-center justify-between transition-all hover:shadow-md hover:-translate-y-1 cursor-default`}>
      <div className="space-y-1">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{titulo}</p>
        <p className="text-2xl font-bold text-slate-800 dark:text-slate-100">{valor}</p>
        {subtexto && <p className="text-xs font-medium text-slate-500 dark:text-slate-400">{subtexto}</p>}
      </div>
      <div className={`p-3 rounded-xl shadow-sm ${bgIcono}`}>
        {icono}
      </div>
    </div>
  );
}