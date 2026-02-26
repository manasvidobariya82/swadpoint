import { NextResponse } from "next/server";
import { getMenuFromStore, replaceMenuInStore } from "@/lib/server-store";

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `menu-item-${index}`,
      name: String(item.name || "").trim(),
      description: String(item.description || "").trim(),
      category: String(item.category || "").trim() || "Main Course",
      price: Number(item.price) || 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }))
    .filter((item) => item.name);
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
    const menuItems = sanitizeMenuItems(payload);
    const saved = await replaceMenuInStore(menuItems);
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Failed to save menu" }, { status: 500 });
  }
}
