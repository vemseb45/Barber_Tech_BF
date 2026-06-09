import * as repository from "./usuarios.repository";
import { hashPassword } from "@/backend/shared/password";
import type { SessionUser } from "../auth/auth.types";
import type { UpdateUsuarioInput } from "./usuarios.types";

export async function listarUsuarios(sessionUser: SessionUser) {
  if (sessionUser.rol === "Admin") {
    // El admin puede ver absolutamente a todos
    return await repository.findAllUsuarios();
  }
  
  // Clientes y Barberos solo pueden ver a los barberos disponibles
  return await repository.findBarberosActivos();
}

export async function actualizarUsuario(sessionUser: SessionUser, cedulaTarget: string, data: UpdateUsuarioInput) {
  const targetUser = await repository.findUsuarioByCedula(cedulaTarget);
  
  if (!targetUser) {
    throw new Error("Usuario no encontrado.");
  }

  const isAdmin = sessionUser.rol === "Admin";
  const isSelf = sessionUser.cedula === cedulaTarget;

  if (!isAdmin && !isSelf) {
    throw new Error("No tienes permisos para actualizar este usuario.");
  }

  if (!isAdmin) {
    delete data.rol;
    delete data.estado;
  }

  if (data.contrasena) {
    data.contrasena = await hashPassword(data.contrasena);
  }

  return await repository.updateUsuario(cedulaTarget, data);
}