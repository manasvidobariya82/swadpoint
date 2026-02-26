"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import {
  getMenu,
  getPaymentConfig,
  getTables,
} from "@/helper/storage";

const DEFAULT_PAYMENT_CONFIG = {
  upiId: "swadpoint@upi",
  payeeName: "SwadPoint Restaurant",
};

const UPI_ID_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizePaymentConfig = (config) => {
  const raw = config && typeof config === "object" ? config : {};
  const upiId = String(raw.upiId || DEFAULT_PAYMENT_CONFIG.upiId).trim();
  const payeeName = String(
    raw.payeeName || DEFAULT_PAYMENT_CONFIG.payeeName
  ).trim();

  return { upiId, payeeName };
};

const isValidUpiId = (value) => UPI_ID_REGEX.test(String(value || "").trim());

const createUpiUrl = (upiId, payeeName, amount) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${amount.toFixed(2)}&cu=INR`;

const parseItemsQuery = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        id: item.id || `query-item-${index}`,
        name: String(item.name || "").trim(),
        description: String(item.description || "").trim(),
        category: String(item.category || "Main Course"),
        price: toNumber(item.price),
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
};

const postJson = async (url, payload) => {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Request failed");
  }

  return response.json();
};

function CustomerMenuContent() {
  const searchParams = useSearchParams();
  const tableNo = searchParams.get("table");
  const itemsParam = searchParams.get("items");
  const upiIdParam = searchParams.get("upiId");
  const payeeNameParam = searchParams.get("payeeName");

  const [cart, setCart] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerMobile, setCustomerMobile] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [confirmation, setConfirmation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const queryMenuItems = useMemo(() => parseItemsQuery(itemsParam), [itemsParam]);
  const menuItems = useMemo(
    () => (queryMenuItems.length > 0 ? queryMenuItems : getMenu()),
    [queryMenuItems]
  );
  const menuSource = queryMenuItems.length > 0 ? "query" : "local";

  const paymentConfig = useMemo(() => {
    const storedPaymentConfig = sanitizePaymentConfig(getPaymentConfig());
    return sanitizePaymentConfig({
      upiId: upiIdParam || storedPaymentConfig.upiId,
      payeeName: payeeNameParam || storedPaymentConfig.payeeName,
    });
  }, [upiIdParam, payeeNameParam]);

  const isValidTable = useMemo(() => {
    const allTables = getTables();
    if (tableNo && allTables.length > 0) {
      return allTables.some((table) => table.tableNo === tableNo);
    }
    return true;
  }, [tableNo]);

  const cartTotal = useMemo(
    () => cart.reduce((sum, item) => sum + item.price * item.qty, 0),
    [cart]
  );

  const isUpiReady = useMemo(
    () => isValidUpiId(paymentConfig.upiId),
    [paymentConfig.upiId]
  );

  const upiUrl = useMemo(() => {
    if (!isUpiReady || cartTotal <= 0) return "";
    return createUpiUrl(paymentConfig.upiId, paymentConfig.payeeName, cartTotal);
  }, [paymentConfig, cartTotal, isUpiReady]);

  const addToCart = (item) => {
    const price = toNumber(item.price);
    setCart((prev) => {
      const index = prev.findIndex((entry) => entry.id === item.id);
      if (index === -1) {
        return [...prev, { ...item, price, qty: 1 }];
      }

      const next = [...prev];
      next[index] = { ...next[index], qty: next[index].qty + 1 };
      return next;
    });
  };

  const updateQty = (id, change) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id ? { ...item, qty: Math.max(0, item.qty + change) } : item
        )
        .filter((item) => item.qty > 0)
    );
  };

  const openUpiApp = () => {
    if (!isUpiReady || !upiUrl) {
      alert("UPI ID is invalid. Ask restaurant to update Billing settings.");
      return;
    }

    window.location.href = upiUrl;
  };

  const placeOrder = async () => {
    if (!tableNo) {
      alert("Table number is missing in QR link.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    if (paymentMethod === "UPI" && !isUpiReady) {
      alert("UPI is unavailable. Ask restaurant to configure a valid UPI ID.");
      return;
    }
    if (isSubmitting) return;

    const now = new Date();
    const orderId = `ORD-${now.getTime()}`;
    const paymentId = `PAY-${now.getTime()}`;

    const normalizedItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      qty: item.qty,
      lineTotal: item.price * item.qty,
    }));

    const order = {
      id: orderId,
      tableNo,
      customerName: customerName.trim() || "Walk-in",
      customerMobile: customerMobile.trim(),
      items: normalizedItems,
      total: cartTotal,
      status: "Pending",
      paymentStatus: "Paid",
      paymentMethod,
      paymentId,
      time: now.toISOString(),
    };

    const payment = {
      id: paymentId,
      orderId,
      customerName: order.customerName,
      customerMobile: order.customerMobile,
      tableNo,
      amount: cartTotal,
      paymentMethod,
      status: "success",
      timestamp: now.toISOString(),
      transactionId: `${paymentMethod.toUpperCase()}-${now.getTime()}`,
      items: normalizedItems.map((item) => `${item.name} x${item.qty}`),
      upiId: paymentConfig.upiId,
    };

    try {
      setIsSubmitting(true);
      await Promise.all([
        postJson("/api/orders", order),
        postJson("/api/payments", payment),
      ]);
    } catch {
      alert("Could not submit order. Please check internet/server and retry.");
      setIsSubmitting(false);
      return;
    }

    setConfirmation({
      orderId,
      paymentId,
      amount: cartTotal,
    });
    setCart([]);
    setCustomerName("");
    setCustomerMobile("");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Digital Menu</h1>
          <p className="mt-1 text-sm text-gray-600">
            Table: <span className="font-semibold">{tableNo || "Unknown"}</span>
          </p>
          {menuSource === "query" && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Menu loaded from QR URL.
            </p>
          )}
          {!isValidTable && (
            <p className="mt-2 text-sm font-medium text-red-600">
              This table QR is not registered in table management.
            </p>
          )}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Menu Items
              </h2>

              {menuItems.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Menu is empty. Admin can add items from dashboard menu section.
                </p>
              ) : (
                <div className="space-y-3">
                  {menuItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col gap-3 rounded-lg border p-4 md:flex-row md:items-center md:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.description || "No description"}
                        </p>
                        <p className="mt-1 font-bold text-green-600">
                          Rs. {toNumber(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => addToCart(item)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Add to cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="text-lg font-semibold text-gray-900">Cart</h2>

              {cart.length === 0 ? (
                <p className="mt-3 text-sm text-gray-500">Cart is empty.</p>
              ) : (
                <div className="mt-3 space-y-3">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-gray-200 p-3"
                    >
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-sm text-gray-500">
                        Rs. {item.price} x {item.qty}
                      </p>
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          -
                        </button>
                        <span className="w-6 text-center text-sm">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="rounded border border-gray-300 px-2 py-1 text-sm"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p className="mt-4 text-base font-bold text-gray-900">
                Total: Rs. {cartTotal.toFixed(2)}
              </p>

              <div className="mt-4 space-y-3">
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Customer name (optional)"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />
                <input
                  type="tel"
                  value={customerMobile}
                  onChange={(e) => setCustomerMobile(e.target.value)}
                  placeholder="Mobile number (optional)"
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                />

                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 text-sm"
                >
                  <option value="UPI">UPI</option>
                  <option value="Cash">Cash</option>
                </select>
              </div>

              {paymentMethod === "UPI" && cartTotal > 0 && (
                <div className="mt-4 rounded-lg border p-4">
                  <p className="mb-2 text-sm font-medium text-gray-700">
                    Scan restaurant payment QR
                  </p>
                  <div className="flex justify-center">
                    <QRCode value={upiUrl || "upi://pay"} size={130} />
                  </div>
                  <p className="mt-2 break-all text-xs text-gray-500">
                    UPI ID: {paymentConfig.upiId}
                  </p>
                  {!isUpiReady && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      Invalid UPI ID. Restaurant must update billing settings.
                    </p>
                  )}
                  <button
                    onClick={openUpiApp}
                    disabled={!isUpiReady}
                    className="mt-3 w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                  >
                    Pay with UPI app
                  </button>
                </div>
              )}

              <button
                onClick={placeOrder}
                disabled={isSubmitting}
                className="mt-5 w-full rounded-lg bg-green-600 px-4 py-2 font-semibold text-white hover:bg-green-700"
              >
                {isSubmitting ? "Placing order..." : "Place order and pay"}
              </button>
            </div>

            {confirmation && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4">
                <p className="text-sm font-semibold text-green-800">
                  Order placed successfully
                </p>
                <p className="mt-1 text-xs text-green-700">
                  Order ID: {confirmation.orderId}
                </p>
                <p className="text-xs text-green-700">
                  Payment ID: {confirmation.paymentId}
                </p>
                <p className="text-xs text-green-700">
                  Amount: Rs. {confirmation.amount.toFixed(2)}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerMenu() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-100 p-6" />}>
      <CustomerMenuContent />
    </Suspense>
  );
}
