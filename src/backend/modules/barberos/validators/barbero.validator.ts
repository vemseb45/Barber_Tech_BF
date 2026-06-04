import { z } from "zod";

export const CreateBarberoSchema = z.object({
  cedula: z.string()
    .min(5, "La cédula debe tener al menos 5 caracteres")
    .max(11, "La cédula no puede exceder los 11 caracteres"),
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
  apellidos: z.string()
    .min(2, "Los apellidos deben tener al menos 2 caracteres")
    .max(100, "Los apellidos no pueden exceder los 100 caracteres"),
  telefono: z.string()
    .length(10, "El teléfono debe tener exactamente 10 dígitos")
    .regex(/^\d+$/, "El teléfono solo debe contener números"),
  email: z.string()
    .email("Debe proporcionar un correo electrónico válido")
    .max(100, "El correo no puede exceder los 100 caracteres"),
  contrasena: z.string()
    .min(8, "La contraseña debe tener al menos 8 caracteres")
    .max(255, "La contraseña no puede exceder los 255 caracteres"),
  id_barberia: z.number()
    .int()
    .positive("El ID de la barbería es obligatorio y debe ser válido")
});