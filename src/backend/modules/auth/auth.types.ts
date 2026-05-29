export type AuthRole = "Cliente" | "Barbero" | "Admin";

export type SessionUser = {
  cedula: string;
  email: string;
  nombre: string;
  rol: AuthRole;
};

export type LoginInput = {
  email: string;
  contrasena: string;
};

export type RegisterInput = {
  cedula: string;
  nombre: string;
  apellidos: string;
  telefono: string;
  email: string;
  contrasena: string;
};

export type LoginSuccess = {
  ok: true;
  user: SessionUser;
  token: string;
};

export type AuthFailure = {
  ok: false;
  message: string;
};

export type LoginResult = LoginSuccess | AuthFailure;

export type RegisterResult = { ok: true; user: SessionUser } | AuthFailure;