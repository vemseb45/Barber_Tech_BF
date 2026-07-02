import { NextRequest } from "next/server";
import { CitaController } from "@/backend/modules/citas/cita.controller";

const controller = new CitaController();

export async function GET(req: NextRequest) {
  return controller.getPosCitas(req);
}