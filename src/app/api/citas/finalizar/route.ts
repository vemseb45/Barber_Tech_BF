import { NextRequest } from 'next/server';
import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const citaId = parseInt(resolvedParams.id);
  return controller.finalizarCita(request, citaId);
}
