export const AUTH_COOKIE_NAME = process.env.AUTH_COOKIE_NAME;

const sessionHours = Number(process.env.AUTH_SESSION_HOURS);

export const AUTH_SESSION_HOURS = Number.isNaN(sessionHours) ? 8 : sessionHours;

export const AUTH_SESSION_MAX_AGE = AUTH_SESSION_HOURS * 60 * 60;

const tokenSecret = process.env.NEXTAUTH_SECRET;

export const AUTH_TOKEN_SECRET = tokenSecret;

export const AUTH_COOKIE_SECURE = process.env.NODE_ENV === "production";

export const AUTH_COOKIE_SAME_SITE = "lax";

export const AUTH_COOKIE_PATH = "/";