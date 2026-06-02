import { prisma } from '@/backend/shared/prisma';
import { CreateServicioDTO, UpdateServicioDTO } from './servicios.types';

export class ServiciosRepository {
  
  static async create(data: CreateServicioDTO) {
    return prisma.servicio.create({
      data,
      include: { barberia: true }
    });
  }

  static async findAll() {
    return prisma.servicio.findMany({
      include: { barberia: true },
      orderBy: { nombre: 'asc' } 
    });
  }

  static async findById(id_servicio: number) {
    return prisma.servicio.findUnique({
      where: { id_servicio },
      include: { barberia: true }
    });
  }

  static async update(id_servicio: number, data: UpdateServicioDTO) {
    return prisma.servicio.update({
      where: { id_servicio },
      data,
      include: { barberia: true }
    });
  }

  static async delete(id_servicio: number) {
    return prisma.servicio.delete({
      where: { id_servicio }
    });
  }
  
  static async findBarberiaById(id_barberia: number) {
    return prisma.barberia.findUnique({
      where: { id_barberia }
    });
  }
}