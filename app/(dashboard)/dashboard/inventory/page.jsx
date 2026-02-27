"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Edit3, Plus, RefreshCw, Search, Trash2 } from "lucide-react";

const INVENTORY_STORAGE_KEY = "restaurantInventory";
const MAX_STOCK_VALUE = 999999;
const MAX_PRICE_PER_UNIT = 100000;
const MAX_TEXT_LENGTH = 80;
const ALLOWED_UNITS = ["kg", "gm", "ltr", "ml", "pcs", "pack", "bottle"];
const DASHBOARD_REFRESH_INTERVAL_MS = 5000;

const EMPTY_FORM = {
  name: "",
  category: "",
  currentStock: "",
  minStock: "",
  unit: "kg",
  pricePerUnit: "",
  supplier: "",
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value, maxLength = MAX_TEXT_LENGTH) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const normalizeUnit = (value) => {
  const normalized = normalizeText(value, 12).toLowerCase();
  return ALLOWED_UNITS.includes(normalized) ? normalized : "kg";
};

const normalizeWholeNumber = (value, max = MAX_STOCK_VALUE) =>
  Math.max(0, Math.min(max, Math.floor(toNumber(value))));

const normalizeAmount = (value, max = MAX_PRICE_PER_UNIT) =>
  Math.max(0, Math.min(max, toNumber(value)));

const normalizeInventoryItem = (item, index = 0) => {
  const source = item && typeof item === "object" ? item : {};

  return {
    id: normalizeText(source.id) || `inv-${Date.now()}-${index}`,
    name: normalizeText(source.name),
    category: normalizeText(source.category),
    currentStock: normalizeWholeNumber(source.currentStock),
    minStock: normalizeWholeNumber(source.minStock),
    unit: normalizeUnit(source.unit),
    pricePerUnit: normalizeAmount(source.pricePerUnit),
    supplier: normalizeText(source.supplier),
    lastUpdated: source.lastUpdated || new Date().toISOString(),
  };
};

const EMPTY_FORM_ERRORS = {
  name: "",
  category: "",
  currentStock: "",
  minStock: "",
  unit: "",
  pricePerUnit: "",
  supplier: "",
};

const validateInventoryForm = ({ form, inventory, editingId }) => {
  const errors = { ...EMPTY_FORM_ERRORS };

  const name = normalizeText(form.name);
  const category = normalizeText(form.category);
  const supplier = normalizeText(form.supplier);
  const unit = normalizeUnit(form.unit);
  const currentStockRaw = form.currentStock;
  const minStockRaw = form.minStock;
  const priceRaw = form.pricePerUnit;

  const currentStock = normalizeWholeNumber(currentStockRaw);
  const minStock = normalizeWholeNumber(minStockRaw);
  const pricePerUnit = normalizeAmount(priceRaw);

  if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  }

  if (category.length < 2) {
    errors.category = "Category must be at least 2 characters.";
  }

  if (currentStockRaw === "" || !/^\d+(\.\d+)?$/.test(String(currentStockRaw))) {
    errors.currentStock = "Enter valid current stock.";
  }

  if (minStockRaw === "" || !/^\d+(\.\d+)?$/.test(String(minStockRaw))) {
    errors.minStock = "Enter valid minimum stock.";
  }

  if (priceRaw && !/^\d+(\.\d{1,2})?$/.test(String(priceRaw))) {
    errors.pricePerUnit = "Price must be numeric (up to 2 decimals).";
  }

  if (!ALLOWED_UNITS.includes(unit)) {
    errors.unit = `Allowed units: ${ALLOWED_UNITS.join(", ")}`;
  }

  if (supplier.length > MAX_TEXT_LENGTH) {
    errors.supplier = `Supplier name max ${MAX_TEXT_LENGTH} characters.`;
  }

  const candidateKey = `${name.toLowerCase()}|${category.toLowerCase()}`;
  const duplicateExists = (Array.isArray(inventory) ? inventory : []).some(
    (item) =>
      item.id !== editingId &&
      `${normalizeText(item.name).toLowerCase()}|${normalizeText(
        item.category
      ).toLowerCase()}` === candidateKey
  );
  if (name && category && duplicateExists) {
    errors.name = "Same item already exists in this category.";
  }

  return {
    isValid: !Object.values(errors).some(Boolean),
    errors,
    payload: {
      name,
      category,
      supplier,
      unit,
      currentStock,
      minStock,
      pricePerUnit,
      lastUpdated: new Date().toISOString(),
    },
  };
};

