"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast, Toaster } from "react-hot-toast";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { getMenu, getPaymentConfig, getTables, saveTables } from "@/helper/storage";

const MENU_BASE_URL_KEY = "restaurantMenuBaseUrl";
const DEFAULT_MENU_CATEGORY = "Main Course";

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

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === "object")
    .map((item, index) => ({
      id: item.id || `menu-item-${index}`,
      name: String(item.name || "").trim(),
      description: String(item.description || "").trim(),
      category: normalizeMenuCategory(item.category),
      price: Number(item.price) || 0,
    }))
    .filter((item) => item.name);
};

export default function TablesPage() {
  const [tables, setTables] = useState(() => getTables());
  const [menuItems] = useState(() => getMenu());
  const [tableNo, setTableNo] = useState("");
  const [baseUrl, setBaseUrl] = useState(() => {
    if (typeof window === "undefined") return "";

    const storedBaseUrl = normalizeBaseUrl(
      localStorage.getItem(MENU_BASE_URL_KEY) || ""
    );
    const currentOrigin = normalizeBaseUrl(window.location.origin);
    return storedBaseUrl || currentOrigin;
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

    const compactItems = sanitizeMenuItems(menuItems);
    if (compactItems.length > 0) {
      params.set("items", JSON.stringify(compactItems));
    }

    const paymentConfig = getPaymentConfig();
    const upiId = String(paymentConfig?.upiId || "").trim();
    const payeeName = String(paymentConfig?.payeeName || "").trim();

    if (upiId) params.set("upiId", upiId);
    if (payeeName) params.set("payeeName", payeeName);

    return `${origin}/menu?${params.toString()}`;
  };

  const persistTables = (nextTables) => {
    setTables(nextTables);
    saveTables(nextTables);
  };

  const addTable = () => {
    const normalizedTable = tableNo.trim();
    if (!normalizedTable) {
      toast.error("Enter table number");
      return;
    }

    const activeBaseUrl = getActiveBaseUrl();
    if (!activeBaseUrl || isLocalHostUrl(activeBaseUrl)) {
      toast.error("Set Phone Access URL to LAN IP or deployed domain first");
      return;
    }

    if (tables.some((table) => table.tableNo === normalizedTable)) {
      toast.error("Table already exists");
      return;
    }

    const qrUrl = buildMenuUrl(normalizedTable);

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
    toast.success("QR generated");
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
              placeholder="Enter table number (example: T1)"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="flex-1 rounded-lg border px-4 py-2"
            />
            <button
              onClick={addTable}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Generate QR
            </button>
          </div>

          <div className="mt-4 space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Phone Access URL (for QR links)
            </label>
            <div className="flex flex-col gap-2 md:flex-row">
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://your-domain.com or http://192.168.1.10:3000"
                className="flex-1 rounded-lg border px-4 py-2 text-sm"
              />
              <button
                onClick={() => setBaseUrl(window.location.origin)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Use Current URL
              </button>
            </div>
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
            QR contains table + menu data for direct customer ordering.
          </p>
        </div>

        {tables.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No table QR generated yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => {
              const currentUrl = buildMenuUrl(table.tableNo);

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
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
