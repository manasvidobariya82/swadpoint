// "use client";

// import { useEffect, useState } from "react";

// const Orders = () => {
//   const [orderType, setOrderType] = useState("Takeaway");
//   const [status, setStatus] = useState("New Order");

//   const orderTypes = ["Takeaway", "Delivery", "Table/Room", "Dine In"];

//   const statuses = [
//     "New Order",
//     "Confirmed",
//     "Preparing",
//     "Ready for pickup",
//     "Order Completed",
//     "Cancelled",
//   ];

//   // ================= ORDERS STATE =================
//   const [orders, setOrders] = useState([
//     {
//       id: "#1023",
//       name: "Rahul Sharma",
//       amount: "₹450",
//       items: 3,
//       type: "Takeaway",
//       status: "New Order",
//       time: "2 mins ago",
//     },
//     {
//       id: "#1024",
//       name: "Anita Patel",
//       amount: "₹820",
//       items: 5,
//       type: "Delivery",
//       status: "Preparing",
//       time: "5 mins ago",
//     },
//   ]);

//   // ================= REAL-TIME SIMULATION =================
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setOrders((prev) => [
//         ...prev,
//         {
//           id: `#${Math.floor(Math.random() * 9000)}`,
//           name: "New Customer",
//           amount: "₹" + (300 + Math.floor(Math.random() * 500)),
//           items: Math.floor(Math.random() * 5) + 1,
//           type: orderTypes[Math.floor(Math.random() * orderTypes.length)],
//           status: "New Order",
//           time: "Just now",
//         },
//       ]);
//     }, 15000); // every 15 sec

//     return () => clearInterval(interval);
//   }, []);

//   // ================= FILTER =================
//   const filteredOrders = orders.filter(
//     (o) => o.type === orderType && o.status === status
//   );

//   // ================= STATUS COLORS =================
//   const statusColor = {
//     "New Order": "bg-blue-100 text-blue-700",
//     Confirmed: "bg-yellow-100 text-yellow-700",
//     Preparing: "bg-purple-100 text-purple-700",
//     "Ready for pickup": "bg-green-100 text-green-700",
//     "Order Completed": "bg-gray-200 text-gray-700",
//     Cancelled: "bg-red-100 text-red-700",
//   };

//   // ================= STATUS UPDATE =================
//   const updateStatus = (id, newStatus) => {
//     setOrders((prev) =>
//       prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
//     );
//   };

//   // ================= COUNTS =================
//   const statusCount = (tab) =>
//     orders.filter((o) => o.type === orderType && o.status === tab).length;

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
//       <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
//         {/* ================= ORDER TYPE ================= */}
//         <div className="flex gap-2 sm:gap-4 overflow-x-auto pb-3">
//           {orderTypes.map((type) => (
//             <button
//               key={type}
//               onClick={() => setOrderType(type)}
//               className={`px-4 sm:px-6 py-2 rounded-full text-sm font-medium border
//                 ${
//                   orderType === type
//                     ? "bg-black text-white"
//                     : "bg-white text-gray-600 border-gray-300"
//                 }`}
//             >
//               {type}
//             </button>
//           ))}
//         </div>

//         {/* ================= STATUS TABS WITH COUNTS ================= */}
//         <div className="flex gap-6 sm:gap-10 mt-6 border-b overflow-x-auto">
//           {statuses.map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setStatus(tab)}
//               className={`relative pb-3 text-sm font-medium whitespace-nowrap
//                 ${status === tab ? "text-orange-500" : "text-gray-600"}`}
//             >
//               {tab}
//               <span className="ml-2 px-2 py-[2px] text-xs rounded-full bg-gray-200">
//                 {statusCount(tab)}
//               </span>
//               {status === tab && (
//                 <span className="absolute left-0 bottom-0 w-full h-[2px] bg-orange-500"></span>
//               )}
//             </button>
//           ))}
//         </div>

//         {/* ================= ORDERS LIST ================= */}
//         <div className="mt-6 space-y-4">
//           {filteredOrders.length ? (
//             filteredOrders.map((order) => (
//               <div
//                 key={order.id}
//                 className="border rounded-xl p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow"
//               >
//                 {/* LEFT */}
//                 <div>
//                   <p className="font-semibold">
//                     {order.name}{" "}
//                     <span className="text-gray-400 text-sm">({order.id})</span>
//                   </p>
//                   <p className="text-sm text-gray-500">
//                     {order.items} items · {order.time}
//                   </p>
//                 </div>

//                 {/* STATUS PILL */}
//                 <span
//                   className={`px-3 py-1 text-xs rounded-full w-fit ${
//                     statusColor[order.status]
//                   }`}
//                 >
//                   {order.status}
//                 </span>

//                 {/* ACTION BUTTONS */}
//                 <div className="flex gap-2">
//                   {order.status === "New Order" && (
//                     <>
//                       <button
//                         onClick={() => updateStatus(order.id, "Confirmed")}
//                         className="px-3 py-2 bg-green-500 text-white text-sm rounded"
//                       >
//                         Accept
//                       </button>
//                       <button
//                         onClick={() => updateStatus(order.id, "Cancelled")}
//                         className="px-3 py-2 bg-red-500 text-white text-sm rounded"
//                       >
//                         Reject
//                       </button>
//                     </>
//                   )}

//                   {order.status === "Confirmed" && (
//                     <button
//                       onClick={() => updateStatus(order.id, "Preparing")}
//                       className="px-3 py-2 bg-purple-500 text-white text-sm rounded"
//                     >
//                       Start Preparing
//                     </button>
//                   )}

//                   {order.status === "Preparing" && (
//                     <button
//                       onClick={() => updateStatus(order.id, "Ready for pickup")}
//                       className="px-3 py-2 bg-orange-500 text-white text-sm rounded"
//                     >
//                       Ready
//                     </button>
//                   )}
//                 </div>

//                 {/* AMOUNT */}
//                 <span className="font-semibold">{order.amount}</span>
//               </div>
//             ))
//           ) : (
//             <div className="bg-gray-50 border rounded-lg py-10 text-center text-gray-500">
//               No orders available 🚫
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Orders;

"use client";

import { useState } from "react";

const Orders = () => {
  const [orderType, setOrderType] = useState("Takeaway");
  const [status, setStatus] = useState("New Order");
  const [openOrder, setOpenOrder] = useState(null);

  const orderTypes = ["Takeaway", "Delivery", "Table/Room", "Dine In"];

  const statuses = [
    "New Order",
    "Preparing",
    "Ready for pickup",
    "Order Completed",
    "Cancelled",
  ];

  const [orders, setOrders] = useState([
    {
      id: "#1023",
      name: "Rahul Sharma",
      type: "Takeaway",
      status: "New Order",
      time: "2 mins ago",
      prepTime: null,
      itemsList: [
        { name: "Paneer Butter Masala", qty: 1, price: 220 },
        { name: "Butter Naan", qty: 2, price: 40 },
      ],
    },
    {
      id: "#1024",
      name: "Anita Patel",
      type: "Delivery",
      status: "Preparing",
      time: "5 mins ago",
      prepTime: 25,
      itemsList: [
        { name: "Veg Biryani", qty: 1, price: 180 },
        { name: "Cold Drink", qty: 2, price: 50 },
      ],
    },
  ]);

  const filteredOrders = orders.filter(
    (o) => o.type === orderType && o.status === status
  );

  const acceptOrder = (id) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === id ? { ...o, status: "Preparing", prepTime: 20 } : o
      )
    );
    setStatus("Preparing");
  };

  const getTotal = (items) =>
    items.reduce((sum, item) => sum + item.qty * item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow p-4 sm:p-6">
        {/* ORDER TYPE */}
        <div className="flex gap-3 overflow-x-auto pb-3">
          {orderTypes.map((type) => (
            <button
              key={type}
              onClick={() => setOrderType(type)}
              className={`px-5 py-2 rounded-full text-sm border
                ${
                  orderType === type
                    ? "bg-black text-white"
                    : "bg-white text-gray-600"
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* STATUS TABS */}
        <div className="flex gap-6 mt-6 border-b overflow-x-auto">
          {statuses.map((tab) => (
            <button
              key={tab}
              onClick={() => setStatus(tab)}
              className={`pb-3 text-sm
                ${status === tab ? "text-orange-500" : "text-gray-500"}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ORDERS */}
        <div className="mt-6 space-y-4">
          {filteredOrders.length ? (
            filteredOrders.map((order) => (
              <div key={order.id} className="border rounded-xl p-4 space-y-3">
                {/* HEADER */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">
                      {order.name}{" "}
                      <span className="text-gray-400 text-sm">
                        ({order.id})
                      </span>
                    </p>
                    <p className="text-sm text-gray-500">{order.time}</p>

                    {order.prepTime && (
                      <span className="inline-block mt-1 text-xs px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                        ⏱️ {order.prepTime} mins prep
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      setOpenOrder(openOrder === order.id ? null : order.id)
                    }
                    className="text-sm text-blue-600"
                  >
                    {openOrder === order.id ? "Hide Items" : "View Items"}
                  </button>
                </div>

                {/* ITEMS LIST */}
                {openOrder === order.id && (
                  <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                    {order.itemsList.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>
                          {item.name} × {item.qty}
                        </span>
                        <span>₹{item.qty * item.price}</span>
                      </div>
                    ))}

                    <div className="border-t pt-2 flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{getTotal(order.itemsList)}</span>
                    </div>
                  </div>
                )}

                {/* ACTIONS */}
                {order.status === "New Order" && (
                  <button
                    onClick={() => acceptOrder(order.id)}
                    className="w-full sm:w-auto px-4 py-2 bg-green-500 text-white rounded-lg text-sm"
                  >
                    Accept Order
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-10 text-gray-500">
              No orders available 🚫
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
