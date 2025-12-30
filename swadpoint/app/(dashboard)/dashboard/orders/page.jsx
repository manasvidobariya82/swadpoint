// // "use client";

// // import { useState, useEffect } from "react";
// // import {
// //   ChefHat,
// //   Package,
// //   Truck,
// //   Check,
// //   Clock,
// //   DollarSign,
// //   Users,
// //   TrendingUp,
// //   Printer,
// //   Trash2,
// //   Filter,
// //   RefreshCw,
// //   Bell,
// //   Settings,
// //   ShoppingBag,
// //   Home,
// //   MapPin,
// //   Phone,
// //   CreditCard,
// //   Star,
// //   MessageSquare,
// //   Search,
// //   Plus,
// //   X,
// //   Edit3,
// //   AlertCircle,
// //   Download,
// //   MoreVertical,
// //   Eye,
// //   Coffee,
// //   Pizza,
// //   Utensils,
// //   Wine,
// //   Soup,
// //   Sandwich,
// //   Cake,
// //   IceCream,
// //   Thermometer,
// //   Timer,
// //   BellRing,
// //   CheckCircle,
// //   AlertTriangle,
// //   UsersRound,
// //   Table,
// //   Chair,
// //   DoorOpen,
// //   Receipt,
// //   QrCode,
// //   Sparkles,
// //   Target,
// // } from "lucide-react";

// // export default function TableWiseDashboard() {
// //   // Restaurant Tables Data
// //   const tablesData = [
// //     {
// //       id: 1,
// //       name: "Table 1",
// //       capacity: 4,
// //       status: "occupied",
// //       orders: 2,
// //       total: 1200,
// //     },
// //     {
// //       id: 2,
// //       name: "Table 2",
// //       capacity: 2,
// //       status: "occupied",
// //       orders: 1,
// //       total: 650,
// //     },
// //     {
// //       id: 3,
// //       name: "Table 3",
// //       capacity: 6,
// //       status: "occupied",
// //       orders: 3,
// //       total: 2100,
// //     },
// //     {
// //       id: 4,
// //       name: "Table 4",
// //       capacity: 4,
// //       status: "available",
// //       orders: 0,
// //       total: 0,
// //     },
// //     {
// //       id: 5,
// //       name: "Table 5",
// //       capacity: 2,
// //       status: "occupied",
// //       orders: 1,
// //       total: 850,
// //     },
// //     {
// //       id: 6,
// //       name: "VIP 1",
// //       capacity: 8,
// //       status: "occupied",
// //       orders: 4,
// //       total: 3500,
// //     },
// //     {
// //       id: 7,
// //       name: "Table 7",
// //       capacity: 4,
// //       status: "available",
// //       orders: 0,
// //       total: 0,
// //     },
// //     {
// //       id: 8,
// //       name: "Table 8",
// //       capacity: 6,
// //       status: "occupied",
// //       orders: 2,
// //       total: 1800,
// //     },
// //     {
// //       id: 9,
// //       name: "Outdoor 1",
// //       capacity: 4,
// //       status: "occupied",
// //       orders: 1,
// //       total: 950,
// //     },
// //     {
// //       id: 10,
// //       name: "VIP 2",
// //       capacity: 10,
// //       status: "reserved",
// //       orders: 0,
// //       total: 0,
// //     },
// //   ];

// //   // Kitchen Stations
// //   const kitchenStations = [
// //     {
// //       id: 1,
// //       name: "Main Kitchen",
// //       chef: "Chef Raj",
// //       orders: 5,
// //       avgTime: 12,
// //       color: "bg-red-500",
// //     },
// //     {
// //       id: 2,
// //       name: "Pizza Oven",
// //       chef: "Chef Kumar",
// //       orders: 3,
// //       avgTime: 8,
// //       color: "bg-orange-500",
// //     },
// //     {
// //       id: 3,
// //       name: "Grill Station",
// //       chef: "Chef Singh",
// //       orders: 4,
// //       avgTime: 15,
// //       color: "bg-yellow-500",
// //     },
// //     {
// //       id: 4,
// //       name: "Salad Bar",
// //       chef: "Chef Mehta",
// //       orders: 2,
// //       avgTime: 5,
// //       color: "bg-green-500",
// //     },
// //     {
// //       id: 5,
// //       name: "Dessert Corner",
// //       chef: "Chef Priya",
// //       orders: 3,
// //       avgTime: 7,
// //       color: "bg-purple-500",
// //     },
// //     {
// //       id: 6,
// //       name: "Beverage Station",
// //       chef: "Chef Anil",
// //       orders: 6,
// //       avgTime: 3,
// //       color: "bg-blue-500",
// //     },
// //   ];

