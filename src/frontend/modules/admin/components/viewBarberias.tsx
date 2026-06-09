"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, MapPin, Phone, Mail, Sparkles, Building2 } from 'lucide-react';

interface Barberia {
  id_barberia: number;
  nombre: string;
  direccion: string;
  telefono: string;
  email: string;
}

export default function ViewBarberias() {
  const [barberias, setBarberias] = useState<Barberia[]>([]);
  const [cargando, setCargando] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBarberia, setEditingBarberia] = useState<Barberia | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  // 1. Configuramos la URL Base y Helper para Headers
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  const fetchBarberias = async () => {
    setCargando(true);
    try {
      // 2. GET con fetch nativo
      const response = await fetch(`${baseURL}api/barberias/`, {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error("Error fetching");
      setBarberias(data.data || data || []);
      
    } catch (err) {
      console.error('Error fetching barberías:', err);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchBarberias();
  }, []);

  const handleOpenModal = (barberia: Barberia | null = null) => {
    if (barberia) {
      setEditingBarberia(barberia);
      setFormData({
        nombre: barberia.nombre,
        direccion: barberia.direccion,
        telefono: barberia.telefono,
        email: barberia.email
      });
    } else {
      setEditingBarberia(null);
      setFormData({ nombre: '', direccion: '', telefono: '', email: '' });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingBarberia(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingBarberia 
        ? `${baseURL}api/barberias/${editingBarberia.id_barberia}/`
        : `${baseURL}api/barberias/`;
        
      const method = editingBarberia ? 'PUT' : 'POST';

      // 3. POST / PUT con fetch nativo
      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error("Error saving");

      fetchBarberias();
      closeModal();
    } catch (err) {
      console.error('Error saving barbería:', err);
      alert('Error al guardar la barbería. Por favor, intenta de nuevo.');
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta barbería?')) {
      try {
        // 4. DELETE con fetch nativo
        const response = await fetch(`${baseURL}api/barberias/${id}/`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error deleting");
        fetchBarberias();
      } catch (err) {
        console.error('Error deleting barbería:', err);
        alert('Error al eliminar la barbería.');
      }
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Building2 className="text-primary" size={28} />
            Gestión de Barberías
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Administra las sucursales y barberías disponibles en el sistema.
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()} 
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-[20px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 font-bold text-sm cursor-pointer active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Añadir Nueva Barbería</span>
        </button>
      </div>

      {/* GRID DE BARBERÍAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {cargando ? (
          <div className="col-span-full py-12 text-center">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto"></div>
          </div>
        ) : barberias.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No hay barberías registradas.
          </div>
        ) : (
          barberias.map((barberia) => (
            <div 
              key={barberia.id_barberia} 
              className="group bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full p-8 relative"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10 transition-all duration-500 group-hover:scale-110"></div>
              
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shadow-inner">
                  <Building2 size={32} />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {barberia.nombre}
                  </h4>
                  <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-2 py-1 rounded-md">ID: {barberia.id_barberia}</span>
                </div>
              </div>

              <div className="space-y-4 flex-1">
                <div className="flex items-start gap-3 text-slate-600 dark:text-slate-300 text-sm">
                  <MapPin size={18} className="text-slate-400 mt-0.5 flex-shrink-0" />
                  <span className="leading-tight">{barberia.direccion}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                  <Phone size={18} className="text-slate-400 flex-shrink-0" />
                  <span>{barberia.telefono}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-600 dark:text-slate-300 text-sm">
                  <Mail size={18} className="text-slate-400 flex-shrink-0" />
                  <span>{barberia.email}</span>
                </div>
              </div>
              
              {/* BOTONES DE ACCIÓN */}
              <div className="flex gap-3 mt-8 pt-4 border-t border-slate-100 dark:border-slate-800">
                <button 
                  onClick={() => handleOpenModal(barberia)} 
                  className="flex-1 py-3 px-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit3 size={16} />
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(barberia.id_barberia)} 
                  className="p-3 rounded-[16px] border border-red-50 dark:border-red-900/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                  title="Eliminar"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* MODAL PARA CREAR/EDITAR */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={closeModal}></div>
          
          <div className="relative bg-white dark:bg-[#1e293b] rounded-[32px] shadow-2xl w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden border border-slate-200 dark:border-slate-700 animate-in zoom-in-95 duration-200">
            <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700/50 flex justify-between items-center shrink-0">
              <div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-white flex items-center gap-2">
                  <Sparkles className="text-primary" size={24} />
                  {editingBarberia ? 'Modificar Barbería' : 'Nueva Barbería'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Ingresa los datos de la sucursal.
                </p>
              </div>
              <button 
                onClick={closeModal} 
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors cursor-pointer text-slate-400"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="flex flex-col flex-1 overflow-hidden">
              <div className="p-6 md:p-8 space-y-6 overflow-y-auto">
                <div className="space-y-4">
                
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Nombre</label>
                  <input 
                    required 
                    name="nombre" 
                    value={formData.nombre} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Ej. BarberTech Central"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Dirección</label>
                  <input 
                    required 
                    name="direccion" 
                    value={formData.direccion} 
                    onChange={handleChange} 
                    type="text" 
                    placeholder="Ej. Calle Principal 123"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Teléfono</label>
                    <input 
                      required 
                      name="telefono" 
                      value={formData.telefono} 
                      onChange={handleChange} 
                      type="tel" 
                      placeholder="+57 300 000 0000"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Correo Electrónico</label>
                    <input 
                      required 
                      name="email" 
                      value={formData.email} 
                      onChange={handleChange} 
                      type="email" 
                      placeholder="contacto@barbertech.com"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all" 
                    />
                  </div>
                </div>

              </div>

              </div>

              <div className="p-6 md:p-8 border-t border-slate-100 dark:border-slate-700/50 flex gap-3 shrink-0 bg-white dark:bg-[#1e293b]">
                <button 
                  type="button" 
                  onClick={closeModal} 
                  className="flex-1 py-4 rounded-2xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-[2] py-4 bg-primary text-white font-bold rounded-2xl hover:bg-[#7112b3] shadow-lg shadow-primary/20 transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
                >
                  {editingBarberia ? <Edit3 size={18} /> : <Plus size={18} />}
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}