// app/inventory/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Plus,
  Filter,
  AlertTriangle,
  CheckCircle,
  BarChart3,
  Download,
  RefreshCw,
  Package,
  Clock,
  TrendingDown,
  Bell,
  X,
  ShoppingBag,
  TrendingUp,
  Edit,
  Trash2,
  Eye,
  ArrowUpRight,
  MessageSquare,
  Zap,
} from "lucide-react";

// Initial inventory data with more items for better demonstration
const INITIAL_INVENTORY = [
  {
    id: 1,
    name: "Paneer",
    category: "Dairy",
    currentStock: 3,
    unit: "kg",
    minStock: 5,
    pricePerUnit: 320,
    lastUpdated: "2024-01-10",
    status: "critical",
    supplier: "Local Dairy",
    expiryDate: "2024-02-15",
    salesRate: 2.5,
    location: "Cold Storage A1",
    consumptionPerDay: 1.8,
  },
  {
    id: 2,
    name: "Chicken Breast",
    category: "Meat",
    currentStock: 2,
    unit: "kg",
    minStock: 10,
    pricePerUnit: 280,
    lastUpdated: "2024-01-10",
    status: "critical",
    supplier: "Fresh Poultry",
    expiryDate: "2024-01-18",
    salesRate: 4.2,
    location: "Freezer B2",
    consumptionPerDay: 3.5,
  },
  {
    id: 3,
    name: "Basmati Rice",
    category: "Grains",
    currentStock: 50,
    unit: "kg",
    minStock: 20,
    pricePerUnit: 120,
    lastUpdated: "2024-01-09",
    status: "normal",
    supplier: "Grain Supplies",
    expiryDate: "2024-12-01",
    salesRate: 3.8,
    location: "Storage Room C3",
    consumptionPerDay: 2.5,
  },
  {
    id: 4,
    name: "Tomatoes",
    category: "Vegetables",
    currentStock: 4,
    unit: "kg",
    minStock: 15,
    pricePerUnit: 40,
    lastUpdated: "2024-01-10",
    status: "critical",
    supplier: "Local Market",
    expiryDate: "2024-01-20",
    salesRate: 5.5,
    location: "Fresh Produce D4",
    consumptionPerDay: 7.2,
  },
  {
    id: 5,
    name: "Olive Oil",
    category: "Cooking Oil",
    currentStock: 1,
    unit: "liters",
    minStock: 10,
    pricePerUnit: 450,
    lastUpdated: "2024-01-08",
    status: "critical",
    supplier: "Oil Distributors",
    expiryDate: "2024-06-30",
    salesRate: 1.2,
    location: "Pantry E5",
    consumptionPerDay: 0.8,
  },
  {
    id: 6,
    name: "Wheat Flour",
    category: "Grains",
    currentStock: 8,
    unit: "kg",
    minStock: 25,
    pricePerUnit: 55,
    lastUpdated: "2024-01-07",
    status: "low",
    supplier: "Flour Mill",
    expiryDate: "2024-03-15",
    salesRate: 4.8,
    location: "Storage Room C3",
    consumptionPerDay: 3.2,
  },
  {
    id: 7,
    name: "Fresh Milk",
    category: "Dairy",
    currentStock: 20,
    unit: "liters",
    minStock: 12,
    pricePerUnit: 60,
    lastUpdated: "2024-01-11",
    status: "normal",
    supplier: "Local Dairy",
    expiryDate: "2024-01-14",
    salesRate: 8.5,
    location: "Cold Storage A1",
    consumptionPerDay: 9.1,
  },
  {
    id: 8,
    name: "Eggs",
    category: "Dairy",
    currentStock: 150,
    unit: "pieces",
    minStock: 80,
    pricePerUnit: 8,
    lastUpdated: "2024-01-11",
    status: "normal",
    supplier: "Local Farm",
    expiryDate: "2024-01-25",
    salesRate: 45,
    location: "Cold Storage A2",
    consumptionPerDay: 42,
  },
  {
    id: 9,
    name: "Butter",
    category: "Dairy",
    currentStock: 2,
    unit: "kg",
    minStock: 8,
    pricePerUnit: 500,
    lastUpdated: "2024-01-11",
    status: "critical",
    supplier: "Local Dairy",
    expiryDate: "2024-02-10",
    salesRate: 1.5,
    location: "Cold Storage A1",
    consumptionPerDay: 1.2,
  },
];

