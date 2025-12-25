// "use client";

// import { useState } from "react";

// export default function TableReservationPage() {
//   const [showModal, setShowModal] = useState(false);
//   const [entries, setEntries] = useState(10);
//   const [search, setSearch] = useState("");

//   const [data, setData] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     mobile: "",
//     date: "",
//     time: "",
//     guests: "",
//     status: "Confirmed",
//   });

//   const handleSave = () => {
//     if (!form.name || !form.mobile || !form.date || !form.time) {
//       alert("Please fill all fields");
//       return;
//     }

//     setData([
//       {
//         id: `TR-${Math.floor(Math.random() * 9000)}`,
//         ...form,
//       },
//       ...data,
//     ]);

//     setForm({
//       name: "",
//       mobile: "",
//       date: "",
//       time: "",
//       guests: "",
//       status: "Confirmed",
//     });
//     setShowModal(false);
//   };

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

//   return (
//     <div className="bg-[#f5f6f8] min-h-screen p-4 md:p-6">
//       {/* FILTER BAR */}
//       <div className="bg-white rounded-2xl p-4 md:p-5 flex flex-col lg:flex-row gap-3 items-center shadow-sm">
//         <input
//           placeholder="Name or Mobile"
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//           className="w-full lg:flex-1 px-4 py-2.5 rounded-xl border text-sm focus:ring-2 focus:ring-blue-500"
//         />

//         <input
//           type="date"
//           className="w-full lg:flex-1 px-4 py-2.5 rounded-xl border text-sm"
//         />

//         <input
//           type="date"
//           className="w-full lg:flex-1 px-4 py-2.5 rounded-xl border text-sm"
//         />

//         <div className="flex gap-2">
//           <button className="bg-black text-white px-6 py-2.5 rounded-full text-sm">
//             Search
//           </button>
//           <button
//             onClick={() => setSearch("")}
//             className="bg-gray-100 px-6 py-2.5 rounded-full text-sm"
//           >
//             Reset
//           </button>
//         </div>
//       </div>

//       {/* TABLE CARD */}
//       <div className="bg-white rounded-2xl mt-6 p-6 shadow-sm">
//         {/* HEADER */}
//         <div className="flex justify-between items-center border-b pb-4">
//           <h2 className="text-lg font-semibold">Table Reservation</h2>

//           <button
//             onClick={() => setShowModal(true)}
//             className="text-blue-600 font-semibold"
//           >
//             + Table Reservation
//           </button>
//         </div>

//         {/* SHOW ENTRIES */}
//         <div className="flex items-center gap-2 mt-6 text-sm">
//           <span>Show</span>
//           <select
//             value={entries}
//             onChange={(e) => setEntries(Number(e.target.value))}
//             className="border rounded-lg px-2 py-1"
//           >
//             <option>10</option>
//             <option>25</option>
//             <option>50</option>
//           </select>
//           <span>Entries</span>
//         </div>

//         {/* TABLE */}
//         <div className="overflow-x-auto mt-4">
//           <table className="w-full text-sm">
//             <thead>
//               <tr className="border-b text-gray-600">
//                 <th className="py-3 text-left">Reservation ID</th>
//                 <th>Name</th>
//                 <th>Date</th>
//                 <th>Time</th>
//                 <th>Guests</th>
//                 <th>Status</th>
//               </tr>
//             </thead>

