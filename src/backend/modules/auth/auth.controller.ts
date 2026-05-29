import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "./validators/login.validator";
import { registerSchema } from "./validators/register.validator";
import { loginUser, registerUser } from "./auth.service";
import { setSessionCookie, clearSessionCookie } from "./security/session.service";
import { getSessionUser } from "@/backend/shared/get-session-user";

async function readJsonBody(req: NextRequest) {
  const text = await req.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function loginController(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    const parsed = loginSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Datos inválidos", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await loginUser(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 401 });
    }

    await setSessionCookie(result.token);

    return NextResponse.json({ ok: true, user: result.user }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}

export async function registerController(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, message: "Datos inválidos", errors: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const result = await registerUser(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: "Usuario creado", user: result.user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}

export async function meController(req: NextRequest) {
  const session = await getSessionUser();

  if (!session) {
    return NextResponse.json({ ok: false, message: "No autorizado" }, { status: 401 });
  }

  return NextResponse.json({ ok: true, user: session }, { status: 200 });
}

export async function logoutController(req: NextRequest) {
  await clearSessionCookie();
  
  return NextResponse.json({ ok: true, message: "Sesión cerrada" }, { status: 200 });
}