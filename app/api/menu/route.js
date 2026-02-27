import { NextResponse } from "next/server";
import { getMenuFromStore, replaceMenuInStore } from "@/lib/server-store";

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
  const price = toNumber(item.price);

  if (name.length < 2) return null;
  if (price <= 0 || price > MAX_MENU_PRICE) return null;

  return {
    id: sanitizeText(item.id, 64) || `menu-item-${index}`,
    name,
    description: sanitizeText(item.description, MAX_MENU_DESCRIPTION_LENGTH),
    category: normalizeCategory(item.category),
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
    const menuItems = await getMenuFromStore();
    return NextResponse.json(sanitizeMenuItems(menuItems));
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

    const saved = await replaceMenuInStore(menuItems);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}
