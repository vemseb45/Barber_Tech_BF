import bcrypt from "bcryptjs";
import { AuthRepository } from "./auth.repository";
import { RegistroDTO } from "./dto/register.dto";
import { LoginDTO } from "./dto/login.dto";

export class AuthService {
  
  static async registro(data: RegistroDTO) {
    const existeEmail = await AuthRepository.findByEmail(data.email);
    if (existeEmail) throw new Error("El correo ya está registrado.");

    const existeCedula = await AuthRepository.findByCedula(data.cedula);
    if (existeCedula) throw new Error("La cédula ya está registrada.");

    const hashedPassword = await bcrypt.hash(data.contrasena, 10);
    return await AuthRepository.createUsuario(data, hashedPassword);
  }

  static async login(data: LoginDTO) {
    const usuario = await AuthRepository.findByEmail(data.email);
    
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
}