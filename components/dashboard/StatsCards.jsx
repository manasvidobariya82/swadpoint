"use client";

import {
  ShoppingBag,
  Users,
  Wallet,
  ClipboardList,
  Bell,
  Table,
  ShoppingCart,
} from "lucide-react";
import { useState } from "react";

/* =======================
   FILTER DATA
======================= */
const dashboardData = {
  Today: {
    sales: 1200,
    totalOrders: 25,
    onlineOrders: 14,
    pending: 5,
    tables: 8,
    customers: 6,
    dineIn: 11,
  },
  "This Week": {
    sales: 8400,
    totalOrders: 140,
    onlineOrders: 75,
    pending: 12,
    tables: 15,
    customers: 22,
    dineIn: 65,
  },
  "This Month": {
    sales: 32000,
    totalOrders: 620,
    onlineOrders: 350,
    pending: 20,
    tables: 40,
    customers: 85,
    dineIn: 270,
  },
};

/* =======================
   MAIN COMPONENT
======================= */
export default function DashboardOverview() {
  const [filter, setFilter] = useState("Today");

  const data = dashboardData[filter] || dashboardData["Today"];

  const dineInOrders = data.dineIn;
  const onlineOrders = data.onlineOrders;
  const total = dineInOrders + onlineOrders || 1;

  const dineInPercent = Math.round((dineInOrders / total) * 100);
  const onlinePercent = Math.round((onlineOrders / total) * 100);

  const stats = [
    {
      title: "Sales",
      value: `₹${data.sales}`,
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
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold">Dashboard Overview</h2>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option>Today</option>
          <option>This Week</option>
          <option>This Month</option>
        </select>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {stats.map((item, i) => {
          const Icon = item.icon;
          return (
            <div
              key={i}
              className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex justify-between items-center"
            >
              <div>
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold mt-1">{item.value}</p>
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

      {/* DINE-IN VS ONLINE */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-800">
            Dine-In vs Online Orders
          </h3>
          <span className="text-xs px-3 py-1 rounded-full bg-indigo-50 text-indigo-600">
            {filter}
          </span>
        </div>

        <div className="space-y-5">
          {/* DINE-IN */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">🍽️ Dine-In Orders</span>
              <span className="text-sm font-semibold">
                {dineInOrders} ({dineInPercent}%)
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600"
                style={{ width: `${dineInPercent}%` }}
              />
            </div>
          </div>

          {/* ONLINE */}
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium">🛒 Online Orders</span>
              <span className="text-sm font-semibold">
                {onlineOrders} ({onlinePercent}%)
              </span>
            </div>
            <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-400 to-blue-600"
                style={{ width: `${onlinePercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* TOP SELLING + NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3">Top 5 Selling Items</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>🍕 Margherita Pizza</li>
            <li>🍔 Veg Burger</li>
            <li>🥪 Sandwich</li>
            <li>🍝 Pasta</li>
            <li>🥤 Cold Drink</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <Bell size={18} /> Notifications
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li>New online order received</li>
            <li>Table 4 reserved</li>
            <li>Low stock alert</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
