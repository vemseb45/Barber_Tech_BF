"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, fadeUpVariant, scaleUpVariant } from '@/frontend/modules/landing/components/LandingData';

export default function Gallery() {
  const images = ["/Imagenes/corte1.png", "/Imagenes/corte2.jpg", "/Imagenes/corte3.jpg", "/Imagenes/corte4.jpg"];

  return (
    <section className="px-6 py-20 lg:px-10" id="galeria">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <motion.div variants={fadeUpVariant}>
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 md:text-4xl text-center md:text-left">Galería de Estilos</h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400 text-center md:text-left">Nuestro trabajo reciente.</p>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((src, i) => (
            <motion.div key={i} variants={scaleUpVariant} whileHover={{ scale: 1.05, rotate: i % 2 === 0 ? 2 : -2, zIndex: 10 }} className="aspect-square overflow-hidden rounded-2xl sm:rounded-3xl bg-slate-200 border-2 sm:border-4 border-white dark:border-white/10 shadow-lg">
              <img className="h-full w-full object-cover transition-transform hover:scale-110 duration-500" src={src} alt={`Galeria ${i}`} />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}