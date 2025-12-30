
"use client";

import { useState, useEffect } from "react";
import {
  QrCode,
  Camera,
  Smartphone,
  Scan,
  Eye,
  EyeOff,
  Plus,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Image as ImageIcon,
  Video,
  Star,
  TrendingUp,
  Users,
  ShoppingBag,
  Filter,
  Search,
  RefreshCw,
  Download,
  Share2,
  Globe,
  Smartphone as Phone,
  Tablet,
  Monitor,
  Zap,
  Sparkles,
  Target,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  ChevronRight,
  Info,
  HelpCircle,
  Award,
  Clock,
  Shield,
  Lock,
  Unlock,
  Eye as ViewEye,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

// Sample AR Menu Items
const SAMPLE_MENU_ITEMS = [
  {
    id: "ar_001",
    name: "Paneer Tikka Masala",
    category: "Main Course",
    price: 320,
    description: "Cottage cheese cubes in rich creamy tomato gravy",
    arType: "3D Model",
    views: 1250,
    interactions: 420,
    rating: 4.8,
    status: "active",
    qrCode: "QR001",
    arPreview: "https://example.com/ar/paneer",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400",
      },
      { type: "video", url: "https://example.com/videos/paneer.mp4" },
      { type: "3d", url: "https://example.com/models/paneer.glb" },
    ],
  },
  {
    id: "ar_002",
    name: "Butter Chicken",
    category: "Main Course",
    price: 350,
    description: "Tender chicken in buttery tomato sauce",
    arType: "Video",
    views: 980,
    interactions: 310,
    rating: 4.7,
    status: "active",
    qrCode: "QR002",
    arPreview: "https://example.com/ar/butter-chicken",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400",
      },
      { type: "video", url: "https://example.com/videos/butter-chicken.mp4" },
    ],
  },
  {
    id: "ar_003",
    name: "Garlic Naan",
    category: "Bread",
    price: 80,
    description: "Soft bread with garlic butter",
    arType: "3D Model",
    views: 2100,
    interactions: 890,
    rating: 4.9,
    status: "active",
    qrCode: "QR003",
    arPreview: "https://example.com/ar/garlic-naan",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w-400",
      },
      { type: "3d", url: "https://example.com/models/naan.glb" },
    ],
  },
  {
    id: "ar_004",
    name: "Mango Lassi",
    category: "Beverage",
    price: 120,
    description: "Refreshing yogurt drink with mango",
    arType: "Animation",
    views: 750,
    interactions: 280,
    rating: 4.6,
    status: "inactive",
    qrCode: "QR004",
    arPreview: "https://example.com/ar/mango-lassi",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1628992682633-bf2d40cb595f?w=400",
      },
      { type: "video", url: "https://example.com/videos/lassi.mp4" },
    ],
  },
  {
    id: "ar_005",
    name: "Gulab Jamun",
    category: "Dessert",
    price: 150,
    description: "Sweet milk dumplings in rose syrup",
    arType: "3D Model",
    views: 620,
    interactions: 210,
    rating: 4.5,
    status: "active",
    qrCode: "QR005",
    arPreview: "https://example.com/ar/gulab-jamun",
    media: [
      {
        type: "image",
        url: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
      },
      { type: "3d", url: "https://example.com/models/gulab-jamun.glb" },
    ],
  },
];

const CATEGORIES = [
  "All Categories",
  "Appetizers",
  "Main Course",
  "Bread",
  "Beverages",
  "Desserts",
  "Specials",
];

