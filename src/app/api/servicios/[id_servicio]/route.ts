import { NextRequest } from 'next/server';
import { ServiciosController } from '@/backend/modules/servicios/servicios.controller';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id_servicio: string }> }) {
  const resolvedParams = await params;
  return ServiciosController.getById(req, Number(resolvedParams.id_servicio));
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id_servicio: string }> }) {
  const resolvedParams = await params;
  return ServiciosController.update(req, Number(resolvedParams.id_servicio));
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id_servicio: string }> }) {
  const resolvedParams = await params;
  return ServiciosController.delete(req, Number(resolvedParams.id_servicio));
}