"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import QRCode from "react-qr-code";
import {
  getMenu,
  getPaymentConfig,
} from "@/helper/storage";

const DEFAULT_PAYMENT_CONFIG = {
  upiId: "swadpoint@upi",
  payeeName: "SwadPoint Restaurant",
};

const UPI_ID_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;
const DEFAULT_MENU_CATEGORY = "Main Course";
const CATEGORY_SORT_PRIORITY = [
  DEFAULT_MENU_CATEGORY,
  "Starter",
  "Dessert",
  "Beverage",
];
const CATEGORY_CODE_MAP = {
  m: DEFAULT_MENU_CATEGORY,
  s: "Starter",
  d: "Dessert",
  b: "Beverage",
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeCategory = (value) => {
  const category = String(value || "").trim();
  return category || DEFAULT_MENU_CATEGORY;
};

const decodeCategory = (value) => {
  const raw = String(value || "").trim().toLowerCase();
  if (CATEGORY_CODE_MAP[raw]) return CATEGORY_CODE_MAP[raw];
  return normalizeCategory(value);
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
        id: item.id || item.i || `query-item-${index}`,
        name: String(item.name || item.n || "").trim(),
        description: String(item.description || item.d || "").trim(),
        category: decodeCategory(item.category || item.c),
        price: toNumber(item.price ?? item.p),
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
};

const parseItemsHash = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return [];

  return raw
    .split("|")
    .map((entry, index) => {
      const [encodedName, priceValue, categoryCode] = entry.split("~");
      const candidateName = String(encodedName || "").trim();
      let name = candidateName;
      try {
        name = decodeURIComponent(candidateName);
      } catch {
        name = candidateName;
      }

      return {
        id: `hash-item-${index}`,
        name: String(name || "").trim(),
        description: "",
        category: decodeCategory(categoryCode),
        price: toNumber(priceValue),
      };
    })
    .filter((item) => item.name);
};

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `menu-item-${index}`,
      name: String(item.name || "").trim(),
      description: String(item.description || "").trim(),
      category: normalizeCategory(item.category),
      price: toNumber(item.price),
    }))
    .filter((item) => item.name);
};

