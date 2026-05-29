import { NextRequest, NextResponse } from "next/server";
import { verify2faSchema } from "./validators/2fa.validator";
import { readPreAuthToken } from "./security/token.service";
import type { LoginSuccess } from "./auth.types";
import { loginSchema } from "./validators/login.validator";
import { registerSchema } from "./validators/register.validator";
import { loginUser, registerUser, verifyLogin2fa } from "./auth.service";
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
    // 2FA
    if (result.ok && "requires2FA" in result && result.requires2FA) {
      return NextResponse.json({
        ok: true,
        requires2FA: true,
        preAuthToken: result.preAuthToken,
        message: result.message
      }, { status: 200 });
    }

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 401 });
    }

    const successResult = result as LoginSuccess;

    const response = NextResponse.json({ ok: true, user: successResult.user }, { status: 200 });
    await setSessionCookie(successResult.token);
    return response;
  } catch (error) {
    return NextResponse.json({ ok: false, message: "Error interno" }, { status: 500 });
  }
}

export async function verify2faController(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    const parsed = verify2faSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, errors: parsed.error.flatten() }, { status: 400 });
    }

    const { preAuthToken, code } = parsed.data;
    const decoded = readPreAuthToken(preAuthToken);

    if (!decoded) {
      return NextResponse.json({ ok: false, message: "Token de sesión expirado." }, { status: 401 });
    }

    const result = await verifyLogin2fa(decoded.cedula, code);

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 401 });
    }

    const successResult = result as LoginSuccess;
    const response = NextResponse.json({ ok: true, user: successResult.user }, { status: 200 });
    
    await setSessionCookie(successResult.token);
    
    return response;
  } catch (error) {
    console.error("verify2faController error:", error);
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