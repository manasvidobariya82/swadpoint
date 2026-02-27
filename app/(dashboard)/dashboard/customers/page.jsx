// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { getBusinessProfile } from "@/helper/businessProfile";
// import { getOrders, saveOrders } from "@/helper/storage";

// const toNumber = (value) => {
//   const parsed = Number(value);
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const normalizeText = (value) => String(value || "").trim();

// const parseTime = (value) => {
//   const parsed = new Date(value).getTime();
//   return Number.isFinite(parsed) ? parsed : 0;
// };

// const normalizeId = (value) => String(value || "").trim();

// const mergeOrders = (current, incoming) => {
//   const mergedById = new Map();

//   (Array.isArray(current) ? current : []).forEach((order) => {
//     const id = normalizeId(order?.id);
//     if (!id) return;
//     mergedById.set(id, order);
//   });

//   (Array.isArray(incoming) ? incoming : []).forEach((order) => {
//     const id = normalizeId(order?.id);
//     if (!id) return;
//     mergedById.set(id, {
//       ...(mergedById.get(id) || {}),
//       ...order,
//     });
//   });

//   return Array.from(mergedById.values()).sort(
//     (a, b) => parseTime(b?.time) - parseTime(a?.time)
//   );
// };

// const formatDateTime = (value) => {
//   const parsed = parseTime(value);
//   if (!parsed) return "-";
//   return new Date(parsed).toLocaleString();
// };

// const getFavoriteFood = (foodCounter) => {
//   const foods = Object.entries(foodCounter);
//   if (foods.length === 0) return "-";

//   foods.sort((a, b) => b[1] - a[1]);
//   return foods[0][0];
// };

// const deriveCustomersFromOrders = (orders) => {
//   const groupedCustomers = new Map();

//   (Array.isArray(orders) ? orders : []).forEach((order) => {
//     if (!order || typeof order !== "object") return;

//     const name = normalizeText(order.customerName) || "Walk-in";
//     const mobile =
//       normalizeText(order.customerMobile || order.mobile || order.phone) || "-";
//     const key = `${name.toLowerCase()}|${mobile}`;

//     if (!groupedCustomers.has(key)) {
//       groupedCustomers.set(key, {
//         name,
//         mobile,
//         visit: 0,
//         orders: 0,
//         loyalty: 0,
//         food: "-",
//         status: "Active",
//         totalSpent: 0,
//         pendingOrders: 0,
//         lastOrderAt: 0,
//         lastOrderLabel: "-",
//         foodCounter: {},
//         recentOrders: [],
//       });
//     }

//     const customer = groupedCustomers.get(key);
//     const orderTotal = toNumber(order.total);
//     const orderTime = parseTime(order.time);
//     const normalizedStatus = normalizeText(order.status) || "Pending";
//     const items = Array.isArray(order.items) ? order.items : [];

//     customer.visit += 1;
//     customer.orders += 1;
//     customer.totalSpent += orderTotal;

//     if (normalizedStatus.toLowerCase() === "pending") {
//       customer.pendingOrders += 1;
//     }

//     if (orderTime >= customer.lastOrderAt) {
//       customer.lastOrderAt = orderTime;
//       customer.lastOrderLabel = formatDateTime(order.time);
//     }

//     items.forEach((item) => {
//       const itemName = normalizeText(item?.name);
//       if (!itemName) return;

//       const qty = Math.max(1, toNumber(item?.qty || 1));
//       customer.foodCounter[itemName] =
//         (customer.foodCounter[itemName] || 0) + qty;
//     });

//     customer.recentOrders.push({
//       id: normalizeText(order.id) || "-",
//       tableNo: normalizeText(order.tableNo) || "-",
//       total: orderTotal,
//       status: normalizedStatus,
//       time: order.time,
//     });
//   });

//   const customers = Array.from(groupedCustomers.values())
//     .map((customer) => ({
//       ...customer,
//       loyalty: Math.round(customer.totalSpent / 100),
//       status: customer.pendingOrders > 0 ? "Pending" : "Active",
//       food: getFavoriteFood(customer.foodCounter),
//       recentOrders: customer.recentOrders
//         .sort((a, b) => parseTime(b.time) - parseTime(a.time))
//         .slice(0, 3),
//     }))
//     .sort((a, b) => b.lastOrderAt - a.lastOrderAt);

