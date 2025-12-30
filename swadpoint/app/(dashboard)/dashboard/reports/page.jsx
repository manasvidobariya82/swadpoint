// app/analysis/page.jsx - Advanced Analysis Dashboard
"use client";

import { useState, useEffect, useRef } from "react";
import {
  LineChart,
  BarChart3,
  PieChart,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  ShoppingCart,
  Package,
  Globe,
  Smartphone,
  Target,
  Filter,
  Download,
  RefreshCw,
  Calendar,
  Clock,
  Award,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Zap,
  Eye,
  MoreVertical,
  Plus,
  Minus,
  ChevronDown,
  ChevronUp,
  Settings,
  Share2,
  Printer,
  Bell,
  AlertCircle,
  CheckCircle,
  XCircle,
  Search,
  Star,
  Heart,
  MapPin,
  CreditCard,
  Shield,
  Lock,
  Unlock,
  Cpu,
  Database,
  Wifi,
  Cloud,
  Battery,
  Activity,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Moon,
  Coffee,
  Pizza,
  Utensils,
  Wine,
  Dessert,
  ChefHat,
  Truck,
  MessageSquare,
  Phone,
  Mail,
  UserCheck,
  Video,
  Radio,
  Volume2,
  ThumbsUp,
  ThumbsDown,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  RadialLinearScale
);

// Enhanced Sample Data
const ANALYSIS_DATA = {
  // Time-series data
  performanceTimeline: [
    { month: "Jan", revenue: 45000, users: 1200, conversion: 4.2 },
    { month: "Feb", revenue: 52000, users: 1400, conversion: 4.5 },
    { month: "Mar", revenue: 61000, users: 1650, conversion: 4.8 },
    { month: "Apr", revenue: 58000, users: 1550, conversion: 4.3 },
    { month: "May", revenue: 72000, users: 1900, conversion: 5.1 },
    { month: "Jun", revenue: 68000, users: 1800, conversion: 4.9 },
    { month: "Jul", revenue: 79000, users: 2100, conversion: 5.3 },
    { month: "Aug", revenue: 85000, users: 2250, conversion: 5.6 },
    { month: "Sep", revenue: 92000, users: 2400, conversion: 5.8 },
    { month: "Oct", revenue: 88000, users: 2300, conversion: 5.4 },
    { month: "Nov", revenue: 95000, users: 2500, conversion: 5.9 },
    { month: "Dec", revenue: 110000, users: 2800, conversion: 6.2 },
  ],

  // Category performance
  categoryPerformance: [
    { category: "Pizza", revenue: 312500, growth: 12.5, marketShare: 28 },
    { category: "Main Course", revenue: 245000, growth: 8.2, marketShare: 22 },
    { category: "Breads", revenue: 105000, growth: 15.3, marketShare: 9 },
    { category: "Rice Dishes", revenue: 225000, growth: 5.7, marketShare: 20 },
    { category: "Desserts", revenue: 84000, growth: 18.9, marketShare: 8 },
    { category: "Beverages", revenue: 98000, growth: 22.1, marketShare: 9 },
    { category: "Appetizers", revenue: 75000, growth: 11.4, marketShare: 7 },
  ],

  // User demographics
  userDemographics: [
    { age: "18-24", percentage: 25, avgSpend: 850, frequency: 2.1 },
    { age: "25-34", percentage: 38, avgSpend: 1200, frequency: 3.5 },
    { age: "35-44", percentage: 22, avgSpend: 1450, frequency: 2.8 },
    { age: "45-54", percentage: 10, avgSpend: 1100, frequency: 1.9 },
    { age: "55+", percentage: 5, avgSpend: 950, frequency: 1.2 },
  ],

  // Geographic distribution
  geographicData: [
    { region: "North", revenue: 285000, orders: 1250, growth: 15.2 },
    { region: "South", revenue: 320000, orders: 1420, growth: 18.5 },
    { region: "East", revenue: 195000, orders: 850, growth: 12.8 },
    { region: "West", revenue: 265000, orders: 1150, growth: 14.3 },
    { region: "Central", revenue: 175000, orders: 780, growth: 10.7 },
  ],

  // Device usage
  deviceUsage: [
    { device: "Mobile", percentage: 68, sessions: 8500, conversion: 4.8 },
    { device: "Desktop", percentage: 25, sessions: 3125, conversion: 6.2 },
    { device: "Tablet", percentage: 7, sessions: 875, conversion: 3.9 },
  ],

  // Customer satisfaction
  satisfactionMetrics: [
    { metric: "Food Quality", score: 4.8, trend: "up", change: 0.2 },
    { metric: "Delivery Time", score: 4.5, trend: "up", change: 0.3 },
    { metric: "Customer Service", score: 4.7, trend: "stable", change: 0 },
    { metric: "App Experience", score: 4.6, trend: "up", change: 0.1 },
    { metric: "Value for Money", score: 4.4, trend: "down", change: -0.1 },
  ],

  // Real-time metrics
  realTimeMetrics: [
    { time: "10:00 AM", orders: 45, revenue: 22500, avgTicket: 500 },
    { time: "11:00 AM", orders: 38, revenue: 19000, avgTicket: 500 },
    { time: "12:00 PM", orders: 125, revenue: 62500, avgTicket: 500 },
    { time: "1:00 PM", orders: 98, revenue: 49000, avgTicket: 500 },
    { time: "2:00 PM", orders: 52, revenue: 26000, avgTicket: 500 },
    { time: "3:00 PM", orders: 45, revenue: 22500, avgTicket: 500 },
    { time: "4:00 PM", orders: 65, revenue: 32500, avgTicket: 500 },
    { time: "5:00 PM", orders: 110, revenue: 55000, avgTicket: 500 },
    { time: "6:00 PM", orders: 185, revenue: 92500, avgTicket: 500 },
    { time: "7:00 PM", orders: 220, revenue: 110000, avgTicket: 500 },
    { time: "8:00 PM", orders: 195, revenue: 97500, avgTicket: 500 },
    { time: "9:00 PM", orders: 85, revenue: 42500, avgTicket: 500 },
  ],

  // Competitor analysis
  competitorAnalysis: [
    { competitor: "Brand A", marketShare: 32, growth: 8.5, rating: 4.3 },
    { competitor: "Brand B", marketShare: 28, growth: 12.2, rating: 4.5 },
    { competitor: "Our Brand", marketShare: 25, growth: 15.8, rating: 4.7 },
    { competitor: "Brand C", marketShare: 15, growth: 5.7, rating: 4.1 },
  ],

  // Marketing channels
  marketingChannels: [
    { channel: "Social Media", cost: 25000, revenue: 125000, roi: 5.0 },
    { channel: "Email", cost: 15000, revenue: 85000, roi: 5.7 },
    { channel: "Search Ads", cost: 35000, revenue: 195000, roi: 5.6 },
    { channel: "Referral", cost: 5000, revenue: 45000, roi: 9.0 },
    { channel: "Direct", cost: 10000, revenue: 75000, roi: 7.5 },
  ],
};

