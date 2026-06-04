import { prisma } from "@/backend/shared/prisma";
import type { UpdateUsuarioInput } from "./usuarios.types";

export async function findAllUsuarios() {
  return prisma.usuario.findMany({
    select: {
      cedula: true,
      nombre: true,
      apellidos: true,
      email: true,
      telefono: true,
      rol: true,
      estado: true,
      fecha_registro: true,
      dos_factores_activo: true,
    },
    orderBy: { fecha_registro: "desc" }
  });
}

export async function findBarberosActivos() {
  return prisma.usuario.findMany({
    where: { 
      rol: "Barbero", 
      estado: "Activo" 
    },
    select: {
      cedula: true,
      nombre: true,
      apellidos: true,
      email: true,
      telefono: true,
      rol: true,
    },
    orderBy: { nombre: "asc" }
  });
}

export async function findUsuarioByCedula(cedula: string) {
  return prisma.usuario.findUnique({
    where: { cedula }
  });
}

export async function updateUsuario(cedula: string, data: UpdateUsuarioInput) {
  return prisma.usuario.update({
    where: { cedula },
    data,
    select: {
      cedula: true,
      nombre: true,
      apellidos: true,
      email: true,
      telefono: true,
      rol: true,
      estado: true,
      dos_factores_activo: true,
    }
  });
}