const normalizeInventoryList = (items) =>
  (Array.isArray(items) ? items : [])
    .map((item, index) => normalizeInventoryItem(item, index))
    .filter((item) => item.name);

const readInventory = () => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    return normalizeInventoryList(parsed);
  } catch {
    return [];
  }
};

const saveInventory = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    INVENTORY_STORAGE_KEY,
    JSON.stringify(normalizeInventoryList(items))
  );
};

const fetchInventoryFromApi = async () => {
  const response = await fetch("/api/inventory", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch inventory");
  return response.json();
};

const createInventoryItemApi = async (payload) => {
  const response = await fetch("/api/inventory", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) throw new Error("Failed to create inventory item");
  return response.json();
};

const updateInventoryItemApi = async (id, payload) => {
  const response = await fetch("/api/inventory", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...payload }),
  });
  if (!response.ok) throw new Error("Failed to update inventory item");
  return response.json();
};

const deleteInventoryItemApi = async (id) => {
  const response = await fetch("/api/inventory", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!response.ok) throw new Error("Failed to delete inventory item");
  return response.json();
};

const getStockStatus = (item) => {
  if (item.currentStock <= 0) return "Out";
  if (item.currentStock < item.minStock) return "Low";
  return "Good";
};

const statusClasses = {
  Out: "bg-red-100 text-red-700",
  Low: "bg-amber-100 text-amber-700",
  Good: "bg-emerald-100 text-emerald-700",
};