// //   // Sample Orders grouped by Table
// //   const [tableOrders, setTableOrders] = useState({
// //     1: [
// //       {
// //         id: "#T1-101",
// //         orderNumber: "ORD-101",
// //         customer: {
// //           name: "Rahul Sharma",
// //           phone: "+91 98765 43210",
// //           type: "Regular",
// //           visits: 12,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Paneer Butter Masala",
// //             quantity: 2,
// //             price: 220,
// //             status: "served",
// //             station: "Main Kitchen",
// //             time: 5,
// //           },
// //           {
// //             id: 2,
// //             name: "Garlic Naan",
// //             quantity: 4,
// //             price: 40,
// //             status: "served",
// //             station: "Tandoor",
// //             time: 3,
// //           },
// //           {
// //             id: 3,
// //             name: "Masala Lemonade",
// //             quantity: 2,
// //             price: 80,
// //             status: "ready",
// //             station: "Beverage Station",
// //             time: 2,
// //           },
// //         ],
// //         total: 760,
// //         discount: 50,
// //         tax: 71,
// //         grandTotal: 781,
// //         status: "served",
// //         paymentStatus: "paid",
// //         paymentMethod: "UPI",
// //         orderTime: "7:30 PM",
// //         prepTime: 12,
// //         estimatedTime: 15,
// //         notes: "Extra spicy, less oil",
// //         createdAt: new Date().toISOString(),
// //       },
// //       {
// //         id: "#T1-102",
// //         orderNumber: "ORD-102",
// //         customer: {
// //           name: "Same Table - Dessert",
// //           phone: "-",
// //           type: "Additional",
// //           visits: 0,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Gulab Jamun",
// //             quantity: 4,
// //             price: 40,
// //             status: "preparing",
// //             station: "Dessert Corner",
// //             time: 8,
// //           },
// //           {
// //             id: 2,
// //             name: "Kesar Pista Ice Cream",
// //             quantity: 2,
// //             price: 120,
// //             status: "ready",
// //             station: "Dessert Corner",
// //             time: 5,
// //           },
// //         ],
// //         total: 440,
// //         discount: 0,
// //         tax: 44,
// //         grandTotal: 484,
// //         status: "preparing",
// //         paymentStatus: "pending",
// //         paymentMethod: "Cash",
// //         orderTime: "7:45 PM",
// //         prepTime: null,
// //         estimatedTime: 10,
// //         notes: "Serve ice cream separately",
// //         createdAt: new Date().toISOString(),
// //       },
// //     ],
// //     3: [
// //       {
// //         id: "#T3-201",
// //         orderNumber: "ORD-201",
// //         customer: {
// //           name: "Family Group",
// //           phone: "+91 87654 32109",
// //           type: "Family",
// //           visits: 5,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Veg Biryani",
// //             quantity: 3,
// //             price: 180,
// //             status: "preparing",
// //             station: "Main Kitchen",
// //             time: 15,
// //           },
// //           {
// //             id: 2,
// //             name: "Butter Chicken",
// //             quantity: 2,
// //             price: 280,
// //             status: "preparing",
// //             station: "Grill Station",
// //             time: 12,
// //           },
// //           {
// //             id: 3,
// //             name: "Roti",
// //             quantity: 8,
// //             price: 20,
// //             status: "ready",
// //             station: "Tandoor",
// //             time: 3,
// //           },
// //           {
// //             id: 4,
// //             name: "Coke",
// //             quantity: 4,
// //             price: 50,
// //             status: "ready",
// //             station: "Beverage Station",
// //             time: 2,
// //           },
// //         ],
// //         total: 1620,
// //         discount: 100,
// //         tax: 152,
// //         grandTotal: 1672,
// //         status: "preparing",
// //         paymentStatus: "pending",
// //         paymentMethod: "Card",
// //         orderTime: "7:20 PM",
// //         prepTime: 8,
// //         estimatedTime: 20,
// //         notes: "Celebrating birthday",
// //         createdAt: new Date().toISOString(),
// //       },
// //       {
// //         id: "#T3-202",
// //         orderNumber: "ORD-202",
// //         customer: {
// //           name: "Same Table - Starters",
// //           phone: "-",
// //           type: "Additional",
// //           visits: 0,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Paneer Tikka",
// //             quantity: 2,
// //             price: 180,
// //             status: "served",
// //             station: "Grill Station",
// //             time: 10,
// //           },
// //           {
// //             id: 2,
// //             name: "French Fries",
// //             quantity: 2,
// //             price: 120,
// //             status: "served",
// //             station: "Fry Station",
// //             time: 6,
// //           },
// //         ],
// //         total: 600,
// //         discount: 0,
// //         tax: 60,
// //         grandTotal: 660,
// //         status: "served",
// //         paymentStatus: "paid",
// //         paymentMethod: "Cash",
// //         orderTime: "7:00 PM",
// //         prepTime: 10,
// //         estimatedTime: 12,
// //         notes: "Extra mayo",
// //         createdAt: new Date(Date.now() - 45 * 60000).toISOString(),
// //       },
// //     ],
// //     6: [
// //       {
// //         id: "#VIP-301",
// //         orderNumber: "ORD-301",
// //         customer: {
// //           name: "Mr. Ajay Mehta",
// //           phone: "+91 99999 88888",
// //           type: "VIP",
// //           visits: 25,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Truffle Pasta",
// //             quantity: 2,
// //             price: 450,
// //             status: "preparing",
// //             station: "Main Kitchen",
// //             time: 18,
// //           },
// //           {
// //             id: 2,
// //             name: "Red Wine",
// //             quantity: 1,
// //             price: 1200,
// //             status: "ready",
// //             station: "Bar",
// //             time: 2,
// //           },
// //           {
// //             id: 3,
// //             name: "Caesar Salad",
// //             quantity: 2,
// //             price: 220,
// //             status: "ready",
// //             station: "Salad Bar",
// //             time: 5,
// //           },
// //           {
// //             id: 4,
// //             name: "Garlic Bread",
// //             quantity: 2,
// //             price: 120,
// //             status: "ready",
// //             station: "Pizza Oven",
// //             time: 4,
// //           },
// //         ],
// //         total: 2540,
// //         discount: 200,
// //         tax: 234,
// //         grandTotal: 2574,
// //         status: "preparing",
// //         paymentStatus: "pending",
// //         paymentMethod: "Card",
// //         orderTime: "7:15 PM",
// //         prepTime: 10,
// //         estimatedTime: 25,
// //         notes: "VIP customer - priority",
// //         createdAt: new Date().toISOString(),
// //       },
// //     ],
// //     8: [
// //       {
// //         id: "#T8-401",
// //         orderNumber: "ORD-401",
// //         customer: {
// //           name: "Office Group",
// //           phone: "+91 77777 66666",
// //           type: "Corporate",
// //           visits: 8,
// //         },
// //         items: [
// //           {
// //             id: 1,
// //             name: "Margherita Pizza",
// //             quantity: 3,
// //             price: 300,
// //             status: "preparing",
// //             station: "Pizza Oven",
// //             time: 12,
// //           },
// //           {
// //             id: 2,
// //             name: "Garlic Bread Sticks",
// //             quantity: 2,
// //             price: 150,
// //             status: "ready",
// //             station: "Pizza Oven",
// //             time: 6,
// //           },
// //           {
// //             id: 3,
// //             name: "Soft Drinks",
// //             quantity: 6,
// //             price: 50,
// //             status: "ready",
// //             station: "Beverage Station",
// //             time: 2,
// //           },
// //         ],
// //         total: 1650,
// //         discount: 150,
// //         tax: 150,
// //         grandTotal: 1650,
// //         status: "preparing",
// //         paymentStatus: "pending",
// //         paymentMethod: "Corporate",
// //         orderTime: "7:40 PM",
// //         prepTime: 8,
// //         estimatedTime: 15,
// //         notes: "Separate bill for each person",
// //         createdAt: new Date().toISOString(),
// //       },
// //     ],
// //   });

