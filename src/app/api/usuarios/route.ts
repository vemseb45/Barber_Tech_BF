import { NextRequest } from "next/server";
import { getUsuariosController } from "@/backend/modules/usuarios/usuarios.controller";

export async function GET(req: NextRequest) {
  return getUsuariosController(req);
}