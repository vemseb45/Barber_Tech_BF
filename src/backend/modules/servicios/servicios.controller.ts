import { NextRequest } from 'next/server';
import { apiResponse } from '@/backend/shared/utils/apiResponse';
import { getSessionUser } from '@/backend/shared/get-session-user';
import { ServiciosService } from './servicios.service';
import { createServicioSchema, updateServicioSchema } from './validators/servicios.validator';

export class ServiciosController {
  
  // ======================
  // READ (Cualquier Autenticado)
  // ======================
  static async getAll(req: NextRequest) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);

      const servicios = await ServiciosService.getAllServicios();
      return apiResponse(true, "Servicios obtenidos correctamente", servicios, 200);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 500);
    }
  }

  static async getById(req: NextRequest, id: number) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);

      const servicio = await ServiciosService.getServicioById(id);
      return apiResponse(true, "Servicio obtenido correctamente", servicio, 200);
    } catch (error: any) {
      const status = error.message.includes("no existe") ? 404 : 500;
      return apiResponse(false, error.message, null, status);
    }
  }

  // ======================
  // WRITE (Solo Admin)
  // ======================
  static async create(req: NextRequest) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);
      if (user.rol !== "Admin") return apiResponse(false, "No autorizado. Se requiere rol Admin.", null, 403);

      const body = await req.json();
      
      // Validación con Zod
      const validation = createServicioSchema.safeParse(body);
      if (!validation.success) {
        return apiResponse(false, "Errores de validación", validation.error.format(), 400);
      }

      const nuevoServicio = await ServiciosService.createServicio(validation.data);
      return apiResponse(true, "Servicio creado correctamente", nuevoServicio, 201);
    } catch (error: any) {
      const status = error.message.includes("no existe") ? 400 : 500;
      return apiResponse(false, error.message, null, status);
    }
  }

  static async update(req: NextRequest, id: number) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);
      if (user.rol !== "Admin") return apiResponse(false, "No autorizado. Se requiere rol Admin.", null, 403);

      const body = await req.json();
      const validation = updateServicioSchema.safeParse(body);
      
      if (!validation.success) {
        return apiResponse(false, "Errores de validación", validation.error.format(), 400);
      }

      const servicioActualizado = await ServiciosService.updateServicio(id, validation.data);
      return apiResponse(true, "Servicio actualizado correctamente", servicioActualizado, 200);
    } catch (error: any) {
      const status = error.message.includes("no existe") ? 404 : 500;
      return apiResponse(false, error.message, null, status);
    }
  }

  static async delete(req: NextRequest, id: number) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);
      if (user.rol !== "Admin") return apiResponse(false, "No autorizado. Se requiere rol Admin.", null, 403);

      await ServiciosService.deleteServicio(id);
      return apiResponse(true, "Servicio eliminado correctamente", null, 200);
    } catch (error: any) {
      const status = error.message.includes("no existe") ? 404 : 500;
      return apiResponse(false, error.message, null, status);
    }
  }
}