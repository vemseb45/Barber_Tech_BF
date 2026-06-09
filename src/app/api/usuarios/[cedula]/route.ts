import { NextRequest } from "next/server";
import { updateUsuarioController } from "@/backend/modules/usuarios/usuarios.controller";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ cedula: string }> }) {
  const resolvedParams = await params;
  return updateUsuarioController(req, resolvedParams);
}