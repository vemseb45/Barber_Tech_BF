import { prisma } from "@/backend/shared/prisma";
import { CreateBarberoDTO } from "./dto/barbero.dto";

export class BarberosRepository {
  /**
   * Obtiene la lista de usuarios que son barberos, incluyendo su sede si la tienen.
   */
  static async findAll() {
    return prisma.usuario.findMany({
      where: {
        rol: "Barbero",
        estado: "Activo" // Buena práctica: solo mostrar barberos activos
      },
      include: {
        detalle_barbero: {
          include: {
            barberia: {
              select: {
                nombre: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Ejecuta la transacción atómica: Crea el Usuario + el Detalle del Barbero.
   */
  static async create(data: CreateBarberoDTO, passwordHash: string) {
    return prisma.$transaction(async (tx) => {
      
      const usuario = await tx.usuario.create({
        data: {
          cedula: data.cedula,
          nombre: data.nombre,
          apellidos: data.apellidos,
          telefono: data.telefono,
          email: data.email,
          contrasena: passwordHash,
          rol: "Barbero", 
          estado: "Activo"
        }
      });

      const detalle = await tx.barberoDetalle.create({
        data: {
          cedula: usuario.cedula,
          id_barberia: data.id_barberia
        }
      });

      return {
        ...usuario,
        detalle_barbero: detalle
      };
    });
  }
}