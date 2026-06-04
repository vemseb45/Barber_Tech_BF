"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, ArrowLeft, AlertCircle, X } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [error, setError] = useState(""); 
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    const savedEmail = localStorage.getItem('remember_email');
    const savedPassword = localStorage.getItem('remember_password');
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
      if (savedPassword) setPassword(savedPassword);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode, mounted]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true); 

    try {
      // 1. Ajustamos las claves para que coincidan con tu backend: email y contrasena
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: email, 
          contrasena: password 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Error al iniciar sesión");
        setIsLoading(false);
        return;
      }

      if (data.data?.token) localStorage.setItem('token', data.data.token);

      if (rememberMe) {
        localStorage.setItem('remember_email', email);
        localStorage.setItem('remember_password', password);
      } else {
        localStorage.removeItem('remember_email');
        localStorage.removeItem('remember_password');
      }

      const username = data.data?.user?.username || data.data?.user?.nombres || "Usuario";
      localStorage.setItem('username', username);

      const rawRole = data.data?.user?.rol || data.data?.rol || "";
      const userRole = rawRole.toString().toLowerCase().trim();

      if (userRole === "admin") router.push("/dashboardAdmin");
      else if (userRole === "barbero") router.push("/dashboardBarbero");
      else router.push("/cliente");

    } catch (error) {
      console.error("Error:", error);
      setError("No se pudo conectar con el servidor.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-10 transition-colors duration-500 bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 font-sans antialiased overflow-x-hidden">
      <header className="flex justify-between items-center py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-primary/30 text-lg shrink-0">B</div>
          <h1 className="text-sm sm:text-lg font-black tracking-tighter uppercase leading-tight">Barber<span className="text-primary">Tech</span></h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggleTheme} className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-yellow-400 shadow-sm">
            {darkMode ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
          </button>
          <Link href="/" className="flex items-center gap-1 bg-primary hover:bg-[#7112b3] px-4 py-2 rounded-full text-white font-bold text-[10px] sm:text-xs shadow-md shadow-primary/30 transition-all">
            <ArrowLeft size={14} /> <span className="hidden sm:inline">Volver</span>
          </Link>
        </div>
      </header>

      <main className="flex-grow flex justify-center items-center py-8">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="w-full text-center p-6 sm:p-10 rounded-[32px] bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-2xl backdrop-blur-sm">
            <span className="text-primary text-[10px] font-black tracking-[2px] uppercase mb-3 block">Bienvenido de nuevo</span>
            <h2 className="text-4xl sm:text-5xl font-black leading-none mb-4 tracking-tight">Barber <span className="text-primary">Tech</span></h2>
            
            <AnimatePresence>
              {error && (
                <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-start gap-3 text-left relative">
                  <div className="bg-red-500/20 p-1.5 rounded-lg shrink-0"><AlertCircle size={16} className="text-red-500" /></div>
                  <div className="flex-1 pr-6">
                    <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-0.5">No pudo ingresar</p>
                    <p className="text-slate-600 dark:text-slate-300 text-[11px] font-medium leading-tight">{error}</p>
                  </div>
                  <button type="button" onClick={() => setError("")} className="absolute top-4 right-4 text-slate-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="space-y-5 text-left mt-8">
              <div>
                {/* 2. Cambiamos visualmente a Correo para que tenga sentido con tu API */}
                <label className="text-xs font-bold mb-2 block ml-1 opacity-70">Correo</label>
                <input type="email" placeholder="ejemplo@gmail.com" className="w-full p-4 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="text-xs font-bold mb-2 block ml-1 opacity-70">Contraseña</label>
                <div className="relative group">
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className="w-full p-4 pr-12 rounded-2xl bg-slate-100 dark:bg-white/5 border border-transparent focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm font-medium" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors focus:outline-none">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2 px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input type="checkbox" className="peer sr-only" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                    <div className="w-5 h-5 rounded-md border-2 border-slate-300 dark:border-white/20 peer-checked:bg-primary peer-checked:border-primary flex items-center justify-center transition-colors">
                      <svg className={`w-3 h-3 text-white transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">Recordar contraseña</span>
                </label>
                <Link href="/recovery" className="text-xs font-bold text-primary hover:underline transition-colors focus:outline-none">¿Olvidaste tu contraseña?</Link>
              </div>
            </div>

            <div className="mt-10">
              <button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-[#7112b3] text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 cursor-pointer uppercase tracking-widest text-sm disabled:opacity-50 disabled:cursor-not-allowed">
                {isLoading ? "Conectando..." : "Ingresar"}
              </button>
              <p className="mt-6 text-xs text-slate-500 dark:text-slate-400 font-medium">¿No tienes cuenta? <Link href="/registro" className="text-primary font-bold hover:underline">Registrarse gratis</Link></p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}