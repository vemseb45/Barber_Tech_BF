"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { servicesData, staggerContainer, fadeUpVariant } from '@/frontend/modules/landing/components/LandingData';

export default function Services() {
  const [activeService, setActiveService] = useState(0);

  useEffect(() => {
    const serviceInterval = setInterval(() => {
      setActiveService(prev => (prev + 1) % servicesData.length);
    }, 5000);
    return () => clearInterval(serviceInterval);
  }, []);

  return (
    <section className="bg-white dark:bg-black/20 px-6 py-20 lg:px-10 border-y border-slate-200 dark:border-white/5 transition-colors duration-300" id="servicios">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mx-auto max-w-7xl">
        <div className="mb-12 text-center">
          <motion.h2 variants={fadeUpVariant} className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 md:text-4xl">Nuestros Servicios</motion.h2>
          <motion.div variants={fadeUpVariant} className="mt-4 flex justify-center">
            <div className="h-1.5 w-20 rounded-full bg-primary"></div>
          </motion.div>
        </div>

        {/* Slider para responsive */}
        <div className="block md:hidden relative pt-2 pb-8">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${activeService * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {servicesData.map((s, i) => (
                <div className="w-full shrink-0 px-2 flex justify-center" key={i}>
                  <div className="flex flex-col w-full h-full rounded-[32px] border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-8 shadow-lg">
                    <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <img src={s.img} alt={s.title} className="w-8 h-8 object-contain" />
                    </div>
                    <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
                    <p className="mb-6 text-slate-600 dark:text-slate-400 text-sm">{s.desc}</p>
                    <div className="mt-auto flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-6">
                      <span className="font-black text-primary text-xl">{s.price}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controles del Slider */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4">
            {servicesData.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveService(i)}
                className={`nav-dot w-2 h-2 rounded-full transition-all tracking-widest ${activeService === i ? 'bg-primary w-6' : 'bg-slate-300 dark:bg-white/20'}`}
                aria-label={`Ir al servicio ${i + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => setActiveService(prev => prev === 0 ? servicesData.length - 1 : prev - 1)}
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a24] shadow-lg border border-black/5 dark:border-white/10 text-primary z-10 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setActiveService(prev => (prev + 1) % servicesData.length)}
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a24] shadow-lg border border-black/5 dark:border-white/10 text-primary z-10 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Grid para Desktop */}
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {servicesData.map((s, i) => (
            <motion.div key={i} variants={fadeUpVariant} whileHover={{ y: -10 }} className="flex flex-col rounded-[32px] border border-black/5 dark:border-white/5 bg-slate-50 dark:bg-white/5 p-8 transition-all hover:shadow-2xl hover:border-primary/50 group">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 transition-transform group-hover:scale-110">
                <img src={s.img} alt={s.title} className="w-8 h-8 object-contain" />
              </div>
              <h3 className="mb-3 text-xl font-bold">{s.title}</h3>
              <p className="mb-6 text-slate-600 dark:text-slate-400 text-sm">{s.desc}</p>
              <div className="mt-auto flex items-center justify-between border-t border-black/5 dark:border-white/10 pt-6">
                <span className="font-black text-primary text-xl">{s.price}</span>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">{s.time}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}