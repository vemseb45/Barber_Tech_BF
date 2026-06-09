import { z } from "zod";

export const updateUsuarioSchema = z.object({
  nombre: z.string().min(2, "Nombre muy corto").optional(),
  apellidos: z.string().min(2, "Apellidos muy cortos").optional(),
  telefono: z.string().min(7, "Teléfono inválido").optional(),
  email: z.string().email("Correo inválido").optional(),
  contrasena: z.string().min(6, "Contraseña muy corta").optional(),
  rol: z.enum(["Admin", "Barbero", "Cliente"]).optional(),
  estado: z.enum(["Activo", "Inactivo"]).optional(),
  dos_factores_activo: z.boolean().optional(),
});