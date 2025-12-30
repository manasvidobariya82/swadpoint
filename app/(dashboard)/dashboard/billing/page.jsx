// app/billing/payments/page.jsx
"use client";

import { useState, useEffect } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  Search,
  Filter,
  Download,
  Printer,
  Eye,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  Clock,
  IndianRupee,
  CreditCard,
  Smartphone,
  QrCode,
  BarChart3,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  Package,
  Bell,
  Zap,
  Shield,
  Lock,
  RefreshCw,
  Plus,
  MoreVertical,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

// Sample transactions data
const INITIAL_TRANSACTIONS = [
  {
    id: "TRX-001",
    orderId: "ORD-2024-001",
    customerName: "Rahul Sharma",
    tableNo: "T12",
    amount: 1250.0,
    paymentMethod: "Google Pay",
    status: "success",
    timestamp: "2024-01-15 14:30:45",
    transactionId: "GP00123456789",
    items: ["Paneer Butter Masala", "Garlic Naan", "Coke"],
    tip: 50.0,
    discount: 100.0,
  },
  {
    id: "TRX-002",
    orderId: "ORD-2024-002",
    customerName: "Priya Patel",
    tableNo: "T05",
    amount: 850.0,
    paymentMethod: "PhonePe",
    status: "success",
    timestamp: "2024-01-15 13:15:22",
    transactionId: "PP9876543210",
    items: ["Chicken Biryani", "Raita"],
    tip: 0.0,
    discount: 0.0,
  },
  {
    id: "TRX-003",
    orderId: "ORD-2024-003",
    customerName: "Amit Kumar",
    tableNo: "T08",
    amount: 2200.0,
    paymentMethod: "Cash",
    status: "success",
    timestamp: "2024-01-15 12:45:18",
    transactionId: "CASH001",
    items: ["Butter Chicken", "Dal Makhani", "Roti Basket", "Ice Cream"],
    tip: 100.0,
    discount: 150.0,
  },
  {
    id: "TRX-004",
    orderId: "ORD-2024-004",
    customerName: "Neha Gupta",
    tableNo: "T03",
    amount: 650.0,
    paymentMethod: "Google Pay",
    status: "failed",
    timestamp: "2024-01-15 11:20:33",
    transactionId: "GP00987654321",
    items: ["Masala Dosa", "Filter Coffee"],
    tip: 0.0,
    discount: 0.0,
  },
  {
    id: "TRX-005",
    orderId: "ORD-2024-005",
    customerName: "Vikram Singh",
    tableNo: "T15",
    amount: 1800.0,
    paymentMethod: "PhonePe",
    status: "pending",
    timestamp: "2024-01-15 10:55:12",
    transactionId: "PP1234567890",
    items: ["Tandoori Platter", "Butter Naan", "Lassi"],
    tip: 0.0,
    discount: 200.0,
  },
  {
    id: "TRX-006",
    orderId: "ORD-2024-006",
    customerName: "Sonia Mehta",
    tableNo: "T07",
    amount: 3200.0,
    paymentMethod: "Google Pay",
    status: "success",
    timestamp: "2024-01-14 20:15:45",
    transactionId: "GP00567891234",
    items: ["Family Meal Deal", "Mocktails", "Dessert Platter"],
    tip: 200.0,
    discount: 300.0,
  },
  {
    id: "TRX-007",
    orderId: "ORD-2024-007",
    customerName: "Rajesh Nair",
    tableNo: "T11",
    amount: 950.0,
    paymentMethod: "PhonePe",
    status: "success",
    timestamp: "2024-01-14 19:30:22",
    transactionId: "PP4567891230",
    items: ["Fish Curry", "Steamed Rice", "Salad"],
    tip: 50.0,
    discount: 0.0,
  },
  {
    id: "TRX-008",
    orderId: "ORD-2024-008",
    customerName: "Anjali Reddy",
    tableNo: "T04",
    amount: 1400.0,
    paymentMethod: "Cash",
    status: "success",
    timestamp: "2024-01-14 18:45:11",
    transactionId: "CASH002",
    items: ["Paneer Tikka", "Butter Naan", "Cold Coffee"],
    tip: 0.0,
    discount: 100.0,
  },
];

