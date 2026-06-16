import { prisma } from '@/backend/shared/prisma';
import { DiaSemana } from '@prisma/client';

export class AgendaRepository {
  // Buscar un usuario por su ID secuencial/autoincremental o Cédula
  async buscarUsuarioPorId(id: number) {
    return prisma.usuario.findUnique({
      where: { cedula: String(id) } 
    });
  }

  async obtenerCedulaPorId(barberoId: string) {
    const usuario = await prisma.usuario.findFirst({
      where: { cedula: barberoId }
    });
    return usuario ? usuario.cedula : null;
  }

  // Obtener la agenda laboral de un barbero para un día específico
  async buscarAgendaBarbero(cedula: string, dia: DiaSemana) {
    return prisma.agendaBarbero.findUnique({
      where: {
        cedula_barbero_dia: {
          cedula_barbero: cedula,
          dia: dia
        }
      }
    });
  }

  // Obtener todas las agendas o filtrar por barbero
  async listarAgendas(cedula_barbero?: string) {
    return prisma.agendaBarbero.findMany({
      where: cedula_barbero ? { cedula_barbero } : {},
      include: { usuario: true }
    });
  }

  // Guardar o actualizar un horario (Upsert)
  async guardarHorario(data: { cedula_barbero: string; dia: DiaSemana; hora_inicio: Date; hora_fin: Date }) {
    return prisma.agendaBarbero.upsert({
      where: {
        cedula_barbero_dia: {
          cedula_barbero: data.cedula_barbero,
          dia: data.dia
        }
      },
      update: {
        hora_inicio: data.hora_inicio,
        hora_fin: data.hora_fin
      },
      create: data
    });
  }

  // Eliminar un horario de la agenda laboral
  async eliminarHorario(cedula_barbero: string, dia: DiaSemana) {
    return prisma.agendaBarbero.delete({
      where: {
        cedula_barbero_dia: {
          cedula_barbero,
          dia
        }
      }
    });
  }

  // Buscar citas de un barbero en un rango de fechas
  async buscarCitasRango(cedula_barbero: string, inicio: Date, fin: Date) {
    return prisma.cita.findMany({
      where: {
        cedula_barbero,
        fecha: { gte: inicio, lte: fin }
      },
      include: {
        cliente: true,
        servicio: true
      }
    });
  }

  // Buscar citas de un barbero para una fecha específica
  async buscarCitasFecha(cedula_barbero: string, fecha: Date) {
    return prisma.cita.findMany({
      where: {
        cedula_barbero,
        fecha: fecha
      },
      include: {
        cliente: true,
        servicio: true
      }
    });
  }

  // Crear una nueva cita confirmada
  async crearCita(data: {
    fecha: Date;
    hora: Date;
    cedula_cliente: string;
    cedula_barbero: string;
    id_servicio: number;
  }) {
    return prisma.cita.create({
      data: {
        fecha: data.fecha,
        hora: data.hora,
        cedula_cliente: data.cedula_cliente,
        cedula_barbero: data.cedula_barbero,
        id_servicio: data.id_servicio,
        estado: 'PENT'
      }
    });
  }

  // Obtener los minutos de duración de un servicio
  async obtenerDuracionServicio(id_servicio: number) {
    const servicio = await prisma.servicio.findUnique({
      where: { id_servicio }
    });
    return servicio ? servicio.duracion_minutos : null;
  }
}