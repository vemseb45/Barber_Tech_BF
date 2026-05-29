import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 465,
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: { rejectUnauthorized: false }
});

export async function sendPasswordResetEmail(to: string, resetLink: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_FROM || '"Soporte" <no-reply@barbertech.com>',
    to,
    subject: "Recuperación de Contraseña - Barber Tech",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
        <h2 style="color: #000;">Recuperación de Contraseña</h2>
        <p>Hemos recibido una solicitud para restablecer tu contraseña en <strong>Barber Tech</strong>.</p>
        <p>Haz clic en el siguiente enlace para crear una nueva contraseña. Este enlace <strong>expirará en 15 minutos</strong> por razones de seguridad.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetLink}" style="background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Restablecer Contraseña</a>
        </div>
        <p style="font-size: 12px; color: #777;">Si no solicitaste este cambio, puedes ignorar este correo. Tu cuenta seguirá segura.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error enviando correo de recuperación a", to, ":", error);
  }
}