import { NextRequest } from "next/server";
import { CalificacionController } from "@/backend/modules/calificacion/calificacion.controller";

interface RouteContext {
  params: Promise<{ barbero_id: string }>;
}

export async function GET(req: NextRequest, context: RouteContext) {
  const resolvedParams = await context.params;
  
  return await CalificacionController.obtenerPromedioBarbero(req, resolvedParams);
}