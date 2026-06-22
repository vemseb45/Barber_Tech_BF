// backend/modules/estadisticas/estadisticas.service.ts

import { EstadisticasRepository } from './estadisticas.repository';
import { EstadisticasFiltroDTO, EstadisticasResponseDTO } from './estadisticas.dto';

export class EstadisticasService {
  private repo = new EstadisticasRepository();

  async obtenerEstadisticas(filtros: EstadisticasFiltroDTO): Promise<EstadisticasResponseDTO> {
    const citas = await this.repo.obtenerCitas(filtros);

    let nombreBarbero: string | undefined = undefined;
    if (filtros.cedula_barbero) {
      const nombre = await this.repo.obtenerNombreBarbero(filtros.cedula_barbero);
      if (nombre) nombreBarbero = nombre;
    }

    let pendientes = 0;
    let canceladas = 0;
    let completadas = 0;
    let ingresos = 0;
    let perdidas = 0;

    const ingresosPorMes: Record<string, number> = {};

    for (const cita of citas) {
      const estado = cita.estado;

      if (estado === 'PENT') pendientes++;
      if (estado === 'CANC') canceladas++;
      if (estado === 'CONF') completadas++;

      const valorCita = Number(cita.servicio?.precio || 0);

      const pagoAprobado = cita.pagos.find(p => p.estado === 'Aprobado');
      const mes = new Date(cita.fecha).toISOString().slice(0, 7); // YYYY-MM

      if (!ingresosPorMes[mes]) ingresosPorMes[mes] = 0;

      if (pagoAprobado) {
        ingresos += Number(pagoAprobado.valor);
        ingresosPorMes[mes] += Number(pagoAprobado.valor);
      } else {
        perdidas += valorCita;
      }
    }

    return {
      totalCitas: citas.length,
      pendientes,
      canceladas,
      completadas,
      ingresos,
      perdidas,
      nombreBarbero,
      ingresosPorMes: Object.entries(ingresosPorMes).map(([mes, total]) => ({
        mes,
        total
      }))
    };
  }
}