const fetchMenuFromServer = async () => {
  const response = await fetch("/api/menu", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch menu");
  const data = await response.json();
  return sanitizeMenuItems(data);
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
  const [formErrors, setFormErrors] = useState({
    customerName: "",
    customerMobile: "",
  });
  const [activeCategory, setActiveCategory] = useState("All");
  const [paymentMethod, setPaymentMethod] = useState("UPI");
  const [confirmation, setConfirmation] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recentlyAdded, setRecentlyAdded] = useState({});
  const [serverMenuItems, setServerMenuItems] = useState([]);
  const [hashMenuItems] = useState(() => {
    if (typeof window === "undefined") return [];
    const hash = window.location.hash || "";
    const payload = hash.startsWith("#") ? hash.slice(1) : hash;
    const hashParams = new URLSearchParams(payload);
    return parseItemsHash(hashParams.get("m"));
  });
  const addTimeoutRef = useRef({});

  const queryMenuItems = useMemo(() => parseItemsQuery(itemsParam), [itemsParam]);
  const localMenuItems = useMemo(() => sanitizeMenuItems(getMenu()), []);

  useEffect(() => {
    let isCancelled = false;

    if (queryMenuItems.length > 0) {
      return () => {
        isCancelled = true;
      };
    }

    const loadServerMenu = async () => {
      try {
        const menuFromServer = await fetchMenuFromServer();
        if (!isCancelled) {
          setServerMenuItems(menuFromServer);
        }
      } catch {
        if (!isCancelled) {
          setServerMenuItems([]);
        }
      }
    };

    loadServerMenu();
    return () => {
      isCancelled = true;
    };
  }, [queryMenuItems.length]);

  const menuItems = useMemo(() => {
    if (hashMenuItems.length > 0) return hashMenuItems;
    if (queryMenuItems.length > 0) return queryMenuItems;
    if (serverMenuItems.length > 0) return serverMenuItems;
    return localMenuItems;
  }, [hashMenuItems, queryMenuItems, serverMenuItems, localMenuItems]);
  const menuSource = hashMenuItems.length > 0 ? "hash" : queryMenuItems.length > 0 ? "query" : "server";
  const groupedMenuItems = useMemo(() => {
    const grouped = new Map();

    menuItems.forEach((item) => {
      const category = normalizeCategory(item.category);
      if (!grouped.has(category)) {
        grouped.set(category, []);
      }
      grouped.get(category).push({
        ...item,
        category,
        description: String(item.description || "").trim(),
        price: toNumber(item.price),
      });
    });

    return Array.from(grouped.entries())
      .sort(([first], [second]) => {
        const firstIndex = CATEGORY_SORT_PRIORITY.indexOf(first);
        const secondIndex = CATEGORY_SORT_PRIORITY.indexOf(second);
        const normalizedFirstIndex =
          firstIndex === -1 ? CATEGORY_SORT_PRIORITY.length : firstIndex;
        const normalizedSecondIndex =
          secondIndex === -1 ? CATEGORY_SORT_PRIORITY.length : secondIndex;

        if (normalizedFirstIndex !== normalizedSecondIndex) {
          return normalizedFirstIndex - normalizedSecondIndex;
        }

        return first.localeCompare(second);
      })
      .map(([category, items]) => ({ category, items }));
  }, [menuItems]);

  const categoryOptions = useMemo(
    () => groupedMenuItems.map((group) => group.category),
    [groupedMenuItems]
  );
  const selectedCategory = useMemo(() => {
    if (activeCategory === "All") return "All";
    return categoryOptions.includes(activeCategory) ? activeCategory : "All";
  }, [activeCategory, categoryOptions]);

  const visibleCategoryGroups = useMemo(() => {
    if (selectedCategory === "All") return groupedMenuItems;
    return groupedMenuItems.filter(
      (group) => group.category === selectedCategory
    );
  }, [groupedMenuItems, selectedCategory]);

  const paymentConfig = useMemo(() => {
    const storedPaymentConfig = sanitizePaymentConfig(getPaymentConfig());
    return sanitizePaymentConfig({
      upiId: upiIdParam || storedPaymentConfig.upiId,
      payeeName: payeeNameParam || storedPaymentConfig.payeeName,
    });
  }, [upiIdParam, payeeNameParam]);

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

    setRecentlyAdded((prev) => ({ ...prev, [item.id]: true }));

    if (addTimeoutRef.current[item.id]) {
      clearTimeout(addTimeoutRef.current[item.id]);
    }

    addTimeoutRef.current[item.id] = setTimeout(() => {
      setRecentlyAdded((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
    }, 2000);
  };

  useEffect(() => {
    const timeoutMap = addTimeoutRef.current;
    return () => {
      Object.values(timeoutMap).forEach((timerId) =>
        clearTimeout(timerId)
      );
    };
  }, []);

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

    const normalizedName = customerName.trim();
    const normalizedMobile = customerMobile.replace(/\D/g, "").slice(0, 10);
    const nextErrors = {
      customerName: "",
      customerMobile: "",
    };

    if (!normalizedName || normalizedName.length < 2) {
      nextErrors.customerName = "Enter valid customer name";
    }

    if (!/^\d{10}$/.test(normalizedMobile)) {
      nextErrors.customerMobile = "Enter valid 10-digit mobile number";
    }

    if (nextErrors.customerName || nextErrors.customerMobile) {
      setFormErrors(nextErrors);
      return;
    }
    setFormErrors({ customerName: "", customerMobile: "" });

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
      customerName: normalizedName,
      customerMobile: normalizedMobile,
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
    setFormErrors({ customerName: "", customerMobile: "" });
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
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-4 text-lg font-semibold text-gray-900">
                Menu Items
              </h2>

              {groupedMenuItems.length === 0 ? (
                <p className="text-sm text-gray-500">
                  Menu is empty. Admin can add items from dashboard menu section.
                </p>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {["All", ...categoryOptions].map((category) => (
                      <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`rounded-full border px-4 py-1.5 text-xs font-semibold ${
                          selectedCategory === category
                            ? "border-blue-600 bg-blue-600 text-white"
                            : "border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  {visibleCategoryGroups.map((group) => (
                    <div key={group.category} className="space-y-3">
                      <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                        {group.category}
                      </h3>
                      {group.items.map((item) => (
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
                            className={`rounded-lg px-4 py-2 text-sm font-medium text-white ${
                              recentlyAdded[item.id]
                                ? "bg-emerald-600"
                                : "bg-blue-600 hover:bg-blue-700"
                            }`}
                          >
                            {recentlyAdded[item.id] ? "Added" : "Add to cart"}
                          </button>
                        </div>
                      ))}
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
                <p className="text-sm font-medium text-gray-800">
                  Customer details (required)
                </p>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => {
                    setCustomerName(e.target.value);
                    if (formErrors.customerName) {
                      setFormErrors((prev) => ({ ...prev, customerName: "" }));
                    }
                  }}
                  placeholder="Customer name"
                  required
                  className={`w-full rounded-lg border px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-500 ${
                    formErrors.customerName ? "border-red-500" : ""
                  }`}
                />
                {formErrors.customerName && (
                  <p className="text-xs font-medium text-red-600">
                    {formErrors.customerName}
                  </p>
                )}
                <input
                  type="tel"
                  value={customerMobile}
                  onChange={(e) => {
                    const digitsOnly = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setCustomerMobile(digitsOnly);
                    if (formErrors.customerMobile) {
                      setFormErrors((prev) => ({ ...prev, customerMobile: "" }));
                    }
                  }}
                  placeholder="Mobile number"
                  inputMode="numeric"
                  maxLength={10}
                  required
                  className={`w-full rounded-lg border px-3 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-500 ${
                    formErrors.customerMobile ? "border-red-500" : ""
                  }`}
                />
                {formErrors.customerMobile && (
                  <p className="text-xs font-medium text-red-600">
                    {formErrors.customerMobile}
                  </p>
                )}

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
