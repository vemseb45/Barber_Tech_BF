import { NextRequest, NextResponse } from "next/server";
import { requestResetSchema, resetPasswordSchema } from "./recovery.validator";
import { processResetRequest, executePasswordReset } from "./recovery.service";
import type { RequestResetDto, ResetPasswordDto } from "./recovery.dto";

async function readJsonBody(req: NextRequest) {
  const text = await req.text();
  if (!text) return null;
  return JSON.parse(text);
}

export async function requestResetController(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    const parsed = requestResetSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Datos inválidos", errors: parsed.error.flatten() }, { status: 400 });
    }

    const data: RequestResetDto = parsed.data;

    await processResetRequest(data);
    
    return NextResponse.json({ 
      ok: true, 
      message: "Si el usuario existe, recibirás un correo con las instrucciones en breve." 
    }, { status: 200 });

  } catch (error) {
    console.error("requestResetController error:", error);
    return NextResponse.json({ ok: false, message: "Error interno del servidor" }, { status: 500 });
  }
}

export async function resetPasswordController(req: NextRequest) {
  try {
    const body = await readJsonBody(req);
    const parsed = resetPasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ ok: false, message: "Datos inválidos", errors: parsed.error.flatten() }, { status: 400 });
    }

    const data: ResetPasswordDto = parsed.data;

    const result = await executePasswordReset(data);

    if (!result.ok) {
      return NextResponse.json({ ok: false, message: result.message }, { status: 400 });
    }

    return NextResponse.json({ ok: true, message: result.message }, { status: 200 });

  } catch (error) {
    console.error("resetPasswordController error:", error);
    return NextResponse.json({ ok: false, message: "Error interno del servidor" }, { status: 500 });
  }
}