import pool from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
  try {
    const result = await pool.query("SELECT NOW()");

    return Response.json({
      success: true,
      message: "Database connected successfully ✅",
      time: result.rows[0],
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: error.message,
    });
  }
}
