import { NextRequest } from "next/server";
import { apiResponse } from "@/backend/shared/utils/apiResponse";
import { CalificacionService } from "./calificacion.service";
import { crearCalificacionSchema } from "./validators/calificacion.validator";

export class CalificacionController {
  static async crearCalificacion(req: NextRequest) {
    try {
      const body = await req.json();

      const validacion = crearCalificacionSchema.safeParse(body);
      if (!validacion.success) {
        return apiResponse(
          false,
          "Error de validación",
          validacion.error.flatten().fieldErrors,
          400
        );
      }

      const calificacion = await CalificacionService.crearCalificacion(validacion.data);

      return apiResponse(true, "Calificación guardada exitosamente.", calificacion, 201);
      
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : "Error interno del servidor";
      
      let status = 500;
      let message = errorMessage;

      if (errorMessage.startsWith("NOT_FOUND:")) {
        status = 404;
        message = errorMessage.replace("NOT_FOUND:", "");
      } else if (errorMessage.startsWith("BAD_REQUEST:")) {
        status = 400;
        message = errorMessage.replace("BAD_REQUEST:", "");
      }

      return apiResponse(false, message, null, status);
    }
  }

  static async obtenerPromedioBarbero(req: NextRequest, params: { barbero_id: string }) {
    try {
      const { barbero_id } = params;

      if (!barbero_id) {
        return apiResponse(false, "La cédula del barbero es requerida.", null, 400);
      }

      const data = await CalificacionService.obtenerPromedioBarbero(barbero_id);

      return apiResponse(true, "Promedio calculado correctamente.", data, 200);
    } catch (error: unknown) {
      console.error("Error al obtener promedio del barbero:", error);
      return apiResponse(false, "Error interno del servidor.", null, 500);
    }
  }
}