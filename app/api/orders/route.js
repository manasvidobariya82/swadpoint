import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";
import { syncLowStockAlert } from "@/lib/inventory-alerts";
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

const normalizeOptionalStatus = (value) => {
  const status = sanitizeText(value, 20);
  return ORDER_STATUSES.includes(status) ? status : "";
};

const normalizeOptionalMobile = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  return /^\d{10}$/.test(digits) ? digits : "";
};

const normalizeOptionalTableNo = (value) => {
  const cleaned = sanitizeText(value, 20).replace(/[^a-zA-Z0-9-]/g, "");
  return cleaned || "";
};

const normalizeInventoryKey = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();

const applyInventoryMovement = async ({
  client,
  orderId,
  items,
  movementType,
}) => {
  let appliedCount = 0;
  const normalizedItems = (Array.isArray(items) ? items : []).map((item) => ({
    name: sanitizeText(item?.name, 80),
    qty: Math.max(1, Math.floor(toNumber(item?.qty || 1))),
  }));

  for (const item of normalizedItems) {
    const inventoryKey = normalizeInventoryKey(item.name);
    if (!inventoryKey) continue;

    const inventoryResult = await client.query(
      `SELECT id, name, current_stock
       FROM inventory_items
       WHERE LOWER(REGEXP_REPLACE(TRIM(name), '\s+', ' ', 'g')) = $1
       ORDER BY last_updated DESC, id ASC
       LIMIT 1`,
      [inventoryKey],
    );

    if (inventoryResult.rowCount === 0) continue;

    const inventoryItem = inventoryResult.rows[0];
    const previousStock = Number(inventoryItem.current_stock || 0);
    const nextStock =
      movementType === "restore"
        ? previousStock + item.qty
        : Math.max(0, previousStock - item.qty);

    await client.query(
      `UPDATE inventory_items
       SET current_stock = $1,
           last_updated = NOW()
       WHERE id = $2`,
      [nextStock, inventoryItem.id],
    );

    const updatedInventoryResult = await client.query(
      `SELECT id, name, current_stock, min_stock
       FROM inventory_items
       WHERE id = $1
       LIMIT 1`,
      [inventoryItem.id],
    );

    if (updatedInventoryResult.rowCount > 0) {
      await syncLowStockAlert(client, updatedInventoryResult.rows[0]);
    }

    await client.query(
      `INSERT INTO inventory_movements (
         order_id, inventory_item_id, menu_item_name, quantity_change,
         stock_before, stock_after, movement_type, created_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())`,
      [
        orderId,
        inventoryItem.id,
        inventoryItem.name || item.name,
        movementType === "restore" ? item.qty : item.qty * -1,
        previousStock,
        nextStock,
        movementType,
      ],
    );

    appliedCount += 1;
  }

  return appliedCount;
};

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
  acceptedAt: orderRow.accepted_at || "",
  preparingAt: orderRow.preparing_at || "",
  invoiceId: orderRow.invoice_id || "",
  invoiceGeneratedAt: orderRow.invoice_generated_at || "",
  completedAt: orderRow.completed_at || "",
  cancelledAt: orderRow.cancelled_at || "",
  inventoryDeductedAt: orderRow.inventory_deducted_at || "",
  inventoryRestockedAt: orderRow.inventory_restocked_at || "",
  paymentTransferred: Boolean(orderRow.payment_transferred),
  paymentTransferredAt: orderRow.payment_transferred_at || "",
});

