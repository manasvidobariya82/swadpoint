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
const VALID_PAYMENT_METHODS = ["UPI", "Cash"];
const MAX_MENU_ITEM_NAME_LENGTH = 80;
const MAX_MENU_ITEM_DESCRIPTION_LENGTH = 240;
const MAX_MENU_ITEM_PRICE = 100000;
const MAX_CUSTOMER_NAME_LENGTH = 80;
const MAX_CART_ITEM_QTY = 25;

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeText = (value, maxLength) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeTableNumber = (value) => {
  const digits = String(value || "").replace(/\D/g, "");
  if (!digits) return "";

  const parsed = Number(digits);
  if (!Number.isInteger(parsed) || parsed <= 0) return "";
  return String(parsed);
};

const normalizeMobileNumber = (value) =>
  String(value || "").replace(/\D/g, "").slice(0, 10);

const isValidCustomerName = (value) => {
  const name = sanitizeText(value, MAX_CUSTOMER_NAME_LENGTH);
  if (name.length < 2) return false;

  const hasOnlyAllowedChars =
    name.replace(/[\p{L}\s.'-]/gu, "").length === 0;
  return hasOnlyAllowedChars;
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

const sanitizeMenuItem = (item, index, idPrefix = "menu-item") => {
  if (!item || typeof item !== "object") return null;

  const id = sanitizeText(item.id, 64) || `${idPrefix}-${index}`;
  const name = sanitizeText(item.name, MAX_MENU_ITEM_NAME_LENGTH);
  const description = sanitizeText(item.description, MAX_MENU_ITEM_DESCRIPTION_LENGTH);
  const category = decodeCategory(item.category);
  const price = toNumber(item.price);

  if (name.length < 2) return null;
  if (price <= 0 || price > MAX_MENU_ITEM_PRICE) return null;

  return {
    id,
    name,
    description,
    category,
    price,
  };
};

const parseItemsQuery = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, index) =>
        sanitizeMenuItem(
          {
            id: item.id || item.i,
            name: item.name || item.n,
            description: item.description || item.d,
            category: item.category || item.c,
            price: item.price ?? item.p,
          },
          index,
          "query-item"
        )
      )
      .filter(Boolean);
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

      return sanitizeMenuItem(
        {
          id: `hash-item-${index}`,
          name,
          description: "",
          category: categoryCode,
          price: priceValue,
        },
        index,
        "hash-item"
      );
    })
    .filter(Boolean);
};

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) =>
      sanitizeMenuItem(
        {
          ...item,
          category: normalizeCategory(item?.category),
        },
        index
      )
    )
    .filter(Boolean);
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
  const tableNoParam = searchParams.get("table");
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
  const tableNo = useMemo(() => normalizeTableNumber(tableNoParam), [tableNoParam]);

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
    () =>
      cart.reduce(
        (sum, item) =>
          sum +
          toNumber(item.price) *
            Math.max(1, Math.floor(toNumber(item.qty || 1))),
        0
      ),
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
    const itemId = sanitizeText(item?.id, 64);
    const itemName = sanitizeText(item?.name, MAX_MENU_ITEM_NAME_LENGTH);
    const price = toNumber(item.price);
    if (!itemId || !itemName || price <= 0 || price > MAX_MENU_ITEM_PRICE) return;

    setCart((prev) => {
      const index = prev.findIndex((entry) => entry.id === itemId);
      if (index === -1) {
        return [...prev, { ...item, id: itemId, name: itemName, price, qty: 1 }];
      }

      const next = [...prev];
      next[index] = {
        ...next[index],
        qty: Math.min(MAX_CART_ITEM_QTY, next[index].qty + 1),
      };
      return next;
    });

    setRecentlyAdded((prev) => ({ ...prev, [itemId]: true }));

    if (addTimeoutRef.current[itemId]) {
      clearTimeout(addTimeoutRef.current[itemId]);
    }

    addTimeoutRef.current[itemId] = setTimeout(() => {
      setRecentlyAdded((prev) => {
        const next = { ...prev };
        delete next[itemId];
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
          item.id === id
            ? {
                ...item,
                qty: Math.max(
                  0,
                  Math.min(MAX_CART_ITEM_QTY, item.qty + change)
                ),
              }
            : item
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
      alert("Table number is invalid in QR link.");
      return;
    }

    if (cart.length === 0) {
      alert("Please add at least one item.");
      return;
    }

    const normalizedName = sanitizeText(customerName, MAX_CUSTOMER_NAME_LENGTH);
    const normalizedMobile = normalizeMobileNumber(customerMobile);
    const nextErrors = {
      customerName: "",
      customerMobile: "",
    };

    if (!isValidCustomerName(normalizedName)) {
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

    if (!VALID_PAYMENT_METHODS.includes(paymentMethod)) {
      alert("Invalid payment method selected.");
      return;
    }

    if (paymentMethod === "UPI" && !isUpiReady) {
      alert("UPI is unavailable. Ask restaurant to configure a valid UPI ID.");
      return;
    }
    if (isSubmitting) return;

    const now = new Date();
    const orderId = `ORD-${now.getTime()}`;

    const normalizedItems = cart
      .map((item) => {
        const id = sanitizeText(item.id, 64);
        const name = sanitizeText(item.name, MAX_MENU_ITEM_NAME_LENGTH);
        const price = toNumber(item.price);
        const qty = Math.max(1, Math.min(MAX_CART_ITEM_QTY, Math.floor(toNumber(item.qty || 1))));
        const lineTotal = price * qty;

        if (!id || !name || price <= 0 || lineTotal <= 0) return null;
        return { id, name, price, qty, lineTotal };
      })
      .filter(Boolean);
    const finalTotal = normalizedItems.reduce(
      (sum, item) => sum + toNumber(item.lineTotal),
      0
    );

    if (normalizedItems.length === 0 || finalTotal <= 0) {
      alert("Please add valid items before placing order.");
      return;
    }

    const order = {
      id: orderId,
      tableNo,
      customerName: normalizedName,
      customerMobile: normalizedMobile,
      items: normalizedItems,
      total: finalTotal,
      status: "Pending",
      paymentStatus: "Pending",
      paymentMethod,
      paymentId: "-",
      time: now.toISOString(),
      invoiceId: "",
      invoiceGeneratedAt: "",
      completedAt: "",
      paymentTransferred: false,
      paymentTransferredAt: "",
    };

    try {
      setIsSubmitting(true);
      await postJson("/api/orders", order);
    } catch {
      alert("Could not submit order. Please check internet/server and retry.");
      setIsSubmitting(false);
      return;
    }

    setConfirmation({
      orderId,
      amount: finalTotal,
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
                  maxLength={MAX_CUSTOMER_NAME_LENGTH}
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
                  onChange={(e) => {
                    const method = e.target.value;
                    if (VALID_PAYMENT_METHODS.includes(method)) {
                      setPaymentMethod(method);
                    }
                  }}
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
                {isSubmitting ? "Placing order..." : "Place order"}
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
                  Payment will be processed after order completion.
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
