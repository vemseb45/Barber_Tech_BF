import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { RegistroSchema } from "./dto/register.dto";
import { LoginSchema } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { apiResponse } from "@/backend/shared/utils/apiResponse";
import { generateToken } from "./security/token.service";
import { AUTH_COOKIE_NAME, AUTH_SESSION_HOURS } from "./auth.constants";
import { getSessionUser } from "@/backend/shared/get-session-user";

export class AuthController {
  
  static async registro(req: NextRequest) {
    try {
      const body = await req.json();
      const validacion = RegistroSchema.safeParse(body);
      if (!validacion.success) {
        return apiResponse(false, "Error en los datos enviados", validacion.error.flatten().fieldErrors, 400);
      }

      const nuevoUsuario = await AuthService.registro(validacion.data);
      return apiResponse(true, "Usuario registrado correctamente", nuevoUsuario, 201);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 400);
    }
  }

  static async login(req: NextRequest) {
    try {
      const body = await req.json();
      const validacion = LoginSchema.safeParse(body);
      if (!validacion.success) {
        return apiResponse(false, "Credenciales inválidas", validacion.error.flatten().fieldErrors, 400);
      }

      const usuario = await AuthService.login(validacion.data);

      const tokenPayload = {
        cedula: usuario.cedula,
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
      };

      const token = generateToken(tokenPayload);

      const cookieStore = await cookies();
      cookieStore.set(AUTH_COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: AUTH_SESSION_HOURS * 60 * 60,
        path: "/",
      });

      return apiResponse(true, "Inicio de sesión exitoso", { user: tokenPayload }, 200);
      
    } catch (error: any) {
      return apiResponse(false, error.message, null, 401);
    }
  }

  static async me(req: NextRequest) {
    const session = await getSessionUser();
    
    if (!session) {
      return apiResponse(false, "No autorizado", null, 401);
    }

    return apiResponse(true, "Sesión activa", { user: session }, 200);
  }

  static async logout(req: NextRequest) {
    const cookieStore = await cookies();
    cookieStore.delete(AUTH_COOKIE_NAME);
    return apiResponse(true, "Sesión cerrada correctamente", null, 200);
  }
}