import { NextRequest, NextResponse } from 'next/server';
import { EstadisticasService } from './estadisticas.service';
import { EstadisticasMapper } from './estadisticas.mapper';

export class EstadisticasController {

  private service = new EstadisticasService();

  async getEstadisticas(request: NextRequest) {
    try {
      const { searchParams } = new URL(request.url);

      const filtros = {
        fechaInicio: searchParams.get('fechaInicio') 
          ? new Date(searchParams.get('fechaInicio')!)
          : new Date('2000-01-01'),

        fechaFin: searchParams.get('fechaFin') 
          ? new Date(searchParams.get('fechaFin')!)
          : new Date(),

        cedula_barbero: searchParams.get('cedula_barbero') || undefined
      };

      const data = await this.service.obtenerEstadisticas(filtros);

      return NextResponse.json({
        ok: true,
        data: EstadisticasMapper.toResponse(data)
      });

    } catch (error) {
      console.error(error);
      return NextResponse.json({
        ok: false,
        message: 'Error obteniendo estadísticas'
      }, { status: 500 });
    }
  }

}