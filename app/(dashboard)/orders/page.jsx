"use client";

import { useEffect, useMemo, useState } from "react";
import { getOrders, saveOrders } from "@/helper/storage";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const loadOrders = () => {
    const list = getOrders().sort(
      (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
    );
    setOrders(list);
  };

  useEffect(() => {
    loadOrders();

    const syncOrders = (event) => {
      if (event.key === "restaurantOrders") {
        loadOrders();
      }
    };

    window.addEventListener("storage", syncOrders);
    return () => window.removeEventListener("storage", syncOrders);
  }, []);

  const pendingCount = useMemo(
    () => orders.filter((order) => order.status === "Pending").length,
    [orders]
  );

  const markCompleted = (id) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: "Completed" } : order
    );
    setOrders(updated);
    saveOrders(updated);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-6xl space-y-4">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Admin Orders</h1>
          <p className="mt-1 text-sm text-gray-600">
            Total: {orders.length} | Pending: {pendingCount}
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-sm text-gray-500 shadow">
            No orders yet.
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="rounded-xl bg-white p-5 shadow">
                <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">
                      Order ID: {order.id}
                    </p>
                    <p className="text-sm text-gray-600">
                      Table: {order.tableNo || "NA"} | Customer:{" "}
                      {order.customerName || "Walk-in"}
                    </p>
                    <p className="text-xs text-gray-500">
                      Time: {new Date(order.time).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-sm">
                    <p>
                      Status:{" "}
                      <span
                        className={
                          order.status === "Completed"
                            ? "font-semibold text-green-700"
                            : "font-semibold text-orange-700"
                        }
                      >
                        {order.status}
                      </span>
                    </p>
                    <p className="text-gray-600">
                      Payment: {order.paymentStatus || "Paid"} (
                      {order.paymentMethod || "UPI"})
                    </p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 rounded-lg border border-gray-200 p-3">
                  {order.items.map((item, index) => (
                    <div
                      key={`${order.id}-${index}`}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <span>
                        {item.name} x {item.qty || 1}
                      </span>
                      <span>
                        Rs. {Number(item.lineTotal ?? item.price ?? 0).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  <div className="border-t pt-2 text-right font-semibold text-gray-900">
                    Total: Rs. {Number(order.total || 0).toFixed(2)}
                  </div>
                </div>

                {order.status !== "Completed" && (
                  <button
                    onClick={() => markCompleted(order.id)}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                  >
                    Mark Completed
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
