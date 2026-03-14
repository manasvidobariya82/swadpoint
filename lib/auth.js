import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "crypto";

export const SESSION_COOKIE_NAME = "sp_session";
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
const HASH_PREFIX = "scrypt";

const getAuthSecret = () => process.env.AUTH_SECRET || "swadpoint-dev-secret";

const toBase64Url = (value) => Buffer.from(value).toString("base64url");
const fromBase64Url = (value) => Buffer.from(value, "base64url").toString("utf8");

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const sign = (value) =>
  createHmac("sha256", getAuthSecret()).update(value).digest("base64url");

export const hashPassword = (password) => {
  const normalizedPassword = String(password || "");
  const salt = randomBytes(16).toString("hex");
  const derived = scryptSync(normalizedPassword, salt, 64).toString("hex");
  return `${HASH_PREFIX}$${salt}$${derived}`;
};

export const verifyPassword = (password, storedHash) => {
  const [prefix, salt, expectedHash] = String(storedHash || "").split("$");
  if (!prefix || !salt || !expectedHash) return false;
  if (prefix !== HASH_PREFIX) return false;

  const derivedHash = scryptSync(String(password || ""), salt, 64).toString("hex");
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");
  if (expectedBuffer.length !== derivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, derivedBuffer);
};

export const createSessionToken = (user) => {
  const now = Date.now();
  const payload = {
    sub: user.id,
    username: user.username,
    email: user.email,
    iat: now,
    exp: now + SESSION_DURATION_MS,
  };

  const encodedPayload = toBase64Url(JSON.stringify(payload));
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
};

export const parseSessionToken = (token) => {
  const [encodedPayload, signature] = String(token || "").split(".");
  if (!encodedPayload || !signature) return null;

  const expectedSignature = sign(encodedPayload);
  const givenBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);
  if (givenBuffer.length !== expectedBuffer.length) return null;
  if (!timingSafeEqual(givenBuffer, expectedBuffer)) return null;

  const payload = safeJsonParse(fromBase64Url(encodedPayload));
  if (!payload || typeof payload !== "object") return null;
  if (!payload.exp || payload.exp < Date.now()) return null;
  return payload;
};

export const getSessionCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  maxAge: Math.floor(SESSION_DURATION_MS / 1000),
});

export const toSafeUser = (user) => ({
  id: user.id,
  username: user.username,
  email: user.email,
  createdAt: user.createdAt,
});
