"use client";

import { useEffect, useMemo, useState } from "react";
import { downloadInvoice, printInvoice } from "@/helper/invoice";

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

const buildInvoiceFromOrder = (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  const totalFromItems = items.reduce(
    (sum, item) => sum + toNumber(item?.lineTotal || toNumber(item?.price) * toNumber(item?.qty || 1)),
    0
  );
  const totalAmount = toNumber(order?.total || totalFromItems);
  const invoiceId = `INV-${String(order?.id || Date.now()).replace(/[^\w-]/g, "")}`;

  return {
    invoiceId,
    orderId: order?.id || "-",
    paymentId: order?.paymentId || "-",
    issuedAt: order?.time || new Date().toISOString(),
    tableNo: order?.tableNo || "NA",
    customerName: order?.customerName || "Walk-in",
    customerMobile: order?.customerMobile || "-",
    paymentMethod: order?.paymentMethod || "-",
    paymentStatus: order?.paymentStatus || "-",
    orderStatus: order?.status || "-",
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
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState("");

  const loadOrders = async () => {
    try {
      const list = await fetchOrdersFromApi();
      setOrders(Array.isArray(list) ? list : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadOrders();
    }, 0);
    const intervalId = window.setInterval(loadOrders, 3000);
    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "Pending").length,
    [orders]
  );

  const markCompleted = async (id) => {
    if (actionLoadingId) return;
    try {
      setActionLoadingId(id);
      await updateOrderStatus(id, "Completed");
      await loadOrders();
    } finally {
      setActionLoadingId("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Admin Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Total: {orders.length} | Pending: {pendingCount}
          </p>
        </div>

        {!loading && orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow">
            No orders yet.
          </div>
        ) : loading ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow">
            Loading orders...
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl bg-white p-5 shadow">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Table: {order.tableNo || "NA"} | Customer:{" "}
                      {order.customerName || "Walk-in"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Time: {new Date(order.time).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      Status:{" "}
                      <span
                        className={
                          order.status === "Completed"
                            ? "font-semibold text-green-700"
                            : "font-semibold text-orange-700"
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Payment: {order.paymentStatus || "Paid"} (
                      {order.paymentMethod || "UPI"})
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-lg border border-gray-200 p-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} x {item.qty || 1}
                      </span>
                      <span>
                        Rs. {Number(item.lineTotal ?? item.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 text-right font-semibold text-gray-900">
                    Total: Rs. {Number(order.total || 0).toFixed(2)}
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
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                      {actionLoadingId === order.id
                        ? "Updating..."
                        : "Mark Completed"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