// Time ranges
const TIME_RANGES = [
  { label: "Real-time", value: "realtime", icon: "⚡" },
  { label: "Today", value: "today", icon: "📅" },
  { label: "Yesterday", value: "yesterday", icon: "↩️" },
  { label: "Last 7 Days", value: "last7", icon: "📆" },
  { label: "Last 30 Days", value: "last30", icon: "🗓️" },
  { label: "This Month", value: "month", icon: "📊" },
  { label: "Last Month", value: "lastMonth", icon: "📉" },
  { label: "This Year", value: "year", icon: "🎯" },
  { label: "Custom", value: "custom", icon: "⚙️" },
];

// Analysis types
const ANALYSIS_TYPES = [
  { id: "performance", name: "Performance", icon: "📈", color: "blue" },
  { id: "demographics", name: "Demographics", icon: "👥", color: "purple" },
  { id: "geographic", name: "Geographic", icon: "🌍", color: "green" },
  { id: "competitive", name: "Competitive", icon: "🏆", color: "yellow" },
  { id: "marketing", name: "Marketing", icon: "🎯", color: "pink" },
  { id: "operational", name: "Operational", icon: "⚙️", color: "indigo" },
  { id: "financial", name: "Financial", icon: "💰", color: "emerald" },
  { id: "predictive", name: "Predictive", icon: "🔮", color: "violet" },
];