// //   const [selectedTable, setSelectedTable] = useState(1);
// //   const [selectedOrder, setSelectedOrder] = useState(null);
// //   const [kitchenView, setKitchenView] = useState("orders");
// //   const [prepTime, setPrepTime] = useState(15);

// //   // Current time for display
// //   const [currentTime, setCurrentTime] = useState("");
// //   useEffect(() => {
// //     const updateTime = () => {
// //       const now = new Date();
// //       setCurrentTime(
// //         now.toLocaleTimeString([], {
// //           hour: "2-digit",
// //           minute: "2-digit",
// //           second: "2-digit",
// //         })
// //       );
// //     };
// //     updateTime();
// //     const interval = setInterval(updateTime, 1000);
// //     return () => clearInterval(interval);
// //   }, []);

// //   // Get table status color
// //   const getTableStatusColor = (status) => {
// //     const colors = {
// //       occupied: "bg-red-500",
// //       available: "bg-green-500",
// //       reserved: "bg-yellow-500",
// //       cleaning: "bg-blue-500",
// //     };
// //     return colors[status] || "bg-gray-500";
// //   };

// //   // Get order status color
// //   const getOrderStatusColor = (status) => {
// //     const colors = {
// //       pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
// //       preparing: "bg-blue-100 text-blue-800 border-blue-200",
// //       ready: "bg-green-100 text-green-800 border-green-200",
// //       served: "bg-purple-100 text-purple-800 border-purple-200",
// //       completed: "bg-gray-100 text-gray-800 border-gray-200",
// //     };
// //     return colors[status] || "bg-gray-100";
// //   };

// //   // Get payment status color
// //   const getPaymentColor = (status) => {
// //     return status === "paid"
// //       ? "bg-green-100 text-green-800 border-green-200"
// //       : "bg-yellow-100 text-yellow-800 border-yellow-200";
// //   };

// //   // Get item status color
// //   const getItemStatusColor = (status) => {
// //     const colors = {
// //       pending: "bg-gray-100 text-gray-800",
// //       preparing: "bg-blue-50 text-blue-700 border-blue-200",
// //       ready: "bg-green-50 text-green-700 border-green-200",
// //       served: "bg-purple-50 text-purple-700 border-purple-200",
// //     };
// //     return colors[status] || "bg-gray-100";
// //   };

// //   // Get item status icon
// //   const getItemStatusIcon = (status) => {
// //     const icons = {
// //       pending: <Clock size={14} className="text-gray-500" />,
// //       preparing: <ChefHat size={14} className="text-blue-500" />,
// //       ready: <Package size={14} className="text-green-500" />,
// //       served: <Check size={14} className="text-purple-500" />,
// //     };
// //     return icons[status] || <Clock size={14} />;
// //   };

// //   // Calculate table totals
// //   const calculateTableStats = (tableId) => {
// //     const orders = tableOrders[tableId] || [];
// //     const totalOrders = orders.length;
// //     const totalAmount = orders.reduce(
// //       (sum, order) => sum + order.grandTotal,
// //       0
// //     );
// //     const pendingOrders = orders.filter(
// //       (o) => o.status === "pending" || o.status === "preparing"
// //     ).length;

// //     return { totalOrders, totalAmount, pendingOrders };
// //   };

// //   // Accept order
// //   const acceptOrder = (tableId, orderId) => {
// //     setTableOrders((prev) => ({
// //       ...prev,
// //       [tableId]: prev[tableId].map((order) =>
// //         order.id === orderId
// //           ? {
// //               ...order,
// //               status: "preparing",
// //               prepTime: prepTime,
// //               estimatedTime: new Date(
// //                 Date.now() + prepTime * 60000
// //               ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
// //             }
// //           : order
// //       ),
// //     }));
// //   };

// //   // Mark item as ready
// //   const markItemReady = (tableId, orderId, itemId) => {
// //     setTableOrders((prev) => ({
// //       ...prev,
// //       [tableId]: prev[tableId].map((order) =>
// //         order.id === orderId
// //           ? {
// //               ...order,
// //               items: order.items.map((item) =>
// //                 item.id === itemId ? { ...item, status: "ready" } : item
// //               ),
// //             }
// //           : order
// //       ),
// //     }));
// //   };

// //   // Mark order as served
// //   const markOrderServed = (tableId, orderId) => {
// //     setTableOrders((prev) => ({
// //       ...prev,
// //       [tableId]: prev[tableId].map((order) =>
// //         order.id === orderId ? { ...order, status: "served" } : order
// //       ),
// //     }));
// //   };

