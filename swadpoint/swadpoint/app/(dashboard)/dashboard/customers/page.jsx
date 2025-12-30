"use client";

import { useMemo, useState } from "react";

/* ================== MAIN COMPONENT ================== */
export default function Page() {
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [entries, setEntries] = useState(10);
  const [page, setPage] = useState(1);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  /* -------- Add Customer Form -------- */
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    loyalty: "",
    food: "Veg",
    rating: 0,
    status: "Active",
  });

  /* -------- Add Customer -------- */
  const handleAdd = () => {
    if (!form.name || !form.mobile) return;

    setCustomers((prev) => [
      {
        id: prev.length + 1,
        visit: Math.floor(Math.random() * 10) + 1,
        orders: Math.floor(Math.random() * 20),
        createdAt: new Date().toISOString().split("T")[0],
        ...form,
      },
      ...prev,
    ]);

    setForm({
      name: "",
      mobile: "",
      email: "",
      loyalty: "",
      food: "Veg",
      rating: 0,
      status: "Active",
    });

    setIsAddOpen(false);
  };

  /* -------- Search Filter -------- */
  const filtered = useMemo(() => {
    return customers.filter(
      (c) =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.mobile.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );
  }, [customers, search]);

  /* -------- Pagination -------- */
  const totalPages = Math.max(1, Math.ceil(filtered.length / entries));
  const paginated = filtered.slice((page - 1) * entries, page * entries);

  /* -------- Export CSV -------- */
  const exportCSV = () => {
    const csv =
      "ID,Name,Mobile,Email,Visits,Orders,Loyalty,Food,Rating,Status\n" +
      customers
        .map(
          (c) =>
            `${c.id},${c.name},${c.mobile},${c.email},${c.visit},${c.orders},${c.loyalty},${c.food},${c.rating},${c.status}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "customers.csv";
    a.click();
  };

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4">
        <h1 className="text-xl font-semibold">Customer Management</h1>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="rounded-full border px-4 py-2 text-sm hover:bg-gray-100"
          >
            Export
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="rounded-full bg-black px-5 py-2 text-sm text-white"
          >
            + Add Customer
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search customer..."
        className="h-11 w-72 rounded-lg border px-4 text-sm outline-none focus:ring-2 focus:ring-black"
      />

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-t">
          <thead className="border-b bg-gray-50">
            <tr className="text-left">
              <th className="py-3">ID</th>
              <th>Name</th>
              <th>Mobile</th>
              <th>Visits</th>
              <th>Orders</th>
              <th>Loyalty</th>
              <th>Food</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {paginated.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-10 text-center text-gray-400">
                  No Customers Found
                </td>
              </tr>
            ) : (
              paginated.map((c) => (
                <tr key={c.id} className="border-b hover:bg-gray-50">
                  <td className="py-3">{c.id}</td>
                  <td>{c.name}</td>
                  <td>{c.mobile}</td>
                  <td>{c.visit}</td>
                  <td>{c.orders}</td>
                  <td>{c.loyalty || 0}</td>
                  <td>{c.food}</td>
                  <td>
                    <span
                      className={`rounded-full px-3 py-1 text-xs ${
                        c.status === "Active"
                          ? "bg-green-100 text-green-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                  <td
                    onClick={() => {
                      setSelected(c);
                      setIsViewOpen(true);
                    }}
                    className="cursor-pointer text-blue-600"
                  >
                    View
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center text-sm">
        <span>
          Showing {paginated.length} of {filtered.length}
        </span>
        <div className="flex border rounded-md overflow-hidden">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 disabled:opacity-40"
          >
            Prev
          </button>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="border-l px-4 py-2 disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>

      {/* Add Modal */}
      {isAddOpen && (
        <Modal title="Add Customer" onClose={() => setIsAddOpen(false)}>
          <Input
            placeholder="Full Name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />
          <Input
            placeholder="Mobile Number"
            value={form.mobile}
            onChange={(v) => setForm({ ...form, mobile: v })}
          />
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
          />
          <Input
            placeholder="Loyalty Points"
            value={form.loyalty}
            onChange={(v) => setForm({ ...form, loyalty: v })}
          />

          <select
            value={form.food}
            onChange={(e) => setForm({ ...form, food: e.target.value })}
            className="w-full mb-2 rounded border px-3 py-2 text-sm"
          >
            <option>Veg</option>
            <option>Non-Veg</option>
          </select>

          <StarRating
            value={form.rating}
            onChange={(v) => setForm({ ...form, rating: v })}
          />

          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="w-full mb-2 rounded border px-3 py-2 text-sm"
          >
            <option>Active</option>
            <option>Blocked</option>
          </select>

          <button
            onClick={handleAdd}
            className="mt-4 w-full rounded bg-black py-2 text-white"
          >
            Save Customer
          </button>
        </Modal>
      )}

      {/* View Modal */}
      {isViewOpen && selected && (
        <Modal title="Customer Details" onClose={() => setIsViewOpen(false)}>
          {Object.entries(selected).map(([k, v]) => (
            <p key={k} className="text-sm">
              <b>{k}:</b> {v}
            </p>
          ))}
        </Modal>
      )}
    </div>
  );
}

/* ================== REUSABLE ================== */

const Modal = ({ title, children, onClose }) => (
  <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
    <div className="w-[420px] bg-white rounded-xl p-6">
      <h2 className="mb-4 text-lg font-semibold">{title}</h2>
      {children}
      <button onClick={onClose} className="mt-4 w-full rounded border py-2">
        Close
      </button>
    </div>
  </div>
);

const Input = ({ placeholder, value, onChange }) => (
  <input
    placeholder={placeholder}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="mb-2 w-full rounded border px-3 py-2 text-sm"
  />
);

const StarRating = ({ value, onChange }) => (
  <div className="mb-3 flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <span
        key={i}
        onClick={() => onChange(i)}
        className={`cursor-pointer text-xl ${
          i <= value ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ))}
  </div>
);
