"use client";

import { useEffect, useMemo, useState } from "react";

const CATEGORY_ORDER = ["Starter", "Main Course", "Dessert", "Beverage"];

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

export default function PublicMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadMenu = async () => {
      try {
        setError("");

        const response = await fetch("/api/menu", {
          method: "GET",
          cache: "no-store",
        });
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          throw new Error(data?.error || "Failed to load menu");
        }

        if (!cancelled) {
          setMenuItems(Array.isArray(data) ? data : []);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError?.message || "Failed to load menu");
          setMenuItems([]);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      cancelled = true;
    };
  }, []);

  const groupedMenu = useMemo(() => {
    const map = new Map();

    for (const category of CATEGORY_ORDER) {
      map.set(category, []);
    }

    for (const item of menuItems) {
      const category = CATEGORY_ORDER.includes(item?.category)
        ? item.category
        : "Main Course";
      const list = map.get(category) || [];
      list.push(item);
      map.set(category, list);
    }

    return CATEGORY_ORDER.map((category) => ({
      category,
      items: map.get(category) || [],
    })).filter((group) => group.items.length > 0);
  }, [menuItems]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff_40%,_#e0f2fe)] px-4 py-10 text-slate-900">
      <div className="mx-auto max-w-5xl">
        <div className="rounded-[32px] bg-white/85 p-6 shadow-xl backdrop-blur md:p-10">
          <div className="flex flex-col gap-4 border-b border-slate-200 pb-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-700">
                SwadPoint
              </p>
              <h1 className="mt-2 text-4xl font-black tracking-tight">
                Live Menu
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-slate-600">
                This customer menu is loaded from the live database through
                `/api/menu`. Add or edit items from the dashboard menu section.
              </p>
            </div>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
            >
              Refresh Menu
            </button>
          </div>

          {isLoading ? (
            <div className="py-16 text-center text-slate-500">
              Loading menu...
            </div>
          ) : error ? (
            <div className="py-16 text-center">
              <p className="text-sm font-semibold text-red-600">{error}</p>
              <p className="mt-2 text-sm text-slate-500">
                Check your production database connection and try again.
              </p>
            </div>
          ) : groupedMenu.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-lg font-semibold text-slate-800">
                No menu items found
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Add menu items from `/dashboard/menu` and they will appear here.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {groupedMenu.map((group) => (
                <section key={group.category} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-px flex-1 bg-slate-200" />
                    <h2 className="text-lg font-bold uppercase tracking-[0.18em] text-slate-700">
                      {group.category}
                    </h2>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {group.items.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">
                              {item.name}
                            </h3>
                            <p className="mt-2 text-sm leading-6 text-slate-600">
                              {item.description || "Chef special item"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">
                            {formatCurrency(item.price)}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
