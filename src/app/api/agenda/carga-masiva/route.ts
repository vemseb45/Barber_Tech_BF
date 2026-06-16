import { AgendaController } from '@/src/controllers/agenda.controller';

const controller = new AgendaController();

export async function POST(request: Request) {
  return controller.postCargaMasiva(request);
}