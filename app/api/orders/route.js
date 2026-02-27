import { NextResponse } from "next/server";
import {
  addOrderToStore,
  getOrdersFromStore,
  updateOrderInStore,
} from "@/lib/server-store";

const ORDER_STATUSES = ["Pending", "Preparing", "Completed", "Cancelled"];
const PAYMENT_METHODS = ["UPI", "Cash", "Card"];
const PAYMENT_STATUSES = ["Paid", "Pending", "Unpaid", "Failed"];
const MAX_TOTAL = 500000;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeDate = (value) => {
  const parsed = new Date(value).getTime();
  if (!Number.isFinite(parsed)) return new Date().toISOString();
  return new Date(parsed).toISOString();
};

const normalizeMobile = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  return /^\d{10}$/.test(digits) ? digits : "-";
};

const normalizeTableNo = (value) => {
  const cleaned = sanitizeText(value, 20).replace(/[^a-zA-Z0-9-]/g, "");
  return cleaned || "NA";
};

const normalizeStatus = (value) => {
  const status = sanitizeText(value, 20);
  return ORDER_STATUSES.includes(status) ? status : "Pending";
};

const normalizePaymentMethod = (value) => {
  const method = sanitizeText(value, 20);
  return PAYMENT_METHODS.includes(method) ? method : "UPI";
};

const normalizePaymentStatus = (value) => {
  const status = sanitizeText(value, 20);
  return PAYMENT_STATUSES.includes(status) ? status : "Pending";
};

const normalizeBoolean = (value) => Boolean(value);

const sanitizeOrderItem = (item) => {
  if (!item || typeof item !== "object") return null;

  const name = sanitizeText(item.name, 80);
  const qty = Math.max(1, Math.min(99, Math.floor(toNumber(item.qty || 1))));
  const price = Math.max(0, Math.min(MAX_TOTAL, toNumber(item.price)));
  const lineTotalInput = toNumber(item.lineTotal);
  const lineTotal = lineTotalInput > 0 ? lineTotalInput : price * qty;

  if (!name || lineTotal <= 0) return null;

  return {
    id: sanitizeText(item.id, 64) || undefined,
    name,
    qty,
    price,
    lineTotal,
  };
};

const sanitizeOrderPayload = (payload, options = {}) => {
  const { requireItems = false } = options;
  if (!payload || typeof payload !== "object") {
    return { error: "Order payload must be an object" };
  }

  const id = sanitizeText(payload.id, 64);
  if (!id) return { error: "Order id is required" };

  const items = (Array.isArray(payload.items) ? payload.items : [])
    .map((item) => sanitizeOrderItem(item))
    .filter(Boolean);

  if (requireItems && items.length === 0) {
    return { error: "At least one valid order item is required" };
  }

  const totalFromItems = items.reduce((sum, item) => sum + toNumber(item.lineTotal), 0);
  const requestedTotal = toNumber(payload.total);
  const total = requestedTotal > 0 ? requestedTotal : totalFromItems;
  if (requireItems && (total <= 0 || total > MAX_TOTAL)) {
    return { error: "Order total must be between 0 and 500000" };
  }

  const order = {
    id,
    tableNo: normalizeTableNo(payload.tableNo),
    customerName: sanitizeText(payload.customerName, 80) || "Walk-in",
    customerMobile: normalizeMobile(
      payload.customerMobile || payload.mobile || payload.phone
    ),
    items,
    total: Math.max(0, Math.min(MAX_TOTAL, total)),
    status: normalizeStatus(payload.status),
    paymentStatus: normalizePaymentStatus(payload.paymentStatus),
    paymentMethod: normalizePaymentMethod(payload.paymentMethod),
    paymentId: sanitizeText(payload.paymentId, 64) || "-",
    time: normalizeDate(payload.time),
    invoiceId: sanitizeText(payload.invoiceId, 64),
    invoiceGeneratedAt: payload.invoiceGeneratedAt
      ? normalizeDate(payload.invoiceGeneratedAt)
      : "",
    completedAt: payload.completedAt ? normalizeDate(payload.completedAt) : "",
    paymentTransferred: normalizeBoolean(payload.paymentTransferred),
    paymentTransferredAt: payload.paymentTransferredAt
      ? normalizeDate(payload.paymentTransferredAt)
      : "",
  };

  return { order };
};

const sortByLatest = (orders) =>
  [...orders].sort(
    (a, b) => new Date(b?.time || 0).getTime() - new Date(a?.time || 0).getTime()
  );

export async function GET() {
  try {
    const orders = await getOrdersFromStore();
    const normalized = (Array.isArray(orders) ? orders : [])
      .map((order) => sanitizeOrderPayload(order).order)
      .filter(Boolean);
    return NextResponse.json(sortByLatest(normalized));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { order, error } = sanitizeOrderPayload(payload, { requireItems: true });
    if (error) {
      return NextResponse.json(
        { error },
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
    const id = sanitizeText(body?.id, 64);
    if (!id) {
      return NextResponse.json(
        { error: "Order id is required" },
        { status: 400 }
      );
    }

    const updates = {};

    if (Object.prototype.hasOwnProperty.call(body || {}, "status")) {
      const status = sanitizeText(body?.status, 20);
      if (!ORDER_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed values: ${ORDER_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = status;
      if (status === "Completed") {
        updates.completedAt = normalizeDate(body?.completedAt);
      }
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentStatus")) {
      const paymentStatus = sanitizeText(body?.paymentStatus, 20);
      if (!PAYMENT_STATUSES.includes(paymentStatus)) {
        return NextResponse.json(
          { error: `Invalid payment status. Allowed values: ${PAYMENT_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.paymentStatus = paymentStatus;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentMethod")) {
      updates.paymentMethod = normalizePaymentMethod(body?.paymentMethod);
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentId")) {
      updates.paymentId = sanitizeText(body?.paymentId, 64) || "-";
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "invoiceId")) {
      updates.invoiceId = sanitizeText(body?.invoiceId, 64);
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "invoiceGeneratedAt")) {
      updates.invoiceGeneratedAt = body?.invoiceGeneratedAt
        ? normalizeDate(body.invoiceGeneratedAt)
        : "";
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "completedAt")) {
      updates.completedAt = body?.completedAt ? normalizeDate(body.completedAt) : "";
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentTransferred")) {
      updates.paymentTransferred = normalizeBoolean(body?.paymentTransferred);
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentTransferredAt")) {
      updates.paymentTransferredAt = body?.paymentTransferredAt
        ? normalizeDate(body.paymentTransferredAt)
        : "";
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const updated = await updateOrderInStore(id, updates);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const normalizedUpdated = sanitizeOrderPayload(updated).order || updated;
    return NextResponse.json(normalizedUpdated);
  } catch {
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}
