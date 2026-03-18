import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { ensureCoreTables } from "@/lib/db-schema";

const PAYMENT_STATUSES = ["success", "pending", "failed"];
const PAYMENT_METHODS = ["UPI", "Cash", "Card"];
const MAX_PAYMENT_AMOUNT = 500000;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeDate = (value) => {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return new Date().toISOString();
  return new Date(timestamp).toISOString();
};

const sanitizePaymentPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return { error: "Payment payload must be an object" };
  }

  const id = sanitizeText(payload.id, 64);
  if (!id) return { error: "Payment id is required" };

  const amount = toNumber(payload.amount);
  if (amount <= 0 || amount > MAX_PAYMENT_AMOUNT) {
    return { error: `Amount must be between 0 and ${MAX_PAYMENT_AMOUNT}` };
  }

  const rawStatus = sanitizeText(payload.status, 20).toLowerCase();
  const rawMethod = sanitizeText(payload.paymentMethod, 20);

  const payment = {
    ...payload,
    id,
    orderId: sanitizeText(payload.orderId, 64),
    customerName: sanitizeText(payload.customerName, 80) || "Walk-in",
    customerMobile: sanitizeText(payload.customerMobile, 20) || "-",
    tableNo: sanitizeText(payload.tableNo, 20) || "NA",
    amount,
    paymentMethod: PAYMENT_METHODS.includes(rawMethod) ? rawMethod : "UPI",
    status: PAYMENT_STATUSES.includes(rawStatus) ? rawStatus : "pending",
    timestamp: normalizeDate(payload.timestamp),
    transactionId: sanitizeText(payload.transactionId, 80),
    upiId: sanitizeText(payload.upiId, 80),
    items: Array.isArray(payload.items)
      ? payload.items.map((item) => sanitizeText(item, 120)).filter(Boolean)
      : [],
  };

  return { payment };
};

const sortByLatest = (payments) =>
  [...payments].sort(
    (a, b) =>
      new Date(b?.timestamp || 0).getTime() - new Date(a?.timestamp || 0).getTime()
  );

const toApiPayment = (row) => {
  const items = Array.isArray(row.items) ? row.items : [];
  return sanitizePaymentPayload({
    id: row.id,
    orderId: row.order_id,
    customerName: row.customer_name,
    customerMobile: row.customer_mobile,
    tableNo: row.table_no,
    amount: Number(row.amount),
    paymentMethod: row.payment_method,
    status: row.status,
    timestamp: row.payment_timestamp,
    transactionId: row.transaction_id,
    upiId: row.upi_id,
    items,
  }).payment;
};

export async function GET() {
  try {
    await ensureCoreTables();

    const result = await pool.query(
      `SELECT id, order_id, customer_name, customer_mobile, table_no, amount,
              payment_method, status, payment_timestamp, transaction_id, upi_id, items
       FROM payments
       ORDER BY payment_timestamp DESC, created_at DESC`
    );

    const normalized = (Array.isArray(result.rows) ? result.rows : [])
      .map((row) => toApiPayment(row))
      .filter(Boolean);
    return NextResponse.json(sortByLatest(normalized));
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const payload = await request.json();
    const { payment, error } = sanitizePaymentPayload(payload);
    if (error) {
      return NextResponse.json(
        { error },
        { status: 400 }
      );
    }

    await ensureCoreTables();

    const duplicateResult = await pool.query(
      `SELECT id, order_id, customer_name, customer_mobile, table_no, amount,
              payment_method, status, payment_timestamp, transaction_id, upi_id, items
       FROM payments
       WHERE id = $1 OR ($2 <> '' AND order_id = $2)
       LIMIT 1`,
      [payment.id, payment.orderId]
    );

    const duplicate = duplicateResult.rows[0]
      ? toApiPayment(duplicateResult.rows[0])
      : null;

    if (duplicate) {
      return NextResponse.json(duplicate);
    }

    const insertResult = await pool.query(
      `INSERT INTO payments (
         id, order_id, customer_name, customer_mobile, table_no, amount,
         payment_method, status, payment_timestamp, transaction_id, upi_id, items
       ) VALUES (
         $1, $2, $3, $4, $5, $6,
         $7, $8, $9, $10, $11, $12::jsonb
       )
       RETURNING id, order_id, customer_name, customer_mobile, table_no, amount,
                 payment_method, status, payment_timestamp, transaction_id, upi_id, items`,
      [
        payment.id,
        payment.orderId,
        payment.customerName,
        payment.customerMobile,
        payment.tableNo,
        payment.amount,
        payment.paymentMethod,
        payment.status,
        payment.timestamp,
        payment.transactionId,
        payment.upiId,
        JSON.stringify(payment.items || []),
      ]
    );

    const saved = toApiPayment(insertResult.rows[0]);
    return NextResponse.json(saved, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") {
      return NextResponse.json(
        { error: "Payment already exists for this order" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to save payment" },
      { status: 500 }
    );
  }
}
