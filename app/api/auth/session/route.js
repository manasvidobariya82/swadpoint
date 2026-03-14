import { NextResponse } from "next/server";
import {
  getSessionCookieOptions,
  parseSessionToken,
  SESSION_COOKIE_NAME,
} from "@/lib/auth";

export const runtime = "nodejs";

const expiredCookieOptions = {
  ...getSessionCookieOptions(),
  maxAge: 0,
};

export async function GET(request) {
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const session = parseSessionToken(token);

  if (!session) {
    const response = NextResponse.json(
      { error: "Not authenticated" },
      { status: 401 }
    );
    response.cookies.set(SESSION_COOKIE_NAME, "", expiredCookieOptions);
    return response;
  }

  return NextResponse.json({
    user: {
      id: session.sub,
      username: session.username,
      email: session.email,
    },
  });
}
