import { AgendaController } from '@/src/controllers/agenda.controller';

const controller = new AgendaController();

export async function GET(request: Request) {
  return controller.getMiAgenda(request);
}