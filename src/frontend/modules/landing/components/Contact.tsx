"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant, scaleUpVariant } from '@/frontend/modules/landing/components/LandingData';

export default function Contact() {
  const contactInfo = [
    { img: "/Imagenes/ubicacion.png", title: "Ubicación", desc: "Calle 123, Barrio 1, Bogotá" },
    { img: "/Imagenes/reloj.png", title: "Horarios", desc: "Lun - Vie: 10am - 8pm" },
    { img: "/Imagenes/telefono.png", title: "Contacto", desc: "+57 XXX-XXX-XXXX" }
  ];

  return (
    <section className="px-6 py-20 lg:px-10" id="contacto">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2">
          
          {/* Info */}
          <motion.div variants={fadeUpVariant} className="flex flex-col gap-8 text-center lg:text-left">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 md:text-4xl">Visítanos</h2>
            <div className="space-y-4">
              {contactInfo.map((item, i) => (
                <motion.div key={i} whileHover={{ x: 10 }} className="flex items-start gap-4 text-left rounded-2xl p-4 bg-slate-50 dark:bg-white/5 border border-black/5 dark:border-white/10 transition-all">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <img src={item.img} alt={item.title} className="w-5 h-5 object-contain" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm">{item.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Mapa / Gráfico */}
          <motion.div variants={scaleUpVariant} className="h-[300px] sm:h-[400px] overflow-hidden rounded-[32px] bg-slate-200 shadow-2xl border-4 border-white dark:border-white/10 relative group">
            <div className="absolute inset-0 grayscale opacity-40 bg-cover bg-center" style={{ backgroundImage: "url('/Imagenes/fondobt.png')" }}></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="p-6 bg-white dark:bg-[#1a1a24] rounded-2xl shadow-2xl text-center border border-black/5 dark:border-white/10 mx-4">
                <img src="/Imagenes/ubicacion.png" alt="Ubicación" className="w-8 h-8 object-contain mx-auto mb-2" />
                <h5 className="font-bold">BarberTech</h5>
                <button className="text-primary text-xs font-bold hover:underline mt-4">Ver en Google Maps</button>
              </div>
            </div>
          </motion.div>
          
        </div>
      </motion.div>
    </section>
  );
}