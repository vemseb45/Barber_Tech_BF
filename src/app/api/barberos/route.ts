import { NextRequest } from "next/server";
import { BarberosController } from "@/backend/modules/barberos/barberos.controller";

/**
 * [GET] /api/barberos
 * Llama a la lista de barberos.
 */
export async function GET(req: NextRequest) {
  return await BarberosController.listarBarberosController(req);
}

/**
 * [POST] /api/barberos
 * Procesa la creación de un nuevo barbero.
 */
export async function POST(req: NextRequest) {
  return await BarberosController.crearBarberoController(req);
}