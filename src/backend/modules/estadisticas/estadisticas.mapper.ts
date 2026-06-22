// backend/modules/estadisticas/estadisticas.mapper.ts

import { EstadisticasResponseDTO } from './estadisticas.dto';

export class EstadisticasMapper {

  static toResponse(data: EstadisticasResponseDTO) {
    return {
      totalCitas: data.totalCitas,
      pendientes: data.pendientes,
      canceladas: data.canceladas,
      completadas: data.completadas,
      ingresos: data.ingresos,
      perdidas: data.perdidas,
      nombreBarbero: data.nombreBarbero, // Mapeo del nuevo campo hacia el cliente
      ingresosPorMes: data.ingresosPorMes
    };
  }

}