import { z } from 'zod';

export const createServicioSchema = z.object({
  nombre: z.string().min(1, "El nombre es obligatorio.").max(100, "Máximo 100 caracteres."),
  descripcion: z.string().max(255, "Máximo 255 caracteres.").optional(),
  precio: z.number().positive("El precio debe ser mayor a 0."),
  duracion_minutos: z.number()
    .positive("La duración debe ser mayor a 0 minutos.")
    .max(240, "La duración no puede superar 240 minutos."),
  imagen: z.string().max(255).optional(),
  id_barberia: z.number().positive("El ID de la barbería es obligatorio.")
});

export const updateServicioSchema = createServicioSchema.partial();