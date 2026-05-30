import { NextRequest } from "next/server";
import { BarberiasController } from "@/backend/modules/barberias/barberias.controller";

interface RouteParams {
  params: Promise<{ identificador: string }>;
}

/**
 * [GET] /api/barberias/:identificador
 * Puede ser el ID (ej: 1) o el Nombre (ej: "Cortes Premium")
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return await BarberiasController.getByOne(req, resolvedParams.identificador);
}

/**
 * [PUT] /api/barberias/:identificador
 */
export async function PUT(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return await BarberiasController.update(req, resolvedParams.identificador);
}

/**
 * [DELETE] /api/barberias/:identificador
 */
export async function DELETE(req: NextRequest, { params }: RouteParams) {
  const resolvedParams = await params;
  return await BarberiasController.delete(req, resolvedParams.identificador);
}