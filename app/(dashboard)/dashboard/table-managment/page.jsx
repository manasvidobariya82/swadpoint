"use client";

import { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import { toast, Toaster } from "react-hot-toast";
import { Printer, Download, Copy, Trash2, ExternalLink } from "lucide-react";

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");

  const STORAGE_KEY = "table-qr-codes";

  // 🔥 CHANGE THIS IF YOUR IP IS DIFFERENT
  const BASE_URL = "/";

  // Load saved tables
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      setTables(JSON.parse(saved));
    }
  }, []);

  // Save automatically
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tables));
  }, [tables]);

  const addTable = () => {
    if (!tableNo) {
      toast.error("Enter table number");
      return;
    }

    if (tables.some((t) => t.tableNo === tableNo)) {
      toast.error("Table already exists");
      return;
    }

    const menuUrl = `${BASE_URL}/menu?table=${tableNo}`;

    const newTable = {
      id: Date.now().toString(),
      tableNo,
      qrUrl: menuUrl,
    };

    setTables([...tables, newTable]);
    setTableNo("");
    toast.success("QR Generated");
  };

  const deleteTable = (id) => {
    setTables(tables.filter((t) => t.id !== id));
    toast.success("Deleted");
  };

  const copyURL = (url) => {
    navigator.clipboard.writeText(url);
    toast.success("Copied");
  };

  const openMenu = (url) => {
    window.open(url, "_blank");
  };

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <Toaster position="top-right" />

      <h1 className="text-3xl font-bold mb-6 text-center">Table QR System</h1>

      {/* Add Table */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <div className="flex gap-4">
          <input
            type="number"
            placeholder="Enter Table Number"
            value={tableNo}
            onChange={(e) => setTableNo(e.target.value)}
            className="flex-1 border px-4 py-2 rounded-lg"
          />

          <button
            onClick={addTable}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Generate QR
          </button>
        </div>

        <p className="text-sm text-gray-500 mt-3">
          QR will open: {BASE_URL}/menu?table=TABLE_NUMBER
        </p>
      </div>

      {/* QR Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {tables.map((table) => (
          <div key={table.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">Table {table.tableNo}</h2>
              <button
                onClick={() => deleteTable(table.id)}
                className="text-red-600"
              >
                <Trash2 size={18} />
              </button>
            </div>

            <div className="flex justify-center mb-4">
              <QRCode value={table.qrUrl} size={180} id={`qr-${table.id}`} />
            </div>

            <div className="text-xs break-all bg-gray-100 p-2 rounded mb-4">
              {table.qrUrl}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => copyURL(table.qrUrl)}
                className="flex items-center justify-center gap-1 bg-gray-200 p-2 rounded"
              >
                <Copy size={14} /> Copy
              </button>

              <button
                onClick={() => openMenu(table.qrUrl)}
                className="flex items-center justify-center gap-1 bg-green-500 text-white p-2 rounded"
              >
                <ExternalLink size={14} /> Test
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
