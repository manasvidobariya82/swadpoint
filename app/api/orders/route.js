import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";
import { publishOrderEvent } from "@/lib/order-events";

export const runtime = "nodejs";

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
    id: Number.isFinite(Number(item.id)) ? Number(item.id) : null,
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

  const id = sanitizeText(payload.id, 64) || `ORD-${Date.now()}`;

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
      : null,
    completedAt: payload.completedAt ? normalizeDate(payload.completedAt) : null,
    paymentTransferred: normalizeBoolean(payload.paymentTransferred),
    paymentTransferredAt: payload.paymentTransferredAt
      ? normalizeDate(payload.paymentTransferredAt)
      : null,
  };

  return { order };
};

const toApiOrder = (orderRow, itemRows) => ({
  id: orderRow.id,
  tableNo: orderRow.table_no || "NA",
  customerName: orderRow.customer_name || "Walk-in",
  customerMobile: orderRow.customer_mobile || "-",
  items: itemRows,
  total: Number(orderRow.total || 0),
  status: orderRow.status || "Pending",
  paymentStatus: orderRow.payment_status || "Pending",
  paymentMethod: orderRow.payment_method || "UPI",
  paymentId: orderRow.payment_id || "-",
  time: orderRow.order_time || orderRow.created_at,
  invoiceId: orderRow.invoice_id || "",
  invoiceGeneratedAt: orderRow.invoice_generated_at || "",
  completedAt: orderRow.completed_at || "",
  paymentTransferred: Boolean(orderRow.payment_transferred),
  paymentTransferredAt: orderRow.payment_transferred_at || "",
});

