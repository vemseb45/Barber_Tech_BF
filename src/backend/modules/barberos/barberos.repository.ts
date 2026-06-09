import { prisma } from "@/backend/shared/prisma";
import { CreateBarberoDTO } from "./dto/barbero.dto";

export class BarberosRepository {
  /**
   * Obtiene la lista completa de barberos junto con sus detalles de usuario y sede.
   */
  static async findAll() {
    return prisma.barberoDetalle.findMany({
      include: {
        usuario: {
          select: {
            nombre: true,
            apellidos: true,
            email: true,
            telefono: true,
            estado: true,
          }
        },
        barberia: {
          select: {
            nombre: true,
          }
        }
      }
    });
  }

  /**
   * Ejecuta la transacción atómica: Crea el Usuario + el Detalle del Barbero.
   * Si una de las dos operaciones falla, nada se guarda en PostgreSQL.
   */
  static async create(data: CreateBarberoDTO, passwordHash: string) {
    return prisma.$transaction(async (tx) => {
      
      // Crear el usuario con el rol fijo "Barbero"
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

      // Crear el detalle del barbero vinculando a la sede
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