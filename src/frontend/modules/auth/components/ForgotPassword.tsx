"use client";
import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, Mail, Hammer, CheckCircle2 } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!value) setError("El correo es obligatorio");
    else if (!emailRegex.test(value)) setError("Formato de correo inválido");
    else setError("");
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
    if (successMsg) setSuccessMsg("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (error || !email) return;
    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    
    try {
      // 1. Obtenemos la URL base de las variables de entorno
      const baseURL = process.env.NEXT_PUBLIC_API_URL || "";

      // 2. Usamos fetch nativo
      const response = await fetch(`${baseURL}api/auth/recovery/request`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Aquí agregamos { email } para que el backend sepa a quién buscar
        body: JSON.stringify({ email })
      });

      // 3. Extraemos la respuesta JSON
      const data = await response.json().catch(() => ({}));

      // 4. Manejamos los errores según el estado de la respuesta
      if (!response.ok) {
        throw new Error(data.error || 'Hubo un error al procesar tu solicitud.');
      }

      // Si todo fue bien, mostramos el mensaje de éxito
      setSuccessMsg(data.message || 'Si el correo está registrado, te enviaremos las instrucciones.');
      setEmail("");
      
    } catch (err: any) {
      setError(err.message || 'Hubo un error al procesar tu solicitud.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col px-4 bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 font-sans transition-colors duration-500">
      <header className="flex justify-between items-center py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#9333ea] text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-[#9333ea]/30 text-lg">B</div>
          <h1 className="text-lg font-black tracking-tighter uppercase">Barber<span className="text-[#9333ea]">Tech</span></h1>
        </div>
        <Link href="/login" className="flex items-center gap-2 bg-[#9333ea] hover:bg-[#7112b3] px-5 py-2 rounded-full text-white font-bold text-xs shadow-md transition-all active:scale-95">
          <ArrowLeft size={14} /> <span>Volver</span>
        </Link>
      </header>
      <main className="flex-grow flex justify-center items-center py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 rounded-[40px] shadow-2xl text-center backdrop-blur-md">
            <div className="flex justify-center mb-4 text-[#9333ea] opacity-50"><Hammer size={32} /></div>
            <h2 className="text-4xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">Recuperar <span className="text-[#9333ea]">Acceso</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium px-4">Ingresa tu correo para recibir las instrucciones.</p>
            <div className="space-y-6 text-left">
              <div>
                <label className="text-[10px] font-black mb-2 block ml-1 uppercase opacity-60">Correo Electrónico</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Mail size={18} /></div>
                  <input type="email" placeholder="tu@correo.com" className={`w-full p-4 pl-12 rounded-2xl bg-slate-100 dark:bg-white/5 border transition-all outline-none text-sm font-medium ${error ? "border-red-500 ring-4 ring-red-500/10" : successMsg ? "border-green-500 ring-4 ring-green-500/10" : "border-transparent focus:border-[#9333ea] focus:ring-4 focus:ring-[#9333ea]/10"}`} value={email} onChange={handleEmailChange} required />
                </div>
                <AnimatePresence mode="wait">
                  {error && <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold mt-2 ml-2 italic overflow-hidden"><AlertCircle size={12} /><span>{error}</span></motion.div>}
                  {successMsg && <motion.div key="success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-[12px] text-green-500 font-bold mt-3 ml-2 overflow-hidden"><CheckCircle2 size={16} /><span>{successMsg}</span></motion.div>}
                </AnimatePresence>
              </div>
            </div>
            <div className="mt-10">
              <button type="submit" disabled={isLoading || !!error || !email} className="w-full bg-[#9333ea] hover:bg-[#7112b3] disabled:opacity-40 text-white font-black py-4 rounded-2xl shadow-xl shadow-[#9333ea]/40 transition-all active:scale-95 uppercase tracking-widest text-sm">
                {isLoading ? "Validando..." : "Enviar Instrucciones"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}