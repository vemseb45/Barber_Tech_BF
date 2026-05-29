import crypto from "crypto";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: process.env.SMTP_SECURE === "true", 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false }
});

export function generateSecureOtp(): string {
  return crypto.randomInt(100000, 999999).toString();
}

export function hashOtp(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Soporte" <no-reply@barbertech.com>',
    to,
    subject: "Código de Verificación 2FA - Barber Tech",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>Verificación de Seguridad (2FA)</h2>
        <p>Tu código de acceso es: <strong style="font-size:24px; color: #000;">${otp}</strong></p>
        <p>Este código expirará en 5 minutos. Nunca lo compartas.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error enviando correo 2FA a", to, ":", error);
  }
}

export function verifyEmailOtp(plainTextCode: string, hashedCode: string, expiresAt: Date): boolean {
  if (new Date() > expiresAt) return false;
  const hashOfInput = hashOtp(plainTextCode);
  return crypto.timingSafeEqual(Buffer.from(hashOfInput, "hex"), Buffer.from(hashedCode, "hex"));
}