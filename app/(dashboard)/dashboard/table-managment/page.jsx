// "use client";

// import { useState, useRef } from "react";
// import QRCode from "react-qr-code";
// import { toast, Toaster } from "react-hot-toast";
// import { Printer, Download, Copy, Trash2, ExternalLink } from "lucide-react";

// export default function TablesPage() {
//   const [tables, setTables] = useState([]);
//   const [tableNo, setTableNo] = useState("");
//   const qrRefs = useRef({});

//   // Your menu image URL
//   const MENU_IMAGE_URL =
//     "https://marketplace.canva.com/EAFUtO4a2bw/1/0/1035w/canva-dark-aesthetic-coffee-shop-menu-sxbLStT6LSc.jpg";

//   const addTable = () => {
//     if (!tableNo.trim()) {
//       toast.error("Please enter a table number");
//       return;
//     }

//     if (tables.some((table) => table.tableNo === tableNo)) {
//       toast.error(`Table ${tableNo} already exists`);
//       return;
//     }

//     // Create URL with table number as parameter
//     const menuUrl = `${MENU_IMAGE_URL}?table=${tableNo}`;

//     const newTable = {
//       tableNo,
//       qrUrl: menuUrl, // Direct menu image URL with table number
//       id: Date.now().toString(),
//       createdAt: new Date().toLocaleDateString("en-GB"),
//     };

//     setTables((prev) => [...prev, newTable]);
//     setTableNo("");
//     toast.success(`Table ${tableNo} QR code created successfully`);
//   };

//   const deleteTable = (id) => {
//     setTables((prev) => prev.filter((table) => table.id !== id));
//     toast.success("Table QR code deleted");
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//     toast.success("Menu URL copied to clipboard");
//   };

//   // Open menu image directly
//   const openMenuImage = (url) => {
//     window.open(url, "_blank", "noopener,noreferrer");
//   };

//   // Fixed download function for QR code
//   const downloadQRCode = (tableNo, tableId) => {
//     try {
//       const svgElement = document.getElementById(`qr-${tableId}`);
//       if (!svgElement) {
//         toast.error("QR Code not found");
//         return;
//       }

//       // Convert SVG to data URL
//       const svgData = new XMLSerializer().serializeToString(svgElement);
//       const svgBlob = new Blob([svgData], {
//         type: "image/svg+xml;charset=utf-8",
//       });
//       const svgUrl = URL.createObjectURL(svgBlob);

//       // Create canvas for PNG conversion
//       const canvas = document.createElement("canvas");
//       const context = canvas.getContext("2d");
//       canvas.width = 300;
//       canvas.height = 300;

//       const img = new Image();
//       img.onload = function () {
//         // Draw white background
//         context.fillStyle = "#FFFFFF";
//         context.fillRect(0, 0, canvas.width, canvas.height);

//         // Draw QR code
//         context.drawImage(img, 0, 0, canvas.width, canvas.height);

//         // Convert to PNG and download
//         const pngUrl = canvas.toDataURL("image/png");
//         const link = document.createElement("a");
//         link.download = `table-${tableNo}-menu-qr.png`;
//         link.href = pngUrl;
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);

//         // Cleanup
//         URL.revokeObjectURL(svgUrl);

//         toast.success(`QR Code for Table ${tableNo} downloaded`);
//       };

//       img.onerror = function () {
//         toast.error("Failed to download QR Code");
//         URL.revokeObjectURL(svgUrl);
//       };

//       img.src = svgUrl;
//     } catch (error) {
//       console.error("Download error:", error);
//       toast.error("Download failed. Please try again.");
//     }
//   };

//   const printQRCode = (table) => {
//     const printWindow = window.open("", "_blank");

//     // Get the SVG content
//     const svgElement = document.getElementById(`qr-${table.id}`);
//     const svgContent = svgElement ? svgElement.outerHTML : "";

