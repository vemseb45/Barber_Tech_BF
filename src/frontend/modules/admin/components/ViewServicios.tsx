"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, Clock, DollarSign, Sparkles } from "lucide-react";

interface BarberiaDetalle {
  id_barberia: number;
  nombre: string;
}

interface EspecialidadDetalle {
  id_especialidad: number;
  nombre: string;
}

interface Servicio {
  id_servicio: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion_minutos: number;
  barberia: number;
  especialidad: number;
  barberia_detalle?: BarberiaDetalle;
  especialidad_detalle?: EspecialidadDetalle;
  imagen?: string | null;
}

export default function ViewServicios() {

  const [servicios, setServicios] = useState<Servicio[]>([]);
  const [barberias, setBarberias] = useState<BarberiaDetalle[]>([]);
  const [especialidades, setEspecialidades] = useState<EspecialidadDetalle[]>([]);
  const [cargando, setCargando] = useState(false);

  const [activeTab, setActiveTab] = useState("Todos");
  const tabs = ["Todos", "Cabello", "Barba", "Tratamientos", "Combos", "Otros"];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Servicio | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion_minutos: "",
    barberia: "",
    especialidad: "",
  });

  const [imagenFile, setImagenFile] = useState<File | null>(null);

  const especialidadesFijas = [
    { id_especialidad: 1, nombre: "Cabello" },
    { id_especialidad: 2, nombre: "Barba" },
    { id_especialidad: 3, nombre: "Tratamientos" },
    { id_especialidad: 4, nombre: "Combos" },
  ];

  // 🔥 FETCH DATA
  const fetchData = async () => {
    setCargando(true);
    try {
      const [resServicios, resBarberias, resEspecialidades] = await Promise.all([
        fetch(`api/servicios/`, { cache: "no-store" }),
        fetch(`api/barberias/`, { cache: "no-store" }),
        fetch(`api/especialidades/`, { cache: "no-store" }),
      ]);

      const dataServicios = await resServicios.json();
      const dataBarberias = await resBarberias.json();
      const dataEspecialidades = await resEspecialidades.json();

      setServicios(dataServicios.data || dataServicios || []);
      setBarberias(dataBarberias.data || dataBarberias || []);
      setEspecialidades(dataEspecialidades.data || dataEspecialidades || []);
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // MODAL
  const handleOpenModal = (servicio: Servicio | null = null) => {
    if (servicio) {
      setEditingService(servicio);
      setFormData({
        nombre: servicio.nombre,
        descripcion: servicio.descripcion,
        precio: servicio.precio.toString(),
        duracion_minutos: servicio.duracion_minutos.toString(),
        barberia: servicio.barberia.toString(),
        especialidad: servicio.especialidad.toString(),
      });
    } else {
      setEditingService(null);
      setFormData({
        nombre: "",
        descripcion: "",
        precio: "",
        duracion_minutos: "",
        barberia: "",
        especialidad: "",
      });
    }
    setImagenFile(null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
  };

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: any) => {
    if (e.target.files?.length > 0) {
      setImagenFile(e.target.files[0]);
    }
  };

  // 💾 SAVE
  const handleSave = async (e: any) => {
    e.preventDefault();

    const formDataObj = new FormData();
    formDataObj.append("nombre", formData.nombre);
    formDataObj.append("descripcion", formData.descripcion);
    formDataObj.append("precio", formData.precio);
    formDataObj.append("duracion_minutos", formData.duracion_minutos);
    formDataObj.append("barberia", formData.barberia);

    if (formData.especialidad) {
      formDataObj.append("especialidad", formData.especialidad);
    }

    if (imagenFile) {
      formDataObj.append("imagen", imagenFile);
    }

    try {
      const url = editingService
        ? `api/servicios/${editingService.id_servicio}/`
        : `api/servicios/`;

      const method = editingService ? "PUT" : "POST";

      await fetch(url, {
        method,
        body: formDataObj,
      });

      await fetchData();
      closeModal();
    } catch (error) {
      console.error("Error saving:", error);
    }
  };

  // 🗑️ DELETE
  const handleDelete = async (id: number) => {
    if (confirm("¿Eliminar servicio?")) {
      try {
        await fetch(`api/servicios/`, {
          method: "DELETE",
        });
        fetchData();
      } catch (error) {
        console.error("Error deleting:", error);
      }
    }
  };

  const filteredServicios = servicios.filter((s) => {
    if (activeTab === "Todos") return true;
    if (activeTab === "Otros")
      return !s.especialidad_detalle?.nombre;
    return s.especialidad_detalle?.nombre === activeTab;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Servicios</h2>

      <button onClick={() => handleOpenModal()}>
        <Plus /> Nuevo
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {filteredServicios.map((servicio) => (
          <div key={servicio.id_servicio} className="border p-4 rounded">
            <h3>{servicio.nombre}</h3>
            <p>{servicio.descripcion}</p>

            <div className="flex gap-2 mt-2">
              <button onClick={() => handleOpenModal(servicio)}>
                <Edit3 />
              </button>
              <button onClick={() => handleDelete(servicio.id_servicio)}>
                <Trash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <form onSubmit={handleSave} className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded space-y-4">
            <input name="nombre" onChange={handleChange} value={formData.nombre} placeholder="Nombre" />
            <input name="precio" onChange={handleChange} value={formData.precio} placeholder="Precio" />
            <textarea name="descripcion" onChange={handleChange} value={formData.descripcion} />

            <input type="file" onChange={handleFileChange} />

            <button type="submit">Guardar</button>
            <button type="button" onClick={closeModal}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}