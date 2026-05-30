import { NextRequest } from "next/server";
import { BarberiasController } from "@/backend/modules/barberias/barberias.controller";

/**
 * [GET] /api/barberias
 * Retorna la lista de todas las barberías.
 */
export async function GET(req: NextRequest) {
  return await BarberiasController.getAll(req);
}

/**
 * [POST] /api/barberias
 * Crea una nueva barbería (Solo Admin).
 */
export async function POST(req: NextRequest) {
  return await BarberiasController.create(req);
}   