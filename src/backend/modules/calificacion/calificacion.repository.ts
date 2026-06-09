import { prisma } from "@/backend/shared/prisma";
import { CrearCalificacionDTO } from "./calificacion.types";

export class CalificacionRepository {
  static async buscarCitaPorId(id_cita: number) {
    return await prisma.cita.findUnique({
      where: { id_cita },
      select: {
        id_cita: true,
        fecha: true,
        hora: true,
        estado: true,
        calificacion: true,
      },
    });
  }

  static async crearCalificacion(data: CrearCalificacionDTO) {
    return await prisma.calificacion.create({
      data: {
        id_cita: data.id_cita,
        puntuacion: data.puntuacion,
        comentario: data.comentario,
      },
    });
  }

  static async obtenerPromedioPorBarbero(cedula_barbero: string): Promise<number> {
    const aggregate = await prisma.calificacion.aggregate({
      _avg: {
        puntuacion: true,
      },
      where: {
        cita: {
          cedula_barbero: cedula_barbero,
        },
      },
    });

    // Si no tiene calificaciones, Prisma devuelve null en _avg.puntuacion, retornamos 0
    return aggregate._avg.puntuacion || 0;
  }
}