const AR_TYPES = [
  {
    id: "3d",
    name: "3D Model",
    icon: "🧊",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "video",
    name: "Video",
    icon: "🎥",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "animation",
    name: "Animation",
    icon: "✨",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
  },
  {
    id: "image",
    name: "360° Image",
    icon: "🔄",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "ar",
    name: "AR Experience",
    icon: "👓",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

const DEVICE_TYPES = [
  { id: "mobile", name: "Mobile", icon: Smartphone, color: "text-blue-600" },
  { id: "tablet", name: "Tablet", icon: Tablet, color: "text-green-600" },
  { id: "desktop", name: "Desktop", icon: Monitor, color: "text-purple-600" },
];

export default function ARMenuPage() {
  // State Management
  const [menuItems, setMenuItems] = useState(SAMPLE_MENU_ITEMS);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showARViewer, setShowARViewer] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedARType, setSelectedARType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [arScale, setArScale] = useState(1);
  const [arRotation, setArRotation] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState("mobile");
  const [showPreview, setShowPreview] = useState(true);
  const [loading, setLoading] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState({
    name: "",
    category: "Main Course",
    price: "",
    description: "",
    arType: "3d",
    media: [],
    status: "active",
  });

  // Stats data
  const [stats, setStats] = useState({
    totalViews: 0,
    totalInteractions: 0,
    avgRating: 0,
    activeItems: 0,
  });

  // Calculate stats
  useEffect(() => {
    const totalViews = menuItems.reduce((sum, item) => sum + item.views, 0);
    const totalInteractions = menuItems.reduce(
      (sum, item) => sum + item.interactions,
      0
    );
    const avgRating =
      menuItems.reduce((sum, item) => sum + item.rating, 0) / menuItems.length;
    const activeItems = menuItems.filter(
      (item) => item.status === "active"
    ).length;

    setStats({
      totalViews,
      totalInteractions,
      avgRating,
      activeItems,
    });
  }, [menuItems]);

  // Filter menu items
  const filteredItems = menuItems.filter((item) => {
    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category === selectedCategory;
    const matchesARType =
      selectedARType === "all" ||
      item.arType.toLowerCase().includes(selectedARType);
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesARType && matchesSearch;
  });

  // Handle view AR
  const handleViewAR = (item) => {
    setSelectedItem(item);
    setShowARViewer(true);
    setIsPlaying(true);
    toast.success(`Viewing AR for ${item.name}`, {
      icon: "👓",
      duration: 3000,
    });
  };

  // Handle generate QR
  const handleGenerateQR = (item) => {
    setSelectedItem(item);
    setShowQRModal(true);
    toast.success(`QR Code generated for ${item.name}`);
  };

  // Handle add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) {
      toast.error("Please fill required fields");
      return;
    }

    const newId = `ar_${String(menuItems.length + 1).padStart(3, "0")}`;
    const qrCode = `QR${String(menuItems.length + 1).padStart(3, "0")}`;

    const itemToAdd = {
      ...newItem,
      id: newId,
      qrCode,
      views: 0,
      interactions: 0,
      rating: 4.5,
      arPreview: `https://example.com/ar/${newItem.name
        .toLowerCase()
        .replace(/\s+/g, "-")}`,
      price: parseInt(newItem.price),
      media:
        newItem.media.length > 0
          ? newItem.media
          : [
              {
                type: "image",
                url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400",
              },
            ],
    };

    setMenuItems((prev) => [...prev, itemToAdd]);
    setNewItem({
      name: "",
      category: "Main Course",
      price: "",
      description: "",
      arType: "3d",
      media: [],
      status: "active",
    });
    setShowAddModal(false);

    toast.success(`${newItem.name} added to AR Menu!`, {
      icon: "🎉",
      duration: 4000,
    });
  };

  // Handle delete item
  const handleDeleteItem = (itemId) => {
    setMenuItems((prev) => prev.filter((item) => item.id !== itemId));
    toast.success("Item removed from AR Menu");
  };

  // Handle toggle status
  const handleToggleStatus = (itemId) => {
    setMenuItems((prev) =>
      prev.map((item) =>
        item.id === itemId
          ? {
              ...item,
              status: item.status === "active" ? "inactive" : "active",
            }
          : item
      )
    );
  };

  // Handle media upload
  const handleMediaUpload = (type) => {
    // In real app, this would upload to cloud storage
    const dummyUrls = {
      image: `https://images.unsplash.com/photo-${Date.now()}?w=400`,
      video: `https://example.com/videos/${Date.now()}.mp4`,
      "3d": `https://example.com/models/${Date.now()}.glb`,
    };

    setNewItem((prev) => ({
      ...prev,
      media: [...prev.media, { type, url: dummyUrls[type] }],
    }));

    toast.success(`${type.toUpperCase()} uploaded successfully!`);
  };

  // Handle export QR codes
  const handleExportQR = () => {
    toast.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
      loading: "Generating QR codes PDF...",
      success: "QR codes exported successfully!",
      error: "Export failed. Please try again.",
    });
  };

  // Handle share AR menu
  const handleShareMenu = () => {
    const url = `${window.location.origin}/ar-menu/view`;
    navigator.clipboard.writeText(url);
    toast.success("AR Menu link copied to clipboard!");
  };

  // Handle reset AR view
  const handleResetView = () => {
    setArScale(1);
    setArRotation(0);
    setIsPlaying(true);
    toast.success("AR view reset");
  };

  // Render AR viewer
  const renderARViewer = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* AR Viewer Header */}
        <div className="absolute top-0 left-0 right-0 bg-black/80 backdrop-blur-sm z-10 p-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowARViewer(false)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                <X className="text-white" size={20} />
              </button>
              <div>
                <h3 className="text-white font-semibold">
                  {selectedItem.name}
                </h3>
                <p className="text-gray-300 text-sm">{selectedItem.category}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                {isPlaying ? (
                  <Pause className="text-white" size={20} />
                ) : (
                  <Play className="text-white" size={20} />
                )}
              </button>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                {isMuted ? (
                  <VolumeX className="text-white" size={20} />
                ) : (
                  <Volume2 className="text-white" size={20} />
                )}
              </button>
              <button
                onClick={handleResetView}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                <RotateCcw className="text-white" size={20} />
              </button>
              <button
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 bg-white/10 rounded-lg hover:bg-white/20"
              >
                {isFullscreen ? (
                  <Minimize2 className="text-white" size={20} />
                ) : (
                  <Maximize2 className="text-white" size={20} />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* AR Canvas */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full bg-gradient-to-br from-gray-900 to-black">
            {/* AR Scene Placeholder */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative">
                {/* 3D Model Container */}
                <div
                  className="relative"
                  style={{
                    transform: `scale(${arScale}) rotate(${arRotation}deg)`,
                    transition: "transform 0.3s ease",
                  }}
                >
                  <div className="w-64 h-64 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
                    <div className="text-center">
                      <div className="text-6xl mb-4">🍽️</div>
                      <div className="text-white font-bold">
                        {selectedItem.name}
                      </div>
                      <div className="text-gray-200 text-sm mt-2">
                        AR Preview
                      </div>
                    </div>
                  </div>

                  {/* Interactive Hotspots */}
                  <div
                    className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full animate-pulse cursor-pointer"
                    onClick={() => toast.info("Nutrition info clicked!")}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      ℹ️
                    </div>
                  </div>

                  <div
                    className="absolute bottom-4 left-4 w-8 h-8 bg-green-500 rounded-full animate-pulse cursor-pointer"
                    onClick={() => toast.info("Ingredients clicked!")}
                  >
                    <div className="absolute inset-0 flex items-center justify-center text-white text-xs">
                      📋
                    </div>
                  </div>
                </div>

                {/* Controls Overlay */}
                <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-4">
                  <button
                    onClick={() =>
                      setArScale((prev) => Math.min(prev + 0.1, 2))
                    }
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                  >
                    <Plus className="text-white" size={20} />
                  </button>
                  <button
                    onClick={() =>
                      setArScale((prev) => Math.max(prev - 0.1, 0.5))
                    }
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                  >
                    <Minimize2 className="text-white" size={20} />
                  </button>
                  <button
                    onClick={() => setArRotation((prev) => prev + 45)}
                    className="p-3 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30"
                  >
                    <RefreshCw className="text-white" size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* AR Instructions */}
            <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 text-center">
              <div className="bg-black/60 backdrop-blur-sm rounded-lg p-4 inline-block">
                <p className="text-white text-sm mb-2">
                  👆 Touch and drag to rotate
                </p>
                <p className="text-white text-sm">🤏 Pinch to zoom in/out</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4">
          <div className="flex justify-between items-center">
            <div className="text-white">
              <div className="flex items-center gap-4">
                <span className="text-sm">Scale: {arScale.toFixed(1)}x</span>
                <span className="text-sm">Rotation: {arRotation}°</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleGenerateQR(selectedItem)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <QrCode size={18} />
                Get QR Code
              </button>
              <button
                onClick={() => toast.success("Shared AR experience!")}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render QR Modal
  const renderQRModal = () => {
    if (!selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900">QR Code</h3>
                <p className="text-gray-600 text-sm">
                  Scan to view AR experience
                </p>
              </div>
              <button
                onClick={() => setShowQRModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="text-center">
              {/* QR Code Placeholder */}
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-8 rounded-xl inline-block mb-6">
                <div className="w-48 h-48 bg-white p-4 rounded-lg">
                  <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center rounded">
                    <QrCode size={80} className="text-white" />
                  </div>
                </div>
              </div>

              <h4 className="font-semibold text-gray-900 text-lg mb-2">
                {selectedItem.name}
              </h4>
              <p className="text-gray-600 mb-4">
                Scan this QR code with your phone camera
              </p>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">QR Code ID:</span>
                  <span className="font-mono font-bold">
                    {selectedItem.qrCode}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={handleExportQR}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                >
                  <Download size={18} />
                  Download
                </button>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(selectedItem.arPreview);
                    toast.success("QR URL copied!");
                  }}
                  className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Copy size={18} />
                  Copy URL
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Add missing icons
  const Copy = ({ size, className }) => (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <Toaster position="top-right" />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white">
                  <Smartphone size={24} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    AR Digital Menu
                  </h1>
                  <p className="text-gray-600">
                    Immersive Augmented Reality dining experience
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800"
              >
                <Plus size={18} />
                Add AR Item
              </button>
              <button
                onClick={() => setShowStatsModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <BarChart3 size={18} />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Eye className="text-blue-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalViews.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="text-green-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Interactions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalInteractions.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Star className="text-purple-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.avgRating.toFixed(1)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Zap className="text-yellow-600" size={24} />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Active Items</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.activeItems}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap gap-4">
              <div className="relative flex-1 min-w-[200px]">
                <input
                  type="text"
                  placeholder="Search AR items..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  🔍
                </div>
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {CATEGORIES.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              <select
                value={selectedARType}
                onChange={(e) => setSelectedARType(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All AR Types</option>
                {AR_TYPES.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleShareMenu}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Share2 size={18} />
                Share Menu
              </button>
              <button
                onClick={handleExportQR}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                <Download size={18} />
                Export All QR
              </button>
            </div>
          </div>

          {/* AR Type Filters */}
          <div className="flex flex-wrap gap-3">
            {AR_TYPES.map((type) => (
              <button
                key={type.id}
                onClick={() => setSelectedARType(type.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition ${
                  selectedARType === type.id
                    ? `${type.bgColor} ${type.color} ring-2 ring-opacity-30`
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span className="text-lg">{type.icon}</span>
                <span>{type.name}</span>
              </button>
            ))}
          </div>

          {/* Device Preview Toggle */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">Preview Device:</span>
              <div className="flex gap-2">
                {DEVICE_TYPES.map((device) => (
                  <button
                    key={device.id}
                    onClick={() => setSelectedDevice(device.id)}
                    className={`p-2 rounded-lg flex items-center gap-2 ${
                      selectedDevice === device.id
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <device.icon size={18} />
                    <span className="text-sm">{device.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showPreview}
                onChange={(e) => setShowPreview(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-12 h-6 rounded-full transition ${
                  showPreview ? "bg-blue-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transform transition ${
                    showPreview ? "translate-x-7" : "translate-x-1"
                  }`}
                />
              </div>
              <span className="text-sm text-gray-600">Show Preview</span>
            </label>
          </div>
        </div>

        {/* AR Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              {/* Item Image/Preview */}
              <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-200">
                {showPreview ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl flex items-center justify-center">
                        <div className="text-4xl">🍽️</div>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {item.arType}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <ImageIcon className="text-gray-300" size={48} />
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 left-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      item.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {item.status === "active" ? "Live" : "Draft"}
                  </span>
                </div>

                {/* Views Counter */}
                <div className="absolute top-4 right-4 flex items-center gap-1 text-gray-600 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  <Eye size={12} />
                  <span className="text-xs">{item.views.toLocaleString()}</span>
                </div>
              </div>

              {/* Item Info */}
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{item.category}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500 fill-current" />
                    <span className="font-semibold">{item.rating}</span>
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {item.description}
                </p>

                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="font-bold text-gray-900 text-xl">
                      ₹{item.price}
                    </span>
                    <span className="text-gray-500 text-sm ml-2">
                      per serving
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600 text-sm">
                    <TrendingUp size={14} />
                    <span>{item.interactions} interactions</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleViewAR(item)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                  >
                    <Eye size={14} />
                    View AR
                  </button>
                  <button
                    onClick={() => handleGenerateQR(item)}
                    className="flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm"
                  >
                    <QrCode size={14} />
                    QR Code
                  </button>
                  <button
                    onClick={() => handleToggleStatus(item.id)}
                    className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm ${
                      item.status === "active"
                        ? "bg-red-100 text-red-700 hover:bg-red-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {item.status === "active" ? (
                      <>
                        <Pause size={14} />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play size={14} />
                        Activate
                      </>
                    )}
                  </button>
                </div>

                {/* Additional Actions */}
                <div className="mt-4 flex justify-center gap-3">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowAddModal(true);
                    }}
                    className="text-gray-500 hover:text-blue-600"
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setShowStatsModal(true);
                    }}
                    className="text-gray-500 hover:text-purple-600"
                    title="Analytics"
                  >
                    <BarChart3 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-gray-500 hover:text-red-600"
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="inline-block p-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl mb-6">
              <Smartphone size={64} className="text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              No AR Items Found
            </h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              {searchTerm
                ? `No items match "${searchTerm}". Try a different search.`
                : "Get started by adding your first AR menu item!"}
            </p>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700"
            >
              <Plus size={18} className="inline mr-2" />
              Add First AR Item
            </button>
          </div>
        )}

        {/* AR Demo Section */}
        <div className="bg-gradient-to-r from-blue-900 to-purple-900 rounded-2xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold text-white mb-4">
                Experience AR Dining
              </h2>
              <p className="text-blue-100 mb-6">
                Let customers visualize dishes in 3D before ordering. Increase
                engagement and reduce order uncertainty with immersive AR
                experiences.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {[
                  { icon: "📈", text: "Increase orders by 40%" },
                  { icon: "⭐", text: "Improve ratings by 35%" },
                  { icon: "👁️", text: "3x more views" },
                  { icon: "💰", text: "Higher order value" },
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{benefit.icon}</span>
                    <span className="text-white text-sm">{benefit.text}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() =>
                    toast("Starting demo experience...", { icon: "👓" })
                  }
                  className="px-6 py-3 bg-white text-blue-900 font-semibold rounded-lg hover:bg-gray-100"
                >
                  Try Demo AR
                </button>
                <button
                  onClick={() =>
                    window.open("https://example.com/guide", "_blank")
                  }
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-lg hover:bg-white/10"
                >
                  View Setup Guide
                </button>
              </div>
            </div>

            <div className="lg:w-1/2 relative">
              {/* Phone Mockup */}
              <div className="relative w-64 h-[500px] bg-gray-900 rounded-[40px] mx-auto border-8 border-gray-800">
                <div className="absolute inset-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-[32px] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4 animate-bounce">👓</div>
                      <div className="text-white font-bold text-lg">
                        AR Experience
                      </div>
                      <div className="text-blue-100 text-sm mt-2">
                        Point camera at menu
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-800 rounded-b-2xl"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Add AR Item Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {selectedItem ? "Edit AR Item" : "Add AR Item"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Create immersive AR experience
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setShowAddModal(false);
                      setSelectedItem(null);
                    }}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Dish Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={selectedItem?.name || newItem.name}
                        onChange={(e) =>
                          setNewItem({ ...newItem, name: e.target.value })
                        }
                        placeholder="e.g., Paneer Tikka Masala"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={selectedItem?.category || newItem.category}
                        onChange={(e) =>
                          setNewItem({ ...newItem, category: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {CATEGORIES.slice(1).map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price (₹) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={selectedItem?.price || newItem.price}
                        onChange={(e) =>
                          setNewItem({ ...newItem, price: e.target.value })
                        }
                        placeholder="320"
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        AR Type <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={
                          selectedItem?.arType.toLowerCase() || newItem.arType
                        }
                        onChange={(e) =>
                          setNewItem({ ...newItem, arType: e.target.value })
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {AR_TYPES.map((type) => (
                          <option key={type.id} value={type.id}>
                            {type.icon} {type.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={selectedItem?.description || newItem.description}
                      onChange={(e) =>
                        setNewItem({ ...newItem, description: e.target.value })
                      }
                      placeholder="Describe the dish and AR experience..."
                      rows="3"
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>

                  {/* Media Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      AR Media
                    </label>
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => handleMediaUpload("image")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <ImageIcon size={16} />
                        Upload Image
                      </button>
                      <button
                        onClick={() => handleMediaUpload("video")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Video size={16} />
                        Upload Video
                      </button>
                      <button
                        onClick={() => handleMediaUpload("3d")}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                      >
                        <Cube size={16} />
                        3D Model
                      </button>
                    </div>

                    {newItem.media.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {newItem.media.map((media, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg"
                          >
                            <span className="text-sm text-gray-700">
                              {media.type.toUpperCase()}
                            </span>
                            <button
                              onClick={() => {
                                setNewItem({
                                  ...newItem,
                                  media: newItem.media.filter(
                                    (_, i) => i !== index
                                  ),
                                });
                              }}
                              className="text-red-500 hover:text-red-700"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* AR Preview */}
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-medium text-gray-700">
                        AR Preview
                      </span>
                      <button
                        onClick={() =>
                          toast("Preview updated!", { icon: "👁️" })
                        }
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Refresh Preview
                      </button>
                    </div>
                    <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🍽️</div>
                        <div className="text-gray-600">
                          AR Preview will appear here
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <button
                      onClick={() => {
                        setShowAddModal(false);
                        setSelectedItem(null);
                      }}
                      className="px-6 py-3 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddItem}
                      className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800"
                    >
                      {selectedItem ? "Update Item" : "Add to AR Menu"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Modal */}
        {showStatsModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      AR Analytics
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {selectedItem.name} performance
                    </p>
                  </div>
                  <button
                    onClick={() => setShowStatsModal(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  {[
                    {
                      label: "Total Views",
                      value: selectedItem.views,
                      icon: Eye,
                      color: "text-blue-600",
                      bg: "bg-blue-50",
                    },
                    {
                      label: "Interactions",
                      value: selectedItem.interactions,
                      icon: TrendingUp,
                      color: "text-green-600",
                      bg: "bg-green-50",
                    },
                    {
                      label: "Rating",
                      value: selectedItem.rating,
                      icon: Star,
                      color: "text-yellow-600",
                      bg: "bg-yellow-50",
                    },
                    {
                      label: "QR Scans",
                      value: Math.floor(selectedItem.views / 3),
                      icon: QrCode,
                      color: "text-purple-600",
                      bg: "bg-purple-50",
                    },
                  ].map((stat, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${stat.bg}`}>
                          <stat.icon className={stat.color} size={20} />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Additional Stats */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Average View Duration</span>
                    <span className="font-semibold">45 seconds</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Conversion Rate</span>
                    <span className="font-semibold text-green-600">12.5%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-700">Peak View Time</span>
                    <span className="font-semibold">7:00 PM - 9:00 PM</span>
                  </div>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={() => setShowStatsModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AR Viewer */}
        {showARViewer && renderARViewer()}

        {/* QR Modal */}
        {showQRModal && renderQRModal()}
      </div>
    </div>
  );
}

// Missing Cube icon component
const Cube = ({ size, className }) => (
  <svg
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);