// //   // Complete order with payment
// //   const completeOrder = (tableId, orderId) => {
// //     setTableOrders((prev) => ({
// //       ...prev,
// //       [tableId]: prev[tableId].map((order) =>
// //         order.id === orderId
// //           ? {
// //               ...order,
// //               status: "completed",
// //               paymentStatus: "paid",
// //               paymentTime: new Date().toLocaleTimeString([], {
// //                 hour: "2-digit",
// //                 minute: "2-digit",
// //               }),
// //             }
// //           : order
// //       ),
// //     }));
// //   };

// //   // Add new order to table
// //   const addNewOrder = (tableId) => {
// //     const newOrderId = `#T${tableId}-${Date.now().toString().slice(-4)}`;
// //     const newOrder = {
// //       id: newOrderId,
// //       orderNumber: `ORD-${Date.now().toString().slice(-6)}`,
// //       customer: {
// //         name: "New Customer",
// //         phone: "+91 00000 00000",
// //         type: "New",
// //         visits: 1,
// //       },
// //       items: [
// //         {
// //           id: 1,
// //           name: "New Item",
// //           quantity: 1,
// //           price: 0,
// //           status: "pending",
// //           station: "Main Kitchen",
// //           time: 15,
// //         },
// //       ],
// //       total: 0,
// //       discount: 0,
// //       tax: 0,
// //       grandTotal: 0,
// //       status: "pending",
// //       paymentStatus: "pending",
// //       paymentMethod: "Cash",
// //       orderTime: new Date().toLocaleTimeString([], {
// //         hour: "2-digit",
// //         minute: "2-digit",
// //       }),
// //       prepTime: null,
// //       estimatedTime: null,
// //       notes: "New order - please update",
// //       createdAt: new Date().toISOString(),
// //     };

// //     setTableOrders((prev) => ({
// //       ...prev,
// //       [tableId]: [...(prev[tableId] || []), newOrder],
// //     }));

// //     setSelectedOrder(newOrder);
// //   };

// //   Get all kitchen orders
// //   const getAllKitchenOrders = () => {
// //     const allOrders = [];
// //     Object.keys(tableOrders).forEach((tableId) => {
// //       tableOrders[tableId].forEach((order) => {
// //         if (order.status === "preparing" || order.status === "pending") {
// //           allOrders.push({
// //             ...order,
// //             tableId: parseInt(tableId),
// //             tableName:
// //               tablesData.find((t) => t.id === parseInt(tableId))?.name ||
// //               `Table ${tableId}`,
// //           });
// //         }
// //       });
// //     });
// //     return allOrders;
// //   };

// //   // Print receipt
// //   const printReceipt = (order) => {
// //     const table = tablesData.find((t) => t.id === selectedTable);
// //     const printWindow = window.open("", "_blank");
// //     const content = `
// //       <html>
// //         <head>
// //           <title>Receipt - ${order.orderNumber}</title>
// //           <style>
// //             @media print { body { margin: 0; font-size: 14px; } }
// //             body { font-family: 'Arial', sans-serif; max-width: 400px; margin: 0 auto; padding: 20px; }
// //             .header { text-align: center; padding-bottom: 15px; border-bottom: 2px solid #333; margin-bottom: 20px; }
// //             .logo { font-size: 24px; font-weight: bold; color: #f97316; margin-bottom: 10px; }
// //             .info { margin: 15px 0; }
// //             .item { display: flex; justify-content: space-between; margin: 6px 0; padding-bottom: 4px; border-bottom: 1px dashed #ddd; }
// //             .total { font-weight: bold; margin-top: 15px; padding-top: 8px; border-top: 2px solid #333; }
// //             .footer { text-align: center; margin-top: 25px; font-size: 12px; color: #666; }
// //             .status-badge { display: inline-block; padding: 3px 10px; border-radius: 15px; font-size: 11px; margin: 3px; }
// //           </style>
// //         </head>
// //         <body>
// //           <div class="header">
// //             <div class="logo">🍽️ TableFlow</div>
// //             <h2>ORDER RECEIPT</h2>
// //             <p>${order.orderNumber} • ${table?.name}</p>
// //             <p>${new Date().toLocaleString()}</p>
// //           </div>

// //           <div class="info">
// //             <p><strong>Customer:</strong> ${order.customer.name}</p>
// //             <p><strong>Table:</strong> ${table?.name} (${
// //       table?.capacity
// //     } seats)</p>
// //             <p><strong>Phone:</strong> ${order.customer.phone}</p>
// //             <p><strong>Order Time:</strong> ${order.orderTime}</p>
// //           </div>

// //           <div>
// //             <h3>Order Items:</h3>
// //             ${order.items
// //               .map(
// //                 (item) => `
// //               <div class="item">
// //                 <div>
// //                   <strong>${item.quantity}x ${item.name}</strong>
// //                   <br><small>${item.station} • ${item.time} mins</small>
// //                 </div>
// //                 <div>₹${item.quantity * item.price}</div>
// //               </div>
// //             `
// //               )
// //               .join("")}
// //           </div>

// //           ${
// //             order.notes
// //               ? `<div style="margin: 10px 0; padding: 8px; background: #f5f5f5; border-radius: 5px;">
// //             <strong>Notes:</strong> ${order.notes}
// //           </div>`
// //               : ""
// //           }

// //           <div class="total">
// //             <div style="display: flex; justify-content: space-between;">
// //               <span>Subtotal:</span>
// //               <span>₹${order.total}</span>
// //             </div>
// //             ${
// //               order.discount > 0
// //                 ? `
// //               <div style="display: flex; justify-content: space-between; color: #10b981;">
// //                 <span>Discount:</span>
// //                 <span>-₹${order.discount}</span>
// //               </div>
// //             `
// //                 : ""
// //             }
// //             <div style="display: flex; justify-content: space-between;">
// //               <span>Tax (10%):</span>
// //               <span>₹${order.tax}</span>
// //             </div>
// //             <div style="display: flex; justify-content: space-between; font-size: 16px; margin-top: 8px;">
// //               <strong>Grand Total:</strong>
// //               <strong>₹${order.grandTotal}</strong>
// //             </div>
// //           </div>

