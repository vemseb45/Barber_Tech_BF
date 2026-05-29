import { prisma } from "@/backend/shared/prisma";
import type { RegisterInput } from "./auth.types";

export async function findUserByEmail(email: string) {
  return prisma.usuario.findUnique({
    where: { email },
  });
}

export async function findUserByCedula(cedula: string) {
  return prisma.usuario.findUnique({
    where: { cedula },
  });
}

export async function createUser(data: RegisterInput, passwordHash: string) {
  return prisma.usuario.create({
    data: {
      cedula: data.cedula,
      nombre: data.nombre.toLowerCase(),
      apellidos: data.apellidos.toLowerCase(),
      telefono: data.telefono,
      email: data.email.toLowerCase(),
      contrasena: passwordHash,
      rol: "Cliente",
      estado: "Activo",
    },
  });
}