export async function GET() {
  try {
    await ensureCoreTables();

    const ordersResult = await pool.query(
      `SELECT id, table_no, customer_name, customer_mobile, total, status,
              payment_status, payment_method, payment_id, invoice_id,
              invoice_generated_at, completed_at, payment_transferred,
              payment_transferred_at, created_at, order_time
       FROM orders
       ORDER BY order_time DESC, created_at DESC`
    );

    const orders = ordersResult.rows;
    if (orders.length === 0) {
      return NextResponse.json([]);
    }

    const orderIds = orders.map((order) => order.id);
    const itemsResult = await pool.query(
      `SELECT order_id, item_id, item_name, quantity, price, name, qty, line_total, position
       FROM order_items
       WHERE order_id = ANY($1::text[])
       ORDER BY position ASC, id ASC`,
      [orderIds]
    );

    const itemsByOrderId = new Map();
    for (const row of itemsResult.rows) {
      const list = itemsByOrderId.get(row.order_id) || [];
      list.push({
        id: row.item_id || undefined,
        name: row.item_name || row.name || "Item",
        qty: Number(row.quantity || row.qty || 1),
        price: Number(row.price || 0),
        lineTotal: Number(row.line_total || Number(row.price || 0) * Number(row.quantity || row.qty || 1)),
      });
      itemsByOrderId.set(row.order_id, list);
    }

    const payload = orders.map((orderRow) =>
      toApiOrder(orderRow, itemsByOrderId.get(orderRow.id) || [])
    );

    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await ensureCoreTables();
  const client = await pool.connect();

  try {
    const payload = await request.json();
    const { order, error } = sanitizeOrderPayload(payload, { requireItems: true });
    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    await client.query("BEGIN");

    const tableNumberNumeric = Number.parseInt(order.tableNo, 10);

    await client.query(
      `INSERT INTO orders (
         id, table_number, order_type, status, payment_status, table_no,
         customer_name, customer_mobile, total, payment_method, payment_id,
         invoice_id, invoice_generated_at, completed_at, payment_transferred,
         payment_transferred_at, updated_at, order_time
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, $14, $15,
         $16, NOW(), $17
       )`,
      [
        order.id,
        Number.isFinite(tableNumberNumeric) ? tableNumberNumeric : null,
        "DINE_IN",
        order.status,
        order.paymentStatus,
        order.tableNo,
        order.customerName,
        order.customerMobile,
        order.total,
        order.paymentMethod,
        order.paymentId,
        order.invoiceId,
        order.invoiceGeneratedAt,
        order.completedAt,
        order.paymentTransferred,
        order.paymentTransferredAt,
        order.time,
      ]
    );

    for (let index = 0; index < order.items.length; index += 1) {
      const item = order.items[index];
      let itemId = item.id;

      if (Number.isFinite(itemId)) {
        const menuItemCheck = await client.query(
          "SELECT id FROM menu_items WHERE id = $1",
          [itemId]
        );
        if (menuItemCheck.rowCount === 0) {
          itemId = null;
        }
      } else {
        itemId = null;
      }

      await client.query(
        `INSERT INTO order_items (
           order_id, item_id, item_name, quantity, price, kitchen_status,
           name, qty, line_total, position
         ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          order.id,
          itemId,
          item.name,
          item.qty,
          item.price,
          "Pending",
          item.name,
          item.qty,
          item.lineTotal,
          index,
        ]
      );
    }

    await client.query("COMMIT");
    publishOrderEvent({
      type: "order.created",
      orderId: order.id,
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});

    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Order id already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: error.message }, { status: 500 });
  } finally {
    client.release();
  }
}

export async function PATCH(request) {
  try {
    await ensureCoreTables();

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
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "completedAt")) {
      updates.completedAt = body?.completedAt ? normalizeDate(body.completedAt) : null;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentTransferred")) {
      updates.paymentTransferred = normalizeBoolean(body?.paymentTransferred);
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "paymentTransferredAt")) {
      updates.paymentTransferredAt = body?.paymentTransferredAt
        ? normalizeDate(body.paymentTransferredAt)
        : null;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: "No valid fields provided for update" },
        { status: 400 }
      );
    }

    const fields = [];
    const values = [];
    let index = 1;

    if (Object.prototype.hasOwnProperty.call(updates, "status")) {
      fields.push(`status = $${index++}`);
      values.push(updates.status);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "paymentStatus")) {
      fields.push(`payment_status = $${index++}`);
      values.push(updates.paymentStatus);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "paymentMethod")) {
      fields.push(`payment_method = $${index++}`);
      values.push(updates.paymentMethod);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "paymentId")) {
      fields.push(`payment_id = $${index++}`);
      values.push(updates.paymentId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "invoiceId")) {
      fields.push(`invoice_id = $${index++}`);
      values.push(updates.invoiceId);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "invoiceGeneratedAt")) {
      fields.push(`invoice_generated_at = $${index++}`);
      values.push(updates.invoiceGeneratedAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "completedAt")) {
      fields.push(`completed_at = $${index++}`);
      values.push(updates.completedAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "paymentTransferred")) {
      fields.push(`payment_transferred = $${index++}`);
      values.push(updates.paymentTransferred);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "paymentTransferredAt")) {
      fields.push(`payment_transferred_at = $${index++}`);
      values.push(updates.paymentTransferredAt);
    }

    fields.push(`updated_at = NOW()`);

    values.push(id);
    const idParamIndex = index;

    const updateQuery = `
      UPDATE orders
      SET ${fields.join(", ")}
      WHERE id = $${idParamIndex}
      RETURNING id, table_no, customer_name, customer_mobile, total, status,
                payment_status, payment_method, payment_id, invoice_id,
                invoice_generated_at, completed_at, payment_transferred,
                payment_transferred_at, created_at, order_time
    `;

    const updatedResult = await pool.query(updateQuery, values);
    if (updatedResult.rowCount === 0) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const orderRow = updatedResult.rows[0];

    const itemsResult = await pool.query(
      `SELECT order_id, item_id, item_name, quantity, price, name, qty, line_total, position
       FROM order_items
       WHERE order_id = $1
       ORDER BY position ASC, id ASC`,
      [id]
    );

    const items = itemsResult.rows.map((row) => ({
      id: row.item_id || undefined,
      name: row.item_name || row.name || "Item",
      qty: Number(row.quantity || row.qty || 1),
      price: Number(row.price || 0),
      lineTotal: Number(row.line_total || Number(row.price || 0) * Number(row.quantity || row.qty || 1)),
    }));

    const updatedOrder = toApiOrder(orderRow, items);
    publishOrderEvent({
      type: "order.updated",
      orderId: updatedOrder.id,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  }
}
