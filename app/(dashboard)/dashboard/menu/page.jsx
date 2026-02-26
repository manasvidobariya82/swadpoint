"use client";

import { useEffect, useState } from "react";
import { getMenu, saveMenu } from "@/helper/storage";

const MENU_CATEGORIES = ["Main Course", "Starter", "Dessert", "Beverage"];
const CATEGORY_FILTERS = ["All", ...MENU_CATEGORIES];

const normalizeCategory = (value) => {
  const category = String(value || "").trim();
  return MENU_CATEGORIES.includes(category) ? category : "Main Course";
};

const EMPTY_FORM = {
  name: "",
  price: "",
  description: "",
  category: "Main Course",
};

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
        category: normalizeCategory(item.category),
        price: Number(item.price) || 0,
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
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
      price: Number(item.price) || 0,
      createdAt: item.createdAt || new Date().toISOString(),
    }))
    .filter((item) => item.name);
};

const fetchMenuFromServer = async () => {
  const response = await fetch("/api/menu", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch menu");
  const data = await response.json();
  return sanitizeMenuItems(data);
};

const saveMenuToServer = async (menuItems) => {
  await fetch("/api/menu", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(sanitizeMenuItems(menuItems)),
  });
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState(() => {
    if (typeof window === "undefined") return [];

    const params = new URLSearchParams(window.location.search);
    const queryItems = parseItemsQuery(params.get("items"));
    if (queryItems.length > 0) return queryItems;

    return sanitizeMenuItems(getMenu());
  });
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [menuSource, setMenuSource] = useState(() => {
    if (typeof window === "undefined") return "local";
    const params = new URLSearchParams(window.location.search);
    const queryItems = parseItemsQuery(params.get("items"));
    return queryItems.length > 0 ? "query" : "local";
  });
  const [activeCategory, setActiveCategory] = useState("All");

  useEffect(() => {
    let isCancelled = false;
    if (menuSource === "query") {
      return () => {
        isCancelled = true;
      };
    }

    const localMenu = sanitizeMenuItems(getMenu());

    const loadServerMenu = async () => {
      try {
        const serverMenu = await fetchMenuFromServer();
        if (isCancelled) return;

        if (serverMenu.length > 0 || localMenu.length === 0) {
          setMenuItems(serverMenu);
          saveMenu(serverMenu);
        } else {
          void saveMenuToServer(localMenu);
        }
        setMenuSource("server");
      } catch {
        // Keep local menu if server request fails.
      }
    };

    loadServerMenu();

    return () => {
      isCancelled = true;
    };
  }, [menuSource]);

  const persistMenu = (nextMenu) => {
    const normalizedMenu = sanitizeMenuItems(nextMenu);
    setMenuItems(normalizedMenu);
    saveMenu(normalizedMenu);

    if (menuSource !== "query") {
      void saveMenuToServer(normalizedMenu);
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
  };

  const submitItem = () => {
    const name = form.name.trim();
    const description = form.description.trim();
    const price = Number(form.price);

    if (!name || !price || price <= 0) {
      alert("Please enter a valid name and price.");
      return;
    }

    if (editingId) {
      const updated = menuItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name,
              description,
              price,
              category: normalizeCategory(form.category),
            }
          : item
      );
      persistMenu(updated);
      resetForm();
      return;
    }

    const newItem = {
      id: `menu-${Date.now()}`,
      name,
      description,
      price,
      category: normalizeCategory(form.category),
      createdAt: new Date().toISOString(),
    };

    persistMenu([...menuItems, newItem]);
    resetForm();
  };

  const startEdit = (item) => {
    setEditingId(item.id);
    setForm({
      name: item.name || "",
      price: String(item.price || ""),
      description: item.description || "",
      category: normalizeCategory(item.category),
    });
  };

  const removeItem = (id) => {
    const nextMenu = menuItems.filter((item) => item.id !== id);
    persistMenu(nextMenu);
    if (editingId === id) {
      resetForm();
    }
  };

  const filteredItems = menuItems.filter((item) =>
    activeCategory === "All"
      ? true
      : normalizeCategory(item.category) === activeCategory
  );

  const groupedItems = MENU_CATEGORIES.map((category) => ({
    category,
    items: filteredItems.filter(
      (item) => normalizeCategory(item.category) === category
    ),
  })).filter((group) => group.items.length > 0);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="rounded-xl bg-white p-5 shadow">
          <h1 className="text-2xl font-bold text-gray-900">
            Admin Menu Management
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Add and edit items for all table QR menus.
          </p>
          {menuSource === "query" && (
            <p className="mt-2 text-sm font-medium text-blue-600">
              Showing menu items from URL query param `items`.
            </p>
          )}
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              placeholder="Item name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-lg border px-4 py-2"
            />

            <input
              type="number"
              min="1"
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="w-full rounded-lg border px-4 py-2"
            />

            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full rounded-lg border px-4 py-2"
            >
              {MENU_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>

            <textarea
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full rounded-lg border px-4 py-2 md:col-span-2"
              rows={3}
            />
          </div>

          <div className="mt-4 flex gap-3">
            <button
              onClick={submitItem}
              className="rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              {editingId ? "Update Item" : "Add Item"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-2 font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-lg font-semibold text-gray-900">Menu Items</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`rounded-full border px-4 py-1.5 text-sm font-medium ${
                  activeCategory === category
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {menuItems.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No items added yet.</p>
          ) : groupedItems.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">
              No items found for {activeCategory}.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {groupedItems.map((group) => (
                <div key={group.category} className="space-y-3">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                    {group.category}
                  </h3>
                  {group.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex flex-col justify-between gap-3 rounded-lg border p-4 md:flex-row md:items-center"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.description || "No description"}
                        </p>
                        <p className="mt-1 text-sm text-gray-600">
                          {normalizeCategory(item.category)}
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <p className="font-bold text-green-600">
                          Rs. {item.price}
                        </p>
                        <button
                          onClick={() => startEdit(item)}
                          className="rounded border border-blue-200 px-3 py-1 text-sm text-blue-700 hover:bg-blue-50"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="rounded border border-red-200 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
