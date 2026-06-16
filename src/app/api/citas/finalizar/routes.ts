import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const citaId = parseInt(params.id);
  return controller.finalizarCita(request, citaId);
}