//   return customers.map((customer, index) => ({
//     id: index + 1,
//     ...customer,
//   }));
// };

// const fetchOrdersFromApi = async () => {
//   const response = await fetch("/api/orders", { cache: "no-store" });
//   if (!response.ok) throw new Error("Failed to fetch orders");
//   return response.json();
// };

// export default function Page() {
//   const [customers, setCustomers] = useState(() =>
//     deriveCustomersFromOrders(getOrders())
//   );
//   const [search, setSearch] = useState("");
//   const [entries, setEntries] = useState(10);
//   const [page, setPage] = useState(1);
//   const [isViewOpen, setIsViewOpen] = useState(false);
//   const [selected, setSelected] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   const loadCustomers = async () => {
//     try {
//       const orderList = await fetchOrdersFromApi();
//       const merged = mergeOrders(getOrders(), orderList);
//       saveOrders(merged);
//       setCustomers(deriveCustomersFromOrders(merged));
//     } catch {
//       setCustomers(deriveCustomersFromOrders(getOrders()));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     const timeoutId = window.setTimeout(() => {
//       loadCustomers();
//     }, 0);
//     const intervalId = window.setInterval(loadCustomers, 10000);

//     return () => {
//       window.clearTimeout(timeoutId);
//       window.clearInterval(intervalId);
//     };
//   }, []);

//   const filtered = useMemo(() => {
//     const query = search.trim().toLowerCase();
//     if (!query) return customers;

//     return customers.filter(
//       (customer) =>
//         customer.name.toLowerCase().includes(query) ||
//         customer.mobile.includes(search.trim()) ||
//         customer.food.toLowerCase().includes(query) ||
//         customer.status.toLowerCase().includes(query)
//     );
//   }, [customers, search]);

//   const totalPages = Math.max(1, Math.ceil(filtered.length / entries));
//   const safePage = Math.min(page, totalPages);
//   const paginated = filtered.slice((safePage - 1) * entries, safePage * entries);
//   const customerSummary = useMemo(() => {
//     const totalSpent = customers.reduce(
//       (sum, customer) => sum + toNumber(customer.totalSpent),
//       0
//     );
//     const active = customers.filter(
//       (customer) => customer.status === "Active"
//     ).length;
//     const pending = customers.filter(
//       (customer) => customer.status === "Pending"
//     ).length;

//     return {
//       total: customers.length,
//       active,
//       pending,
//       totalSpent,
//     };
//   }, [customers]);

//   const exportCSV = () => {
//     const csvEscape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
//     const business = getBusinessProfile();
//     const metadataRows = [
//       ["Report", "Customer Management Export"],
//       ["Generated At", new Date().toLocaleString()],
//       ["Restaurant", business.brandName],
//       ["Branch", business.branchName],
//       ["Owner", business.ownerName],
//       ["Phone", business.supportPhone],
//       ["Email", business.supportEmail],
//       ["City", business.city],
//       ["Address", business.address],
//       ["Website", business.website],
//       ["GST", business.gstNumber],
//     ].filter((row) => row[1]);

//     const csv =
//       metadataRows.map((row) => row.map(csvEscape).join(",")).join("\n") +
//       "\n\n" +
//       "ID,Name,Mobile,Visits,Orders,Loyalty,Favorite Food,Status,Total Spent,Last Order\n" +
//       customers
//         .map((customer) =>
//           [
//             customer.id,
//             customer.name,
//             customer.mobile,
//             customer.visit,
//             customer.orders,
//             customer.loyalty,
//             customer.food,
//             customer.status,
//             customer.totalSpent.toFixed(2),
//             customer.lastOrderLabel,
//           ]
//             .map(csvEscape)
//             .join(",")
//         )
//         .join("\n");

//     const blob = new Blob([csv], { type: "text/csv" });
//     const url = URL.createObjectURL(blob);
//     const anchor = document.createElement("a");
//     anchor.href = url;
//     anchor.download = "customers.csv";
//     anchor.click();
//     URL.revokeObjectURL(url);
//   };

