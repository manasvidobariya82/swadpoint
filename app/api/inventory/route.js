import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";
import { syncLowStockAlert } from "@/lib/inventory-alerts";

const MAX_STOCK_VALUE = 999999;
const MAX_PRICE_PER_UNIT = 100000;
const MAX_TEXT_LENGTH = 80;
const ALLOWED_UNITS = ["kg", "gm", "ltr", "ml", "pcs", "pack", "bottle"];

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value, maxLength = MAX_TEXT_LENGTH) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeUnit = (value) => {
  const unit = normalizeText(value, 12).toLowerCase();
  return ALLOWED_UNITS.includes(unit) ? unit : "kg";
};

const normalizeWholeNumber = (value, max = MAX_STOCK_VALUE) =>
  Math.max(0, Math.min(max, Math.floor(toNumber(value))));

const normalizeAmount = (value, max = MAX_PRICE_PER_UNIT) =>
  Math.max(0, Math.min(max, toNumber(value)));

const sanitizeInventoryItem = (item, index = 0) => {
  const normalized = item && typeof item === "object" ? item : {};

  return {
    id: normalizeText(normalized.id) || `inv-${Date.now()}-${index}`,
    name: normalizeText(normalized.name),
    category: normalizeText(normalized.category),
    currentStock: normalizeWholeNumber(normalized.currentStock),
    minStock: normalizeWholeNumber(normalized.minStock),
    unit: normalizeUnit(normalized.unit),
    pricePerUnit: normalizeAmount(normalized.pricePerUnit),
    supplier: normalizeText(normalized.supplier),
    lastUpdated: normalized.lastUpdated || new Date().toISOString(),
  };
};

const validateInventoryItem = (item) => {
  if (!item.name || item.name.length < 2) {
    return "Name must be at least 2 characters";
  }
  if (!item.category || item.category.length < 2) {
    return "Category must be at least 2 characters";
  }
  if (!ALLOWED_UNITS.includes(item.unit)) {
    return `Unit must be one of: ${ALLOWED_UNITS.join(", ")}`;
  }
  if (item.currentStock < 0 || item.currentStock > MAX_STOCK_VALUE) {
    return `Current stock must be between 0 and ${MAX_STOCK_VALUE}`;
  }
  if (item.minStock < 0 || item.minStock > MAX_STOCK_VALUE) {
    return `Minimum stock must be between 0 and ${MAX_STOCK_VALUE}`;
  }
  if (item.pricePerUnit < 0 || item.pricePerUnit > MAX_PRICE_PER_UNIT) {
    return `Price per unit must be between 0 and ${MAX_PRICE_PER_UNIT}`;
  }
  return "";
};

const sortByLatest = (items) =>
  [...items].sort(
    (a, b) =>
      new Date(b?.lastUpdated || 0).getTime() -
      new Date(a?.lastUpdated || 0).getTime()
  );

const toApiInventoryItem = (row) =>
  sanitizeInventoryItem({
    id: row.id,
    name: row.name,
    category: row.category,
    currentStock: Number(row.current_stock),
    minStock: Number(row.min_stock),
    unit: row.unit,
    pricePerUnit: Number(row.price_per_unit),
    supplier: row.supplier,
    lastUpdated: row.last_updated,
  });

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT id, name, category, current_stock, min_stock, unit, price_per_unit,
              supplier, last_updated
       FROM inventory_items
       ORDER BY last_updated DESC, id ASC`
    );

    return NextResponse.json(
      sortByLatest(result.rows.map((row) => toApiInventoryItem(row)).filter(Boolean))
    );
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Inventory payload must be an object" },
        { status: 400 }
      );
    }

    const item = sanitizeInventoryItem(payload);
    const validationError = validateInventoryItem(item);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    await ensureCoreTables();

    const result = await pool.query(
      `INSERT INTO inventory_items (
         id, name, category, current_stock, min_stock, unit, price_per_unit,
         supplier, last_updated
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, name, category, current_stock, min_stock, unit, price_per_unit,
                 supplier, last_updated`,
      [
        item.id,
        item.name,
        item.category,
        item.currentStock,
        item.minStock,
        item.unit,
        item.pricePerUnit,
        item.supplier,
        item.lastUpdated,
      ]
    );

    const saved = toApiInventoryItem(result.rows[0]);
    await syncLowStockAlert(pool, {
      id: result.rows[0].id,
      name: result.rows[0].name,
      current_stock: result.rows[0].current_stock,
      min_stock: result.rows[0].min_stock,
    });
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Inventory id already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create inventory item" },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const payload = await request.json();
    if (!payload || typeof payload !== "object") {
      return NextResponse.json(
        { error: "Inventory payload must be an object" },
        { status: 400 }
      );
    }

    const id = normalizeText(payload?.id);
    if (!id) {
      return NextResponse.json(
        { error: "Inventory id is required" },
        { status: 400 }
      );
    }

    const updates = sanitizeInventoryItem({ ...payload, id });
    const validationError = validateInventoryItem(updates);
    if (validationError) {
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }

    await ensureCoreTables();

    const result = await pool.query(
      `UPDATE inventory_items
       SET name = $1,
           category = $2,
           current_stock = $3,
           min_stock = $4,
           unit = $5,
           price_per_unit = $6,
           supplier = $7,
           last_updated = $8
       WHERE id = $9
       RETURNING id, name, category, current_stock, min_stock, unit, price_per_unit,
                 supplier, last_updated`,
      [
        updates.name,
        updates.category,
        updates.currentStock,
        updates.minStock,
        updates.unit,
        updates.pricePerUnit,
        updates.supplier,
        updates.lastUpdated,
        id,
      ]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    const updated = toApiInventoryItem(result.rows[0]);
    await syncLowStockAlert(pool, {
      id: result.rows[0].id,
      name: result.rows[0].name,
      current_stock: result.rows[0].current_stock,
      min_stock: result.rows[0].min_stock,
    });
    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update inventory item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const payload = await request.json();
    const id = normalizeText(payload?.id);
    if (!id) {
      return NextResponse.json(
        { error: "Inventory id is required" },
        { status: 400 }
      );
    }

    await ensureCoreTables();

    const result = await pool.query(
      "DELETE FROM inventory_items WHERE id = $1 RETURNING id",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    await pool.query(
      "DELETE FROM low_stock_alerts WHERE inventory_item_id = $1",
      [id]
    );

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete inventory item" },
      { status: 500 }
    );
  }
}
