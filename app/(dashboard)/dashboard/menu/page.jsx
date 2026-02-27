"use client";

import { useEffect, useState } from "react";
import { getMenu, saveMenu } from "@/helper/storage";

const MENU_CATEGORIES = ["Main Course", "Starter", "Dessert", "Beverage"];
const CATEGORY_FILTERS = ["All", ...MENU_CATEGORIES];
const MAX_ITEM_NAME_LENGTH = 80;
const MAX_ITEM_DESCRIPTION_LENGTH = 240;
const MAX_ITEM_PRICE = 100000;
const MENU_NAME_ALLOWED_CHARACTERS_REGEX = /^[\p{L}\s.'&()\-]+$/u;

const EMPTY_FORM_ERRORS = {
  name: "",
  price: "",
  description: "",
  category: "",
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const sanitizeText = (value, maxLength) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const sanitizeMenuNameInput = (value) =>
  String(value || "").replace(/\d+/g, "").slice(0, MAX_ITEM_NAME_LENGTH);

const isValidMenuItemName = (value) => {
  const name = sanitizeText(value, MAX_ITEM_NAME_LENGTH);
  return (
    name.length >= 2 &&
    MENU_NAME_ALLOWED_CHARACTERS_REGEX.test(name)
  );
};

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

const sanitizeMenuItem = (item, index, idPrefix = "menu-item") => {
  if (!item || typeof item !== "object") return null;

  const name = sanitizeText(item.name, MAX_ITEM_NAME_LENGTH);
  const description = sanitizeText(item.description, MAX_ITEM_DESCRIPTION_LENGTH);
  const category = normalizeCategory(item.category);
  const price = toNumber(item.price);

  if (name.length < 2) return null;
  if (price <= 0 || price > MAX_ITEM_PRICE) return null;

  return {
    id: sanitizeText(item.id, 64) || `${idPrefix}-${index}`,
    name,
    description,
    category,
    price,
    createdAt: item.createdAt || new Date().toISOString(),
  };
};

const buildDuplicateKey = (name, category) =>
  `${String(name || "").trim().toLowerCase()}|${normalizeCategory(category)}`;

const validateMenuForm = ({ form, menuItems, editingId }) => {
  const errors = { ...EMPTY_FORM_ERRORS };

  const name = sanitizeText(form.name, MAX_ITEM_NAME_LENGTH);
  const description = sanitizeText(
    form.description,
    MAX_ITEM_DESCRIPTION_LENGTH
  );
  const category = normalizeCategory(form.category);
  const price = toNumber(form.price);

  if (name.length < 2) {
    errors.name = "Item name must be at least 2 characters.";
  } else if (!isValidMenuItemName(name)) {
    errors.name = "Item name can contain letters only (no numbers).";
  }

  if (!form.price || !Number.isFinite(price)) {
    errors.price = "Enter a valid numeric price.";
  } else if (price <= 0 || price > MAX_ITEM_PRICE) {
    errors.price = `Price must be between 1 and ${MAX_ITEM_PRICE}.`;
  }

  if (String(form.description || "").trim().length > MAX_ITEM_DESCRIPTION_LENGTH) {
    errors.description = `Description can be maximum ${MAX_ITEM_DESCRIPTION_LENGTH} characters.`;
  }

  if (!MENU_CATEGORIES.includes(category)) {
    errors.category = "Select a valid category.";
  }

  const candidateKey = buildDuplicateKey(name, category);
  const isDuplicate = (Array.isArray(menuItems) ? menuItems : []).some(
    (item) =>
      item.id !== editingId &&
      buildDuplicateKey(item.name, item.category) === candidateKey
  );
  if (name && isDuplicate) {
    errors.name = "Same item already exists in this category.";
  }

  return {
    isValid: !Object.values(errors).some(Boolean),
    errors,
    normalized: {
      name,
      description,
      category,
      price,
    },
  };
};

const parseItemsQuery = (value) => {
  if (!value) return [];

  try {
    const parsed = JSON.parse(value);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item, index) => sanitizeMenuItem(item, index, "query-item"))
      .filter(Boolean);
  } catch {
    return [];
  }
};

const sanitizeMenuItems = (value) => {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => sanitizeMenuItem(item, index))
    .filter(Boolean);
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
  const [formErrors, setFormErrors] = useState(EMPTY_FORM_ERRORS);
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
    setFormErrors(EMPTY_FORM_ERRORS);
    setEditingId(null);
  };

  const submitItem = () => {
    const { isValid, errors, normalized } = validateMenuForm({
      form,
      menuItems,
      editingId,
    });
    if (!isValid) {
      setFormErrors(errors);
      return;
    }

    setFormErrors(EMPTY_FORM_ERRORS);

    if (editingId) {
      const updated = menuItems.map((item) =>
        item.id === editingId
          ? {
              ...item,
              name: normalized.name,
              description: normalized.description,
              price: normalized.price,
              category: normalized.category,
            }
          : item
      );
      persistMenu(updated);
      resetForm();
      return;
    }

    const newItem = {
      id: `menu-${Date.now()}`,
      name: normalized.name,
      description: normalized.description,
      price: normalized.price,
      category: normalized.category,
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
    setFormErrors(EMPTY_FORM_ERRORS);
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
              maxLength={MAX_ITEM_NAME_LENGTH}
              onChange={(e) => {
                setForm({ ...form, name: sanitizeMenuNameInput(e.target.value) });
                if (formErrors.name) {
                  setFormErrors((prev) => ({ ...prev, name: "" }));
                }
              }}
              className="w-full rounded-lg border px-4 py-2"
            />
            {formErrors.name && (
              <p className="-mt-1 text-xs font-medium text-red-600">
                {formErrors.name}
              </p>
            )}

            <input
              type="number"
              min="1"
              max={MAX_ITEM_PRICE}
              step="0.01"
              placeholder="Price"
              value={form.price}
              onChange={(e) => {
                const nextValue = e.target.value;
                if (nextValue === "" || /^\d{0,6}(\.\d{0,2})?$/.test(nextValue)) {
                  setForm({ ...form, price: nextValue });
                  if (formErrors.price) {
                    setFormErrors((prev) => ({ ...prev, price: "" }));
                  }
                }
              }}
              className="w-full rounded-lg border px-4 py-2"
            />
            {formErrors.price && (
              <p className="-mt-1 text-xs font-medium text-red-600">
                {formErrors.price}
              </p>
            )}

            <select
              value={form.category}
              onChange={(e) => {
                setForm({ ...form, category: e.target.value });
                if (formErrors.category) {
                  setFormErrors((prev) => ({ ...prev, category: "" }));
                }
              }}
              className="w-full rounded-lg border px-4 py-2"
            >
              {MENU_CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            {formErrors.category && (
              <p className="-mt-1 text-xs font-medium text-red-600">
                {formErrors.category}
              </p>
            )}

            <textarea
              placeholder="Description"
              value={form.description}
              maxLength={MAX_ITEM_DESCRIPTION_LENGTH}
              onChange={(e) => {
                setForm({ ...form, description: e.target.value });
                if (formErrors.description) {
                  setFormErrors((prev) => ({ ...prev, description: "" }));
                }
              }}
              className="w-full rounded-lg border px-4 py-2 md:col-span-2"
              rows={3}
            />
            {formErrors.description && (
              <p className="-mt-1 text-xs font-medium text-red-600 md:col-span-2">
                {formErrors.description}
              </p>
            )}
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