//   return (
//     <div className="space-y-6">
//       <div className="rounded-2xl border bg-white p-5 shadow-sm">
//         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
//           <div>
//             <h1 className="text-2xl font-bold text-gray-900">Customer Management</h1>
//             <p className="mt-1 text-sm text-gray-600">
//               Customer insights from live order activity.
//             </p>
//           </div>
//           <div className="flex flex-wrap gap-2">
//             <button
//               onClick={exportCSV}
//               className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
//             >
//               Export CSV
//             </button>
//             <button
//               onClick={loadCustomers}
//               className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
//             >
//               Sync Orders
//             </button>
//           </div>
//         </div>
//       </div>

//       <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
//         <div className="rounded-xl border bg-white p-4 shadow-sm">
//           <p className="text-sm text-gray-500">Total Customers</p>
//           <p className="mt-1 text-2xl font-bold text-gray-900">{customerSummary.total}</p>
//         </div>
//         <div className="rounded-xl border bg-white p-4 shadow-sm">
//           <p className="text-sm text-gray-500">Active</p>
//           <p className="mt-1 text-2xl font-bold text-emerald-600">{customerSummary.active}</p>
//         </div>
//         <div className="rounded-xl border bg-white p-4 shadow-sm">
//           <p className="text-sm text-gray-500">Pending</p>
//           <p className="mt-1 text-2xl font-bold text-amber-600">{customerSummary.pending}</p>
//         </div>
//         <div className="rounded-xl border bg-white p-4 shadow-sm">
//           <p className="text-sm text-gray-500">Total Spent</p>
//           <p className="mt-1 text-2xl font-bold text-gray-900">
//             Rs. {customerSummary.totalSpent.toFixed(2)}
//           </p>
//         </div>
//       </div>

//       <div className="rounded-2xl border bg-white p-4 shadow-sm">
//         <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//           <input
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setPage(1);
//             }}
//             placeholder="Search by name, mobile, food, status"
//             className="h-11 w-full rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-black md:max-w-md"
//           />
//           <select
//             value={entries}
//             onChange={(e) => {
//               setEntries(Number(e.target.value));
//               setPage(1);
//             }}
//             className="h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
//           >
//             <option value={10}>10 / page</option>
//             <option value={25}>25 / page</option>
//             <option value={50}>50 / page</option>
//           </select>
//         </div>
//       </div>

//       <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm">
//             <thead className="border-b bg-gray-50">
//               <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
//                 <th className="px-4 py-3">ID</th>
//                 <th className="px-4 py-3">Customer</th>
//                 <th className="px-4 py-3">Mobile</th>
//                 <th className="px-4 py-3">Visits</th>
//                 <th className="px-4 py-3">Orders</th>
//                 <th className="px-4 py-3">Loyalty</th>
//                 <th className="px-4 py-3">Favorite Food</th>
//                 <th className="px-4 py-3">Status</th>
//                 <th className="px-4 py-3 text-right">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginated.length === 0 ? (
//                 <tr>
//                   <td colSpan={9} className="px-4 py-10 text-center text-gray-400">
//                     {isLoading ? "Loading customers..." : "No customers found"}
//                   </td>
//                 </tr>
//               ) : (
//                 paginated.map((customer) => (
//                   <tr key={customer.id} className="border-b last:border-b-0 hover:bg-gray-50">
//                     <td className="px-4 py-3">{customer.id}</td>
//                     <td className="px-4 py-3 font-medium text-gray-900">{customer.name}</td>
//                     <td className="px-4 py-3">{customer.mobile}</td>
//                     <td className="px-4 py-3">{customer.visit}</td>
//                     <td className="px-4 py-3">{customer.orders}</td>
//                     <td className="px-4 py-3">{customer.loyalty}</td>
//                     <td className="px-4 py-3">{customer.food}</td>
//                     <td className="px-4 py-3">
//                       <span
//                         className={`rounded-full px-3 py-1 text-xs font-semibold ${
//                           customer.status === "Pending"
//                             ? "bg-orange-100 text-orange-600"
//                             : "bg-green-100 text-green-600"
//                         }`}
//                       >
//                         {customer.status}
//                       </span>
//                     </td>
//                     <td className="px-4 py-3 text-right">
//                       <button
//                         onClick={() => {
//                           setSelected(customer);
//                           setIsViewOpen(true);
//                         }}
//                         className="text-sm font-medium text-blue-600 hover:text-blue-800"
//                       >
//                         View
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>

