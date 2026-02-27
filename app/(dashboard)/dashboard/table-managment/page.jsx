"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast, Toaster } from "react-hot-toast";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { getMenu, getPaymentConfig, getTables, saveTables } from "@/helper/storage";

const MENU_BASE_URL_KEY = "restaurantMenuBaseUrl";
const DEFAULT_MENU_CATEGORY = "Main Course";
const QR_SAFE_URL_LENGTH = 2600;
const MENU_NAME_MAX_LENGTH = 36;
const DASHBOARD_REFRESH_INTERVAL_MS = 5000;
const MAX_TABLE_NUMBER_DIGITS = 4;
const CATEGORY_TO_CODE = {
  "Main Course": "m",
  Starter: "s",
  Dessert: "d",
  Beverage: "b",
};

const normalizeBaseUrl = (value) => {
  const trimmed = String(value || "").trim();
  if (!trimmed) return "";

  const isLocalCandidate =
    /^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/i.test(
      trimmed
    ) || /^\d{1,3}(\.\d{1,3}){3}(:\d+)?$/i.test(trimmed);

  const candidate = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `${isLocalCandidate ? "http" : "https"}://${trimmed}`;

  try {
    const parsed = new URL(candidate);
    parsed.hash = "";
    parsed.search = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "";
  }
};

const isLocalHostUrl = (value) => {
  try {
    const { hostname } = new URL(value);
    return (
      hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1"
    );
  } catch {
    return false;
  }
};

const normalizeMenuCategory = (value) => {
  const category = String(value || "").trim();
  return category || DEFAULT_MENU_CATEGORY;
};

const toCategoryCode = (value) =>
  CATEGORY_TO_CODE[normalizeMenuCategory(value)] || "m";

const sanitizeMenuForQr = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item) => ({
      n: String(item.name || "").trim().slice(0, MENU_NAME_MAX_LENGTH),
      p: Number(item.price) || 0,
      c: toCategoryCode(item.category),
    }))
    .filter((item) => item.n);
};

const serializeMenuForHash = (items) =>
  items
    .map((item) => {
      const encodedName = encodeURIComponent(item.n);
      return `${encodedName}~${item.p}~${item.c}`;
    })
    .join("|");

const normalizeTableNumber = (value) => {
  const digitsOnly = String(value || "")
    .replace(/\D/g, "")
    .trim();
  if (!digitsOnly) return "";

  const parsed = Number(digitsOnly);
  if (!Number.isInteger(parsed) || parsed <= 0) return "";
  return String(parsed);
};

const getTableNumberError = (value, tables) => {
  const raw = String(value || "").trim();
  if (!raw) return "Table number is required.";
  if (!/^\d+$/.test(raw)) return "Table number must contain only digits.";
  if (raw.length > MAX_TABLE_NUMBER_DIGITS) {
    return `Table number can be maximum ${MAX_TABLE_NUMBER_DIGITS} digits.`;
  }

  const normalized = normalizeTableNumber(raw);
  if (!normalized) return "Enter valid table number (example: 1, 2, 10).";

  const exists = (Array.isArray(tables) ? tables : []).some(
    (table) => normalizeTableNumber(table?.tableNo) === normalized
  );
  if (exists) return "Table already exists.";

  return "";
};

const getBaseUrlError = (value) => {
  const raw = String(value || "").trim();
  if (!raw) return "Phone Access URL is required.";

  const normalized = normalizeBaseUrl(raw);
  if (!normalized) {
    return "Enter valid URL (example: https://domain.com or http://192.168.1.10:3000).";
  }

  try {
    const parsed = new URL(normalized);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
      return "URL must start with http:// or https://";
    }
  } catch {
    return "Enter valid URL.";
  }

  if (isLocalHostUrl(normalized)) {
    return "localhost URL will not open on other phones. Use LAN IP or deployed domain.";
  }

  return "";
};

const areTablesEqual = (left, right) =>
  JSON.stringify(Array.isArray(left) ? left : []) ===
  JSON.stringify(Array.isArray(right) ? right : []);