// Payment methods configuration
const PAYMENT_METHODS = [
  {
    id: "google_pay",
    name: "Google Pay",
    type: "upi_based",
    icon: "GPay",
    isActive: true,
    isConfigured: true,
    commission: 1.5, // percentage
    minAmount: 1,
    maxAmount: 100000,
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=restaurant@icici&pn=Spice%20Kitchen&mc=5812",
    successRate: 98.5,
    dailyLimit: 50000,
    color: "#5f6368",
  },
  {
    id: "phonepe",
    name: "PhonePe",
    type: "upi_based",
    icon: "PhonePe",
    isActive: true,
    isConfigured: true,
    commission: 1.5,
    minAmount: 1,
    maxAmount: 100000,
    qrCode:
      "https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=restaurant@ybl&pn=Spice%20Kitchen&mc=5812",
    successRate: 99.2,
    dailyLimit: 75000,
    color: "#5f27cd",
  },
  {
    id: "cash",
    name: "Cash",
    type: "cash",
    icon: "Cash",
    isActive: true,
    isConfigured: true,
    commission: 0,
    minAmount: 1,
    maxAmount: 50000,
    qrCode: null,
    successRate: 100,
    dailyLimit: null,
    color: "#10b981",
  },
  {
    id: "card",
    name: "Card Payment",
    type: "card",
    icon: "Card",
    isActive: false,
    isConfigured: false,
    commission: 2.5,
    minAmount: 10,
    maxAmount: 100000,
    qrCode: null,
    successRate: 97.8,
    dailyLimit: 100000,
    color: "#3b82f6",
  },
];

