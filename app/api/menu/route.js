import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

const MENU_CATEGORIES = ["Main Course", "Starter", "Dessert", "Beverage"];
const MAX_MENU_NAME_LENGTH = 80;
const MAX_MENU_DESCRIPTION_LENGTH = 240;
const MAX_MENU_PRICE = 100000;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeText = (value, maxLength) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeCategory = (value) => {
  const category = String(value || "").trim();
  return MENU_CATEGORIES.includes(category) ? category : "Main Course";
};

const normalizeDate = (value) => {
  const parsed = new Date(value).getTime();
  if (!Number.isFinite(parsed)) return new Date().toISOString();
  return new Date(parsed).toISOString();
};

const sanitizeMenuItem = (item, index) => {
  if (!item || typeof item !== "object") return null;

  const name = sanitizeText(item.name, MAX_MENU_NAME_LENGTH);
  const description = sanitizeText(item.description, MAX_MENU_DESCRIPTION_LENGTH);
  const category = normalizeCategory(item.category);
  const price = toNumber(item.price);

  if (name.length < 2) return null;
  if (price <= 0 || price > MAX_MENU_PRICE) return null;

  return {
    id: sanitizeText(item.id, 64) || `menu-item-${Date.now()}-${index}`,
    name,
    description,
    category,
    price,
    createdAt: normalizeDate(item.createdAt),
  };
};

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => sanitizeMenuItem(item, index))
    .filter(Boolean);
};

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT id, name, description, category, price, created_at
       FROM menu_items
       ORDER BY created_at ASC, id ASC`
    );

    const payload = result.rows.map((row) =>
      sanitizeMenuItem(
        {
          id: String(row.id),
          name: row.name,
          description: row.description,
          category: row.category,
          price: Number(row.price),
          createdAt: row.created_at,
        },
        0
      )
    );

    return NextResponse.json(payload.filter(Boolean));
  } catch {
    return NextResponse.json({ error: "Failed to fetch menu" }, { status: 500 });
  }
}

export async function PUT(request) {
  try {
    const payload = await request.json();
    if (!Array.isArray(payload)) {
      return NextResponse.json(
        { error: "Menu payload must be an array" },
        { status: 400 }
      );
    }

    const menuItems = sanitizeMenuItems(payload);
    if (payload.length > 0 && menuItems.length === 0) {
      return NextResponse.json(
        { error: "No valid menu items found in payload" },
        { status: 400 }
      );
    }

    await ensureCoreTables();

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM menu_items");

      for (const item of menuItems) {
        await client.query(
          `INSERT INTO menu_items (name, description, category, price, created_at)
           VALUES ($1, $2, $3, $4, $5)`,
          [item.name, item.description, item.category, item.price, item.createdAt]
        );
      }

      await client.query("COMMIT");
    } catch (error) {
      await client.query("ROLLBACK").catch(() => {});
      throw error;
    } finally {
      client.release();
    }

    const result = await pool.query(
      `SELECT id, name, description, category, price, created_at
       FROM menu_items
       ORDER BY created_at ASC, id ASC`
    );

    const saved = result.rows
      .map((row) =>
        sanitizeMenuItem(
          {
            id: String(row.id),
            name: row.name,
            description: row.description,
            category: row.category,
            price: Number(row.price),
            createdAt: row.created_at,
          },
          0
        )
      )
      .filter(Boolean);

    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}
