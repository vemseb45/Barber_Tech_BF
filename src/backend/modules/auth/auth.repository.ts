import { prisma } from "@/backend/shared/prisma";
import { RegistroDTO } from "./dto/register.dto";

export class AuthRepository {
  
  static async findByEmail(email: string) {
    return prisma.usuario.findUnique({
      where: { email },
    });
  }

  static async findByCedula(cedula: string) {
    return prisma.usuario.findUnique({
      where: { cedula },
    });
  }

  static async createUsuario(data: RegistroDTO, contrasenaHasheada: string) {
    return prisma.usuario.create({
      data: {
        cedula: data.cedula,
        nombre: data.nombre.toLowerCase(),
        apellidos: data.apellidos.toLowerCase(),
        telefono: data.telefono,
        email: data.email.toLowerCase(),
        contrasena: contrasenaHasheada,
        rol: "Cliente",
        estado: "Activo",
      },
      select: {
        cedula: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
      },
    });
  }
}