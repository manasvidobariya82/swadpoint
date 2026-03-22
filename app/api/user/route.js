import { randomUUID } from "crypto";
import pool from "@/lib/db";
import { hashPassword, shouldGrantAdminRole } from "@/lib/auth";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const SPECIAL_CHAR_REGEX = /[@$!%*?&]/;

const toText = (value, max = 120) =>
  String(value || "")
    .trim()
    .slice(0, max);

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT id, username, email, role, created_at, last_login_at
       FROM app_users
       ORDER BY created_at DESC`
    );

    return Response.json({
      success: true,
      data: result.rows.map((row) => ({
        id: row.id,
        username: row.username,
        email: row.email,
        role: row.role,
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
      })),
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureCoreTables();

    const body = await request.json();

    const username = toText(body?.username ?? body?.name, 30);
    const email = toText(body?.email, 100).toLowerCase();
    const password = String(body?.password || "");

    if (!username) {
      return Response.json(
        { success: false, error: "Username is required" },
        { status: 400 }
      );
    }

    if (username.length < 3 || !USERNAME_REGEX.test(username)) {
      return Response.json(
        {
          success: false,
          error:
            "Username must be at least 3 characters and use only letters, numbers, and underscore",
        },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return Response.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 8) {
      return Response.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/\d/.test(password) ||
      !SPECIAL_CHAR_REGEX.test(password)
    ) {
      return Response.json(
        {
          success: false,
          error:
            "Password must include uppercase, lowercase, number, and special character",
        },
        { status: 400 }
      );
    }

    const adminCountResult = await pool.query(
      `SELECT COUNT(*)::int AS count
       FROM app_users
       WHERE LOWER(TRIM(COALESCE(role, 'customer'))) = 'admin'`
    );

    const role = shouldGrantAdminRole({
      username,
      email,
      existingAdminCount: adminCountResult.rows[0]?.count ?? 0,
    })
      ? "admin"
      : "customer";

    const result = await pool.query(
      `INSERT INTO app_users (id, username, email, role, password_hash, created_at)
       VALUES ($1, $2, $3, $4, $5, NOW())
       RETURNING id, username, email, role, created_at, last_login_at`,
      [randomUUID(), username, email, role, hashPassword(password)]
    );

    return Response.json(
      {
        success: true,
        data: {
          id: result.rows[0].id,
          username: result.rows[0].username,
          email: result.rows[0].email,
          role: result.rows[0].role,
          createdAt: result.rows[0].created_at,
          lastLoginAt: result.rows[0].last_login_at,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    if (err?.code === "23505") {
      return Response.json(
        { success: false, error: "Username or email already exists" },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, error: err.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
