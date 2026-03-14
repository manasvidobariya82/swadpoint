import { NextResponse } from "next/server";
import {
  createSessionToken,
  getSessionCookieOptions,
  SESSION_COOKIE_NAME,
  toSafeUser,
  verifyPassword,
} from "@/lib/auth";
import { findUserByIdentifierInStore } from "@/lib/server-store";

export const runtime = "nodejs";

const normalizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

export async function POST(request) {
  try {
    const payload = await request.json();
    const identifier = normalizeText(payload?.identifier, 120);
    const password = String(payload?.password || "");

    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    const user = await findUserByIdentifierInStore(identifier);
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
