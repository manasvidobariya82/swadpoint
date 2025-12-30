
// "use client";

// import { useState } from "react";

// export default function TableReservationPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [entries, setEntries] = useState(10);
//   const [search, setSearch] = useState("");
//   const [view, setView] = useState("table"); // table | calendar

//   const [editId, setEditId] = useState(null);
//   const [data, setData] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     date: "",
//     time: "",
//     guests: "",
//     status: "Confirmed",
//   });

//   // ================= SAVE / UPDATE =================
//   const handleSave = () => {
//     if (!form.name || !form.mobile || !form.date || !form.time) {
//       alert("Please fill all fields");
//       return;
//     }

//     if (editId) {
//       setData((prev) =>
//         prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
//       );
//     } else {
//       setData([
//         {
//           id: `TR-${Math.floor(Math.random() * 9000)}`,
//           ...form,
//         },
//         ...data,
//       ]);
//     }

//     sendWhatsApp(form);
//     resetForm();
//   };

//   const resetForm = () => {
//     setForm({
//       name: "",
//       mobile: "",
//       date: "",
//       time: "",
//       guests: "",
//       status: "Confirmed",
//     });
//     setEditId(null);
//     setShowModal(false);
//   };

//   // ================= ACTIONS =================
//   const handleEdit = (row) => {
//     setForm(row);
//     setEditId(row.id);
//     setShowModal(true);
//   };

//   const handleCancel = (id) => {
//     setData((prev) =>
//       prev.map((d) => (d.id === id ? { ...d, status: "Cancelled" } : d))
//     );
//   };

//   // ================= WHATSAPP =================
//   const sendWhatsApp = (r) => {
//     const msg = `Hello ${r.name}, your table is ${r.status} on ${r.date} at ${r.time} for ${r.guests} guests.`;
//     window.open(
//       `https://wa.me/91${r.mobile}?text=${encodeURIComponent(msg)}`,
//       "_blank"
//     );
//   };

//   // ================= FILTER =================
//   const filteredData = data
//     .filter(
//       (d) =>
//         d.name.toLowerCase().includes(search.toLowerCase()) ||
//         d.mobile.includes(search)
//     )
//     .slice(0, entries);

//   const statusStyle = {
//     Confirmed: "bg-green-100 text-green-700",
//     Pending: "bg-yellow-100 text-yellow-700",
//     Cancelled: "bg-red-100 text-red-700",
//   };

//   // ================= CALENDAR =================
//   const groupedByDate = data.reduce((acc, r) => {
//     acc[r.date] = acc[r.date] || [];
//     acc[r.date].push(r);
//     return acc;
//   }, {});

//   return (
//     <div className="bg-[#f5f6f8] min-h-screen p-4 md:p-6">
//       {/* HEADER */}
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Table Reservation</h2>
//         <div className="flex gap-2">
//           <button
//             onClick={() => setView(view === "table" ? "calendar" : "table")}
//             className="px-4 py-2 border rounded-lg text-sm"
//           >
//             {view === "table" ? "📅 Calendar View" : "📋 Table View"}
//           </button>
//           <button
//             onClick={() => setShowModal(true)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//           >
//             + Reservation
//           </button>
//         </div>
//       </div>

//       {/* ================= TABLE VIEW ================= */}
//       {view === "table" && (
//         <div className="bg-white rounded-2xl p-6 shadow-sm">
//           <input
//             placeholder="Search name or mobile"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             className="mb-4 w-full px-4 py-2 border rounded-lg"
//           />

