import { AgendaController } from '@/backend/modules/agenda/agenda.controller';

const controller = new AgendaController();

export async function GET(request: Request) {
  return controller.getHorariosConfigurados(request);
}

export async function POST(request: Request) {
  return controller.postConfigurarHorario(request);
}

export async function DELETE(request: Request) {
  return controller.deleteHorario(request);
}
