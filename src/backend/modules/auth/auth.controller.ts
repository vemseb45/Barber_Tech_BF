import { NextRequest } from "next/server";
import { RegistroSchema } from "./dto/register.dto";
import { LoginSchema } from "./dto/login.dto";
import { AuthService } from "./auth.service";
import { apiResponse } from "@/backend/shared/utils/apiResponse";

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

      return apiResponse(true, "Inicio de sesión exitoso", usuario, 200);
      
    } catch (error: any) {
      return apiResponse(false, error.message, null, 401);
    }
  }
}