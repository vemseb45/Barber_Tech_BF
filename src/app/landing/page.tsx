"use client";
import React, { useState, useEffect } from 'react';
import Navbar from '@/frontend/modules/landing/components/navbar';
import Hero from '@/frontend/modules/landing/components/Hero';
import Services from '@/frontend/modules/landing/components/Services';
import Gallery from '@/frontend/modules/landing/components/Gallery';
import Testimonials from '@/frontend/modules/landing/components/Testimonials';
import Contact from '@/frontend/modules/landing/components/Contact';
import Footer from '@/frontend/modules/landing/components/Footer';

export default function Landing() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [mounted, setMounted] = useState(false); // <- Agregamos este estado

  useEffect(() => {
    // Le decimos a React que el componente ya se montó en el navegador
    setMounted(true); 
    
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setIsDarkMode(savedTheme !== 'light');
    }
  }, []);

  useEffect(() => {
    if (!mounted) return; // Evitamos que se ejecute antes de tiempo

    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode, mounted]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Si no se ha montado, no renderizamos nada para evitar el error de hidratación
  if (!mounted) return null; 

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-x-hidden transition-colors duration-500 flex flex-col">
      <Navbar isDarkMode={isDarkMode} toggleTheme={toggleTheme} />
      
      <main className="flex-grow">
        <Hero />
        <Services />
        <Gallery />
        <Testimonials />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}