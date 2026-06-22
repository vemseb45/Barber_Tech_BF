import { prisma } from '@/backend/shared/prisma';
import { EstadisticasFiltroDTO } from './estadisticas.dto'; 

export class EstadisticasRepository {

  async obtenerCitas(filtros: EstadisticasFiltroDTO) {
    return prisma.cita.findMany({
      where: {
        fecha: {
          gte: filtros.fechaInicio,
          lte: filtros.fechaFin
        },
        cedula_barbero: filtros.cedula_barbero || undefined
      },
      include: {
        pagos: true,
        servicio: true 
      }
    });
  }

  async obtenerNombreBarbero(cedula: string): Promise<string | null> {
    const barbero = await prisma.usuario.findUnique({
      where: { 
        cedula: cedula 
      },
      select: { 
        nombre: true,
        apellidos: true 
      }
    });

    if (!barbero) return null;
    
    return `${barbero.nombre} ${barbero.apellidos}`.trim();
  }
}