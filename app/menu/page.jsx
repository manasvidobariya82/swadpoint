// "use client";

// import { useState, useEffect } from "react";
// import { getMenu, getOrders, saveOrders } from "@/helper/storage";

// export default function CustomerMenu() {
//   const [menu, setMenu] = useState([]);
//   const [cart, setCart] = useState([]);

//   useEffect(() => {
//     setMenu(getMenu());
//   }, []);

//   const addToCart = (item) => {
//     setCart([...cart, item]);
//   };

//   const placeOrder = () => {
//     if (cart.length === 0) return alert("Cart is empty");

//     const newOrder = {
//       id: Date.now(),
//       items: cart,
//       total: cart.reduce((sum, item) => sum + item.price, 0),
//       status: "Pending",
//       time: new Date().toLocaleString(),
//     };

//     const existingOrders = getOrders();
//     const updatedOrders = [...existingOrders, newOrder];

//     saveOrders(updatedOrders);

//     alert("Order Placed Successfully!");
//     setCart([]);
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Customer Menu</h2>

//       {menu.map((item) => (
//         <div key={item.id}>
//           {item.name} - ₹{item.price}
//           <button onClick={() => addToCart(item)}>Add</button>
//         </div>
//       ))}

//       <hr />

//       <h3>Cart</h3>

//       {cart.map((item, index) => (
//         <p key={index}>
//           {item.name} - ₹{item.price}
//         </p>
//       ))}

//       <h4>Total: ₹{cart.reduce((sum, item) => sum + item.price, 0)}</h4>

//       <button onClick={placeOrder}>Place Order</button>
//     </div>
//   );
// }
// "use client";

// import { useState, useEffect } from "react";

// export default function AdminMenuPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     description: "",
//   });

//   // Load saved menu
//   useEffect(() => {
//     const stored = localStorage.getItem("restaurantMenu");
//     if (stored) {
//       setMenuItems(JSON.parse(stored));
//     }
//   }, []);

//   // Save automatically
//   useEffect(() => {
//     localStorage.setItem("restaurantMenu", JSON.stringify(menuItems));
//   }, [menuItems]);

//   const addItem = () => {
//     if (!form.name || !form.price) {
//       alert("Fill all required fields");
//       return;
//     }

//     const newItem = {
//       id: Date.now(),
//       name: form.name,
//       price: form.price,
//       description: form.description,
//     };

//     setMenuItems([...menuItems, newItem]);

//     setForm({
//       name: "",
//       price: "",
//       description: "",
//     });
//   };

//   const deleteItem = (id) => {
//     setMenuItems(menuItems.filter((item) => item.id !== id));
//   };

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <div className="max-w-4xl mx-auto">
//         <h1 className="text-3xl font-bold mb-6">Admin Menu Management</h1>

//         {/* Add Item Form */}
//         <div className="bg-white p-6 rounded-xl shadow mb-8">
//           <input
//             type="text"
//             placeholder="Item Name"
//             value={form.name}
//             onChange={(e) => setForm({ ...form, name: e.target.value })}
//             className="w-full border px-4 py-2 rounded mb-3"
//           />

//           <input
//             type="number"
//             placeholder="Price"
//             value={form.price}
//             onChange={(e) => setForm({ ...form, price: e.target.value })}
//             className="w-full border px-4 py-2 rounded mb-3"
//           />

//           <textarea
//             placeholder="Description"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             className="w-full border px-4 py-2 rounded mb-3"
//           />

//           <button
//             onClick={addItem}
//             className="bg-blue-600 text-white px-6 py-2 rounded-lg"
//           >
//             Add Item
//           </button>
//         </div>

//         {/* Menu List */}
//         <div className="bg-white p-6 rounded-xl shadow">
//           <h2 className="text-xl font-semibold mb-4">Menu Items</h2>

//           {menuItems.length === 0 ? (
//             <p>No items added</p>
//           ) : (
//             menuItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex justify-between items-center border-b py-3"
//               >
//                 <div>
//                   <p className="font-semibold">{item.name}</p>
//                   <p className="text-sm text-gray-500">{item.description}</p>
//                   <p className="text-green-600 font-bold">₹{item.price}</p>
//                 </div>

//                 <button
//                   onClick={() => deleteItem(item.id)}
//                   className="text-red-600"
//                 >
//                   Delete
//                 </button>
//               </div>
//             ))
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useSearchParams } from "next/navigation";
// import { useEffect, useState } from "react";

// export default function CustomerMenu() {
//   const searchParams = useSearchParams();
//   const table = searchParams.get("table");

//   const [menuItems, setMenuItems] = useState([]);

//   useEffect(() => {
//     const stored = localStorage.getItem("restaurantMenu");
//     if (stored) {
//       setMenuItems(JSON.parse(stored));
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">
//           <h1 className="text-2xl font-bold">🍽 Digital Menu</h1>
//           <p className="text-gray-500 mt-2">Table No: {table}</p>
//         </div>

//         {menuItems.length === 0 ? (
//           <p className="text-center text-gray-500">No menu items available</p>
//         ) : (
//           <div className="grid gap-4">
//             {menuItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white p-4 rounded-xl shadow flex justify-between"
//               >
//                 <div>
//                   <h2 className="font-semibold">{item.name}</h2>
//                   <p className="text-sm text-gray-500">{item.description}</p>
//                 </div>

//                 <div className="font-bold text-green-600">₹{item.price}</div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function CustomerMenu() {
  const searchParams = useSearchParams();
  const table = searchParams.get("table");

  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("restaurantMenu");
      if (stored) {
        setMenuItems(JSON.parse(stored));
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white p-6 rounded-xl shadow mb-6 text-center">
          <h1 className="text-2xl font-bold">🍽 Digital Menu</h1>
          <p className="text-gray-500 mt-2">Table No: {table}</p>
        </div>

        {menuItems.length === 0 ? (
          <p className="text-center text-red-500 font-semibold">
            No menu items found in localStorage
          </p>
        ) : (
          <div className="grid gap-4">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between"
              >
                <div>
                  <h2 className="font-semibold">{item.name}</h2>
                  <p className="text-sm text-gray-500">{item.description}</p>
                </div>

                <div className="font-bold text-green-600">₹{item.price}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
