import { cookies } from "next/headers";
import { AUTH_COOKIE_NAME } from "@/backend/modules/auth/auth.constants";
import { readToken } from "@/backend/modules/auth/security/token.service";
import type { SessionUser } from "@/backend/modules/auth/auth.types";

export async function getSessionUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();

  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  const session = readToken(token);

  if (!session) {
    return null;
  }

  return session;
}