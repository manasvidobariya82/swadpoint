"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const menu = [
  { name: "Dashboard", path: "/dashboard" },
  {
    name: "Orders",
    basePath: "/dashboard/orders",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description:
          "Live order updates every 30s. Toggle on/off with adjustable intervals (10s, 20s, 30s, 60s)",
        path: "/dashboard/orders",
      },
      {
        name: "📊 Order Timeline",
        description:
          "Visual timeline showing order progress: Placed → Accepted → Preparing → Completed",
        path: "/dashboard/orders",
      },
      {
        name: "🔍 Search & Filter",
        description:
          "Quick search by Order ID, Customer Name, or Mobile Number. Filters combined with type/status",
        path: "/dashboard/orders",
      },
    ],
  },
  {
    name: "Customers",
    basePath: "/dashboard/customers",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live customer data updates every 30s",
      },
      {
        name: "🔍 Search & Filter",
        description: "Search by customer name, phone, or email",
      },
    ],
  },
  { name: "table-managment", path: "/dashboard/table-managment" },
  {
    name: "Reservation",
    basePath: "/dashboard/reservation",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live reservation updates every 30s",
      },
      {
        name: "📊 Status Timeline",
        description: "Track reservation progress and status changes",
      },
      {
        name: "🔍 Search & Filter",
        description: "Find reservations by table, guest name, or date",
      },
    ],
  },

  {
    name: "Billing",
    basePath: "/dashboard/billing",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live payment data updates every 30s",
      },
      {
        name: "💰 Amount Filter",
        description: "Filter payments by status and amount",
      },
      {
        name: "🔍 Search & Filter",
        description: "Search by order ID or payment method",
      },
    ],
  },
  {
    name: "Offers",
    basePath: "/dashboard/offers",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live offers updates",
      },
      {
        name: "✨ Status Toggle",
        description: "Enable/disable offers easily",
      },
      {
        name: "🔍 Search & Filter",
        description: "Find offers by title or category",
      },
    ],
  },
  {
    name: "menu",
    basePath: "/dashboard/menu",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live menu updates every 30s",
      },
      {
        name: "📊 Category Filter",
        description: "Filter by category: Main, Starter, Dessert, Beverage",
      },
      {
        name: "🔍 Search & Filter",
        description: "Search menu items by name or category",
      },
    ],
  },

  {
    name: "Inventory",
    basePath: "/dashboard/inventory",
    subMenu: [
      {
        name: "📱 Auto-Refresh",
        description: "Live stock updates every 30s",
      },
      {
        name: "⚠️ Low Stock Alert",
        description: "Automatic alerts for items below minimum stock",
      },
      {
        name: "🔍 Search & Filter",
        description: "Search inventory by item name or supplier",
      },
    ],
  },
  {
    name: "Reports",
    basePath: "/dashboard/reports",
    subMenu: [
      {
        name: "📊 Live Metrics",
        description: "Auto-refresh analytics every 30s",
      },
      {
        name: "📈 Advanced Charts",
        description: "Sales trends, customer analytics, revenue insights",
      },
      {
        name: "🔍 Filter & Export",
        description: "Filter by date range and download reports",
      },
    ],
  },
  {
    name: "Settings",
    basePath: "/dashboard/settings",
    subMenu: [
      {
        name: "⚙️ Restaurant Config",
        description: "Manage restaurant details, payment methods, QR settings",
      },
      {
        name: "🔔 Notifications",
        description: "Configure alerts for orders, low stock, payments",
      },
      {
        name: "🔐 Access Control",
        description: "Manager permissions, cashier refunds, staff roles",
      },
    ],
  },
  {
    name: "My Account",
    basePath: "/dashboard/my-account",
    subMenu: [
      {
        name: "👤 Profile",
        description: "Manage your account details and password",
      },
      {
        name: "🔐 Security",
        description: "Change password, manage sessions",
      },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  // ✅ AUTO OPEN DROPDOWN WHEN URL MATCHES
  useEffect(() => {
    const newOpenMenus = {};
    menu.forEach((item) => {
      if (item.basePath && pathname.startsWith(item.basePath)) {
        newOpenMenus[item.basePath] = true;
      }
    });
    setOpenMenus(newOpenMenus);
  }, [pathname]);

  const toggleMenu = (basePath) => {
    setOpenMenus((prev) => ({
      ...prev,
      [basePath]: !prev[basePath],
    }));
  };

  return (
    <div className="p-6">
      <nav className="space-y-2">
        {menu.map((item, index) => {
          // 🔽 Dropdown menu items
          if (item.subMenu && item.basePath) {
            const isActive = pathname.startsWith(item.basePath);
            const isOpen = openMenus[item.basePath];

            return (
              <div key={index}>
                <button
                  onClick={() => toggleMenu(item.basePath)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  <span>{item.name}</span>
                  <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </button>

                {isOpen && (
                  <div className="ml-4 mt-2 space-y-3">
                    {item.subMenu.map((sub, subIdx) => (
                      <div
                        key={subIdx}
                        className="border-l-2 border-amber-400 pl-3"
                      >
                        <p className="text-sm font-semibold text-gray-800">
                          {sub.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {sub.description}
                        </p>
                      </div>
                    ))}
                    {item.basePath && (
                      <Link
                        href={item.basePath}
                        className="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                      >
                        → Go to {item.name}
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          }

          // 🔹 Normal menu item (single path)
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-lg transition ${
                pathname === item.path
                  ? "bg-blue-100 text-blue-600 font-semibold"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
