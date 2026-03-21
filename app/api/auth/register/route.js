import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  hashPassword,
  SESSION_COOKIE_NAME,
  toSafeUser,
} from "@/lib/auth";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const SPECIAL_CHAR_REGEX = /[@$!%*?&]/;

const normalizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const validatePayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "Invalid request payload";
  }

  const username = normalizeText(payload.username, 30);
  const email = normalizeText(payload.email, 120).toLowerCase();
  const password = String(payload.password || "");

  if (!username) return "Username is required";
  if (username.length < 3) return "Username must be at least 3 characters";
  if (!USERNAME_REGEX.test(username)) {
    return "Username can contain only letters, numbers, and underscore";
  }

  if (!email) return "Email is required";
  if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";

  if (!password) return "Password is required";
  if (password.length < 8) return "Password must be at least 8 characters";
  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter";
  }
  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter";
  }
  if (!/\d/.test(password)) {
    return "Password must contain at least one number";
  }
  if (!SPECIAL_CHAR_REGEX.test(password)) {
    return "Password must contain at least one special character (@$!%*?&)";
  }

  return null;
};

export async function POST(request) {
  try {
    await ensureCoreTables();

    const payload = await request.json();
    const validationError = validatePayload(payload);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const user = {
      id: randomUUID(),
      username: normalizeText(payload.username, 30),
      email: normalizeText(payload.email, 120).toLowerCase(),
      passwordHash: hashPassword(payload.password),
      createdAt: new Date().toISOString(),
    };

    let createdUser;
    try {
      const result = await pool.query(
        `INSERT INTO app_users (id, username, email, password_hash, created_at)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, username, email, password_hash, created_at`,
        [user.id, user.username, user.email, user.passwordHash, user.createdAt]
      );

      const row = result.rows[0];
      createdUser = {
        id: row.id,
        username: row.username,
        email: row.email,
        passwordHash: row.password_hash,
        createdAt: row.created_at,
      };
    } catch (error) {
      if (error?.code === "23505") {
        return NextResponse.json(
          { error: "Username or email already exists" },
          { status: 409 }
        );
      }
      throw error;
    }

    const token = createSessionToken(createdUser);
    const response = NextResponse.json(
      { user: toSafeUser(createdUser) },
      { status: 201 }
    );
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch (error) {
    console.error("POST /api/auth/register failed", error);

    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