// //           <div style="margin: 15px 0;">
// //             <span class="status-badge" style="background: ${
// //               order.paymentStatus === "paid" ? "#d1fae5" : "#fef3c7"
// //             }; color: ${
// //       order.paymentStatus === "paid" ? "#065f46" : "#92400e"
// //     }">
// //               Payment: ${
// //                 order.paymentStatus === "paid" ? "✅ PAID" : "⏳ PENDING"
// //               }
// //             </span>
// //             <span class="status-badge" style="background: #dbeafe; color: #1e40af">
// //               Status: ${order.status.toUpperCase()}
// //             </span>
// //           </div>

// //           <div class="footer">
// //             <p>Thank you for dining with us!</p>
// //             <p>For feedback: feedback@tableflow.com • +91 98765 43210</p>
// //             <p>Generated at: ${new Date().toLocaleTimeString()}</p>
// //           </div>
// //         </body>
// //       </html>
// //     `;

// //     printWindow.document.write(content);
// //     printWindow.document.close();
// //     printWindow.focus();
// //     setTimeout(() => {
// //       printWindow.print();
// //       printWindow.close();
// //     }, 250);
// //   };

// //   // Kitchen Display Component
// //   const KitchenDisplay = () => {
// //     const kitchenOrders = getAllKitchenOrders();

// //     return (
// //       <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white rounded-2xl shadow-2xl p-6">
// //         <div className="flex justify-between items-center mb-6">
// //           <div>
// //             <h2 className="text-2xl font-bold flex items-center gap-2">
// //               <ChefHat className="text-orange-400" />
// //               Kitchen Command Center
// //             </h2>
// //             <p className="text-gray-400">
// //               Live Orders: {kitchenOrders.length} • Time: {currentTime}
// //             </p>
// //           </div>
// //           <div className="flex items-center gap-4">
// //             <div className="flex gap-2">
// //               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
// //               <div
// //                 className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
// //                 style={{ animationDelay: "0.2s" }}
// //               ></div>
// //               <div
// //                 className="w-2 h-2 bg-green-500 rounded-full animate-pulse"
// //                 style={{ animationDelay: "0.4s" }}
// //               ></div>
// //             </div>
// //             <span className="text-sm bg-green-500/20 text-green-400 px-3 py-1 rounded-full">
// //               LIVE
// //             </span>
// //           </div>
// //         </div>

// //         {/* Kitchen Stations */}
// //         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
// //           {kitchenStations.map((station) => (
// //             <div
// //               key={station.id}
// //               className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
// //             >
// //               <div className="flex items-center justify-between mb-3">
// //                 <div className={`w-3 h-3 rounded-full ${station.color}`}></div>
// //                 <div className="text-right">
// //                   <div className="text-2xl font-bold">{station.orders}</div>
// //                   <div className="text-xs text-gray-400">orders</div>
// //                 </div>
// //               </div>
// //               <div className="font-semibold text-sm mb-1">{station.name}</div>
// //               <div className="text-xs text-gray-400 mb-2">{station.chef}</div>
// //               <div className="flex items-center text-xs text-gray-300">
// //                 <Timer size={12} className="mr-1" />
// //                 Avg: {station.avgTime} mins
// //               </div>
// //             </div>
// //           ))}
// //         </div>

// //         {/* Active Orders Grid */}
// //         <div className="mb-6">
// //           <div className="flex justify-between items-center mb-4">
// //             <h3 className="text-lg font-semibold">
// //               Active Orders ({kitchenOrders.length})
// //             </h3>
// //             <div className="flex gap-2">
// //               <button
// //                 onClick={() => setKitchenView("orders")}
// //                 className={`px-3 py-1 rounded text-sm ${
// //                   kitchenView === "orders"
// //                     ? "bg-orange-500 text-white"
// //                     : "bg-gray-700 text-gray-300"
// //                 }`}
// //               >
// //                 By Order
// //               </button>
// //               <button
// //                 onClick={() => setKitchenView("station")}
// //                 className={`px-3 py-1 rounded text-sm ${
// //                   kitchenView === "station"
// //                     ? "bg-orange-500 text-white"
// //                     : "bg-gray-700 text-gray-300"
// //                 }`}
// //               >
// //                 By Station
// //               </button>
// //             </div>
// //           </div>

// //           {kitchenView === "orders" ? (
// //             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
// //               {kitchenOrders.map((order) => (
// //                 <div
// //                   key={order.id}
// //                   className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
// //                 >
// //                   <div className="flex justify-between items-start mb-3">
// //                     <div>
// //                       <div className="font-bold flex items-center gap-2">
// //                         {order.orderNumber}
// //                         <span className="text-xs bg-orange-500/20 text-orange-400 px-2 py-1 rounded">
// //                           {order.tableName}
// //                         </span>
// //                       </div>
// //                       <div className="text-sm text-gray-400">
// //                         {order.customer.name}
// //                       </div>
// //                     </div>
// //                     <div className="text-right">
// //                       <div className="text-lg font-bold">
// //                         ₹{order.grandTotal}
// //                       </div>
// //                       <div className="text-xs text-gray-400">
// //                         {order.orderTime}
// //                       </div>
// //                     </div>
// //                   </div>

