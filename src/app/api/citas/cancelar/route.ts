import { NextRequest, NextResponse } from 'next/server';
import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Extraemos 'id' (que es lo que manda el Front) o 'id_cita' por compatibilidad
    const id = body.id || body.id_cita; 

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID no proporcionado' }, { status: 400 });
    }

    // Pasamos el ID al controlador asegurándonos de que sea un número
    return controller.cancelarCita(request, parseInt(id));
    
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Error en la petición' }, { status: 400 });
  }
}