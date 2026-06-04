"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, AlertCircle, CheckCircle2, Lock, KeyRound } from "lucide-react";
import api from "@/app/api/axios";

export default function ResetPassword() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();

  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) setError("");
  };

  const handleConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) setError("");
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) { setError("No se encontró un token válido en la URL."); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (password !== confirmPassword) { setError("Las contraseñas no coinciden."); return; }

    setIsLoading(true);
    setError("");
    setSuccessMsg("");
    try {
      await api.post("/api/auth/recovery/reset", {
        token: token,
        newPassword: password
      });

      setSuccessMsg("¡Contraseña actualizada con éxito! Redirigiendo...");
      setTimeout(() => { router.push('/login'); }, 2500);
    } catch (err: any) {
      setError(err.response?.data?.error || "El enlace es inválido o ha expirado.");
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
          <form onSubmit={handleReset} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-10 rounded-[40px] shadow-2xl text-center backdrop-blur-md">
            <div className="flex justify-center mb-4 text-[#9333ea] opacity-50"><Lock size={32} /></div>
            <h2 className="text-4xl font-black mb-3 tracking-tight text-slate-900 dark:text-white">Nueva <span className="text-[#9333ea]">Clave</span></h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium px-4">Crea una contraseña segura para recuperar tu acceso.</p>
            <div className="space-y-4 text-left">
              <div>
                <label className="text-[10px] font-black mb-2 block ml-1 uppercase opacity-60">Nueva Contraseña</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><KeyRound size={18} /></div>
                  <input type="password" placeholder="Mínimo 8 caracteres" className={`w-full p-4 pl-12 rounded-2xl bg-slate-100 dark:bg-white/5 border transition-all outline-none text-sm font-medium ${error && error.includes("caracteres") ? "border-red-500 ring-4 ring-red-500/10" : "border-transparent focus:border-[#9333ea] focus:ring-4 focus:ring-[#9333ea]/10"}`} value={password} onChange={handlePasswordChange} required />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black mb-2 block ml-1 uppercase opacity-60">Confirmar Contraseña</label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"><Lock size={18} /></div>
                  <input type="password" placeholder="Repite tu contraseña" className={`w-full p-4 pl-12 rounded-2xl bg-slate-100 dark:bg-white/5 border transition-all outline-none text-sm font-medium ${error && error.includes("coinciden") ? "border-red-500 ring-4 ring-red-500/10" : successMsg ? "border-green-500 ring-4 ring-green-500/10" : "border-transparent focus:border-[#9333ea] focus:ring-4 focus:ring-[#9333ea]/10"}`} value={confirmPassword} onChange={handleConfirmChange} required />
                </div>
              </div>
              <AnimatePresence mode="wait">
                {error && <motion.div key="error" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-[11px] text-red-500 font-bold mt-2 ml-2 italic overflow-hidden"><AlertCircle size={12} /><span>{error}</span></motion.div>}
                {successMsg && <motion.div key="success" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center gap-1.5 text-[12px] text-green-500 font-bold mt-3 ml-2 overflow-hidden"><CheckCircle2 size={16} /><span>{successMsg}</span></motion.div>}
              </AnimatePresence>
            </div>
            <div className="mt-8">
              <button type="submit" disabled={isLoading || !password || !confirmPassword || !!successMsg || !token} className="w-full bg-[#9333ea] hover:bg-[#7112b3] disabled:opacity-40 text-white font-black py-4 rounded-2xl shadow-xl shadow-[#9333ea]/40 transition-all active:scale-95 uppercase tracking-widest text-sm">
                {isLoading ? "Guardando..." : "Cambiar Contraseña"}
              </button>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}