//             <tbody>
//               {filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="py-12 text-center text-gray-500">
//                     No Table Reservation Data Available
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((row) => (
//                   <tr
//                     key={row.id}
//                     className="border-b hover:bg-gray-50 transition"
//                   >
//                     <td className="py-3">{row.id}</td>
//                     <td>{row.name}</td>
//                     <td>{row.date}</td>
//                     <td>{row.time}</td>
//                     <td>{row.guests}</td>
//                     <td>
//                       <span
//                         className={`px-3 py-1 rounded-full text-xs font-medium ${
//                           statusStyle[row.status]
//                         }`}
//                       >
//                         {row.status}
//                       </span>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* FOOTER */}
//         <div className="flex justify-between items-center mt-6 text-sm text-gray-600">
//           <span>Showing {filteredData.length} entries</span>
//           <div className="flex gap-1">
//             <button className="border px-4 py-2 rounded hover:bg-gray-50">
//               Previous
//             </button>
//             <button className="border px-4 py-2 rounded hover:bg-gray-50">
//               Next
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ADD MODAL */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-2xl w-full max-w-md p-6 space-y-4">
//             <h3 className="text-lg font-semibold">Add Table Reservation</h3>

//             <input
//               placeholder="Name"
//               className="border w-full px-4 py-2 rounded-lg"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//             />

//             <input
//               placeholder="Mobile"
//               className="border w-full px-4 py-2 rounded-lg"
//               value={form.mobile}
//               onChange={(e) => setForm({ ...form, mobile: e.target.value })}
//             />

//             <input
//               type="date"
//               className="border w-full px-4 py-2 rounded-lg"
//               value={form.date}
//               onChange={(e) => setForm({ ...form, date: e.target.value })}
//             />

//             <input
//               type="time"
//               className="border w-full px-4 py-2 rounded-lg"
//               value={form.time}
//               onChange={(e) => setForm({ ...form, time: e.target.value })}
//             />

//             <input
//               type="number"
//               placeholder="Guests"
//               className="border w-full px-4 py-2 rounded-lg"
//               value={form.guests}
//               onChange={(e) => setForm({ ...form, guests: e.target.value })}
//             />

//             <div className="flex justify-end gap-3 pt-4">
//               <button
//                 onClick={() => setShowModal(false)}
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

import { useState } from "react";

export default function TableReservationPage() {
  const [showModal, setShowModal] = useState(false);
  const [entries, setEntries] = useState(10);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("table"); // table | calendar

  const [editId, setEditId] = useState(null);
  const [data, setData] = useState([]);

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    date: "",
    time: "",
    guests: "",
    status: "Confirmed",
  });

  // ================= SAVE / UPDATE =================
  const handleSave = () => {
    if (!form.name || !form.mobile || !form.date || !form.time) {
      alert("Please fill all fields");
      return;
    }

    if (editId) {
      setData((prev) =>
        prev.map((d) => (d.id === editId ? { ...d, ...form } : d))
      );
    } else {
      setData([
        {
          id: `TR-${Math.floor(Math.random() * 9000)}`,
          ...form,
        },
        ...data,
      ]);
    }

    sendWhatsApp(form);
    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      mobile: "",
      date: "",
      time: "",
      guests: "",
      status: "Confirmed",
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

  const handleCancel = (id) => {
    setData((prev) =>
      prev.map((d) => (d.id === id ? { ...d, status: "Cancelled" } : d))
    );
  };

  // ================= WHATSAPP =================
  const sendWhatsApp = (r) => {
    const msg = `Hello ${r.name}, your table is ${r.status} on ${r.date} at ${r.time} for ${r.guests} guests.`;
    window.open(
      `https://wa.me/91${r.mobile}?text=${encodeURIComponent(msg)}`,
      "_blank"
    );
  };

  // ================= FILTER =================
  const filteredData = data
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.mobile.includes(search)
    )
    .slice(0, entries);

  const statusStyle = {
    Confirmed: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Cancelled: "bg-red-100 text-red-700",
  };

  // ================= CALENDAR =================
  const groupedByDate = data.reduce((acc, r) => {
    acc[r.date] = acc[r.date] || [];
    acc[r.date].push(r);
    return acc;
  }, {});

  return (
    <div className="bg-[#f5f6f8] min-h-screen p-4 md:p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Table Reservation</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setView(view === "table" ? "calendar" : "table")}
            className="px-4 py-2 border rounded-lg text-sm"
          >
            {view === "table" ? "📅 Calendar View" : "📋 Table View"}
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Reservation
          </button>
        </div>
      </div>

      {/* ================= TABLE VIEW ================= */}
      {view === "table" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <input
            placeholder="Search name or mobile"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-4 w-full px-4 py-2 border rounded-lg"
          />

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th>ID</th>
                <th>Name</th>
                <th>Date</th>
                <th>Time</th>
                <th>Guests</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-10 text-center text-gray-500">
                    No Data
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="border-b">
                    <td>{row.id}</td>
                    <td>{row.name}</td>
                    <td>{row.date}</td>
                    <td>{row.time}</td>
                    <td>{row.guests}</td>
                    <td>
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${
                          statusStyle[row.status]
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="flex gap-2 py-2">
                      <button
                        onClick={() => handleEdit(row)}
                        className="text-blue-600 text-xs"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCancel(row.id)}
                        className="text-red-600 text-xs"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => sendWhatsApp(row)}
                        className="text-green-600 text-xs"
                      >
                        WhatsApp
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= CALENDAR VIEW ================= */}
      {view === "calendar" && (
        <div className="bg-white rounded-2xl p-6 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4">
          {Object.keys(groupedByDate).length === 0 ? (
            <p className="text-gray-500">No reservations</p>
          ) : (
            Object.entries(groupedByDate).map(([date, list]) => (
              <div key={date} className="border rounded-xl p-4">
                <p className="font-semibold mb-2">{date}</p>
                {list.map((r) => (
                  <p key={r.id} className="text-sm text-gray-600">
                    {r.time} • {r.name}
                  </p>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 space-y-3">
            <h3 className="font-semibold text-lg">
              {editId ? "Edit Reservation" : "Add Reservation"}
            </h3>

            {["name", "mobile", "date", "time", "guests"].map((f) => (
              <input
                key={f}
                type={f === "date" || f === "time" ? f : "text"}
                placeholder={f}
                value={form[f]}
                onChange={(e) => setForm({ ...form, [f]: e.target.value })}
                className="border w-full px-4 py-2 rounded-lg"
              />
            ))}

            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={resetForm}
                className="px-4 py-2 border rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
