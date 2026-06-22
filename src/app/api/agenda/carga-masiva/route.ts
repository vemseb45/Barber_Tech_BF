import { AgendaController } from '@/backend/modules/agenda/agenda.controller';

const controller = new AgendaController();

export async function POST(request: Request) {
  return controller.postCargaMasiva(request);
}
