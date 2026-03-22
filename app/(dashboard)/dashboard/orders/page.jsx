"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

const ORDER_TYPES = ["Takeaway", "Delivery", "Table/Room", "Dine In"];
const ORDER_STATUSES = ["New Order", "Preparing", "Order Completed", "Cancelled"];

const mapApiStatusToUi = (status) => {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "pending") return "New Order";
  if (normalized === "preparing") return "Preparing";
  if (normalized === "completed") return "Order Completed";
  if (normalized === "cancelled") return "Cancelled";
  return "New Order";
};

const mapUiStatusToApi = (status) => {
  const normalized = String(status || "").trim().toLowerCase();
  if (normalized === "new order") return "Pending";
  if (normalized === "preparing") return "Preparing";
  if (normalized === "order completed") return "Completed";
  if (normalized === "cancelled") return "Cancelled";
  return "Pending";
};

const toNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatAbsoluteDateTime = (value) => {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "-";

  return new Date(timestamp).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatRelativeTime = (value) => {
  const timestamp = new Date(value).getTime();
  if (!Number.isFinite(timestamp)) return "just now";

  const diffMs = Date.now() - timestamp;
  const diffMinutes = Math.max(0, Math.floor(diffMs / (1000 * 60)));
  if (diffMinutes < 1) return "just now";
  if (diffMinutes < 60) return `${diffMinutes} min ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hr ago`;

  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day ago`;
};

const deriveOrderType = (order) => {
  const tableNo = String(order?.tableNo || "").trim().toUpperCase();
  const mobile = String(order?.customerMobile || "").trim();

  if (tableNo && tableNo !== "NA") return "Table/Room";
  if (/^\d{10}$/.test(mobile)) return "Delivery";
  return "Takeaway";
};

const getPaymentMethodLabel = (value) => {
  const normalized = String(value || "").trim().toLowerCase();
  if (normalized === "cash") return "Cash on Delivery";
  if (normalized === "upi" || normalized === "card") return "Online Payment";
  return "Payment";
};

const getPaymentStatusLabel = (method, status) => {
  const normalizedMethod = String(method || "").trim().toLowerCase();
  const normalizedStatus = String(status || "").trim().toLowerCase();

  if (normalizedMethod === "cash" && normalizedStatus === "pending") {
    return "Pay on Delivery";
  }
  if (normalizedStatus === "paid") return "Paid";
  if (normalizedStatus === "failed") return "Failed";
  if (normalizedStatus === "unpaid") return "Unpaid";
  return "Pending";
};

const sanitizeOrderForUi = (order) => {
  const itemsList = (Array.isArray(order?.items) ? order.items : [])
    .map((item) => ({
      id: String(item?.id || ""),
      name: String(item?.name || "Item"),
      qty: Math.max(1, Math.floor(toNumber(item?.qty, 1))),
      price: Math.max(0, toNumber(item?.price, 0)),
      lineTotal: Math.max(0, toNumber(item?.lineTotal, 0)),
    }))
    .filter((item) => item.name);

  return {
    id: String(order?.id || ""),
    name: String(order?.customerName || "Walk-in"),
    type: deriveOrderType(order),
    status: mapApiStatusToUi(order?.status),
    time: formatRelativeTime(order?.time),
    timeIso: String(order?.time || ""),
    prepTime: String(order?.status || "").toLowerCase() === "preparing" ? 20 : null,
    tableNo: String(order?.tableNo || "NA"),
    customerMobile: String(order?.customerMobile || "-"),
    paymentMethod: String(order?.paymentMethod || ""),
    paymentMethodLabel: getPaymentMethodLabel(order?.paymentMethod),
    paymentStatus: String(order?.paymentStatus || ""),
    paymentStatusLabel: getPaymentStatusLabel(
      order?.paymentMethod,
      order?.paymentStatus,
    ),
    placedLabel: "Placed Order",
    acceptedAt: String(order?.acceptedAt || ""),
    preparingAt: String(order?.preparingAt || ""),
    completedAt: String(order?.completedAt || ""),
    cancelledAt: String(order?.cancelledAt || ""),
    itemsList,
    total:
      toNumber(order?.total, 0) > 0
        ? toNumber(order.total, 0)
        : itemsList.reduce((sum, item) => sum + item.qty * item.price, 0),
  };
};

const createTestOrderPayload = () => {
  const now = Date.now();
  const id = `ORD-${now}`;
  const items = [
    {
      id: `ITEM-${now}-1`,
      name: "Test Thali",
      qty: 1,
      price: 180,
      lineTotal: 180,
    },
    {
      id: `ITEM-${now}-2`,
      name: "Masala Chaas",
      qty: 2,
      price: 40,
      lineTotal: 80,
    },
  ];

  return {
    id,
    tableNo: "NA",
    customerName: "Test Customer",
    customerMobile: "9999999999",
    items,
    total: 260,
    status: "Pending",
    paymentStatus: "Pending",
    paymentMethod: "UPI",
    paymentId: "-",
    time: new Date().toISOString(),
  };
};

export default function Orders() {
  const [orderType, setOrderType] = useState("Takeaway");
  const [status, setStatus] = useState("New Order");
  const [openOrder, setOpenOrder] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/orders", { cache: "no-store" });
      if (!response.ok) {
        throw new Error("Failed to fetch orders from server.");
      }

      const payload = await response.json();
      setOrders(Array.isArray(payload) ? payload.map(sanitizeOrderForUi) : []);
    } catch (loadError) {
      setError(loadError?.message || "Unable to load orders.");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const filteredOrders = useMemo(
    () => orders.filter((order) => order.type === orderType && order.status === status),
    [orders, orderType, status]
  );

  const getTotal = (items) =>
    (Array.isArray(items) ? items : []).reduce(
      (sum, item) => sum + Math.max(1, item.qty) * Math.max(0, item.price),
      0
    );

  const updateStatus = async (id, uiStatus) => {
    const apiStatus = mapUiStatusToApi(uiStatus);
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          status: apiStatus,
          completedAt:
            apiStatus === "Completed" ? new Date().toISOString() : undefined,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to update order status.");
      }

      const updated = await response.json();
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? sanitizeOrderForUi(updated) : order
        )
      );

      if (uiStatus === "Preparing") {
        setStatus("Preparing");
      }
      if (uiStatus === "Order Completed") {
        setStatus("Order Completed");
      }
    } catch (updateError) {
      setError(updateError?.message || "Unable to update order status.");
    } finally {
      setSubmitting(false);
    }
  };

  const createTestOrder = async () => {
    setSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createTestOrderPayload()),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || "Failed to create test order.");
      }

      const created = await response.json();
      const nextOrder = sanitizeOrderForUi(created);
      setOrders((prev) => [nextOrder, ...prev]);
      setOrderType(nextOrder.type);
      setStatus(nextOrder.status);
    } catch (createError) {
      setError(createError?.message || "Unable to create test order.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <button
            onClick={loadOrders}
            disabled={loading || submitting}
            className="px-4 py-2 rounded-lg border text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-60"
          >
            Refresh Orders
          </button>
          <button
            onClick={createTestOrder}
            disabled={loading || submitting}
            className="px-4 py-2 rounded-lg bg-blue-600 text-sm text-white hover:bg-blue-700 disabled:opacity-60"
          >
            Add Test Order
          </button>
          {error ? <span className="text-sm text-red-600">{error}</span> : null}
        </div>

        <div className="flex gap-3 overflow-x-auto pb-3">
          {ORDER_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-5 py-2 rounded-full text-sm border ${
                orderType === type
                  ? "bg-black text-white"
                  : "bg-white text-gray-600"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-6 mt-6 border-b overflow-x-auto">
          {ORDER_STATUSES.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={`pb-3 text-sm ${
                status === tab ? "text-orange-500" : "text-gray-500"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading orders...</div>
          ) : filteredOrders.length ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-xl p-4 space-y-3">
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <p className="font-semibold">
                      {order.name}{" "}
                      <span className="text-gray-400 text-sm">({order.id})</span>
                    </p>
                    <p className="text-sm text-gray-500">
                      {order.time}
                      {order.tableNo && order.tableNo !== "NA"
                        ? ` | Table ${order.tableNo}`
                        : ""}
                    </p>
                    <p className="text-xs text-gray-500">
                      {order.placedLabel} | {order.paymentMethodLabel} |{" "}
                      {order.paymentStatusLabel}
                    </p>
                    {order.customerMobile && order.customerMobile !== "-" ? (
                      <p className="text-xs text-gray-500">
                        Mobile: {order.customerMobile}
                      </p>
                    ) : null}

                    <div className="mt-1 flex flex-wrap gap-2">
                      {order.status === "New Order" ? (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-emerald-100 text-emerald-700">
                          Placed Order
                        </span>
                      ) : null}
                      {order.prepTime ? (
                        <span className="inline-block text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                          {order.prepTime} mins prep
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <button
                    onClick={() =>
                      setOpenOrder(openOrder === order.id ? null : order.id)
                    }
                    className="text-sm text-blue-600"
                  >
                    {openOrder === order.id ? "Hide Items" : "View Items"}
                  </button>
                </div>

                {openOrder === order.id ? (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Payment method</span>
                      <span>{order.paymentMethodLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Payment status</span>
                      <span>{order.paymentStatusLabel}</span>
                    </div>
                    {order.customerMobile && order.customerMobile !== "-" ? (
                      <div className="flex justify-between text-sm">
                        <span>Customer mobile</span>
                        <span>{order.customerMobile}</span>
                      </div>
                    ) : null}
                    <div className="flex justify-between text-sm">
                      <span>Order state</span>
                      <span>{order.placedLabel}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Placed at</span>
                      <span>{formatAbsoluteDateTime(order.timeIso)}</span>
                    </div>
                    {order.acceptedAt ? (
                      <div className="flex justify-between text-sm">
                        <span>Accepted at</span>
                        <span>{formatAbsoluteDateTime(order.acceptedAt)}</span>
                      </div>
                    ) : null}
                    {order.preparingAt ? (
                      <div className="flex justify-between text-sm">
                        <span>Preparing at</span>
                        <span>{formatAbsoluteDateTime(order.preparingAt)}</span>
                      </div>
                    ) : null}
                    {order.completedAt ? (
                      <div className="flex justify-between text-sm">
                        <span>Completed at</span>
                        <span>{formatAbsoluteDateTime(order.completedAt)}</span>
                      </div>
                    ) : null}
                    {order.cancelledAt ? (
                      <div className="flex justify-between text-sm">
                        <span>Cancelled at</span>
                        <span>{formatAbsoluteDateTime(order.cancelledAt)}</span>
                      </div>
                    ) : null}
                    <div className="border-t pt-2" />
                    {order.itemsList.map((item) => (
                      <div key={item.id || item.name} className="flex justify-between text-sm">
                        <span>
                          {item.name} x {item.qty}
                        </span>
                        <span>Rs. {item.qty * item.price}</span>
                      </div>
                    ))}

                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>Rs. {getTotal(order.itemsList)}</span>
                    </div>
                  </div>
                ) : null}

                {order.status === "New Order" ? (
                  <button
                    onClick={() => updateStatus(order.id, "Preparing")}
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm disabled:opacity-60"
                  >
                    Accept Order
                  </button>
                ) : null}

                {order.status === "Preparing" ? (
                  <button
                    onClick={() => updateStatus(order.id, "Order Completed")}
                    disabled={submitting}
                    className="w-full sm:w-auto px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm disabled:opacity-60"
                  >
                    Mark Complete
                  </button>
                ) : null}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No orders available for selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
