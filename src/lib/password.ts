import { scryptSync, timingSafeEqual } from "node:crypto";

const KEY_LENGTH = 64;

type StoredSecret = {
  salt: string;
  hash: string;
};

export function verifyPassword(password: string, salt: string, expectedHash: string) {
  const actual = scryptSync(password, salt, KEY_LENGTH);
  const expected = Buffer.from(expectedHash, "hex");
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(actual, expected);
}

export function readPasswordSecret(user: {
  password?: unknown;
  passwordHash?: unknown;
  passwordSalt?: unknown;
}): StoredSecret | null {
  const salt = typeof user.passwordSalt === "string" ? user.passwordSalt : "";
  const hash = typeof user.passwordHash === "string" ? user.passwordHash : "";

  if (salt && hash && !hash.includes(":")) {
    return { salt, hash };
  }

  const combined = hash.includes(":")
    ? hash
    : typeof user.password === "string" && user.password.includes(":")
      ? user.password
      : "";
  const [combinedSalt, combinedHash] = combined.split(":");
  if (!combinedSalt || !combinedHash) return null;
  return { salt: combinedSalt, hash: combinedHash };
}
