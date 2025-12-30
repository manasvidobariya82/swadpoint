// app/profile/page.jsx (or app/account/page.jsx)
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

export default function ProfilePage() {
  // User state - Food SaaS specific
  const [user, setUser] = useState({
    id: 1,
    name: "Chef Marco",
    email: "marco@culinarypro.com",
    phone: "+1234567890",
    bio: "Executive Chef & Restaurant Consultant specializing in Italian cuisine",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Chef",
    location: "Milan, Italy",
    website: "https://culinarypro.com",
    joinedDate: "2022-03-15",
    restaurant: "Ristorante Bella Vista",
    specialty: "Italian Cuisine",
    certifications: ["Food Safety Level 3", "Certified Chef de Cuisine"],
    subscription: "Pro Plan",
  });

  // Form states
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({ ...user });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  // Initialize form data
  useEffect(() => {
    const storedUser = localStorage.getItem("foodSaaSUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setFormData(parsedUser);
    }
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Update user state
      const updatedUser = { ...formData };
      setUser(updatedUser);

      // Save to localStorage
      localStorage.setItem("foodSaaSUser", JSON.stringify(updatedUser));

      // Show success message
      setMessage({ type: "success", text: "Profile updated successfully!" });
      setEditMode(false);

      // Clear message after 3 seconds
      setTimeout(() => {
        setMessage({ type: "", text: "" });
      }, 3000);
    } catch (error) {
      setMessage({ type: "error", text: "Failed to update profile" });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle avatar upload (simulated)
  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsLoading(true);
    try {
      // Simulate upload
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Create object URL for preview
      const objectUrl = URL.createObjectURL(file);

      const updatedUser = {
        ...user,
        avatar: objectUrl,
      };

      setUser(updatedUser);
      setFormData(updatedUser);
      localStorage.setItem("foodSaaSUser", JSON.stringify(updatedUser));

      setMessage({ type: "success", text: "Avatar updated!" });
    } catch (error) {
      setMessage({ type: "error", text: "Failed to upload avatar" });
    } finally {
      setIsLoading(false);
    }
  };

  // Food-related stats
  const stats = [
    {
      label: "Recipes Created",
      value: "247",
      icon: "🍳",
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Menu Items",
      value: "89",
      icon: "📋",
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Orders Processed",
      value: "1.4k",
      icon: "📦",
      color: "bg-blue-50 text-blue-700",
    },
    {
      label: "Customer Reviews",
      value: "4.8⭐",
      icon: "⭐",
      color: "bg-yellow-50 text-yellow-700",
    },
  ];

  // Kitchen activity data
  const activities = [
    {
      id: 1,
      action: 'Added new "Truffle Pasta" recipe',
      time: "2 hours ago",
      icon: "🍝",
    },
    { id: 2, action: "Updated seasonal menu", time: "1 day ago", icon: "📝" },
    { id: 3, action: "Processed 42 orders", time: "2 days ago", icon: "📊" },
    {
      id: 4,
      action: "Received supplier delivery",
      time: "3 days ago",
      icon: "🚚",
    },
  ];

  // Certifications
  const certifications = [
    { name: "Food Safety Level 3", date: "2023", badge: "🛡️" },
    { name: "Certified Chef de Cuisine", date: "2022", badge: "👨‍🍳" },
    { name: "HACCP Certified", date: "2023", badge: "✅" },
    { name: "Nutrition Specialist", date: "2022", badge: "🥗" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header with food theme */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl">
              <span className="text-2xl">👨‍🍳</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Chef Dashboard
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your culinary profile and kitchen operations
              </p>
            </div>
          </div>
        </div>

        {/* Message Alert */}
        {message.text && (
          <div
            className={`mb-6 p-4 rounded-xl ${
              message.type === "success"
                ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            <div className="flex items-center gap-2">
              {message.type === "success" ? "🎉" : "⚠️"}
              {message.text}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Overview */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card with Food Theme */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-amber-200 to-orange-200 border-4 border-white shadow-lg">
                      <img
                        src={user.avatar}
                        alt="Chef Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <label className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-2 rounded-full cursor-pointer hover:from-amber-600 hover:to-orange-600 shadow-lg transition-all hover:scale-105">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="hidden"
                        disabled={isLoading}
                      />
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </label>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-gray-900">
                        {user.name}
                      </h2>
                      <span className="px-2 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-semibold rounded-full">
                        {user.subscription}
                      </span>
                    </div>
                    <p className="text-gray-600">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm text-amber-600">
                        🍽️ {user.restaurant}
                      </span>
                      <span className="text-sm text-gray-500">
                        • Member since {user.joinedDate}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg"
                  disabled={isLoading}
                >
                  {editMode ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              {/* Food Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <div
                    key={index}
                    className={`${stat.color} rounded-xl p-4 text-center border border-transparent hover:border-amber-200 transition-all`}
                  >
                    <div className="text-3xl mb-1">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.value}</div>
                    <div className="text-sm font-medium opacity-90">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Bio & Specialties */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                  <span>👨‍🍳</span> Culinary Profile
                </h3>
                <p className="text-gray-700 mb-4">{user.bio}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-sm font-medium">
                    {user.specialty}
                  </span>
                  {certifications.slice(0, 2).map((cert, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium"
                    >
                      {cert.badge} {cert.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-700 p-3 bg-amber-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                    <span>📞</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Kitchen Phone</div>
                    <div className="font-medium">{user.phone}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 p-3 bg-emerald-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                    <span>📍</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">
                      Restaurant Location
                    </div>
                    <div className="font-medium">{user.location}</div>
                  </div>
                </div>
                <div className="flex items-center text-gray-700 p-3 bg-blue-50 rounded-lg">
                  <div className="p-2 bg-white rounded-lg mr-3 shadow-sm">
                    <span>🌐</span>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Website</div>
                    <a
                      href={user.website}
                      className="font-medium text-blue-600 hover:underline"
                    >
                      {user.website}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            {editMode && (
              <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
                    <span className="text-xl">✏️</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Edit Culinary Profile
                  </h3>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>👨‍🍳</span> Chef Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>📧</span> Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>🍽️</span> Restaurant Name
                      </label>
                      <input
                        type="text"
                        name="restaurant"
                        value={formData.restaurant}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>📍</span> Location
                      </label>
                      <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>📝</span> Culinary Bio
                      </label>
                      <textarea
                        name="bio"
                        value={formData.bio}
                        onChange={handleChange}
                        rows="4"
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                        placeholder="Share your culinary journey, specialties, and passion..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>🌐</span> Website
                      </label>
                      <input
                        type="url"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                        placeholder="https://your-restaurant.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>📞</span> Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <span>⭐</span> Cuisine Specialty
                      </label>
                      <select
                        name="specialty"
                        value={formData.specialty}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-amber-50/50"
                      >
                        <option value="Italian Cuisine">Italian</option>
                        <option value="French Cuisine">French</option>
                        <option value="Asian Fusion">Asian Fusion</option>
                        <option value="Vegetarian">Vegetarian</option>
                        <option value="Seafood">Seafood</option>
                        <option value="Pastry">Pastry</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-4 mt-8">
                    <button
                      type="button"
                      onClick={() => setEditMode(false)}
                      className="px-6 py-3 border border-amber-300 rounded-xl text-gray-700 hover:bg-amber-50 transition-all font-medium"
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all shadow-md hover:shadow-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span>
                          Saving...
                        </span>
                      ) : (
                        "Save Changes"
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-8">
            {/* Kitchen Operations */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>⚙️</span> Kitchen Operations
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-emerald-50 transition-all flex items-center justify-between group border border-transparent hover:border-emerald-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-100 rounded-lg group-hover:bg-emerald-200">
                      <span>📊</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Inventory Management
                      </div>
                      <div className="text-sm text-gray-500">
                        Track ingredients & supplies
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-emerald-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-blue-50 transition-all flex items-center justify-between group border border-transparent hover:border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200">
                      <span>📋</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Menu Planning
                      </div>
                      <div className="text-sm text-gray-500">
                        Create & update menus
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-purple-50 transition-all flex items-center justify-between group border border-transparent hover:border-purple-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200">
                      <span>📦</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Order Tracking
                      </div>
                      <div className="text-sm text-gray-500">
                        Monitor kitchen orders
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-purple-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl hover:bg-orange-50 transition-all flex items-center justify-between group border border-transparent hover:border-orange-200">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200">
                      <span>🍳</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Recipe Database
                      </div>
                      <div className="text-sm text-gray-500">
                        Manage recipes
                      </div>
                    </div>
                  </div>
                  <svg
                    className="w-5 h-5 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Kitchen Activity */}
            <div className="bg-white rounded-2xl shadow-lg border border-amber-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🔥</span> Today's Kitchen Activity
              </h3>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div
                    key={activity.id}
                    className="border-l-4 border-amber-500 pl-4 py-3 hover:bg-amber-50/50 rounded-r-lg transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-white rounded-lg shadow-sm">
                        <span className="text-lg">{activity.icon}</span>
                      </div>
                      <div>
                        <p className="text-gray-800 font-medium">
                          {activity.action}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {activity.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Certifications */}
            <div className="bg-white rounded-2xl shadow-lg border border-emerald-100 p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>🏆</span> Certifications
              </h3>
              <div className="space-y-3">
                {certifications.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-xl hover:bg-emerald-50 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{cert.badge}</div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {cert.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Issued {cert.date}
                        </div>
                      </div>
                    </div>
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      View
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Subscription & Billing */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Subscription Plan</h3>
              <div className="mb-4">
                <div className="text-3xl font-bold mb-1">
                  {user.subscription}
                </div>
                <div className="opacity-90">$49/month • Auto-renewal</div>
              </div>
              <div className="space-y-3">
                <button className="w-full text-center px-4 py-3 bg-white text-amber-700 rounded-xl hover:bg-amber-50 transition-all font-semibold">
                  Upgrade Plan
                </button>
                <button className="w-full text-center px-4 py-3 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white/10 transition-all">
                  View Invoices
                </button>
              </div>
            </div>

            {/* Kitchen Settings */}
            <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-6">
              <h3 className="text-lg font-bold text-red-700 mb-4 flex items-center gap-2">
                <span>⚠️</span> Kitchen Settings
              </h3>
              <div className="space-y-3">
                <button className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all font-medium">
                  🔒 Kitchen Access Control
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all font-medium">
                  🚫 Deactivate Kitchen
                </button>
                <button className="w-full text-left px-4 py-3 rounded-xl bg-red-50 text-red-700 hover:bg-red-100 transition-all font-medium">
                  🗑️ Delete All Data
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
