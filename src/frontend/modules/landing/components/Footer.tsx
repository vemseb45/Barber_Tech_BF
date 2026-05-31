"use client";
import React from 'react';
import { motion } from 'framer-motion';

export default function Footer() {
  const socials = [
    { name: "facebook", light: "/Imagenes/facebook.png", dark: "/Imagenes/facebook_darkmode.png" },
    { name: "instagram", light: "/Imagenes/instagram.png", dark: "/Imagenes/instagram_darkmode.png" },
    { name: "twitter", light: "/Imagenes/twitter.png", dark: "/Imagenes/X_darkmode.png" }
  ];

  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-slate-100 px-6 py-12 dark:bg-[#0a0a0f] transition-colors mt-auto">
      <div className="mx-auto max-w-7xl grid gap-10 md:grid-cols-3 text-center md:text-left">
        <div>
          <h1 className="text-xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
            Barber<span className="text-primary">Tech</span>
          </h1>
          <p className="text-xs text-slate-500 mt-4">Definiendo el estilo masculino.</p>
        </div>
        <div>
          <h4 className="mb-4 font-bold uppercase tracking-wider text-[10px] opacity-50">Legal</h4>
          <ul className="space-y-3 text-xs text-slate-500">
            <li><a className="hover:text-primary transition-colors" href="#">Términos</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Privacidad</a></li>
          </ul>
        </div>
        <div>
          <h4 className="mb-4 font-bold uppercase tracking-wider text-[10px] opacity-50">Síguenos</h4>
          <div className="flex justify-center md:justify-start gap-4">
            {socials.map((social) => (
              <motion.a key={social.name} whileHover={{ y: -5 }} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white dark:bg-white/5 shadow-sm border border-black/5 dark:border-white/10" href="#">
                <img src={social.light} alt={social.name} className="w-5 h-5 object-contain block dark:hidden" />
                <img src={social.dark} alt={social.name} className="w-5 h-5 object-contain hidden dark:block" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-12 pt-8 text-center text-[10px] text-slate-500 uppercase tracking-widest opacity-60">
        © 2026 BarberTech.
      </div>
    </footer>
  );
}