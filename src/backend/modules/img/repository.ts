import { prisma } from '@/backend/shared/prisma';

export class UsuarioRepository {
  static async updateImagen(cedula: string, imagenBuffer: Buffer | null) {
    return await prisma.usuario.update({
      where: { 
        cedula: cedula 
      },
      data: { 
        imagen: imagenBuffer 
      },
      select: {
        cedula: true,
        nombre: true,
        apellidos: true,
        estado: true
      }
    });
  }
}