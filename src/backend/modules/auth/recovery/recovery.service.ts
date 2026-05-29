import { findUserByEmail } from "../auth.repository";
import { createResetToken, findToken, markTokenAsUsed, updateUserPassword } from "./recovery.repository";
import { sendPasswordResetEmail } from "./security/email-recovery.service";
import { hashPassword } from "@/backend/shared/password";
import type { RequestResetDto, ResetPasswordDto } from "./recovery.dto";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL;

export async function processResetRequest(input: RequestResetDto): Promise<void> {
  const user = await findUserByEmail(input.email);
  
  if (!user || user.estado !== "Activo") return;

  const tokenRecord = await createResetToken(user.cedula);

  const resetLink = `${APP_URL}/recovery/reset?token=${tokenRecord.token}`;
  await sendPasswordResetEmail(user.email, resetLink);
}

export async function executePasswordReset(input: ResetPasswordDto): Promise<{ ok: boolean; message: string }> {
  const tokenRecord = await findToken(input.token);

  if (!tokenRecord) {
    return { ok: false, message: "El enlace de recuperación es inválido." };
  }

  if (tokenRecord.usado) {
    return { ok: false, message: "Este enlace de recuperación ya fue utilizado." };
  }

  const expirationLimit = new Date(tokenRecord.creado_en.getTime() + 15 * 60 * 1000);
  if (new Date() > expirationLimit) {
    return { ok: false, message: "El enlace de recuperación ha expirado." };
  }

  const newPasswordHash = await hashPassword(input.newPassword);

  await updateUserPassword(tokenRecord.usuario_id, newPasswordHash);
  await markTokenAsUsed(tokenRecord.id_token);

  return { ok: true, message: "Contraseña actualizada exitosamente." };
}