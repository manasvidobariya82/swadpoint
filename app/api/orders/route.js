import { NextResponse } from "next/server";
import {
  addOrderToStore,
  getOrdersFromStore,
  updateOrderInStore,
} from "@/lib/server-store";

const sortByLatest = (orders) =>
  [...orders].sort(
    (a, b) => new Date(b?.time || 0).getTime() - new Date(a?.time || 0).getTime()
  );

export async function GET() {
  try {
    const orders = await getOrdersFromStore();
    return NextResponse.json(sortByLatest(orders));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const order = await request.json();
    if (!order || typeof order !== "object" || !order.id) {
      return NextResponse.json(
        { error: "Invalid order payload" },
        { status: 400 }
      );
    }

    const saved = await addOrderToStore(order);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const id = String(body?.id || "").trim();
    const status = String(body?.status || "").trim();

    if (!id || !status) {
      return NextResponse.json(
        { error: "Order id and status are required" },
        { status: 400 }
      );
    }

    const updated = await updateOrderInStore(id, { status });
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
