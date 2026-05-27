import { prisma } from "@/backend/shared/prisma";
import bcrypt from "bcryptjs";
import { LoginDTO, RegistroDTO } from "./dto/auth.dto";

export class AuthService {
  static async login(data: LoginDTO) {
    const usuario = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (!usuario) {
      throw new Error("Credenciales inválidas.");
    }

    if (usuario.estado !== "Activo") {
      throw new Error("Usuario inactivo.");
    }

    const isPasswordValid = await bcrypt.compare(data.contrasena, usuario.contrasena);

    if (!isPasswordValid) {
      throw new Error("Credenciales inválidas.");
    }

    const { contrasena, ...usuarioSinPassword } = usuario;
    return usuarioSinPassword;
  }

  static async registro(data: RegistroDTO) {
    const existeEmail = await prisma.usuario.findUnique({
      where: { email: data.email },
    });

    if (existeEmail) {
      throw new Error("El correo ya está registrado.");
    }

    const existeCedula = await prisma.usuario.findUnique({
      where: { cedula: data.cedula },
    });

    if (existeCedula) {
      throw new Error("La cédula ya está registrada.");
    }

    const hashedPassword = await bcrypt.hash(data.contrasena, 10);

    const nuevoUsuario = await prisma.usuario.create({
      data: {
        cedula: data.cedula,
        nombre: data.nombre.toLowerCase(),
        apellidos: data.apellidos.toLowerCase(),
        telefono: data.telefono,
        email: data.email.toLowerCase(),
        contrasena: hashedPassword,
        rol: "Cliente",
        estado: "Activo",
      },
      select: {
        cedula: true,
        nombre: true,
        apellidos: true,
        email: true,
        rol: true,
      }
    });

    return nuevoUsuario;
  }
}