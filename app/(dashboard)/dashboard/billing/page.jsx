"use client";

import { useEffect, useMemo, useState } from "react";
import QRCode from "react-qr-code";
import {
  getPaymentConfig,
  savePaymentConfig,
  getPayments,
} from "@/helper/storage";

const createUpiUrl = (upiId, payeeName, amount = 1) =>
  `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${Number(amount).toFixed(2)}&cu=INR`;

export default function BillingPage() {
  const [payments, setPayments] = useState([]);
  const [paymentConfig, setPaymentConfig] = useState({
    upiId: "swadpoint@upi",
    payeeName: "SwadPoint Restaurant",
  });
  const [statusFilter, setStatusFilter] = useState("All");

  const loadData = () => {
    const list = getPayments().sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
    setPayments(list);
    setPaymentConfig(getPaymentConfig());
  };

  useEffect(() => {
    loadData();

    const sync = (event) => {
      if (
        event.key === "restaurantPayments" ||
        event.key === "restaurantPaymentConfig"
      ) {
        loadData();
      }
    };

    window.addEventListener("storage", sync);
    return () => window.removeEventListener("storage", sync);
  }, []);

  const filteredPayments = useMemo(() => {
    if (statusFilter === "All") return payments;
    return payments.filter((payment) => payment.status === statusFilter);
  }, [payments, statusFilter]);

  const stats = useMemo(() => {
    const successPayments = payments.filter((payment) => payment.status === "success");
    const totalAmount = successPayments.reduce(
      (sum, payment) => sum + Number(payment.amount || 0),
      0
    );
    const today = new Date().toDateString();
    const todayAmount = successPayments
      .filter((payment) => new Date(payment.timestamp).toDateString() === today)
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    return {
      totalTransactions: payments.length,
      successTransactions: successPayments.length,
      totalAmount,
      todayAmount,
    };
  }, [payments]);

  const saveConfig = () => {
    const upiId = paymentConfig.upiId.trim();
    const payeeName = paymentConfig.payeeName.trim();

    if (!upiId || !payeeName) {
      alert("Please fill UPI ID and payee name.");
      return;
    }

    savePaymentConfig({ upiId, payeeName });
    alert("Payment QR config saved.");
  };

  const paymentQrUrl = useMemo(
    () => createUpiUrl(paymentConfig.upiId, paymentConfig.payeeName, 1),
    [paymentConfig]
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-xl bg-white p-6 shadow">
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="mt-1 text-sm text-gray-600">
            All users pay using this same restaurant QR. Every payment is listed
            below.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow lg:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Restaurant Payment QR Config
            </h2>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <input
                type="text"
                value={paymentConfig.upiId}
                onChange={(e) =>
                  setPaymentConfig((prev) => ({ ...prev, upiId: e.target.value }))
                }
                className="rounded-lg border px-3 py-2"
                placeholder="UPI ID (example: swadpoint@upi)"
              />
              <input
                type="text"
                value={paymentConfig.payeeName}
                onChange={(e) =>
                  setPaymentConfig((prev) => ({
                    ...prev,
                    payeeName: e.target.value,
                  }))
                }
                className="rounded-lg border px-3 py-2"
                placeholder="Payee name"
              />
            </div>
            <button
              onClick={saveConfig}
              className="mt-4 rounded-lg bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
            >
              Save Payment Settings
            </button>
          </div>

          <div className="rounded-xl bg-white p-6 shadow">
            <p className="text-sm font-medium text-gray-700">Active QR Preview</p>
            <div className="mt-3 flex justify-center rounded-lg border p-4">
              <QRCode value={paymentQrUrl} size={150} />
            </div>
            <p className="mt-2 break-all text-xs text-gray-600">
              UPI ID: {paymentConfig.upiId}
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Transactions</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              {stats.totalTransactions}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Successful</p>
            <p className="mt-1 text-2xl font-bold text-green-700">
              {stats.successTransactions}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Total Amount</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              Rs. {stats.totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow">
            <p className="text-sm text-gray-500">Today Amount</p>
            <p className="mt-1 text-2xl font-bold text-gray-900">
              Rs. {stats.todayAmount.toFixed(2)}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Transactions
            </h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-lg border px-3 py-2 text-sm"
            >
              <option value="All">All</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>
          </div>

          {filteredPayments.length === 0 ? (
            <p className="text-sm text-gray-500">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Payment ID
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Order
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Table
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Method
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Amount
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-3 py-2 text-left font-semibold text-gray-600">
                      Time
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredPayments.map((payment) => (
                    <tr key={payment.id}>
                      <td className="px-3 py-2 text-gray-700">{payment.id}</td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.orderId}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.tableNo || "NA"}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {payment.paymentMethod}
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        Rs. {Number(payment.amount || 0).toFixed(2)}
                      </td>
                      <td className="px-3 py-2">
                        <span
                          className={`rounded px-2 py-1 text-xs font-medium ${
                            payment.status === "success"
                              ? "bg-green-100 text-green-700"
                              : payment.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {payment.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-gray-700">
                        {new Date(payment.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
