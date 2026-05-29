import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Correo electrónico inválido").trim(),
  contrasena: z.string().min(1, "La contraseña es requerida").trim(),
});