"use client";

import { useEffect, useMemo, useState } from "react";

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value) => String(value || "").trim();

const parseTime = (value) => {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const formatDateTime = (value) => {
  const parsed = parseTime(value);
  if (!parsed) return "-";
  return new Date(parsed).toLocaleString();
};

const getFavoriteFood = (foodCounter) => {
  const foods = Object.entries(foodCounter);
  if (foods.length === 0) return "-";

  foods.sort((a, b) => b[1] - a[1]);
  return foods[0][0];
};

const deriveCustomersFromOrders = (orders) => {
  const groupedCustomers = new Map();

  (Array.isArray(orders) ? orders : []).forEach((order) => {
    if (!order || typeof order !== "object") return;

    const name = normalizeText(order.customerName) || "Walk-in";
    const mobile =
      normalizeText(order.customerMobile || order.mobile || order.phone) || "-";
    const key = `${name.toLowerCase()}|${mobile}`;

    if (!groupedCustomers.has(key)) {
      groupedCustomers.set(key, {
        name,
        mobile,
        visit: 0,
        orders: 0,
        loyalty: 0,
        food: "-",
        status: "Active",
        totalSpent: 0,
        pendingOrders: 0,
        lastOrderAt: 0,
        lastOrderLabel: "-",
        foodCounter: {},
        recentOrders: [],
      });
    }

    const customer = groupedCustomers.get(key);
    const orderTotal = toNumber(order.total);
    const orderTime = parseTime(order.time);
    const normalizedStatus = normalizeText(order.status) || "Pending";
    const items = Array.isArray(order.items) ? order.items : [];

    customer.visit += 1;
    customer.orders += 1;
    customer.totalSpent += orderTotal;

    if (normalizedStatus.toLowerCase() === "pending") {
      customer.pendingOrders += 1;
    }

    if (orderTime >= customer.lastOrderAt) {
      customer.lastOrderAt = orderTime;
      customer.lastOrderLabel = formatDateTime(order.time);
    }

    items.forEach((item) => {
      const itemName = normalizeText(item?.name);
      if (!itemName) return;

      const qty = Math.max(1, toNumber(item?.qty || 1));
      customer.foodCounter[itemName] =
        (customer.foodCounter[itemName] || 0) + qty;
    });

    customer.recentOrders.push({
      id: normalizeText(order.id) || "-",
      tableNo: normalizeText(order.tableNo) || "-",
      total: orderTotal,
      status: normalizedStatus,
      time: order.time,
    });
  });

  const customers = Array.from(groupedCustomers.values())
    .map((customer) => ({
      ...customer,
      loyalty: Math.round(customer.totalSpent / 100),
      status: customer.pendingOrders > 0 ? "Pending" : "Active",
      food: getFavoriteFood(customer.foodCounter),
      recentOrders: customer.recentOrders
        .sort((a, b) => parseTime(b.time) - parseTime(a.time))
        .slice(0, 3),
    }))
    .sort((a, b) => b.lastOrderAt - a.lastOrderAt);

  return customers.map((customer, index) => ({
    id: index + 1,
    ...customer,
  }));
};

const fetchOrdersFromApi = async () => {
  const response = await fetch("/api/orders", { cache: "no-store" });
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
};

export default function Page() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const orderList = await fetchOrdersFromApi();
      setCustomers(deriveCustomersFromOrders(orderList));
    } catch {
      setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCustomers();
    }, 0);
    const intervalId = window.setInterval(loadCustomers, 3000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.mobile.includes(search.trim()) ||
        customer.food.toLowerCase().includes(query) ||
        customer.status.toLowerCase().includes(query)
    );
  }, [customers, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / entries));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * entries, safePage * entries);

  const exportCSV = () => {
    const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

    const csv =
      "ID,Name,Mobile,Visits,Orders,Loyalty,Favorite Food,Status,Total Spent,Last Order\n" +
      customers
        .map((customer) =>
          [
            customer.id,
            customer.name,
            customer.mobile,
            customer.visit,
            customer.orders,
            customer.loyalty,
            customer.food,
            customer.status,
            customer.totalSpent.toFixed(2),
            customer.lastOrderLabel,
          ]
            .map(csvEscape)
            .join(",")
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "customers.csv";
    anchor.click();
  };

  return (
    <div className="space-y-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-semibold">Customer Management</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Export
          </button>
          <button
            onClick={loadCustomers}
            className="rounded-full bg-black px-5 py-2 text-sm text-white"
          >
            Sync Orders
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search customer..."
          className="h-11 w-72 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-black"
        />
        <select
          value={entries}
          onChange={(e) => {
            setEntries(Number(e.target.value));
            setPage(1);
          }}
          className="h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
        >
          <option value={10}>10 / page</option>
          <option value={25}>25 / page</option>
          <option value={50}>50 / page</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-t text-sm">
          <thead className="border-b bg-gray-50">
            <tr className="text-left">
              <th className="py-3">ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Visits</th>
              <th>Orders</th>
              <th>Loyalty</th>
              <th>Food</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-400">
                  {isLoading ? "Loading customers..." : "No Customers Found"}
                </td>
              </tr>
            ) : (
              paginated.map((customer) => (
                <tr key={customer.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.mobile}</td>
                  <td>{customer.visit}</td>
                  <td>{customer.orders}</td>
                  <td>{customer.loyalty}</td>
                  <td>{customer.food}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        customer.status === "Pending"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td
                    onClick={() => {
                      setSelected(customer);
                      setIsViewOpen(true);
                    }}
                    className="cursor-pointer text-blue-600"
                  >
                    View
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between text-sm">
        <span>
          Showing {paginated.length} of {filtered.length}
        </span>
        <div className="flex overflow-hidden rounded-md border">
          <button
            onClick={() => setPage(Math.max(1, safePage - 1))}
            disabled={safePage === 1}
            className="px-4 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage(Math.min(totalPages, safePage + 1))}
            disabled={safePage === totalPages}
            className="border-l px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {isViewOpen && selected && (
        <Modal title="Customer Details" onClose={() => setIsViewOpen(false)}>
          <div className="space-y-2 text-sm">
            <p>
              <b>Name:</b> {selected.name}
            </p>
            <p>
              <b>Mobile:</b> {selected.mobile}
            </p>
            <p>
              <b>Visits:</b> {selected.visit}
            </p>
            <p>
              <b>Orders:</b> {selected.orders}
            </p>
            <p>
              <b>Total Spent:</b> Rs. {selected.totalSpent.toFixed(2)}
            </p>
            <p>
              <b>Loyalty:</b> {selected.loyalty}
            </p>
            <p>
              <b>Favorite Food:</b> {selected.food}
            </p>
            <p>
              <b>Last Order:</b> {selected.lastOrderLabel}
            </p>
          </div>

          <div className="mt-4">
            <p className="mb-2 text-sm font-semibold">Recent Orders</p>
            {selected.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No recent orders</p>
            ) : (
              <div className="space-y-2">
                {selected.recentOrders.map((order) => (
                  <div key={`${order.id}-${order.time}`} className="rounded border p-2 text-xs">
                    <p>
                      <b>Order:</b> {order.id}
                    </p>
                    <p>
                      <b>Table:</b> {order.tableNo}
                    </p>
                    <p>
                      <b>Status:</b> {order.status}
                    </p>
                    <p>
                      <b>Total:</b> Rs. {order.total.toFixed(2)}
                    </p>
                    <p>
                      <b>Time:</b> {formatDateTime(order.time)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="w-[420px] rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-4 w-full rounded border py-2">
        Close
      </button>
    </div>
  </div>
);
