"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Sun, Moon, Menu, X } from "lucide-react";
import { navLinks, dropDownVariant } from '@/frontend/modules/landing/components/LandingData';

interface NavbarProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

export default function Navbar({ isDarkMode, toggleTheme }: NavbarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const hasSession = false; // Lógica de sesión

  const handleReservation = () => {
    if (hasSession) {
      router.push('/DashboardCliente');
    } else {
      router.push('/login');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/10 bg-white/80 backdrop-blur-md dark:bg-[#0a0a0f]/80 transition-colors duration-300">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-10">
        
        {/* Logo */}
        <motion.div variants={dropDownVariant} initial="hidden" animate="visible" className="flex items-center shrink-0">
          <img 
            src="/Recurso 1.png" 
            alt="BarberTech Logo" 
            className="w-14 h-14 sm:w-24 sm:h-18 object-contain drop-shadow-lg" 
          />
          <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 ml-1 sm:ml-2">
            BarberTech
          </h1>
        </motion.div>

        {/* Desktop Nav */}
        <motion.nav
          variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } } }}
          initial="hidden"
          animate="visible"
          className="hidden lg:flex items-center gap-8"
        >
          {navLinks.map((link, idx) => (
            <motion.a 
              key={idx} 
              variants={dropDownVariant} 
              whileHover={{ scale: 1.15, y: -4, rotate: (idx % 2 === 0 ? 3 : -3) }} 
              whileTap={{ scale: 0.85 }} 
              className="text-sm font-semibold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors relative group pb-1" 
              href={link.href} 
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full rounded-full"></span>
            </motion.a>
          ))}
        </motion.nav>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:scale-110 transition-all text-slate-600 dark:text-slate-300"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <button
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 hover:scale-110 active:scale-95 transition-all text-slate-600 dark:text-yellow-400 cursor-pointer shadow-sm"
          >
            {isDarkMode ? <Sun size={20} fill="currentColor" /> : <Moon size={20} fill="currentColor" />}
          </button>

          <motion.button
            animate={{
              y: [0, -4, 0],
              boxShadow: ["0px 4px 10px rgba(133,25,210,0.2)", "0px 10px 25px rgba(133,25,210,0.6)", "0px 4px 10px rgba(133,25,210,0.2)"]
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            whileHover={{ scale: 1.1, y: -4, backgroundColor: "#5213fc" }}
            whileTap={{ scale: 0.9 }}
            onClick={handleReservation}
            className="hidden sm:block rounded-full bg-primary px-4 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm font-bold text-white shadow-lg transition-all"
          >
            Reservar Cita
          </motion.button>
        </div>
      </div>

      {/* Mobile Nav */}
      <motion.div 
        initial={false}
        animate={{ height: isMobileMenuOpen ? 'auto' : 0, opacity: isMobileMenuOpen ? 1 : 0 }}
        className="lg:hidden overflow-hidden bg-white/95 backdrop-blur-2xl dark:bg-[#0a0a0f]/95 shadow-2xl border-t border-primary/5"
      >
        <nav className="flex flex-col px-6 py-4 pb-8 space-y-1">
          {navLinks.map((link, idx) => (
            <a 
              key={idx} 
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-sm font-bold text-slate-900 dark:text-slate-100 hover:text-primary transition-colors py-4 border-b border-slate-100 dark:border-white/5 last:border-0" 
            >
              {link.name}
            </a>
          ))}
          <button 
            onClick={() => { setIsMobileMenuOpen(false); handleReservation(); }}
            className="mt-6 w-full rounded-2xl bg-primary px-6 py-4 text-sm font-black uppercase text-white shadow-lg text-center tracking-widest"
          >
            Reservar Cita
          </button>
        </nav>
      </motion.div>
    </header>
  );
}