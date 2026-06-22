"use client";
import React, { useState, useEffect } from 'react';
import { Plus, Edit3, Trash2, Clock, DollarSign, Sparkles } from 'lucide-react';

interface BarberiaDetalle {
  id_barberia: number;
  nombre: string;
}

interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_minutos: number;
  barberia: number;
  barberia_detalle?: BarberiaDetalle;
  imagen?: string | null;
}

export default function ViewServicios() {
  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberias, setBarberias] = useState<BarberiaDetalle[]>([]);
  const [cargando, setCargando] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);

  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    duracion_minutos: '',
    barberia: ''
  });
  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const fetchDatos = async () => {
    setCargando(true);
    try {
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Se ajustó exactamente a /api/barberias y /api/servicios
      const [resServicios, resBarberias] = await Promise.all([
        fetch("/api/servicios", { headers }),
        fetch("/api/barberias", { headers })
      ]);

      if (!resServicios.ok || !resBarberias.ok) {
        throw new Error("Error al obtener los datos iniciales");
      }

      const dataServicios = await resServicios.json();
      const dataBarberias = await resBarberias.json();

      setServicios(dataServicios.data || dataServicios || []);
      setBarberias(dataBarberias.data || dataBarberias || []);
    } catch (error) {
      console.error("Error cargando datos:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchDatos();
  }, []);

  const handleOpenModal = (servicio: Servicio | null = null) => {
    if (servicio) {
      setEditingService(servicio);
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion || '',
        precio: servicio.precio.toString(),
        duracion_minutos: servicio.duracion_minutos.toString(),
        barberia: servicio.barberia.toString()
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: '',
        descripcion: '',
        precio: '',
        duracion_minutos: '',
        // Selecciona la primera barbería por defecto si hay alguna disponible
        barberia: barberias.length > 0 ? barberias[0].id_barberia.toString() : ''
      });
    }
    setImagenFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImagenFile(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numPrecio = parseFloat(formData.precio) || 0;
    const numDuracion = parseInt(formData.duracion_minutos, 10) || 0;
    const numBarberia = parseInt(formData.barberia, 10);

    const formDataObj = new FormData();
    formDataObj.append('nombre', formData.nombre);
    formDataObj.append('descripcion', formData.descripcion);
    formDataObj.append('precio', numPrecio.toString());
    formDataObj.append('duracion_minutos', numDuracion.toString());
    formDataObj.append('barberia', numBarberia.toString());

    if (imagenFile) {
      formDataObj.append('imagen', imagenFile);
    }

    try {
      const token = localStorage.getItem("token");
      // Ajuste de rutas para la creación/edición
      const url = editingService ? `/api/servicios/${editingService.id_servicio}` : `/api/servicios`;
      const method = editingService ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method: method,
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: formDataObj
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al guardar el servicio");
      }

      await fetchDatos();
      closeModal();
    } catch (error: any) {
      console.error("Error saving service:", error);
      alert(error.message || "Error al guardar el servicio. Verifica que todos los campos sean válidos.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio del catálogo base?")) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/servicios/${id}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });

      if (!res.ok) {
        throw new Error("No se pudo eliminar el servicio");
      }

      fetchDatos();
    } catch (error: any) {
      console.error("Error deleting service:", error);
      alert(error.message || "Error al eliminar");
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
      
      {/* HEADER DE SECCIÓN */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-800 dark:text-white flex items-center gap-3">
            <Sparkles className="text-primary" size={28} />
            Catálogo Global del Administrador
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Define la lista de los servicios disponibles en el sistema con sus precios base.
          </p>
        </div>
        
        <button 
          onClick={() => handleOpenModal()} 
          className="w-full md:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 rounded-[20px] flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/25 font-bold text-sm cursor-pointer active:scale-95"
        >
          <Plus size={20} strokeWidth={3} />
          <span>Añadir Nuevo Servicio Global</span>
        </button>
      </div>

      {/* GRID DE SERVICIOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-8">
        {cargando ? (
           <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400 animate-pulse">
            Cargando servicios...
          </div>
        ) : servicios.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 dark:text-slate-400">
            No hay servicios creados aún.
          </div>
        ) : (
          servicios.map((servicio) => (
            <div 
              key={servicio.id_servicio} 
              className="group bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500 flex flex-col h-full"
            >
              {/* CONTENEDOR DE IMAGEN */}
              <div className="h-56 relative overflow-hidden bg-slate-100 dark:bg-slate-800 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                {servicio.imagen ? (
                  <img src={servicio.imagen.startsWith('http') ? servicio.imagen : `http://127.0.0.1:8000${servicio.imagen}`} alt={servicio.nombre} className="w-full h-full object-cover" />
                ) : (
                  <Sparkles className="text-slate-300 dark:text-slate-600 w-24 h-24 absolute opacity-20" />
                )}
                
                {/* CAPA DE GRADIENTE */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* BADGES FLOTANTES */}
                <div className="absolute top-4 right-4 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl font-black text-primary text-sm shadow-xl flex items-center gap-1 group-hover:scale-110 transition-transform">
                  <DollarSign size={14} strokeWidth={3} />
                  {Number(servicio.precio).toLocaleString('es-CO')}
                </div>
                
                <div className="absolute bottom-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-xl text-white text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 border border-white/10">
                  <Clock size={14} className="text-primary" />
                  {servicio.duracion_minutos} MIN
                </div>
              </div>

              {/* CUERPO DE LA TARJETA */}
              <div className="p-6 flex flex-col flex-1">
                <div className="mb-4">
                  <h4 className="font-bold text-xl text-slate-800 dark:text-white group-hover:text-primary transition-colors duration-300">
                    {servicio.nombre}
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-3 leading-relaxed line-clamp-2 italic">
                    "{servicio.descripcion}"
                  </p>
                </div>
                
                {/* BOTONES DE ACCIÓN */}
                <div className="flex gap-3 mt-auto pt-4">
                  <button 
                    onClick={() => handleOpenModal(servicio)} 
                    className="flex-1 py-3 px-4 rounded-[16px] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 text-slate-600 dark:text-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Edit3 size={16} />
                    Modificar
                  </button>
                  <button 
                    onClick={() => handleDelete(servicio.id_servicio)} 
                    className="p-3 rounded-[16px] border border-red-50 dark:border-red-900/20 text-red-400 hover:bg-red-500 hover:text-white transition-all duration-300 cursor-pointer"
                    title="Eliminar del Sistema"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
                  {editingService ? 'Modificar Base' : 'Crear Base'}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Cambios aquí afectarán al catálogo maestro.
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
                    placeholder="Ej. Corte Premium"
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition-all" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Precio Base ($)</label>
                    <input 
                      required 
                      name="precio" 
                      value={formData.precio} 
                      onChange={handleChange} 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Duración (min)</label>
                    <input 
                      required 
                      name="duracion_minutos" 
                      value={formData.duracion_minutos} 
                      onChange={handleChange} 
                      type="number" 
                      placeholder="30"
                      className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Descripción</label>
                  <textarea 
                    required 
                    name="descripcion" 
                    value={formData.descripcion} 
                    onChange={handleChange} 
                    rows={3} 
                    placeholder="Detalles sobre el servicio..."
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all resize-none"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Foto del Servicio (Opcional)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 cursor-pointer"
                  />
                  {editingService?.imagen && !imagenFile && (
                    <p className="text-xs text-slate-500 mt-2 ml-2">Ya tiene una imagen. Sube otra para reemplazarla.</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">Barbería</label>
                  <select 
                    required 
                    name="barberia" 
                    value={formData.barberia} 
                    onChange={handleChange} 
                    className="w-full bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 rounded-xl px-5 py-3 text-slate-900 dark:text-white outline-none focus:border-primary transition-all text-sm cursor-pointer" 
                  >
                    <option value="" disabled>Selecciona una barbería</option>
                    {barberias.map(b => (
                      <option key={b.id_barberia} value={b.id_barberia}>{b.nombre}</option>
                    ))}
                  </select>
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
                  {editingService ? <Edit3 size={18} /> : <Plus size={18} />}
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