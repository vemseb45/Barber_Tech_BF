import { CitaController } from '@/backend/modules/citas/cita.controller';

const controller = new CitaController();

export async function GET(request: Request) {
  return controller.getPendientesCliente(request);
}