//     printWindow.document.write(`
//       <html>
//         <head>
//           <title>Table ${table.tableNo} QR Code</title>
//           <style>
//             @media print {
//               @page { margin: 0; }
//               body { margin: 0.5cm; }
//             }
//             body {
//               font-family: Arial, sans-serif;
//               display: flex;
//               flex-direction: column;
//               align-items: center;
//               justify-content: center;
//               min-height: 100vh;
//               margin: 0;
//               padding: 20px;
//               text-align: center;
//             }
//             .header {
//               text-align: center;
//               margin-bottom: 20px;
//             }
//             .header h2 {
//               color: #1e40af;
//               margin: 0 0 10px 0;
//             }
//             .qr-container {
//               padding: 25px;
//               border: 2px solid #ddd;
//               border-radius: 12px;
//               margin: 25px 0;
//               background: white;
//               display: inline-block;
//             }
//             .footer {
//               text-align: center;
//               color: #666;
//               font-size: 12px;
//               margin-top: 20px;
//             }
//             .url {
//               word-break: break-all;
//               font-size: 10px;
//               color: #555;
//               margin-top: 15px;
//               max-width: 400px;
//               background: #f5f5f5;
//               padding: 10px;
//               border-radius: 6px;
//             }
//             .instructions {
//               font-size: 12px;
//               color: #777;
//               margin-top: 10px;
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h2>Table ${table.tableNo}</h2>
//             <p><strong>Coffee Shop Menu QR Code</strong></p>
//             <p>Scan to view menu image</p>
//             <p class="instructions">Created: ${table.createdAt}</p>
//           </div>
//           <div class="qr-container">
//             <svg viewBox="0 0 256 256" width="300" height="300">
//               ${svgContent}
//             </svg>
//           </div>
//           <div class="url">${table.qrUrl}</div>
//           <div class="instructions">Scan this QR code to view the menu</div>
//           <div class="footer">
//             <p>© ${new Date().getFullYear()} Coffee Shop</p>
//           </div>
//           <script>
//             window.onload = function() {
//               window.print();
//               setTimeout(function() {
//                 window.close();
//               }, 500);
//             }
//           </script>
//         </body>
//       </html>
//     `);
//     printWindow.document.close();
//   };

//   const addMultipleTables = () => {
//     const start = parseInt(tableNo) || 1;
//     const count = 10;

//     const newTables = [];

//     for (let i = start; i < start + count; i++) {
//       if (!tables.some((table) => table.tableNo === i.toString())) {
//         const menuUrl = `${MENU_IMAGE_URL}?table=${i}`;
//         newTables.push({
//           tableNo: i.toString(),
//           qrUrl: menuUrl,
//           id: Date.now().toString() + i,
//           createdAt: new Date().toLocaleDateString("en-GB"),
//         });
//       }
//     }

//     if (newTables.length > 0) {
//       setTables((prev) => [...prev, ...newTables]);
//       toast.success(`Added ${newTables.length} table QR codes`);
//       setTableNo("");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
//       <Toaster position="top-right" />

//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8 text-center">
//           <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
//             Table QR System
//           </h1>
//           <p className="text-gray-600">
//             Generate QR codes for each table - Customers scan to view menu image
//           </p>
//           <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg inline-block">
//             <p>Menu URL: {MENU_IMAGE_URL}?table=TABLE_NUMBER</p>
//           </div>
//         </div>

//         {/* Add Table Section */}
//         <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
//           <div className="flex flex-col md:flex-row gap-4 items-end">
//             <div className="flex-1">
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Table Number
//               </label>
//               <div className="flex gap-3">
//                 <input
//                   type="number"
//                   placeholder="e.g., 1, 2, 3..."
//                   value={tableNo}
//                   onChange={(e) => setTableNo(e.target.value)}
//                   className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                   min="1"
//                   onKeyPress={(e) => e.key === "Enter" && addTable()}
//                 />
//                 <button
//                   onClick={addMultipleTables}
//                   className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
//                 >
//                   <span>Add Multiple (10)</span>
//                 </button>
//               </div>
//             </div>

//             <button
//               onClick={addTable}
//               className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg flex items-center gap-2"
//             >
//               <span>+ Generate QR Code</span>
//             </button>
//           </div>

//           <div className="mt-4 text-sm text-gray-500">
//             <p>
//               • Each QR code links to menu image with table number parameter
//             </p>
//             <p>• Customers scan → Directly see menu image in their browser</p>
//           </div>
//         </div>

