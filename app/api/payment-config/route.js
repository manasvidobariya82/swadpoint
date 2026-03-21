import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const DEFAULT_CONFIG = {
  upiId: "swadpoint@upi",
  payeeName: "SwadPoint Restaurant",
};

const sanitizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const UPI_ID_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;

const toApiConfig = (row) => ({
  upiId: sanitizeText(row?.upi_id, 80) || DEFAULT_CONFIG.upiId,
  payeeName: sanitizeText(row?.payee_name, 80) || DEFAULT_CONFIG.payeeName,
});

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT upi_id, payee_name
       FROM payment_settings
       WHERE id = 1`
    );

    return NextResponse.json(
      result.rows[0] ? toApiConfig(result.rows[0]) : DEFAULT_CONFIG
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment config" },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    await ensureCoreTables();

    const body = await request.json();
    const upiId = sanitizeText(body?.upiId, 80) || DEFAULT_CONFIG.upiId;
    const payeeName = sanitizeText(body?.payeeName, 80) || DEFAULT_CONFIG.payeeName;

    if (!UPI_ID_REGEX.test(upiId)) {
      return NextResponse.json(
        { error: "Enter valid UPI ID" },
        { status: 400 }
      );
    }

    if (payeeName.length < 2) {
      return NextResponse.json(
        { error: "Payee name must be at least 2 characters" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `INSERT INTO payment_settings (id, upi_id, payee_name, updated_at)
       VALUES (1, $1, $2, NOW())
       ON CONFLICT (id)
       DO UPDATE SET
         upi_id = EXCLUDED.upi_id,
         payee_name = EXCLUDED.payee_name,
         updated_at = NOW()
       RETURNING upi_id, payee_name`,
      [upiId, payeeName]
    );

    return NextResponse.json(toApiConfig(result.rows[0]));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to save payment config" },
      { status: 500 }
    );
  }
}
