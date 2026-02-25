// "use client";

// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";

// export default function CustomerMenu() {
//   const searchParams = useSearchParams();
//   const table = searchParams.get("table");

//   const [menuItems, setMenuItems] = useState([]);

//   // Load menu from localStorage (saved by Admin)
//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const storedMenu = localStorage.getItem("restaurantMenu");
//       if (storedMenu) {
//         setMenuItems(JSON.parse(storedMenu));
//       }
//     }
//   }, []);

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* HEADER */}
//         <div className="bg-white p-4 rounded-xl shadow mb-6 text-center">
//           <h1 className="text-2xl font-bold">🍽️ Welcome to SwadPoint</h1>
//           <p className="text-gray-500 mt-2">Table No: {table}</p>
//         </div>

//         {/* MENU LIST */}
//         {menuItems.length === 0 ? (
//           <div className="bg-white p-6 rounded-xl shadow text-center">
//             <p className="text-gray-500">No menu items available</p>
//           </div>
//         ) : (
//           <div className="grid gap-4">
//             {menuItems.map((item) => (
//               <div
//                 key={item.id}
//                 className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
//               >
//                 <div>
//                   <h2 className="font-semibold text-lg">{item.name}</h2>
//                   <p className="text-sm text-gray-500">
//                     {item.description || "Delicious item"}
//                   </p>
//                 </div>

//                 <div className="text-lg font-bold text-green-600">
//                   ₹{item.price}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// "use client";
// import { useMenu } from "@/context/menucontext";
// import Link from "next/link";

// export default function MenuPage() {
//   const { menuItems, addToCart } = useMenu();

//   return (
//     <div>
//       <h1>Our Menu</h1>
//       <Link href="/cart">Go to Cart</Link>
//       <ul>
//         {menuItems.map((item) => (
//           <li key={item.id}>
//             <h3>{item.name}</h3>
//             <p>{item.description}</p>
//             <p>${item.price}</p>
//             <button onClick={() => addToCart(item)}>Add to Cart</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { getMenu, saveMenu } from "@/helper/storage";

// export default function AdminMenu() {
//   const [name, setName] = useState("");
//   const [price, setPrice] = useState("");
//   const [menu, setMenu] = useState([]);

//   useEffect(() => {
//     setMenu(getMenu());
//   }, []);

//   const addItem = () => {
//     if (!name || !price) return alert("Fill all fields");

//     const newItem = {
//       id: Date.now(),
//       name,
//       price: Number(price),
//     };

//     const updatedMenu = [...menu, newItem];
//     setMenu(updatedMenu);
//     saveMenu(updatedMenu);

//     setName("");
//     setPrice("");
//   };

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Admin Menu Management</h2>

//       <input
//         placeholder="Item Name"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Price"
//         value={price}
//         onChange={(e) => setPrice(e.target.value)}
//       />

//       <button onClick={addItem}>Add Item</button>

//       <hr />

//       <h3>Menu List</h3>
//       {menu.map((item) => (
//         <p key={item.id}>
//           {item.name} - ₹{item.price}
//         </p>
//       ))}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { Pencil, Trash2, Plus } from "lucide-react";

// export default function AdminMenuPage() {
//   const [menuItems, setMenuItems] = useState([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editingId, setEditingId] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     price: "",
//     description: "",
//     category: "Main Course",
//   });

//   // ✅ Load from localStorage
//   useEffect(() => {
//     const storedMenu = localStorage.getItem("restaurantMenu");
//     if (storedMenu) {
//       setMenuItems(JSON.parse(storedMenu));
//     }
//   }, []);

//   // ✅ Save to localStorage
//   useEffect(() => {
//     localStorage.setItem("restaurantMenu", JSON.stringify(menuItems));
//   }, [menuItems]);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = () => {
//     if (!formData.name || !formData.price) {
//       alert("Please fill required fields");
//       return;
//     }

//     if (editingId) {
//       // Update item
//       const updated = menuItems.map((item) =>
//         item.id === editingId ? { ...item, ...formData } : item,
//       );
//       setMenuItems(updated);
//       setEditingId(null);
//     } else {
//       // Add new item
//       const newItem = {
//         id: Date.now(),
//         ...formData,
//       };
//       setMenuItems([...menuItems, newItem]);
//     }

//     setFormData({
//       name: "",
//       price: "",
//       description: "",
//       category: "Main Course",
//     });

//     setShowForm(false);
//   };

//   const handleEdit = (item) => {
//     setFormData(item);
//     setEditingId(item.id);
//     setShowForm(true);
//   };

