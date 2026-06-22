// app/api/estadisticas/route.ts

import { NextRequest } from 'next/server';
import { EstadisticasController } from '@/backend/modules/estadisticas/estadisticas.controller';

const controller = new EstadisticasController();

export async function GET(request: NextRequest) {
  return controller.getEstadisticas(request);
}