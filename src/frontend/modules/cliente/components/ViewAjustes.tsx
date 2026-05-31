"use client";
import React, { useState } from 'react';
import { User, Mail, Phone, Lock, Save, Gift, Camera, CreditCard, MapPin, Star } from 'lucide-react';

export default function ViewAjustesCliente() {
  const [formData, setFormData] = useState({
    nombre: 'Juan Pérez',
    email: 'juan.perez@email.com',
    telefono: '+57 310 987 6543',
    direccion: 'Calle 10 # 45-20, Bogotá',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [notificaciones, setNotificaciones] = useState(true);
  const [marketing, setMarketing] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    alert("¡Tus preferencias se han actualizado!");
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-slate-800 dark:text-white">Mi Perfil</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Configura tus datos personales y preferencias de reserva.</p>
        </div>
        <div className="px-4 py-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 border border-emerald-500/20">
          <Star size={16} /> Miembro Platinum
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 p-8 shadow-sm text-center relative overflow-hidden group">
            <div className="relative mx-auto w-32 h-32 mb-6">
              <img src="https://ui-avatars.com/api/?name=Juan+Perez&background=7924c7&color=fff" className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 shadow-2xl object-cover" alt="Avatar" />
              <button className="absolute bottom-1 right-1 p-2.5 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-transform cursor-pointer ring-4 ring-white dark:ring-slate-800"><Camera size={18} /></button>
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-white">{formData.nombre}</h3>
            <div className="flex items-center justify-center gap-2 mt-1">
               <Gift size={14} className="text-primary" />
               <p className="text-sm font-bold text-slate-500 dark:text-slate-400">450 Puntos Acumulados</p>
            </div>
            
            <div className="pt-6 mt-6 border-t border-slate-100 dark:border-slate-800 space-y-4 text-left">
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Ajustes de Privacidad</h4>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Recordatorios SMS</p>
                  <p className="text-[10px] text-slate-500">Aviso 1h antes de tu cita</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={notificaciones} onChange={() => setNotificaciones(!notificaciones)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-200">Ofertas Especiales</p>
                  <p className="text-[10px] text-slate-500">Recibir cupones de regalo</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" checked={marketing} onChange={() => setMarketing(!marketing)} />
                  <div className="w-10 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>

          <div className="p-6 bg-gradient-to-br from-slate-100 to-white dark:from-slate-800 dark:to-slate-900 rounded-[28px] text-slate-800 dark:text-white shadow-xl border border-slate-200 dark:border-transparent">
             <div className="flex items-center gap-3 mb-4"><CreditCard className="text-primary" /><span className="text-xs font-bold uppercase tracking-widest text-slate-700 dark:text-white">Método de pago</span></div>
             <p className="text-sm font-medium text-slate-500 dark:text-white dark:opacity-70">Visa terminada en •••• 4242</p>
             <button className="mt-4 text-[10px] font-black uppercase text-primary hover:text-slate-900 dark:hover:text-white transition-colors">Cambiar tarjeta</button>
          </div>
        </div>

        <div className="lg:col-span-8 bg-white dark:bg-[#1e293b] rounded-[32px] border border-slate-200 dark:border-slate-700/50 p-10 shadow-sm">
          <form onSubmit={handleSave} className="space-y-10">
            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-primary/10 text-primary rounded-lg"><User size={18} /></div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Datos Personales</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                {[
                  { label: 'Nombre Completo', icon: User, name: 'nombre', type: 'text' },
                  { label: 'Correo Electrónico', icon: Mail, name: 'email', type: 'email' },
                  { label: 'Teléfono Móvil', icon: Phone, name: 'telefono', type: 'tel' },
                  { label: 'Dirección (Opcional)', icon: MapPin, name: 'direccion', type: 'text' },
                ].map((input) => (
                  <div key={input.name} className="group space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2 group-focus-within:text-primary transition-colors">
                      <input.icon size={14} /> {input.label}
                    </label>
                    <input type={input.type} name={input.name} value={(formData as any)[input.name]} onChange={handleChange} className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none text-slate-800 dark:text-slate-100 transition-all font-medium text-sm" />
                  </div>
                ))}
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3 pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="p-2 bg-amber-500/10 text-amber-500 rounded-lg"><Lock size={18} /></div>
                <h3 className="text-lg font-bold text-slate-800 dark:text-white">Cambiar Contraseña</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div className="md:col-span-2 max-w-sm">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Contraseña Actual</label>
                  <input type="password" name="currentPassword" placeholder="••••••••" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-800 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Nueva Contraseña</label>
                  <input type="password" name="newPassword" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-800 dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-2">Confirmar Contraseña</label>
                  <input type="password" name="confirmPassword" className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700 focus:border-primary outline-none text-slate-800 dark:text-white" />
                </div>
              </div>
            </section>

            <div className="pt-6 flex justify-end border-t border-slate-100 dark:border-slate-800">
              <button type="submit" className="group flex items-center gap-3 px-10 py-4 bg-primary text-white font-bold rounded-2xl hover:brightness-110 shadow-xl shadow-primary/25 hover:shadow-primary/40 transition-all active:scale-95 cursor-pointer">
                <Save size={20} className="group-hover:rotate-12 transition-transform" /> Guardar Cambios
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}