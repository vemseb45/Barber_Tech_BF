export type LoginPayload = {
  email: string;
  contrasena: string;
};

type ValidationResult =
  | {
      ok: true;
      data: LoginPayload;
    }
  | {
      ok: false;
      message: string;
    };

export function validateLoginPayload(body: unknown): ValidationResult {
  if (!body || typeof body !== "object") {
    return {
      ok: false,
      message: "El cuerpo de la solicitud es inválido.",
    };
  }

  const { email, contrasena } = body as Record<string, unknown>;

  if (typeof email !== "string" || typeof contrasena !== "string") {
    return {
      ok: false,
      message: "El correo y la contraseña deben ser texto.",
    };
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedContrasena = contrasena.trim();

  if (!normalizedEmail || !normalizedContrasena) {
    return {
      ok: false,
      message: "Debes completar el correo y la contraseña.",
    };
  }

  return {
    ok: true,
    data: {
      email: normalizedEmail,
      contrasena: normalizedContrasena,
    },
  };
}