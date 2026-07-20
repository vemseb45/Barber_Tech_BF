import { NextRequest } from 'next/server';
import { CitaController } from '@/backend/modules/citas/reagendar/reagendar.controller';

// Instanciamos el controlador
const controller = new CitaController();

export async function PATCH(request: NextRequest) {
  // Pasamos la request completa al controlador
  return controller.reagendar(request);
}