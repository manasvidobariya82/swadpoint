"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadInvoice, printInvoice } from "@/helper/invoice";
import { getOrders, saveOrders } from "@/helper/storage";

const PAYMENT_METHODS = ["UPI", "Cash", "Card"];
const PAYMENT_STATUSES = ["Paid", "Pending", "Unpaid", "Failed"];
const DASHBOARD_REFRESH_INTERVAL_MS = 5000;
const WORKFLOW_STEPS = ["Pending", "Preparing", "Completed"];

const fetchOrdersFromApi = async () => {
  const response = await fetch("/api/orders", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

const updateOrder = async (id, payload) => {
  const response = await fetch("/api/orders", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...(payload || {}) }),
  });
  if (!response.ok) throw new Error("Failed to update order");
  return response.json();
};

const fetchPaymentsFromApi = async () => {
  const response = await fetch("/api/payments", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch payments");
  return response.json();
};

const createPaymentFromOrder = async (payload) => {
  const response = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create payment");
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

const normalizeOrderStatus = (value) => {
  const status = normalizeText(value, 20).toLowerCase();
  if (status === "completed") return "Completed";
  if (status === "preparing") return "Preparing";
  if (status === "cancelled") return "Cancelled";
  if (status === "pending") return "Pending";
  return "Pending";
};

const normalizePaymentMethod = (value) =>
  PAYMENT_METHODS.includes(value) ? value : "UPI";

const normalizePaymentStatus = (value) =>
  PAYMENT_STATUSES.includes(value) ? value : "Pending";

const formatDateTime = (value) => {
  const timestamp = toTimestamp(value);
  if (!timestamp) return "-";
  return new Date(timestamp).toLocaleString();
};

const getStatusPillClasses = (status) => {
  if (status === "Completed") return "bg-emerald-100 text-emerald-700";
  if (status === "Preparing") return "bg-blue-100 text-blue-700";
  if (status === "Cancelled") return "bg-red-100 text-red-700";
  return "bg-amber-100 text-amber-700";
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
    status: normalizeOrderStatus(order.status),
    paymentMethod: normalizePaymentMethod(normalizeText(order.paymentMethod, 20)),
    paymentStatus: normalizePaymentStatus(normalizeText(order.paymentStatus, 20) || "Pending"),
    paymentId: normalizeText(order.paymentId, 64) || "-",
    time: toTimestamp(order.time) ? new Date(order.time).toISOString() : new Date().toISOString(),
    invoiceId: normalizeText(order.invoiceId, 64),
    invoiceGeneratedAt: toTimestamp(order.invoiceGeneratedAt)
      ? new Date(order.invoiceGeneratedAt).toISOString()
      : "",
    completedAt: toTimestamp(order.completedAt)
      ? new Date(order.completedAt).toISOString()
      : "",
    paymentTransferred: Boolean(order.paymentTransferred),
    paymentTransferredAt: toTimestamp(order.paymentTransferredAt)
      ? new Date(order.paymentTransferredAt).toISOString()
      : "",
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
  const invoiceId =
    normalizeText(normalizedOrder?.invoiceId, 64) ||
    `INV-${String(normalizedOrder?.id || Date.now()).replace(/[^\w-]/g, "")}`;

  return {
    invoiceId,
    orderId: normalizedOrder?.id || "-",
    paymentId: normalizedOrder?.paymentId || "-",
    issuedAt:
      normalizedOrder?.invoiceGeneratedAt ||
      normalizedOrder?.completedAt ||
      normalizedOrder?.time ||
      new Date().toISOString(),
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

const buildPaymentPayloadFromOrder = (order, invoice) => {
  const normalizedOrder = sanitizeOrder(order) || {};
  const paymentId =
    normalizeText(normalizedOrder.paymentId, 64) && normalizedOrder.paymentId !== "-"
      ? normalizedOrder.paymentId
      : `PAY-${normalizedOrder.id}`;

  return {
    id: paymentId,
    orderId: normalizedOrder.id,
    customerName: normalizedOrder.customerName || "Walk-in",
    customerMobile: normalizedOrder.customerMobile || "-",
    tableNo: normalizedOrder.tableNo || "NA",
    amount: toNumber(normalizedOrder.total),
    paymentMethod: normalizedOrder.paymentMethod || "UPI",
    status: "success",
    timestamp: new Date().toISOString(),
    transactionId: `${(normalizedOrder.paymentMethod || "UPI").toUpperCase()}-${normalizedOrder.id}`,
    items: (Array.isArray(normalizedOrder.items) ? normalizedOrder.items : []).map(
      (item) => `${item.name || "Item"} x${Math.max(1, toNumber(item.qty || 1))}`
    ),
    invoiceId: normalizeText(invoice?.invoiceId, 64),
  };
};

export default function OrdersPage() {
  const [orders, setOrders] = useState(() => mergeOrders([], getOrders()));
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

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
    const intervalId = window.setInterval(loadOrders, DASHBOARD_REFRESH_INTERVAL_MS);
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
  const preparingCount = useMemo(
    () => orders.filter((order) => order.status === "Preparing").length,
    [orders]
  );
  const completedCount = useMemo(
    () => orders.filter((order) => order.status === "Completed").length,
    [orders]
  );

  const handleSyncNow = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    try {
      await loadOrders();
    } finally {
      setIsSyncing(false);
    }
  };

  const markPreparing = async (id) => {
    if (actionLoadingId) return;
    const normalizedId = normalizeId(id);
    if (!normalizedId) return;

    const targetOrder = orders.find((order) => order.id === normalizedId);
    if (!targetOrder) return;
    if (targetOrder.status === "Preparing") return;
    if (targetOrder.status === "Completed" || targetOrder.status === "Cancelled") {
      return;
    }

    try {
      setActionLoadingId(normalizedId);
      await updateOrder(normalizedId, { status: "Preparing" });
      await loadOrders();
    } catch {
      alert("Could not update order status. Please retry.");
    } finally {
      setActionLoadingId("");
    }
  };

  const markCompleted = async (id) => {
    if (actionLoadingId) return;
    const normalizedId = normalizeId(id);
    if (!normalizedId) return;

    const targetOrder = orders.find((order) => order.id === normalizedId);
    if (!targetOrder) return;
    if (targetOrder.status === "Completed" || targetOrder.status === "Cancelled") {
      return;
    }

    try {
      setActionLoadingId(normalizedId);
      const completedAt = new Date().toISOString();
      const completedOrder = sanitizeOrder(
        await updateOrder(normalizedId, {
          status: "Completed",
          paymentStatus: "Paid",
          completedAt,
        })
      );

      if (completedOrder) {
        const invoice = buildInvoiceFromOrder(completedOrder);
        const existingPayments = await fetchPaymentsFromApi();
        const existingPayment = (Array.isArray(existingPayments) ? existingPayments : []).find(
          (payment) =>
            normalizeId(payment?.orderId) === completedOrder.id ||
            (normalizeId(completedOrder.paymentId) &&
              completedOrder.paymentId !== "-" &&
              normalizeId(payment?.id) === completedOrder.paymentId)
        );

        const nowIso = new Date().toISOString();
        const paymentPayload = buildPaymentPayloadFromOrder(completedOrder, invoice);

        if (!existingPayment) {
          const createdPayment = await createPaymentFromOrder(paymentPayload);
          await updateOrder(completedOrder.id, {
            paymentId: normalizeId(createdPayment?.id) || paymentPayload.id,
            paymentStatus: "Paid",
            paymentTransferred: true,
            paymentTransferredAt: nowIso,
            invoiceId: invoice.invoiceId,
            invoiceGeneratedAt: nowIso,
          });
        } else {
          const patchPayload = {};
          const existingPaymentId = normalizeId(existingPayment.id);
          if (!completedOrder.paymentId || completedOrder.paymentId === "-") {
            patchPayload.paymentId = existingPaymentId || paymentPayload.id;
          }
          if (!completedOrder.paymentTransferred) {
            patchPayload.paymentTransferred = true;
          }
          if (!completedOrder.paymentTransferredAt) {
            patchPayload.paymentTransferredAt = nowIso;
          }
          if (!completedOrder.invoiceGeneratedAt || !completedOrder.invoiceId) {
            patchPayload.invoiceId = invoice.invoiceId;
            patchPayload.invoiceGeneratedAt = nowIso;
          }

          if (Object.keys(patchPayload).length > 0) {
            await updateOrder(completedOrder.id, patchPayload);
          }
        }
      }

      await loadOrders();
    } catch {
      alert("Could not complete order. Please retry.");
      await loadOrders();
    } finally {
      setActionLoadingId("");
    }
  };

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
            type="button"
            onClick={() => void handleSyncNow()}
            disabled={isSyncing}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSyncing ? "Syncing..." : "Sync Now"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border bg-white p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
            Total Orders
          </p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-700">
            Pending
          </p>
          <p className="mt-1 text-3xl font-bold text-amber-700">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-blue-700">
            Preparing
          </p>
          <p className="mt-1 text-3xl font-bold text-blue-700">{preparingCount}</p>
        </div>
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 shadow-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
            Completed
          </p>
          <p className="mt-1 text-3xl font-bold text-emerald-700">{completedCount}</p>
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
          {orders.map((order) => {
            const workflowIndex = WORKFLOW_STEPS.indexOf(order.status);
            const statusIndex = workflowIndex >= 0 ? workflowIndex : 0;
            const invoice = buildInvoiceFromOrder(order);

            return (
              <div
                key={order.id}
                className="rounded-2xl border bg-white p-4 shadow-sm sm:p-5"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      Order #{order.id}
                    </p>
                    <p className="mt-1 text-sm text-gray-600">
                      Table {order.tableNo || "NA"} | {order.customerName || "Walk-in"}
                    </p>
                    <p className="text-xs text-gray-500">{formatDateTime(order.time)}</p>
                    <p className="mt-2 text-sm font-semibold text-gray-900">
                      Total: Rs. {toNumber(order.total || 0).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusPillClasses(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                      {order.paymentStatus || "Paid"} | {order.paymentMethod || "UPI"}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-gray-200 p-3">
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                    Order Workflow
                  </p>
                  <div className="grid gap-2 sm:grid-cols-3">
                    {WORKFLOW_STEPS.map((step, index) => {
                      const isReached = statusIndex >= index;
                      const isCurrent = order.status === step;
                      return (
                        <div
                          key={`${order.id}-${step}`}
                          className={`rounded-lg border px-3 py-2 text-xs font-semibold ${
                            isCurrent
                              ? "border-blue-300 bg-blue-50 text-blue-700"
                              : isReached
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                              : "border-gray-200 bg-gray-50 text-gray-500"
                          }`}
                        >
                          {step}
                        </div>
                      );
                    })}
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
                        <p className="sm:col-span-2 sm:text-center">
                          x{Math.max(1, toNumber(item.qty || 1))}
                        </p>
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

                <div className="mt-4 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Order Action
                    </p>
                    <div className="mt-2">
                      {order.status === "Pending" && (
                        <button
                          type="button"
                          onClick={() => markPreparing(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {actionLoadingId === order.id ? "Updating..." : "Preparing"}
                        </button>
                      )}

                      {order.status === "Preparing" && (
                        <button
                          type="button"
                          onClick={() => markCompleted(order.id)}
                          disabled={actionLoadingId === order.id}
                          className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {actionLoadingId === order.id
                            ? "Updating..."
                            : "Mark As Completed"}
                        </button>
                      )}

                      {order.status === "Completed" && (
                        <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
                          Order completed successfully.
                        </p>
                      )}

                      {order.status === "Cancelled" && (
                        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700">
                          Order cancelled.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                      Invoice
                    </p>
                    {order.status === "Completed" ? (
                      <div className="mt-2 space-y-2">
                        <p className="text-xs text-gray-500">
                          {invoice.invoiceId} | {formatDateTime(invoice.issuedAt)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const success = printInvoice(invoice);
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
                            onClick={() => downloadInvoice(invoice)}
                            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
                          >
                            Download Invoice
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="mt-2 rounded-lg bg-gray-50 px-3 py-2 text-sm text-gray-500">
                        Invoice will be available after order is marked completed.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
