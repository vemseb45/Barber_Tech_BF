import { prisma } from "@/backend/shared/prisma";
import { CreateBarberiaDTO, UpdateBarberiaDTO } from "./dto/barberia.dto";

export class BarberiasRepository {
  /**
   * Obtiene todas las barberías (Lista)
   */
  static async findAll() {
    return prisma.barberia.findMany({
      orderBy: { nombre: 'asc' },
    });
  }

  /**
   * Obtiene una barbería en específico mediante su ID
   */
  static async findById(id_barberia: number) {
    return prisma.barberia.findUnique({
      where: { id_barberia },
    });
  }

  static async findByNombre(nombre: string) {
    return prisma.barberia.findFirst({
      where: {
        nombre: {
          equals: nombre, 
        }
      },
    });
  }

  /**
   * Busca si existe alguna barbería que utilice el mismo email o teléfono.
   */
  static async findByEmailOrTelefono(email?: string, telefono?: string, excludeId?: number) {
    if (!email && !telefono) return null;

    // Filtros OR dinámicos para el query de duplicidad
    const conditions = [];
    if (email) conditions.push({ email });
    if (telefono) conditions.push({ telefono });

    return prisma.barberia.findFirst({
      where: {
        OR: conditions,
        NOT: excludeId ? { id_barberia: excludeId } : undefined, // Si estamos actualizando, ignorar el registro actual
      },
    });
  }

  /**
   * Crea una nueva Barbería
   */
  static async create(data: CreateBarberiaDTO) {
    return prisma.barberia.create({
      data,
    });
  }

  /**
   * Actualiza una Barbería existente
   */
  static async update(id_barberia: number, data: UpdateBarberiaDTO) {
    return prisma.barberia.update({
      where: { id_barberia },
      data,
    });
  }

  /**
   * Elimina de forma definitiva una Barbería
   */
  static async delete(id_barberia: number) {
    return prisma.barberia.delete({
      where: { id_barberia },
    });
  }
}