export async function GET(request) {
  try {
    await ensureCoreTables();

    const searchParams = request.nextUrl.searchParams;
    const filters = {
      id: sanitizeText(
        searchParams.get("id") || searchParams.get("orderId"),
        64,
      ),
      customerName: sanitizeText(searchParams.get("customerName"), 80),
      customerMobile: normalizeOptionalMobile(searchParams.get("customerMobile")),
      tableNo: normalizeOptionalTableNo(searchParams.get("tableNo")),
      status: normalizeOptionalStatus(searchParams.get("status")),
      limit: Math.min(
        200,
        Math.max(1, Number.parseInt(searchParams.get("limit") || "200", 10) || 200),
      ),
    };

    const whereClauses = [];
    const values = [];
    let index = 1;

    if (filters.id) {
      whereClauses.push(`id = $${index++}`);
      values.push(filters.id);
    }

    if (filters.customerName) {
      whereClauses.push(`LOWER(customer_name) LIKE LOWER($${index++})`);
      values.push(`%${filters.customerName}%`);
    }

    if (filters.customerMobile) {
      whereClauses.push(`customer_mobile = $${index++}`);
      values.push(filters.customerMobile);
    }

    if (filters.tableNo) {
      whereClauses.push(`table_no = $${index++}`);
      values.push(filters.tableNo);
    }

    if (filters.status) {
      whereClauses.push(`status = $${index++}`);
      values.push(filters.status);
    }

    values.push(filters.limit);
    const whereSql =
      whereClauses.length > 0 ? `WHERE ${whereClauses.join(" AND ")}` : "";

    const ordersResult = await pool.query(
      `SELECT id, table_no, customer_name, customer_mobile, total, status,
              payment_status, payment_method, payment_id, invoice_id,
              invoice_generated_at, accepted_at, preparing_at, completed_at,
              cancelled_at, inventory_deducted_at, inventory_restocked_at,
              payment_transferred,
              payment_transferred_at, created_at, order_time
       FROM orders
       ${whereSql}
       ORDER BY order_time DESC, created_at DESC
       LIMIT $${index}`,
      values,
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
         invoice_id, invoice_generated_at, accepted_at, preparing_at,
         completed_at, cancelled_at, inventory_deducted_at, inventory_restocked_at,
         payment_transferred,
         payment_transferred_at, updated_at, order_time
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11,
         $12, $13, $14, $15,
         $16, $17, $18, $19,
         $20, $21, NOW(), $22
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
        null,
        null,
        order.completedAt,
        null,
        null,
        null,
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

    const deductedItemCount = await applyInventoryMovement({
      client,
      orderId: order.id,
      items: order.items,
      movementType: "deduct",
    });

    if (deductedItemCount > 0) {
      await client.query(
        `UPDATE orders
         SET inventory_deducted_at = NOW(),
             updated_at = NOW()
         WHERE id = $1`,
        [order.id],
      );
    }

    await client.query("COMMIT");
    const savedOrderResult = await pool.query(
      `SELECT id, table_no, customer_name, customer_mobile, total, status,
              payment_status, payment_method, payment_id, invoice_id,
              invoice_generated_at, accepted_at, preparing_at, completed_at,
              cancelled_at, inventory_deducted_at, inventory_restocked_at,
              payment_transferred, payment_transferred_at, created_at, order_time
       FROM orders
       WHERE id = $1
       LIMIT 1`,
      [order.id],
    );

    const savedItemsResult = await pool.query(
      `SELECT order_id, item_id, item_name, quantity, price, name, qty, line_total, position
       FROM order_items
       WHERE order_id = $1
       ORDER BY position ASC, id ASC`,
      [order.id],
    );

    const savedItems = savedItemsResult.rows.map((row) => ({
      id: row.item_id || undefined,
      name: row.item_name || row.name || "Item",
      qty: Number(row.quantity || row.qty || 1),
      price: Number(row.price || 0),
      lineTotal: Number(
        row.line_total ||
          Number(row.price || 0) * Number(row.quantity || row.qty || 1),
      ),
    }));

    const savedOrder = toApiOrder(savedOrderResult.rows[0], savedItems);
    publishOrderEvent({
      type: "order.created",
      orderId: order.id,
    });

    return NextResponse.json(savedOrder, { status: 201 });
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
  const client = await pool.connect();

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

    await client.query("BEGIN");

    const existingOrderResult = await client.query(
      `SELECT id, status, payment_method, payment_status, accepted_at,
              preparing_at, completed_at, cancelled_at,
              inventory_deducted_at, inventory_restocked_at
       FROM orders
       WHERE id = $1
       LIMIT 1`,
      [id]
    );

    if (existingOrderResult.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const existingOrder = existingOrderResult.rows[0];
    const updates = {};
    const nowIso = new Date().toISOString();

    if (Object.prototype.hasOwnProperty.call(body || {}, "status")) {
      const status = sanitizeText(body?.status, 20);
      if (!ORDER_STATUSES.includes(status)) {
        return NextResponse.json(
          { error: `Invalid status. Allowed values: ${ORDER_STATUSES.join(", ")}` },
          { status: 400 }
        );
      }
      updates.status = status;
      if (status === "Preparing") {
        updates.acceptedAt = existingOrder.accepted_at || nowIso;
        updates.preparingAt = existingOrder.preparing_at || nowIso;
        updates.cancelledAt = null;
      }
      if (status === "Completed") {
        updates.acceptedAt = existingOrder.accepted_at || nowIso;
        updates.preparingAt = existingOrder.preparing_at || nowIso;
        updates.completedAt = body?.completedAt
          ? normalizeDate(body?.completedAt)
          : nowIso;
        updates.cancelledAt = null;
        if (
          !Object.prototype.hasOwnProperty.call(body || {}, "paymentStatus") &&
          normalizePaymentMethod(existingOrder.payment_method) === "Cash"
        ) {
          updates.paymentStatus = "Paid";
        }
      }
      if (status === "Cancelled") {
        updates.cancelledAt = nowIso;
        if (
          existingOrder.inventory_deducted_at &&
          !existingOrder.inventory_restocked_at
        ) {
          updates.inventoryRestockedAt = nowIso;
        }
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

    if (Object.prototype.hasOwnProperty.call(body || {}, "acceptedAt")) {
      updates.acceptedAt = body?.acceptedAt ? normalizeDate(body.acceptedAt) : null;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "preparingAt")) {
      updates.preparingAt = body?.preparingAt
        ? normalizeDate(body.preparingAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "cancelledAt")) {
      updates.cancelledAt = body?.cancelledAt
        ? normalizeDate(body.cancelledAt)
        : null;
    }

    if (Object.prototype.hasOwnProperty.call(body || {}, "inventoryRestockedAt")) {
      updates.inventoryRestockedAt = body?.inventoryRestockedAt
        ? normalizeDate(body.inventoryRestockedAt)
        : null;
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
      await client.query("ROLLBACK");
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
    if (Object.prototype.hasOwnProperty.call(updates, "acceptedAt")) {
      fields.push(`accepted_at = $${index++}`);
      values.push(updates.acceptedAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "preparingAt")) {
      fields.push(`preparing_at = $${index++}`);
      values.push(updates.preparingAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "completedAt")) {
      fields.push(`completed_at = $${index++}`);
      values.push(updates.completedAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "cancelledAt")) {
      fields.push(`cancelled_at = $${index++}`);
      values.push(updates.cancelledAt);
    }
    if (Object.prototype.hasOwnProperty.call(updates, "inventoryRestockedAt")) {
      fields.push(`inventory_restocked_at = $${index++}`);
      values.push(updates.inventoryRestockedAt);
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
                invoice_generated_at, accepted_at, preparing_at, completed_at,
                cancelled_at, inventory_deducted_at, inventory_restocked_at,
                payment_transferred,
                payment_transferred_at, created_at, order_time
    `;

    const updatedResult = await client.query(updateQuery, values);
    const orderRow = updatedResult.rows[0];

    const itemsResult = await client.query(
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

    if (
      updates.status === "Cancelled" &&
      existingOrder.inventory_deducted_at &&
      !existingOrder.inventory_restocked_at
    ) {
      await applyInventoryMovement({
        client,
        orderId: id,
        items,
        movementType: "restore",
      });
    }

    await client.query("COMMIT");

    const updatedOrder = toApiOrder(orderRow, items);
    publishOrderEvent({
      type: "order.updated",
      orderId: updatedOrder.id,
    });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    await client.query("ROLLBACK").catch(() => {});
    return NextResponse.json(
      { error: error.message || "Failed to update order" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
