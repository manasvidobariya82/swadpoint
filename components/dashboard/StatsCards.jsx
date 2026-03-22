"use client";

import {
  Bell,
  ClipboardList,
  ShoppingBag,
  ShoppingCart,
  Table,
  Users,
  Wallet,
} from "lucide-react";
import { useEffect, useState } from "react";

const FILTER_OPTIONS = [
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
  { label: "This Month", value: "month" },
];

const DEFAULT_SUMMARY = {
  stats: {
    sales: 0,
    totalOrders: 0,
    onlineOrders: 0,
    pending: 0,
    tables: 0,
    customers: 0,
    dineIn: 0,
  },
  topSellingItems: [],
  notifications: [],
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function DashboardOverview() {
  const [filter, setFilter] = useState("today");
  const [summary, setSummary] = useState(DEFAULT_SUMMARY);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isActive = true;

    const loadSummary = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        const response = await fetch(`/api/dashboard-summary?range=${filter}`, {
          cache: "no-store",
        });
        const payload = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(payload?.error || "Failed to load dashboard summary");
        }

        if (!isActive) {
          return;
        }

        setSummary({
          stats: payload?.stats || DEFAULT_SUMMARY.stats,
          topSellingItems: Array.isArray(payload?.topSellingItems)
            ? payload.topSellingItems
            : [],
          notifications: Array.isArray(payload?.notifications)
            ? payload.notifications
            : [],
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setSummary(DEFAULT_SUMMARY);
        setErrorMessage(error?.message || "Failed to load dashboard summary");
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadSummary();

    return () => {
      isActive = false;
    };
  }, [filter]);

  const selectedLabel =
    FILTER_OPTIONS.find((option) => option.value === filter)?.label || "Today";
  const data = summary.stats || DEFAULT_SUMMARY.stats;
  const dineInOrders = Number(data.dineIn || 0);
  const onlineOrders = Number(data.onlineOrders || 0);
  const totalOrderMix = dineInOrders + onlineOrders || 1;
  const dineInPercent = Math.round((dineInOrders / totalOrderMix) * 100);
  const onlinePercent = Math.round((onlineOrders / totalOrderMix) * 100);

  const stats = [
    {
      title: "Sales",
      value: formatCurrency(data.sales),
      icon: Wallet,
      color: "bg-green-500",
    },
    {
      title: "Total Orders",
      value: data.totalOrders,
      icon: ClipboardList,
      color: "bg-indigo-500",
    },
    {
      title: "Online Orders",
      value: data.onlineOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
    },
    {
      title: "Pending Orders",
      value: data.pending,
      icon: ShoppingBag,
      color: "bg-orange-500",
    },
    {
      title: "Active Tables",
      value: data.tables,
      icon: Table,
      color: "bg-teal-500",
    },
    {
      title: "New Customers",
      value: data.customers,
      icon: Users,
      color: "bg-rose-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>

        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          {FILTER_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {errorMessage ? (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold mt-1">
                  {isLoading ? "..." : item.value}
                </p>
              </div>
              <div
                className={`w-12 h-12 ${item.color} text-white flex items-center justify-center rounded-lg`}
              >
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Dine-In vs Online Orders
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
            {selectedLabel}
          </span>
        </div>

        <div className="space-y-5">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Dine-In Orders</span>
              <span className="text-sm font-semibold">
                {isLoading ? "..." : `${dineInOrders} (${dineInPercent}%)`}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                style={{ width: `${isLoading ? 0 : dineInPercent}%` }}
              />
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">Online Orders</span>
              <span className="text-sm font-semibold">
                {isLoading ? "..." : `${onlineOrders} (${onlinePercent}%)`}
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${isLoading ? 0 : onlinePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3">Top 5 Selling Items</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {isLoading ? <li>Loading top items...</li> : null}
            {!isLoading && summary.topSellingItems.length === 0 ? (
              <li>No orders found for this range</li>
            ) : null}
            {!isLoading
              ? summary.topSellingItems.map((item) => (
                  <li key={item.name}>
                    {item.name} x {item.quantity}
                  </li>
                ))
              : null}
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bell size={18} /> Notifications
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            {isLoading ? <li>Loading notifications...</li> : null}
            {!isLoading
              ? summary.notifications.map((notification, index) => (
                  <li key={`${notification}-${index}`}>{notification}</li>
                ))
              : null}
          </ul>
        </div>
      </div>
    </div>
  );
}
