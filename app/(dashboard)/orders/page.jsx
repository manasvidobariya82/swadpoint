"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadInvoice, printInvoice } from "@/helper/invoice";
import { getOrders, saveOrders } from "@/helper/storage";

const ORDER_STATUSES = ["Pending", "Completed", "Cancelled"];
const PAYMENT_METHODS = ["UPI", "Cash", "Card"];
const PAYMENT_STATUSES = ["Paid", "Pending", "Unpaid", "Failed"];

const fetchOrdersFromApi = async () => {
  const response = await fetch("/api/orders", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

const updateOrderStatus = async (id, status) => {
  const response = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, status }),
  });
  if (!response.ok) throw new Error("Failed to update order");
  return response.json();
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const toTimestamp = (value) => {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeId = (value) => String(value || "").trim();

const normalizeMobile = (value) => {
  const digits = String(value || "").replace(/\D/g, "").slice(0, 10);
  return /^\d{10}$/.test(digits) ? digits : "-";
};

const normalizeOrderStatus = (value) =>
  ORDER_STATUSES.includes(value) ? value : "Pending";

const normalizePaymentMethod = (value) =>
  PAYMENT_METHODS.includes(value) ? value : "UPI";

const normalizePaymentStatus = (value) =>
  PAYMENT_STATUSES.includes(value) ? value : "Paid";

const formatDateTime = (value) => {
  const timestamp = toTimestamp(value);
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
};

const sanitizeOrderItem = (item, index) => {
  if (!item || typeof item !== "object") return null;

  const name = normalizeText(item.name, 80);
  const qty = Math.max(1, Math.min(99, Math.floor(toNumber(item.qty || 1))));
  const price = Math.max(0, toNumber(item.price));
  const lineTotalInput = toNumber(item.lineTotal);
  const lineTotal = lineTotalInput > 0 ? lineTotalInput : price * qty;

  if (!name || lineTotal <= 0) return null;

  return {
    id: normalizeText(item.id, 64) || `item-${index}`,
    name,
    qty,
    price,
    lineTotal,
  };
};

const sanitizeOrder = (order) => {
  if (!order || typeof order !== "object") return null;

  const id = normalizeId(order.id);
  if (!id) return null;

  const items = (Array.isArray(order.items) ? order.items : [])
    .map((item, index) => sanitizeOrderItem(item, index))
    .filter(Boolean);

  const totalFromItems = items.reduce(
    (sum, item) => sum + toNumber(item.lineTotal),
    0
  );
  const total = Math.max(toNumber(order.total), totalFromItems);

  return {
    ...order,
    id,
    tableNo: normalizeText(order.tableNo, 20) || "NA",
    customerName: normalizeText(order.customerName, 80) || "Walk-in",
    customerMobile: normalizeMobile(order.customerMobile || order.mobile || order.phone),
    status: normalizeOrderStatus(normalizeText(order.status, 20)),
    paymentMethod: normalizePaymentMethod(normalizeText(order.paymentMethod, 20)),
    paymentStatus: normalizePaymentStatus(normalizeText(order.paymentStatus, 20)),
    paymentId: normalizeText(order.paymentId, 64) || "-",
    time: toTimestamp(order.time) ? new Date(order.time).toISOString() : new Date().toISOString(),
    items,
    total,
  };
};

const mergeOrders = (current, incoming) => {
  const mergedById = new Map();

  (Array.isArray(current) ? current : []).forEach((order) => {
    const normalized = sanitizeOrder(order);
    const id = normalizeId(normalized?.id);
    if (!id) return;
    mergedById.set(id, normalized);
  });

  (Array.isArray(incoming) ? incoming : []).forEach((order) => {
    const normalized = sanitizeOrder(order);
    const id = normalizeId(normalized?.id);
    if (!id) return;
    mergedById.set(id, {
      ...(mergedById.get(id) || {}),
      ...normalized,
    });
  });

  return Array.from(mergedById.values()).sort(
    (a, b) => toTimestamp(b?.time) - toTimestamp(a?.time)
  );
};

const buildInvoiceFromOrder = (order) => {
  const normalizedOrder = sanitizeOrder(order) || {};
  const items = Array.isArray(normalizedOrder?.items) ? normalizedOrder.items : [];
  const totalFromItems = items.reduce(
    (sum, item) => sum + toNumber(item?.lineTotal || toNumber(item?.price) * toNumber(item?.qty || 1)),
    0
  );
  const totalAmount = toNumber(normalizedOrder?.total || totalFromItems);
  const invoiceId = `INV-${String(normalizedOrder?.id || Date.now()).replace(/[^\w-]/g, "")}`;

  return {
    invoiceId,
    orderId: normalizedOrder?.id || "-",
    paymentId: normalizedOrder?.paymentId || "-",
    issuedAt: normalizedOrder?.time || new Date().toISOString(),
    tableNo: normalizedOrder?.tableNo || "NA",
    customerName: normalizedOrder?.customerName || "Walk-in",
    customerMobile: normalizedOrder?.customerMobile || "-",
    paymentMethod: normalizedOrder?.paymentMethod || "-",
    paymentStatus: normalizedOrder?.paymentStatus || "-",
    orderStatus: normalizedOrder?.status || "-",
    totalAmount,
    items: items.map((item) => {
      const qty = Math.max(1, toNumber(item?.qty || 1));
      const lineTotal = toNumber(item?.lineTotal || 0);
      const unitPrice = lineTotal > 0 ? lineTotal / qty : toNumber(item?.price || 0);
      return {
        name: item?.name || "Item",
        qty,
        unitPrice,
        lineTotal: lineTotal > 0 ? lineTotal : unitPrice * qty,
      };
    }),
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(() => mergeOrders([], getOrders()));
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadOrders = async () => {
    try {
      const list = await fetchOrdersFromApi();
      setOrders((prev) => {
        const merged = mergeOrders(prev, list);
        saveOrders(merged);
        return merged;
      });
    } catch {
      const cached = getOrders();
      if (cached.length > 0) {
        setOrders(mergeOrders([], cached));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders();
    }, 0);
    const intervalId = window.setInterval(loadOrders, 10000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    saveOrders(orders);
  }, [orders]);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "Pending").length,
    [orders]
  );

  const markCompleted = async (id) => {
    if (actionLoadingId) return;
    const normalizedId = normalizeId(id);
    if (!normalizedId) return;

    const targetOrder = orders.find((order) => order.id === normalizedId);
    if (!targetOrder || targetOrder.status === "Completed") return;

    try {
      setActionLoadingId(normalizedId);
      await updateOrderStatus(normalizedId, "Completed");
      await loadOrders();
    } finally {
      setActionLoadingId("");
    }
  };

  const completedCount = orders.length - pendingCount;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="mt-1 text-sm text-gray-600">
              Live order tracking with invoice actions.
            </p>
          </div>
          <button
            onClick={loadOrders}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sync Now
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Orders</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Pending</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{pendingCount}</p>
        </div>
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Completed</p>
          <p className="mt-1 text-2xl font-bold text-emerald-600">{completedCount}</p>
        </div>
      </div>

      {!loading && orders.length === 0 ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          No orders yet.
        </div>
      ) : loading ? (
        <div className="rounded-2xl border bg-white p-10 text-center text-sm text-gray-500 shadow-sm">
          Loading orders...
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order.id}
              className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-semibold text-gray-900">Order #{order.id}</p>
                  <p className="text-sm text-gray-600">
                    Table {order.tableNo || "NA"} | {order.customerName || "Walk-in"}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatDateTime(order.time)}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      order.status === "Completed"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                    {order.paymentStatus || "Paid"} | {order.paymentMethod || "UPI"}
                  </span>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-gray-200">
                <div className="hidden grid-cols-12 border-b bg-gray-50 px-3 py-2 text-xs font-semibold text-gray-600 sm:grid">
                  <p className="col-span-7">Item</p>
                  <p className="col-span-2 text-center">Qty</p>
                  <p className="col-span-3 text-right">Amount</p>
                </div>
                <div className="divide-y">
                  {(Array.isArray(order.items) ? order.items : []).map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="grid gap-1 px-3 py-2 text-sm text-gray-700 sm:grid-cols-12 sm:items-center"
                    >
                      <p className="sm:col-span-7">{item.name || "Item"}</p>
                      <p className="sm:col-span-2 sm:text-center">x{Math.max(1, toNumber(item.qty || 1))}</p>
                      <p className="font-medium sm:col-span-3 sm:text-right">
                        Rs. {toNumber(item.lineTotal ?? item.price ?? 0).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="border-t px-3 py-2 text-right text-sm font-semibold text-gray-900">
                  Total: Rs. {toNumber(order.total || 0).toFixed(2)}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const success = printInvoice(buildInvoiceFromOrder(order));
                    if (!success) {
                      alert("Please allow popups to print invoice.");
                    }
                  }}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Print Invoice
                </button>
                <button
                  type="button"
                  onClick={() => downloadInvoice(buildInvoiceFromOrder(order))}
                  className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                >
                  Download Invoice
                </button>

                {order.status !== "Completed" && (
                  <button
                    onClick={() => markCompleted(order.id)}
                    disabled={actionLoadingId === order.id}
                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {actionLoadingId === order.id ? "Updating..." : "Mark Completed"}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
