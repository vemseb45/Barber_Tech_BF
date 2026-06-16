import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function POST(request: Request) {
  return controller.reservarCita(request);
}