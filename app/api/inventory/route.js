import { NextResponse } from "next/server";
import {
  addInventoryItemToStore,
  deleteInventoryItemFromStore,
  getInventoryFromStore,
  updateInventoryItemInStore,
} from "@/lib/server-store";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value) => String(value || "").trim();

const sanitizeInventoryItem = (item, index = 0) => {
  const normalized = item && typeof item === "object" ? item : {};

  return {
    id: normalizeText(normalized.id) || `inv-${Date.now()}-${index}`,
    name: normalizeText(normalized.name),
    category: normalizeText(normalized.category),
    currentStock: Math.max(0, toNumber(normalized.currentStock)),
    minStock: Math.max(0, toNumber(normalized.minStock)),
    unit: normalizeText(normalized.unit) || "kg",
    pricePerUnit: Math.max(0, toNumber(normalized.pricePerUnit)),
    supplier: normalizeText(normalized.supplier),
    lastUpdated: normalized.lastUpdated || new Date().toISOString(),
  };
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
    const item = sanitizeInventoryItem(payload);

    if (!item.name || !item.category) {
      return NextResponse.json(
        { error: "Name and category are required" },
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
    const id = normalizeText(payload?.id);
    if (!id) {
      return NextResponse.json(
        { error: "Inventory id is required" },
        { status: 400 }
      );
    }

    const updates = sanitizeInventoryItem({ ...payload, id });
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
