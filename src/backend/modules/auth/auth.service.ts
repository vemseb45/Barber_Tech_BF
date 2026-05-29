import { findUserByEmail, findUserByCedula, createUser, updateUserOtp, updateUserPassword } from "./auth.repository";
import { hashPassword, verifyPassword, isScryptHash } from "@/backend/shared/password";
import { createToken, createPreAuthToken } from "./security/token.service";
import type { LoginInput, RegisterInput, LoginResult, RegisterResult, SessionUser } from "./auth.types";
import { generateSecureOtp, hashOtp, sendOtpEmail, verifyEmailOtp } from "./security/email-otp.service";

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

  const passwordDb = String(user.contrasena ?? "").trim();
  const passwordIsHashed = isScryptHash(passwordDb);

  const isPasswordValid = passwordIsHashed
    ? await verifyPassword(input.contrasena, passwordDb)
    : input.contrasena === passwordDb;

  if (!isPasswordValid) {
    return { ok: false, message: "Credenciales inválidas." };
  }

  if (!passwordIsHashed) {
    const newHash = await hashPassword(input.contrasena);
    await updateUserPassword(user.cedula, newHash);
  }

  const isMandatory2FA = user.rol === "Admin" || user.rol === "Barbero";
  const isOptional2FAEnabled = user.rol === "Cliente" && user.dos_factores_activo;

  if (isMandatory2FA || isOptional2FAEnabled) {
    const otp = generateSecureOtp();
    const hashedCode = hashOtp(otp);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 min de validez
    
    await updateUserOtp(user.cedula, hashedCode, expiresAt);
    sendOtpEmail(user.email, otp).catch(console.error); // Se envía asíncronamente
    
    const preAuthToken = createPreAuthToken(user.cedula);

    return {
      ok: true,
      requires2FA: true,
      preAuthToken,
      message: "Código de seguridad enviado a tu correo.",
    };
  }

  const sessionUser = buildSessionUser(user);
  const token = createToken(sessionUser);
  return { ok: true, user: sessionUser, token };
}

export async function verifyLogin2fa(cedula: string, code: string): Promise<LoginResult> {
  const user = await findUserByCedula(cedula);
  
  if (!user) return { ok: false, message: "Usuario no encontrado." };

  if (!user.otp_hash || !user.otp_expires_at) {
    return { ok: false, message: "No existe un código pendiente o ha expirado." };
  }

  const isValid = verifyEmailOtp(code, user.otp_hash, user.otp_expires_at);

  await updateUserOtp(cedula, null, null);

  if (!isValid) {
    return { ok: false, message: "El código es incorrecto o ha caducado." };
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