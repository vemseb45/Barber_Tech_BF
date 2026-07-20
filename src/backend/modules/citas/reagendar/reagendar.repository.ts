import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export class CitaRepository {
  async obtenerPorId(id_cita: number) {
    return await prisma.cita.findUnique({
      where: { id_cita }
    });
  }

  async verificarConflicto(fecha: Date, hora: Date, cedula_barbero: string) {
    return await prisma.cita.findFirst({
      where: {
        fecha: fecha,
        hora: hora,
        cedula_barbero: cedula_barbero,
        estado: { notIn: ['CANC'] } // Ignorar citas canceladas
      }
    });
  }

  async reagendar(id_cita: number, fecha: Date, hora: Date, cedula_barbero?: string) {
    const dataAActualizar: any = { fecha, hora };
    if (cedula_barbero) {
      dataAActualizar.cedula_barbero = cedula_barbero;
    }

    return await prisma.cita.update({
      where: { id_cita },
      data: dataAActualizar
    });
  }
}