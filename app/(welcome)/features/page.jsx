// app/features/page.js
"use client";
import Link from "next/link"; // ✅ ADD THIS

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  FaMagic,
  FaQrcode,
  FaRobot,
  FaChartLine,
  FaLeaf,
  FaShieldAlt,
  FaUsers,
  FaDatabase,
  FaCog,
  FaCloud,
  FaChevronRight,
  FaPlay,
  FaStar,
  FaCheck,
  FaRegClock,
  FaCube,
  FaCamera,
  FaExpand,
  FaEye,
  FaMobileAlt,
  FaHandSparkles,
} from "react-icons/fa";
import {
  GiForkKnifeSpoon,
  GiMeat,
  GiFruitBowl,
  GiCookingPot,
} from "react-icons/gi";
import { RiRestaurantLine } from "react-icons/ri";
import { TbSalad } from "react-icons/tb";
// import { MdKitchen, MdAnalytics, Md3DRotation } from "react-icons/md";

export default function FeaturesPage() {
  const router = useRouter();
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // AR Food Tech Features
  const arFoodFeatures = [
    {
      icon: <FaMagic className="text-3xl" />,
      title: "Smart Digital Menu",
      description: "QR-based menu with real-time updates and instant ordering.",
      points: [
        "Live menu updates",
        "Category filtering",
        "Instant ordering",
        "Mobile-friendly",
      ],
      gradient: "from-purple-400 to-blue-500",
      delay: 0.1,
    },
    {
      icon: <FaCube className="text-3xl" />,
      title: "Order & Kitchen Automation",
      description: "Automate order flow from customer to kitchen.",
      points: [
        "Real-time order tracking",
        "Preparing → Ready → Completed",
        "Kitchen notifications",
        "Reduced manual errors",
      ],
      gradient: "from-blue-400 to-cyan-500",
      delay: 0.2,
    },
    {
      icon: <FaCamera className="text-3xl" />,
      title: "Admin Dashboard Control",
      description: "Manage everything from one place.",
      points: [
        "Sales overview",
        "Order management",
        "Payment tracking",
        "Menu editing",
      ],
      gradient: "from-cyan-400 to-teal-500",
      delay: 0.3,
    },
    {
      icon: <FaEye className="text-3xl" />,
      title: "Customer Insights & Reports",
      description: "Make data-driven decisions.",
      points: [
        "Daily sales reports",
        "Revenue analytics",
        "Peak hour insights",
        "Performance tracking",
      ],
      gradient: "from-teal-400 to-emerald-500",
      delay: 0.4,
    },
    {
      // icon: <Md3DRotation className="text-3xl" />,
      title: "QR-Based Ordering",
      description: "Customers scan and order instantly.",
      points: [
        "No app required",
        "Fast checkout",
        "Table-based QR",
        "Secure payments",
      ],
      gradient: "from-emerald-400 to-green-500",
      delay: 0.5,
    },
  ];

  // AR Technology Categories
  const arTechCategories = [
    {
      title: "Smart Dashboard",
      icon: <GiMeat />,
      features: [
        "Real-time updates",
        "Centralized control",
        "Multi-device access",
      ],
      color: "blue",
      stat: "95%",
      statLabel: "Faster Order Management",
    },
    {
      title: "Automation Engine",
      icon: <GiFruitBowl />,
      features: ["Auto order routing", "Status updates", "Payment sync"],
      color: "purple",
      stat: "40%",
      statLabel: "Reduced Manual Errors",
    },
    {
      title: "Seamless Integration",
      icon: <GiCookingPot />,
      features: [
        "QR activation",
        "POS ready",
        "Cloud access",
        "Mobile optimized",
      ],
      color: "teal",
      stat: "3x",
      statLabel: "Operational Efficiency",
    },
  ];

  // Food AR Process
  const arProcess = [
    {
      number: "01",
      title: "Create Menu",
      description: "Add dishes, prices, and categories.",
      icon: <FaCamera />,
    },
    {
      number: "02",
      title: "Generate QR Codes",
      description: "Create unique QR codes for tables.",
      icon: <FaMagic />,
    },
    {
      number: "03",
      title: "Activate Dashboard",
      description: "Manage orders, payments, and reports.",
      icon: <FaQrcode />,
    },
    {
      number: "04",
      title: "Go Live",
      description: "Customers scan, order, and pay instantly.",
      icon: <FaEye />,
    },
  ];

  // Food Types Supported
  const foodTypes = [
    { icon: "☕", name: "Cafés & Coffee Shops", color: "bg-orange-100" },
    { icon: "🍟", name: "Fast Food & QSR", color: "bg-red-100" },
    { icon: "🍽️", name: "Fine Dining", color: "bg-pink-100" },
    { icon: "🏢", name: "Multi-Outlet Chains", color: "bg-green-100" },
    { icon: "👨‍🍳", name: "Cloud Kitchens", color: "bg-yellow-100" },
    { icon: "🏬", name: "Food Courts", color: "bg-blue-100" },
  ];

  // AR Benefits Stats
  const arStats = [
    {
      value: "30%",
      label: "Faster Order Processing",
      icon: <FaStar />,
      color: "text-white-600",
    },
    {
      value: "40%",
      label: "Reduced Manual Errors",
      icon: <FaChartLine />,
      color: "text-white-400",
    },
    {
      value: "25%",
      label: "Higher Customer Satisfaction",
      icon: <FaUsers />,
      color: "text-white-600",
    },
    {
      value: "100%",
      label: "Commission-Free Revenue",
      icon: <FaRegClock />,
      color: "text-white-600",
    },
  ];

  // Platform Features for AR Food
  const platformFeatures = [
    {
      icon: "🔳",
      title: "Dynamic QR Codes",
      desc: "Generate unique QR codes for tables and outlets.",
    },
    {
      icon: "☁️",
      title: "Cloud-Based Dashboard",
      desc: "Access your restaurant data anytime, anywhere.",
    },
    {
      icon: "📊",
      title: "Real-Time Analytics",
      desc: "Track sales, orders, and performance instantly.",
    },
    {
      icon: "💳",
      title: "Secure Payments",
      desc: "Safe and encrypted payment processing.",
    },
    {
      icon: "⚙️",
      title: "Easy Menu Management",
      desc: "Add, edit, and manage dishes in real-time.",
    },
    {
      icon: "🏢",
      title: "Multi-Outlet Support",
      desc: "Control all branches from one dashboard.",
    },
  ];

  // FAQ Data specific to AR Food Tech
  const faqs = [
    {
      question: "Is SwadPoint commission-free?",
      answer: "Yes. You keep 100% of your revenue and customer data.",
    },
    {
      question: "Do customers need an app?",
      answer: "No. Orders work directly from the browser after QR scan.",
    },
    {
      question: "Can I manage multiple outlets?",
      answer: "Yes. One dashboard controls all branches.",
    },
    {
      question: "Is it secure?",
      answer: "Yes. Payments and data are fully encrypted.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 md:mb-24"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-full mb-8 shadow-lg">
            <FaHandSparkles className="animate-pulse" />
            <span className="font-semibold">Smart Restaurant Automation </span>
          </div>

          <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            Digitize Your Restaurant with SwadPoint{" "}
            <span className="block mt-4 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
              Smart Orders. Seamless Control. Better Growth.{" "}
            </span>
          </h1>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed">
            Transform how restaurants manage menus, orders, payments, and
            analytics — all from one powerful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.push("/signup")}
              className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <span className="flex items-center gap-2">
                View Live Dashboard{" "}
                <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            <button
              onClick={() => router.push("/demo")}
              className="group px-8 py-4 bg-white text-gray-800 font-bold rounded-xl border-2 border-blue-200 hover:border-purple-400 hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <FaPlay className="text-purple-500" />
              Start Free Demo
            </button>
          </div>
        </motion.div>

        {/* AR Food Features Showcase */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Smart Automation Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to streamline and scale your restaurant
              operations.{" "}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Feature List */}
            <div className="space-y-6">
              {arFoodFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: feature.delay }}
                  onMouseEnter={() => setActiveFeature(index)}
                  className={`p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                    activeFeature === index
                      ? "bg-white shadow-2xl border-l-4 border-purple-500"
                      : "bg-white/80 shadow-md hover:shadow-lg"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`p-3 rounded-xl bg-gradient-to-r ${feature.gradient} text-white`}
                    >
                      {feature.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 mb-3">
                        {feature.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {feature.points.map((point, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-purple-50 text-purple-600 text-sm rounded-full"
                          >
                            {point}
                          </span>
                        ))}
                      </div>
                    </div>
                    {activeFeature === index && (
                      <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping"></div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* AR Food Preview */}
            <div className="relative">
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-3xl p-8 shadow-2xl">
                <div className="relative h-96 flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-100/50 to-blue-100/50 rounded-2xl"></div>

                  {activeFeature === 0 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-4">🍔</div>
                      <div className="text-4xl mb-2">👆</div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Tap to Explore
                      </h3>
                      <p className="text-gray-600">
                        Interact with 3D food models
                      </p>
                    </motion.div>
                  )}

                  {activeFeature === 1 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-4 rotate-45">🍕</div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        360° View
                      </h3>
                      <p className="text-gray-600">
                        Rotate and examine from all angles
                      </p>
                    </motion.div>
                  )}

                  {activeFeature === 2 && (
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="text-center"
                    >
                      <div className="text-8xl mb-4">📱</div>
                      <div className="text-4xl mb-2">➡️</div>
                      <h3 className="text-2xl font-bold text-gray-900">
                        Project on Table
                      </h3>
                      <p className="text-gray-600">
                        See how it looks on your plate
                      </p>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AR Technology Categories */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SwadPoint Technology Stack
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Smart Dashboard </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {arTechCategories.map((tech, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                className="bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-shadow duration-300 border border-purple-100"
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${
                    tech.color === "blue"
                      ? "from-blue-500 to-cyan-500"
                      : tech.color === "purple"
                        ? "from-purple-500 to-pink-500"
                        : "from-teal-500 to-emerald-500"
                  } text-white mb-6`}
                >
                  {tech.icon}
                </div>

                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    {tech.title}
                  </h3>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-gray-900">
                      {tech.stat}
                    </div>
                    <div className="text-sm text-gray-600">
                      {tech.statLabel}
                    </div>
                  </div>
                </div>

                <ul className="space-y-3 mb-6">
                  {tech.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <FaCheck className="text-green-500" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Food Types Supported */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Perfect for Every Restaurant Type
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {foodTypes.map((food, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className={`${food.color} rounded-2xl p-6 text-center hover:shadow-xl transition-shadow duration-300`}
              >
                <div className="text-4xl mb-3">{food.icon}</div>
                <div className="text-sm font-medium text-gray-800">
                  {food.name}
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* AR Process */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple Setup Process
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start accepting smart orders in 4 easy steps.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 top-1/2 w-3/4 h-1 bg-gradient-to-r from-purple-200 via-blue-200 to-cyan-200 hidden lg:block"></div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {arProcess.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow text-center">
                    <div className="text-5xl font-bold text-purple-100 mb-4">
                      {step.number}
                    </div>
                    <div className="inline-flex p-3 rounded-xl bg-purple-50 text-purple-600 mb-4">
                      {step.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* AR Benefits Stats */}
        <div className="mb-24">
          <div className="bg-gradient-to-r from-purple-600 to-blue-500 rounded-3xl p-8 md:p-12">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Proven Business Impact{" "}
              </h2>
              <p className="text-purple-100 max-w-2xl mx-auto">
                Restaurants using AR see remarkable improvements
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {arStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div
                    className={`text-4xl md:text-5xl font-bold ${stat.color} mb-2`}
                  >
                    {stat.value}
                  </div>
                  <div className="text-white font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="mb-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Highlights
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-purple-50"
              >
                <div className="text-purple-500 mb-4 text-2xl">
                  {feature.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-24"
        >
          <div className="bg-gradient-to-br from-white to-purple-50 rounded-3xl p-8 md:p-12 border-2 border-purple-200 shadow-2xl">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white px-4 py-2 rounded-full mb-6">
                <FaHandSparkles />
                <span className="font-semibold">Transform Your Restaurant</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Ready to Digitize Your Restaurant?
              </h2>

              <p className="text-gray-600 max-w-2xl mx-auto mb-8 text-lg">
                Launch your smart restaurant system in minutes — no commission,
                no complexity.{" "}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => router.push("/signup")}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-500 text-white font-bold rounded-xl hover:shadow-2xl transition-all hover:scale-105"
                >
                  Start Free Trial
                </button>

                {/* <button
                  onClick={() => router.push("/contact")}
                  className="px-8 py-4 bg-white text-purple-600 font-bold rounded-xl border-2 border-purple-300 hover:bg-purple-50 transition-colors"
                >
                  Request Demo
                </button> */}
              </div>

              <p className="text-gray-500 text-sm mt-6">
                • No App Required • Real-Time Order Tracking
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ Section */}
        <div className="mb-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              SwadPoint Frequently Asked Questions
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our smart restaurant automation
              platform.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow border border-purple-50"
              >
                <h4 className="text-xl font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <FaHandSparkles className="text-purple-500" />
                  {faq.question}
                </h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      {/* ================= FOOTER ================= */}
      <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-24 pb-10 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
            {/* Brand */}
            <div>
              <h3 className="text-3xl font-bold text-cyan-400 mb-5">
                SwadPoint 🍽️
              </h3>
              <p className="text-gray-400 leading-relaxed mb-6">
                Delivering delicious food with innovation and technology.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-4 text-gray-400">
                <li>
                  <Link href="/welcome" className="hover:text-cyan-400">
                    Home
                  </Link>
                </li>
                <li>
                  <Link href="/features" className="hover:text-cyan-400">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/plan" className="hover:text-cyan-400">
                    Plans
                  </Link>
                </li>
                <li>
                  <Link href="/about" className="hover:text-cyan-400">
                    About
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Contact</h4>
              <ul className="space-y-4 text-gray-400">
                <li>📍 Surat, Gujarat</li>
                <li>📞 +91 98765 43210</li>
                <li>📧 support@swadpoint.com</li>
                <li>🕒 Mon–Sun: 10 AM – 11 PM</li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
              <p className="text-gray-400 mb-6">
                Subscribe for latest AR updates.
              </p>

              <div className="flex overflow-hidden rounded-full border border-white/20">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 bg-white/10 text-sm focus:outline-none w-full"
                />
                <button className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:opacity-90 transition-all">
                  Subscribe
                </button>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} SwadPoint. All Rights Reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
