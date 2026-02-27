"use client";

import { useEffect, useMemo, useState } from "react";
import { Edit3, Plus, Search, Trash2 } from "lucide-react";

const INVENTORY_STORAGE_KEY = "restaurantInventory";

const EMPTY_FORM = {
  name: "",
  category: "",
  currentStock: "",
  minStock: "",
  unit: "kg",
  pricePerUnit: "",
  supplier: "",
};

const readInventory = () => {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(INVENTORY_STORAGE_KEY);
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === "object")
      .map((item, index) => ({
        id: item.id || `inv-${index}-${Date.now()}`,
        name: String(item.name || "").trim(),
        category: String(item.category || "").trim(),
        currentStock: Number(item.currentStock) || 0,
        minStock: Number(item.minStock) || 0,
        unit: String(item.unit || "kg").trim() || "kg",
        pricePerUnit: Number(item.pricePerUnit) || 0,
        supplier: String(item.supplier || "").trim(),
        lastUpdated: item.lastUpdated || new Date().toISOString(),
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
};

const saveInventory = (items) => {
  if (typeof window === "undefined") return;
  localStorage.setItem(INVENTORY_STORAGE_KEY, JSON.stringify(items));
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
  const [editingId, setEditingId] = useState(null);

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
    const outItems = inventory.filter((item) => getStockStatus(item) === "Out").length;
    const lowItems = inventory.filter((item) => getStockStatus(item) === "Low").length;
    const totalValue = inventory.reduce(
      (sum, item) => sum + item.currentStock * item.pricePerUnit,
      0
    );

    return { totalItems, outItems, lowItems, totalValue };
  }, [inventory]);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const handleSubmit = () => {
    const name = form.name.trim();
    const category = form.category.trim();
    const supplier = form.supplier.trim();
    const currentStock = Number(form.currentStock);
    const minStock = Number(form.minStock);
    const pricePerUnit = Number(form.pricePerUnit);
    const unit = String(form.unit || "kg").trim() || "kg";

    if (!name || !category || Number.isNaN(currentStock) || Number.isNaN(minStock)) {
      alert("Please enter valid name, category, current stock, and min stock.");
      return;
    }

    const payload = {
      name,
      category,
      supplier,
      unit,
      currentStock: Math.max(0, currentStock),
      minStock: Math.max(0, minStock),
      pricePerUnit: Number.isNaN(pricePerUnit) ? 0 : Math.max(0, pricePerUnit),
      lastUpdated: new Date().toISOString(),
    };

    if (editingId) {
      setInventory((prev) =>
        prev.map((item) => (item.id === editingId ? { ...item, ...payload } : item))
      );
      resetForm();
      return;
    }

    setInventory((prev) => [
      { id: `inv-${Date.now()}`, ...payload },
      ...prev,
    ]);
    resetForm();
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
  };

  const removeItem = (id) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      resetForm();
    }
  };

  const adjustStock = (id, delta) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStock: Math.max(0, item.currentStock + delta),
              lastUpdated: new Date().toISOString(),
            }
          : item
      )
    );
  };

  return (
    <div className="mx-auto w-full max-w-7xl space-y-6">
      <div className="rounded-2xl bg-white p-5 shadow">
        <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
        <p className="mt-1 text-sm text-gray-600">
          Dynamic stock management with filters, live status, and quick actions.
        </p>
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
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search name, category, supplier"
              className="w-full rounded-lg border py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
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
            onChange={(e) => setStatusFilter(e.target.value)}
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
          <input
            value={form.name}
            onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="Item name"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.category}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, category: e.target.value }))
            }
            placeholder="Category"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.currentStock}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, currentStock: e.target.value }))
            }
            placeholder="Current stock"
            type="number"
            min="0"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.minStock}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, minStock: e.target.value }))
            }
            placeholder="Minimum stock"
            type="number"
            min="0"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.pricePerUnit}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, pricePerUnit: e.target.value }))
            }
            placeholder="Price per unit"
            type="number"
            min="0"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.supplier}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, supplier: e.target.value }))
            }
            placeholder="Supplier"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <input
            value={form.unit}
            onChange={(e) => setForm((prev) => ({ ...prev, unit: e.target.value }))}
            placeholder="Unit (kg, ltr, pcs)"
            className="rounded-lg border px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus className="h-4 w-4" />
              {editingId ? "Update" : "Add"}
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
              <div
                key={item.id}
                className="rounded-xl border bg-white p-4 shadow-sm"
              >
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
                      onClick={() => adjustStock(item.id, -1)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      -1
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 1)}
                      className="rounded-lg border px-3 py-1 text-sm hover:bg-gray-50"
                    >
                      +1
                    </button>
                    <button
                      onClick={() => adjustStock(item.id, 5)}
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
                      onClick={() => removeItem(item.id)}
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
