"use client";
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from "lucide-react";
import { testimonialsData, staggerContainer, fadeUpVariant } from '@/frontend/modules/landing/components/LandingData';

export default function Testimonials() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const testimonialInterval = setInterval(() => {
      setActiveTestimonial(prev => (prev + 1) % testimonialsData.length);
    }, 5000);
    return () => clearInterval(testimonialInterval);
  }, []);

  return (
    <section className="bg-primary/5 px-6 py-20 lg:px-10" id="testimonios">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={staggerContainer} className="mx-auto max-w-7xl">
        <motion.h2 variants={fadeUpVariant} className="text-3xl font-extrabold text-slate-900 dark:text-slate-100 md:text-4xl mb-12 text-center">
          Lo que dicen nuestros clientes
        </motion.h2>

        {/* Slider para celular */}
        <div className="block md:hidden relative pt-2 pb-8">
          <div className="overflow-hidden">
            <motion.div 
              className="flex"
              animate={{ x: `-${activeTestimonial * 100}%` }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {testimonialsData.map((t, idx) => (
                <div className="w-full shrink-0 px-2 flex justify-center" key={idx}>
                  <div className="w-full rounded-3xl bg-white dark:bg-[#1a1a24] p-8 shadow-lg border border-black/5 dark:border-white/10 text-left">
                    <div className="mb-4 text-primary font-bold tracking-widest text-lg">★★★★★</div>
                    <p className="mb-6 italic text-slate-600 dark:text-slate-400 text-sm">"{t.text}"</p>
                    <div className="flex items-center gap-4 border-t border-black/5 dark:border-white/10 pt-4">
                      <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black shrink-0">{t.init}</div>
                      <div>
                        <h4 className="font-bold text-sm">{t.name}</h4>
                        <p className="text-xs text-slate-500">{t.date}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Controles del Slider */}
          <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-2 mt-4">
            {testimonialsData.map((_, i) => (
              <button 
                key={i} 
                onClick={() => setActiveTestimonial(i)}
                className={`w-2 h-2 rounded-full transition-all tracking-widest ${activeTestimonial === i ? 'bg-primary w-6' : 'bg-slate-300 dark:bg-white/20'}`}
                aria-label={`Ir al testimonio ${i + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => setActiveTestimonial(prev => prev === 0 ? testimonialsData.length - 1 : prev - 1)}
            className="absolute top-1/2 -left-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a24] shadow-lg border border-black/5 dark:border-white/10 text-primary z-10 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={() => setActiveTestimonial(prev => (prev + 1) % testimonialsData.length)}
            className="absolute top-1/2 -right-2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1a1a24] shadow-lg border border-black/5 dark:border-white/10 text-primary z-10 hover:scale-110 active:scale-95 transition-all"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Grid para Desktop */}
        <div className="hidden md:grid gap-6 md:grid-cols-3">
          {testimonialsData.map((t, idx) => (
            <motion.div key={idx} variants={fadeUpVariant} whileHover={{ y: -5 }} className="rounded-3xl bg-white dark:bg-[#1a1a24] p-8 shadow-xl border border-black/5 dark:border-white/10 text-left">
              <div className="mb-4 text-primary font-bold tracking-widest text-lg">★★★★★</div>
              <p className="mb-6 italic text-slate-600 dark:text-slate-400 text-sm">"{t.text}"</p>
              <div className="flex items-center gap-4 border-t border-black/5 dark:border-white/10 pt-4">
                <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black shrink-0">{t.init}</div>
                <div>
                  <h4 className="font-bold text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.date}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}