// // // "use client";

// // // import React, { useState } from "react";
// // // import { Info } from "lucide-react";

// // // export default function MenuPage() {
// // //   const [showAddPage, setShowAddPage] = useState(false);

// // //   return (
// // //     <div className="min-h-screen bg-gray-100 p-8">
// // //       {!showAddPage ? (
// // //         /* =======================
// // //            MENU LANDING PAGE
// // //         ======================= */
// // //         <div className="flex items-center justify-center min-h-[80vh]">
// // //           <div className="bg-white w-full max-w-4xl rounded-xl shadow p-14 text-center">
// // //             <h1 className="text-2xl font-semibold mb-4">
// // //               Create your digital menu now!!!
// // //             </h1>

// // //             <button
// // //               onClick={() => setShowAddPage(true)}
// // //               className="text-blue-600 font-medium hover:underline"
// // //             >
// // //               + Add Menu Item
// // //             </button>
// // //           </div>
// // //         </div>
// // //       ) : (
// // //         /* =======================
// // //            ADD MENU ITEM PAGE
// // //         ======================= */
// // //         <div>
// // //           {/* Header */}
// // //           <div className="flex items-center mb-6">
// // //             <button
// // //               onClick={() => setShowAddPage(false)}
// // //               className="text-xl mr-3"
// // //             >
// // //               ←
// // //             </button>

// // //             <h2 className="text-xl font-semibold">Add Menu Item</h2>

// // //             <div className="ml-auto flex items-center gap-1 text-blue-600">
// // //               <Info size={16} />
// // //               <span className="text-sm cursor-pointer">How it works!</span>
// // //             </div>
// // //           </div>

// // //           <div className="grid grid-cols-3 gap-6">
// // //             {/* LEFT FORM */}
// // //             <div className="col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
// // //               <input
// // //                 placeholder="Product Name *"
// // //                 className="w-full border rounded px-4 py-2"
// // //               />

// // //               <select className="w-full border rounded px-4 py-2">
// // //                 <option>Select Item Category *</option>
// // //                 <option>Main Course</option>
// // //                 <option>Snacks</option>
// // //               </select>

// // //               <select className="w-full border rounded px-4 py-2">
// // //                 <option>Select Item Subcategory</option>
// // //               </select>

// // //               <input
// // //                 placeholder="Enter Price *"
// // //                 className="w-full border rounded px-4 py-2"
// // //               />

// // //               <input
// // //                 placeholder="Compare-At Price (optional)"
// // //                 className="w-full border rounded px-4 py-2"
// // //               />

// // //               {/* Veg / Non-Veg */}
// // //               <div className="flex gap-6">
// // //                 <label className="flex items-center gap-2">
// // //                   <input type="radio" name="type" /> Veg
// // //                 </label>
// // //                 <label className="flex items-center gap-2">
// // //                   <input type="radio" name="type" /> Non-veg
// // //                 </label>
// // //               </div>

// // //               <textarea
// // //                 placeholder="Description"
// // //                 className="w-full border rounded px-4 py-2 h-28"
// // //               />

// // //               <button className="bg-gray-700 text-white px-6 py-2 rounded">
// // //                 Save
// // //               </button>
// // //             </div>

// // //             {/* RIGHT SIDE */}
// // //             <div className="space-y-6">
// // //               {/* Variant */}
// // //               <div className="bg-white rounded-lg shadow p-4">
// // //                 <h3 className="font-semibold mb-2">Add Variant</h3>
// // //                 <button className="text-blue-600 text-sm">+ Add More</button>
// // //               </div>

// // //               {/* 360 Image Upload */}
// // //               <div className="bg-white rounded-lg shadow p-4">
// // //                 <h3 className="font-semibold mb-3">
// // //                   Upload Item Images (360°)
// // //                 </h3>

// // //                 <div className="grid grid-cols-2 gap-4">
// // //                   {[1, 2, 3, 4].map((img) => (
// // //                     <label
// // //                       key={img}
// // //                       className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-blue-500"
// // //                     >
// // //                       <span className="text-2xl">📷</span>
// // //                       <span className="text-sm">Image {img}</span>
// // //                       <input type="file" hidden />
// // //                     </label>
// // //                   ))}
// // //                 </div>
// // //               </div>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // "use client";

// // import React, { useState } from "react";
// // import { Info } from "lucide-react";
// // import { QRCodeCanvas } from "qrcode.react";

// // export default function MenuPage() {
// //   const [showAddPage, setShowAddPage] = useState(false);
// //   const [menuUrl, setMenuUrl] = useState("");

// //   const handleSaveMenu = () => {
// //     // 🔗 future ma aa URL dynamic banavi sakay (restaurant id / menu id)
// //     const generatedUrl = "https://your-restaurant.com/menu/123";
// //     setMenuUrl(generatedUrl);
// //     setShowAddPage(false);
// //   };