export default function InventoryPage() {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);
  const [filteredInventory, setFilteredInventory] = useState(INITIAL_INVENTORY);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [alerts, setAlerts] = useState([]);
  const [showAlerts, setShowAlerts] = useState(true);
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Vegetables",
    currentStock: 0,
    unit: "kg",
    minStock: 5,
    pricePerUnit: 0,
    supplier: "Local Market",
    expiryDate: "",
  });

  // Automatic stock status calculation and alerts
  const calculateStockStatus = (item) => {
    const stockPercentage = (item.currentStock / item.minStock) * 100;

    if (item.currentStock === 0) {
      return {
        status: "out-of-stock",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        message: "Out of Stock!",
        daysLeft: 0,
      };
    } else if (stockPercentage <= 25) {
      return {
        status: "critical",
        color: "bg-red-500",
        textColor: "text-red-700",
        bgColor: "bg-red-50",
        borderColor: "border-red-300",
        message: "Critical Stock!",
        daysLeft: Math.floor(item.currentStock / item.consumptionPerDay),
      };
    } else if (stockPercentage <= 50) {
      return {
        status: "low",
        color: "bg-orange-500",
        textColor: "text-orange-700",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        message: "Low Stock",
        daysLeft: Math.floor(item.currentStock / item.consumptionPerDay),
      };
    } else {
      return {
        status: "normal",
        color: "bg-green-500",
        textColor: "text-green-700",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        message: "Good",
        daysLeft: Math.floor(item.currentStock / item.consumptionPerDay),
      };
    }
  };

  // Generate automatic alerts
  const generateAlerts = () => {
    const newAlerts = [];

    inventory.forEach((item) => {
      const status = calculateStockStatus(item);

      if (status.status === "critical" || status.status === "out-of-stock") {
        newAlerts.push({
          id: item.id,
          type: "stock",
          severity: "high",
          title: `${item.name} Stock Alert!`,
          message: `${item.name} stock is ${item.currentStock} ${item.unit} (min: ${item.minStock} ${item.unit}). Only ${status.daysLeft} days left at current rate.`,
          action: `Order ${item.minStock * 2} ${item.unit} immediately`,
          itemName: item.name,
          currentStock: item.currentStock,
          minStock: item.minStock,
          unit: item.unit,
          timestamp: new Date().toLocaleTimeString(),
        });
      }

      // Check expiry within 3 days
      const expiryDate = new Date(item.expiryDate);
      const today = new Date();
      const diffDays = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

      if (diffDays <= 3 && diffDays > 0) {
        newAlerts.push({
          id: item.id,
          type: "expiry",
          severity: "medium",
          title: `${item.name} Expiring Soon!`,
          message: `${item.name} expires in ${diffDays} day${
            diffDays > 1 ? "s" : ""
          }`,
          action: "Use in next batch or mark for discount",
          itemName: item.name,
          expiryDate: item.expiryDate,
          daysLeft: diffDays,
          timestamp: new Date().toLocaleTimeString(),
        });
      }
    });

    // Add consumption pattern alerts
    const fastMovingItems = inventory
      .filter((item) => item.consumptionPerDay > 5)
      .sort((a, b) => b.consumptionPerDay - a.consumptionPerDay);

    if (fastMovingItems.length > 0) {
      newAlerts.push({
        id: "consumption-1",
        type: "consumption",
        severity: "low",
        title: "High Consumption Items",
        message: `${fastMovingItems[0].name} is moving fast (${fastMovingItems[0].consumptionPerDay} ${fastMovingItems[0].unit}/day)`,
        action: "Consider increasing stock levels",
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    setAlerts(newAlerts);
  };

  // Generate refill suggestions
  const getRefillSuggestions = () => {
    const suggestions = [];

    inventory.forEach((item) => {
      const status = calculateStockStatus(item);
      const daysLeft = Math.floor(item.currentStock / item.consumptionPerDay);

      if (status.status === "critical" || status.status === "out-of-stock") {
        const suggestedQty = Math.max(
          item.minStock * 2,
          Math.ceil(item.consumptionPerDay * 7) // Enough for 1 week
        );

        suggestions.push({
          itemId: item.id,
          itemName: item.name,
          currentStock: item.currentStock,
          minStock: item.minStock,
          suggestedQty,
          unit: item.unit,
          urgency: daysLeft <= 2 ? "URGENT" : "HIGH",
          supplier: item.supplier,
          reason: `Only ${daysLeft} day${
            daysLeft !== 1 ? "s" : ""
          } of stock left`,
        });
      } else if (status.status === "low") {
        const suggestedQty = Math.ceil(item.consumptionPerDay * 5); // Enough for 5 days

        suggestions.push({
          itemId: item.id,
          itemName: item.name,
          currentStock: item.currentStock,
          minStock: item.minStock,
          suggestedQty,
          unit: item.unit,
          urgency: "MEDIUM",
          supplier: item.supplier,
          reason: `Stock at ${Math.round(
            (item.currentStock / item.minStock) * 100
          )}% of minimum`,
        });
      }
    });

    return suggestions.sort((a, b) => {
      const urgencyOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2 };
      return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
    });
  };

  // Initialize alerts on component mount
  useEffect(() => {
    generateAlerts();
    const interval = setInterval(() => {
      generateAlerts();
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [inventory]);

  // Filter inventory
  useEffect(() => {
    let filtered = [...inventory];

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort by stock status (critical first)
    filtered.sort((a, b) => {
      const statusA = calculateStockStatus(a);
      const statusB = calculateStockStatus(b);
      const statusOrder = { "out-of-stock": 0, critical: 1, low: 2, normal: 3 };
      return statusOrder[statusA.status] - statusOrder[statusB.status];
    });

    setFilteredInventory(filtered);
  }, [selectedCategory, searchTerm, inventory]);

  // Calculate stats
  const calculateStats = () => {
    const criticalItems = inventory.filter(
      (item) =>
        calculateStockStatus(item).status === "critical" ||
        calculateStockStatus(item).status === "out-of-stock"
    );
    const lowItems = inventory.filter(
      (item) => calculateStockStatus(item).status === "low"
    );
    const totalValue = inventory.reduce(
      (sum, item) => sum + item.currentStock * item.pricePerUnit,
      0
    );

    return {
      totalItems: inventory.length,
      criticalItems: criticalItems.length,
      lowItems: lowItems.length,
      totalValue,
      alertsCount: alerts.length,
    };
  };

  const stats = calculateStats();
  const refillSuggestions = getRefillSuggestions();

  // Handle stock update
  const handleStockUpdate = (id, quantity) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              currentStock: Math.max(0, item.currentStock + quantity),
              lastUpdated: new Date().toISOString().split("T")[0],
            }
          : item
      )
    );
  };

  // Handle quick refill (auto refill to suggested quantity)
  const handleQuickRefill = (suggestion) => {
    const currentItem = inventory.find((item) => item.id === suggestion.itemId);
    const refillAmount = suggestion.suggestedQty - currentItem.currentStock;

    if (refillAmount > 0) {
      setInventory((prev) =>
        prev.map((item) =>
          item.id === suggestion.itemId
            ? {
                ...item,
                currentStock: suggestion.suggestedQty,
                lastUpdated: new Date().toISOString().split("T")[0],
              }
            : item
        )
      );

      // Remove alert for this item
      setAlerts((prev) =>
        prev.filter((alert) => alert.id !== suggestion.itemId)
      );
    }
  };

  // Add new item
  const handleAddItem = () => {
    const newId = Math.max(...inventory.map((item) => item.id)) + 1;
    const consumptionPerDay = Math.random() * 5 + 1; // Random consumption for demo

    const itemToAdd = {
      ...newItem,
      id: newId,
      consumptionPerDay,
      lastUpdated: new Date().toISOString().split("T")[0],
      salesRate: 0,
      location: "Storage",
    };

    setInventory((prev) => [...prev, itemToAdd]);
    setNewItem({
      name: "",
      category: "Vegetables",
      currentStock: 0,
      unit: "kg",
      minStock: 5,
      pricePerUnit: 0,
      supplier: "Local Market",
      expiryDate: "",
    });
    setShowAddModal(false);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header with Alerts */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                🚨 Smart Inventory Dashboard
              </h1>
              <p className="text-gray-600 mt-2 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500" />
                Real-time stock monitoring with automatic alerts
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <button
                  onClick={() => setShowAlerts(!showAlerts)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-xl hover:shadow-md transition-all"
                >
                  <Bell
                    className={`w-5 h-5 ${
                      alerts.length > 0
                        ? "text-red-500 animate-pulse"
                        : "text-gray-400"
                    }`}
                  />
                  <span className="font-medium">Alerts</span>
                  {alerts.length > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
                      {alerts.length}
                    </span>
                  )}
                </button>
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-5 h-5" />
                Add Item
              </button>
            </div>
          </div>
        </div>

        {/* ALERT BANNER - Prominent Red Alert */}
        {alerts.length > 0 && showAlerts && (
          <div className="mb-8 animate-fadeIn">
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-xl shadow-lg p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-red-100 rounded-xl">
                    <AlertTriangle className="w-8 h-8 text-red-600 animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-red-800 mb-2">
                      ⚠️ STOCK ALERT:{" "}
                      {alerts.filter((a) => a.severity === "high").length}{" "}
                      Critical Items Need Attention!
                    </h3>
                    <p className="text-red-700 mb-3">
                      {alerts.filter((a) => a.severity === "high").length} items
                      are critically low or out of stock. Immediate action
                      required to avoid business disruption.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {alerts
                        .filter((alert) => alert.severity === "high")
                        .slice(0, 3)
                        .map((alert) => (
                          <span
                            key={alert.id}
                            className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium"
                          >
                            {alert.itemName}
                          </span>
                        ))}
                      {alerts.filter((a) => a.severity === "high").length >
                        3 && (
                        <span className="px-3 py-1 bg-red-200 text-red-800 rounded-full text-sm font-medium">
                          +
                          {alerts.filter((a) => a.severity === "high").length -
                            3}{" "}
                          more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowAlerts(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.totalItems}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-xl">
                <Package className="w-8 h-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Items</p>
                <p className="text-3xl font-bold text-red-600">
                  {stats.criticalItems}
                </p>
                <p className="text-sm text-red-500 mt-1">
                  ⚠️ Immediate action needed
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-xl">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Low Stock Items</p>
                <p className="text-3xl font-bold text-orange-600">
                  {stats.lowItems}
                </p>
                <p className="text-sm text-orange-500 mt-1">
                  ⚠️ Monitor closely
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-xl">
                <TrendingDown className="w-8 h-8 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Alerts</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats.alertsCount}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-xl">
                <Bell className="w-8 h-8 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 AUTOMATIC REFILL SUGGESTIONS SECTION */}
        {refillSuggestions.length > 0 && (
          <div className="mb-8">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl shadow-lg p-6 border border-amber-200">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      🚚 Automatic Refill Suggestions
                    </h3>
                    <p className="text-gray-600">
                      AI recommends ordering these items immediately
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    // Auto-refill all critical items
                    refillSuggestions.forEach((suggestion) => {
                      if (suggestion.urgency === "URGENT") {
                        handleQuickRefill(suggestion);
                      }
                    });
                  }}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg transform hover:-translate-y-0.5 transition-all"
                >
                  <RefreshCw className="w-4 h-4 inline mr-2" />
                  Refill All Critical
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {refillSuggestions.slice(0, 6).map((suggestion, index) => {
                  const isUrgent = suggestion.urgency === "URGENT";

                  return (
                    <div
                      key={suggestion.itemId}
                      className={`p-4 rounded-xl border ${
                        isUrgent
                          ? "border-red-300 bg-red-50"
                          : "border-amber-200 bg-white"
                      } hover:shadow-md transition-all`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`px-2 py-1 rounded text-xs font-bold ${
                                isUrgent
                                  ? "bg-red-100 text-red-800"
                                  : "bg-amber-100 text-amber-800"
                              }`}
                            >
                              {suggestion.urgency}
                            </span>
                            <span className="text-sm text-gray-500">
                              {suggestion.supplier}
                            </span>
                          </div>
                          <h4 className="font-bold text-gray-900">
                            {suggestion.itemName}
                          </h4>
                        </div>
                        <div className="text-right">
                          <div
                            className={`text-2xl font-bold ${
                              isUrgent ? "text-red-600" : "text-amber-600"
                            }`}
                          >
                            {suggestion.currentStock}/{suggestion.minStock}
                          </div>
                          <div className="text-sm text-gray-500">
                            {suggestion.unit}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-1">
                          <span>Current</span>
                          <span>Suggested</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              isUrgent ? "bg-red-500" : "bg-amber-500"
                            }`}
                            style={{
                              width: `${Math.min(
                                (suggestion.currentStock /
                                  suggestion.minStock) *
                                  100,
                                100
                              )}%`,
                            }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {suggestion.reason}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Order: </span>
                          <span className="text-blue-600 font-bold">
                            {suggestion.suggestedQty} {suggestion.unit}
                          </span>
                        </div>
                        <button
                          onClick={() => handleQuickRefill(suggestion)}
                          className={`px-3 py-1 rounded-lg text-sm font-medium ${
                            isUrgent
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                          } transition-colors`}
                        >
                          Order Now
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {refillSuggestions.length > 6 && (
                <div className="mt-6 text-center">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {refillSuggestions.length} suggestions →
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* LIVE ALERTS PANEL */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Bell className="w-5 h-5 text-red-500 animate-pulse" />
                  Live Stock Alerts ({alerts.length})
                </h3>
                <span className="text-sm text-gray-500">
                  Updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>

            <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <div
                    key={`${alert.id}-${alert.timestamp}`}
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      alert.severity === "high" ? "bg-red-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2 rounded-lg ${
                          alert.severity === "high"
                            ? "bg-red-100"
                            : alert.severity === "medium"
                            ? "bg-amber-100"
                            : "bg-blue-100"
                        }`}
                      >
                        {alert.type === "stock" ? (
                          <Package
                            className={`w-5 h-5 ${
                              alert.severity === "high"
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          />
                        ) : (
                          <AlertTriangle
                            className={`w-5 h-5 ${
                              alert.severity === "high"
                                ? "text-red-600"
                                : "text-amber-600"
                            }`}
                          />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {alert.title}
                            </h4>
                            <p className="text-gray-600 mt-1">
                              {alert.message}
                            </p>
                            <div className="mt-2">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200">
                                Action: {alert.action}
                              </span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs text-gray-500">
                              {alert.timestamp}
                            </div>
                            {alert.severity === "high" && (
                              <div className="mt-2">
                                <button
                                  onClick={() => {
                                    const suggestion = refillSuggestions.find(
                                      (s) => s.itemId === alert.id
                                    );
                                    if (suggestion)
                                      handleQuickRefill(suggestion);
                                  }}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 transition-colors"
                                >
                                  Fix Now
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center">
                  <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
                  <h4 className="text-lg font-medium text-gray-900">
                    All Good! ✅
                  </h4>
                  <p className="text-gray-600 mt-1">
                    No critical alerts at the moment
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="relative flex-1 max-w-lg">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search items..."
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <select
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="All Categories">All Categories</option>
                <option value="Dairy">Dairy</option>
                <option value="Meat">Meat</option>
                <option value="Vegetables">Vegetables</option>
                <option value="Grains">Grains</option>
                <option value="Cooking Oil">Cooking Oil</option>
              </select>

              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchTerm("");
                }}
                className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Inventory Table with Color-coded Status */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                Inventory Items
              </h3>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Critical</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                  <span>Low</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Normal</span>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Item
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Days Left
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredInventory.map((item) => {
                  const status = calculateStockStatus(item);
                  const daysLeft = Math.floor(
                    item.currentStock / item.consumptionPerDay
                  );

                  return (
                    <tr
                      key={item.id}
                      className={`hover:bg-gray-50 transition-colors ${status.bgColor}`}
                    >
                      <td className="px-6 py-4">
                        <div>
                          <div className="font-bold text-gray-900">
                            {item.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {item.category}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">
                          {item.currentStock} {item.unit}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Consumes: {item.consumptionPerDay}/{item.unit} per day
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 font-medium">
                          {item.minStock} {item.unit}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-3 h-3 rounded-full ${status.color}`}
                          ></div>
                          <span className={`font-medium ${status.textColor}`}>
                            {status.message}
                          </span>
                          {status.status === "critical" && (
                            <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-red-400 opacity-75"></span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div
                          className={`font-bold ${
                            daysLeft <= 2
                              ? "text-red-600"
                              : daysLeft <= 5
                              ? "text-orange-600"
                              : "text-green-600"
                          }`}
                        >
                          {daysLeft} days
                        </div>
                        <div className="text-xs text-gray-500">
                          at current rate
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleStockUpdate(item.id, 5)}
                            className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors"
                          >
                            +5
                          </button>
                          <button
                            onClick={() => handleStockUpdate(item.id, 10)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors"
                          >
                            +10
                          </button>
                          <button
                            onClick={() => {
                              const suggestion = refillSuggestions.find(
                                (s) => s.itemId === item.id
                              );
                              if (suggestion) handleQuickRefill(suggestion);
                            }}
                            className={`px-3 py-1 ${
                              status.status === "critical"
                                ? "bg-red-100 text-red-700 hover:bg-red-200"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            } text-sm rounded-lg transition-colors`}
                          >
                            {status.status === "critical"
                              ? "🚨 Refill"
                              : "Restock"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI-Powered Stock Predictions */}
        <div className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl shadow-lg p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-white" />
              </div>
              AI Stock Predictions & Recommendations
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">
                🔄 Consumption Patterns
              </h4>
              <ul className="space-y-2">
                <li className="flex justify-between">
                  <span className="text-gray-600">Paneer</span>
                  <span className="font-medium text-red-600">-1.8kg/day</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Chicken Breast</span>
                  <span className="font-medium text-red-600">-3.5kg/day</span>
                </li>
                <li className="flex justify-between">
                  <span className="text-gray-600">Tomatoes</span>
                  <span className="font-medium text-red-600">-7.2kg/day</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">
                📊 Next 7 Days Forecast
              </h4>
              <div className="space-y-3">
                {inventory
                  .filter((item) => calculateStockStatus(item).daysLeft <= 7)
                  .slice(0, 3)
                  .map((item) => (
                    <div
                      key={item.id}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-700">{item.name}</span>
                      <span
                        className={`px-2 py-1 rounded text-xs font-bold ${
                          calculateStockStatus(item).daysLeft <= 2
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        Out in {calculateStockStatus(item).daysLeft} days
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-200">
              <h4 className="font-bold text-gray-900 mb-3">
                💡 Smart Suggestions
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Increase Paneer minimum stock to 10kg
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Order bulk from Local Dairy for 15% discount
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <ArrowUpRight className="w-4 h-4 text-green-500 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">
                    Set up auto-order for fast-moving items
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
