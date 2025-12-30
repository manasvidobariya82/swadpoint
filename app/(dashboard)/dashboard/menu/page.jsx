// app/dashboard/page.jsx
"use client";

import React, { useState, useEffect } from "react";
import {
  QrCode,
  Utensils,
  Plus,
  Share2,
  Download,
  Copy,
  Search,
  Filter,
  Sparkles,
  DollarSign,
  Star,
  TrendingUp,
  Eye,
  Edit,
  Trash2,
  Bell,
  ChevronDown,
  Flame,
  Package,
  Users,
  BarChart3,
  Settings,
  User,
  Home,
  Tag,
  Clock,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Sample data for menu items
const sampleMenuItems = [
  {
    id: 1,
    name: "Butter Chicken",
    category: "Main Course",
    price: 450,
    discountPrice: 399,
    description:
      "Tender chicken in rich tomato butter sauce with aromatic Indian spices",
    ingredients: ["Chicken", "Butter", "Tomato", "Cream", "Garam Masala"],
    calories: 450,
    prepTime: 25,
    dietary: "Non-Vegetarian",
    spiceLevel: 3,
    featured: true,
    available: true,
    rating: 4.8,
    orders: 120,
    image:
      "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400&h=300&fit=crop",
  },
  {
    id: 2,
    name: "Paneer Tikka",
    category: "Appetizer",
    price: 320,
    description:
      "Grilled cottage cheese cubes with bell peppers and Indian spices",
    ingredients: ["Paneer", "Bell Peppers", "Yogurt", "Spices"],
    calories: 280,
    prepTime: 20,
    dietary: "Vegetarian",
    spiceLevel: 2,
    featured: true,
    available: true,
    rating: 4.5,
    orders: 85,
    image:
      "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=300&fit=crop",
  },
  {
    id: 3,
    name: "Garlic Naan",
    category: "Bread",
    price: 90,
    description: "Soft bread topped with fresh garlic and butter",
    ingredients: ["Flour", "Garlic", "Butter", "Yogurt"],
    calories: 220,
    prepTime: 15,
    dietary: "Vegetarian",
    spiceLevel: 1,
    featured: false,
    available: true,
    rating: 4.3,
    orders: 200,
    image:
      "https://images.unsplash.com/photo-1563379091339-03246963d9d6?w=400&h=300&fit=crop",
  },
];

const categories = [
  "All Categories",
  "Main Course",
  "Appetizer",
  "Bread",
  "Drinks",
  "Dessert",
  "Salad",
  "Soup",
];

export default function DashboardPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState(sampleMenuItems);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("menu");
  const [stats, setStats] = useState({
    totalItems: 0,
    avgPrice: 0,
    featuredItems: 0,
    totalValue: 0,
    totalOrders: 0,
  });

  // Calculate stats whenever menuItems change
  useEffect(() => {
    const totalItems = menuItems.length;
    const avgPrice =
      menuItems.length > 0
        ? menuItems.reduce((sum, item) => sum + item.price, 0) /
          menuItems.length
        : 0;
    const featuredItems = menuItems.filter((item) => item.featured).length;
    const totalValue = menuItems.reduce((sum, item) => sum + item.price, 0);
    const totalOrders = menuItems.reduce(
      (sum, item) => sum + (item.orders || 0),
      0
    );

    setStats({
      totalItems,
      avgPrice,
      featuredItems,
      totalValue,
      totalOrders,
    });
  }, [menuItems]);

  // Filter menu items based on search and category
  const filteredItems = menuItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.ingredients.some((ing) =>
        ing.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Delete menu item
  const deleteItem = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  // Toggle featured status
  const toggleFeatured = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, featured: !item.featured } : item
      )
    );
  };

  // Toggle availability
  const toggleAvailability = (id) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  // Download QR Code
  const downloadQR = () => {
    const link = document.createElement("a");
    link.href =
      "https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=https://swadpoint.com/menu/restaurant123";
    link.download = "swadpoint-menu-qr.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    alert("QR Code downloaded successfully!");
  };

  // Copy link to clipboard
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        "https://swadpoint.com/menu/restaurant123"
      );
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  // Stats cards data
  const statCards = [
    {
      label: "Menu Items",
      value: stats.totalItems,
      icon: <Utensils className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      change: "+12%",
      trend: "up",
    },
    {
      label: "Avg Price",
      value: formatCurrency(stats.avgPrice),
      icon: <DollarSign className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      change: "+5%",
      trend: "up",
    },
    {
      label: "Featured",
      value: stats.featuredItems,
      icon: <Star className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      change: "+8%",
      trend: "up",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: <TrendingUp className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      change: "+24%",
      trend: "up",
    },
  ];

  // Navigation items
  const navItems = [
    { icon: <Home className="w-5 h-5" />, label: "Dashboard", active: false },
    { icon: <Package className="w-5 h-5" />, label: "Menu", active: true },
    { icon: <Users className="w-5 h-5" />, label: "Orders", badge: "12" },
    { icon: <BarChart3 className="w-5 h-5" />, label: "Analytics" },
    { icon: <Tag className="w-5 h-5" />, label: "Offers" },
    { icon: <Settings className="w-5 h-5" />, label: "Settings" },
    { icon: <User className="w-5 h-5" />, label: "Account" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 font-sans">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl">
              <Utensils className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
              SWADPOINT
            </h1>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded-full font-medium">
              PRO
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>

            <div className="flex items-center gap-3">
              <div className="text-right hidden md:block">
                <p className="font-semibold text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">Restaurant Owner</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full flex items-center justify-center text-white font-bold">
                A
              </div>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="hidden md:flex w-64 flex-col bg-white border-r border-gray-200 min-h-[calc(100vh-80px)] p-6">
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-800 mb-2">
              Quick Stats
            </h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Today's Orders</span>
                <span className="font-bold text-gray-800">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Revenue</span>
                <span className="font-bold text-green-600">₹8,450</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Tables</span>
                <span className="font-bold text-blue-600">12/20</span>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {navItems.map((item, index) => (
              <button
                key={index}
                className={`flex items-center gap-3 w-full p-3 rounded-xl transition-all duration-300 ${
                  item.active
                    ? "bg-gradient-to-r from-orange-50 to-red-50 text-orange-600 border border-orange-200"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {item.icon}
                <span className="font-medium">{item.label}</span>
                {item.badge && (
                  <span className="ml-auto bg-orange-100 text-orange-600 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-200">
            <Link href="/dashboard/add-item">
              <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
                <Plus className="w-5 h-5" />
                Add Menu Item
              </button>
            </Link>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Digital Menu Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Create, manage, and optimize your restaurant's digital menu
                </p>
              </div>

              <div className="flex items-center gap-3">
                <Link href="/dashboard/add-item">
                  <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
                    <Plus className="w-5 h-5" />
                    Add Menu Item
                  </button>
                </Link>
                <button className="flex items-center gap-2 border border-orange-500 text-orange-600 px-4 py-3 rounded-xl font-semibold hover:bg-orange-50 transition-colors">
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex overflow-x-auto scrollbar-hide">
              {[
                "Menu",
                "Analytics",
                "QR Code",
                "Settings",
                "Customers",
                "Reviews",
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab.toLowerCase())}
                  className={`px-5 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                    activeTab === tab.toLowerCase()
                      ? "text-orange-600 border-orange-500"
                      : "text-gray-500 border-transparent hover:text-orange-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {statCards.map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`p-3 rounded-xl bg-gradient-to-br ${stat.color}`}
                  >
                    <div className="text-white">{stat.icon}</div>
                  </div>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      stat.trend === "up"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {stat.change}
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* QR Code Section */}
          {activeTab === "qr code" && (
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 mb-8 text-white">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h2 className="text-2xl font-bold mb-4">
                    Your Digital Menu QR Code
                  </h2>
                  <p className="mb-6 opacity-90">
                    Customers can scan this QR code to view your live menu,
                    place orders, and make payments directly from their phones.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={downloadQR}
                      className="flex items-center gap-2 bg-white text-indigo-600 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download QR
                    </button>
                    <button
                      onClick={copyLink}
                      className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 text-white px-5 py-3 rounded-xl font-semibold hover:bg-white/30 transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                      Copy Link
                    </button>
                  </div>
                </div>
                <div className="flex justify-center">
                  <div className="relative">
                    <div className="w-64 h-64 bg-white rounded-3xl p-4 shadow-2xl">
                      <div className="w-full h-full bg-gradient-to-br from-indigo-400 to-purple-500 rounded-2xl flex items-center justify-center">
                        <QrCode className="w-32 h-32 text-white opacity-90" />
                      </div>
                    </div>
                    <div className="absolute -top-3 -right-3 w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center animate-bounce">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-lg">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search menu items by name, ingredients, or description..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="pl-10 pr-8 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none appearance-none bg-white"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <button className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl hover:bg-gray-100 transition-colors">
                  <span className="text-sm font-medium text-gray-600">
                    {filteredItems.length} items
                  </span>
                </button>
              </div>
            </div>

            {/* Quick Filters */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setSelectedCategory("All Categories")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === "All Categories"
                    ? "bg-orange-100 text-orange-600"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                All Items
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchQuery("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Featured Only
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchQuery("vegetarian");
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Vegetarian
              </button>
              <button
                onClick={() => {
                  setSelectedCategory("All Categories");
                  setSearchQuery("non-vegetarian");
                }}
                className="px-4 py-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 text-sm font-medium transition-colors"
              >
                Non-Vegetarian
              </button>
            </div>
          </div>

          {/* Menu Items Grid or Empty State */}
          <>
            {filteredItems.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Badges */}
                      <div className="absolute top-4 left-4 flex gap-2">
                        {item.featured && (
                          <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            Featured
                          </span>
                        )}
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-gray-700 text-xs font-semibold rounded-full">
                          {item.category}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button
                          onClick={() => toggleFeatured(item.id)}
                          className={`p-2 rounded-full backdrop-blur-sm transition-colors ${
                            item.featured
                              ? "bg-amber-100 text-amber-600 hover:bg-amber-200"
                              : "bg-white/90 text-gray-400 hover:text-amber-600 hover:bg-white"
                          }`}
                        >
                          <Sparkles className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => toggleAvailability(item.id)}
                          className={`p-2 rounded-full backdrop-blur-sm ${
                            item.available
                              ? "bg-green-100 text-green-600 hover:bg-green-200"
                              : "bg-red-100 text-red-600 hover:bg-red-200"
                          }`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${
                              item.available ? "bg-green-500" : "bg-red-500"
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-lg text-gray-900">
                          {item.name}
                        </h3>
                        <div className="text-right">
                          <div className="flex items-center gap-1">
                            {item.discountPrice ? (
                              <>
                                <span className="text-gray-400 line-through text-sm">
                                  ₹{item.price}
                                </span>
                                <span className="text-xl font-bold text-red-600">
                                  ₹{item.discountPrice}
                                </span>
                              </>
                            ) : (
                              <span className="text-xl font-bold text-gray-900">
                                ₹{item.price}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-4 h-4 text-amber-400 fill-current" />
                            <span className="text-sm text-gray-600">
                              {item.rating}
                            </span>
                            <span className="text-sm text-gray-400">•</span>
                            <span className="text-sm text-gray-600">
                              {item.orders} orders
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-full font-medium">
                          {item.dietary}
                        </span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 text-xs rounded-full font-medium">
                          {item.calories} cal
                        </span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 text-xs rounded-full font-medium">
                          {item.prepTime} min
                        </span>
                        <div className="flex items-center px-3 py-1 bg-orange-50 text-orange-600 text-xs rounded-full font-medium">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Flame
                              key={i}
                              className={`w-3 h-3 ${
                                i < item.spiceLevel
                                  ? "fill-current"
                                  : "text-orange-200"
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2.5 border border-gray-200 rounded-xl text-gray-600 font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                          <Edit className="w-4 h-4" />
                          Edit
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="flex-1 py-2.5 border border-red-200 text-red-600 font-medium hover:bg-red-50 transition-colors rounded-xl flex items-center justify-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gradient-to-br from-white to-orange-50 rounded-2xl shadow-lg p-12 text-center border-2 border-dashed border-orange-200 mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-100 to-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Utensils className="w-12 h-12 text-orange-500" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">
                  {searchQuery || selectedCategory !== "All Categories"
                    ? "No Items Found"
                    : "No Menu Items Yet"}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto mb-8">
                  {searchQuery || selectedCategory !== "All Categories"
                    ? "Try adjusting your search or filter to find what you're looking for."
                    : "Start by adding your first menu item to create an amazing digital menu experience."}
                </p>
                <Link href="/dashboard/add-item">
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-3.5 rounded-xl font-bold hover:shadow-lg hover:shadow-orange-200 transition-all duration-300">
                    <Plus className="w-5 h-5" />
                    Add Your First Item
                  </button>
                </Link>
              </div>
            )}
          </>

          {/* Bottom Info Bar */}
          <div className="mt-8 bg-white rounded-2xl shadow p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Menu Views</p>
                  <p className="text-xl font-bold text-gray-900">1,234</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-green-100 rounded-xl">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Customer Rating</p>
                  <p className="text-xl font-bold text-gray-900">4.8/5.0</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Clock className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg Prep Time</p>
                  <p className="text-xl font-bold text-gray-900">18 min</p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
