import type { AuthRole } from "../auth/auth.types";

export type UpdateUsuarioInput = {
  nombre?: string;
  apellidos?: string;
  telefono?: string;
  email?: string;
  contrasena?: string;
  rol?: AuthRole;
  estado?: "Activo" | "Inactivo";
  dos_factores_activo?: boolean;
};