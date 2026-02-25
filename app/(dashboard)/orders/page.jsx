"use client";

import { useState, useEffect } from "react";
import { getOrders, saveOrders } from "@/helper/storage";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    setOrders(getOrders());
  }, []);

  const markCompleted = (id) => {
    const updated = orders.map((order) =>
      order.id === id ? { ...order, status: "Completed" } : order,
    );

    setOrders(updated);
    saveOrders(updated);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin Orders</h2>

      {orders.length === 0 && <p>No Orders Yet</p>}

      {orders.map((order) => (
        <div key={order.id} style={{ border: "1px solid black", margin: 10 }}>
          <h4>Order ID: {order.id}</h4>
          <p>Status: {order.status}</p>
          <p>Time: {order.time}</p>

          {order.items.map((item, index) => (
            <p key={index}>
              {item.name} - ₹{item.price}
            </p>
          ))}

          <strong>Total: ₹{order.total}</strong>

          {order.status === "Pending" && (
            <button onClick={() => markCompleted(order.id)}>
              Mark Completed
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