//       <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
//         <span className="text-gray-600">
//           Showing {paginated.length} of {filtered.length}
//         </span>
//         <div className="flex overflow-hidden rounded-md border">
//           <button
//             onClick={() => setPage(Math.max(1, safePage - 1))}
//             disabled={safePage === 1}
//             className="px-4 py-2 disabled:opacity-40"
//           >
//             Prev
//           </button>
//           <button
//             onClick={() => setPage(Math.min(totalPages, safePage + 1))}
//             disabled={safePage === totalPages}
//             className="border-l px-4 py-2 disabled:opacity-40"
//           >
//             Next
//           </button>
//         </div>
//       </div>

//       {isViewOpen && selected && (
//         <Modal title="Customer Details" onClose={() => setIsViewOpen(false)}>
//           <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
//             <p>
//               <b>Name:</b> {selected.name}
//             </p>
//             <p>
//               <b>Mobile:</b> {selected.mobile}
//             </p>
//             <p>
//               <b>Visits:</b> {selected.visit}
//             </p>
//             <p>
//               <b>Orders:</b> {selected.orders}
//             </p>
//             <p>
//               <b>Total Spent:</b> Rs. {selected.totalSpent.toFixed(2)}
//             </p>
//             <p>
//               <b>Loyalty:</b> {selected.loyalty}
//             </p>
//             <p>
//               <b>Favorite Food:</b> {selected.food}
//             </p>
//             <p>
//               <b>Last Order:</b> {selected.lastOrderLabel}
//             </p>
//           </div>

//           <div className="mt-5">
//             <p className="mb-2 text-sm font-semibold">Recent Orders</p>
//             {selected.recentOrders.length === 0 ? (
//               <p className="text-sm text-gray-500">No recent orders</p>
//             ) : (
//               <div className="space-y-2">
//                 {selected.recentOrders.map((order) => (
//                   <div
//                     key={`${order.id}-${order.time}`}
//                     className="rounded-lg border p-3 text-xs"
//                   >
//                     <p>
//                       <b>Order:</b> {order.id}
//                     </p>
//                     <p>
//                       <b>Table:</b> {order.tableNo}
//                     </p>
//                     <p>
//                       <b>Status:</b> {order.status}
//                     </p>
//                     <p>
//                       <b>Total:</b> Rs. {order.total.toFixed(2)}
//                     </p>
//                     <p>
//                       <b>Time:</b> {formatDateTime(order.time)}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </Modal>
//       )}
//     </div>
//   );
// }

// const Modal = ({ title, children, onClose }) => (
//   <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
//     <div className="mx-4 w-full max-w-xl rounded-xl bg-white p-6">
//       <h2 className="mb-4 text-lg font-semibold">{title}</h2>
//       {children}
//       <button onClick={onClose} className="mt-4 w-full rounded border py-2">
//         Close
//       </button>
//     </div>
//   </div>
// );

"use client";

import { useEffect, useMemo, useState } from "react";
import { getBusinessProfile } from "@/helper/businessProfile";
import { getOrders, saveOrders } from "@/helper/storage";

// ============================================================================
// Helper Functions (unchanged)
// ============================================================================

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeText = (value) => String(value || "").trim();

const parseTime = (value) => {
  const parsed = new Date(value).getTime();
  return Number.isFinite(parsed) ? parsed : 0;
};

const normalizeId = (value) => String(value || "").trim();