//   const handleDelete = (id) => {
//     const filtered = menuItems.filter((item) => item.id !== id);
//     setMenuItems(filtered);
//   };

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* HEADER */}
//         <div className="flex justify-between items-center">
//           <h1 className="text-2xl font-bold">Menu Management</h1>

//           <button
//             onClick={() => {
//               setShowForm(!showForm);
//               setEditingId(null);
//               setFormData({
//                 name: "",
//                 price: "",
//                 description: "",
//                 category: "Main Course",
//               });
//             }}
//             className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-all duration-300"
//           >
//             <Plus size={18} />
//             Add Item
//           </button>
//         </div>

//         {/* FORM */}
//         {showForm && (
//           <div className="bg-white p-6 rounded-2xl shadow-lg transition-all duration-500">
//             <div className="grid md:grid-cols-2 gap-4">
//               <input
//                 type="text"
//                 name="name"
//                 placeholder="Item Name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 className="border px-3 py-2 rounded-lg"
//               />

//               <input
//                 type="number"
//                 name="price"
//                 placeholder="Price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 className="border px-3 py-2 rounded-lg"
//               />

//               <input
//                 type="text"
//                 name="description"
//                 placeholder="Description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="border px-3 py-2 rounded-lg md:col-span-2"
//               />

//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="border px-3 py-2 rounded-lg"
//               >
//                 <option>Main Course</option>
//                 <option>Appetizer</option>
//                 <option>Dessert</option>
//                 <option>Drinks</option>
//               </select>
//             </div>

//             <div className="mt-4 flex justify-end">
//               <button
//                 onClick={handleSubmit}
//                 className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-all duration-300"
//               >
//                 {editingId ? "Update Item" : "Save Item"}
//               </button>
//             </div>
//           </div>
//         )}

//         {/* MENU LIST */}
//         <div className="bg-white rounded-2xl shadow-lg p-6">
//           <h2 className="text-lg font-semibold mb-4">Menu Items</h2>

//           {menuItems.length === 0 ? (
//             <p className="text-gray-500 text-sm">No items added yet.</p>
//           ) : (
//             <div className="space-y-3">
//               {menuItems.map((item) => (
//                 <div
//                   key={item.id}
//                   className="p-4 border rounded-xl flex justify-between items-center hover:shadow-md transition-all duration-300"
//                 >
//                   <div>
//                     <h3 className="font-semibold">{item.name}</h3>
//                     <p className="text-sm text-gray-500">
//                       ₹{item.price} • {item.category}
//                     </p>
//                     <p className="text-xs text-gray-400">{item.description}</p>
//                   </div>

//                   <div className="flex gap-3">
//                     <button
//                       onClick={() => handleEdit(item)}
//                       className="text-blue-600 hover:scale-110 transition"
//                     >
//                       <Pencil size={18} />
//                     </button>

//                     <button
//                       onClick={() => handleDelete(item.id)}
//                       className="text-red-600 hover:scale-110 transition"
//                     >
//                       <Trash2 size={18} />
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect } from "react";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
  });

  // Load saved menu
  useEffect(() => {
    const stored = localStorage.getItem("restaurantMenu");
    if (stored) {
      setMenuItems(JSON.parse(stored));
    }
  }, []);

  // Save automatically
  useEffect(() => {
    localStorage.setItem("restaurantMenu", JSON.stringify(menuItems));
  }, [menuItems]);

  const addItem = () => {
    if (!form.name || !form.price) {
      alert("Fill all required fields");
      return;
    }

    const newItem = {
      id: Date.now(),
      name: form.name,
      price: form.price,
      description: form.description,
    };

    setMenuItems([...menuItems, newItem]);

    setForm({
      name: "",
      price: "",
      description: "",
    });
  };

  const deleteItem = (id) => {
    setMenuItems(menuItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Admin Menu Management</h1>

        {/* Add Item Form */}
        <div className="bg-white p-6 rounded-xl shadow mb-8">
          <input
            type="text"
            placeholder="Item Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border px-4 py-2 rounded mb-3"
          />

          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="w-full border px-4 py-2 rounded mb-3"
          />

          <textarea
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full border px-4 py-2 rounded mb-3"
          />

          <button
            onClick={addItem}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg"
          >
            Add Item
          </button>
        </div>

        {/* Menu List */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold mb-4">Menu Items</h2>

          {menuItems.length === 0 ? (
            <p>No items added</p>
          ) : (
            menuItems.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center border-b py-3"
              >
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.description}</p>
                  <p className="text-green-600 font-bold">₹{item.price}</p>
                </div>

                <button
                  onClick={() => deleteItem(item.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