export default function TablesPage() {
  const [tables, setTables] = useState(() => getTables());
  const [tableNo, setTableNo] = useState("");
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window === "undefined") return "";

    const storedBaseUrl = normalizeBaseUrl(
      localStorage.getItem(MENU_BASE_URL_KEY) || ""
    );
    const currentOrigin = normalizeBaseUrl(window.location.origin);
    return storedBaseUrl || currentOrigin;
  });
  const [formErrors, setFormErrors] = useState({
    tableNo: "",
    baseUrl: "",
  });

  useEffect(() => {
    const normalized = normalizeBaseUrl(baseUrl);

    if (!baseUrl.trim()) {
      localStorage.removeItem(MENU_BASE_URL_KEY);
      return;
    }

    if (normalized) {
      localStorage.setItem(MENU_BASE_URL_KEY, normalized);
    }
  }, [baseUrl]);

  useEffect(() => {
    const syncTablesFromStorage = () => {
      const latestTables = getTables();
      setTables((currentTables) =>
        areTablesEqual(currentTables, latestTables) ? currentTables : latestTables
      );
    };

    const intervalId = window.setInterval(
      syncTablesFromStorage,
      DASHBOARD_REFRESH_INTERVAL_MS
    );

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const getActiveBaseUrl = () => {
    const browserOrigin =
      typeof window !== "undefined" ? window.location.origin : "";

    return (
      normalizeBaseUrl(baseUrl) || normalizeBaseUrl(browserOrigin) || ""
    );
  };

  const buildMenuUrl = (tableNumber) => {
    const origin = getActiveBaseUrl();
    const params = new URLSearchParams();
    params.set("table", tableNumber);

    const qrMenuItems = sanitizeMenuForQr(getMenu());
    const compactPayload = serializeMenuForHash(qrMenuItems);
    let menuEmbedded = false;
    if (qrMenuItems.length > 0) {
      const candidate = `${origin}/menu?${params.toString()}#m=${compactPayload}`;
      if (candidate.length <= QR_SAFE_URL_LENGTH) {
        menuEmbedded = true;
      }
    }

    const paymentConfig = getPaymentConfig();
    const upiId = String(paymentConfig?.upiId || "").trim();
    const payeeName = String(paymentConfig?.payeeName || "").trim();

    if (upiId) params.set("upiId", upiId);
    if (payeeName) params.set("payeeName", payeeName);

    const baseUrl = `${origin}/menu?${params.toString()}`;
    const urlWithHash =
      menuEmbedded && compactPayload ? `${baseUrl}#m=${compactPayload}` : baseUrl;

    return {
      url: urlWithHash,
      menuEmbedded,
      hasMenu: qrMenuItems.length > 0,
    };
  };

  const persistTables = (nextTables) => {
    setTables(nextTables);
    saveTables(nextTables);
  };

  const addTable = () => {
    const tableNoError = getTableNumberError(tableNo, tables);
    const baseUrlError = getBaseUrlError(baseUrl);
    if (tableNoError || baseUrlError) {
      setFormErrors({
        tableNo: tableNoError,
        baseUrl: baseUrlError,
      });
      toast.error(tableNoError || baseUrlError);
      return;
    }

    const normalizedTable = normalizeTableNumber(tableNo);
    const activeBaseUrl = getActiveBaseUrl();
    if (!activeBaseUrl || isLocalHostUrl(activeBaseUrl)) {
      toast.error("Set Phone Access URL to LAN IP or deployed domain first");
      return;
    }

    const { url: qrUrl, menuEmbedded, hasMenu } = buildMenuUrl(normalizedTable);

    const nextTables = [
      ...tables,
      {
        id: `table-${Date.now()}`,
        tableNo: normalizedTable,
        qrUrl,
        createdAt: new Date().toISOString(),
      },
    ];

    persistTables(nextTables);
    setTableNo("");
    if (hasMenu && !menuEmbedded) {
      toast.error("Menu too large for QR. Reduce item names or item count.");
    } else {
      toast.success("QR generated");
    }
  };

  const deleteTable = (id) => {
    persistTables(tables.filter((table) => table.id !== id));
    toast.success("Table removed");
  };

  const copyURL = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("QR URL copied");
  };

  const openMenu = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Table QR Management
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Each table gets a unique QR but opens the same restaurant menu.
        </p>

        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="Enter table number (example: 1)"
              value={tableNo}
              onChange={(e) => {
                const nextValue = e.target.value
                  .replace(/\D/g, "")
                  .slice(0, MAX_TABLE_NUMBER_DIGITS);
                setTableNo(nextValue);
                if (formErrors.tableNo) {
                  setFormErrors((prev) => ({
                    ...prev,
                    tableNo: getTableNumberError(nextValue, tables),
                  }));
                }
              }}
              onBlur={() =>
                setFormErrors((prev) => ({
                  ...prev,
                  tableNo: getTableNumberError(tableNo, tables),
                }))
              }
              className={`flex-1 rounded-lg border px-4 py-2 ${
                formErrors.tableNo ? "border-red-500" : ""
              }`}
            />
            <button
              onClick={addTable}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Generate QR
            </button>
          </div>
          {formErrors.tableNo && (
            <p className="mt-2 text-xs font-medium text-red-600">
              {formErrors.tableNo}
            </p>
          )}

          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Access URL (for QR links)
            </label>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setBaseUrl(nextValue);
                  if (formErrors.baseUrl) {
                    setFormErrors((prev) => ({
                      ...prev,
                      baseUrl: getBaseUrlError(nextValue),
                    }));
                  }
                }}
                onBlur={() =>
                  setFormErrors((prev) => ({
                    ...prev,
                    baseUrl: getBaseUrlError(baseUrl),
                  }))
                }
                placeholder="https://your-domain.com or http://192.168.1.10:3000"
                className={`flex-1 rounded-lg border px-4 py-2 text-sm ${
                  formErrors.baseUrl ? "border-red-500" : ""
                }`}
              />
              <button
                onClick={() => {
                  const currentUrl = window.location.origin;
                  setBaseUrl(currentUrl);
                  setFormErrors((prev) => ({
                    ...prev,
                    baseUrl: getBaseUrlError(currentUrl),
                  }));
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Use Current URL
              </button>
            </div>
            {formErrors.baseUrl && (
              <p className="text-xs font-medium text-red-600">
                {formErrors.baseUrl}
              </p>
            )}
            <p className="text-xs text-gray-500">
              Use your LAN IP or deployed domain. Do not use localhost for
              mobile QR scans.
            </p>
            {isLocalHostUrl(getActiveBaseUrl()) && (
              <p className="text-xs font-medium text-red-600">
                Current QR base URL uses localhost, which will not open on other
                phones.
              </p>
            )}
          </div>

          <p className="mt-3 text-sm text-gray-500">
            QR opens table link and loads live menu from server.
          </p>
        </div>

        {tables.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No table QR generated yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              const { url: currentUrl, menuEmbedded, hasMenu } = buildMenuUrl(
                table.tableNo
              );

              return (
                <div key={table.id} className="rounded-xl bg-white p-6 shadow">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">
                      Table {table.tableNo}
                    </h2>
                    <button
                      onClick={() => deleteTable(table.id)}
                      className="text-red-600"
                      aria-label={`Delete table ${table.tableNo}`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="mb-4 flex justify-center rounded-lg border p-4">
                    <QRCode value={currentUrl} size={170} />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => copyURL(currentUrl)}
                      className="flex items-center justify-center gap-1 rounded bg-gray-200 p-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                    >
                      <Copy size={14} />
                      Copy
                    </button>
                    <button
                      onClick={() => openMenu(currentUrl)}
                      className="flex items-center justify-center gap-1 rounded bg-green-600 p-2 text-sm font-medium text-white hover:bg-green-700"
                    >
                      <ExternalLink size={14} />
                      Test
                    </button>
                  </div>
                  {hasMenu && !menuEmbedded && (
                    <p className="mt-2 text-xs font-medium text-red-600">
                      Menu not embedded: QR too long.
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
