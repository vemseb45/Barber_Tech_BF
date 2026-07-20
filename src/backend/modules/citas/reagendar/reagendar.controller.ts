import { NextRequest, NextResponse } from 'next/server';
import { CitaMapper } from './reagendar.mapper';
import { CitaService } from './reagendar.service';

export class CitaController {
  private service: CitaService;

  constructor() {
    this.service = new CitaService();
  }

  async reagendar(request: NextRequest) {
    try {
      const body = await request.json();
      
      const dto = CitaMapper.toReagendarDto(body);

      const citaActualizada = await this.service.reagendarCita(dto);

      return NextResponse.json({ 
        success: true, 
        message: 'Cita reagendada con éxito',
        data: citaActualizada
      }, { status: 200 });

    } catch (error: any) {
      return NextResponse.json({ 
        success: false, 
        message: error.message || 'Error al reagendar la cita'
      }, { status: 400 });
    }
  }
}