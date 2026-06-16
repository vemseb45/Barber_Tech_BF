'use client';
import React, { useState } from 'react';
import { 
  User, Mail, Phone, Lock, Save, Scissors, 
  BellRing, Info, Camera, ShieldCheck 
} from 'lucide-react';

export default function ViewAjustes() {
  const [formData, setFormData] = useState({
    nombre: 'Carlos Barbero',
    email: 'carlos@barbertech.com',
    telefono: '+57 300 123 4567',
    especialidad: 'Tijeras & Barbería Clásica',
    bio: 'Más de 5 años de experiencia haciendo los mejores desvanecidos del distrito.',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificaciones, setNotificaciones] = useState(true);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica de actualización con el backend
    alert("Perfil actualizado correctamente");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* HEADER DE LA VISTA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">
            Configuración de Cuenta
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Gestiona tu identidad, seguridad y preferencias de la plataforma.
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2">
          <ShieldCheck size={16} /> Perfil Verificado
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* COLUMNA IZQUIERDA: PERFIL & TOGGLES (4 COLUMNAS) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 p-8 shadow-sm text-center relative overflow-hidden group">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <div className="w-full h-full rounded-full bg-gradient-to-tr from-primary to-orange-400 flex items-center justify-center text-white text-4xl font-bold shadow-2xl shadow-primary/20 ring-4 ring-white dark:ring-slate-800">
                CB
              </div>
              <button className="absolute bottom-1 right-1 p-2.5 bg-white dark:bg-slate-700 rounded-full shadow-lg text-slate-600 dark:text-slate-200 hover:text-primary transition-colors cursor-pointer ring-2 ring-slate-50 dark:ring-slate-900">
                <Camera size={18} />
              </button>
            </div>
            
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{formData.nombre}</h3>
            <p className="text-sm font-medium text-primary/80 mb-6">{formData.especialidad}</p>
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Preferencias Rápidas</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Alertas de Agenda</p>
                  <p className="text-[10px] text-slate-500">Notificar nuevas citas</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIOS (8 COLUMNAS) */}
        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 p-10 shadow-sm">
          <form onSubmit={handleSave} className="space-y-10">
            
            {/* SECCIÓN INFORMACIÓN */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-blue-500/10 text-blue-500 rounded-lg">
                  <Info size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Información Profesional</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: 'Nombre Completo', icon: User, name: 'nombre', type: 'text' },
                  { label: 'Especialidad principal', icon: Scissors, name: 'especialidad', type: 'text' },
                  { label: 'Correo de contacto', icon: Mail, name: 'email', type: 'email' },
                  { label: 'Teléfono / WhatsApp', icon: Phone, name: 'telefono', type: 'tel' },
                ].map((input) => (
                  <div key={input.name} className="group space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-primary transition-colors">
                      <input.icon size={14} /> {input.label}
                    </label>
                    <input
                      type={input.type}
                      name={input.name}
                      value={(formData as any)[input.name]}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-800 dark:text-slate-100 transition-all font-medium text-sm"
                    />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  Biografía del Perfil
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-800 dark:text-slate-100 transition-all text-sm resize-none font-medium"
                ></textarea>
              </div>
            </section>

            {/* SECCIÓN SEGURIDAD */}
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg">
                  <Lock size={18} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Seguridad y Acceso</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2 max-w-sm">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Contraseña Actual</label>
                  <input
                    type="password"
                    name="currentPassword"
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Nueva Contraseña</label>
                  <input
                    type="password"
                    name="newPassword"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Confirmar Nueva Contraseña</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none"
                  />
                </div>
              </div>
            </section>

            {/* BOTÓN DE ACCIÓN */}
            <div className="pt-6 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="group flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95 cursor-pointer"
              >
                <Save size={20} className="group-hover:rotate-12 transition-transform" />
                Actualizar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}