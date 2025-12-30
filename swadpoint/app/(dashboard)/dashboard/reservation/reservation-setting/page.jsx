"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Clock,
  Table,
  Calendar,
  Users,
  Plus,
  Trash2,
  Save,
  Edit2,
  X,
  ChevronDown,
  ChevronUp,
  ToggleLeft,
  ToggleRight,
  Calendar as CalendarIcon,
  Star,
  Move,
  Check,
  AlertCircle,
  Bell,
  Shield,
  CreditCard,
  Smartphone,
  Mail,
  PieChart,
  Zap,
  Coffee,
  UtensilsCrossed,
  ChefHat,
  Sparkles,
} from "lucide-react";

export default function ReservationSettings() {
  // Main state for all settings
  const [settings, setSettings] = useState({
    autoConfirm: true,
    maxPartySize: 20,
    advanceBookingDays: 30,
    depositRequired: false,
    depositAmount: 0,
    cancellationWindow: 24,
    prepaymentRequired: false,
    prepaymentPercentage: 20,
    tableTurnoverTime: 90,
    allowWalkIns: true,
    smsNotifications: true,
    emailNotifications: true,
    bufferTime: 15,
    maxReservationsPerSlot: 8,
    waitlistEnabled: true,
    waitlistAutoFill: true,
    specialRequests: true,
    birthdayAlerts: true,
    anniversaryAlerts: true,
    theme: "light",
    language: "en",
    timezone: "UTC+5:30",
    currency: "₹",
  });

  // Time slots state
  const [timeSlots, setTimeSlots] = useState([
    {
      id: "1",
      startTime: "11:00",
      endTime: "15:00",
      capacity: 50,
      isActive: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      type: "Lunch",
    },
    {
      id: "2",
      startTime: "18:00",
      endTime: "22:00",
      capacity: 70,
      isActive: true,
      days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
      type: "Dinner",
    },
    {
      id: "3",
      startTime: "12:00",
      endTime: "23:00",
      capacity: 90,
      isActive: true,
      days: ["Sat", "Sun"],
      type: "Weekend",
    },
  ]);

  // Tables state
  const [tables, setTables] = useState([
    {
      id: "1",
      number: 1,
      seats: 2,
      shape: "circle",
      status: "available",
      section: "Window",
      x: 100,
      y: 100,
    },
    {
      id: "2",
      number: 2,
      seats: 4,
      shape: "square",
      status: "available",
      section: "Window",
      x: 300,
      y: 100,
    },
    {
      id: "3",
      number: 3,
      seats: 6,
      shape: "rectangle",
      status: "reserved",
      section: "Main",
      x: 500,
      y: 100,
    },
    {
      id: "4",
      number: 4,
      seats: 8,
      shape: "rectangle",
      status: "occupied",
      section: "Private",
      x: 100,
      y: 300,
    },
  ]);

  // Special dates state
  const [specialDates, setSpecialDates] = useState([
    {
      id: "1",
      date: "2024-12-25",
      name: "Christmas Day",
      type: "holiday",
      closed: true,
      specialHours: [],
    },
    {
      id: "2",
      date: "2024-12-31",
      name: "New Year's Eve",
      type: "event",
      closed: false,
      specialHours: [{ start: "18:00", end: "02:00" }],
    },
  ]);

  // UI state
  const [activeTab, setActiveTab] = useState("general");
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("success");
  const [expandedSlot, setExpandedSlot] = useState(null);
  const [newSlot, setNewSlot] = useState({
    startTime: "17:00",
    endTime: "21:00",
    capacity: 40,
    days: [],
    type: "Regular",
  });
  const [draggingTable, setDraggingTable] = useState(null);
  const [newTable, setNewTable] = useState({
    seats: 2,
    shape: "circle",
    section: "Main",
  });
  const [newSpecialDate, setNewSpecialDate] = useState({
    date: "",
    name: "",
    type: "event",
    closed: false,
  });
  const [showStats, setShowStats] = useState(true);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slotTypes = [
    "Regular",
    "Lunch",
    "Dinner",
    "Weekend",
    "Brunch",
    "Happy Hour",
  ];
  const tableShapes = ["circle", "square", "rectangle"];
  const dateTypes = ["event", "holiday", "special", "maintenance"];

  // Stats data
  const stats = {
    totalReservations: 245,
    occupancyRate: 78,
    avgPartySize: 3.2,
    peakHours: "19:00-21:00",
    cancellationRate: 12,
    revenue: 125000,
  };

  // Handle saving
  const handleSave = async () => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    setSaved(true);
    setModalType("success");
    setShowModal(true);

    // Reset saved status after 3 seconds
    setTimeout(() => setSaved(false), 3000);
  };

  // Handle reset
  const handleReset = () => {
    setModalType("warning");
    setShowModal(true);
  };

  // Time slot functions
  const addTimeSlot = () => {
    if (newSlot.days.length === 0) return;

    const slot = {
      id: Date.now().toString(),
      ...newSlot,
      isActive: true,
    };

    setTimeSlots([...timeSlots, slot]);
    setNewSlot({
      startTime: "17:00",
      endTime: "21:00",
      capacity: 40,
      days: [],
      type: "Regular",
    });
  };

  const toggleDay = (day) => {
    setNewSlot((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const toggleSlotActive = (id) => {
    setTimeSlots((slots) =>
      slots.map((slot) =>
        slot.id === id ? { ...slot, isActive: !slot.isActive } : slot
      )
    );
  };

  const deleteSlot = (id) => {
    setTimeSlots((slots) => slots.filter((slot) => slot.id !== id));
  };

  // Table functions
  const addTable = () => {
    const table = {
      id: Date.now().toString(),
      number: tables.length + 1,
      seats: newTable.seats,
      shape: newTable.shape,
      status: "available",
      section: newTable.section,
      x: 50 + ((tables.length * 20) % 700),
      y: 50 + Math.floor(tables.length / 10) * 60,
    };
    setTables([...tables, table]);
  };

  const deleteTable = (id) => {
    setTables(tables.filter((table) => table.id !== id));
  };

  // Special date functions
  const addSpecialDate = () => {
    if (!newSpecialDate.date || !newSpecialDate.name) return;

    const date = {
      id: Date.now().toString(),
      ...newSpecialDate,
      specialHours: [],
    };

    setSpecialDates([...specialDates, date]);
    setNewSpecialDate({ date: "", name: "", type: "event", closed: false });
  };

  const deleteSpecialDate = (id) => {
    setSpecialDates((dates) => dates.filter((date) => date.id !== id));
  };

  // Drag and drop for tables
  const handleDragStart = (e, tableId) => {
    setDraggingTable(tableId);
    e.dataTransfer.setData("text/plain", tableId);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const tableId = e.dataTransfer.getData("text/plain");
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setTables((prev) =>
      prev.map((table) =>
        table.id === tableId
          ? {
              ...table,
              x: Math.max(0, Math.min(x, 800)),
              y: Math.max(0, Math.min(y, 400)),
            }
          : table
      )
    );
    setDraggingTable(null);
  };

  // Tabs configuration
  const tabs = [
    {
      id: "general",
      label: "General Settings",
      icon: <Settings size={18} />,
      color: "blue",
    },
    {
      id: "time-slots",
      label: "Time Slots",
      icon: <Clock size={18} />,
      color: "purple",
    },
    {
      id: "tables",
      label: "Table Layout",
      icon: <Table size={18} />,
      color: "green",
    },
    {
      id: "special-dates",
      label: "Special Dates",
      icon: <Calendar size={18} />,
      color: "orange",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: <Bell size={18} />,
      color: "red",
    },
  ];

  // Modal configuration
  const modalConfig = {
    success: {
      title: "Success!",
      message: "Your reservation settings have been saved successfully.",
      icon: <Check className="text-green-500" size={48} />,
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
    },
    warning: {
      title: "Reset Settings?",
      message:
        "Are you sure you want to reset all settings to default? This action cannot be undone.",
      icon: <AlertCircle className="text-yellow-500" size={48} />,
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
    },
  };

  // Helper function to calculate hours between times
  const calculateHours = (startTime, endTime) => {
    const start = new Date(`1970-01-01T${startTime}:00`).getTime();
    const end = new Date(`1970-01-01T${endTime}:00`).getTime();
    return Math.round((end - start) / (1000 * 60 * 60));
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "reserved":
        return "bg-yellow-500";
      case "occupied":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header with Stats */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 flex items-center gap-3">
                <Sparkles className="text-yellow-500" />
                Reservation Settings
                {saved && (
                  <span className="text-sm font-normal bg-green-100 text-green-800 px-3 py-1 rounded-full animate-pulse">
                    Saved ✓
                  </span>
                )}
              </h1>
              <p className="text-gray-600 mt-2">
                Configure your restaurant's reservation preferences and layout
              </p>
            </div>
            <button
              onClick={() => setShowStats(!showStats)}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              {showStats ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showStats ? "Hide Stats" : "Show Stats"}
            </button>
          </div>

          {/* Stats Cards */}
          {showStats && (
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mt-6">
              {[
                {
                  label: "Total Reservations",
                  value: stats.totalReservations,
                  icon: <CalendarIcon className="text-blue-600" />,
                  color: "blue",
                },
                {
                  label: "Occupancy Rate",
                  value: `${stats.occupancyRate}%`,
                  icon: <PieChart className="text-green-600" />,
                  color: "green",
                },
                {
                  label: "Avg Party Size",
                  value: stats.avgPartySize,
                  icon: <Users className="text-purple-600" />,
                  color: "purple",
                },
                {
                  label: "Peak Hours",
                  value: stats.peakHours,
                  icon: <Zap className="text-yellow-600" />,
                  color: "yellow",
                },
                {
                  label: "Cancellation Rate",
                  value: `${stats.cancellationRate}%`,
                  icon: <AlertCircle className="text-red-600" />,
                  color: "red",
                },
                {
                  label: "Revenue",
                  value: `₹${stats.revenue.toLocaleString()}`,
                  icon: <CreditCard className="text-emerald-600" />,
                  color: "emerald",
                },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between">
                    <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                      {stat.icon}
                    </div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full bg-${stat.color}-100 text-${stat.color}-800`}
                    >
                      Live
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-gray-900 mt-3">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar Tabs */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-lg p-4 sticky top-6">
              <div className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      activeTab === tab.id
                        ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-lg`
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        activeTab === tab.id
                          ? "bg-white/20"
                          : `bg-${tab.color}-50`
                      }`}
                    >
                      {tab.icon}
                    </div>
                    <span className="font-medium">{tab.label}</span>
                    {activeTab === tab.id && (
                      <div className="ml-auto animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 mb-3">
                  QUICK ACTIONS
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Changes
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    Reset to Default
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              {/* General Settings Tab */}
              {activeTab === "general" && (
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      {
                        title: "Reservation Rules",
                        icon: <Shield className="text-blue-600" />,
                        settings: [
                          {
                            label: "Auto-confirm Reservations",
                            type: "toggle",
                            key: "autoConfirm",
                          },
                          {
                            label: "Max Party Size",
                            type: "number",
                            key: "maxPartySize",
                            min: 1,
                            max: 100,
                          },
                          {
                            label: "Advance Booking (days)",
                            type: "number",
                            key: "advanceBookingDays",
                            min: 1,
                            max: 365,
                          },
                          {
                            label: "Cancellation Window (hours)",
                            type: "number",
                            key: "cancellationWindow",
                            min: 0,
                            max: 72,
                          },
                        ],
                      },
                      {
                        title: "Payment Settings",
                        icon: <CreditCard className="text-purple-600" />,
                        settings: [
                          {
                            label: "Require Deposit",
                            type: "toggle",
                            key: "depositRequired",
                          },
                          {
                            label: "Deposit Amount",
                            type: "number",
                            key: "depositAmount",
                            min: 0,
                            max: 10000,
                            disabled: !settings.depositRequired,
                          },
                          {
                            label: "Prepayment Required",
                            type: "toggle",
                            key: "prepaymentRequired",
                          },
                          {
                            label: "Prepayment %",
                            type: "number",
                            key: "prepaymentPercentage",
                            min: 0,
                            max: 100,
                            disabled: !settings.prepaymentRequired,
                          },
                        ],
                      },
                      {
                        title: "Restaurant Operations",
                        icon: <UtensilsCrossed className="text-green-600" />,
                        settings: [
                          {
                            label: "Table Turnover Time (mins)",
                            type: "number",
                            key: "tableTurnoverTime",
                            min: 30,
                            max: 180,
                          },
                          {
                            label: "Allow Walk-ins",
                            type: "toggle",
                            key: "allowWalkIns",
                          },
                          {
                            label: "Buffer Time (mins)",
                            type: "number",
                            key: "bufferTime",
                            min: 0,
                            max: 60,
                          },
                          {
                            label: "Max Reservations per Slot",
                            type: "number",
                            key: "maxReservationsPerSlot",
                            min: 1,
                            max: 50,
                          },
                        ],
                      },
                      {
                        title: "Preferences",
                        icon: <Star className="text-yellow-600" />,
                        settings: [
                          {
                            label: "Enable Waitlist",
                            type: "toggle",
                            key: "waitlistEnabled",
                          },
                          {
                            label: "Auto-fill from Waitlist",
                            type: "toggle",
                            key: "waitlistAutoFill",
                            disabled: !settings.waitlistEnabled,
                          },
                          {
                            label: "Allow Special Requests",
                            type: "toggle",
                            key: "specialRequests",
                          },
                          {
                            label: "Birthday Alerts",
                            type: "toggle",
                            key: "birthdayAlerts",
                          },
                          {
                            label: "Anniversary Alerts",
                            type: "toggle",
                            key: "anniversaryAlerts",
                          },
                        ],
                      },
                    ].map((section, idx) => (
                      <div
                        key={idx}
                        className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6"
                      >
                        <div className="flex items-center gap-3 mb-6">
                          <div className="p-3 rounded-xl bg-white shadow-sm">
                            {section.icon}
                          </div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {section.title}
                          </h3>
                        </div>
                        <div className="space-y-4">
                          {section.settings.map((setting, sIdx) => (
                            <div
                              key={sIdx}
                              className="flex items-center justify-between"
                            >
                              <div>
                                <p className="font-medium text-gray-900">
                                  {setting.label}
                                </p>
                                {setting.key === "depositAmount" &&
                                  settings.depositRequired && (
                                    <p className="text-sm text-gray-500">
                                      Amount per reservation
                                    </p>
                                  )}
                              </div>
                              {setting.type === "toggle" ? (
                                <button
                                  onClick={() =>
                                    setSettings({
                                      ...settings,
                                      [setting.key]: !settings[setting.key],
                                    })
                                  }
                                  disabled={setting.disabled}
                                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    settings[setting.key]
                                      ? "bg-green-500"
                                      : "bg-gray-300"
                                  } ${
                                    setting.disabled
                                      ? "opacity-50 cursor-not-allowed"
                                      : ""
                                  }`}
                                >
                                  <span
                                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                      settings[setting.key]
                                        ? "translate-x-6"
                                        : "translate-x-1"
                                    }`}
                                  />
                                </button>
                              ) : (
                                <input
                                  type="number"
                                  value={settings[setting.key]}
                                  onChange={(e) =>
                                    setSettings({
                                      ...settings,
                                      [setting.key]: parseInt(e.target.value),
                                    })
                                  }
                                  disabled={setting.disabled}
                                  min={setting.min}
                                  max={setting.max}
                                  className="w-24 px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Time Slots Tab */}
              {activeTab === "time-slots" && (
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Time Slot Management
                    </h2>
                    <p className="text-gray-600">
                      Configure your restaurant's operating hours and capacity
                    </p>
                  </div>

                  {/* Add New Slot */}
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Plus className="text-purple-600" />
                      Add New Time Slot
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Time
                        </label>
                        <input
                          type="time"
                          value={newSlot.startTime}
                          onChange={(e) =>
                            setNewSlot({
                              ...newSlot,
                              startTime: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          End Time
                        </label>
                        <input
                          type="time"
                          value={newSlot.endTime}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, endTime: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={newSlot.capacity}
                          onChange={(e) =>
                            setNewSlot({
                              ...newSlot,
                              capacity: parseInt(e.target.value),
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          min="1"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={newSlot.type}
                          onChange={(e) =>
                            setNewSlot({ ...newSlot, type: e.target.value })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        >
                          {slotTypes.map((type) => (
                            <option key={type} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={addTimeSlot}
                          disabled={newSlot.days.length === 0}
                          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Add Slot
                        </button>
                      </div>
                    </div>

                    {/* Days Selection */}
                    <div className="mt-6">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Days
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {daysOfWeek.map((day) => (
                          <button
                            key={day}
                            onClick={() => toggleDay(day)}
                            className={`px-5 py-2.5 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                              newSlot.days.includes(day)
                                ? "bg-purple-600 text-white border-purple-600 shadow-lg"
                                : "bg-white text-gray-700 border-gray-300 hover:border-purple-400"
                            }`}
                          >
                            {day}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time Slots List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Active Time Slots (
                      {timeSlots.filter((s) => s.isActive).length})
                    </h3>
                    {timeSlots.map((slot) => (
                      <div
                        key={slot.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300 hover:border-purple-200"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() =>
                                setExpandedSlot(
                                  expandedSlot === slot.id ? null : slot.id
                                )
                              }
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                              <ChevronDown
                                className={`transition-transform duration-300 ${
                                  expandedSlot === slot.id ? "rotate-180" : ""
                                }`}
                              />
                            </button>
                            <div className="flex flex-wrap items-center gap-6">
                              <div className="flex items-center gap-3">
                                <div
                                  className={`px-3 py-1.5 rounded-full text-sm font-semibold ${
                                    slot.type === "Lunch"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : slot.type === "Dinner"
                                      ? "bg-purple-100 text-purple-800"
                                      : slot.type === "Weekend"
                                      ? "bg-pink-100 text-pink-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {slot.type}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-gray-400" />
                                  <span className="font-bold text-lg">
                                    {slot.startTime} - {slot.endTime}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                  <Users size={16} className="text-gray-400" />
                                  <span className="font-semibold">
                                    {slot.capacity} people
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar
                                    size={16}
                                    className="text-gray-400"
                                  />
                                  <div className="flex gap-1">
                                    {slot.days.map((day) => (
                                      <span
                                        key={day}
                                        className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg font-medium"
                                      >
                                        {day}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span
                                className={`w-2 h-2 rounded-full ${
                                  slot.isActive
                                    ? "bg-green-500 animate-pulse"
                                    : "bg-gray-300"
                                }`}
                              ></span>
                              <span className="text-sm font-medium">
                                {slot.isActive ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => toggleSlotActive(slot.id)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                              >
                                {slot.isActive ? (
                                  <ToggleRight className="text-green-600" />
                                ) : (
                                  <ToggleLeft className="text-gray-400" />
                                )}
                              </button>
                              <button
                                onClick={() => deleteSlot(slot.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Expanded Details */}
                        {expandedSlot === slot.id && (
                          <div className="mt-5 pt-5 border-t border-gray-100">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                              <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  Slot Duration
                                </h4>
                                <p className="text-2xl font-bold text-gray-900">
                                  {calculateHours(slot.startTime, slot.endTime)}
                                  h
                                </p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  Status
                                </h4>
                                <span
                                  className={`px-4 py-1.5 rounded-full text-sm font-semibold ${
                                    slot.isActive
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {slot.isActive ? "Active" : "Inactive"}
                                </span>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  Weekly Availability
                                </h4>
                                <p className="text-2xl font-bold text-gray-900">
                                  {slot.days.length}/7 days
                                </p>
                              </div>
                              <div className="text-center p-4 bg-gray-50 rounded-xl">
                                <h4 className="text-sm font-medium text-gray-500 mb-2">
                                  Hourly Capacity
                                </h4>
                                <p className="text-2xl font-bold text-gray-900">
                                  {Math.round(
                                    slot.capacity /
                                      calculateHours(
                                        slot.startTime,
                                        slot.endTime
                                      )
                                  )}
                                  /hour
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tables Tab */}
              {activeTab === "tables" && (
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Table Layout Configuration
                    </h2>
                    <p className="text-gray-600">
                      Drag and drop tables to arrange your restaurant layout
                    </p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Table Config Panel */}
                    <div className="lg:col-span-1 space-y-6">
                      {/* Add Table */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <Plus className="text-green-600" />
                          Add New Table
                        </h3>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Seats
                            </label>
                            <input
                              type="range"
                              min="1"
                              max="12"
                              value={newTable.seats}
                              onChange={(e) =>
                                setNewTable({
                                  ...newTable,
                                  seats: parseInt(e.target.value),
                                })
                              }
                              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between mt-2">
                              <span className="text-sm text-gray-500">1</span>
                              <span className="text-lg font-bold text-green-600">
                                {newTable.seats} Seats
                              </span>
                              <span className="text-sm text-gray-500">12</span>
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Shape
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                              {tableShapes.map((shape) => (
                                <button
                                  key={shape}
                                  onClick={() =>
                                    setNewTable({ ...newTable, shape })
                                  }
                                  className={`p-4 border-2 rounded-xl transition-all ${
                                    newTable.shape === shape
                                      ? "border-green-500 bg-green-50"
                                      : "border-gray-300 hover:border-gray-400"
                                  }`}
                                >
                                  <div
                                    className={`mx-auto ${
                                      shape === "circle"
                                        ? "w-12 h-12 rounded-full bg-gray-300"
                                        : shape === "square"
                                        ? "w-12 h-12 bg-gray-300"
                                        : "w-16 h-10 bg-gray-300"
                                    }`}
                                  ></div>
                                  <p className="text-sm font-medium mt-2 capitalize">
                                    {shape}
                                  </p>
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Section
                            </label>
                            <input
                              type="text"
                              value={newTable.section}
                              onChange={(e) =>
                                setNewTable({
                                  ...newTable,
                                  section: e.target.value,
                                })
                              }
                              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="e.g., Window, Main, Private"
                            />
                          </div>
                          <button
                            onClick={addTable}
                            className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl hover:shadow-lg transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={18} />
                            Add Table
                          </button>
                        </div>
                      </div>

                      {/* Table Summary */}
                      <div className="bg-white border border-gray-200 rounded-2xl p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                          Summary
                        </h3>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Tables</span>
                            <span className="font-bold">{tables.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Total Seats</span>
                            <span className="font-bold">
                              {tables.reduce(
                                (sum, table) => sum + table.seats,
                                0
                              )}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Available</span>
                            <span className="font-bold text-green-600">
                              {
                                tables.filter((t) => t.status === "available")
                                  .length
                              }
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Occupied</span>
                            <span className="font-bold text-red-600">
                              {
                                tables.filter((t) => t.status === "occupied")
                                  .length
                              }
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Table Layout Visualization */}
                    <div className="lg:col-span-2">
                      <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 h-[500px] relative overflow-hidden">
                        {/* Restaurant Layout Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
                          {/* Grid Lines */}
                          <div
                            className="absolute inset-0 opacity-10"
                            style={{
                              backgroundImage: `
                              linear-gradient(to right, gray 1px, transparent 1px),
                              linear-gradient(to bottom, gray 1px, transparent 1px)
                            `,
                              backgroundSize: "50px 50px",
                            }}
                          ></div>

                          {/* Decorative Elements */}
                          <div className="absolute top-10 left-10 w-32 h-32 rounded-full border-2 border-gray-700 opacity-20"></div>
                          <div className="absolute bottom-10 right-10 w-48 h-48 rounded-full border-2 border-gray-700 opacity-20"></div>

                          {/* Sections */}
                          <div className="absolute top-4 left-4 px-3 py-1 bg-blue-500/20 text-blue-300 text-sm font-medium rounded-lg">
                            Window
                          </div>
                          <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 text-green-300 text-sm font-medium rounded-lg">
                            Main Hall
                          </div>
                          <div className="absolute bottom-4 left-4 px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-lg">
                            Private
                          </div>
                        </div>

                        {/* Draggable Area */}
                        <div
                          className="relative w-full h-full"
                          onDragOver={(e) => e.preventDefault()}
                          onDrop={handleDrop}
                        >
                          {tables.map((table) => (
                            <div
                              key={table.id}
                              draggable
                              onDragStart={(e) => handleDragStart(e, table.id)}
                              className={`absolute cursor-move transition-transform hover:scale-110 active:scale-105 ${
                                draggingTable === table.id ? "opacity-50" : ""
                              }`}
                              style={{
                                left: `${table.x}px`,
                                top: `${table.y}px`,
                              }}
                            >
                              <div className="relative">
                                <div
                                  className={`
                                  flex items-center justify-center
                                  ${
                                    table.shape === "circle"
                                      ? "rounded-full"
                                      : "rounded-xl"
                                  }
                                  ${getStatusColor(table.status)}
                                  ${
                                    table.shape === "circle"
                                      ? "w-16 h-16"
                                      : table.shape === "square"
                                      ? "w-16 h-16"
                                      : "w-24 h-12"
                                  }
                                  shadow-lg border-2 border-white
                                  transition-all duration-300
                                  hover:shadow-xl
                                `}
                                >
                                  <div className="text-white font-bold">
                                    <div className="text-center">
                                      <div className="text-lg">
                                        {table.number}
                                      </div>
                                      <div className="text-xs opacity-90">
                                        {table.seats} seats
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* Status indicator */}
                                <div
                                  className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                                    table.status === "available"
                                      ? "bg-green-400"
                                      : table.status === "reserved"
                                      ? "bg-yellow-400"
                                      : "bg-red-400"
                                  }`}
                                ></div>
                                {/* Delete button */}
                                <button
                                  onClick={() => deleteTable(table.id)}
                                  className="absolute -top-2 -left-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity shadow-lg"
                                >
                                  <X size={12} />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Legend */}
                        <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm rounded-xl p-4">
                          <div className="flex items-center gap-4">
                            {[
                              { color: "bg-green-500", label: "Available" },
                              { color: "bg-yellow-500", label: "Reserved" },
                              { color: "bg-red-500", label: "Occupied" },
                            ].map((item, idx) => (
                              <div
                                key={idx}
                                className="flex items-center gap-2"
                              >
                                <div
                                  className={`w-3 h-3 rounded-full ${item.color}`}
                                ></div>
                                <span className="text-white text-sm">
                                  {item.label}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Instructions */}
                      <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl p-4">
                        <div className="flex items-start gap-3">
                          <Move className="text-blue-600 mt-1" />
                          <div>
                            <p className="font-medium text-gray-900">
                              Drag & Drop Interface
                            </p>
                            <p className="text-sm text-gray-600 mt-1">
                              Click and drag tables to rearrange your restaurant
                              layout. Tables will snap to the grid for perfect
                              alignment.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Special Dates Tab */}
              {activeTab === "special-dates" && (
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Special Dates Management
                    </h2>
                    <p className="text-gray-600">
                      Configure holidays, events, and special operating hours
                    </p>
                  </div>

                  {/* Add Special Date */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-2xl p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <Calendar className="text-orange-600" />
                      Add Special Date
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          value={newSpecialDate.date}
                          onChange={(e) =>
                            setNewSpecialDate({
                              ...newSpecialDate,
                              date: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Event Name
                        </label>
                        <input
                          type="text"
                          value={newSpecialDate.name}
                          onChange={(e) =>
                            setNewSpecialDate({
                              ...newSpecialDate,
                              name: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                          placeholder="e.g., Christmas Day"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Type
                        </label>
                        <select
                          value={newSpecialDate.type}
                          onChange={(e) =>
                            setNewSpecialDate({
                              ...newSpecialDate,
                              type: e.target.value,
                            })
                          }
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                          {dateTypes.map((type) => (
                            <option
                              key={type}
                              value={type}
                              className="capitalize"
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <button
                          onClick={addSpecialDate}
                          disabled={
                            !newSpecialDate.date || !newSpecialDate.name
                          }
                          className="w-full px-4 py-3 bg-gradient-to-r from-orange-600 to-amber-600 text-white rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
                        >
                          <Plus size={18} />
                          Add Date
                        </button>
                      </div>
                    </div>
                    <div className="mt-4 flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={newSpecialDate.closed}
                          onChange={(e) =>
                            setNewSpecialDate({
                              ...newSpecialDate,
                              closed: e.target.checked,
                            })
                          }
                          className="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm font-medium text-gray-700">
                          Restaurant Closed
                        </span>
                      </label>
                      {!newSpecialDate.closed && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock size={14} />
                          <span>Add special hours after creating</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Special Dates List */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">
                      Upcoming Special Dates ({specialDates.length})
                    </h3>
                    {specialDates.map((date) => (
                      <div
                        key={date.id}
                        className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-lg transition-all duration-300"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div className="flex items-center gap-4">
                            <div
                              className={`p-3 rounded-xl ${
                                date.type === "holiday"
                                  ? "bg-red-100"
                                  : date.type === "event"
                                  ? "bg-blue-100"
                                  : date.type === "special"
                                  ? "bg-purple-100"
                                  : "bg-gray-100"
                              }`}
                            >
                              <Calendar
                                className={
                                  date.type === "holiday"
                                    ? "text-red-600"
                                    : date.type === "event"
                                    ? "text-blue-600"
                                    : date.type === "special"
                                    ? "text-purple-600"
                                    : "text-gray-600"
                                }
                              />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <h4 className="text-lg font-bold text-gray-900">
                                  {date.name}
                                </h4>
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                                    date.type === "holiday"
                                      ? "bg-red-100 text-red-800"
                                      : date.type === "event"
                                      ? "bg-blue-100 text-blue-800"
                                      : date.type === "special"
                                      ? "bg-purple-100 text-purple-800"
                                      : "bg-gray-100 text-gray-800"
                                  }`}
                                >
                                  {date.type}
                                </span>
                              </div>
                              <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-2">
                                  <Calendar
                                    size={14}
                                    className="text-gray-400"
                                  />
                                  <span className="text-gray-700">
                                    {new Date(date.date).toLocaleDateString(
                                      "en-US",
                                      {
                                        weekday: "long",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                      }
                                    )}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div
                                    className={`w-2 h-2 rounded-full ${
                                      date.closed
                                        ? "bg-red-500"
                                        : "bg-green-500"
                                    }`}
                                  ></div>
                                  <span className="text-sm font-medium">
                                    {date.closed
                                      ? "Restaurant Closed"
                                      : "Special Hours Apply"}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button
                              onClick={() => deleteSpecialDate(date.id)}
                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                            >
                              <Trash2 size={16} />
                              Remove
                            </button>
                            <button className="px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg hover:opacity-90 transition-opacity flex items-center gap-2">
                              <Edit2 size={16} />
                              Edit Hours
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notifications Tab */}
              {activeTab === "notifications" && (
                <div className="p-6">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      Notification Settings
                    </h2>
                    <p className="text-gray-600">
                      Configure how you and your customers receive notifications
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Notifications */}
                    <div className="bg-gradient-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-white shadow-sm">
                          <Bell className="text-red-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Customer Notifications
                          </h3>
                          <p className="text-sm text-gray-600">
                            What customers receive
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          {
                            label: "SMS Confirmations",
                            key: "smsNotifications",
                            icon: <Smartphone size={16} />,
                          },
                          {
                            label: "Email Confirmations",
                            key: "emailNotifications",
                            icon: <Mail size={16} />,
                          },
                          {
                            label: "Reminder 24h Before",
                            key: "birthdayAlerts",
                            icon: <Bell size={16} />,
                          },
                          {
                            label: "Cancellation Notices",
                            key: "anniversaryAlerts",
                            icon: <AlertCircle size={16} />,
                          },
                          {
                            label: "Waitlist Updates",
                            key: "waitlistEnabled",
                            icon: <Users size={16} />,
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {item.icon}
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.label}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                setSettings({
                                  ...settings,
                                  [item.key]: !settings[item.key],
                                })
                              }
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                settings[item.key]
                                  ? "bg-red-500"
                                  : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  settings[item.key]
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Admin Notifications */}
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 rounded-xl bg-white shadow-sm">
                          <Bell className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            Admin Notifications
                          </h3>
                          <p className="text-sm text-gray-600">
                            What you receive
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[
                          {
                            label: "New Reservations",
                            enabled: true,
                            icon: <Calendar size={16} />,
                          },
                          {
                            label: "Cancellations",
                            enabled: true,
                            icon: <X size={16} />,
                          },
                          {
                            label: "No-shows",
                            enabled: true,
                            icon: <AlertCircle size={16} />,
                          },
                          {
                            label: "Waitlist Updates",
                            enabled: true,
                            icon: <Users size={16} />,
                          },
                          {
                            label: "Special Requests",
                            enabled: true,
                            icon: <Star size={16} />,
                          },
                        ].map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-white rounded-lg"
                          >
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-gray-100 rounded-lg">
                                {item.icon}
                              </div>
                              <span className="font-medium text-gray-900">
                                {item.label}
                              </span>
                            </div>
                            <button
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                item.enabled ? "bg-blue-500" : "bg-gray-300"
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  item.enabled
                                    ? "translate-x-6"
                                    : "translate-x-1"
                                }`}
                              />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div
            className={`${modalConfig[modalType].bgColor} border ${modalConfig[modalType].borderColor} rounded-2xl shadow-2xl max-w-md w-full p-8 transform`}
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4">{modalConfig[modalType].icon}</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                {modalConfig[modalType].title}
              </h3>
              <p className="text-gray-600 mb-6">
                {modalConfig[modalType].message}
              </p>
              <div className="flex gap-3 w-full">
                {modalType === "warning" ? (
                  <>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        // Reset logic here
                        setShowModal(false);
                      }}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-orange-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Reset All
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:opacity-90 transition-opacity"
                    >
                      Got it!
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={handleSave}
          disabled={loading}
          className={`flex items-center space-x-3 px-6 py-4 rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-105 ${
            saved
              ? "bg-gradient-to-r from-green-500 to-emerald-600"
              : "bg-gradient-to-r from-blue-600 to-purple-600"
          } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              <span className="font-semibold text-white">Saving...</span>
            </>
          ) : saved ? (
            <>
              <Check size={20} />
              <span className="font-semibold text-white">Saved!</span>
            </>
          ) : (
            <>
              <Save size={20} />
              <span className="font-semibold text-white">Save Changes</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
