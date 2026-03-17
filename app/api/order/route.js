import pool from "@/lib/db";

export const runtime = "nodejs";

const ALLOWED_STATUSES = ["pending", "confirmed", "completed", "cancelled"];

const toPositiveInt = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : NaN;
};

const toPositiveOrZeroInt = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num >= 0 ? num : NaN;
};

const toText = (value, max = 20) =>
  String(value || "")
    .trim()
    .slice(0, max)
    .toLowerCase();

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM orders ORDER BY id DESC");

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const userid = toPositiveInt(body?.userid);
    const total = toPositiveOrZeroInt(body?.total);
    const statusInput = toText(body?.status, 20);
    const status = ALLOWED_STATUSES.includes(statusInput)
      ? statusInput
      : "pending";

    if (!Number.isInteger(userid)) {
      return Response.json(
        { success: false, error: "userid must be a positive integer" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(total)) {
      return Response.json(
        { success: false, error: "total must be zero or a positive integer" },
        { status: 400 }
      );
    }

    const userCheck = await pool.query("SELECT id FROM users WHERE id = $1", [userid]);
    if (userCheck.rowCount === 0) {
      return Response.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    const result = await pool.query(
      "INSERT INTO orders (userid, total, status) VALUES ($1, $2, $3) RETURNING *",
      [userid, total, status]
    );

    return Response.json(
      {
        success: true,
        data: result.rows[0],
      },
      { status: 201 }
    );
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
