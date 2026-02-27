import { NextResponse } from "next/server";
import { addPaymentToStore, getPaymentsFromStore } from "@/lib/server-store";

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

export async function GET() {
  try {
    const payments = await getPaymentsFromStore();
    const normalized = (Array.isArray(payments) ? payments : [])
      .map((payment) => sanitizePaymentPayload(payment).payment)
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

    const existingPayments = await getPaymentsFromStore();
    const duplicate = (Array.isArray(existingPayments) ? existingPayments : []).find(
      (existingPayment) =>
        existingPayment?.id === payment.id ||
        (payment.orderId && existingPayment?.orderId === payment.orderId)
    );
    if (duplicate) {
      return NextResponse.json(duplicate);
    }

    const saved = await addPaymentToStore(payment);
    return NextResponse.json(saved, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save payment" },
      { status: 500 }
    );
  }
}