export default function AdvancedAnalysisBoard() {
  // State Management
  const [selectedRange, setSelectedRange] = useState("last30");
  const [selectedAnalysis, setSelectedAnalysis] = useState("performance");
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setDate(new Date().getDate() - 30))
      .toISOString()
      .split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [expandedCards, setExpandedCards] = useState([]);
  const [chartType, setChartType] = useState("line");
  const [loading, setLoading] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [realTimeData, setRealTimeData] = useState([]);

  // Real-time stats
  const [realTimeStats, setRealTimeStats] = useState({
    currentOrders: 0,
    hourlyRevenue: 0,
    avgResponseTime: 0,
    customerSatisfaction: 0,
    systemHealth: 100,
    peakHour: "",
  });

  // Refs
  const intervalRef = useRef(null);

  // Initialize real-time updates
  useEffect(() => {
    // Load initial data
    loadInitialData();

    // Setup real-time updates
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        updateRealTimeStats();
        simulateNewData();
      }, 3000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [autoRefresh]);

  const loadInitialData = () => {
    // Calculate initial stats
    const totalRevenue = ANALYSIS_DATA.performanceTimeline.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const totalUsers = ANALYSIS_DATA.performanceTimeline.reduce(
      (sum, item) => sum + item.users,
      0
    );
    const avgConversion =
      ANALYSIS_DATA.performanceTimeline.reduce(
        (sum, item) => sum + item.conversion,
        0
      ) / ANALYSIS_DATA.performanceTimeline.length;

    // Find peak hour from real-time data
    const peakHour = ANALYSIS_DATA.realTimeMetrics.reduce((max, hour) =>
      hour.orders > max.orders ? hour : max
    );

    setRealTimeStats({
      currentOrders: 42,
      hourlyRevenue: 21000,
      avgResponseTime: 2.8,
      customerSatisfaction: 4.6,
      systemHealth: 98,
      peakHour: peakHour.time,
      totalRevenue,
      totalUsers,
      avgConversion,
    });

    // Initialize real-time data
    setRealTimeData(ANALYSIS_DATA.realTimeMetrics.slice(-6));
  };

  const updateRealTimeStats = () => {
    setRealTimeStats((prev) => ({
      ...prev,
      currentOrders: Math.max(
        0,
        prev.currentOrders + (Math.random() > 0.5 ? 1 : -1)
      ),
      hourlyRevenue: Math.max(
        0,
        prev.hourlyRevenue + (Math.random() > 0.5 ? 500 : -300)
      ),
      customerSatisfaction: Math.min(
        5,
        Math.max(
          4,
          prev.customerSatisfaction + (Math.random() > 0.5 ? 0.1 : -0.1)
        )
      ),
      systemHealth: Math.min(
        100,
        Math.max(90, prev.systemHealth + (Math.random() > 0.5 ? 0.5 : -0.5))
      ),
    }));
  };

  const simulateNewData = () => {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();
    const isPeakHour = hour >= 18 && hour <= 20;

    const newDataPoint = {
      time: `${hour}:${minute.toString().padStart(2, "0")}`,
      orders: Math.floor(Math.random() * (isPeakHour ? 50 : 20)) + 10,
      revenue: Math.floor(Math.random() * (isPeakHour ? 25000 : 10000)) + 5000,
      avgTicket: Math.floor(Math.random() * 200) + 400,
    };

    setRealTimeData((prev) => {
      const newData = [...prev, newDataPoint];
      return newData.slice(-12); // Keep last 12 data points
    });
  };

  // Handle date range change
  const handleRangeChange = (range) => {
    setSelectedRange(range);

    if (range === "realtime") {
      setAutoRefresh(true);
      toast.success("Real-time mode activated", { icon: "⚡" });
    }
  };

  // Handle export
  const handleExport = (format) => {
    setIsExporting(true);
    toast.promise(
      new Promise((resolve) => {
        setTimeout(() => {
          setIsExporting(false);
          resolve();
        }, 1500);
      }),
      {
        loading: `Exporting analysis as ${format.toUpperCase()}...`,
        success: `Analysis exported as ${format.toUpperCase()}!`,
        error: "Export failed",
      }
    );
  };

  // Calculate KPIs
  const calculateKPIs = () => {
    const revenueData = ANALYSIS_DATA.performanceTimeline;
    const totalRevenue = revenueData.reduce(
      (sum, item) => sum + item.revenue,
      0
    );
    const totalUsers = revenueData.reduce((sum, item) => sum + item.users, 0);
    const avgConversion =
      revenueData.reduce((sum, item) => sum + item.conversion, 0) /
      revenueData.length;
    const monthlyGrowth =
      ((revenueData[revenueData.length - 1].revenue -
        revenueData[revenueData.length - 2].revenue) /
        revenueData[revenueData.length - 2].revenue) *
      100;

    const categoryData = ANALYSIS_DATA.categoryPerformance;
    const topCategory = categoryData.reduce((max, cat) =>
      cat.revenue > max.revenue ? cat : cat
    );

    return {
      totalRevenue,
      totalUsers,
      avgConversion,
      monthlyGrowth,
      topCategory: topCategory.category,
      marketShare: topCategory.marketShare,
    };
  };

  const kpis = calculateKPIs();

  // Render real-time metrics
  const renderRealTimeMetrics = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {[
        {
          title: "Current Orders",
          value: realTimeStats.currentOrders,
          icon: ShoppingCart,
          color: "text-blue-600",
          bgColor: "bg-blue-50 dark:bg-blue-900/20",
          change: "+3 this hour",
          trend: "up",
        },
        {
          title: "Hourly Revenue",
          value: `₹${realTimeStats.hourlyRevenue.toLocaleString()}`,
          icon: DollarSign,
          color: "text-green-600",
          bgColor: "bg-green-50 dark:bg-green-900/20",
          change: "+12.5%",
          trend: "up",
        },
        {
          title: "Avg Response",
          value: `${realTimeStats.avgResponseTime}s`,
          icon: Clock,
          color: "text-purple-600",
          bgColor: "bg-purple-50 dark:bg-purple-900/20",
          change: "Target: <3s",
          trend: realTimeStats.avgResponseTime < 3 ? "up" : "down",
        },
        {
          title: "System Health",
          value: `${realTimeStats.systemHealth}%`,
          icon: Activity,
          color:
            realTimeStats.systemHealth > 95
              ? "text-green-600"
              : "text-yellow-600",
          bgColor:
            realTimeStats.systemHealth > 95
              ? "bg-green-50 dark:bg-green-900/20"
              : "bg-yellow-50 dark:bg-yellow-900/20",
          change:
            realTimeStats.systemHealth > 95 ? "Optimal" : "Attention needed",
          trend: realTimeStats.systemHealth > 95 ? "up" : "down",
        },
      ].map((metric, index) => (
        <div
          key={index}
          className={`rounded-xl shadow-lg p-6 transition-all hover:scale-[1.02] ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${metric.bgColor}`}>
              <metric.icon className={`h-6 w-6 ${metric.color}`} />
            </div>
            <div
              className={`flex items-center gap-1 ${
                metric.trend === "up" ? "text-green-600" : "text-red-600"
              }`}
            >
              {metric.trend === "up" ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className="text-sm font-medium">{metric.change}</span>
            </div>
          </div>
          <h3
            className={`text-2xl font-bold mt-4 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            {metric.value}
          </h3>
          <p
            className={`text-sm mt-1 ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {metric.title}
          </p>
        </div>
      ))}
    </div>
  );

  // Render performance chart
  const renderPerformanceChart = () => {
    const data = {
      labels: ANALYSIS_DATA.performanceTimeline.map((d) => d.month),
      datasets: [
        {
          label: "Revenue (₹)",
          data: ANALYSIS_DATA.performanceTimeline.map((d) => d.revenue),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
          yAxisID: "y",
        },
        {
          label: "Users",
          data: ANALYSIS_DATA.performanceTimeline.map((d) => d.users),
          borderColor: "rgb(139, 92, 246)",
          backgroundColor: "rgba(139, 92, 246, 0.1)",
          fill: true,
          tension: 0.4,
          yAxisID: "y1",
        },
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Revenue (₹)",
          },
          ticks: {
            callback: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Users",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: darkMode ? "#fff" : "#374151",
          },
        },
        tooltip: {
          callbacks: {
            label: function (context) {
              let label = context.dataset.label || "";
              if (label) {
                label += ": ";
              }
              if (context.parsed.y !== null) {
                if (context.dataset.label.includes("Revenue")) {
                  label += "₹" + context.parsed.y.toLocaleString();
                } else {
                  label += context.parsed.y.toLocaleString();
                }
              }
              return label;
            },
          },
        },
      },
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Performance Timeline
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Revenue vs Users growth over time
            </p>
          </div>
          <div className="flex items-center gap-2">
            <LineChart className="text-blue-600" />
            <BarChart3 className="text-purple-600" />
          </div>
        </div>
        <div className="h-80">
          <Line data={data} options={options} />
        </div>
      </div>
    );
  };

  // Render category performance
  const renderCategoryPerformance = () => {
    const data = {
      labels: ANALYSIS_DATA.categoryPerformance.map((d) => d.category),
      datasets: [
        {
          label: "Revenue (₹)",
          data: ANALYSIS_DATA.categoryPerformance.map((d) => d.revenue),
          backgroundColor: [
            "rgba(59, 130, 246, 0.7)",
            "rgba(139, 92, 246, 0.7)",
            "rgba(34, 197, 94, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(239, 68, 68, 0.7)",
            "rgba(168, 85, 247, 0.7)",
            "rgba(6, 182, 212, 0.7)",
          ],
          borderColor: [
            "rgb(59, 130, 246)",
            "rgb(139, 92, 246)",
            "rgb(34, 197, 94)",
            "rgb(245, 158, 11)",
            "rgb(239, 68, 68)",
            "rgb(168, 85, 247)",
            "rgb(6, 182, 212)",
          ],
          borderWidth: 2,
        },
      ],
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Category Performance
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Revenue distribution across categories
            </p>
          </div>
          <PieChart className="text-blue-600" />
        </div>
        <div className="h-64">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return "₹" + value.toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-6 space-y-3">
          {ANALYSIS_DATA.categoryPerformance.map((category, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "rgb(59, 130, 246)",
                      "rgb(139, 92, 246)",
                      "rgb(34, 197, 94)",
                      "rgb(245, 158, 11)",
                      "rgb(239, 68, 68)",
                      "rgb(168, 85, 247)",
                      "rgb(6, 182, 212)",
                    ][index],
                  }}
                />
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {category.category}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-semibold">
                  ₹{category.revenue.toLocaleString()}
                </span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    category.growth > 10
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                  }`}
                >
                  {category.growth}% growth
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render user demographics
  const renderUserDemographics = () => {
    const data = {
      labels: ANALYSIS_DATA.userDemographics.map((d) => d.age),
      datasets: [
        {
          label: "Percentage",
          data: ANALYSIS_DATA.userDemographics.map((d) => d.percentage),
          backgroundColor: "rgba(139, 92, 246, 0.7)",
          borderColor: "rgb(139, 92, 246)",
          borderWidth: 2,
        },
      ],
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              User Demographics
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Age distribution and spending patterns
            </p>
          </div>
          <Users className="text-purple-600" />
        </div>
        <div className="h-64">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  ticks: {
                    callback: function (value) {
                      return value + "%";
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-6 space-y-4">
          {ANALYSIS_DATA.userDemographics.map((demo, index) => (
            <div
              key={index}
              className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex justify-between items-center">
                <div>
                  <span
                    className={`font-medium ${
                      darkMode ? "text-gray-200" : "text-gray-700"
                    }`}
                  >
                    {demo.age} years
                  </span>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <span className="text-gray-600 dark:text-gray-400">
                      Avg spend: ₹{demo.avgSpend}
                    </span>
                    <span className="text-gray-600 dark:text-gray-400">
                      Frequency: {demo.frequency}/month
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      darkMode ? "text-white" : "text-gray-900"
                    }`}
                  >
                    {demo.percentage}%
                  </div>
                  <div className="text-sm text-gray-500">Market share</div>
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>0%</span>
                  <span>Distribution</span>
                  <span>100%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                    style={{ width: `${demo.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render geographic distribution
  const renderGeographicDistribution = () => {
    const data = {
      labels: ANALYSIS_DATA.geographicData.map((d) => d.region),
      datasets: [
        {
          label: "Revenue (₹)",
          data: ANALYSIS_DATA.geographicData.map((d) => d.revenue),
          backgroundColor: "rgba(34, 197, 94, 0.7)",
          borderColor: "rgb(34, 197, 94)",
          borderWidth: 2,
        },
      ],
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Geographic Distribution
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Regional performance analysis
            </p>
          </div>
          <Globe className="text-green-600" />
        </div>
        <div className="h-64">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false,
                },
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return "₹" + value.toLocaleString();
                    },
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-4">
          {ANALYSIS_DATA.geographicData.map((region, index) => (
            <div
              key={index}
              className="text-center p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div
                className={`text-lg font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {region.region}
              </div>
              <div className="mt-2">
                <div className="text-2xl font-bold text-green-600">
                  ₹{region.revenue.toLocaleString()}
                </div>
                <div className="text-sm text-gray-500">Revenue</div>
              </div>
              <div className="mt-3 flex justify-between text-xs">
                <div>
                  <div className="font-semibold">{region.orders}</div>
                  <div className="text-gray-500">Orders</div>
                </div>
                <div>
                  <div
                    className={`font-semibold ${
                      region.growth > 15 ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {region.growth}%
                  </div>
                  <div className="text-gray-500">Growth</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render competitor analysis
  const renderCompetitorAnalysis = () => {
    const data = {
      labels: ANALYSIS_DATA.competitorAnalysis.map((d) => d.competitor),
      datasets: [
        {
          label: "Market Share",
          data: ANALYSIS_DATA.competitorAnalysis.map((d) => d.marketShare),
          backgroundColor: "rgba(245, 158, 11, 0.7)",
          borderColor: "rgb(245, 158, 11)",
          borderWidth: 2,
        },
        {
          label: "Growth Rate",
          data: ANALYSIS_DATA.competitorAnalysis.map((d) => d.growth),
          backgroundColor: "rgba(59, 130, 246, 0.7)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 2,
        },
      ],
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Competitor Analysis
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Market position and growth comparison
            </p>
          </div>
          <Target className="text-yellow-600" />
        </div>
        <div className="h-64">
          <Bar
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: function (value) {
                      return value + "%";
                    },
                  },
                },
              },
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    color: darkMode ? "#fff" : "#374151",
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-6 space-y-4">
          {ANALYSIS_DATA.competitorAnalysis.map((competitor, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg ${
                competitor.competitor === "Our Brand"
                  ? "ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : "bg-gray-50 dark:bg-gray-700/50"
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      competitor.competitor === "Our Brand"
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300"
                        : "bg-gray-100 text-gray-600 dark:bg-gray-600 dark:text-gray-300"
                    }`}
                  >
                    <span className="font-bold">
                      {competitor.competitor.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {competitor.competitor}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {competitor.rating}/5
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`text-lg font-bold ${
                      competitor.growth > 10
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {competitor.growth}%
                  </div>
                  <div className="text-sm text-gray-500">Growth</div>
                </div>
              </div>
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Market Share</span>
                  <span>{competitor.marketShare}%</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      competitor.competitor === "Our Brand"
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500"
                        : "bg-gradient-to-r from-gray-400 to-gray-300"
                    }`}
                    style={{ width: `${competitor.marketShare}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render marketing channels
  const renderMarketingChannels = () => {
    const data = {
      labels: ANALYSIS_DATA.marketingChannels.map((d) => d.channel),
      datasets: [
        {
          label: "ROI",
          data: ANALYSIS_DATA.marketingChannels.map((d) => d.roi),
          backgroundColor: [
            "rgba(239, 68, 68, 0.7)",
            "rgba(59, 130, 246, 0.7)",
            "rgba(34, 197, 94, 0.7)",
            "rgba(245, 158, 11, 0.7)",
            "rgba(168, 85, 247, 0.7)",
          ],
          borderColor: [
            "rgb(239, 68, 68)",
            "rgb(59, 130, 246)",
            "rgb(34, 197, 94)",
            "rgb(245, 158, 11)",
            "rgb(168, 85, 247)",
          ],
          borderWidth: 2,
        },
      ],
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Marketing Channels
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              ROI analysis across different channels
            </p>
          </div>
          <TrendingUp className="text-pink-600" />
        </div>
        <div className="h-64">
          <Doughnut
            data={data}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "right",
                  labels: {
                    color: darkMode ? "#fff" : "#374151",
                    padding: 20,
                  },
                },
              },
            }}
          />
        </div>
        <div className="mt-6 space-y-3">
          {ANALYSIS_DATA.marketingChannels.map((channel, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: [
                      "rgb(239, 68, 68)",
                      "rgb(59, 130, 246)",
                      "rgb(34, 197, 94)",
                      "rgb(245, 158, 11)",
                      "rgb(168, 85, 247)",
                    ][index],
                  }}
                />
                <span
                  className={`font-medium ${
                    darkMode ? "text-gray-200" : "text-gray-700"
                  }`}
                >
                  {channel.channel}
                </span>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{channel.revenue.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Revenue</div>
                </div>
                <div className="text-right">
                  <div
                    className={`font-semibold ${
                      channel.roi > 7 ? "text-green-600" : "text-yellow-600"
                    }`}
                  >
                    {channel.roi}x
                  </div>
                  <div className="text-xs text-gray-500">ROI</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">
                    ₹{channel.cost.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500">Cost</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render real-time chart
  const renderRealTimeChart = () => {
    const data = {
      labels: realTimeData.map((d) => d.time),
      datasets: [
        {
          label: "Orders",
          data: realTimeData.map((d) => d.orders),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          fill: true,
          tension: 0.4,
        },
        {
          label: "Revenue (₹)",
          data: realTimeData.map((d) => d.revenue),
          borderColor: "rgb(34, 197, 94)",
          backgroundColor: "rgba(34, 197, 94, 0.1)",
          fill: true,
          tension: 0.4,
          yAxisID: "y1",
        },
      ],
    };

    const options = {
      responsive: true,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Orders",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Revenue (₹)",
          },
          grid: {
            drawOnChartArea: false,
          },
          ticks: {
            callback: function (value) {
              return "₹" + value.toLocaleString();
            },
          },
        },
      },
      plugins: {
        legend: {
          position: "top",
          labels: {
            color: darkMode ? "#fff" : "#374151",
          },
        },
      },
    };

    return (
      <div
        className={`rounded-xl shadow-lg p-6 ${
          darkMode ? "bg-gray-800" : "bg-white"
        }`}
      >
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3
              className={`text-lg font-semibold ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              Real-time Activity
            </h3>
            <p
              className={`text-sm ${
                darkMode ? "text-gray-300" : "text-gray-600"
              }`}
            >
              Live orders and revenue tracking
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Live
              </span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-3 py-1 text-sm rounded-lg ${
                autoRefresh
                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                  : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
              }`}
            >
              {autoRefresh ? "Auto: ON" : "Auto: OFF"}
            </button>
          </div>
        </div>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-2xl font-bold text-blue-600">
              {realTimeData.reduce((sum, d) => sum + d.orders, 0)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Orders
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-2xl font-bold text-green-600">
              ₹
              {realTimeData
                .reduce((sum, d) => sum + d.revenue, 0)
                .toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Total Revenue
            </div>
          </div>
          <div className="text-center p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
            <div className="text-2xl font-bold text-purple-600">
              {Math.round(
                realTimeData.reduce((sum, d) => sum + d.avgTicket, 0) /
                  realTimeData.length
              )}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Avg Ticket
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render KPIs summary
  const renderKPIsSummary = () => (
    <div
      className={`rounded-xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3
            className={`text-lg font-semibold ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Key Performance Indicators
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Comprehensive business metrics overview
          </p>
        </div>
        <Target className="text-blue-600" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          {
            title: "Total Revenue",
            value: `₹${kpis.totalRevenue.toLocaleString()}`,
            change: `+${kpis.monthlyGrowth.toFixed(1)}%`,
            icon: DollarSign,
            color: "text-green-600",
            target: "Target: ₹1.2M",
            progress: Math.min(100, (kpis.totalRevenue / 1200000) * 100),
          },
          {
            title: "Total Users",
            value: kpis.totalUsers.toLocaleString(),
            change: "+15.8%",
            icon: Users,
            color: "text-blue-600",
            target: "Target: 25K",
            progress: Math.min(100, (kpis.totalUsers / 25000) * 100),
          },
          {
            title: "Avg Conversion",
            value: `${kpis.avgConversion.toFixed(1)}%`,
            change: "+0.8%",
            icon: TrendingUpIcon,
            color: "text-purple-600",
            target: "Target: 5.5%",
            progress: Math.min(100, (kpis.avgConversion / 5.5) * 100),
          },
          {
            title: "Top Category",
            value: kpis.topCategory,
            change: `${kpis.marketShare}% share`,
            icon: Award,
            color: "text-yellow-600",
            target: "Market Leader",
            progress: kpis.marketShare,
          },
        ].map((kpi, index) => (
          <div key={index} className="text-center">
            <div
              className={`inline-flex p-3 rounded-lg ${
                darkMode
                  ? kpi.color.replace("text-", "bg-") + "/20"
                  : kpi.color.replace("text-", "bg-").replace("-600", "-50")
              }`}
            >
              <kpi.icon className={`h-8 w-8 ${kpi.color}`} />
            </div>
            <div className="mt-4">
              <div
                className={`text-2xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                {kpi.value}
              </div>
              <div
                className={`text-sm mt-1 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {kpi.title}
              </div>
              <div className="text-xs text-gray-500 mt-2">{kpi.change}</div>
              {kpi.target && (
                <div className="mt-3">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{kpi.target}</span>
                    <span>{kpi.progress.toFixed(1)}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        kpi.progress > 80
                          ? "bg-green-500"
                          : kpi.progress > 60
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      }`}
                      style={{ width: `${kpi.progress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Render analysis type selector
  const renderAnalysisTypeSelector = () => (
    <div
      className={`rounded-xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Analysis Types
          </h3>
          <p
            className={`text-sm ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
          >
            Select analysis category for detailed insights
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            />
            <input
              type="text"
              placeholder="Search analysis..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`pl-10 pr-4 py-2 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                  : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
              }`}
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-700">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid" ? "bg-white dark:bg-gray-600" : ""
              }`}
              title="Grid View"
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div
                  className={`rounded-sm ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`rounded-sm ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`rounded-sm ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`rounded-sm ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-white dark:bg-gray-600" : ""
              }`}
              title="List View"
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div
                  className={`h-1 rounded ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 rounded ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
                <div
                  className={`h-1 rounded ${
                    darkMode ? "bg-gray-300" : "bg-gray-600"
                  }`}
                ></div>
              </div>
            </button>
          </div>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-yellow-300"
                : "bg-gray-200 text-gray-700"
            }`}
            title={darkMode ? "Light Mode" : "Dark Mode"}
          >
            {darkMode ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      <div className="mt-6">
        <div className="flex flex-wrap gap-2">
          {ANALYSIS_TYPES.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedAnalysis(type.id)}
              className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                selectedAnalysis === type.id
                  ? `bg-${type.color}-600 text-white`
                  : darkMode
                  ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <span className="text-lg">{type.icon}</span>
              <span className="font-medium">{type.name}</span>
              {selectedAnalysis === type.id && (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  // Render time range selector
  const renderTimeRangeSelector = () => (
    <div
      className={`rounded-xl shadow-lg p-6 mb-8 ${
        darkMode ? "bg-gray-800" : "bg-white"
      }`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h3
            className={`text-lg font-semibold mb-2 ${
              darkMode ? "text-white" : "text-gray-900"
            }`}
          >
            Time Range
          </h3>
          <div className="flex flex-wrap gap-2">
            {TIME_RANGES.map((range) => (
              <button
                key={range.value}
                onClick={() => handleRangeChange(range.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2 ${
                  selectedRange === range.value
                    ? "bg-blue-600 text-white"
                    : darkMode
                    ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{range.icon}</span>
                {range.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {showCustomDate && (
            <div className="flex gap-2">
              <input
                type="date"
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
                className={`px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
              <span
                className={`self-center ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                to
              </span>
              <input
                type="date"
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
                className={`px-3 py-2 rounded-lg border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              />
            </div>
          )}

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              darkMode
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            <Filter size={18} />
            Filters
            {showFilters ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div
          className={`mt-6 p-4 rounded-lg ${
            darkMode ? "bg-gray-700/50" : "bg-gray-50"
          }`}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Chart Type
              </label>
              <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className={`w-full rounded-lg px-3 py-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
              >
                <option value="line">Line Chart</option>
                <option value="bar">Bar Chart</option>
                <option value="pie">Pie Chart</option>
                <option value="doughnut">Doughnut Chart</option>
                <option value="radar">Radar Chart</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Data Granularity
              </label>
              <select
                className={`w-full rounded-lg px-3 py-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                onChange={(e) =>
                  toast(`Granularity set to ${e.target.value}`, {
                    icon: "📊",
                  })
                }
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
              </select>
            </div>

            <div>
              <label
                className={`block text-sm font-medium mb-2 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Comparison Mode
              </label>
              <select
                className={`w-full rounded-lg px-3 py-2 ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300"
                }`}
                onChange={(e) =>
                  toast(`Comparing with ${e.target.value}`, {
                    icon: "📈",
                  })
                }
              >
                <option value="none">No Comparison</option>
                <option value="previous">Previous Period</option>
                <option value="yoy">Year over Year</option>
                <option value="target">vs Target</option>
                <option value="competitor">vs Competitor</option>
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => {
                setShowFilters(false);
                toast.success("Filters applied successfully!", {
                  icon: "✅",
                });
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div
      className={`min-h-screen transition-colors duration-300 p-4 sm:p-6 lg:p-8 ${
        darkMode
          ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
          : "bg-gradient-to-br from-gray-50 to-blue-50"
      }`}
    >
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: darkMode ? "#1f2937" : "#fff",
            color: darkMode ? "#fff" : "#374151",
            border: darkMode ? "1px solid #374151" : "1px solid #e5e7eb",
          },
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Advanced Analysis Board
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                Deep insights and predictive analytics for data-driven decisions
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => {
                    setLoading(false);
                    loadInitialData();
                    toast.success("Analysis refreshed with latest data!", {
                      icon: "🔄",
                    });
                  }, 800);
                }}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                  darkMode
                    ? "bg-gray-800 text-white border border-gray-700"
                    : "bg-white text-gray-700 border border-gray-300"
                } hover:opacity-90 disabled:opacity-50`}
              >
                <RefreshCw
                  size={18}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Refreshing..." : "Refresh Data"}
              </button>

              <button
                onClick={() => setShowExportModal(true)}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                <Download size={18} />
                {isExporting ? "Exporting..." : "Export Analysis"}
              </button>
            </div>
          </div>
        </div>

        {/* Real-time Metrics */}
        {renderRealTimeMetrics()}

        {/* Analysis Type Selector */}
        {renderAnalysisTypeSelector()}

        {/* Time Range Selector */}
        {renderTimeRangeSelector()}

        {/* KPIs Summary */}
        {renderKPIsSummary()}

        {/* Main Analysis Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Performance Chart */}
            {renderPerformanceChart()}

            {/* Category Performance */}
            {renderCategoryPerformance()}

            {/* Competitor Analysis */}
            {renderCompetitorAnalysis()}
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Real-time Chart */}
            {renderRealTimeChart()}

            {/* User Demographics */}
            {renderUserDemographics()}

            {/* Geographic Distribution */}
            {renderGeographicDistribution()}

            {/* Marketing Channels */}
            {renderMarketingChannels()}
          </div>
        </div>

        {/* Additional Insights */}
        <div
          className={`rounded-xl shadow-lg p-6 mb-8 ${
            darkMode ? "bg-gray-800" : "bg-white"
          }`}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3
                className={`text-lg font-semibold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                AI-Powered Insights
              </h3>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Intelligent recommendations based on data patterns
              </p>
            </div>
            <Zap className="text-yellow-500" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Peak Hour Optimization",
                description:
                  "6-8 PM generates 35% of daily revenue. Consider increasing staff during these hours.",
                icon: Clock,
                color: "text-blue-600",
                bgColor: darkMode ? "bg-blue-900/20" : "bg-blue-50",
                impact: "High",
                confidence: 92,
              },
              {
                title: "Category Expansion",
                description:
                  "Beverages show 22% growth. Consider adding premium drink options.",
                icon: TrendingUp,
                color: "text-green-600",
                bgColor: darkMode ? "bg-green-900/20" : "bg-green-50",
                impact: "Medium",
                confidence: 85,
              },
              {
                title: "Marketing ROI Boost",
                description:
                  "Referral channel has 9x ROI. Consider increasing referral program budget.",
                icon: DollarSign,
                color: "text-purple-600",
                bgColor: darkMode ? "bg-purple-900/20" : "bg-purple-50",
                impact: "High",
                confidence: 88,
              },
              {
                title: "Demographic Targeting",
                description:
                  "25-34 age group contributes 38% revenue. Create targeted campaigns.",
                icon: Users,
                color: "text-pink-600",
                bgColor: darkMode ? "bg-pink-900/20" : "bg-pink-50",
                impact: "Medium",
                confidence: 78,
              },
              {
                title: "Regional Growth",
                description:
                  "South region growing at 18.5%. Consider expanding delivery radius.",
                icon: MapPin,
                color: "text-yellow-600",
                bgColor: darkMode ? "bg-yellow-900/20" : "bg-yellow-50",
                impact: "High",
                confidence: 91,
              },
              {
                title: "Competitor Advantage",
                description:
                  "Our brand leads in growth (15.8%) vs competitors. Leverage in marketing.",
                icon: Award,
                color: "text-red-600",
                bgColor: darkMode ? "bg-red-900/20" : "bg-red-50",
                impact: "Medium",
                confidence: 82,
              },
            ].map((insight, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg border-l-4 ${insight.color.replace(
                  "text-",
                  "border-"
                )} ${insight.bgColor}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${insight.bgColor}`}>
                    <insight.icon className={`h-5 w-5 ${insight.color}`} />
                  </div>
                  <div className="flex-1">
                    <h4
                      className={`font-semibold ${
                        darkMode ? "text-white" : "text-gray-900"
                      }`}
                    >
                      {insight.title}
                    </h4>
                    <p
                      className={`text-sm mt-1 ${
                        darkMode ? "text-gray-300" : "text-gray-600"
                      }`}
                    >
                      {insight.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          insight.impact === "High"
                            ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        }`}
                      >
                        Impact: {insight.impact}
                      </span>
                      <span className="text-xs text-gray-500">
                        Confidence: {insight.confidence}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          className={`text-center py-6 text-sm ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          <p>
            Analysis Board v2.0 • Data updates every 3 seconds • Last refresh:{" "}
            {new Date().toLocaleTimeString()}
          </p>
          <p className="mt-1">
            Need custom analysis? Contact our data science team
          </p>
        </div>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div
            className={`rounded-2xl shadow-2xl w-full max-w-md ${
              darkMode ? "bg-gray-900" : "bg-white"
            }`}
          >
            <div
              className={`flex justify-between items-center p-6 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-900"
                }`}
              >
                Export Analysis
              </h3>
              <button
                onClick={() => setShowExportModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {["PDF", "Excel", "CSV", "PNG", "JSON"].map((format) => (
                  <button
                    key={format}
                    onClick={() => {
                      handleExport(format.toLowerCase());
                      setShowExportModal(false);
                    }}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border ${
                      darkMode
                        ? "border-gray-700 hover:bg-gray-800"
                        : "border-gray-200 hover:bg-gray-50"
                    } transition-colors`}
                  >
                    <span
                      className={`font-medium ${
                        darkMode ? "text-gray-200" : "text-gray-700"
                      }`}
                    >
                      Export as {format}
                    </span>
                    <Download size={18} className="text-gray-400" />
                  </button>
                ))}
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setShowExportModal(false)}
                  className={`px-4 py-2 rounded-lg ${
                    darkMode
                      ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
