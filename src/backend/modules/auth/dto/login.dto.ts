import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
  contrasena: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});

export type LoginDTO = z.infer<typeof LoginSchema>;