"use client";
import React, { useState, useEffect } from 'react';
import { UserPlus, Search, User, MoreVertical, Shield } from 'lucide-react';
import type { Usuario } from '@/frontend/types/types_admin';

const ViewClientes: React.FC = () => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [cargando, setCargando] = useState(false);

  // Helper para generar la URL y los Headers con el token
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  useEffect(() => {
    const cargarUsuarios = async () => {
      setCargando(true);
      try {
        const response = await fetch(`/api/usuarios/`, {
          headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al cargar");

        const resData = await response.json();
        const data = resData.data || resData;

        // Filtramos para que esta vista solo maneje Clientes
        const soloClientes = (Array.isArray(data) ? data : []).filter(u => u.rol === 'Cliente');
        setUsuarios(soloClientes);
      } catch (err: any) {
        console.error("Error al cargar clientes:", err);
      } finally {
        setCargando(false);
      }
    };
    cargarUsuarios();
  }, []);

  // 1. Cambiamos 'id: number' por 'cedula: string'
  const handleCambiarRol = async (cedula: string | undefined, nuevoRol: string) => {
    if (!cedula) {
      alert("Error: Este usuario no tiene una cédula registrada, no se puede cambiar el rol.");
      return;
    }

    // ESTO TE AYUDARÁ A DEBUGEAR
    console.log(`Ejecutando PATCH a la ruta: /api/usuarios/${cedula}`);

    try {
      const response = await fetch(`/api/usuarios/${cedula}`, {
        method: 'PATCH',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rol: nuevoRol })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al cambiar rol");
      }

      setUsuarios((prev) => prev.filter((u) => u.cedula !== cedula));
    } catch (err: any) {
      alert(`Error al actualizar el rol: ${err.message}`);
    }
  };
  
  const clientesFiltrados = usuarios.filter(u =>
    `${u.nombre} ${u.apellidos}`.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white">Base de Clientes</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Gestiona los perfiles de los usuarios registrados.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#1e293b] p-4 rounded-[24px] border border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input
            type="text"
            placeholder="Buscar cliente por nombre..."
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
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Perfil</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800">Rol Actual</th>
                <th className="px-8 py-5 text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {cargando ? (
                <tr><td colSpan={3} className="px-8 py-20 text-center"><div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div></td></tr>
              ) : clientesFiltrados.length === 0 ? (
                <tr><td colSpan={3} className="px-8 py-20 text-center text-slate-400">No hay clientes registrados.</td></tr>
              ) : (
                clientesFiltrados.map((user) => (
                  <tr key={user.cedula || user.email} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-all">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg bg-blue-500/10 text-blue-600">
                          {user.nombre?.substring(0, 1).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            {user.nombre} {user.apellidos}
                          </p>
                          <p className="text-[11px] text-slate-400 font-medium">{user.cedula ? `C.C. ${user.cedula}` : `C.C. No registrada`}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-[11px] font-bold bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                        <User size={14} /> CLIENTE
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex justify-center gap-3">
                        {/* 4. Pasamos user.cedula a la función de cambio de rol */}
                        <button 
                          onClick={() => handleCambiarRol(user.cedula, 'Barbero')} 
                          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-purple-600 hover:bg-purple-600 hover:text-white rounded-xl text-[11px] font-black transition-all"
                        >
                          HACER BARBERO
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
    </div>
  );
};

export default ViewClientes;