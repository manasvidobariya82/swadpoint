// // import React from "react";

// // const page = () => {
// //   return <div>nbjbiiojb</div>;
// // };

// // export default page;

// "use client";
// import React, { useState, useEffect } from "react";

// /* ---------- DATA ---------- */
// const batchCoupons = [
//   {
//     batch: "NEWYEAR2025",
//     usage: "10/100",
//     type: "Percentage",
//     value: "20%",
//     minOrder: "₹299",
//     maxDiscount: "₹150",
//     outlet: "All",
//   },
//   {
//     batch: "WELCOME10",
//     usage: "2/20",
//     type: "Percentage",
//     value: "10%",
//     minOrder: "₹149",
//     maxDiscount: "₹100",
//     outlet: "All",
//   },
// ];

// const couponDiscounts = [
//   {
//     batch: "FLAT50",
//     usage: "5/50",
//     type: "Flat",
//     value: "₹50",
//     minOrder: "₹199",
//     maxDiscount: "₹50",
//     outlet: "Main Outlet",
//   },
// ];

// export default function BatchCouponsDynamic() {
//   const [activeTab, setActiveTab] = useState("batch");
//   const [entries, setEntries] = useState(10);
//   const [currentPage, setCurrentPage] = useState(1);

//   const tableData = activeTab === "batch" ? batchCoupons : couponDiscounts;

//   useEffect(() => {
//     setCurrentPage(1);
//   }, [activeTab, entries]);

//   const startIndex = (currentPage - 1) * entries;
//   const paginatedData = tableData.slice(startIndex, startIndex + entries);

//   const totalPages = Math.ceil(tableData.length / entries);

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b pb-4 mb-6">
//           <h2 className="text-xl font-semibold">
//             {activeTab === "batch" ? "Batch Coupons" : "Coupons Discounts"}
//           </h2>

//           <div className="flex items-center gap-6 text-sm">
//             <button className="text-blue-600">ℹ️ How it works!</button>

//             <div className="flex flex-col text-right">
//               <button
//                 onClick={() => setActiveTab("batch")}
//                 className={`font-medium ${
//                   activeTab === "batch" ? "text-blue-600" : "text-gray-500"
//                 }`}
//               >
//                 + Batch Coupons
//               </button>

//               <button
//                 onClick={() => setActiveTab("discount")}
//                 className={`underline mt-1 ${
//                   activeTab === "discount" ? "text-blue-600" : "text-gray-500"
//                 }`}
//               >
//                 Coupons Discounts
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* CONTROLS */}
//         <div className="flex items-center gap-2 mb-4 text-sm">
//           <span>Show</span>
//           <select
//             className="border rounded px-2 py-1"
//             value={entries}
//             onChange={(e) => setEntries(Number(e.target.value))}
//           >
//             <option value={10}>10</option>
//             <option value={25}>25</option>
//             <option value={50}>50</option>
//           </select>
//           <span>Entries</span>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse text-sm">
//             <thead>
//               <tr className="border-b text-left text-gray-700">
//                 <th className="py-3">Batch ↕</th>
//                 <th className="py-3">Coupon Usages ↕</th>
//                 <th className="py-3">Type ↕</th>
//                 <th className="py-3">Value ↕</th>
//                 <th className="py-3">Min Order Value ↕</th>
//                 <th className="py-3">Max Discount ↕</th>
//                 <th className="py-3">Outlet ↕</th>
//                 <th className="py-3">Action</th>
//               </tr>
//             </thead>

//             <tbody>
//               {paginatedData.length === 0 ? (
//                 <tr>
//                   <td colSpan="8" className="text-center py-10 text-gray-500">
//                     No Coupon Data Available
//                   </td>
//                 </tr>
//               ) : (
//                 paginatedData.map((item, index) => (
//                   <tr key={index} className="border-b">
//                     <td className="py-3">{item.batch}</td>
//                     <td>{item.usage}</td>
//                     <td>{item.type}</td>
//                     <td>{item.value}</td>
//                     <td>{item.minOrder}</td>
//                     <td>{item.maxDiscount}</td>
//                     <td>{item.outlet}</td>
//                     <td className="text-blue-600 cursor-pointer">View</td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* FOOTER */}
//         <div className="flex justify-between items-center mt-6 text-sm">
//           <span>
//             Showing {paginatedData.length} of {tableData.length} entries
//           </span>

