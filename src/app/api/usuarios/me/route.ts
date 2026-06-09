import { NextRequest } from "next/server";
import { meController } from "@/backend/modules/auth/auth.controller";
import { updateMeController } from "@/backend/modules/usuarios/usuarios.controller";

export async function GET(req: NextRequest) {
  return meController(req);
}

// Actualiza los datos de quien está logueado
export async function PATCH(req: NextRequest) {
  return updateMeController(req);
}