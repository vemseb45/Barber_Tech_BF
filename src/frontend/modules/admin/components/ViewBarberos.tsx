"use client";
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, Scissors, Calendar, Trash2, MoreVertical } from 'lucide-react';
import type { Usuario } from '@/frontend/types/types_admin';
import ModalAsignarHorario from '@/frontend/modules/admin/components/ModalAsignarHorario';
import CargaMasivaHorarios from '@/frontend/modules/admin/components/CargaMasivaHorarios';
import CrearBarbero from '@/frontend/modules/admin/components/CrearBarbero';

const ViewBarberos: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [barberoSeleccionado, setBarberoSeleccionado] = useState<{ id: number; nombre: string } | null>(null);
  const [mostrarCargaMasiva, setMostrarCargaMasiva] = useState(false);
  const [mostrarCrear, setMostrarCrear] = useState(false);

  // Helper para Fetch Nativo
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const cargarUsuarios = async () => {
    setCargando(true);
    try {
      const response = await fetch(`${baseURL}api/usuarios/`, { headers: getAuthHeaders() });
      if (!response.ok) throw new Error("Error fetching");
      
      const resData = await response.json();
      const data = resData.data || resData;
      const soloBarberos = (Array.isArray(data) ? data : []).filter(u => u.rol === 'Barbero');
      setUsuarios(soloBarberos);
    } catch (err: any) {
      console.error("Error al cargar barberos:", err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCambiarRol = async (cedula: string, nuevoRol: string) => {
    if (!window.confirm("¿Quitar este usuario del equipo de barberos?")) return;
    try {
      const response = await fetch(`${baseURL}api/usuarios/${cedula}/cambiar_rol/`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rol: nuevoRol })
      });
      if (!response.ok) throw new Error("Error");
      
      setUsuarios((prev) => prev.filter((u) => u.cedula !== cedula));
    } catch (err) {
      alert("Error al actualizar el rol");
    }
  };

  const recargarBarberos = async () => {
    await cargarUsuarios();
  };

  const abrirModalHorario = (id: number, nombre: string) => {
    setBarberoSeleccionado({ id, nombre });
    setModalOpen(true);
  };

  const barberosFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Equipo de Barberos</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Configura el personal y sus horarios de atención.</p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={() => setMostrarCrear(true)}
            className="bg-primary text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl shadow-primary/25 active:scale-95 transition-all"
          >
            <UserPlus size={20} /> Registrar Barbero
          </button>

          <button
            onClick={() => setMostrarCargaMasiva(!mostrarCargaMasiva)}
            className="bg-blue-600 text-white px-6 py-3 rounded-2xl flex items-center gap-3 font-bold text-sm shadow-xl shadow-blue-500/25 active:scale-95 transition-all hover:bg-blue-700"
          >
            <Calendar size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[24px] border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Buscar barbero..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-12 pr-6 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 outline-none focus:ring-4 focus:ring-primary/10 transition-all dark:text-white font-medium"
          />
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50">
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Barbero</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Estado</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Gestión</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cargando ? (
                <tr><td colSpan={3} className="px-8 py-20 text-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div></td></tr>
              ) : barberosFiltrados.length === 0 ? (
                <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-400">No hay barberos activos.</td></tr>
              ) : (
                barberosFiltrados.map((user) => (
                  <tr key={user.cedula} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-blue-500/10 text-blue-600">
                          {user.nombre?.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            {user.nombre} {user.apellidos}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium tracking-wider">{user.cedula ? `C.C. ${user.cedula}` : `C.C. No registrada`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <Scissors size={14} /> BARBERO ACTIVO
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => abrirModalHorario(user.cedula, `${user.nombre} ${user.apellidos}`)}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-[11px] font-black shadow-md hover:bg-blue-700 transition-all"
                        >
                          <Calendar size={14} /> HORARIOS
                        </button>
                        <button
                          onClick={() => handleCambiarRol(user.id, 'Cliente')}
                          className="p-2.5 bg-slate-100 dark:bg-slate-800 text-slate-400 hover:text-red-500 rounded-xl transition-all"
                          title="Quitar de equipo"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {barberoSeleccionado && (
        <ModalAsignarHorario
          isOpen={modalOpen}
          onClose={() => { setModalOpen(false); setBarberoSeleccionado(null); }}
          barberoId={barberoSeleccionado.id}
          nombreBarbero={barberoSeleccionado.nombre}
        />
      )}

      <CargaMasivaHorarios
        isOpen={mostrarCargaMasiva}
        onClose={() => setMostrarCargaMasiva(false)}
      />
      <CrearBarbero
        isOpen={mostrarCrear}
        onClose={() => setMostrarCrear(false)}
        onSuccess={recargarBarberos}
      />
    </div>
  );
};

export default ViewBarberos;