import { z } from "zod";

export const requestResetSchema = z.object({
  email: z.string().email("Correo electrónico inválido"),
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid("Token inválido"),
  newPassword: z
    .string()
    .min(6, "La contraseña debe tener al menos 6 caracteres"),
});