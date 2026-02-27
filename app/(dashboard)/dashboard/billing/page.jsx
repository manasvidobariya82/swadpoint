"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  getPaymentConfig,
  savePaymentConfig,
} from "@/helper/storage";
import { downloadInvoice, printInvoice } from "@/helper/invoice";

const PAYMENTS_CACHE_KEY = "swadpointBillingPaymentsCache";
const ORDERS_CACHE_KEY = "swadpointBillingOrdersCache";
const UPI_ID_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;
const PAYMENT_STATUSES = ["success", "pending", "failed"];
const STATUS_FILTER_OPTIONS = ["All", ...PAYMENT_STATUSES];
const PAYMENT_METHODS = ["UPI", "Cash", "Card"];
const MAX_PAYMENT_AMOUNT = 500000;
const MAX_PAYEE_NAME_LENGTH = 80;
const MAX_UPI_ID_LENGTH = 60;

const createUpiUrl = (upiId, payeeName, amount = 1) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${Number(amount).toFixed(2)}&cu=INR`;

const fetchPaymentsFromApi = async () => {
  const response = await fetch("/api/payments", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch payments");
  return response.json();
};

const fetchOrdersFromApi = async () => {
  const response = await fetch("/api/orders", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch orders");
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
const isValidUpiId = (value) => UPI_ID_REGEX.test(normalizeText(value, MAX_UPI_ID_LENGTH));
const normalizeDate = (value) => {
  const timestamp = toTimestamp(value);
  return timestamp ? new Date(timestamp).toISOString() : new Date().toISOString();
};

const sanitizePaymentRecord = (payment, index = 0) => {
  if (!payment || typeof payment !== "object") return null;

  const id = normalizeText(payment.id, 64) || `pay-${Date.now()}-${index}`;
  const statusRaw = normalizeText(payment.status, 20).toLowerCase();
  const status = PAYMENT_STATUSES.includes(statusRaw) ? statusRaw : "pending";
  const methodRaw = normalizeText(payment.paymentMethod, 20);
  const paymentMethod = PAYMENT_METHODS.includes(methodRaw) ? methodRaw : "UPI";
  const amount = Math.max(0, Math.min(MAX_PAYMENT_AMOUNT, toNumber(payment.amount)));

  return {
    ...payment,
    id,
    orderId: normalizeText(payment.orderId, 64),
    customerName: normalizeText(payment.customerName, 80) || "Walk-in",
    customerMobile: normalizeText(payment.customerMobile, 20) || "-",
    tableNo: normalizeText(payment.tableNo, 20) || "NA",
    paymentMethod,
    status,
    amount,
    timestamp: normalizeDate(payment.timestamp),
  };
};

const sanitizeOrderRecord = (order) => {
  if (!order || typeof order !== "object") return null;

  const id = normalizeText(order.id, 64);
  if (!id) return null;

  return {
    ...order,
    id,
    customerName: normalizeText(order.customerName, 80) || "Walk-in",
    customerMobile: normalizeText(order.customerMobile, 20) || "-",
    tableNo: normalizeText(order.tableNo, 20) || "NA",
    paymentMethod: normalizeText(order.paymentMethod, 20) || "UPI",
    paymentStatus: normalizeText(order.paymentStatus, 20) || "Paid",
    status: normalizeText(order.status, 20) || "Pending",
    time: normalizeDate(order.time),
    total: Math.max(0, Math.min(MAX_PAYMENT_AMOUNT, toNumber(order.total))),
    items: Array.isArray(order.items) ? order.items : [],
  };
};

const readCachedArray = (key) => {
  if (typeof window === "undefined") return [];

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return (Array.isArray(parsed) ? parsed : [])
      .map((payment, index) => sanitizePaymentRecord(payment, index))
      .filter(Boolean);
  } catch {
    return [];
  }
};

const readCachedObject = (key) => {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(key);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    return Object.values(parsed).reduce((acc, order) => {
      const sanitized = sanitizeOrderRecord(order);
      if (sanitized?.id) {
        acc[sanitized.id] = sanitized;
      }
      return acc;
    }, {});
  } catch {
    return {};
  }
};

const mergePayments = (current, incoming) => {
  const mergedById = new Map();

  (Array.isArray(current) ? current : []).forEach((payment) => {
    const sanitized = sanitizePaymentRecord(payment);
    const id = normalizeId(sanitized?.id);
    if (!id) return;
    mergedById.set(id, sanitized);
  });

  (Array.isArray(incoming) ? incoming : []).forEach((payment, index) => {
    const sanitized = sanitizePaymentRecord(payment, index);
    const id = normalizeId(sanitized?.id);
    if (!id) return;
    mergedById.set(id, {
      ...(mergedById.get(id) || {}),
      ...sanitized,
    });
  });

  return Array.from(mergedById.values()).sort(
    (a, b) => toTimestamp(b?.timestamp) - toTimestamp(a?.timestamp)
  );
};

const mergeOrdersLookup = (currentLookup, incomingOrders) => {
  const nextLookup = { ...(currentLookup || {}) };

  (Array.isArray(incomingOrders) ? incomingOrders : []).forEach((order) => {
    const sanitized = sanitizeOrderRecord(order);
    const id = normalizeId(sanitized?.id);
    if (!id) return;
    nextLookup[id] = {
      ...(nextLookup[id] || {}),
      ...sanitized,
    };
  });

  return nextLookup;
};

const buildInvoiceFromPayment = (payment, order) => {
  const orderItems = Array.isArray(order?.items) ? order.items : [];
  const paymentAmount = toNumber(payment?.amount);
  const items =
    orderItems.length > 0
      ? orderItems.map((item) => {
          const qty = Math.max(1, toNumber(item?.qty || 1));
          const lineTotal = toNumber(item?.lineTotal || 0);
          const unitPrice =
            lineTotal > 0 ? lineTotal / qty : toNumber(item?.price || 0);
          return {
            name: item?.name || "Item",
            qty,
            unitPrice,
            lineTotal: lineTotal > 0 ? lineTotal : unitPrice * qty,
          };
        })
      : [
          {
            name: "Order Payment",
            qty: 1,
            unitPrice: paymentAmount,
            lineTotal: paymentAmount,
          },
        ];

  return {
    invoiceId: `INV-${String(payment?.id || Date.now()).replace(/[^\w-]/g, "")}`,
    orderId: payment?.orderId || order?.id || "-",
    paymentId: payment?.id || "-",
    issuedAt: payment?.timestamp || order?.time || new Date().toISOString(),
    tableNo: payment?.tableNo || order?.tableNo || "NA",
    customerName: payment?.customerName || order?.customerName || "Walk-in",
    customerMobile: payment?.customerMobile || order?.customerMobile || "-",
    paymentMethod: payment?.paymentMethod || order?.paymentMethod || "-",
    paymentStatus: payment?.status || order?.paymentStatus || "-",
    orderStatus: order?.status || "-",
    totalAmount: paymentAmount || toNumber(order?.total || 0),
    items,
  };
};

export default function BillingPage() {
  const [payments, setPayments] = useState(() =>
    readCachedArray(PAYMENTS_CACHE_KEY)
  );
  const [ordersById, setOrdersById] = useState(() =>
    readCachedObject(ORDERS_CACHE_KEY)
  );
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: "swadpoint@upi",
    payeeName: "SwadPoint Restaurant",
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [lastSyncedAt, setLastSyncedAt] = useState("");
  const [configErrors, setConfigErrors] = useState({
    upiId: "",
    payeeName: "",
  });

  const loadData = async () => {
    const [paymentsResult, ordersResult] = await Promise.allSettled([
      fetchPaymentsFromApi(),
      fetchOrdersFromApi(),
    ]);

    if (paymentsResult.status === "fulfilled") {
      setPayments((prev) => mergePayments(prev, paymentsResult.value));
    }

    if (ordersResult.status === "fulfilled") {
      setOrdersById((prev) => mergeOrdersLookup(prev, ordersResult.value));
    }

    if (
      paymentsResult.status === "fulfilled" ||
      ordersResult.status === "fulfilled"
    ) {
      setLastSyncedAt(new Date().toLocaleTimeString());
    }

    setIsLoading(false);
    setPaymentConfig(getPaymentConfig());
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadData();
    }, 0);
    const intervalId = window.setInterval(loadData, 10000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    localStorage.setItem(PAYMENTS_CACHE_KEY, JSON.stringify(payments));
  }, [payments]);

  useEffect(() => {
    localStorage.setItem(ORDERS_CACHE_KEY, JSON.stringify(ordersById));
  }, [ordersById]);

  const filteredPayments = useMemo(() => {
    if (!STATUS_FILTER_OPTIONS.includes(statusFilter)) return payments;
    if (statusFilter === "All") return payments;
    return payments.filter((payment) => payment.status === statusFilter);
  }, [payments, statusFilter]);

  const stats = useMemo(() => {
    const successPayments = payments.filter((payment) => payment.status === "success");
    const totalAmount = successPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
    const today = new Date().toDateString();
    const todayAmount = successPayments
      .filter((payment) => new Date(payment.timestamp).toDateString() === today)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      totalTransactions: payments.length,
      successTransactions: successPayments.length,
      totalAmount,
      todayAmount,
    };
  }, [payments]);

  const saveConfig = () => {
    const upiId = normalizeText(paymentConfig.upiId, MAX_UPI_ID_LENGTH);
    const payeeName = normalizeText(paymentConfig.payeeName, MAX_PAYEE_NAME_LENGTH);
    const errors = {
      upiId: "",
      payeeName: "",
    };

    if (!isValidUpiId(upiId)) {
      errors.upiId = "Enter valid UPI ID (example: swadpoint@upi)";
    }
    if (payeeName.length < 2) {
      errors.payeeName = "Payee name must be at least 2 characters.";
    }

    if (errors.upiId || errors.payeeName) {
      setConfigErrors(errors);
      return;
    }
    setConfigErrors({ upiId: "", payeeName: "" });

    savePaymentConfig({ upiId, payeeName });
    alert("Payment QR config saved.");
  };

  const paymentQrUrl = useMemo(() => {
    const upiId = normalizeText(paymentConfig.upiId, MAX_UPI_ID_LENGTH);
    const payeeName = normalizeText(paymentConfig.payeeName, MAX_PAYEE_NAME_LENGTH);
    if (!isValidUpiId(upiId) || payeeName.length < 2) return "upi://pay";
    return createUpiUrl(upiId, payeeName, 1);
  }, [paymentConfig]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="mt-1 text-sm text-gray-600">
            All users pay using this same restaurant QR. Every payment is listed
            below.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Payment QR Config
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={paymentConfig.upiId}
                maxLength={MAX_UPI_ID_LENGTH}
                onChange={(e) => {
                  const nextValue = e.target.value.replace(/\s+/g, "");
                  setPaymentConfig((prev) => ({ ...prev, upiId: nextValue }));
                  if (configErrors.upiId) {
                    setConfigErrors((prev) => ({ ...prev, upiId: "" }));
                  }
                }}
                className="rounded-lg border px-3 py-2"
                placeholder="UPI ID (example: swadpoint@upi)"
              />
              <input
                type="text"
                value={paymentConfig.payeeName}
                maxLength={MAX_PAYEE_NAME_LENGTH}
                onChange={(e) => {
                  setPaymentConfig((prev) => ({
                    ...prev,
                    payeeName: e.target.value,
                  }));
                  if (configErrors.payeeName) {
                    setConfigErrors((prev) => ({ ...prev, payeeName: "" }));
                  }
                }}
                className="rounded-lg border px-3 py-2"
                placeholder="Payee name"
              />
              {configErrors.upiId && (
                <p className="-mt-1 text-xs font-medium text-red-600">{configErrors.upiId}</p>
              )}
              {configErrors.payeeName && (
                <p className="-mt-1 text-xs font-medium text-red-600">
                  {configErrors.payeeName}
                </p>
              )}
            </div>
            <button
              onClick={saveConfig}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save Payment Settings
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-700">Active QR Preview</p>
            <div className="mt-3 flex justify-center rounded-lg border p-4">
              <QRCode value={paymentQrUrl} size={150} />
            </div>
            <p className="mt-2 break-all text-xs text-gray-600">
              UPI ID: {paymentConfig.upiId}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.totalTransactions}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Successful</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {stats.successTransactions}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              Rs. {stats.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Today Amount</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              Rs. {stats.todayAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Transactions
            </h2>
            <div className="flex flex-wrap items-center gap-2">
              {lastSyncedAt ? (
                <span className="text-xs text-gray-500">
                  Last synced: {lastSyncedAt}
                </span>
              ) : null}
              <button
                type="button"
                onClick={loadData}
                className="rounded-lg border px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
              >
                Refresh
              </button>
              <select
                value={statusFilter}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  if (STATUS_FILTER_OPTIONS.includes(nextValue)) {
                    setStatusFilter(nextValue);
                  }
                }}
                className="rounded-lg border px-3 py-2 text-sm"
              >
                <option value="All">All</option>
                <option value="success">Success</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>

          {!isLoading && filteredPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No payments found.</p>
          ) : isLoading ? (
            <p className="text-sm text-gray-500">Loading payments...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Payment ID
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Order
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Table
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Method
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Time
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => {
                    const matchingOrder = ordersById[String(payment.orderId || "")] || null;
                    const invoicePayload = buildInvoiceFromPayment(payment, matchingOrder);

                    return (
                    <tr key={payment.id}>
                      <td className="px-3 py-2 text-gray-700">{payment.id}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.orderId}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.tableNo || "NA"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        Rs. {Number(payment.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            payment.status === "success"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {new Date(normalizeDate(payment.timestamp)).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              const success = printInvoice(invoicePayload);
                              if (!success) {
                                alert("Please allow popups to print invoice.");
                              }
                            }}
                            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            Print
                          </button>
                          <button
                            type="button"
                            onClick={() => downloadInvoice(invoicePayload)}
                            className="rounded border border-gray-300 px-2 py-1 text-xs text-gray-700 hover:bg-gray-100"
                          >
                            Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  )})}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
