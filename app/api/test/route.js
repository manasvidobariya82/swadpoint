import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

export async function GET() {
  try {
    await ensureCoreTables();

    const [timeResult, usersResult] = await Promise.all([
      pool.query("SELECT NOW()"),
      pool.query("SELECT COUNT(*)::int AS count FROM app_users"),
    ]);

    return Response.json({
      success: true,
      message: "Database connected successfully",
      time: timeResult.rows[0],
      usersCount: usersResult.rows[0]?.count ?? 0,
    });
  } catch (error) {
    console.error("GET /api/test failed", error);

    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
