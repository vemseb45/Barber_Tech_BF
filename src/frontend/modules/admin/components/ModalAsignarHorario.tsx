"use client";
import React, { useState, useEffect } from 'react';
import { X, Clock, CheckCircle2, AlertCircle, Trash2, Pencil, CalendarDays, Plus } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  barberoId: number;
  nombreBarbero: string;
}

interface Horario {
  cedula_barbero: string;
  dia: string;
  hora_inicio: string;
  hora_fin: string;
}

const ModalAsignarHorario: React.FC<ModalProps> = ({ isOpen, onClose, barberoId, nombreBarbero }) => {
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [cargando, setCargando] = useState(false);
  const [editando, setEditando] = useState<Horario | null>(null);
  const [dia, setDia] = useState<string | null>(null);
  const [horaInicio, setHoraInicio] = useState('08:00');
  const [horaFin, setHoraFin] = useState('17:00');
  const [mensaje, setMensaje] = useState<any>(null);
  const [enviando, setEnviando] = useState(false);

  const diasSemana = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];

  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const cargarHorarios = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${baseURL}api/agenda/configurar/?barberoId=${barberoId}`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();

      const unicos = Object.values(
        (data.data || []).reduce((acc: any, curr: Horario) => {
          acc[curr.dia] = curr;
          return acc;
        }, {})
      );
      setHorarios(unicos as Horario[]);
    } catch (err) {
      console.error(err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    if (isOpen) cargarHorarios();
  }, [isOpen]);

  if (!isOpen) return null;

  const mapaHorarios: any = {};
  horarios.forEach(h => {
    mapaHorarios[h.dia] = h;
  });

  const abrirModal = (diaSeleccionado: string, horario?: Horario) => {
    setDia(diaSeleccionado);
    if (horario) {
      setEditando(horario);
      setHoraInicio(horario.hora_inicio.slice(0, 5));
      setHoraFin(horario.hora_fin.slice(0, 5));
    } else {
      setEditando(null);
      setHoraInicio('08:00');
      setHoraFin('17:00');
    }
    setMensaje(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!dia) return;
    setEnviando(true);
    setMensaje(null);
    try {
      const payload = {
        barberoId: barberoId,
        dia,
        hora_inicio: horaInicio,
        hora_fin: horaFin
      };

      const url = editando
        ? `${baseURL}api/agenda/configurar/`
        : `${baseURL}api/agenda/configurar/`;

      const response = await fetch(url, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(payload)
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.message || 'Error al guardar');

      setMensaje({ type: 'success', text: 'Horario actualizado' });
      setTimeout(() => {
        setDia(null);
        setEditando(null);
      }, 800);
      cargarHorarios();
    } catch (err: any) {
      setMensaje({ type: 'error', text: err.message || 'Error al guardar' });
    } finally {
      setEnviando(false);
    }
  };

  const handleEliminar = async (cedula: string, diaAEliminar: string) => {
    if (!confirm('¿Eliminar este horario?')) return;

    setEnviando(true);
    setMensaje(null);

    try {
      // Armamos la URL con los parámetros que pide tu backend (cedula y dia)
      const url = `${baseURL}api/agenda/configurar/?cedula=${cedula}&dia=${diaAEliminar}`;

      const response = await fetch(url, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(data.message || 'Error al eliminar');

      setMensaje({
        type: 'success',
        text: 'Horario eliminado correctamente'
      });

      cargarHorarios();

    } catch (err: any) {
      setMensaje({
        type: 'error',
        text: err.message || 'Error al eliminar'
      });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-950/40 backdrop-blur-md transition-all">
      <div className="bg-white dark:bg-[#0f172a] w-full max-w-4xl rounded-[32px] shadow-2xl border border-white/20 overflow-hidden flex flex-col max-h-[90vh]">

        {/* HEADER */}
        <div className="px-8 py-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/30">
          <div>
            <h3 className="font-extrabold text-2xl text-slate-800 dark:text-white flex items-center gap-3">
              <CalendarDays className="text-primary" />
              Horarios de <b>{nombreBarbero}</b>
            </h3>
            <p className="text-slate-500 text-sm mt-1">Configura la disponibilidad semanal </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-400"
          >
            <X size={24} />
          </button>
        </div>

        {/* GRID DE DÍAS */}
        <div className="p-8 overflow-y-auto custom-scrollbar">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {diasSemana.map((d) => {
              const h = mapaHorarios[d];
              return (
                <div
                  key={d}
                  className={`relative group p-5 border-2 rounded-2xl transition-all duration-300 flex flex-col gap-3 ${h
                    ? 'border-primary/20 bg-primary/[0.02] dark:bg-primary/[0.05]'
                    : 'border-slate-100 dark:border-slate-800 bg-transparent opacity-80 hover:opacity-100'
                    }`}
                >
                  <div className="flex justify-between items-start">
                    <span className={`text-xs font-black uppercase tracking-wider ${h ? 'text-primary' : 'text-slate-400'}`}>
                      {d}
                    </span>
                    {h && (
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => abrirModal(d, h)} className="p-1.5 hover:bg-blue-50 text-blue-500 rounded-lg"><Pencil size={14} /></button>
                        <button onClick={() => handleEliminar(h.cedula_barbero, h.dia)} className="p-1.5 hover:bg-red-50 text-red-500 rounded-lg"><Trash2 size={14} /></button>
                      </div>
                    )}
                  </div>

                  {h ? (
                    <div className="flex items-center gap-2 text-slate-700 dark:text-slate-200">
                      <Clock size={16} className="text-primary" />
                      <span className="font-bold text-sm tracking-tight">
                        {h.hora_inicio.slice(0, 5)} - {h.hora_fin.slice(0, 5)}
                      </span>
                    </div>
                  ) : (
                    <button
                      onClick={() => abrirModal(d)}
                      className="flex items-center gap-2 text-slate-400 hover:text-green-600 transition-colors py-1"
                    >
                      <Plus size={16} />
                      <span className="text-xs font-semibold italic">Asignar turno</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* MODAL INTERNO (FORMULARIO) */}
        {dia && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[1001] p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-6 md:p-8 rounded-[28px] w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="text-center mb-6">
                <div className="inline-flex p-3 bg-primary/10 rounded-full text-primary mb-3">
                  <Clock size={28} />
                </div>
                <h4 className="font-bold text-xl text-slate-800 dark:text-white">
                  {editando ? `Editar Horario` : `Nuevo Horario`}
                </h4>
                <p className="text-slate-500 text-sm">Día seleccionado: <span className="font-bold text-primary">{dia}</span></p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Entrada</label>
                    <input
                      type="time"
                      value={horaInicio}
                      onChange={e => setHoraInicio(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-primary outline-none transition-all font-semibold"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase text-slate-400 ml-1">Salida</label>
                    <input
                      type="time"
                      value={horaFin}
                      onChange={e => setHoraFin(e.target.value)}
                      className="w-full p-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-xl focus:border-primary outline-none transition-all font-semibold"
                    />
                  </div>
                </div>

                {mensaje && (
                  <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-3 animate-bounce ${mensaje.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
                    }`}>
                    {mensaje.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    {mensaje.text}
                  </div>
                )}

                <div className="space-y-3">
                  <button
                    disabled={enviando}
                    className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {enviando ? 'Guardando cambios...' : 'Guardar Horario'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDia(null)}
                    className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 py-2 transition-colors"
                  >
                    Descartar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalAsignarHorario;