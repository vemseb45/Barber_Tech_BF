"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
// IMPORTANTE: Asegúrate de importar AnimatePresence
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon, Eye, EyeOff, ArrowLeft, Check, X } from "lucide-react";

function RequirementItem({ met, text }: { met: boolean; text: string }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${met ? 'text-green-500' : 'text-slate-400 dark:text-slate-500'}`}>
      {met ? <Check size={12} strokeWidth={4} /> : <X size={12} strokeWidth={4} />}
      <span>{text}</span>
    </div>
  );
}

export default function Register() {
  const [formData, setFormData] = useState({
    username: "", first_name: "", last_name: "", cedula: "", telefono: "", email: "", password: "", confirmPassword: ""
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [passRequirements, setPassRequirements] = useState({
    length: false, upper: false, lower: false, number: false, special: false
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // NUEVO ESTADO: Para controlar si el campo de contraseña está enfocado
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  
  const [darkMode, setDarkMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const router = useRouter();

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (darkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [darkMode, mounted]);

  const toggleTheme = () => setDarkMode(!darkMode);

  const validateField = (name: string, value: string) => {
    let error = "";
    if (name === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) error = "Correo inválido (ejemplo@gmail.com)";
    }
    if (name === "password") {
      setPassRequirements({
        length: value.length >= 8, upper: /[A-Z]/.test(value), lower: /[a-z]/.test(value), number: /[0-9]/.test(value), special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      });
    }
    if (name === "confirmPassword") {
      if (value !== formData.password) error = "Las contraseñas no coinciden";
    }
    setFieldErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "first_name" || name === "last_name") {
      if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/.test(value)) return;
    }
    if (name === "cedula" || name === "telefono") {
      if (!/^[0-9]*$/.test(value)) return;
    }
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allPassRules = Object.values(passRequirements).every(Boolean);
    if (!allPassRules) {
      setFieldErrors(prev => ({ ...prev, password: "La contraseña no cumple los requisitos" }));
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setFieldErrors(prev => ({ ...prev, confirmPassword: "Las contraseñas deben ser iguales" }));
      return;
    }

    setIsLoading(true);
    try {
      const dataToSend = {
        cedula: formData.cedula,
        nombre: formData.first_name,
        apellidos: formData.last_name,
        telefono: formData.telefono,
        email: formData.email,
        contrasena: formData.password
      };

      const response = await fetch("/api/auth/registro", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(dataToSend)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.message || "Error al registrar usuario");
        return;
      }
      
      alert("¡Usuario registrado con éxito!");
      router.push("/login");
    } catch (error) {
      alert("Error de conexión con el servidor");
    } finally {
      setIsLoading(false);
    }
  };

  const inputClass = (name: string) => `w-full p-3.5 sm:p-4 rounded-2xl bg-slate-100 dark:bg-white/10 border ${fieldErrors[name] ? 'border-red-500 ring-1 ring-red-500/20' : 'border-slate-200 dark:border-white/5'} text-slate-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 font-medium`;

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col px-4 sm:px-6 md:px-10 transition-colors duration-500 bg-slate-50 dark:bg-[#0a0a0f] text-slate-900 dark:text-slate-100 font-sans antialiased">
      <header className="flex justify-between items-center py-4 sm:py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-primary/30 text-lg">B</div>
          <h1 className="text-sm sm:text-lg font-black tracking-tighter uppercase leading-none">Barber<span className="text-primary">Tech</span></h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-4">
          <button onClick={toggleTheme} className="p-2 sm:p-2.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-yellow-400 cursor-pointer transition-transform active:scale-95">
            {darkMode ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
          </button>
          <Link href="/login" className="flex items-center gap-1.5 bg-primary hover:bg-[#7112b3] px-4 py-2 sm:px-6 sm:py-2.5 rounded-full text-white font-bold text-[10px] sm:text-xs shadow-md shadow-primary/30 transition-all">
            <ArrowLeft size={14} /> <span>Volver</span>
          </Link>
        </div>
      </header>
      <main className="flex-grow flex justify-center items-center py-6 sm:py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl">
          <form onSubmit={handleSubmit} className="w-full bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 p-6 sm:p-10 rounded-[40px] shadow-2xl backdrop-blur-sm">
            <div className="mb-8 text-center">
              <span className="text-primary text-[10px] font-black tracking-[3px] uppercase block mb-2">Únete a la experiencia</span>
              <h2 className="text-3xl sm:text-4xl font-black mb-2 tracking-tight text-slate-900 dark:text-white">Crea tu <span className="text-primary">Cuenta</span></h2>
            </div>
            
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-6 text-left">
              {/* Se agregó "colSpan" para mejorar el orden. El correo ocupa 2 columnas */}
              {[
                { label: "Correo", name: "email", type: "email", placeholder: "ejemplo@gmail.com", colSpan: "md:col-span-2" },
                { label: "Nombres", name: "first_name", type: "text", placeholder: "Tus nombres", colSpan: "md:col-span-1" },
                { label: "Apellidos", name: "last_name", type: "text", placeholder: "Tus apellidos", colSpan: "md:col-span-1" },
                { label: "Cédula", name: "cedula", type: "text", placeholder: "12345678", max: 10, colSpan: "md:col-span-1" },
                { label: "Teléfono", name: "telefono", type: "text", placeholder: "300...", max: 10, colSpan: "md:col-span-1" },
              ].map((field) => (
                <div key={field.name} className={field.colSpan}>
                  <label className="text-[10px] font-black mb-1.5 block ml-1 uppercase opacity-60">{field.label}</label>
                  <input type={field.type} name={field.name} value={(formData as any)[field.name]} onChange={handleChange} maxLength={field.max} placeholder={field.placeholder} className={inputClass(field.name)} required />
                  {fieldErrors[field.name] && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic">{fieldErrors[field.name]}</p>}
                </div>
              ))}
              
              {/* CAMPO DE CONTRASEÑA CON TOOLTIP FLOTANTE */}
              <div className="md:col-span-1 relative">
                <label className="text-[10px] font-black mb-1.5 block ml-1 uppercase opacity-60">Contraseña</label>
                
                {/* TOOLTIP FLOTANTE DE SEGURIDAD */}
                <AnimatePresence>
                  {isPasswordFocused && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      // Absoluto por encima del input (bottom-full)
                      className="absolute bottom-full left-0 mb-3 w-[110%] p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl z-50"
                    >
                      {/* Pequeña flecha apuntando hacia abajo */}
                      <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white dark:bg-slate-900 border-b border-r border-slate-200 dark:border-white/10 rotate-45"></div>
                      
                      <div className="relative z-10">
                        <p className="text-[9px] font-black uppercase tracking-wider mb-2 opacity-50">Seguridad requerida:</p>
                        <div className="grid grid-cols-1 gap-1.5">
                            <RequirementItem met={passRequirements.length} text="Mínimo 8 caracteres" />
                            <RequirementItem met={passRequirements.upper} text="Una Mayúscula (A-Z)" />
                            <RequirementItem met={passRequirements.lower} text="Una Minúscula (a-z)" />
                            <RequirementItem met={passRequirements.number} text="Un Número (0-9)" />
                            <RequirementItem met={passRequirements.special} text="Un Carácter Especial (!@#$)" />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    onFocus={() => setIsPasswordFocused(true)}
                    onBlur={() => setIsPasswordFocused(false)}
                    className={`${inputClass("password")} pr-12`} 
                    required 
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    onMouseDown={(e) => e.preventDefault()} // <-- ESTO EVITA QUE SE PIERDA EL FOCO AL HACER CLIC
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* CONFIRMAR CONTRASEÑA */}
              <div className="md:col-span-1">
                <label className="text-[10px] font-black mb-1.5 block ml-1 uppercase opacity-60">Confirmar Contraseña</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className={inputClass("confirmPassword")} required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">{showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
                </div>
                {fieldErrors.confirmPassword && <p className="text-[10px] text-red-500 font-bold mt-1 ml-2 italic">{fieldErrors.confirmPassword}</p>}
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-5 mt-8">
              <button type="submit" disabled={isLoading} className="w-full max-w-xs bg-primary hover:bg-[#7112b3] text-white font-black py-4 rounded-2xl shadow-xl shadow-primary/30 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest text-sm">
                {isLoading ? "Creando cuenta..." : "Registrarse ahora"}
              </button>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                ¿Ya tienes cuenta? <Link href="/login" className="text-primary font-bold hover:underline">Inicia Sesión</Link>
              </p>
            </div>
          </form>
        </motion.div>
      </main>
    </div>
  );
}