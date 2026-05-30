import { z } from "zod";

export const CreateBarberiaSchema = z.object({
  nombre: z.string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(50, "El nombre no puede exceder los 50 caracteres"),
  
  direccion: z.string()
    .min(5, "La dirección debe tener al menos 5 caracteres")
    .max(100, "La dirección no puede exceder los 100 caracteres"),
  
  telefono: z.string()
    .min(7, "El teléfono debe tener al menos 7 caracteres")
    .max(20, "El teléfono no puede exceder los 20 caracteres"),
  
  email: z.string()
    .email("Debe proporcionar un correo electrónico válido")
    .max(100, "El correo no puede exceder los 100 caracteres"),
});

export const UpdateBarberiaSchema = CreateBarberiaSchema.partial();