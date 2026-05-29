import { z } from "zod";

export const registerSchema = z.object({
  cedula: z.string().min(5, "Cédula muy corta").trim(),
  nombre: z.string().min(2, "Nombre requerido").trim(),
  apellidos: z.string().min(2, "Apellidos requeridos").trim(),
  telefono: z.string().min(7, "Teléfono requerido").trim(),
  email: z.string().email("Correo electrónico inválido").trim(),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres").trim(),
});