import pool from "@/lib/db";

export const runtime = "nodejs";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_ROLES = ["user", "admin"];

const toText = (value, max = 120) =>
  String(value || "")
    .trim()
    .slice(0, max);

export async function GET() {
  try {
    const result = await pool.query(
      "SELECT id, name, email, role FROM users ORDER BY id DESC"
    );

    return Response.json({
      success: true,
      data: result.rows,
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
    const body = await request.json();

    const name = toText(body?.name, 100);
    const email = toText(body?.email, 100).toLowerCase();
    const password = toText(body?.password, 100);
    const roleInput = toText(body?.role, 20).toLowerCase();
    const role = ALLOWED_ROLES.includes(roleInput) ? roleInput : "user";

    if (!name) {
      return Response.json(
        { success: false, error: "User name is required" },
        { status: 400 }
      );
    }

    if (!email || !EMAIL_REGEX.test(email)) {
      return Response.json(
        { success: false, error: "Valid email is required" },
        { status: 400 }
      );
    }

    if (!password || password.length < 6) {
      return Response.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role",
      [name, email, password, role]
    );

    return Response.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (err) {
    if (err?.code === "23505") {
      return Response.json(
        { success: false, error: "Email already exists" },
        { status: 409 }
      );
    }

    return Response.json(
      { success: false, error: err.message || "Failed to create user" },
      { status: 500 }
    );
  }
}
