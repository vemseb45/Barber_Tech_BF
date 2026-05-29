import { prisma } from "@/backend/shared/prisma";

export async function createResetToken(cedula: string) {
  return prisma.tokenRecuperacion.create({
    data: {
      usuario_id: cedula,
    },
  });
}

export async function findToken(token: string) {
  return prisma.tokenRecuperacion.findUnique({
    where: { token },
    include: { usuario: true },
  });
}

export async function markTokenAsUsed(tokenId: number) {
  return prisma.tokenRecuperacion.update({
    where: { id_token: tokenId },
    data: { usado: true },
  });
}

export async function updateUserPassword(cedula: string, passwordHash: string) {
  return prisma.usuario.update({
    where: { cedula },
    data: { contrasena: passwordHash },
  });
}