// //   return (
// //     <div className="min-h-screen bg-gray-100 p-8">
// //       {!showAddPage ? (
// //         /* =======================
// //            MENU LANDING PAGE
// //         ======================= */
// //         <div className="flex items-center justify-center min-h-[80vh]">
// //           <div className="bg-white w-full max-w-4xl rounded-xl shadow p-14 text-center space-y-6">
// //             <h1 className="text-2xl font-semibold">
// //               Create your digital menu now!!!
// //             </h1>

// //             <button
// //               onClick={() => setShowAddPage(true)}
// //               className="text-blue-600 font-medium hover:underline"
// //             >
// //               + Add Menu Item
// //             </button>

// //             {/* ✅ QR CODE SHOW */}
// //             {menuUrl && (
// //               <div className="mt-8">
// //                 <h2 className="font-semibold mb-3">Scan Menu QR</h2>

// //                 <div className="flex justify-center">
// //                   <QRCodeCanvas
// //                     value={menuUrl}
// //                     size={180}
// //                     bgColor="#ffffff"
// //                     fgColor="#000000"
// //                   />
// //                 </div>

// //                 <p className="text-sm text-gray-500 mt-3 break-all">
// //                   {menuUrl}
// //                 </p>
// //               </div>
// //             )}
// //           </div>
// //         </div>
// //       ) : (
// //         /* =======================
// //            ADD MENU ITEM PAGE
// //         ======================= */
// //         <div>
// //           {/* Header */}
// //           <div className="flex items-center mb-6">
// //             <button
// //               onClick={() => setShowAddPage(false)}
// //               className="text-xl mr-3"
// //             >
// //               ←
// //             </button>

// //             <h2 className="text-xl font-semibold">Add Menu Item</h2>

// //             <div className="ml-auto flex items-center gap-1 text-blue-600">
// //               <Info size={16} />
// //               <span className="text-sm cursor-pointer">How it works!</span>
// //             </div>
// //           </div>

// //           <div className="grid grid-cols-3 gap-6">
// //             {/* LEFT FORM */}
// //             <div className="col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
// //               <input
// //                 placeholder="Product Name *"
// //                 className="w-full border rounded px-4 py-2"
// //               />

// //               <select className="w-full border rounded px-4 py-2">
// //                 <option>Select Item Category *</option>
// //                 <option>Main Course</option>
// //                 <option>Snacks</option>
// //               </select>

// //               <input
// //                 placeholder="Enter Price *"
// //                 className="w-full border rounded px-4 py-2"
// //               />

// //               <textarea
// //                 placeholder="Description"
// //                 className="w-full border rounded px-4 py-2 h-28"
// //               />

// //               {/* ✅ SAVE & GENERATE QR */}
// //               <button
// //                 onClick={handleSaveMenu}
// //                 className="bg-gray-700 text-white px-6 py-2 rounded"
// //               >
// //                 Save & Generate QR
// //               </button>
// //             </div>

// //             {/* RIGHT SIDE */}
// //             <div className="bg-white rounded-lg shadow p-4">
// //               <h3 className="font-semibold mb-3">Upload Item Images</h3>

// //               <div className="grid grid-cols-2 gap-4">
// //                 {[1, 2, 3, 4].map((img) => (
// //                   <label
// //                     key={img}
// //                     className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-blue-500"
// //                   >
// //                     <span className="text-2xl">📷</span>
// //                     <span className="text-sm">Image {img}</span>
// //                     <input type="file" hidden />
// //                   </label>
// //                 ))}
// //               </div>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// "use client";

// import React, { useState } from "react";
// import { Info } from "lucide-react";
// import { QRCodeCanvas } from "qrcode.react";

// export default function MenuPage() {
//   const [showAddPage, setShowAddPage] = useState(false);
//   const [menuUrl, setMenuUrl] = useState("");
//   const [menuItems, setMenuItems] = useState([]);

