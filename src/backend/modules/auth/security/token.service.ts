import jwt from "jsonwebtoken";
import type { SessionUser } from "../auth.types";
import { AUTH_SESSION_HOURS, AUTH_TOKEN_SECRET } from "../auth.constants";

export function createToken(payload: SessionUser): string {
  const secret = AUTH_TOKEN_SECRET as string;
  return jwt.sign(payload, secret, {
    expiresIn: `${AUTH_SESSION_HOURS}h`,
  });
}

export function readToken(token: string): SessionUser | null {
  try {
    const secret = AUTH_TOKEN_SECRET as string;
    const decoded = jwt.verify(token, secret) as SessionUser & { iat?: number; exp?: number };
    const { iat, exp, ...user } = decoded;
    return user as SessionUser;
  } catch {
    return null;
  }
}