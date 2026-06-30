import { AgendaController } from '@/backend/modules/agenda/agenda.controller';

const controller = new AgendaController();

export async function GET(request: Request) {
  return controller.getMiAgenda(request);
}