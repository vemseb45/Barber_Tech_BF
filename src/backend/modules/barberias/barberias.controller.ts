import { NextRequest } from "next/server";
import { getSessionUser } from "@/backend/shared/get-session-user";
import { apiResponse } from "@/backend/shared/utils/apiResponse";
import { BarberiasService } from "./barberias.service";
import { CreateBarberiaSchema, UpdateBarberiaSchema } from "./validators/barberia.validator";

export class BarberiasController {
  
  /**
   * [GET] Listar todas las Barberías
   * Regla: Cualquier usuario autenticado (Admin, Barbero, Cliente)
   */
  static async getAll(req: NextRequest) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return apiResponse(false, "No estás autenticado.", null, 401);
      }

      const barberias = await BarberiasService.getAllBarberias();
      return apiResponse(true, "Barberías obtenidas exitosamente", barberias, 200);
    } catch (error: any) {
      return apiResponse(false, "Error interno del servidor", null, 500);
    }
  }

  /**
   * [GET] Obtener una Barbería individual
   * Regla: Cualquier usuario autenticado (Admin, Barbero, Cliente)
   */
  static async getById(req: NextRequest, id: number) {
    try {
      const session = await getSessionUser();
      if (!session) {
        return apiResponse(false, "No estás autenticado.", null, 401);
      }

      const barberia = await BarberiasService.getBarberiaById(id);
      return apiResponse(true, "Barbería encontrada", barberia, 200);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 404);
    }
  }

  /**
   * [POST] Crear una Barbería
   * Regla de negocio estricta: Solo Admin
   */
  static async create(req: NextRequest) {
    try {
      const session = await getSessionUser();
      // Protección de ruta a nivel controlador
      if (!session || session.rol !== "Admin") {
        return apiResponse(false, "Acceso denegado. Se requiere el rol Admin.", null, 403);
      }

      const body = await req.json();
      const validacion = CreateBarberiaSchema.safeParse(body);

      if (!validacion.success) {
        return apiResponse(false, "Datos inválidos en el formulario", validacion.error.flatten().fieldErrors, 400);
      }

      const nuevaBarberia = await BarberiasService.createBarberia(validacion.data);
      return apiResponse(true, "Barbería creada exitosamente", nuevaBarberia, 201);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 400);
    }
  }

  /**
   * [PUT] Actualizar una Barbería
   * Regla de negocio estricta: Solo Admin
   */
  static async update(req: NextRequest, id: number) {
    try {
      const session = await getSessionUser();
      if (!session || session.rol !== "Admin") {
        return apiResponse(false, "Acceso denegado. Se requiere el rol Admin.", null, 403);
      }

      const body = await req.json();
      const validacion = UpdateBarberiaSchema.safeParse(body);

      if (!validacion.success) {
        return apiResponse(false, "Datos inválidos", validacion.error.flatten().fieldErrors, 400);
      }

      const barberiaActualizada = await BarberiasService.updateBarberia(id, validacion.data);
      return apiResponse(true, "Barbería actualizada correctamente", barberiaActualizada, 200);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 400);
    }
  }

  /**
   * [DELETE] Eliminar una Barbería
   * Regla de negocio estricta: Solo Admin
   */
  static async delete(req: NextRequest, id: number) {
    try {
      const session = await getSessionUser();
      if (!session || session.rol !== "Admin") {
        return apiResponse(false, "Acceso denegado. Se requiere el rol Admin.", null, 403);
      }

      const barberiaEliminada = await BarberiasService.deleteBarberia(id);
      return apiResponse(true, "Barbería eliminada correctamente", barberiaEliminada, 200);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 400);
    }
  }
}