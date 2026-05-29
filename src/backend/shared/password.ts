import { randomBytes, scrypt, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

const KEY_LENGTH = 64;
const SALT_LENGTH = 16;
const HASH_PREFIX = "scrypt";

export async function hashPassword(password: string) {
  const salt = randomBytes(SALT_LENGTH).toString("hex");

  const derivedKey = (await scryptAsync(
    password,
    salt,
    KEY_LENGTH
  )) as Buffer;

  return `${HASH_PREFIX}:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password: string, storedHash: string) {
  if (!isScryptHash(storedHash)) {
    return false;
  }

  const [, salt, key] = storedHash.split(":");

  const storedKey = Buffer.from(key, "hex");

  const derivedKey = (await scryptAsync(
    password,
    salt,
    storedKey.length
  )) as Buffer;

  if (storedKey.length !== derivedKey.length) {
    return false;
  }

  return timingSafeEqual(storedKey, derivedKey);
}

export function isScryptHash(value: string) {
  return /^scrypt:[a-f0-9]+:[a-f0-9]+$/i.test(value);
}