export default function InventoryPage() {
  const [inventory, setInventory] = useState(() => readInventory());
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [form, setForm] = useState(EMPTY_FORM);
  const [formErrors, setFormErrors] = useState(EMPTY_FORM_ERRORS);
  const [editingId, setEditingId] = useState(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const loadInventory = useCallback(async () => {
    try {
      setIsSyncing(true);
      const serverItems = normalizeInventoryList(await fetchInventoryFromApi());
      setInventory(serverItems);
      saveInventory(serverItems);
    } catch {
      setInventory(readInventory());
    } finally {
      setIsSyncing(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void loadInventory();
    }, 0);
    const intervalId = window.setInterval(() => {
      void loadInventory();
    }, DASHBOARD_REFRESH_INTERVAL_MS);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, [loadInventory]);

  useEffect(() => {
    saveInventory(inventory);
  }, [inventory]);

  const categories = useMemo(() => {
    const set = new Set(inventory.map((item) => item.category).filter(Boolean));
    return ["All", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase()) ||
        item.supplier.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;
      const status = getStockStatus(item);
      const matchesStatus = statusFilter === "All" || status === statusFilter;
      return matchesQuery && matchesCategory && matchesStatus;
    });
  }, [inventory, query, categoryFilter, statusFilter]);

  const stats = useMemo(() => {
    const totalItems = inventory.length;
    const outItems = inventory.filter(
      (item) => getStockStatus(item) === "Out"
    ).length;
    const lowItems = inventory.filter(
      (item) => getStockStatus(item) === "Low"
    ).length;
    const totalValue = inventory.reduce(
      (sum, item) => sum + item.currentStock * item.pricePerUnit,
      0
    );

    return { totalItems, outItems, lowItems, totalValue };
  }, [inventory]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setFormErrors(EMPTY_FORM_ERRORS);
    setEditingId(null);
  };

  const handleSubmit = async () => {
    const { isValid, errors, payload } = validateInventoryForm({
      form,
      inventory,
      editingId,
    });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }
    setFormErrors(EMPTY_FORM_ERRORS);

    try {
      setIsSaving(true);

      if (editingId) {
        await updateInventoryItemApi(editingId, payload);
        await loadInventory();
      } else {
        const nextItem = {
          id: `inv-${Date.now()}`,
          ...payload,
        };
        await createInventoryItemApi(nextItem);
        await loadInventory();
      }
    } catch {
      if (editingId) {
        setInventory((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...payload } : item
          )
        );
      } else {
        setInventory((prev) => [{ id: `inv-${Date.now()}`, ...payload }, ...prev]);
      }
    } finally {
      setIsSaving(false);
      resetForm();
    }
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name,
      category: item.category,
      currentStock: String(item.currentStock),
      minStock: String(item.minStock),
      unit: item.unit,
      pricePerUnit: String(item.pricePerUnit),
      supplier: item.supplier,
    });
    setFormErrors(EMPTY_FORM_ERRORS);
  };

  const removeItem = async (id) => {
    try {
      setIsSaving(true);
      await deleteInventoryItemApi(id);
      await loadInventory();
    } catch {
      setInventory((prev) => prev.filter((item) => item.id !== id));
    } finally {
      setIsSaving(false);
      if (editingId === id) {
        resetForm();
      }
    }
  };

  const adjustStock = async (id, delta) => {
    const currentItem = inventory.find((item) => item.id === id);
    if (!currentItem) return;
    if (!Number.isInteger(delta) || Math.abs(delta) > 1000) return;

    const nextStock = Math.max(
      0,
      Math.min(MAX_STOCK_VALUE, currentItem.currentStock + delta)
    );
    const payload = {
      ...currentItem,
      currentStock: nextStock,
      lastUpdated: new Date().toISOString(),
    };

    try {
      setIsSaving(true);
      await updateInventoryItemApi(id, payload);
      await loadInventory();
    } catch {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === id
            ? { ...item, currentStock: nextStock, lastUpdated: payload.lastUpdated }
            : item
        )
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
            <p className="mt-1 text-sm text-gray-600">
              Dynamic stock management with server sync and offline fallback.
            </p>
          </div>
          <button
            onClick={() => void loadInventory()}
            disabled={isSyncing}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Syncing..." : "Sync"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Total Items</p>
          <p className="mt-1 text-2xl font-bold text-gray-900">{stats.totalItems}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Low Stock</p>
          <p className="mt-1 text-2xl font-bold text-amber-600">{stats.lowItems}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Out of Stock</p>
          <p className="mt-1 text-2xl font-bold text-red-600">{stats.outItems}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Inventory Value</p>
          <p className="mt-1 text-2xl font-bold text-emerald-700">
            Rs. {stats.totalValue.toFixed(2)}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 sm:p-5">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              maxLength={60}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, category, supplier"
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => {
              const nextValue = e.target.value;
              if (categories.includes(nextValue)) {
                setCategoryFilter(nextValue);
              }
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(e) => {
              const nextValue = e.target.value;
              if (["All", "Good", "Low", "Out"].includes(nextValue)) {
                setStatusFilter(nextValue);
              }
            }}
            className="rounded-lg border px-3 py-2 text-sm"
          >
            <option value="All">All Status</option>
            <option value="Good">Good</option>
            <option value="Low">Low</option>
            <option value="Out">Out</option>
          </select>
        </div>
      </div>

      <div className="rounded-2xl border bg-white p-4 sm:p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          {editingId ? "Edit Item" : "Add Item"}
        </h2>
        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          <div>
            <input
              value={form.name}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, name: e.target.value }));
                if (formErrors.name) {
                  setFormErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              placeholder="Item name"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.name ? "border-red-500" : ""
              }`}
            />
            {formErrors.name && (
              <p className="mt-1 text-xs font-medium text-red-600">{formErrors.name}</p>
            )}
          </div>
          <div>
            <input
              value={form.category}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, category: e.target.value }));
                if (formErrors.category) {
                  setFormErrors((prev) => ({ ...prev, category: "" }));
                }
              }}
              placeholder="Category"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.category ? "border-red-500" : ""
              }`}
            />
            {formErrors.category && (
              <p className="mt-1 text-xs font-medium text-red-600">{formErrors.category}</p>
            )}
          </div>
          <div>
            <input
              value={form.currentStock}
              onChange={(e) => {
                const nextValue = e.target.value;
                if (nextValue === "" || /^\d{0,6}$/.test(nextValue)) {
                  setForm((prev) => ({ ...prev, currentStock: nextValue }));
                  if (formErrors.currentStock) {
                    setFormErrors((prev) => ({ ...prev, currentStock: "" }));
                  }
                }
              }}
              placeholder="Current stock"
              type="number"
              min="0"
              max={MAX_STOCK_VALUE}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.currentStock ? "border-red-500" : ""
              }`}
            />
            {formErrors.currentStock && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.currentStock}
              </p>
            )}
          </div>
          <div>
            <input
              value={form.minStock}
              onChange={(e) => {
                const nextValue = e.target.value;
                if (nextValue === "" || /^\d{0,6}$/.test(nextValue)) {
                  setForm((prev) => ({ ...prev, minStock: nextValue }));
                  if (formErrors.minStock) {
                    setFormErrors((prev) => ({ ...prev, minStock: "" }));
                  }
                }
              }}
              placeholder="Minimum stock"
              type="number"
              min="0"
              max={MAX_STOCK_VALUE}
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.minStock ? "border-red-500" : ""
              }`}
            />
            {formErrors.minStock && (
              <p className="mt-1 text-xs font-medium text-red-600">{formErrors.minStock}</p>
            )}
          </div>
          <div>
            <input
              value={form.pricePerUnit}
              onChange={(e) => {
                const nextValue = e.target.value;
                if (nextValue === "" || /^\d{0,6}(\.\d{0,2})?$/.test(nextValue)) {
                  setForm((prev) => ({ ...prev, pricePerUnit: nextValue }));
                  if (formErrors.pricePerUnit) {
                    setFormErrors((prev) => ({ ...prev, pricePerUnit: "" }));
                  }
                }
              }}
              placeholder="Price per unit"
              type="number"
              min="0"
              max={MAX_PRICE_PER_UNIT}
              step="0.01"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.pricePerUnit ? "border-red-500" : ""
              }`}
            />
            {formErrors.pricePerUnit && (
              <p className="mt-1 text-xs font-medium text-red-600">
                {formErrors.pricePerUnit}
              </p>
            )}
          </div>
          <div>
            <input
              value={form.supplier}
              maxLength={MAX_TEXT_LENGTH}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, supplier: e.target.value }));
                if (formErrors.supplier) {
                  setFormErrors((prev) => ({ ...prev, supplier: "" }));
                }
              }}
              placeholder="Supplier"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.supplier ? "border-red-500" : ""
              }`}
            />
            {formErrors.supplier && (
              <p className="mt-1 text-xs font-medium text-red-600">{formErrors.supplier}</p>
            )}
          </div>
          <div>
            <input
              value={form.unit}
              list="inventory-units"
              maxLength={12}
              onChange={(e) => {
                setForm((prev) => ({ ...prev, unit: e.target.value.toLowerCase() }));
                if (formErrors.unit) {
                  setFormErrors((prev) => ({ ...prev, unit: "" }));
                }
              }}
              placeholder="Unit (kg, ltr, pcs)"
              className={`w-full rounded-lg border px-3 py-2 text-sm ${
                formErrors.unit ? "border-red-500" : ""
              }`}
            />
            <datalist id="inventory-units">
              {ALLOWED_UNITS.map((unitOption) => (
                <option key={unitOption} value={unitOption} />
              ))}
            </datalist>
            {formErrors.unit && (
              <p className="mt-1 text-xs font-medium text-red-600">{formErrors.unit}</p>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => void handleSubmit()}
              disabled={isSaving}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Plus className="h-4 w-4" />
              {isSaving ? "Saving..." : editingId ? "Update" : "Add"}
            </button>
            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-lg border px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {filteredInventory.length === 0 ? (
          <div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-500">
            No inventory items found.
          </div>
        ) : (
          filteredInventory.map((item) => {
            const status = getStockStatus(item);
            return (
              <div key={item.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-base font-semibold text-gray-900">
                        {item.name}
                      </p>
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                          statusClasses[status]
                        }`}
                      >
                        {status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {item.category || "Uncategorized"}
                      {item.supplier ? ` | ${item.supplier}` : ""}
                    </p>
                    <p className="text-sm text-gray-700">
                      Stock: <span className="font-semibold">{item.currentStock}</span>{" "}
                      {item.unit} (Min: {item.minStock})
                    </p>
                    <p className="text-sm text-gray-700">
                      Price: Rs. {item.pricePerUnit} / {item.unit}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => void adjustStock(item.id, -1)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => void adjustStock(item.id, 1)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => void adjustStock(item.id, 5)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      +5
                    </button>
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1 rounded-lg border border-blue-200 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                    >
                      <Edit3 className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => void removeItem(item.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

