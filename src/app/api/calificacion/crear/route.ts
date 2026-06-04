import { NextRequest } from "next/server";
import { CalificacionController } from "@/backend/modules/calificacion/calificacion.controller";

export async function POST(req: NextRequest) {
  return await CalificacionController.crearCalificacion(req);
}