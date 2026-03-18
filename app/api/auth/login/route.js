import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  toSafeUser,
  verifyPassword,
} from "@/lib/auth";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const normalizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

export async function POST(request) {
  try {
    await ensureCoreTables();

    const payload = await request.json();
    const identifier = normalizeText(payload?.identifier, 120);
    const password = String(payload?.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `SELECT id, username, email, password_hash, created_at
       FROM app_users
       WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($1)
       ORDER BY created_at DESC
       LIMIT 1`,
      [identifier]
    );

    const row = result.rows[0];
    const user = row
      ? {
          id: row.id,
          username: row.username,
          email: row.email,
          passwordHash: row.password_hash,
          createdAt: row.created_at,
        }
      : null;

    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json(
        { error: "Invalid username/email or password" },
        { status: 401 }
      );
    }

    const token = createSessionToken(user);
    const response = NextResponse.json({ user: toSafeUser(user) });
    response.cookies.set(SESSION_COOKIE_NAME, token, getSessionCookieOptions());
    return response;
  } catch {
    return NextResponse.json({ error: "Failed to login" }, { status: 500 });
  }
}