// //                   <div className="space-y-2">
// //                     {order.items.map((item) => (
// //                       <div
// //                         key={item.id}
// //                         className="flex justify-between items-center p-2 bg-gray-900/50 rounded"
// //                       >
// //                         <div className="flex items-center gap-2">
// //                           {getItemStatusIcon(item.status)}
// //                           <div>
// //                             <div className="text-sm">
// //                               {item.quantity}x {item.name}
// //                             </div>
// //                             <div className="text-xs text-gray-400">
// //                               {item.station}
// //                             </div>
// //                           </div>
// //                         </div>
// //                         <div className="flex items-center gap-2">
// //                           <div
// //                             className={`text-xs px-2 py-1 rounded ${getItemStatusColor(
// //                               item.status
// //                             )}`}
// //                           >
// //                             {item.status}
// //                           </div>
// //                           {item.status === "preparing" && (
// //                             <button
// //                               onClick={() =>
// //                                 markItemReady(order.tableId, order.id, item.id)
// //                               }
// //                               className="text-xs bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded"
// //                             >
// //                               Ready
// //                             </button>
// //                           )}
// //                         </div>
// //                       </div>
// //                     ))}
// //                   </div>

// //                   <div className="mt-3 pt-3 border-t border-gray-700">
// //                     <div className="flex justify-between text-sm">
// //                       <span>Prep Time:</span>
// //                       <span>{order.prepTime || "Not started"} mins</span>
// //                     </div>
// //                     <div className="flex justify-between text-sm">
// //                       <span>Estimated:</span>
// //                       <span>{order.estimatedTime || "Calculating..."}</span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               ))}
// //             </div>
// //           ) : (
// //             <div className="space-y-4">
// //               {kitchenStations.map((station) => {
// //                 const stationOrders = kitchenOrders.filter((order) =>
// //                   order.items.some((item) => item.station === station.name)
// //                 );

// //                 return (
// //                   stationOrders.length > 0 && (
// //                     <div
// //                       key={station.id}
// //                       className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700"
// //                     >
// //                       <div className="flex items-center justify-between mb-3">
// //                         <div className="flex items-center gap-3">
// //                           <div
// //                             className={`w-4 h-4 rounded ${station.color}`}
// //                           ></div>
// //                           <h4 className="font-bold">{station.name}</h4>
// //                           <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
// //                             {station.chef}
// //                           </span>
// //                         </div>
// //                         <div className="text-sm text-gray-400">
// //                           {stationOrders.length} order
// //                           {stationOrders.length !== 1 ? "s" : ""}
// //                         </div>
// //                       </div>

// //                       <div className="space-y-2">
// //                         {stationOrders.map((order) => (
// //                           <div
// //                             key={order.id}
// //                             className="flex justify-between items-center p-2 bg-gray-900/50 rounded"
// //                           >
// //                             <div>
// //                               <div className="font-medium">
// //                                 {order.orderNumber}
// //                               </div>
// //                               <div className="text-xs text-gray-400">
// //                                 {order.tableName} • {order.customer.name}
// //                               </div>
// //                             </div>
// //                             <div className="text-right">
// //                               <div className="text-sm">
// //                                 {
// //                                   order.items.filter(
// //                                     (item) => item.station === station.name
// //                                   ).length
// //                                 }{" "}
// //                                 item(s)
// //                               </div>
// //                               <div className="text-xs text-gray-400">
// //                                 {
// //                                   order.items.find(
// //                                     (item) => item.station === station.name
// //                                   )?.time
// //                                 }{" "}
// //                                 mins each
// //                               </div>
// //                             </div>
// //                           </div>
// //                         ))}
// //                       </div>
// //                     </div>
// //                   )
// //                 );
// //               })}
// //             </div>
// //           )}
// //         </div>

// //         {/* Kitchen Performance */}
// //         <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700">
// //           <h3 className="font-bold mb-3">Kitchen Performance</h3>
// //           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
// //             <div className="text-center">
// //               <div className="text-2xl font-bold text-green-400">87%</div>
// //               <div className="text-xs text-gray-400">On-time Delivery</div>
// //             </div>
// //             <div className="text-center">
// //               <div className="text-2xl font-bold text-blue-400">4.8</div>
// //               <div className="text-xs text-gray-400">Quality Rating</div>
// //             </div>
// //             <div className="text-center">
// //               <div className="text-2xl font-bold text-yellow-400">12.5</div>
// //               <div className="text-xs text-gray-400">Avg Prep Time</div>
// //             </div>
// //             <div className="text-center">
// //               <div className="text-2xl font-bold text-purple-400">42</div>
// //               <div className="text-xs text-gray-400">Today's Orders</div>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 text-gray-900">
// //       {/* Header */}
// //       <div className="bg-white shadow-sm border-b border-gray-200">
// //         <div className="px-4 sm:px-6 lg:px-8">
// //           <div className="flex justify-between items-center h-16">
// //             <div className="flex items-center">
// //               <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-red-500">
// //                 <Table className="text-white" size={24} />
// //               </div>
// //               <div className="ml-3">
// //                 <div className="text-xl font-bold">TableFlow Restaurant</div>
// //                 <div className="text-xs text-gray-500">
// //                   Table-wise Order Management
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="flex items-center space-x-4">
// //               <div className="text-right">
// //                 <div className="font-semibold">{currentTime}</div>
// //                 <div className="text-xs text-gray-500">Live Dashboard</div>
// //               </div>
// //               <button className="p-2 rounded-lg hover:bg-gray-100">
// //                 <Bell size={20} />
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       <div className="px-4 sm:px-6 lg:px-8 py-6">
// //         {/* Main Dashboard */}
// //         <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
// //           {/* Left Column - Tables */}
// //           <div className="lg:col-span-1">
// //             <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
// //               <div className="flex justify-between items-center mb-6">
// //                 <h2 className="text-xl font-bold">Restaurant Tables</h2>
// //                 <div className="flex items-center gap-2 text-sm">
// //                   <div className="flex items-center gap-1">
// //                     <div className="w-3 h-3 rounded-full bg-green-500"></div>
// //                     <span>Available</span>
// //                   </div>
// //                   <div className="flex items-center gap-1">
// //                     <div className="w-3 h-3 rounded-full bg-red-500"></div>
// //                     <span>Occupied</span>
// //                   </div>
// //                   <div className="flex items-center gap-1">
// //                     <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
// //                     <span>Reserved</span>
// //                   </div>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-4">
// //                 {tablesData.map((table) => {
// //                   const stats = calculateTableStats(table.id);
// //                   const orders = tableOrders[table.id] || [];