//           <div className="flex gap-2">
//             <button
//               disabled={currentPage === 1}
//               onClick={() => setCurrentPage((p) => p - 1)}
//               className="border rounded px-4 py-1 disabled:text-gray-400"
//             >
//               Previous
//             </button>

//             <button
//               disabled={currentPage === totalPages}
//               onClick={() => setCurrentPage((p) => p + 1)}
//               className="border rounded px-4 py-1 disabled:text-gray-400"
//             >
//               Next
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";
import React, { useEffect, useState } from "react";

/* ================= DATA ================= */
const batchCoupons = [
  {
    batch: "NEWYEAR2025",
    usage: "10/100",
    type: "Percentage",
    value: "20%",
    minOrder: "₹299",
    maxDiscount: "₹150",
    outlet: "All",
  },
  {
    batch: "WELCOME10",
    usage: "2/20",
    type: "Percentage",
    value: "10%",
    minOrder: "₹149",
    maxDiscount: "₹100",
    outlet: "All",
  },
];

const couponDiscounts = [
  {
    batch: "FLAT50",
    usage: "5/50",
    type: "Flat",
    value: "₹50",
    minOrder: "₹199",
    maxDiscount: "₹50",
    outlet: "Main Outlet",
  },
];

/* ================= COMPONENT ================= */
export default function BatchCouponsDynamic() {
  const [activeTab, setActiveTab] = useState("batch");
  const [entries, setEntries] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  /* Select data */
  const tableData = activeTab === "batch" ? batchCoupons : couponDiscounts;

  /* Reset page when tab or entries change */
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, entries]);

  /* Pagination (SAFE) */
  const startIndex = (currentPage - 1) * entries;
  const paginatedData =
    tableData.length > 0
      ? tableData.slice(startIndex, startIndex + entries)
      : [];

  const totalPages = Math.max(1, Math.ceil(tableData.length / entries));

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* ================= HEADER ================= */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-xl font-semibold">
            {activeTab === "batch" ? "Batch Coupons" : "Coupons Discounts"}
          </h2>

          <div className="flex items-center gap-6 text-sm">
            <button className="text-blue-600">ℹ️ How it works!</button>

            <div className="flex flex-col text-right">
              <button
                onClick={() => setActiveTab("batch")}
                className={`font-medium ${
                  activeTab === "batch" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                + Batch Coupons
              </button>

              <button
                onClick={() => setActiveTab("discount")}
                className={`underline mt-1 ${
                  activeTab === "discount" ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Coupons Discounts
              </button>
            </div>
          </div>
        </div>

        {/* ================= CONTROLS ================= */}
        <div className="flex items-center gap-2 mb-4 text-sm">
          <span>Show</span>
          <select
            className="border rounded px-2 py-1"
            value={entries}
            onChange={(e) => setEntries(Number(e.target.value))}
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>Entries</span>
        </div>

        {/* ================= TABLE ================= */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b text-left text-gray-700">
                <th className="py-3">Batch ↕</th>
                <th className="py-3">Coupon Usages ↕</th>
                <th className="py-3">Type ↕</th>
                <th className="py-3">Value ↕</th>
                <th className="py-3">Min Order Value ↕</th>
                <th className="py-3">Max Discount ↕</th>
                <th className="py-3">Outlet ↕</th>
                <th className="py-3">Action</th>
              </tr>
            </thead>

            <tbody>
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-10 text-gray-500">
                    No Coupon Data Available
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-3">{item.batch}</td>
                    <td>{item.usage}</td>
                    <td>{item.type}</td>
                    <td>{item.value}</td>
                    <td>{item.minOrder}</td>
                    <td>{item.maxDiscount}</td>
                    <td>{item.outlet}</td>
                    <td className="text-blue-600 cursor-pointer">View</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= FOOTER ================= */}
        <div className="flex justify-between items-center mt-6 text-sm">
          <span>
            Showing {paginatedData.length} of {tableData.length} entries
          </span>

          <div className="flex gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="border rounded px-4 py-1 disabled:text-gray-400"
            >
              Previous
            </button>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="border rounded px-4 py-1 disabled:text-gray-400"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
