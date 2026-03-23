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
  { name: "Customers", path: "/dashboard/customers" },
  { name: "table-managment", path: "/dashboard/table-managment" },
  // 🔽 Reservation Dropdown
  {
    name: "Reservation",
    basePath: "/dashboard/reservation",
    subMenu: [
      {
        name: "Table Reservation",
        path: "/dashboard/reservation/table-reservation",
      },
      {
        name: "Reservation Settings",
        path: "/dashboard/reservation/reservation-setting",
      },
    ],
  },

  { name: "Billing", path: "/dashboard/billing" },
  // { name: "Take-Order", path: "/dashboard/Take-Order" },
  { name: "Offers", path: "/dashboard/offers" },
  { name: "menu", path: "/dashboard/menu" },

  // { name: "AR-Menu", path: "/dashboard/ar-menu" },
  { name: "Inventory", path: "/dashboard/inventory" },
  { name: "Reports", path: "/dashboard/reports" },
  { name: "Settings", path: "/dashboard/settings" },
  { name: "My Account", path: "/dashboard/my-account" },
  // { name: "logout", path: "/dashboard/logout" },
  // { name: "profile", path: "/dashboard/profile" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [openReservation, setOpenReservation] = useState(false);
  const [openOrders, setOpenOrders] = useState(false);

  // ✅ AUTO OPEN DROPDOWN WHEN URL MATCHES
  useEffect(() => {
    if (pathname.startsWith("/dashboard/reservation")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenReservation(true);
    }
    if (pathname.startsWith("/dashboard/orders")) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setOpenOrders(true);
    }
  }, [pathname]);

  return (
    <div className="p-6">
      <nav className="space-y-2">
        {menu.map((item, index) => {
          // 🔽 Orders Dropdown
          if (item.basePath === "/dashboard/orders" && item.subMenu) {
            const isActive = pathname.startsWith(item.basePath);

            return (
              <div key={index}>
                <button
                  onClick={() => setOpenOrders(!openOrders)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center transition ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {item.name}
                  <span className="text-xs bg-amber-500 text-white px-2 py-0.5 rounded-full">
                    NEW
                  </span>
                </button>

                {openOrders && (
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
                    <Link
                      href="/dashboard/orders"
                      className="block px-3 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition"
                    >
                      → Go to Orders
                    </Link>
                  </div>
                )}
              </div>
            );
          }

          // 🔽 Reservation Dropdown
          if (item.subMenu && item.basePath !== "/dashboard/orders") {
            const isActive = pathname.startsWith(item.basePath);

            return (
              <div key={index}>
                <button
                  onClick={() => setOpenReservation(!openReservation)}
                  className={`w-full text-left px-4 py-2 rounded-lg flex justify-between items-center transition
                    ${
                      isActive
                        ? "bg-blue-100 text-blue-600 font-semibold"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                >
                  {item.name}
                  <span>{openReservation ? "▲" : "▼"}</span>
                </button>

                {openReservation && (
                  <div className="ml-4 mt-2 space-y-1">
                    {item.subMenu.map((sub) => (
                      <Link
                        key={sub.path}
                        href={sub.path}
                        className={`block px-4 py-2 rounded-lg text-sm transition
                          ${
                            pathname === sub.path
                              ? "bg-blue-200 text-blue-700 font-semibold"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          // 🔹 Normal menu item
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-4 py-2 rounded-lg transition
                ${
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