// //                   return (
// //                     <div
// //                       key={table.id}
// //                       onClick={() => setSelectedTable(table.id)}
// //                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
// //                         selectedTable === table.id
// //                           ? "border-orange-500 bg-orange-50"
// //                           : "border-gray-200 hover:border-gray-300"
// //                       }`}
// //                     >
// //                       <div className="flex justify-between items-start mb-2">
// //                         <div>
// //                           <div className="font-bold text-lg">{table.name}</div>
// //                           <div className="text-sm text-gray-600">
// //                             {table.capacity} seats
// //                           </div>
// //                         </div>
// //                         <div
// //                           className={`w-3 h-3 rounded-full ${getTableStatusColor(
// //                             table.status
// //                           )}`}
// //                         ></div>
// //                       </div>

// //                       <div className="mt-3">
// //                         <div className="flex justify-between text-sm mb-1">
// //                           <span className="text-gray-600">Orders:</span>
// //                           <span className="font-bold">{stats.totalOrders}</span>
// //                         </div>
// //                         <div className="flex justify-between text-sm mb-1">
// //                           <span className="text-gray-600">Amount:</span>
// //                           <span className="font-bold">
// //                             ₹{stats.totalAmount}
// //                           </span>
// //                         </div>
// //                         <div className="flex justify-between text-sm">
// //                           <span className="text-gray-600">Pending:</span>
// //                           <span className="font-bold text-red-600">
// //                             {stats.pendingOrders}
// //                           </span>
// //                         </div>
// //                       </div>

// //                       {orders.length > 0 && (
// //                         <div className="mt-3 pt-3 border-t border-gray-200">
// //                           <div className="text-xs text-gray-500">
// //                             Active Orders:
// //                           </div>
// //                           <div className="space-y-1 mt-1">
// //                             {orders.slice(0, 2).map((order) => (
// //                               <div
// //                                 key={order.id}
// //                                 className="flex justify-between items-center"
// //                               >
// //                                 <span className="text-xs truncate">
// //                                   {order.orderNumber}
// //                                 </span>
// //                                 <span
// //                                   className={`text-xs px-2 py-1 rounded ${getOrderStatusColor(
// //                                     order.status
// //                                   )}`}
// //                                 >
// //                                   {order.status}
// //                                 </span>
// //                               </div>
// //                             ))}
// //                           </div>
// //                         </div>
// //                       )}
// //                     </div>
// //                   );
// //                 })}
// //               </div>

// //               <div className="mt-6 pt-6 border-t border-gray-200">
// //                 <div className="grid grid-cols-3 gap-4 text-center">
// //                   <div>
// //                     <div className="text-2xl font-bold text-green-600">
// //                       {
// //                         tablesData.filter((t) => t.status === "available")
// //                           .length
// //                       }
// //                     </div>
// //                     <div className="text-sm text-gray-600">Available</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-2xl font-bold text-red-600">
// //                       {tablesData.filter((t) => t.status === "occupied").length}
// //                     </div>
// //                     <div className="text-sm text-gray-600">Occupied</div>
// //                   </div>
// //                   <div>
// //                     <div className="text-2xl font-bold text-yellow-600">
// //                       {tablesData.filter((t) => t.status === "reserved").length}
// //                     </div>
// //                     <div className="text-sm text-gray-600">Reserved</div>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>

// //           {/* Middle Column - Table Orders */}
// //           <div className="lg:col-span-2">
// //             <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
// //               <div className="flex justify-between items-center mb-6">
// //                 <div>
// //                   <h2 className="text-xl font-bold">
// //                     {tablesData.find((t) => t.id === selectedTable)?.name} -
// //                     Orders
// //                   </h2>
// //                   <p className="text-gray-600">
// //                     {tablesData.find((t) => t.id === selectedTable)?.capacity}{" "}
// //                     seats • Status:{" "}
// //                     <span className="font-bold capitalize">
// //                       {tablesData.find((t) => t.id === selectedTable)?.status}
// //                     </span>
// //                   </p>
// //                 </div>
// //                 <div className="flex gap-2">
// //                   <button
// //                     onClick={() => addNewOrder(selectedTable)}
// //                     className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:opacity-90"
// //                   >
// //                     <Plus size={18} />
// //                     New Order
// //                   </button>
// //                   <button className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50">
// //                     <MoreVertical size={18} />
// //                   </button>
// //                 </div>
// //               </div>

// //               {tableOrders[selectedTable]?.length > 0 ? (
// //                 <div className="space-y-6">
// //                   {tableOrders[selectedTable].map((order) => (
// //                     <div
// //                       key={order.id}
// //                       onClick={() => setSelectedOrder(order)}
// //                       className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
// //                         selectedOrder?.id === order.id
// //                           ? "border-orange-500 bg-orange-50"
// //                           : "border-gray-200 hover:border-gray-300"
// //                       }`}
// //                     >
// //                       <div className="flex justify-between items-start">
// //                         <div>
// //                           <div className="flex items-center gap-3 mb-2">
// //                             <h3 className="font-bold text-lg">
// //                               {order.orderNumber}
// //                             </h3>
// //                             <span
// //                               className={`px-3 py-1 rounded-full text-sm ${getOrderStatusColor(
// //                                 order.status
// //                               )}`}
// //                             >
// //                               {order.status.toUpperCase()}
// //                             </span>
// //                             <span
// //                               className={`px-3 py-1 rounded-full text-sm ${getPaymentColor(
// //                                 order.paymentStatus
// //                               )}`}
// //                             >
// //                               {order.paymentStatus === "paid"
// //                                 ? "✅ PAID"
// //                                 : "⏳ PENDING"}
// //                             </span>
// //                           </div>

