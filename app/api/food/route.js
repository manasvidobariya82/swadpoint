import pool from "@/lib/db";

export const runtime = "nodejs";

const toText = (value, max = 120) =>
  String(value || "")
    .trim()
    .slice(0, max);

const toPositiveInt = (value) => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0 ? num : NaN;
};

export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM food ORDER BY id DESC");

    return Response.json({
      success: true,
      data: result.rows,
    });
  } catch (err) {
    return Response.json(
      { success: false, error: err.message || "Failed to fetch food items" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    const name = toText(body?.name, 100);
    const price = toPositiveInt(body?.price);
    const image = toText(body?.image, 1000);

    if (!name) {
      return Response.json(
        { success: false, error: "Food name is required" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(price)) {
      return Response.json(
        { success: false, error: "Food price must be a positive integer" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "INSERT INTO food (name, price, image) VALUES ($1, $2, $3) RETURNING *",
      [name, price, image]
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
      { success: false, error: err.message || "Failed to create food item" },
      { status: 500 }
    );
  }
}
