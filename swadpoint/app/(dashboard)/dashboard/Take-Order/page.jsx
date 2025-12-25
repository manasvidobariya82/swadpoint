// import React from "react";

// const page = () => {
//   return <div>mknlnbjk</div>;
// };

// export default page;

"use client";
import React, { useState } from "react";

export default function Page() {
  const [search, setSearch] = useState("");
  const [customer, setCustomer] = useState({
    phone: "",
    name: "",
    email: "",
    instruction: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = () => {
    if (!customer.phone || !customer.name) {
      alert("Customer phone and name are required");
      return;
    }

    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      const orderPayload = {
        searchItem: search,
        orderType: "TAKEAWAY",
        customer,
      };

      console.log("ORDER PLACED ✅", orderPayload);

      alert("Order placed successfully!");

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="h-screen w-full bg-gray-100">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 bg-white shadow-sm">
        <div className="flex items-center gap-2 text-lg font-semibold text-gray-800">
          <span className="text-xl cursor-pointer">‹</span>
          <span>Take Order</span>
        </div>

        <div className="flex items-center gap-4 w-2/3">
          <input
            type="text"
            placeholder="Search here..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-full border border-gray-300 px-5 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100"
          />

          <button
            onClick={handlePlaceOrder}
            disabled={loading}
            className={`rounded-full px-7 py-2.5 text-sm font-medium text-white shadow transition
              ${loading ? "bg-green-300" : "bg-green-500 hover:bg-green-600"}`}
          >
            {loading ? "Placing..." : "Place Order"}
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex h-[calc(100vh-72px)]">
        {/* Left Section */}
        <div className="flex-1"></div>

        {/* Right Panel */}
        <div className="w-[400px] p-6 space-y-6">
          {/* Takeaway */}
          <div className="bg-white rounded-xl shadow-sm px-5 py-4">
            <span className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1">
              Takeaway
            </span>
          </div>

          {/* Customer Info */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-gray-800">
                Customer Information
              </h3>
              <button className="text-sm text-blue-600 font-medium hover:underline">
                Browse Customer
              </button>
            </div>

            <div className="space-y-4">
              {/* Phone */}
              <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:ring-2 focus-within:ring-blue-100">
                <div className="flex items-center px-4 bg-gray-100 text-sm text-gray-700">
                  +91
                </div>
                <input
                  type="text"
                  name="phone"
                  value={customer.phone}
                  onChange={handleChange}
                  placeholder="Enter customer number"
                  className="flex-1 px-3 py-2 text-sm outline-none"
                />
              </div>

              {/* Name */}
              <input
                type="text"
                name="name"
                value={customer.name}
                onChange={handleChange}
                placeholder="Enter customer name"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />

              {/* Email */}
              <input
                type="email"
                name="email"
                value={customer.email}
                onChange={handleChange}
                placeholder="Enter customer email id"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-100"
              />

              {/* Instruction */}
              <textarea
                name="instruction"
                value={customer.instruction}
                onChange={handleChange}
                placeholder="Enter Instruction"
                rows={3}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none resize-none focus:ring-2 focus:ring-blue-100"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