const mergeOrders = (current, incoming) => {
  const mergedById = new Map();

  (Array.isArray(current) ? current : []).forEach((order) => {
    const id = normalizeId(order?.id);
    if (!id) return;
    mergedById.set(id, order);
  });

  (Array.isArray(incoming) ? incoming : []).forEach((order) => {
    const id = normalizeId(order?.id);
    if (!id) return;
    mergedById.set(id, {
      ...(mergedById.get(id) || {}),
      ...order,
    });
  });

  return Array.from(mergedById.values()).sort(
    (a, b) => parseTime(b?.time) - parseTime(a?.time),
  );
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

// ============================================================================
// Custom Hooks
// ============================================================================

const useCustomers = () => {
  const [customers, setCustomers] = useState(() =>
    deriveCustomersFromOrders(getOrders()),
  );
  const [isLoading, setIsLoading] = useState(true);

  const loadCustomers = async () => {
    try {
      const orderList = await fetchOrdersFromApi();
      const merged = mergeOrders(getOrders(), orderList);
      saveOrders(merged);
      setCustomers(deriveCustomersFromOrders(merged));
    } catch {
      setCustomers(deriveCustomersFromOrders(getOrders()));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      loadCustomers();
    }, 0);
    const intervalId = window.setInterval(loadCustomers, 10000);

    return () => {
      window.clearTimeout(timeoutId);
      window.clearInterval(intervalId);
    };
  }, []);

  return { customers, isLoading, refresh: loadCustomers };
};

const usePagination = (totalItems, initialEntries = 10) => {
  const [entries, setEntries] = useState(initialEntries);
  const [page, setPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(totalItems / entries));
  const safePage = Math.min(page, totalPages);

  const paginate = (items) =>
    items.slice((safePage - 1) * entries, safePage * entries);

  const goToPage = (newPage) =>
    setPage(Math.min(totalPages, Math.max(1, newPage)));
  const nextPage = () => goToPage(safePage + 1);
  const prevPage = () => goToPage(safePage - 1);
  const changeEntries = (newEntries) => {
    setEntries(newEntries);
    setPage(1);
  };

  return {
    entries,
    page: safePage,
    totalPages,
    setEntries: changeEntries,
    setPage: goToPage,
    nextPage,
    prevPage,
    paginate,
  };
};

// ============================================================================
// Sub-components
// ============================================================================

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <div className="mx-4 w-full max-w-xl rounded-xl bg-white p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-4 w-full rounded border py-2">
        Close
      </button>
    </div>
  </div>
);

const SummaryCards = ({ summary }) => (
  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Total Customers</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">{summary.total}</p>
    </div>
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Active</p>
      <p className="mt-1 text-2xl font-bold text-emerald-600">
        {summary.active}
      </p>
    </div>
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Pending</p>
      <p className="mt-1 text-2xl font-bold text-amber-600">
        {summary.pending}
      </p>
    </div>
    <div className="rounded-xl border bg-white p-4 shadow-sm">
      <p className="text-sm text-gray-500">Total Spent</p>
      <p className="mt-1 text-2xl font-bold text-gray-900">
        Rs. {summary.totalSpent.toFixed(2)}
      </p>
    </div>
  </div>
);

const SearchBar = ({ search, onSearchChange, entries, onEntriesChange }) => (
  <div className="rounded-2xl border bg-white p-4 shadow-sm">
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <input
        value={search}
        onChange={(e) => {
          onSearchChange(e.target.value);
        }}
        placeholder="Search by name, mobile, food, status"
        className="h-11 w-full rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-black md:max-w-md"
      />
      <select
        value={entries}
        onChange={(e) => onEntriesChange(Number(e.target.value))}
        className="h-11 rounded-lg border px-3 text-sm outline-none focus:ring-2 focus:ring-black"
      >
        <option value={10}>10 / page</option>
        <option value={25}>25 / page</option>
        <option value={50}>50 / page</option>
      </select>
    </div>
  </div>
);

