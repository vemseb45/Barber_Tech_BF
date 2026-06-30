import { NextRequest, NextResponse } from 'next/server';
import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'ID no proporcionado en el cuerpo de la petición' }, 
        { status: 400 }
      );
    }

    return await controller.finalizarCita(request, parseInt(id));
    
  } catch (error: any) {
    console.error("Error en PATCH finalizar:", error);
    return NextResponse.json(
      { success: false, message: 'Error en la petición: ' + error.message }, 
      { status: 500 }
    );
  }
}