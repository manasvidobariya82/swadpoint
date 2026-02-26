"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import MarketingFooter from "@/components/auth/MarketingFooter";

export default function LandingPage() {
  const router = useRouter();
  const scrollRef = useRef(null);
  const [activeFaq, setActiveFaq] = useState(0);

  // Infinite scroll effect for AR cards
  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let scrollAmount = 0;
    const scrollStep = () => {
      scrollAmount += 1;
      if (scrollAmount >= scrollContainer.scrollWidth / 2) {
        scrollAmount = 0;
      }
      scrollContainer.scrollTo({
        left: scrollAmount,
        behavior: "smooth",
      });
    };

    const interval = setInterval(scrollStep, 20);
    return () => clearInterval(interval);
  }, []);

  const arFeatures = [
    {
      title: "Digital Menu System",
      desc: "Real-time menu updates with QR-based ordering.",
      icon: "📱", // Mobile / QR based system
      color: "bg-gradient-to-r from-blue-50 to-cyan-50",
    },
    {
      title: "Live Order Tracking",
      desc: "Customers track orders from preparing to completed.",
      icon: "📦", // Order tracking / delivery
      color: "bg-gradient-to-r from-emerald-50 to-green-50",
    },
    {
      title: "Accurate Smart Ordering",
      desc: "Reduce manual errors with automated order flow.",
      icon: "✅", // Accuracy / correctness
      color: "bg-gradient-to-r from-amber-50 to-orange-50",
    },
    {
      title: "Admin Dashboard Control",
      desc: "Manage menu, orders, and payments in one place.",
      icon: "🛠️", // Control / management tools
      color: "bg-gradient-to-r from-purple-50 to-violet-50",
    },
    {
      title: "Commission-Free Platform",
      desc: "Full control without third-party commission fees.",
      icon: "💰", // Money / no commission
      color: "bg-gradient-to-r from-pink-50 to-rose-50",
    },
  ];

  const benefits = [
    {
      title: "Smart Digital Menu",
      desc: "QR-based interactive menu with real-time updates.",
      icon: "📱",
      link: "/features/ar-menus",
      slug: "ar-menus",
    },
    {
      title: "Smart POS Integration",
      desc: "Sync orders, payments, and billing seamlessly.",
      icon: "💳",
      link: "/features/pos-integration",
      slug: "pos-integration",
    },
    {
      title: "Order & Kitchen Automation",
      desc: "Automate order flow from customer to kitchen.",
      icon: "🤖",
      link: "/features/order-automation",
      slug: "order-automation",
    },
    {
      title: "Real-Time Customer Insights",
      desc: "Track sales, behavior, and performance instantly.",
      icon: "📊",
      link: "/features/customer-analytics",
      slug: "customer-analytics",
    },
    {
      title: "Multi-Outlet Management",
      desc: "Control all branches from one centralized dashboard.",
      icon: "🏪",
      link: "/features/multi-outlet-support",
      slug: "multi-outlet-support",
    },
    {
      title: "Cloud-Based Dashboard",
      desc: "Access your restaurant data anytime, anywhere.",
      icon: "☁️",
      link: "/features/cloud-dashboard",
      slug: "cloud-dashboard",
    },
  ];

  const faqs = [
    {
      q: "How fast can we launch SwadPoint in our restaurant?",
      a: "Typical setup takes 1-2 days including QR creation, menu upload, and payment setup.",
    },
    {
      q: "Can dine-in and takeaway orders run together?",
      a: "Yes. Both flows run from the same dashboard with separate status tracking.",
    },
    {
      q: "Will staff need technical training?",
      a: "No. Staff can start with a quick walkthrough and role-based access controls.",
    },
    {
      q: "Can we customize branding in the customer menu?",
      a: "Yes. You can apply your own logo, section names, and menu presentation style.",
    },
    {
      q: "What support do we get after going live?",
      a: "You get ongoing support for billing setup, QR issues, and order workflow improvements.",
    },
  ];
  return (
    <div className="font-sans bg-white text-gray-900">
      {/* ================= HERO SECTION ================= */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden text-white">
        {/* Background with gradient overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=1920&auto=format&fit=crop')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/70"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-6 max-w-6xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span className="text-sm font-semibold">
              🚀 Revolutionizing Restaurant Tech
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
            Transform Your Restaurant with
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-400 mt-2">
              Smart Automation
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 leading-relaxed">
            SwadPoint connects restaurants, customers, and operations on one
            seamless,
            <span className="font-semibold text-white">
              {" "}
              commission-free platform
            </span>
            .
          </p>

          <div className="flex flex-wrap justify-center gap-6">
            <button
              onClick={() => router.push("/signup")}
              className="px-12 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl shadow-lg"
            >
              🚀 Get Started Free
            </button>
            <button
              onClick={() => router.push("/demo")}
              className="px-12 py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 hover:bg-white/20 text-white rounded-full font-semibold text-lg transition-all duration-300 hover:shadow-lg"
            >
              📅 Request a Demo
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-16 inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">
                Trusted by 500+ Restaurants
              </span>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2"></div>
          </div>
        </div>
      </section>

      {/* ================= LOGO MARQUEE ================= */}
      <section className="py-20 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Trusted by Leading Restaurants & Cafés
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Join hundreds of successful food businesses already using
              SwadPoint
            </p>
          </div>

          <div className="relative overflow-hidden">
            <div className="flex gap-12 items-center animate-scroll">
              {[
                "r1.png",
                "r2.png",
                "r3.png",
                "r4.png",
                "r5.png",
                "r6.png",
                "r7.png",
                "r8.png",
                "r1.png",
                "r2.png",
                "r3.png",
                "r4.png",
                "r5.png",
                "r6.png",
                "r7.png",
                "r8.png",
              ].map((logo, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
                >
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                    <img
                      src={logo}
                      alt={`Logo ${i + 1}`}
                      className="w-24 h-24 object-contain"
                    />{" "}
                  </div>
                  {/* <div className="mt-4 text-center">
                    <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded w-20 mx-auto mb-2"></div>
                    <div className="h-3 bg-gradient-to-r from-gray-100 to-gray-200 rounded w-16 mx-auto"></div>
                  </div> */}
                </div>
              ))}
            </div>

            {/* Gradient overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white to-transparent"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white to-transparent"></div>
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll {
            display: flex;
            animation: scroll 40s linear infinite;
          }
        `}</style>
      </section>

      {/* ================= AR FEATURES ================= */}
      <section className="py-28 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-block mb-4 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full">
              <span className="text-sm font-semibold text-white">
                ✨ SMART AUTOMATION
              </span>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Smart Automation Features
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Transform customer experience with smart digital automation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
            {arFeatures.map((feature, index) => (
              <div
                key={index}
                className={`${feature.color} p-8 rounded-3xl border border-white shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2`}
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= DASHBOARD SHOWCASE ================= */}
      <section className="py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-block mb-6 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
                <span className="text-sm font-semibold text-white">
                  📊 SMART AUTOMATION
                </span>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 leading-tight">
                One Dashboard.{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">
                  Total Control.
                </span>
              </h2>
              <p className="text-xl text-gray-600 mb-10 leading-relaxed">
                Manage menus, orders, payments, and analytics from one powerful
                platform designed for modern restaurants.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📱</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      Smart Digital Menus
                    </h4>
                    <p className="text-gray-600">
                      QR-based ordering with real-time updates.{" "}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-green-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">💳</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      Smart POS Integration
                    </h4>
                    <p className="text-gray-600">
                      Seamless order and payment management.{" "}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-violet-100 rounded-xl flex items-center justify-center">
                    <span className="text-2xl">📈</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-900">
                      Real-Time Analytics
                    </h4>
                    <p className="text-gray-600">
                      Data-driven insights for smarter decisions.{" "}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-all duration-500">
                <img
                  src="https://images.unsplash.com/photo-1600891964599-f61ba0e24092"
                  alt="SwadPoint Dashboard"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>

              {/* Floating elements */}
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl">📈</div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-blue-600">+45%</div>
                  <div className="text-sm text-gray-600">
                    Avg. Sales Increase
                  </div>
                </div>
              </div>

              <div className="absolute -top-6 -right-6 bg-white p-6 rounded-2xl shadow-xl">
                <div className="text-3xl">⏱️</div>
                <div className="mt-2">
                  <div className="text-2xl font-bold text-emerald-600">
                    -30%
                  </div>
                  <div className="text-sm text-gray-600">
                    Order Processing Time
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BENEFITS SECTION (WITH LINKS) ================= */}
      <section className="py-28 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Complete Restaurant{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Management Suite
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage and grow your restaurant — all in
              one smart platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-3xl border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-300 group hover:border-blue-200"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <span className="text-3xl">{benefit.icon}</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{benefit.desc}</p>
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <Link
                    href={benefit.link}
                    className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition-colors inline-flex items-center gap-1"
                  >
                    {/* Learn more → */}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= STATS SECTION ================= */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="p-8">
              <div className="text-5xl font-bold mb-2">100+</div>
              <div className="text-blue-100">Active Users</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold mb-2">30%</div>
              <div className="text-blue-100">Faster Order Processing</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold mb-2">99%</div>
              <div className="text-blue-100">System Reliability</div>
            </div>
            <div className="p-8">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Smart Monitoring</div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FAQ SECTION ================= */}
      <section className="bg-gradient-to-b from-white to-slate-50 py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Quick answers for restaurants evaluating SwadPoint
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`rounded-2xl border bg-white p-6 shadow-sm transition-all duration-300 ${
                  activeFaq === index
                    ? "border-blue-300 shadow-lg"
                    : "border-gray-200 hover:border-blue-200"
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveFaq((prev) => (prev === index ? -1 : index))
                  }
                  className="flex w-full items-start justify-between gap-4 text-left"
                >
                  <h4 className="text-xl font-bold text-gray-900">{item.q}</h4>
                  <span className="text-2xl font-bold text-blue-500">
                    {activeFaq === index ? "-" : "+"}
                  </span>
                </button>
                {activeFaq === index && (
                  <p className="mt-4 text-gray-600 leading-relaxed">{item.a}</p>
                )}
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/faq"
              className="text-blue-600 hover:text-blue-700 font-semibold text-lg inline-flex items-center gap-1"
            >
              {/* View all FAQs → */}
            </Link>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
