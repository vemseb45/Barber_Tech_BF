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

export async function updateUserOtp(cedula: string, otpHash: string | null, expiresAt: Date | null) {
  return prisma.usuario.update({
    where: { cedula },
    data: { otp_hash: otpHash, otp_expires_at: expiresAt },
  });
}

export async function updateUserPassword(cedula: string, passwordHash: string) {
  return prisma.usuario.update({
    where: { cedula },
    data: { contrasena: passwordHash },
  });
}