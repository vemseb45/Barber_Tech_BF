import { NextRequest } from 'next/server';
import { ServiciosController } from '@/backend/modules/servicios/servicios.controller';

export async function GET(req: NextRequest) {
  return ServiciosController.getAll(req);
}

export async function POST(req: NextRequest) {
  return ServiciosController.create(req);
}