import { findUserByEmail, findUserByCedula, createUser } from "./auth.repository";
import { hashPassword, verifyPassword } from "@/backend/shared/password";
import { createToken } from "./security/token.service";
import type { LoginInput, RegisterInput, LoginResult, RegisterResult, SessionUser } from "./auth.types";

function buildSessionUser(user: any): SessionUser {
  return {
    cedula: user.cedula,
    email: user.email,
    nombre: `${user.nombre} ${user.apellidos}`.trim(),
    rol: user.rol,
  };
}

export async function loginUser(input: LoginInput): Promise<LoginResult> {
  const user = await findUserByEmail(input.email);

  if (!user || user.estado !== "Activo") {
    return { ok: false, message: "Credenciales inválidas o usuario inactivo." };
  }

  const isPasswordValid = await verifyPassword(input.contrasena, user.contrasena);

  if (!isPasswordValid) {
    return { ok: false, message: "Credenciales inválidas." };
  }

  const sessionUser = buildSessionUser(user);
  const token = createToken(sessionUser);

  return { ok: true, user: sessionUser, token };
}

export async function registerUser(input: RegisterInput): Promise<RegisterResult> {
  const emailExists = await findUserByEmail(input.email);
  if (emailExists) return { ok: false, message: "El correo ya está registrado." };

  const cedulaExists = await findUserByCedula(input.cedula);
  if (cedulaExists) return { ok: false, message: "La cédula ya está registrada." };

  const hashedPassword = await hashPassword(input.contrasena);
  const newUser = await createUser(input, hashedPassword);

  const sessionUser = buildSessionUser(newUser);

  return { ok: true, user: sessionUser };
}