const CustomerTable = ({ customers, isLoading, onView }) => {
  if (customers.length === 0) {
    return (
      <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
        <div className="p-10 text-center text-gray-400">
          {isLoading ? "Loading customers..." : "No customers found"}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr className="text-left text-xs uppercase tracking-wide text-gray-600">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Mobile</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Loyalty</th>
              <th className="px-4 py-3">Favorite Food</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr
                key={customer.id}
                className="border-b last:border-b-0 hover:bg-gray-50"
              >
                <td className="px-4 py-3">{customer.id}</td>
                <td className="px-4 py-3 font-medium text-gray-900">
                  {customer.name}
                </td>
                <td className="px-4 py-3">{customer.mobile}</td>
                <td className="px-4 py-3">{customer.visit}</td>
                <td className="px-4 py-3">{customer.orders}</td>
                <td className="px-4 py-3">{customer.loyalty}</td>
                <td className="px-4 py-3">{customer.food}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      customer.status === "Pending"
                        ? "bg-orange-100 text-orange-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {customer.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => onView(customer)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Pagination = ({
  page,
  totalPages,
  prevPage,
  nextPage,
  showing,
  total,
}) => (
  <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
    <span className="text-gray-600">
      Showing {showing} of {total}
    </span>
    <div className="flex overflow-hidden rounded-md border">
      <button
        onClick={prevPage}
        disabled={page === 1}
        className="px-4 py-2 disabled:opacity-40"
      >
        Prev
      </button>
      <button
        onClick={nextPage}
        disabled={page === totalPages}
        className="border-l px-4 py-2 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  </div>
);

// ============================================================================
// Main Page Component
// ============================================================================

export default function Page() {
  const { customers, isLoading, refresh } = useCustomers();
  const [search, setSearch] = useState("");
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  // Filter customers based on search
  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return customers;

    return customers.filter(
      (customer) =>
        customer.name.toLowerCase().includes(query) ||
        customer.mobile.includes(search.trim()) ||
        customer.food.toLowerCase().includes(query) ||
        customer.status.toLowerCase().includes(query),
    );
  }, [customers, search]);

  // Pagination
  const {
    entries,
    page,
    totalPages,
    setEntries,
    setPage,
    nextPage,
    prevPage,
    paginate,
  } = usePagination(filtered.length, 10);

  const paginatedCustomers = paginate(filtered);

  // Summary metrics
  const customerSummary = useMemo(() => {
    const totalSpent = customers.reduce(
      (sum, customer) => sum + toNumber(customer.totalSpent),
      0,
    );
    const active = customers.filter(
      (customer) => customer.status === "Active",
    ).length;
    const pending = customers.filter(
      (customer) => customer.status === "Pending",
    ).length;

    return {
      total: customers.length,
      active,
      pending,
      totalSpent,
    };
  }, [customers]);

  const exportCSV = () => {
    const csvEscape = (value) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const business = getBusinessProfile();
    const metadataRows = [
      ["Report", "Customer Management Export"],
      ["Generated At", new Date().toLocaleString()],
      ["Restaurant", business.brandName],
      ["Branch", business.branchName],
      ["Owner", business.ownerName],
      ["Phone", business.supportPhone],
      ["Email", business.supportEmail],
      ["City", business.city],
      ["Address", business.address],
      ["Website", business.website],
      ["GST", business.gstNumber],
    ].filter((row) => row[1]);

    const csv =
      metadataRows.map((row) => row.map(csvEscape).join(",")).join("\n") +
      "\n\n" +
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
            .join(","),
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "customers.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Customer Management
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Customer insights from live order activity.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={exportCSV}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
            >
              Export CSV
            </button>
            <button
              onClick={refresh}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
            >
              Sync Orders
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <SummaryCards summary={customerSummary} />

      {/* Search & Entries */}
      <SearchBar
        search={search}
        onSearchChange={(value) => {
          setSearch(value);
          setPage(1);
        }}
        entries={entries}
        onEntriesChange={setEntries}
      />

      {/* Customer Table */}
      <CustomerTable
        customers={paginatedCustomers}
        isLoading={isLoading}
        onView={(customer) => {
          setSelected(customer);
          setIsViewOpen(true);
        }}
      />

      {/* Pagination */}
      <Pagination
        page={page}
        totalPages={totalPages}
        prevPage={prevPage}
        nextPage={nextPage}
        showing={paginatedCustomers.length}
        total={filtered.length}
      />

      {/* Customer Detail Modal */}
      {isViewOpen && selected && (
        <Modal title="Customer Details" onClose={() => setIsViewOpen(false)}>
          <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
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

          <div className="mt-5">
            <p className="mb-2 text-sm font-semibold">Recent Orders</p>
            {selected.recentOrders.length === 0 ? (
              <p className="text-sm text-gray-500">No recent orders</p>
            ) : (
              <div className="space-y-2">
                {selected.recentOrders.map((order) => (
                  <div
                    key={`${order.id}-${order.time}`}
                    className="rounded-lg border p-3 text-xs"
                  >
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