//         {/* Tables Grid */}
//         {tables.length > 0 ? (
//           <>
//             <div className="mb-6 flex justify-between items-center">
//               <h2 className="text-2xl font-bold text-gray-800">
//                 Generated QR Codes ({tables.length})
//               </h2>
//               <div className="text-sm text-gray-600">
//                 Scan any QR code to test menu opening
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {tables.map((table) => (
//                 <div
//                   key={table.id}
//                   className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
//                 >
//                   {/* Table Header */}
//                   <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
//                     <div className="flex justify-between items-center">
//                       <div>
//                         <h3 className="text-xl font-bold text-white">
//                           Table {table.tableNo}
//                         </h3>
//                         <p className="text-blue-100 text-sm">
//                           Created: {table.createdAt}
//                         </p>
//                       </div>
//                       <button
//                         onClick={() => deleteTable(table.id)}
//                         className="text-white hover:text-red-200 p-2 rounded-full hover:bg-blue-700 transition-colors"
//                         title="Delete QR code"
//                       >
//                         <Trash2 size={20} />
//                       </button>
//                     </div>
//                   </div>

//                   {/* QR Code */}
//                   <div className="p-6">
//                     <div className="flex justify-center mb-4">
//                       <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
//                         <QRCode
//                           id={`qr-${table.id}`}
//                           value={table.qrUrl}
//                           size={180}
//                           className="mx-auto"
//                           fgColor="#1e40af"
//                         />
//                       </div>
//                     </div>

//                     {/* URL Display */}
//                     <div className="mt-4">
//                       <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
//                         <p className="text-xs text-gray-500 mb-1 font-medium">
//                           Menu Image URL:
//                         </p>
//                         <p className="text-sm text-gray-700 break-all font-mono">
//                           {table.qrUrl}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Action Buttons */}
//                   <div className="p-4 bg-gray-50 border-t border-gray-200">
//                     <div className="grid grid-cols-2 gap-3">
//                       <button
//                         onClick={() => copyToClipboard(table.qrUrl)}
//                         className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
//                         title="Copy Menu URL"
//                       >
//                         <Copy size={18} className="text-gray-600 mb-1" />
//                         <span className="text-xs text-gray-600">Copy URL</span>
//                       </button>

//                       <button
//                         onClick={() => downloadQRCode(table.tableNo, table.id)}
//                         className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
//                         title="Download QR Code"
//                       >
//                         <Download size={18} className="text-gray-600 mb-1" />
//                         <span className="text-xs text-gray-600">
//                           Download QR
//                         </span>
//                       </button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-3 mt-3">
//                       <button
//                         onClick={() => printQRCode(table)}
//                         className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
//                         title="Print QR Code"
//                       >
//                         <Printer size={18} className="text-gray-600 mb-1" />
//                         <span className="text-xs text-gray-600">Print</span>
//                       </button>

//                       <button
//                         onClick={() => openMenuImage(table.qrUrl)}
//                         className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
//                         title="Test Menu Opening"
//                       >
//                         <ExternalLink
//                           size={18}
//                           className="text-gray-600 mb-1"
//                         />
//                         <span className="text-xs text-gray-600">Test Menu</span>
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </>
//         ) : (
//           <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
//             <div className="max-w-md mx-auto">
//               <div className="text-6xl mb-4">📱</div>
//               <h3 className="text-2xl font-bold text-gray-800 mb-3">
//                 No QR Codes Generated Yet
//               </h3>
//               <p className="text-gray-600 mb-6">
//                 Add a table number to generate QR codes. Customers will scan
//                 these codes to view the menu image.
//               </p>
//               <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-6">
//                 <h4 className="font-semibold text-blue-800 mb-2">
//                   How it works:
//                 </h4>
//                 <ul className="text-sm text-blue-700 space-y-1">
//                   <li>• Enter table number and click "Generate QR Code"</li>
//                   <li>• QR code with menu image link will be created</li>
//                   <li>• Download/print QR code for the table</li>
//                   <li>• Customers scan QR to see menu image instantly</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Testing Instructions */}
//         {tables.length > 0 && (
//           <div className="mt-8 bg-green-50 border border-green-200 rounded-2xl p-6">
//             <h3 className="font-bold text-green-800 mb-3">
//               ✅ How to Test QR Codes:
//             </h3>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <h4 className="font-semibold text-green-700 mb-2">
//                   Method 1: Smartphone Camera
//                 </h4>
//                 <ol className="text-sm text-green-700 space-y-1 pl-4">
//                   <li>1. Open smartphone camera app</li>
//                   <li>2. Point camera at QR code on screen</li>
//                   <li>3. Tap notification/link that appears</li>
//                   <li>4. Menu image will open in browser</li>
//                 </ol>
//               </div>
//               <div>
//                 <h4 className="font-semibold text-green-700 mb-2">
//                   Method 2: QR Scanner App
//                 </h4>
//                 <ol className="text-sm text-green-700 space-y-1 pl-4">
//                   <li>1. Download any QR scanner app</li>
//                   <li>2. Open app and scan the QR code</li>
//                   <li>3. Tap "Open" or "Go to link"</li>
//                   <li>4. Menu image will load</li>
//                 </ol>
//               </div>
//             </div>
//             <div className="mt-4 pt-4 border-t border-green-300">
//               <p className="text-sm text-green-600">
//                 <strong>Note:</strong> All QR codes link to: {MENU_IMAGE_URL}
//                 ?table=TABLE_NUMBER
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Footer */}
//         <div className="mt-8 text-center text-gray-500 text-sm">
//           <p>Menu Image URL: {MENU_IMAGE_URL}</p>
//           <p className="mt-1">
//             Print QR codes and place on tables. Customers scan to view menu.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
// //

"use client";

import { useState, useRef, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast, Toaster } from "react-hot-toast";
import {
  Printer,
  Download,
  Copy,
  Trash2,
  ExternalLink,
  Search,
  SortAsc,
  Trash,
} from "lucide-react";

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("tableNo");
  const qrRefs = useRef({});

  // Your menu image URL
  const MENU_IMAGE_URL =
    "https://marketplace.canva.com/EAFUtO4a2bw/1/0/1035w/canva-dark-aesthetic-coffee-shop-menu-sxbLStT6LSc.jpg";

  // Storage key
  const STORAGE_KEY = "table-qr-codes";

  // Load from localStorage on mount
  useEffect(() => {
    const savedTables = localStorage.getItem(STORAGE_KEY);
    if (savedTables) {
      try {
        setTables(JSON.parse(savedTables));
        toast.success("Loaded saved QR codes");
      } catch (error) {
        console.error("Error loading saved tables:", error);
      }
    }
  }, []);

  // Save to localStorage when tables change
  useEffect(() => {
    if (tables.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
    }
  }, [tables]);

  // Sort tables
  const sortedTables = [...tables].sort((a, b) => {
    if (sortBy === "tableNo") {
      return parseInt(a.tableNo) - parseInt(b.tableNo);
    }
    if (sortBy === "createdAt") {
      return new Date(b.createdAt) - new Date(a.createdAt);
    }
    return 0;
  });

  // Filter tables by search
  const filteredTables = sortedTables.filter((table) =>
    table.tableNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addTable = () => {
    if (!tableNo.trim()) {
      toast.error("Please enter a table number");
      return;
    }

    if (tables.some((table) => table.tableNo === tableNo)) {
      toast.error(`Table ${tableNo} already exists`);
      return;
    }

    // Create URL with table number as parameter
    const menuUrl = `${MENU_IMAGE_URL}?table=${tableNo}`;

    const newTable = {
      tableNo,
      qrUrl: menuUrl,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString("en-GB"),
      createdTime: new Date().toLocaleTimeString("en-GB", { hour12: false }),
    };

    setTables((prev) => [...prev, newTable]);
    setTableNo("");
    toast.success(`Table ${tableNo} QR code created successfully`);
  };

  const deleteTable = (id, tableNo) => {
    if (
      window.confirm(`Are you sure you want to delete Table ${tableNo} QR?`)
    ) {
      setTables((prev) => prev.filter((table) => table.id !== id));
      toast.success(`Table ${tableNo} QR code deleted`);
    }
  };

  const clearAllTables = () => {
    if (tables.length === 0) {
      toast.error("No QR codes to delete");
      return;
    }

    if (
      window.confirm(
        `Are you sure you want to delete ALL ${tables.length} QR codes? This cannot be undone.`
      )
    ) {
      setTables([]);
      localStorage.removeItem(STORAGE_KEY);
      toast.success("All QR codes cleared");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Menu URL copied to clipboard");
  };

  // Open menu image directly
  const openMenuImage = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // Fixed download function for QR code
  const downloadQRCode = (tableNo, tableId) => {
    try {
      const svgElement = document.getElementById(`qr-${tableId}`);
      if (!svgElement) {
        toast.error("QR Code not found");
        return;
      }

      // Convert SVG to data URL
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create canvas for PNG conversion
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = 300;
      canvas.height = 300;

      const img = new Image();
      img.onload = function () {
        // Draw white background
        context.fillStyle = "#FFFFFF";
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Draw QR code
        context.drawImage(img, 0, 0, canvas.width, canvas.height);

        // Convert to PNG and download
        const pngUrl = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.download = `table-${tableNo}-menu-qr.png`;
        link.href = pngUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Cleanup
        URL.revokeObjectURL(svgUrl);

        toast.success(`QR Code for Table ${tableNo} downloaded`);
      };

      img.onerror = function () {
        toast.error("Failed to download QR Code");
        URL.revokeObjectURL(svgUrl);
      };

      img.src = svgUrl;
    } catch (error) {
      console.error("Download error:", error);
      toast.error("Download failed. Please try again.");
    }
  };

  const printQRCode = (table) => {
    const printWindow = window.open("", "_blank");

    // Get the SVG content
    const svgElement = document.getElementById(`qr-${table.id}`);
    const svgContent = svgElement ? svgElement.outerHTML : "";

    printWindow.document.write(`
      <html>
        <head>
          <title>Table ${table.tableNo} QR Code</title>
          <style>
            @media print {
              @page { margin: 0; }
              body { margin: 0.5cm; }
            }
            body { 
              font-family: Arial, sans-serif; 
              display: flex; 
              flex-direction: column; 
              align-items: center; 
              justify-content: center; 
              min-height: 100vh; 
              margin: 0; 
              padding: 20px;
              text-align: center;
            }
            .header { 
              text-align: center; 
              margin-bottom: 20px; 
            }
            .header h2 { 
              color: #1e40af;
              margin: 0 0 10px 0;
            }
            .qr-container { 
              padding: 25px; 
              border: 2px solid #ddd; 
              border-radius: 12px; 
              margin: 25px 0;
              background: white;
              display: inline-block;
            }
            .footer { 
              text-align: center; 
              color: #666; 
              font-size: 12px; 
              margin-top: 20px;
            }
            .url { 
              word-break: break-all; 
              font-size: 10px; 
              color: #555; 
              margin-top: 15px;
              max-width: 400px;
              background: #f5f5f5;
              padding: 10px;
              border-radius: 6px;
            }
            .instructions {
              font-size: 12px;
              color: #777;
              margin-top: 10px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>Table ${table.tableNo}</h2>
            <p><strong>Coffee Shop Menu QR Code</strong></p>
            <p>Scan to view menu image</p>
            <p class="instructions">Created: ${table.createdAt} ${
      table.createdTime
    }</p>
          </div>
          <div class="qr-container">
            <svg viewBox="0 0 256 256" width="300" height="300">
              ${svgContent}
            </svg>
          </div>
          <div class="url">${table.qrUrl}</div>
          <div class="instructions">Scan this QR code to view the menu</div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Coffee Shop</p>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const addMultipleTables = () => {
    const start = parseInt(tableNo) || 1;
    const count = 10;

    // Validate input
    if (isNaN(start) || start < 1) {
      toast.error("Please enter a valid starting number");
      return;
    }

    const newTables = [];
    let addedCount = 0;

    for (let i = start; i < start + count; i++) {
      if (!tables.some((table) => table.tableNo === i.toString())) {
        const menuUrl = `${MENU_IMAGE_URL}?table=${i}`;
        newTables.push({
          tableNo: i.toString(),
          qrUrl: menuUrl,
          id: `${Date.now()}-${i}`,
          createdAt: new Date().toLocaleDateString("en-GB"),
          createdTime: new Date().toLocaleTimeString("en-GB", {
            hour12: false,
          }),
        });
        addedCount++;
      }
    }

    if (addedCount > 0) {
      setTables((prev) => [...prev, ...newTables]);
      toast.success(`Added ${addedCount} new table QR codes`);
      setTableNo((start + count).toString()); // Set next starting number
    } else {
      toast.error("All tables in this range already exist");
    }
  };

  // Fixed downloadAllQR function with better error handling
  const downloadAllQR = async () => {
    if (tables.length === 0) {
      toast.error("No QR codes to download");
      return;
    }

    // Add loading toast
    const loadingToast = toast.loading(
      "Preparing download... This may take a moment"
    );

    try {
      // Check if JSZip is available
      let JSZip;
      try {
        JSZip = (await import("jszip")).default;
      } catch (importError) {
        toast.dismiss(loadingToast);
        toast.error(
          <div>
            <p>JSZip library not installed.</p>
            <p className="text-xs mt-1">Run: npm install jszip</p>
          </div>
        );
        return;
      }

      const zip = new JSZip();

      // Create a folder for QR codes
      const folder = zip.folder("table-qr-codes");

      // Download each QR code
      for (const table of tables) {
        const svgElement = document.getElementById(`qr-${table.id}`);
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          folder.file(`table-${table.tableNo}-menu-qr.svg`, svgData);
        }
      }

      // Generate zip file
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const link = document.createElement("a");
      link.href = url;
      link.download = "all-table-qr-codes.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success(`Downloaded ${tables.length} QR codes as ZIP`);
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Failed to download all QR codes");
      console.error("Download All QR Error:", error);
    }
  };

  // Alternative download method without JSZip
  const downloadAllQRSimple = async () => {
    if (tables.length === 0) {
      toast.error("No QR codes to download");
      return;
    }

    toast.loading(`Starting download of ${tables.length} QR codes...`);

    // Download each QR code individually
    for (let i = 0; i < tables.length; i++) {
      const table = tables[i];
      await new Promise((resolve) => setTimeout(resolve, 300)); // Small delay
      downloadQRCode(table.tableNo, table.id);
    }

    setTimeout(() => {
      toast.success(`Started download of ${tables.length} QR codes`);
    }, 500);
  };

  const exportTableData = () => {
    if (tables.length === 0) {
      toast.error("No data to export");
      return;
    }

    const data = tables.map((table) => ({
      "Table Number": table.tableNo,
      "Menu URL": table.qrUrl,
      "Created Date": table.createdAt,
      "Created Time": table.createdTime,
      "QR Code File": `table-${table.tableNo}-menu-qr.png`,
    }));

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [Object.keys(data[0]), ...data.map((row) => Object.values(row))]
        .map((row) => row.join(","))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "table-qr-data.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Table data exported as CSV");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            Table QR System
          </h1>
          <p className="text-gray-600">
            {tables.length} table{tables.length !== 1 ? "s" : ""} generated •
            Data saved automatically
          </p>
          <div className="mt-4 text-sm text-gray-500 bg-blue-50 p-3 rounded-lg inline-block">
            <p className="font-mono break-all max-w-2xl">
              Menu URL: {MENU_IMAGE_URL}?table=TABLE_NUMBER
            </p>
          </div>
        </div>

        {/* Add Table Section */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Table Number
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  placeholder="e.g., 1, 2, 3..."
                  value={tableNo}
                  onChange={(e) => setTableNo(e.target.value)}
                  className="flex-1 border border-gray-300 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  min="1"
                  onKeyPress={(e) => e.key === "Enter" && addTable()}
                />
                <button
                  onClick={addMultipleTables}
                  className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2 whitespace-nowrap"
                >
                  <span>Bulk Create (10)</span>
                </button>
              </div>
            </div>

            <button
              onClick={addTable}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium text-lg flex items-center gap-2"
            >
              <span>+ Generate QR Code</span>
            </button>
          </div>

          <div className="mt-4 text-sm text-gray-500 grid grid-cols-1 md:grid-cols-2 gap-2">
            <p>• QR codes link to menu image with table number parameter</p>
            <p>• Customers scan → Directly see menu image in browser</p>
            <p>• All data saved automatically in browser</p>
            <p>• Print/download QR codes for physical tables</p>
          </div>
        </div>

        {/* Controls Bar */}
        {tables.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                <div className="relative flex-1 sm:flex-none">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search table numbers..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <div className="relative">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="tableNo">Sort by Table No</option>
                      <option value="createdAt">Sort by Newest</option>
                    </select>
                    <SortAsc
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                      size={20}
                    />
                  </div>
                </div>
              </div>

              {/* Bulk Actions */}
              <div className="flex gap-3 w-full md:w-auto">
                <button
                  onClick={downloadAllQR}
                  className="flex-1 md:flex-none bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium flex items-center justify-center gap-2"
                  title="Download all QR codes as ZIP (requires jszip)"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Download All (ZIP)</span>
                </button>

                <button
                  onClick={downloadAllQRSimple}
                  className="flex-1 md:flex-none bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center gap-2"
                  title="Download each QR code individually"
                >
                  <Download size={18} />
                  <span className="hidden sm:inline">Download All</span>
                </button>

                <button
                  onClick={exportTableData}
                  className="flex-1 md:flex-none bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium flex items-center justify-center gap-2"
                >
                  <span className="hidden sm:inline">Export Data</span>
                </button>

                <button
                  onClick={clearAllTables}
                  className="flex-1 md:flex-none bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-medium flex items-center justify-center gap-2"
                >
                  <Trash size={18} />
                  <span className="hidden sm:inline">Clear All</span>
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between text-sm text-gray-600">
              <div>
                Showing{" "}
                <span className="font-bold">{filteredTables.length}</span> of{" "}
                <span className="font-bold">{tables.length}</span> tables
                {searchTerm && (
                  <span className="ml-2">(filtered by "{searchTerm}")</span>
                )}
              </div>
              <div className="text-right">
                Auto-saved • Refresh page to keep data
              </div>
            </div>
          </div>
        )}

        {/* Tables Grid */}
        {filteredTables.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTables.map((table) => (
                <div
                  key={table.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow duration-300"
                >
                  {/* Table Header */}
                  <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="text-xl font-bold text-white">
                          Table {table.tableNo}
                        </h3>
                        <p className="text-blue-100 text-sm">
                          {table.createdAt} • {table.createdTime}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteTable(table.id, table.tableNo)}
                        className="text-white hover:text-red-200 p-2 rounded-full hover:bg-blue-700 transition-colors"
                        title="Delete QR code"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="p-6">
                    <div className="flex justify-center mb-4">
                      <div className="bg-white p-4 rounded-xl border-2 border-gray-100 shadow-inner">
                        <QRCode
                          id={`qr-${table.id}`}
                          value={table.qrUrl}
                          size={180}
                          className="mx-auto"
                          fgColor="#1e40af"
                        />
                      </div>
                    </div>

                    {/* URL Display */}
                    <div className="mt-4">
                      <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1 font-medium">
                          Menu Image URL:
                        </p>
                        <p className="text-sm text-gray-700 break-all font-mono">
                          {table.qrUrl}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-gray-50 border-t border-gray-200">
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => copyToClipboard(table.qrUrl)}
                        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Copy Menu URL"
                      >
                        <Copy size={18} className="text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Copy URL</span>
                      </button>

                      <button
                        onClick={() => downloadQRCode(table.tableNo, table.id)}
                        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Download QR Code"
                      >
                        <Download size={18} className="text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">
                          Download QR
                        </span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-3">
                      <button
                        onClick={() => printQRCode(table)}
                        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Print QR Code"
                      >
                        <Printer size={18} className="text-gray-600 mb-1" />
                        <span className="text-xs text-gray-600">Print</span>
                      </button>

                      <button
                        onClick={() => openMenuImage(table.qrUrl)}
                        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-200 transition-colors"
                        title="Test Menu Opening"
                      >
                        <ExternalLink
                          size={18}
                          className="text-gray-600 mb-1"
                        />
                        <span className="text-xs text-gray-600">Test Menu</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : tables.length > 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No tables found
              </h3>
              <p className="text-gray-600 mb-6">
                No tables match your search "{searchTerm}". Try a different
                search term.
              </p>
              <button
                onClick={() => setSearchTerm("")}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-medium"
              >
                Clear Search
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="text-6xl mb-4">📱</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">
                No QR Codes Generated Yet
              </h3>
              <p className="text-gray-600 mb-6">
                Add a table number to generate QR codes. Customers will scan
                these codes to view the menu image.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-left mb-6">
                <h4 className="font-semibold text-blue-800 mb-2">
                  How it works:
                </h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Enter table number and click "Generate QR Code"</li>
                  <li>• QR code with menu image link will be created</li>
                  <li>• Download/print QR code for the table</li>
                  <li>• Customers scan QR to see menu image instantly</li>
                </ul>
              </div>
            </div>
          </div>
        )}


        

        {/* Footer */}
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p className="font-medium">Menu Image URL: {MENU_IMAGE_URL}</p>
          <p className="mt-1">
            Print QR codes and place on tables. Customers scan to view menu
            instantly.
            <span className="block mt-1 text-xs">
              Data persists in browser • Works offline after first load
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
