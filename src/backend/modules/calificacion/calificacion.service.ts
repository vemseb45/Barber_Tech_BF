import { CalificacionRepository } from "./calificacion.repository";
import { CrearCalificacionDTO, PromedioBarberoResponse } from "./calificacion.types";

export class CalificacionService {
  static async crearCalificacion(data: CrearCalificacionDTO) {
    const cita = await CalificacionRepository.buscarCitaPorId(data.id_cita);

    if (!cita) {
      throw new Error("NOT_FOUND:La cita especificada no existe.");
    }

    // Validar que no tenga calificación previa
    if (cita.calificacion) {
      throw new Error("BAD_REQUEST:Esta cita ya fue calificada previamente.");
    }

    // Validar que la cita ya haya terminado
    // Prisma guarda 'fecha' y 'hora' de manera separada basado en tu modelo.
    const fechaHoraCita = new Date(cita.fecha);
    const hora = new Date(cita.hora);
    
    fechaHoraCita.setUTCHours(
      hora.getUTCHours(),
      hora.getUTCMinutes(),
      hora.getUTCSeconds()
    );

    const ahora = new Date();

    if (fechaHoraCita > ahora) {
      throw new Error("BAD_REQUEST:No puedes calificar una cita que aún no ha terminado.");
    }

    // Si pasa las validaciones, creamos la calificación
    return await CalificacionRepository.crearCalificacion(data);
  }

  static async obtenerPromedioBarbero(cedula_barbero: string): Promise<PromedioBarberoResponse> {
    const promedioDb = await CalificacionRepository.obtenerPromedioPorBarbero(cedula_barbero);
    
    // Redondeamos el promedio a un máximo de 2 decimales
    const promedioDecimal = Math.round(promedioDb * 100) / 100;

    return { promedio: promedioDecimal };
  }
}