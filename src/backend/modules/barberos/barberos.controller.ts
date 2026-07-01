import { NextRequest } from "next/server";
import { getSessionUser } from "@/backend/shared/get-session-user";
import { apiResponse } from "@/backend/shared/utils/apiResponse";
import { BarberosService } from "./barberos.service";
import { CreateBarberoSchema } from "./validators/barbero.validator";

export class BarberosController {
  
  /**
   * [GET] Listar Barberos
   */
  static async listarBarberosController(req: NextRequest) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return apiResponse(false, "No estás autenticado.", null, 401);
      }

      const barberos = await BarberosService.getAllBarberos();
      return apiResponse(true, "Barberos obtenidos exitosamente", barberos, 200);
    } catch (error: any) {
      return apiResponse(false, "Error interno del servidor", null, 500);
    }
  }

  /**
   * [POST] Crear Barbero
   */
  static async crearBarberoController(req: NextRequest) {
    try {
      const session = await getSessionUser();
      
      if (!session || session.rol !== "Admin") {
        return apiResponse(false, "Acceso denegado. Se requiere el rol Admin.", null, 403);
      }

      const body = await req.json();
      
      const validacion = CreateBarberoSchema.safeParse(body);

      if (!validacion.success) {
        return apiResponse(
          false, 
          "Datos inválidos en el formulario", 
          validacion.error.flatten().fieldErrors, 
          400
        );
      }

      const nuevoBarbero = await BarberosService.createBarbero(validacion.data);
      
      // Excluimos la contraseña y la imagen pura para aligerar el payload de respuesta
      const { contrasena, imagen, ...barberoSeguro } = nuevoBarbero;

      return apiResponse(true, "Barbero creado exitosamente", barberoSeguro, 201);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 400);
    }
  }
}