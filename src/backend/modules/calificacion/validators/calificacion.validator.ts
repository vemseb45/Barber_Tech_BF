import { z } from "zod";

export const crearCalificacionSchema = z.object({
  id_cita: z
    .number({
      message: "El id de la cita es requerido y debe ser un número válido.",
    })
    .int("El id de la cita debe ser un número entero.")
    .positive("El id de la cita debe ser un valor positivo."),
    
  puntuacion: z
    .number({
      message: "La puntuación es requerida y debe ser un número.",
    })
    .int("La puntuación debe ser un número entero.")
    .min(1, "La puntuación debe ser como mínimo 1.")
    .max(5, "La puntuación debe ser como máximo 5."),
    
  comentario: z
    .string()
    .trim()
    .optional(),
});