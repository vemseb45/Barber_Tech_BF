import jwt from "jsonwebtoken";
import { AUTH_TOKEN_SECRET, AUTH_SESSION_HOURS } from "../auth.constants";
import type { SessionUser } from "../auth.types";

export function generateToken(payload: SessionUser): string {
  return jwt.sign(payload, AUTH_TOKEN_SECRET, {
    expiresIn: `${AUTH_SESSION_HOURS}h`,
  });
}

export function readToken(token: string): SessionUser | null {
  try {
    return jwt.verify(token, AUTH_TOKEN_SECRET) as SessionUser;
  } catch (error) {
    return null;
  }
}