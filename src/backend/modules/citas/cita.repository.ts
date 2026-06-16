import { prisma } from '@/backend/shared/prisma';

export class CitaRepository {
  // Guardar una nueva cita en la base de datos
  async crear(data: {
    fecha: Date;
    hora: Date;
    id_servicio: number;
    cedula_cliente: string;
    cedula_barbero: string;
  }) {
    return prisma.cita.create({
      data: {
        fecha: data.fecha,
        hora: data.hora,
        id_servicio: data.id_servicio,
        cedula_cliente: data.cedula_cliente,
        cedula_barbero: data.cedula_barbero,
        estado: 'PENT'
      }
    });
  }

  // Buscar una cita específica por su ID
  async buscarPorId(id_cita: number) {
    return prisma.cita.findUnique({
      where: { id_cita },
      include: { servicio: true }
    });
  }

  // Actualizar el estado de una cita (CONF, CANC, etc.)
  async actualizarEstado(id_cita: number, nuevoEstado: string) {
    return prisma.cita.update({
      where: { id_cita },
      data: { estado: nuevoEstado }
    });
  }

  // Obtener historial de citas de un barbero con filtros de estado
  async buscarHistorialBarbero(cedula_barbero: string, estado: string) {
    return prisma.cita.findMany({
      where: {
        cedula_barbero,
        estado
      },
      include: {
        servicio: true,
        cliente: true
      }
    });
  }

  // Obtener citas de un cliente específico por estado
  async buscarPorClienteYEstado(cedula_cliente: string, estado: string, orden: 'asc' | 'desc') {
    return prisma.cita.findMany({
      where: {
        cedula_cliente,
        estado
      },
      include: {
        servicio: true,
        barbero: true
      },
      orderBy: {
        fecha: orden
      }
    });
  }
}