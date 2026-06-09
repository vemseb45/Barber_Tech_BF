"use client";
import React, { useState } from 'react';
import { X, UserPlus, Eye, EyeOff } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CrearBarbero: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    first_name: '',
    last_name: '',
    email: '',
    cedula: '',
    telefono: '',
    barberia_id: 1,
    especialidad_id: 1
  });

  const [errors, setErrors] = useState<any>({});
  const [generalError, setGeneralError] = useState('');
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Configuración para fetch
  const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
  const getAuthHeaders = () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : '';
    return {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
  };

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;

    if (name === "cedula" || name === "telefono") {
      value = value.replace(/\D/g, '').slice(0, 10);
    }

    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
    setGeneralError('');
  };

  const validar = () => {
    let newErrors: any = {};

    if (!form.username.trim()) newErrors.username = "Requerido";
    if (!form.first_name.trim()) newErrors.first_name = "Requerido";
    if (!form.last_name.trim()) newErrors.last_name = "Requerido";

    if (!form.email.trim()) {
      newErrors.email = "Requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.com$/.test(form.email)) {
      newErrors.email = "Email inválido";
    }

    if (!form.cedula.trim()) {
      newErrors.cedula = "Requerido";
    } else if (form.cedula.length !== 10) {
      newErrors.cedula = "Debe tener 10 dígitos";
    }

    if (!form.telefono.trim()) {
      newErrors.telefono = "Requerido";
    } else if (form.telefono.length !== 10) {
      newErrors.telefono = "Debe tener 10 dígitos";
    }

    if (!form.password) {
      newErrors.password = "Requerido";
    } else if (form.password.length < 6) {
      newErrors.password = "Mínimo 6 caracteres";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Requerido";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "No coinciden";
    }

    return newErrors;
  };

  const handleSubmit = async () => {
    const validationErrors = validar();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setGeneralError("Debes completar correctamente todos los campos");
      return;
    }

    try {
      setLoading(true);

      const { confirmPassword, ...data } = form;

      const response = await fetch(`${baseURL}api/barberos/crear-barbero/`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });

      const resData = await response.json().catch(() => ({}));

      if (!response.ok) throw new Error(resData.message || "Error al crear barbero");

      onSuccess();
      onClose();

      setForm({
        username: '', password: '', confirmPassword: '', first_name: '',
        last_name: '', email: '', cedula: '', telefono: '',
        barberia_id: 1, especialidad_id: 1
      });

      setErrors({});
      setGeneralError('');

    } catch (error: any) {
      setGeneralError(error.message || "Error al crear barbero");
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field: string) =>
    `input ${errors[field] ? 'border-red-500 focus:ring-red-300' : ''}`;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="w-full max-w-2xl bg-white dark:bg-[#1e293b] rounded-[32px] p-6 md:p-8 shadow-2xl border border-slate-200 dark:border-slate-700 max-h-[90vh] overflow-y-auto custom-scrollbar">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800 dark:text-white">Crear Barbero</h3>
          <button onClick={onClose}><X className="text-slate-400 hover:text-red-500" /></button>
        </div>

        {generalError && (
          <div className="mb-4 p-4 rounded-xl bg-red-100 text-red-700 text-sm font-semibold text-center">
            {generalError}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Username", name: "username" },
            { label: "Email", name: "email" },
            { label: "Nombre", name: "first_name" },
            { label: "Apellido", name: "last_name" },
            { label: "Cédula", name: "cedula", max: 10 },
            { label: "Teléfono", name: "telefono", max: 10 }
          ].map((field) => (
            <div key={field.name}>
              <label className="text-xs font-bold mb-1 block">{field.label}</label>
              <input name={field.name} maxLength={field.max} onChange={handleChange} className={inputClass(field.name)} />
              {errors[field.name] && <p className="text-red-500 text-xs mt-1">{errors[field.name]}</p>}
            </div>
          ))}

          <div className="relative">
            <label className="text-xs font-bold mb-1 block">Contraseña</label>
            <input type={showPassword ? "text" : "password"} name="password" onChange={handleChange} className={`${inputClass("password")} pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-slate-400">
              {showPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>

          <div className="relative">
            <label className="text-xs font-bold mb-1 block">Confirmar Contraseña</label>
            <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" onChange={handleChange} className={`${inputClass("confirmPassword")} pr-10`} />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-9 text-slate-400">
              {showConfirmPassword ? <EyeOff size={18}/> : <Eye size={18}/>}
            </button>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading} className="mt-6 w-full bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:scale-105 transition-all disabled:opacity-50">
          <UserPlus size={18} /> {loading ? "Creando..." : "Crear Barbero"}
        </button>
      </div>
    </div>
  );
};

export default CrearBarbero;