// //                           <div className="flex items-center gap-4 text-sm text-gray-600">
// //                             <div className="flex items-center gap-1">
// //                               <UsersRound size={14} />
// //                               {order.customer.name} ({order.customer.type})
// //                             </div>
// //                             <div className="flex items-center gap-1">
// //                               <Phone size={14} />
// //                               {order.customer.phone}
// //                             </div>
// //                             <div className="flex items-center gap-1">
// //                               <Clock size={14} />
// //                               {order.orderTime}
// //                             </div>
// //                           </div>
// //                         </div>

// //                         <div className="text-right">
// //                           <div className="text-2xl font-bold">
// //                             ₹{order.grandTotal}
// //                           </div>
// //                           <div className="text-sm text-gray-600">
// //                             {order.prepTime
// //                               ? `${order.prepTime} mins prep`
// //                               : "Not started"}
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Order Items */}
// //                       <div className="mt-4">
// //                         <div className="text-sm font-semibold mb-2">
// //                           Order Items ({order.items.length})
// //                         </div>
// //                         <div className="space-y-2">
// //                           {order.items.map((item) => (
// //                             <div
// //                               key={item.id}
// //                               className="flex justify-between items-center p-2 bg-gray-50 rounded-lg"
// //                             >
// //                               <div className="flex items-center gap-3">
// //                                 {getItemStatusIcon(item.status)}
// //                                 <div>
// //                                   <div className="font-medium">
// //                                     {item.quantity}x {item.name}
// //                                   </div>
// //                                   <div className="text-xs text-gray-600">
// //                                     {item.station} • {item.time} mins
// //                                   </div>
// //                                 </div>
// //                               </div>
// //                               <div className="flex items-center gap-3">
// //                                 <div className="text-right">
// //                                   <div className="font-bold">
// //                                     ₹{item.quantity * item.price}
// //                                   </div>
// //                                   <div
// //                                     className={`text-xs px-2 py-1 rounded ${getItemStatusColor(
// //                                       item.status
// //                                     )}`}
// //                                   >
// //                                     {item.status}
// //                                   </div>
// //                                 </div>
// //                                 {order.status === "preparing" &&
// //                                   item.status === "preparing" && (
// //                                     <button
// //                                       onClick={(e) => {
// //                                         e.stopPropagation();
// //                                         markItemReady(
// //                                           selectedTable,
// //                                           order.id,
// //                                           item.id
// //                                         );
// //                                       }}
// //                                       className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
// //                                     >
// //                                       Ready
// //                                     </button>
// //                                   )}
// //                               </div>
// //                             </div>
// //                           ))}
// //                         </div>
// //                       </div>

// //                       {/* Order Summary */}
// //                       <div className="mt-4 p-3 bg-gray-50 rounded-lg">
// //                         <div className="flex justify-between text-sm">
// //                           <span>Subtotal:</span>
// //                           <span>₹{order.total}</span>
// //                         </div>
// //                         {order.discount > 0 && (
// //                           <div className="flex justify-between text-sm text-green-600">
// //                             <span>Discount:</span>
// //                             <span>-₹{order.discount}</span>
// //                           </div>
// //                         )}
// //                         <div className="flex justify-between text-sm">
// //                           <span>Tax (10%):</span>
// //                           <span>₹{order.tax}</span>
// //                         </div>
// //                         <div className="flex justify-between font-bold mt-1 pt-2 border-t">
// //                           <span>Grand Total:</span>
// //                           <span>₹{order.grandTotal}</span>
// //                         </div>
// //                       </div>

// //                       {/* Action Buttons */}
// //                       <div className="mt-4 flex gap-2">
// //                         {order.status === "pending" && (
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               acceptOrder(selectedTable, order.id);
// //                             }}
// //                             className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-2 rounded-lg font-medium"
// //                           >
// //                             Accept Order
// //                           </button>
// //                         )}

// //                         {order.status === "preparing" && (
// //                           <button
// //                             onClick={(e) => {
// //                               e.stopPropagation();
// //                               markOrderServed(selectedTable, order.id);
// //                             }}
// //                             className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg font-medium"
// //                           >
// //                             Mark as Served
// //                           </button>
// //                         )}

// //                         {order.status === "served" &&
// //                           order.paymentStatus === "pending" && (
// //                             <button
// //                               onClick={(e) => {
// //                                 e.stopPropagation();
// //                                 completeOrder(selectedTable, order.id);
// //                               }}
// //                               className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2 rounded-lg font-medium"
// //                             >
// //                               Complete Payment
// //                             </button>
// //                           )}

// //                         <button
// //                           onClick={(e) => {
// //                             e.stopPropagation();
// //                             printReceipt(order);
// //                           }}
// //                           className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
// //                         >
// //                           <Printer size={18} />
// //                         </button>
// //                       </div>
// //                     </div>
// //                   ))}
// //                 </div>
// //               ) : (
// //                 <div className="text-center py-12">
// //                   <Table className="mx-auto h-16 w-16 text-gray-300" />
// //                   <h3 className="mt-4 text-xl font-semibold">No Orders</h3>
// //                   <p className="mt-1 text-gray-600">
// //                     This table has no active orders
// //                   </p>
// //                   <button
// //                     onClick={() => addNewOrder(selectedTable)}
// //                     className="mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-2 rounded-lg hover:opacity-90"
// //                   >
// //                     Create First Order
// //                   </button>
// //                 </div>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Kitchen Display - Full Width */}
// //         <KitchenDisplay />
// //       </div>
// //     </div>
// //   );
// // }

// import React from "react";

// const page = () => {
//   return <div>mkoijn</div>;
// };

// export default page;





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
