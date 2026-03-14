

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
