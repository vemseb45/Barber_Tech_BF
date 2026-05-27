import { z } from "zod";

export const RegistroSchema = z.object({
  cedula: z.string().min(5, "Cédula muy corta"),
  nombre: z.string().min(2, "Nombre requerido"),
  apellidos: z.string().min(2, "Apellidos requeridos"),
  telefono: z.string().max(10, "Teléfono requerido"),
  email: z.string().email("Correo electrónico inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type RegistroDTO = z.infer<typeof RegistroSchema>;