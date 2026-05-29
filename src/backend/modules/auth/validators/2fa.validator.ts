import { z } from "zod";

export const verify2faSchema = z.object({
  preAuthToken: z.string().min(1, "El token de autorización es requerido"),
  code: z.string().length(6, "El código debe tener exactamente 6 dígitos").regex(/^\d+$/, "Solo números permitidos"),
});