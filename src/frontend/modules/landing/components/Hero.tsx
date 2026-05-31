"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant } from '@/frontend/modules/landing/components/LandingData';

export default function Hero() {
  const router = useRouter();
  const hasSession = false;

  const handleReservation = () => {
    if (hasSession) {
      router.push('/DashboardCliente');
    } else {
      router.push('/login');
    }
  };

  return (
    <section className="relative overflow-hidden px-6 py-12 lg:px-10 lg:py-24" id="inicio">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer} className="flex flex-col gap-6 sm:gap-8 text-center lg:text-left">
            <motion.div variants={fadeUpVariant} className="inline-flex w-fit mx-auto lg:mx-0 items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-wider border border-primary/20">
              <span>La mejor experiencia en barbería</span>
            </motion.div>
            
            <motion.h1 variants={fadeUpVariant} className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-slate-100">
              Corte y Estilo con <span className="text-primary block sm:inline">Personalidad</span>
            </motion.h1>
            
            <motion.p variants={fadeUpVariant} className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0">
              Tu mejor versión comienza aquí. Experiencia de barbería clásica apoyada con tecnología para hacer tu visita más rápida y cómoda.
            </motion.p>
            
            <motion.div variants={fadeUpVariant} className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleReservation} className="w-full sm:w-auto rounded-2xl bg-primary px-8 py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-primary/30 transition-all">
                Reservar Cita Ahora
              </motion.button>
              <motion.a whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} href="#servicios" className="w-full sm:w-auto rounded-2xl border border-primary/20 bg-white dark:bg-white/5 px-8 py-4 text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 hover:bg-slate-50 dark:hover:bg-white/10 transition-colors inline-flex items-center justify-center">
                Ver Servicios
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Imagen principal */}
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="relative mx-auto w-full max-w-md lg:max-w-none">
            <div className="aspect-[4/5] w-full rounded-[32px] sm:rounded-[40px] bg-slate-200 bg-cover bg-center shadow-2xl transition-transform hover:scale-[1.02] duration-700 border-4 border-white dark:border-white/10" style={{ backgroundImage: 'url("/Imagenes/barbero1.avif")' }}></div>
            
            {/* Floating card */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }} className="absolute -bottom-6 -left-6 hidden sm:block rounded-3xl bg-white dark:bg-[#1a1a24] p-6 shadow-2xl border border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-300"></div>
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-slate-400"></div>
                  <div className="h-10 w-10 rounded-full border-2 border-white bg-primary text-white flex items-center justify-center text-xs font-bold">+5k</div>
                </div>
                <div>
                  <p className="text-sm font-bold">Clientes Felices</p>
                  <p className="text-xs text-slate-500">Valoración 5.0 ★</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}