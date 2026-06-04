import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/backend/shared/get-session-user";
import { updateUsuarioSchema } from "./validators/usuarios.validator";
import { listarUsuarios, actualizarUsuario } from "./usuarios.service";

export async function getUsuariosController(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    const usuarios = await listarUsuarios(session);
    return NextResponse.json({ ok: true, data: usuarios }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}

export async function updateUsuarioController(req: NextRequest, params: { cedula: string }) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateUsuarioSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Datos inválidos", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const usuarioActualizado = await actualizarUsuario(session, params.cedula, parsed.data);
    
    return NextResponse.json({ ok: true, message: "Usuario actualizado", data: usuarioActualizado }, { status: 200 });

  } catch (error: any) {
    const isForbidden = error.message.includes("permisos");
    const isNotFound = error.message.includes("encontrado");
    const status = isForbidden ? 403 : isNotFound ? 404 : 400;

    return NextResponse.json({ ok: false, message: error.message }, { status });
  }
}

// ==========================================
// CONTROLADOR PARA EL PERFIL PROPIO (/me)
// ==========================================
export async function updateMeController(req: NextRequest) {
  try {
    const session = await getSessionUser();
    if (!session) {
      return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = updateUsuarioSchema.safeParse(body);
    
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Datos inválidos", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const usuarioActualizado = await actualizarUsuario(session, session.cedula, parsed.data);
    
    return NextResponse.json({ ok: true, message: "Tus datos han sido actualizados", data: usuarioActualizado }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ ok: false, message: error.message }, { status: 400 });
  }
}