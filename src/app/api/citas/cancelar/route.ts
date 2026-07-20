import { NextRequest, NextResponse } from 'next/server';
import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    // Extraemos id_cita en lugar de id
    const { id_cita } = body; 

    if (!id_cita) {
      return NextResponse.json({ success: false, message: 'ID no proporcionado' }, { status: 400 });
    }

    // Pasamos el ID al controlador
    return controller.cancelarCita(request, parseInt(id_cita));
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error en la petición' }, { status: 400 });
  }
}