export default function RestaurantBillingPayment() {
  // State management
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS);
  const [filteredTransactions, setFilteredTransactions] =
    useState(INITIAL_TRANSACTIONS);
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMethod, setSelectedMethod] = useState("All");
  const [selectedDate, setSelectedDate] = useState("");
  const [showRefundModal, setShowRefundModal] = useState(false);
  const [showSettlementModal, setShowSettlementModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showPaymentConfig, setShowPaymentConfig] = useState(false);
  const [activeTab, setActiveTab] = useState("transactions");

  // Filter transactions
  useEffect(() => {
    let filtered = [...transactions];

    if (searchTerm) {
      filtered = filtered.filter(
        (txn) =>
          txn.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((txn) => txn.status === selectedStatus);
    }

    if (selectedMethod !== "All") {
      filtered = filtered.filter((txn) => txn.paymentMethod === selectedMethod);
    }

    if (selectedDate) {
      filtered = filtered.filter((txn) =>
        txn.timestamp.startsWith(selectedDate)
      );
    }

    setFilteredTransactions(filtered);
  }, [searchTerm, selectedStatus, selectedMethod, selectedDate, transactions]);

  // Calculate dashboard stats
  const calculateStats = () => {
    const today = new Date().toISOString().split("T")[0];
    const todayTransactions = transactions.filter((txn) =>
      txn.timestamp.startsWith(today)
    );

    const totalRevenue = transactions
      .filter((txn) => txn.status === "success")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const todayRevenue = todayTransactions
      .filter((txn) => txn.status === "success")
      .reduce((sum, txn) => sum + txn.amount, 0);

    const averageOrderValue =
      transactions.length > 0
        ? totalRevenue /
          transactions.filter((txn) => txn.status === "success").length
        : 0;

    const successRate =
      transactions.length > 0
        ? (transactions.filter((txn) => txn.status === "success").length /
            transactions.length) *
          100
        : 0;

    // Payment method distribution
    const methodDistribution = {};
    transactions
      .filter((txn) => txn.status === "success")
      .forEach((txn) => {
        methodDistribution[txn.paymentMethod] =
          (methodDistribution[txn.paymentMethod] || 0) + txn.amount;
      });

    return {
      totalRevenue,
      todayRevenue,
      totalTransactions: transactions.length,
      todayTransactions: todayTransactions.length,
      successRate,
      averageOrderValue,
      methodDistribution,
    };
  };

  const stats = calculateStats();

  // Handle refund
  const handleRefund = (transactionId) => {
    const txn = transactions.find((t) => t.id === transactionId);
    setSelectedTransaction(txn);
    setShowRefundModal(true);
  };

  // Process refund
  const processRefund = () => {
    if (!selectedTransaction) return;

    toast.success(
      `Refund of ₹${selectedTransaction.amount} initiated for ${selectedTransaction.customerName}`
    );

    // In real app, this would call an API
    setTransactions((prev) =>
      prev.map((txn) =>
        txn.id === selectedTransaction.id
          ? { ...txn, status: "refunded", refundedAt: new Date().toISOString() }
          : txn
      )
    );

    setShowRefundModal(false);
    setSelectedTransaction(null);
  };

  // Handle settlement
  const handleSettlement = () => {
    setShowSettlementModal(true);
  };

  // Process settlement
  const processSettlement = () => {
    toast.success("Daily settlement processed successfully!");

    // In real app, this would transfer funds from payment gateway to bank
    const settlementData = {
      date: new Date().toISOString().split("T")[0],
      totalAmount: stats.todayRevenue,
      gatewayCharges: stats.todayRevenue * 0.015, // 1.5% charges
      netAmount: stats.todayRevenue * 0.985,
      transactions: filteredTransactions.filter(
        (txn) =>
          txn.status === "success" &&
          txn.timestamp.startsWith(new Date().toISOString().split("T")[0])
      ),
    };

    // Save settlement record (in real app, send to API)
    console.log("Settlement:", settlementData);

    setShowSettlementModal(false);
  };

  // Export transactions
  const exportTransactions = () => {
    const csvContent = [
      [
        "Order ID",
        "Customer",
        "Amount",
        "Method",
        "Status",
        "Date",
        "Transaction ID",
      ],
      ...filteredTransactions.map((txn) => [
        txn.orderId,
        txn.customerName,
        txn.amount,
        txn.paymentMethod,
        txn.status,
        txn.timestamp,
        txn.transactionId,
      ]),
    ]
      .map((row) => row.join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();

    toast.success("Transactions exported successfully!");
  };

  // Print receipt
  const printReceipt = (transactionId) => {
    const txn = transactions.find((t) => t.id === transactionId);

    const printWindow = window.open("", "_blank");
    printWindow.document.write(`
      <html>
        <head>
          <title>Receipt - ${txn.orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 30px; }
            .restaurant-name { font-size: 24px; font-weight: bold; margin-bottom: 5px; }
            .address { font-size: 12px; color: #666; margin-bottom: 20px; }
            .receipt-info { margin-bottom: 20px; }
            .items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .items th, .items td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 18px; }
            .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="restaurant-name">Spice Kitchen</div>
            <div class="address">123 Food Street, Restaurant City</div>
            <div class="address">GSTIN: 29ABCDE1234F1Z5</div>
          </div>
          
          <div class="receipt-info">
            <p><strong>Order ID:</strong> ${txn.orderId}</p>
            <p><strong>Customer:</strong> ${txn.customerName}</p>
            <p><strong>Table:</strong> ${txn.tableNo}</p>
            <p><strong>Date:</strong> ${txn.timestamp}</p>
            <p><strong>Transaction ID:</strong> ${txn.transactionId}</p>
          </div>
          
          <table class="items">
            <thead>
              <tr>
                <th>Item</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${txn.items
                .map(
                  (item) => `
                <tr>
                  <td>${item}</td>
                  <td>₹${(txn.amount / txn.items.length).toFixed(2)}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div style="text-align: right;">
            <p>Subtotal: ₹${(txn.amount + txn.discount - txn.tip).toFixed(
              2
            )}</p>
            ${
              txn.discount > 0
                ? `<p>Discount: -₹${txn.discount.toFixed(2)}</p>`
                : ""
            }
            ${txn.tip > 0 ? `<p>Tip: +₹${txn.tip.toFixed(2)}</p>` : ""}
            <p class="total">Total: ₹${txn.amount.toFixed(2)}</p>
            <p><strong>Payment Method:</strong> ${txn.paymentMethod}</p>
            <p><strong>Status:</strong> ${txn.status.toUpperCase()}</p>
          </div>
          
          <div class="footer">
            <p>Thank you for dining with us!</p>
            <p>Contact: +91 9876543210 | www.spicekitchen.com</p>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.print();
  };

  // Toggle payment method
  const togglePaymentMethod = (methodId) => {
    setPaymentMethods((prev) =>
      prev.map((method) =>
        method.id === methodId
          ? { ...method, isActive: !method.isActive }
          : method
      )
    );

    const method = paymentMethods.find((m) => m.id === methodId);
    toast.success(
      `${method.name} ${!method.isActive ? "activated" : "deactivated"}`
    );
  };

  // Generate payment insights
  const getPaymentInsights = () => {
    const insights = [];

    // Peak hours insight
    const hourCounts = {};
    transactions.forEach((txn) => {
      const hour = new Date(txn.timestamp).getHours();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
    });

    const peakHour = Object.entries(hourCounts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];
    insights.push({
      type: "peak",
      message: `Peak transaction hour: ${peakHour}:00 - ${
        parseInt(peakHour) + 1
      }:00`,
    });

    // Most used payment method
    const methodCounts = {};
    transactions.forEach((txn) => {
      methodCounts[txn.paymentMethod] =
        (methodCounts[txn.paymentMethod] || 0) + 1;
    });

    const popularMethod = Object.entries(methodCounts).reduce((a, b) =>
      b[1] > a[1] ? b : a
    )[0];
    insights.push({
      type: "popular",
      message: `${popularMethod} is the most used payment method`,
    });

    // Failed transactions insight
    const failedTransactions = transactions.filter(
      (txn) => txn.status === "failed"
    );
    if (failedTransactions.length > 0) {
      insights.push({
        type: "warning",
        message: `${failedTransactions.length} failed transactions need attention`,
      });
    }

    return insights;
  };

  const insights = getPaymentInsights();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🍽️ Restaurant Billing & Payments
              </h1>
              <p className="mt-2 text-gray-600">
                Manage transactions, payments, and settlements
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSettlement}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <CreditCard className="w-5 h-5" />
                Daily Settlement
              </button>

              <button
                onClick={exportTransactions}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all"
              >
                <Download className="w-5 h-5" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "transactions"
                  ? "bg-white border border-gray-200 border-b-0 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4" />
                Transactions
              </div>
            </button>

            <button
              onClick={() => setActiveTab("methods")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "methods"
                  ? "bg-white border border-gray-200 border-b-0 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                Payment Methods
              </div>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`px-4 py-3 font-medium text-sm rounded-t-lg transition-colors ${
                activeTab === "analytics"
                  ? "bg-white border border-gray-200 border-b-0 text-blue-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Analytics
              </div>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.totalRevenue.toLocaleString()}
                </p>
                <p className="text-sm text-green-600 mt-1 flex items-center">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  Today: ₹{stats.todayRevenue.toLocaleString()}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-100 to-blue-50 rounded-xl">
                <IndianRupee className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Transactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalTransactions}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Today: {stats.todayTransactions}
                </p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-100 to-green-50 rounded-xl">
                <CreditCard className="w-8 h-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.successRate.toFixed(1)}%
                </p>
                <p className="text-sm text-gray-600 mt-1">Payment processing</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-100 to-purple-50 rounded-xl">
                <CheckCircle className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{stats.averageOrderValue.toFixed(2)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Per transaction</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-amber-100 to-amber-50 rounded-xl">
                <BarChart3 className="w-8 h-8 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Insights */}
        {insights.length > 0 && (
          <div className="mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-amber-500" />
                Payment Insights
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {insights.map((insight, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          insight.type === "warning"
                            ? "bg-red-100 text-red-600"
                            : insight.type === "peak"
                            ? "bg-blue-100 text-blue-600"
                            : "bg-green-100 text-green-600"
                        }`}
                      >
                        {insight.type === "warning" ? (
                          <AlertTriangle className="w-5 h-5" />
                        ) : insight.type === "peak" ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <TrendingUp className="w-5 h-5" />
                        )}
                      </div>
                      <p className="text-gray-800">{insight.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === "transactions" && (
          <div>
            {/* Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="success">Success</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>

                <select
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={selectedMethod}
                  onChange={(e) => setSelectedMethod(e.target.value)}
                >
                  <option value="All">All Methods</option>
                  <option value="Google Pay">Google Pay</option>
                  <option value="PhonePe">PhonePe</option>
                  <option value="Cash">Cash</option>
                  <option value="Card">Card</option>
                </select>

                <input
                  type="date"
                  className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-gray-900">
                    Recent Transactions ({filteredTransactions.length})
                  </h3>
                  <div className="text-sm text-gray-500">
                    Last updated: {new Date().toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment Method
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredTransactions.map((txn) => (
                      <tr
                        key={txn.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div>
                            <div className="font-medium text-gray-900">
                              {txn.customerName}
                            </div>
                            <div className="text-sm text-gray-500">
                              Order: {txn.orderId}
                            </div>
                            <div className="text-xs text-gray-400">
                              Table: {txn.tableNo}
                            </div>
                            <div className="text-xs text-gray-400 mt-1">
                              {txn.items.slice(0, 2).join(", ")}
                              {txn.items.length > 2 &&
                                ` +${txn.items.length - 2} more`}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-gray-900">
                            ₹{txn.amount.toFixed(2)}
                          </div>
                          {txn.tip > 0 && (
                            <div className="text-xs text-green-600">
                              Tip: ₹{txn.tip.toFixed(2)}
                            </div>
                          )}
                          {txn.discount > 0 && (
                            <div className="text-xs text-blue-600">
                              Discount: ₹{txn.discount.toFixed(2)}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <div
                              className={`p-2 rounded-lg ${
                                txn.paymentMethod === "Google Pay"
                                  ? "bg-blue-100 text-blue-600"
                                  : txn.paymentMethod === "PhonePe"
                                  ? "bg-purple-100 text-purple-600"
                                  : "bg-green-100 text-green-600"
                              }`}
                            >
                              <Smartphone className="w-4 h-4" />
                            </div>
                            <span className="font-medium">
                              {txn.paymentMethod}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {txn.transactionId}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              txn.status === "success"
                                ? "bg-green-100 text-green-800 border border-green-200"
                                : txn.status === "pending"
                                ? "bg-yellow-100 text-yellow-800 border border-yellow-200"
                                : txn.status === "failed"
                                ? "bg-red-100 text-red-800 border border-red-200"
                                : "bg-gray-100 text-gray-800 border border-gray-200"
                            }`}
                          >
                            {txn.status === "success" && (
                              <CheckCircle className="w-4 h-4 mr-1" />
                            )}
                            {txn.status === "failed" && (
                              <XCircle className="w-4 h-4 mr-1" />
                            )}
                            {txn.status === "pending" && (
                              <Clock className="w-4 h-4 mr-1" />
                            )}
                            {txn.status.charAt(0).toUpperCase() +
                              txn.status.slice(1)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {new Date(txn.timestamp).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(txn.timestamp).toLocaleTimeString()}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button
                              onClick={() => printReceipt(txn.id)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Print Receipt"
                            >
                              <Printer className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                // View details
                                toast.success(
                                  `Viewing details for ${txn.orderId}`
                                );
                              }}
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="View Details"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            {txn.status === "success" && (
                              <button
                                onClick={() => handleRefund(txn.id)}
                                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                title="Refund"
                              >
                                <RefreshCw className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No transactions found
                    </h3>
                    <p className="text-gray-500">
                      Try adjusting your search or filters
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Methods Tab */}
        {activeTab === "methods" && (
          <div className="space-y-8">
            {/* Payment Methods List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="p-3 rounded-xl"
                        style={{ backgroundColor: method.color + "20" }}
                      >
                        <Smartphone style={{ color: method.color }} size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">
                          {method.name}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                            {method.type}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              method.isActive && method.isConfigured
                                ? "bg-green-100 text-green-800"
                                : method.isConfigured
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {method.isActive && method.isConfigured
                              ? "Active"
                              : method.isConfigured
                              ? "Inactive"
                              : "Not Configured"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => togglePaymentMethod(method.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full ${
                        method.isActive ? "bg-green-500" : "bg-gray-300"
                      } ${
                        !method.isConfigured && "opacity-50 cursor-not-allowed"
                      }`}
                      disabled={!method.isConfigured}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-all ${
                          method.isActive ? "translate-x-6" : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Commission</p>
                      <p className="font-bold text-gray-900">
                        {method.commission}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Success Rate</p>
                      <p className="font-bold text-gray-900">
                        {method.successRate}%
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Min Amount</p>
                      <p className="font-bold text-gray-900">
                        ₹{method.minAmount}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-xl">
                      <p className="text-xs text-gray-500">Max Amount</p>
                      <p className="font-bold text-gray-900">
                        ₹{method.maxAmount.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {method.qrCode && (
                    <div className="mb-6">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        QR Code for Payment
                      </p>
                      <div className="bg-white border border-gray-200 rounded-xl p-4 inline-block">
                        <img
                          src={method.qrCode}
                          alt={`${method.name} QR Code`}
                          className="w-32 h-32"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      {method.dailyLimit && (
                        <p className="text-xs text-gray-500">
                          Daily Limit: ₹{method.dailyLimit.toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setShowPaymentConfig(true);
                          // In real app, open configuration for this method
                        }}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all"
                      >
                        {method.isConfigured ? "Settings" : "Configure"}
                      </button>

                      {method.isActive && (
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-all">
                          Test Payment
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Payment Security Info */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Payment Security & Compliance
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    PCI DSS Compliant
                  </h4>
                  <p className="text-sm text-gray-600">
                    All card payments are PCI DSS Level 1 compliant
                  </p>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-xl border border-blue-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Secure Encryption
                  </h4>
                  <p className="text-sm text-gray-600">
                    256-bit SSL encryption for all transactions
                  </p>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                  <h4 className="font-bold text-gray-900 mb-2">
                    Fraud Protection
                  </h4>
                  <p className="text-sm text-gray-600">
                    Real-time fraud detection and prevention
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="space-y-8">
            {/* Payment Method Distribution */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Payment Method Distribution
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="space-y-4">
                    {Object.entries(stats.methodDistribution).map(
                      ([method, amount]) => {
                        const percentage = (amount / stats.totalRevenue) * 100;
                        return (
                          <div
                            key={method}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  method === "Google Pay"
                                    ? "bg-blue-500"
                                    : method === "PhonePe"
                                    ? "bg-purple-500"
                                    : "bg-green-500"
                                }`}
                              ></div>
                              <span className="font-medium text-gray-700">
                                {method}
                              </span>
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="w-32 bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full ${
                                    method === "Google Pay"
                                      ? "bg-blue-500"
                                      : method === "PhonePe"
                                      ? "bg-purple-500"
                                      : "bg-green-500"
                                  }`}
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="font-bold text-gray-900 w-20 text-right">
                                {percentage.toFixed(1)}%
                              </span>
                            </div>
                          </div>
                        );
                      }
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6">
                  <h4 className="font-bold text-gray-900 mb-4">Quick Stats</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transactions</span>
                      <span className="font-bold">
                        {stats.totalTransactions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Success Rate</span>
                      <span className="font-bold text-green-600">
                        {stats.successRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Avg Transaction Time
                      </span>
                      <span className="font-bold">8.5 seconds</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Chargeback Rate</span>
                      <span className="font-bold text-green-600">0.2%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hourly Transaction Volume */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Hourly Transaction Volume
              </h3>
              <div className="flex items-end h-48 gap-2">
                {[
                  10, 25, 40, 60, 85, 95, 100, 85, 70, 55, 40, 30, 25, 35, 50,
                  75, 90, 95, 85, 70, 55, 40, 30, 20,
                ].map((height, hour) => (
                  <div key={hour} className="flex-1 flex flex-col items-center">
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-300 rounded-t"
                      style={{ height: `${height}%` }}
                    ></div>
                    <div className="text-xs text-gray-500 mt-2">{hour}:00</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settlement Summary */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-6">
                Daily Settlement Summary
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Transactions
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Total Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Gateway Charges
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Net Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      {
                        date: "2024-01-15",
                        transactions: 45,
                        total: 125450,
                        charges: 1881.75,
                        net: 123568.25,
                        status: "pending",
                      },
                      {
                        date: "2024-01-14",
                        transactions: 38,
                        total: 98750,
                        charges: 1481.25,
                        net: 97268.75,
                        status: "completed",
                      },
                      {
                        date: "2024-01-13",
                        transactions: 52,
                        total: 145200,
                        charges: 2178,
                        net: 143022,
                        status: "completed",
                      },
                      {
                        date: "2024-01-12",
                        transactions: 41,
                        total: 112300,
                        charges: 1684.5,
                        net: 110615.5,
                        status: "completed",
                      },
                    ].map((settlement, idx) => (
                      <tr key={idx}>
                        <td className="px-4 py-3 text-sm">{settlement.date}</td>
                        <td className="px-4 py-3 text-sm font-medium">
                          {settlement.transactions}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ₹{settlement.total.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm">
                          ₹{settlement.charges.toLocaleString()}
                        </td>
                        <td className="px-4 py-3 text-sm font-bold">
                          ₹{settlement.net.toLocaleString()}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              settlement.status === "completed"
                                ? "bg-green-100 text-green-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {settlement.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Refund Modal */}
        {showRefundModal && selectedTransaction && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Process Refund
                </h3>

                <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="font-bold text-red-800">
                      Refund Details
                    </span>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Customer:</span>
                      <span className="font-medium">
                        {selectedTransaction.customerName}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Order ID:</span>
                      <span className="font-medium">
                        {selectedTransaction.orderId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-bold text-red-600">
                        ₹{selectedTransaction.amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Payment Method:</span>
                      <span className="font-medium">
                        {selectedTransaction.paymentMethod}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Refund Reason
                  </label>
                  <select className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500">
                    <option value="">Select reason...</option>
                    <option value="customer_request">Customer Request</option>
                    <option value="order_cancelled">Order Cancelled</option>
                    <option value="quality_issue">Quality Issue</option>
                    <option value="duplicate_charge">Duplicate Charge</option>
                  </select>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Notes (Optional)
                  </label>
                  <textarea
                    className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Add any additional notes..."
                  />
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowRefundModal(false)}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processRefund}
                    className="px-6 py-3 bg-gradient-to-r from-red-600 to-orange-600 text-white rounded-xl hover:shadow-lg"
                  >
                    Process Refund
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Settlement Modal */}
        {showSettlementModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Daily Settlement
                </h3>
                <p className="text-gray-600 mb-6">
                  Transfer funds from payment gateways to your bank account
                </p>

                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6 mb-6 border border-green-200">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date:</span>
                      <span className="font-medium">
                        {new Date().toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Transactions:</span>
                      <span className="font-medium">
                        {stats.todayTransactions}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Gross Amount:</span>
                      <span className="font-bold">
                        ₹{stats.todayRevenue.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">
                        Gateway Charges (1.5%):
                      </span>
                      <span className="font-bold text-red-600">
                        -₹{(stats.todayRevenue * 0.015).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t border-green-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600 font-bold">
                          Net Settlement:
                        </span>
                        <span className="text-2xl font-bold text-green-600">
                          ₹{(stats.todayRevenue * 0.985).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Account
                  </label>
                  <div className="bg-gray-50 p-4 rounded-xl">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">HDFC Bank •••• 4321</p>
                        <p className="text-sm text-gray-500">
                          Spice Kitchen Restaurant
                        </p>
                      </div>
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3">
                  <button
                    onClick={() => setShowSettlementModal(false)}
                    className="px-6 py-3 text-gray-700 border border-gray-300 rounded-xl hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={processSettlement}
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:shadow-lg flex items-center gap-2"
                  >
                    <CreditCard className="w-5 h-5" />
                    Initiate Settlement
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