//   const [formData, setFormData] = useState({
//     name: "",
//     category: "",
//     price: "",
//     description: "",
//   });

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSaveMenu = () => {
//     if (!formData.name || !formData.price) return;

//     setMenuItems([...menuItems, formData]);

//     setMenuUrl("https://your-restaurant.com/menu/123");

//     setFormData({
//       name: "",
//       category: "",
//       price: "",
//       description: "",
//     });

//     setShowAddPage(false);
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-8">
//       {!showAddPage ? (
//         /* =======================
//            MENU LANDING PAGE
//         ======================= */
//         <div className="max-w-5xl mx-auto space-y-8">
//           <div className="bg-white rounded-xl shadow p-10 text-center">
//             <h1 className="text-2xl font-semibold mb-4">
//               Create your digital menu now!!!
//             </h1>

//             <button
//               onClick={() => setShowAddPage(true)}
//               className="text-blue-600 font-medium hover:underline"
//             >
//               + Add Menu Item
//             </button>

//             {/* QR CODE */}
//             {menuUrl && (
//               <div className="mt-6">
//                 <h2 className="font-semibold mb-2">Scan Menu QR</h2>
//                 <div className="flex justify-center">
//                   <QRCodeCanvas value={menuUrl} size={160} />
//                 </div>
//                 <p className="text-sm text-gray-500 mt-2 break-all">
//                   {menuUrl}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* SAVED MENU LIST */}
//           {menuItems.length > 0 && (
//             <div className="bg-white rounded-xl shadow p-6">
//               <h2 className="text-lg font-semibold mb-4">Saved Menu Items</h2>

//               <div className="space-y-3">
//                 {menuItems.map((item, index) => (
//                   <div
//                     key={index}
//                     className="flex justify-between items-center border rounded p-4"
//                   >
//                     <div>
//                       <h3 className="font-medium">{item.name}</h3>
//                       <p className="text-sm text-gray-500">{item.category}</p>
//                       <p className="text-sm">{item.description}</p>
//                     </div>

//                     <span className="font-semibold">₹ {item.price}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}
//         </div>
//       ) : (
//         /* =======================
//            ADD MENU ITEM PAGE
//         ======================= */
//         <div className="max-w-5xl mx-auto">
//           {/* Header */}
//           <div className="flex items-center mb-6">
//             <button
//               onClick={() => setShowAddPage(false)}
//               className="text-xl mr-3"
//             >
//               ←
//             </button>

//             <h2 className="text-xl font-semibold">Add Menu Item</h2>

//             <div className="ml-auto flex items-center gap-1 text-blue-600">
//               <Info size={16} />
//               <span className="text-sm cursor-pointer">How it works!</span>
//             </div>
//           </div>

//           <div className="grid grid-cols-3 gap-6">
//             {/* LEFT FORM */}
//             <div className="col-span-2 bg-white rounded-lg shadow p-6 space-y-4">
//               <input
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Product Name *"
//                 className="w-full border rounded px-4 py-2"
//               />

//               <select
//                 name="category"
//                 value={formData.category}
//                 onChange={handleChange}
//                 className="w-full border rounded px-4 py-2"
//               >
//                 <option value="">Select Category</option>
//                 <option>Main Course</option>
//                 <option>Snacks</option>
//               </select>

//               <input
//                 name="price"
//                 value={formData.price}
//                 onChange={handleChange}
//                 placeholder="Enter Price *"
//                 className="w-full border rounded px-4 py-2"
//               />

//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 placeholder="Description"
//                 className="w-full border rounded px-4 py-2 h-28"
//               />

//               <button
//                 onClick={handleSaveMenu}
//                 className="bg-gray-700 text-white px-6 py-2 rounded"
//               >
//                 Save Menu Item
//               </button>
//             </div>

//             {/* RIGHT SIDE */}
//             <div className="bg-white rounded-lg shadow p-4">
//               <h3 className="font-semibold mb-3">Upload Item Images</h3>

//               <div className="grid grid-cols-2 gap-4">
//                 {[1, 2, 3, 4].map((img) => (
//                   <label
//                     key={img}
//                     className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-blue-500"
//                   >
//                     <span className="text-2xl">📷</span>
//                     <span className="text-sm">Image {img}</span>
//                     <input type="file" hidden />
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

"use client";

import React, { useState } from "react";
import { Info } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

export default function MenuPage() {
  const [showAddPage, setShowAddPage] = useState(false);
  const [menuUrl, setMenuUrl] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([
    "Main Course",
    "Snacks",
    "Desserts",
  ]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    discountPrice: "",
    description: "",
    ingredients: "",
    calories: "",
    foodType: "Veg",
    spiceLevel: 1,
    availability: true,
    arLink: "",
    images: [null, null, null, null],
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleImageChange = (index, file) => {
    const newImages = [...formData.images];
    newImages[index] = file;
    setFormData({ ...formData, images: newImages });
  };

  const handleSaveMenu = () => {
    if (!formData.name || !formData.price || !formData.category) return;

    setMenuItems([...menuItems, formData]);

    setMenuUrl("https://your-restaurant.com/menu/123");

    setFormData({
      name: "",
      category: "",
      price: "",
      discountPrice: "",
      description: "",
      ingredients: "",
      calories: "",
      foodType: "Veg",
      spiceLevel: 1,
      availability: true,
      arLink: "",
      images: [null, null, null, null],
    });

    setShowAddPage(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 p-8">
      {!showAddPage ? (
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Landing Page */}
          <div className="bg-white rounded-2xl shadow-xl p-10 text-center animate-fadeIn">
            <h1 className="text-3xl font-bold mb-6 text-orange-600">
              Create Your Digital Menu!
            </h1>

            <button
              onClick={() => setShowAddPage(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg transition-all"
            >
              + Add Menu Item
            </button>

            {menuUrl && (
              <div className="mt-8">
                <h2 className="font-semibold mb-2 text-gray-700">
                  Scan Menu QR
                </h2>
                <div className="flex justify-center mb-2">
                  <QRCodeCanvas value={menuUrl} size={180} />
                </div>
                <p className="text-sm text-gray-500 break-all">{menuUrl}</p>
              </div>
            )}
          </div>

          {menuItems.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl p-6 space-y-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Saved Menu Items
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {menuItems.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col p-4 border rounded-lg hover:shadow-lg transition-all"
                  >
                    <div className="flex justify-between mb-2">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <span className="font-semibold text-green-600">
                        ₹ {item.price}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{item.category}</p>
                    {item.discountPrice && (
                      <p className="text-sm text-red-500">
                        Discount: ₹ {item.discountPrice}
                      </p>
                    )}
                    <p className="text-sm mt-2">{item.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Ingredients: {item.ingredients}
                    </p>
                    {item.calories && (
                      <p className="text-sm text-gray-600 mt-1">
                        Calories: {item.calories}
                      </p>
                    )}
                    <p className="text-sm mt-1">
                      Food Type: {item.foodType} | Spice Level:{" "}
                      {item.spiceLevel} 🌶️
                    </p>
                    <p className="text-sm mt-1">
                      Availability:{" "}
                      {item.availability ? "✅ Available" : "❌ Out of stock"}
                    </p>
                    {item.images && (
                      <div className="flex gap-2 mt-2">
                        {item.images.map((img, i) =>
                          img ? (
                            <span
                              key={i}
                              className="w-16 h-16 bg-gray-100 flex items-center justify-center rounded border"
                            >
                              📷
                            </span>
                          ) : null
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="max-w-6xl mx-auto animate-fadeIn">
          {/* Add Menu Page */}
          <div className="flex items-center mb-6">
            <button
              onClick={() => setShowAddPage(false)}
              className="text-xl mr-3 hover:text-orange-500 transition"
            >
              ←
            </button>
            <h2 className="text-2xl font-semibold text-orange-600">
              Add Menu Item
            </h2>
            <div className="ml-auto flex items-center gap-1 text-blue-600">
              <Info size={18} />
              <span className="text-sm cursor-pointer">How it works!</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2 bg-white rounded-2xl shadow-xl p-6 space-y-4">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Item Name *"
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              />

              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              >
                <option value="">Select Category *</option>
                {categories.map((cat, idx) => (
                  <option key={idx} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              <input
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price *"
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              />

              <input
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="Discount Price"
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              />

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Description"
                className="w-full border rounded px-4 py-2 h-24 focus:ring-2 focus:ring-orange-400"
              />

              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ingredients"
                className="w-full border rounded px-4 py-2 h-20 focus:ring-2 focus:ring-orange-400"
              />

              <input
                name="calories"
                value={formData.calories}
                onChange={handleChange}
                placeholder="Calories (optional)"
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              />

              <select
                name="foodType"
                value={formData.foodType}
                onChange={handleChange}
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              >
                <option>Veg</option>
                <option>Non-Veg</option>
                <option>Jain</option>
              </select>

              <div className="flex items-center gap-4 mt-2">
                <label>Spice Level:</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  name="spiceLevel"
                  value={formData.spiceLevel}
                  onChange={handleChange}
                  className="w-full"
                />
                <span>{formData.spiceLevel} 🌶️</span>
              </div>

              <input
                name="arLink"
                value={formData.arLink}
                onChange={handleChange}
                placeholder="AR Model Link / Upload"
                className="w-full border rounded px-4 py-2 focus:ring-2 focus:ring-orange-400"
              />

              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  name="availability"
                  checked={formData.availability}
                  onChange={handleChange}
                />
                Available
              </label>

              <button
                onClick={handleSaveMenu}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition-all mt-4"
              >
                Save Menu Item
              </button>
            </div>

            {/* 360° Image Upload */}
            <div className="bg-white rounded-2xl shadow-xl p-4 space-y-4">
              <h3 className="font-semibold text-orange-600 mb-2">
                Upload 360° Images
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {formData.images.map((img, idx) => (
                  <label
                    key={idx}
                    className="border-2 border-dashed rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer text-gray-400 hover:border-orange-500"
                  >
                    <span className="text-2xl">📷</span>
                    <span className="text-sm">Image {idx + 1}</span>
                    <input
                      type="file"
                      hidden
                      onChange={(e) =>
                        handleImageChange(idx, e.target.files[0])
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
