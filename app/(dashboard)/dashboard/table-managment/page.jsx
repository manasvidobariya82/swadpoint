"use client";

import { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { toast, Toaster } from "react-hot-toast";
import { Copy, ExternalLink, Trash2 } from "lucide-react";
import { getTables, saveTables } from "@/helper/storage";

export default function TablesPage() {
  const [tables, setTables] = useState([]);
  const [tableNo, setTableNo] = useState("");
  const [baseUrl, setBaseUrl] = useState("");

  useEffect(() => {
    setBaseUrl(window.location.origin);
    setTables(getTables());
  }, []);

  const persistTables = (nextTables) => {
    setTables(nextTables);
    saveTables(nextTables);
  };

  const addTable = () => {
    const normalizedTable = tableNo.trim();
    if (!normalizedTable) {
      toast.error("Enter table number");
      return;
    }

    if (tables.some((table) => table.tableNo === normalizedTable)) {
      toast.error("Table already exists");
      return;
    }

    const qrUrl = `${baseUrl}/menu?table=${encodeURIComponent(
      normalizedTable
    )}`;

    const nextTables = [
      ...tables,
      {
        id: `table-${Date.now()}`,
        tableNo: normalizedTable,
        qrUrl,
        createdAt: new Date().toISOString(),
      },
    ];

    persistTables(nextTables);
    setTableNo("");
    toast.success("QR generated");
  };

  const deleteTable = (id) => {
    persistTables(tables.filter((table) => table.id !== id));
    toast.success("Table removed");
  };

  const copyURL = async (url) => {
    await navigator.clipboard.writeText(url);
    toast.success("QR URL copied");
  };

  const openMenu = (url) => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Table QR Management
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Each table gets a unique QR but opens the same restaurant menu.
        </p>

        <div className="mb-8 rounded-xl bg-white p-6 shadow">
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              type="text"
              placeholder="Enter table number (example: T1)"
              value={tableNo}
              onChange={(e) => setTableNo(e.target.value)}
              className="flex-1 rounded-lg border px-4 py-2"
            />
            <button
              onClick={addTable}
              className="rounded-lg bg-blue-600 px-6 py-2 font-medium text-white hover:bg-blue-700"
            >
              Generate QR
            </button>
          </div>

          <p className="mt-3 text-sm text-gray-500">
            QR URL format: {baseUrl || "https://your-domain.com"}/menu?table=
            TABLE_NO
          </p>
        </div>

        {tables.length === 0 ? (
          <div className="rounded-xl bg-white p-8 text-center text-gray-500 shadow">
            No table QR generated yet.
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tables.map((table) => (
              <div key={table.id} className="rounded-xl bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">
                    Table {table.tableNo}
                  </h2>
                  <button
                    onClick={() => deleteTable(table.id)}
                    className="text-red-600"
                    aria-label={`Delete table ${table.tableNo}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mb-4 flex justify-center rounded-lg border p-4">
                  <QRCode value={table.qrUrl} size={170} />
                </div>

                <div className="mb-4 break-all rounded bg-gray-100 p-2 text-xs text-gray-600">
                  {table.qrUrl}
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => copyURL(table.qrUrl)}
                    className="flex items-center justify-center gap-1 rounded bg-gray-200 p-2 text-sm font-medium text-gray-800 hover:bg-gray-300"
                  >
                    <Copy size={14} />
                    Copy
                  </button>
                  <button
                    onClick={() => openMenu(table.qrUrl)}
                    className="flex items-center justify-center gap-1 rounded bg-green-600 p-2 text-sm font-medium text-white hover:bg-green-700"
                  >
                    <ExternalLink size={14} />
                    Test
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