//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-gray-600">
//                 <th>ID</th>
//                 <th>Name</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Guests</th>
//                 <th>Status</th>
//                 <th>Actions</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="7" className="py-10 text-center text-gray-500">
//                     No Data
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row) => (
//                   <tr key={row.id} className="border-b">
//                     <td>{row.id}</td>
//                     <td>{row.name}</td>
//                     <td>{row.date}</td>
//                     <td>{row.time}</td>
//                     <td>{row.guests}</td>
//                     <td>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs ${
//                           statusStyle[row.status]
//                         }`}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                     <td className="flex gap-2 py-2">
//                       <button
//                         onClick={() => handleEdit(row)}
//                         className="text-blue-600 text-xs"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleCancel(row.id)}
//                         className="text-red-600 text-xs"
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         onClick={() => sendWhatsApp(row)}
//                         className="text-green-600 text-xs"
//                       >
//                         WhatsApp
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* ================= CALENDAR VIEW ================= */}
//       {view === "calendar" && (
//         <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
//           {Object.keys(groupedByDate).length === 0 ? (
//             <p className="text-gray-500">No reservations</p>
//           ) : (
//             Object.entries(groupedByDate).map(([date, list]) => (
//               <div key={date} className="border rounded-xl p-4">
//                 <p className="font-semibold mb-2">{date}</p>
//                 {list.map((r) => (
//                   <p key={r.id} className="text-sm text-gray-600">
//                     {r.time} • {r.name}
//                   </p>
//                 ))}
//               </div>
//             ))
//           )}
//         </div>
//       )}

//       {/* ================= MODAL ================= */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
//           <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-3">
//             <h3 className="font-semibold text-lg">
//               {editId ? "Edit Reservation" : "Add Reservation"}
//             </h3>

//             {["name", "mobile", "date", "time", "guests"].map((f) => (
//               <input
//                 key={f}
//                 type={f === "date" || f === "time" ? f : "text"}
//                 placeholder={f}
//                 value={form[f]}
//                 onChange={(e) => setForm({ ...form, [f]: e.target.value })}
//                 className="border w-full px-4 py-2 rounded-lg"
//               />
//             ))}

//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 onClick={resetForm}
//                 className="px-4 py-2 border rounded-lg"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//               >
//                 Save
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


"use client";

import { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  Phone,
  Edit,
  Trash2,
  MessageCircle,
  CheckCircle,
  XCircle,
  Clock4,
  Search,
  Filter,
  Download,
  Printer,
} from "lucide-react";

