import { NextResponse } from "next/server";
import {
  addInventoryItemToStore,
  deleteInventoryItemFromStore,
  getInventoryFromStore,
  updateInventoryItemInStore,
} from "@/lib/server-store";

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

const sanitizeInventoryList = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item, index) => sanitizeInventoryItem(item, index))
    .filter((item) => item.name);

const sortByLatest = (items) =>
  [...items].sort(
    (a, b) =>
      new Date(b?.lastUpdated || 0).getTime() -
      new Date(a?.lastUpdated || 0).getTime()
  );

export async function GET() {
  try {
    const inventory = await getInventoryFromStore();
    return NextResponse.json(sortByLatest(sanitizeInventoryList(inventory)));
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

    const saved = await addInventoryItemToStore(item);
    return NextResponse.json(saved, { status: 201 });
  } catch {
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

    const updated = await updateInventoryItemInStore(id, updates);
    if (!updated) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

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

    const deleted = await deleteInventoryItemFromStore(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Inventory item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete inventory item" },
      { status: 500 }
    );
  }
}
