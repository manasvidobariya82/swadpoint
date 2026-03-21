import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

export const runtime = "nodejs";

const sanitizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeTableNo = (value) => {
  const digits = sanitizeText(value, 8).replace(/\D/g, "");
  if (!digits) return "";

  const parsed = Number(digits);
  if (!Number.isInteger(parsed) || parsed <= 0) return "";
  return String(parsed);
};

const toApiTable = (row) => ({
  id: sanitizeText(row?.id, 64),
  tableNo: normalizeTableNo(row?.table_no),
  createdAt: row?.created_at || new Date().toISOString(),
});

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT id, table_no, created_at
       FROM dining_tables
       ORDER BY table_no::integer ASC, created_at ASC`
    );

    return NextResponse.json(
      (Array.isArray(result.rows) ? result.rows : []).map((row) => toApiTable(row))
    );
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tables" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    await ensureCoreTables();

    const body = await request.json();
    const tableNo = normalizeTableNo(body?.tableNo);
    if (!tableNo) {
      return NextResponse.json(
        { error: "Valid table number is required" },
        { status: 400 }
      );
    }

    const id = sanitizeText(body?.id, 64) || `table-${Date.now()}`;

    const result = await pool.query(
      `INSERT INTO dining_tables (id, table_no)
       VALUES ($1, $2)
       RETURNING id, table_no, created_at`,
      [id, tableNo]
    );

    return NextResponse.json(toApiTable(result.rows[0]), { status: 201 });
  } catch (error) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Table already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to create table" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    await ensureCoreTables();

    const { searchParams } = new URL(request.url);
    const id = sanitizeText(searchParams.get("id"), 64);
    if (!id) {
      return NextResponse.json(
        { error: "Table id is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      `DELETE FROM dining_tables
       WHERE id = $1
       RETURNING id, table_no, created_at`,
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }

    return NextResponse.json(toApiTable(result.rows[0]));
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete table" },
      { status: 500 }
    );
  }
}