export default function TableReservationPage() {
  // ================= STATE =================
  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("table"); // table | calendar
  const [editId, setEditId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [notification, setNotification] = useState(null);

  const [data, setData] = useState([
    {
      id: "TR-1001",
      name: "John Smith",
      mobile: "9876543210",
      date: "2024-12-25",
      time: "19:30",
      guests: "4",
      status: "Confirmed",
      notes: "Window seat preferred",
      email: "john@example.com",
      createdAt: "2024-12-20",
    },
    {
      id: "TR-1002",
      name: "Emma Wilson",
      mobile: "8765432109",
      date: "2024-12-26",
      time: "20:00",
      guests: "2",
      status: "Pending",
      notes: "Anniversary celebration",
      email: "emma@example.com",
      createdAt: "2024-12-21",
    },
    {
      id: "TR-1003",
      name: "Robert Brown",
      mobile: "7654321098",
      date: "2024-12-24",
      time: "18:00",
      guests: "6",
      status: "Cancelled",
      notes: "Family dinner",
      email: "robert@example.com",
      createdAt: "2024-12-19",
    },
  ]);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    date: "",
    time: "",
    guests: "2",
    status: "Confirmed",
    notes: "",
  });

  // ================= LOCALSTORAGE =================
  useEffect(() => {
    const savedData = localStorage.getItem("tableReservations");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tableReservations", JSON.stringify(data));
  }, [data]);

  // ================= NOTIFICATION =================
  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // ================= SAVE / UPDATE =================
  const handleSave = () => {
    const requiredFields = ["name", "mobile", "date", "time"];
    const missingFields = requiredFields.filter((field) => !form[field].trim());

    if (missingFields.length > 0) {
      showNotification(`Please fill: ${missingFields.join(", ")}`, "error");
      return;
    }

    if (editId) {
      setData((prev) =>
        prev.map((d) =>
          d.id === editId
            ? {
                ...d,
                ...form,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : d
        )
      );
      showNotification("Reservation updated successfully!");
    } else {
      const newId = `TR-${1000 + data.length + 1}`;
      const newReservation = {
        id: newId,
        ...form,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setData([newReservation, ...data]);
      showNotification("Reservation added successfully!");

      // Auto-send WhatsApp confirmation
      if (form.status === "Confirmed") {
        setTimeout(() => sendWhatsApp({ ...newReservation, id: newId }), 1000);
      }
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      mobile: "",
      email: "",
      date: "",
      time: "",
      guests: "2",
      status: "Confirmed",
      notes: "",
    });
    setEditId(null);
    setShowModal(false);
  };

  // ================= ACTIONS =================
  const handleEdit = (row) => {
    setForm(row);
    setEditId(row.id);
    setShowModal(true);
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete reservation for ${name}?`)) {
      setData((prev) => prev.filter((d) => d.id !== id));
      showNotification("Reservation deleted!", "error");
    }
  };

  const updateStatus = (id, newStatus) => {
    setData((prev) =>
      prev.map((d) =>
        d.id === id
          ? {
              ...d,
              status: newStatus,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : d
      )
    );
    showNotification(`Status changed to ${newStatus}`);

    const reservation = data.find((d) => d.id === id);
    if (newStatus === "Confirmed" && reservation) {
      sendWhatsApp({ ...reservation, status: newStatus });
    }
  };

  // ================= WHATSAPP =================
  const sendWhatsApp = (r) => {
    const message = `Hello ${r.name}! Your table reservation is ${
      r.status
    } on ${r.date} at ${r.time} for ${r.guests} guests. ${
      r.notes ? `Notes: ${r.notes}` : ""
    }`;
    window.open(
      `https://wa.me/91${r.mobile}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // ================= FILTER & SEARCH =================
  const filteredData = data.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.mobile.includes(search) ||
      d.email.toLowerCase().includes(search.toLowerCase()) ||
      d.id.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = filterStatus === "all" || d.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // ================= STATS =================
  const stats = {
    total: data.length,
    confirmed: data.filter((d) => d.status === "Confirmed").length,
    pending: data.filter((d) => d.status === "Pending").length,
    cancelled: data.filter((d) => d.status === "Cancelled").length,
  };

  // ================= STATUS STYLES =================
  const statusConfig = {
    Confirmed: {
      bg: "bg-emerald-50",
      text: "text-emerald-700",
      border: "border-emerald-200",
      icon: <CheckCircle size={14} />,
    },
    Pending: {
      bg: "bg-amber-50",
      text: "text-amber-700",
      border: "border-amber-200",
      icon: <Clock4 size={14} />,
    },
    Cancelled: {
      bg: "bg-rose-50",
      text: "text-rose-700",
      border: "border-rose-200",
      icon: <XCircle size={14} />,
    },
  };

  // ================= EXPORT =================
  const exportData = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      ["ID,Name,Mobile,Email,Date,Time,Guests,Status,Notes,Created At"]
        .concat(
          data.map(
            (d) =>
              `"${d.id}","${d.name}","${d.mobile}","${d.email}","${d.date}","${d.time}","${d.guests}","${d.status}","${d.notes}","${d.createdAt}"`
          )
        )
        .join("\n");

    const link = document.createElement("a");
    link.href = encodeURI(csvContent);
    link.download = "reservations.csv";
    link.click();

    showNotification("Data exported successfully!");
  };

  // ================= PRINT =================
  const printReservations = () => {
    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Reservation Report</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            h1 { color: #1e40af; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
            th { background-color: #f8fafc; }
            .confirmed { color: green; }
            .pending { color: orange; }
            .cancelled { color: red; }
          </style>
        </head>
        <body>
          <h1>Table Reservation Report</h1>
          <p>Generated: ${new Date().toLocaleDateString()}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Name</th><th>Date</th><th>Time</th>
                <th>Guests</th><th>Status</th><th>Contact</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (d) => `
                <tr>
                  <td>${d.id}</td>
                  <td>${d.name}</td>
                  <td>${d.date}</td>
                  <td>${d.time}</td>
                  <td>${d.guests}</td>
                  <td class="${d.status.toLowerCase()}">${d.status}</td>
                  <td>${d.mobile}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      {/* NOTIFICATION */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg transition-all duration-300 ${
            notification.type === "error" ? "bg-rose-600" : "bg-emerald-600"
          } text-white`}
        >
          {notification.message}
        </div>
      )}

      {/* HEADER */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Table Reservations
            </h1>
            <p className="text-slate-600 mt-1">
              Manage and track all table bookings
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setView(view === "table" ? "calendar" : "table")}
              className="px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-white hover:shadow-md transition-all flex items-center gap-2"
            >
              {view === "table" ? <Calendar size={18} /> : <Filter size={18} />}
              <span>{view === "table" ? "Calendar View" : "Table View"}</span>
            </button>

            <button
              onClick={exportData}
              className="px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-white hover:shadow-md transition-all flex items-center gap-2"
            >
              <Download size={18} />
              <span>Export</span>
            </button>

            <button
              onClick={printReservations}
              className="px-4 py-2.5 border border-slate-300 rounded-xl hover:bg-white hover:shadow-md transition-all flex items-center gap-2"
            >
              <Printer size={18} />
              <span>Print</span>
            </button>

            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-all flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <span className="text-lg">+</span>
              <span>New Reservation</span>
            </button>
          </div>
        </div>

        {/* STATS CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Total Bookings",
              value: stats.total,
              color: "bg-blue-100 text-blue-700",
              icon: "📋",
            },
            {
              label: "Confirmed",
              value: stats.confirmed,
              color: "bg-emerald-100 text-emerald-700",
              icon: "✅",
            },
            {
              label: "Pending",
              value: stats.pending,
              color: "bg-amber-100 text-amber-700",
              icon: "⏳",
            },
            {
              label: "Cancelled",
              value: stats.cancelled,
              color: "bg-rose-100 text-rose-700",
              icon: "❌",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-slate-600 text-sm mb-1">{stat.label}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH & FILTER */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name, mobile, email or ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="flex gap-2">
              {["all", "Confirmed", "Pending", "Cancelled"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-3 rounded-xl font-medium transition-all ${
                    filterStatus === status
                      ? "bg-blue-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {status === "all" ? "All" : status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ================= TABLE VIEW ================= */}
        {view === "table" && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            {filteredData.length === 0 ? (
              <div className="py-20 text-center">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">
                  No reservations found
                </h3>
                <p className="text-slate-500">
                  Try adjusting your search or add a new reservation
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200">
                      <th className="text-left p-5 font-semibold text-slate-700">
                        Details
                      </th>
                      <th className="text-left p-5 font-semibold text-slate-700">
                        Date & Time
                      </th>
                      <th className="text-left p-5 font-semibold text-slate-700">
                        Guests
                      </th>
                      <th className="text-left p-5 font-semibold text-slate-700">
                        Status
                      </th>
                      <th className="text-left p-5 font-semibold text-slate-700">
                        Actions
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredData.map((row) => {
                      const status = statusConfig[row.status];
                      return (
                        <tr
                          key={row.id}
                          className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                        >
                          <td className="p-5">
                            <div>
                              <p className="font-semibold text-slate-800">
                                {row.name}
                              </p>
                              <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                                <Phone size={14} />
                                {row.mobile}
                              </p>
                              <p className="text-xs text-slate-500 mt-1">
                                {row.email}
                              </p>
                              <p className="text-xs text-slate-400 mt-2">
                                ID: {row.id}
                              </p>
                              {row.notes && (
                                <p className="text-xs text-slate-500 mt-2 italic">
                                  "{row.notes}"
                                </p>
                              )}
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="flex items-center gap-2 text-slate-700 mb-1">
                              <Calendar size={16} />
                              <span className="font-medium">{row.date}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                              <Clock size={16} />
                              <span>{row.time}</span>
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="flex items-center gap-2 text-slate-700">
                              <Users size={20} />
                              <span className="text-lg font-bold">
                                {row.guests}
                              </span>
                              <span className="text-sm text-slate-500">
                                guests
                              </span>
                            </div>
                          </td>

                          <td className="p-5">
                            <div
                              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${status.bg} ${status.text} ${status.border}`}
                            >
                              {status.icon}
                              <span className="font-medium">{row.status}</span>
                            </div>

                            <div className="flex gap-2 mt-3">
                              {["Confirmed", "Pending", "Cancelled"].map(
                                (s) => (
                                  <button
                                    key={s}
                                    onClick={() => updateStatus(row.id, s)}
                                    className={`text-xs px-3 py-1 rounded-lg ${
                                      row.status === s
                                        ? "bg-blue-100 text-blue-700"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                    }`}
                                  >
                                    {s === "Confirmed"
                                      ? "✓"
                                      : s === "Pending"
                                      ? "⏳"
                                      : "✗"}
                                  </button>
                                )
                              )}
                            </div>
                          </td>

                          <td className="p-5">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleEdit(row)}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg transition-colors"
                              >
                                <Edit size={16} />
                                Edit
                              </button>

                              <button
                                onClick={() => sendWhatsApp(row)}
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded-lg transition-colors"
                              >
                                <MessageCircle size={16} />
                                WhatsApp
                              </button>

                              <button
                                onClick={() => handleDelete(row.id, row.name)}
                                className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 hover:bg-rose-100 rounded-lg transition-colors"
                              >
                                <Trash2 size={16} />
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ================= CALENDAR VIEW ================= */}
        {view === "calendar" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(
              filteredData.reduce((acc, r) => {
                acc[r.date] = acc[r.date] || [];
                acc[r.date].push(r);
                return acc;
              }, {})
            ).map(([date, reservations]) => (
              <div
                key={date}
                className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">{date}</h3>
                  <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-sm">
                    {reservations.length} booking
                    {reservations.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="space-y-3">
                  {reservations.map((r) => {
                    const status = statusConfig[r.status];
                    return (
                      <div
                        key={r.id}
                        className="border border-slate-200 rounded-xl p-4 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-800">
                              {r.name}
                            </p>
                            <p className="text-sm text-slate-600 mt-1 flex items-center gap-1">
                              <Clock size={14} />
                              {r.time} • <Users size={14} className="ml-2" />{" "}
                              {r.guests} guests
                            </p>
                          </div>
                          <div
                            className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm ${status.bg} ${status.text}`}
                          >
                            {status.icon}
                            <span>{r.status}</span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-3">
                          <button
                            onClick={() => sendWhatsApp(r)}
                            className="text-xs px-3 py-1 bg-emerald-50 text-emerald-700 rounded-lg"
                          >
                            Message
                          </button>
                          <button
                            onClick={() => handleEdit(r)}
                            className="text-xs px-3 py-1 bg-blue-50 text-blue-700 rounded-lg"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ================= MODAL ================= */}
        {showModal && (
          <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white p-6 border-b border-slate-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-800">
                    {editId ? "Edit Reservation" : "New Reservation"}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      placeholder="John Smith"
                      value={form.name}
                      onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      value={form.mobile}
                      onChange={(e) =>
                        setForm({ ...form, mobile: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@example.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Status
                    </label>
                    <select
                      value={form.status}
                      onChange={(e) =>
                        setForm({ ...form, status: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    >
                      <option value="Confirmed">Confirmed</option>
                      <option value="Pending">Pending</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Date *
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Time *
                    </label>
                    <input
                      type="time"
                      value={form.time}
                      onChange={(e) =>
                        setForm({ ...form, time: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Number of Guests
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 4, 6, 8, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() =>
                          setForm({ ...form, guests: num.toString() })
                        }
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          form.guests === num.toString()
                            ? "bg-blue-600 text-white"
                            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                        }`}
                      >
                        {num} {num === 1 ? "Guest" : "Guests"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Special Notes
                  </label>
                  <textarea
                    placeholder="Any special requests or notes..."
                    value={form.notes}
                    onChange={(e) =>
                      setForm({ ...form, notes: e.target.value })
                    }
                    rows="3"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="sticky bottom-0 bg-white p-6 border-t border-slate-200">
                <div className="flex justify-end gap-3">
                  <button
                    onClick={resetForm}
                    className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-md hover:shadow-lg"
                  >
                    {editId ? "Update Reservation" : "Save Reservation"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}