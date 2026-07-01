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
      if (user.rol !== "Admin") return apiResponse(false, "No autorizado.", null, 403);

      // 1. LEER FORMDATA EN LUGAR DE JSON
      const formData = await req.formData();
      
      // 2. EXTRAER DATOS
      const data: any = {
        nombre: formData.get('nombre') as string,
        descripcion: formData.get('descripcion') as string,
        precio: Number(formData.get('precio')),
        duracion_minutos: Number(formData.get('duracion_minutos')),
        id_barberia: Number(formData.get('id_barberia')),
      };

      // 3. EXTRAER Y CONVERTIR LA IMAGEN A BUFFER
      const imagenFile = formData.get('imagen') as File | null;
      if (imagenFile && imagenFile.size > 0) {
        const arrayBuffer = await imagenFile.arrayBuffer();
        data.imagen = Buffer.from(arrayBuffer);
      }
      const nuevoServicio = await ServiciosService.createServicio(data);
      return apiResponse(true, "Servicio creado correctamente", nuevoServicio, 201);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 500);
    }
  }

  static async update(req: NextRequest, id: number) {
    try {
      const user = await getSessionUser();
      if (!user) return apiResponse(false, "No autenticado", null, 401);
      if (user.rol !== "Admin") return apiResponse(false, "No autorizado.", null, 403);

      const formData = await req.formData();
      const data: any = {};

      if (formData.has('nombre')) data.nombre = formData.get('nombre') as string;
      if (formData.has('descripcion')) data.descripcion = formData.get('descripcion') as string;
      if (formData.has('precio')) data.precio = Number(formData.get('precio'));
      if (formData.has('duracion_minutos')) data.duracion_minutos = Number(formData.get('duracion_minutos'));
      if (formData.has('id_barberia')) data.id_barberia = Number(formData.get('id_barberia'));

      const imagenFile = formData.get('imagen') as File | null;
      if (imagenFile && imagenFile.size > 0) {
        const arrayBuffer = await imagenFile.arrayBuffer();
        data.imagen = Buffer.from(arrayBuffer);
      }

      const servicioActualizado = await ServiciosService.updateServicio(id, data);
      return apiResponse(true, "Servicio actualizado", servicioActualizado, 200);
    } catch (error: any) {
      return apiResponse(false, error.message, null, 500);
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