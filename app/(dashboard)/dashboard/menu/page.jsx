"use client";

import { useEffect, useState } from "react";
import { getMenu, saveMenu } from "@/helper/storage";

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
        category: String(item.category || "Main Course"),
        price: Number(item.price) || 0,
      }))
      .filter((item) => item.name);
  } catch {
    return [];
  }
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState(null);
  const [menuSource, setMenuSource] = useState("local");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const queryItems = parseItemsQuery(params.get("items"));

    if (queryItems.length > 0) {
      setMenuItems(queryItems);
      setMenuSource("query");
      return;
    }

    setMenuItems(getMenu());
    setMenuSource("local");
  }, []);

  const persistMenu = (nextMenu) => {
    setMenuItems(nextMenu);
    saveMenu(nextMenu);
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
              category: form.category,
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
      category: form.category,
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
      category: item.category || "Main Course",
    });
  };

  const removeItem = (id) => {
    const nextMenu = menuItems.filter((item) => item.id !== id);
    persistMenu(nextMenu);
    if (editingId === id) {
      resetForm();
    }
  };

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
              <option>Main Course</option>
              <option>Starter</option>
              <option>Dessert</option>
              <option>Beverage</option>
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

          {menuItems.length === 0 ? (
            <p className="mt-3 text-sm text-gray-500">No items added yet.</p>
          ) : (
            <div className="mt-4 space-y-3">
              {menuItems.map((item) => (
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
                      {item.category || "Main Course"}
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <p className="font-bold text-green-600">Rs. {item.price}</p>
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
          )}
        </div>
      </div>
    </div>
  );
}
