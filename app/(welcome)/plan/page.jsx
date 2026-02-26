// app/plan/page.js
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import MarketingFooter from "@/components/auth/MarketingFooter";
import {
  FaCheck,
  FaTimes,
  FaStar,
  FaCrown,
  FaRocket,
  FaGem,
  FaArrowRight,
} from "react-icons/fa";

export default function PlanPage() {
  const router = useRouter();
  const [planA, setPlanA] = useState("starter");
  const [planB, setPlanB] = useState("professional");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [isYearly, setIsYearly] = useState(false);

  // Base Plan data with both monthly and yearly pricing
  const PLANS_BASE = [
    {
      id: "starter",
      name: "Starter",
      icon: FaRocket,
      monthlyPrice: "0",
      yearlyPrice: "0",
      description: "Perfect for small cafes & food trucks",
      features: [
        { text: "Up to 15 AR Menu Items", included: true },
        { text: "1 Restaurant Location", included: true },
        { text: "Basic QR Code Generator", included: true },
        { text: "5 AR Menu Templates", included: true },
        { text: "Basic Analytics Dashboard", included: true },
        { text: "SwadPoint Branding", included: true },
        { text: "Email Support", included: true },
        { text: "3D Food Previews", included: false },
        { text: "AR Table Reservations", included: false },
        { text: "Menu Performance Analytics", included: false },
      ],
      cta: "Get Started Free",
      popular: false,
      color: "from-blue-50 to-white",
      borderColor: "border-blue-200",
      accent: "blue",
    },
    {
      id: "professional",
      name: "Professional",
      icon: FaStar,
      monthlyPrice: "29",
      yearlyPrice: "278",
      description: "Best for growing restaurants & chains",
      features: [
        { text: "Unlimited AR Menu Items", included: true },
        { text: "Up to 3 Locations", included: true },
        { text: "Advanced QR Codes with Analytics", included: true },
        { text: "50+ Premium AR Templates", included: true },
        { text: "Advanced Analytics & Insights", included: true },
        { text: "Custom Branding", included: true },
        { text: "Priority Support", included: true },
        { text: "3D Food Previews", included: true },
        { text: "AR Table Reservations", included: true },
        { text: "Menu Performance Analytics", included: true },
        { text: "3rd Party Integrations (POS, Delivery)", included: true },
        { text: "Custom AR Filters", included: false },
      ],
      cta: "Start Free Trial",
      popular: true,
      color: "from-blue-50 to-white",
      borderColor: "border-blue-500",
      discount: "20%",
      accent: "blue",
    },
    {
      id: "business",
      name: "Business",
      icon: FaCrown,
      monthlyPrice: "79",
      yearlyPrice: "758",
      description: "For multi-location restaurant groups",
      features: [
        { text: "Unlimited Everything", included: true },
        { text: "Unlimited Locations", included: true },
        { text: "Enterprise QR Management", included: true },
        { text: "100+ Premium AR Templates", included: true },
        { text: "AI-Powered Analytics", included: true },
        { text: "White-label Branding", included: true },
        { text: "24/7 Phone Support", included: true },
        { text: "Interactive 3D Food Models", included: true },
        { text: "AR Table Reservations + Waitlist", included: true },
        { text: "Predictive Menu Analytics", included: true },
        { text: "10+ App Integrations", included: true },
        { text: "Custom AR Filters & Effects", included: true },
        { text: "Dedicated Account Manager", included: true },
      ],
      cta: "Start Free Trial",
      popular: false,
      color: "from-blue-50 to-white",
      borderColor: "border-blue-300",
      discount: "20%",
      accent: "blue",
    },
    {
      id: "enterprise",
      name: "Enterprise",
      icon: FaGem,
      monthlyPrice: "Custom",
      yearlyPrice: "Custom",
      description: "Custom solutions for large franchises",
      features: [
        { text: "Everything in Business Plan", included: true },
        { text: "Custom AR Development", included: true },
        { text: "API Access & Webhooks", included: true },
        { text: "Custom AI Training", included: true },
        { text: "SLA 99.9% Uptime", included: true },
        { text: "On-premise Deployment", included: true },
        { text: "24/7 Dedicated Support", included: true },
        { text: "Custom Mobile App", included: true },
        { text: "Multi-language Support", included: true },
        { text: "Training & Onboarding", included: true },
      ],
      cta: "Contact Sales",
      popular: false,
      color: "from-gray-50 to-white",
      borderColor: "border-gray-300",
      accent: "gray",
    },
  ];

  // Calculate derived plan data based on billing cycle
  const PLANS = PLANS_BASE.map((plan) => {
    const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
    const period = isYearly ? "/year" : "/month";
    const perMonth =
      isYearly && plan.yearlyPrice !== "Custom" && plan.yearlyPrice !== "0"
        ? `$${(parseInt(plan.yearlyPrice) / 12).toFixed(2)}/mo`
        : null;

    return {
      ...plan,
      displayPrice: price === "Custom" ? "Custom" : `$${price}`,
      period,
      perMonth,
      effectivePrice: price,
    };
  });

  const handleBillingToggle = () => {
    setIsYearly(!isYearly);
    setBillingCycle(isYearly ? "monthly" : "yearly");
  };

  const planAObj = PLANS.find((p) => p.id === planA);
  const planBObj = PLANS.find((p) => p.id === planB);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-16 border border-blue-100">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform Your Restaurant with{" "}
            <span className="text-blue-600">AR Technology</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
            Choose the perfect AR menu solution for your restaurant
          </p>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
            From food trucks to franchises, we have a plan that fits your needs
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              onClick={() => router.push("/signup")}
            >
              Start 14-Day Free Trial
            </button>
            {/* <button
              className="bg-white hover:bg-gray-50 text-blue-600 font-semibold py-3 px-8 rounded-lg border-2 border-blue-600 transition duration-200"
              onClick={() => router.push("/demo")}
            >
              Book a Demo
            </button> */}
          </div>
        </div>

        {/* Billing Toggle Section */}
        <div className="mb-12 flex flex-col items-center">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              All plans include 14-day free trial. Cancel anytime.
            </p>
          </div>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <span
              className={`text-lg font-medium ${
                !isYearly ? "text-blue-600" : "text-gray-500"
              }`}
            >
              Monthly
            </span>
            <button
              onClick={handleBillingToggle}
              className="relative inline-flex h-8 w-16 items-center rounded-full bg-gray-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <span
                className={`${
                  isYearly
                    ? "translate-x-9 bg-blue-500"
                    : "translate-x-1 bg-white"
                } inline-block h-6 w-6 transform rounded-full transition-transform`}
              />
            </button>
            <div className="flex items-center gap-2">
              <span
                className={`text-lg font-medium ${
                  isYearly ? "text-blue-600" : "text-gray-500"
                }`}
              >
                Yearly
              </span>
              {isYearly && (
                <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-3 py-1 rounded-full">
                  Save 20%
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-500 text-sm">
            {isYearly
              ? "Billed annually, cancel anytime"
              : "Billed monthly, no commitment"}
          </p>
        </div>

        {/* Pricing Cards Section */}
        <div className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PLANS.map((plan) => {
              const Icon = plan.icon;
              return (
                <div
                  key={plan.id}
                  className={`bg-white rounded-xl shadow-lg p-6 flex flex-col relative border ${
                    plan.borderColor
                  } transition-all duration-300 hover:shadow-xl ${
                    plan.popular ? "transform scale-[1.02] border-2" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full shadow-md">
                      MOST POPULAR
                    </div>
                  )}

                  {/* Discount Badge for Yearly */}
                  {isYearly && plan.discount && (
                    <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-md">
                      Save {plan.discount}
                    </div>
                  )}

                  <div className="text-center mb-6 pb-6 border-b border-gray-200">
                    <div className="flex justify-center mb-4">
                      <Icon
                        className={`text-3xl ${
                          plan.accent === "blue"
                            ? "text-blue-500"
                            : "text-gray-500"
                        }`}
                      />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">
                      {plan.description}
                    </p>

                    <div className="mb-2">
                      {plan.displayPrice === "Custom" ? (
                        <div>
                          <span className="text-4xl font-bold text-gray-900">
                            Custom
                          </span>
                        </div>
                      ) : (
                        <div>
                          <span className="text-4xl font-bold text-gray-900">
                            {plan.displayPrice}
                          </span>
                          <span className="text-gray-600 ml-1">
                            {plan.period}
                          </span>
                        </div>
                      )}

                      {/* Show per month equivalent for yearly plans */}
                      {plan.perMonth && (
                        <div className="mt-2">
                          <p className="text-sm text-blue-600">
                            <span className="font-medium">{plan.perMonth}</span>
                          </p>
                        </div>
                      )}

                      {/* Compare with monthly price */}
                      {isYearly &&
                        plan.displayPrice !== "Custom" &&
                        plan.displayPrice !== "$0" && (
                          <div className="mt-1">
                            <p className="text-xs text-gray-500 line-through">
                              $
                              {(parseInt(plan.effectivePrice) / 0.8).toFixed(0)}
                              /year
                            </p>
                          </div>
                        )}
                    </div>
                  </div>

                  <ul className="space-y-3 mb-8 flex-grow">
                    {plan.features.slice(0, 5).map((feature, index) => (
                      <li
                        key={index}
                        className="flex items-start text-sm text-gray-700"
                      >
                        {feature.included ? (
                          <FaCheck className="text-green-500 mt-0.5 mr-2 flex-shrink-0" />
                        ) : (
                          <FaTimes className="text-gray-300 mt-0.5 mr-2 flex-shrink-0" />
                        )}
                        <span
                          className={feature.included ? "" : "text-gray-400"}
                        >
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 rounded-lg font-semibold transition duration-200 ${
                      plan.popular
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300"
                    }`}
                    onClick={() => {
                      if (plan.id === "enterprise") {
                        router.push("/contact");
                      } else {
                        router.push(
                          `/signup?plan=${plan.id}&billing=${billingCycle}`,
                        );
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          {/* Yearly Savings Notice */}
          {isYearly && (
            <div className="mt-8 text-center">
              <div className="inline-flex items-center bg-blue-50 text-blue-800 px-6 py-3 rounded-lg border border-blue-200">
                <FaCheck className="text-blue-600 mr-2" />
                <span className="font-medium">
                  Yearly billing saves you 20% on all paid plans!
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Price Comparison Chart */}
        <div className="mb-16">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Yearly vs Monthly Comparison
              </h3>
              <p className="text-gray-600">
                See how much you save with annual billing
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Monthly
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">
                      Yearly
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-blue-600">
                      Annual Savings
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-blue-600">
                      Effective Monthly
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {PLANS_BASE.filter(
                    (plan) => plan.id !== "enterprise" && plan.id !== "starter",
                  ).map((plan) => {
                    const monthlyTotal = parseInt(plan.monthlyPrice) * 12;
                    const yearlyTotal = parseInt(plan.yearlyPrice);
                    const savings = monthlyTotal - yearlyTotal;
                    const effectiveMonthly = (yearlyTotal / 12).toFixed(2);

                    return (
                      <tr key={plan.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            {plan.icon && (
                              <plan.icon className="text-lg mr-2 text-blue-500" />
                            )}
                            <span className="font-medium text-gray-900">
                              {plan.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-semibold text-gray-900">
                            ${plan.monthlyPrice}/mo
                          </div>
                          <div className="text-xs text-gray-500">
                            ${monthlyTotal}/yr
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-semibold text-gray-900">
                            ${plan.yearlyPrice}/yr
                          </div>
                          <div className="text-xs text-gray-500">
                            Annual billing
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-semibold text-blue-600">
                            ${savings}
                          </div>
                          <div className="text-xs text-blue-600">
                            20% discount
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="font-semibold text-blue-600">
                            ${effectiveMonthly}/mo
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Feature Comparison Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Compare All Features
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See exactly what each plan includes
            </p>
          </div>

          {/* Plan selection */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Compare Plan
                </label>
                <select
                  value={planA}
                  onChange={(e) => setPlanA(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                >
                  {PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} -{" "}
                      {plan.displayPrice === "Custom"
                        ? "Custom"
                        : `${plan.displayPrice}${plan.period}`}
                    </option>
                  ))}
                </select>
              </div>

              <div className="text-gray-400 font-medium">VS</div>

              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  With Plan
                </label>
                <select
                  value={planB}
                  onChange={(e) => setPlanB(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-200"
                >
                  {PLANS.map((plan) => (
                    <option key={plan.id} value={plan.id}>
                      {plan.name} -{" "}
                      {plan.displayPrice === "Custom"
                        ? "Custom"
                        : `${plan.displayPrice}${plan.period}`}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setPlanA("starter");
                  setPlanB("professional");
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg border border-gray-300 transition duration-200"
              >
                Reset
              </button>
            </div>

            {/* Comparison table */}
            <div className="overflow-hidden rounded-lg border border-gray-200">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Feature
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-base font-semibold ${
                        planAObj?.popular ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {planAObj?.name}
                    </th>
                    <th
                      className={`px-4 py-3 text-center text-base font-semibold ${
                        planBObj?.popular ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {planBObj?.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {planAObj?.features.map((feature, index) => {
                    const planBFeature = planBObj?.features[index];
                    const isDifferent =
                      planBFeature && feature.text !== planBFeature.text;

                    return (
                      <tr
                        key={index}
                        className={
                          isDifferent ? "bg-blue-50" : "even:bg-gray-50"
                        }
                      >
                        <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200">
                          {feature.text}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {feature.included ? (
                            <div className="flex justify-center items-center">
                              <FaCheck className="text-green-500" />
                              <span className="ml-2 text-sm text-gray-600">
                                Included
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center">
                              <FaTimes className="text-gray-300" />
                              <span className="ml-2 text-sm text-gray-400">
                                Not included
                              </span>
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {planBFeature?.included ? (
                            <div className="flex justify-center items-center">
                              <FaCheck className="text-green-500" />
                              <span className="ml-2 text-sm text-gray-600">
                                Included
                              </span>
                            </div>
                          ) : (
                            <div className="flex justify-center items-center">
                              <FaTimes className="text-gray-300" />
                              <span className="ml-2 text-sm text-gray-400">
                                Not included
                              </span>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Loved by Restaurants Worldwide
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">S</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Spice Route Cafe
                  </h4>
                  <p className="text-gray-600 text-sm">Mumbai, India</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                &ldquo;Our sales increased by 35% after implementing AR menus.
                Customers love seeing dishes in 3D before ordering!&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">B</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Bella Napoli</h4>
                  <p className="text-gray-600 text-sm">Rome, Italy</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                &ldquo;The Professional plan was perfect for our 3 locations. The AR
                features have reduced ordering time by 40%.&rdquo;
              </p>
            </div>
            <div className="bg-white rounded-xl shadow p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-bold">T</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Tokyo Ramen Bar
                  </h4>
                  <p className="text-gray-600 text-sm">Tokyo, Japan</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                &ldquo;Enterprise solution helped our franchise maintain consistent AR
                experience across 15 locations. Game changer!&rdquo;
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Pricing FAQ
            </h2>
            <p className="text-gray-600">
              Plan selection, billing cycles, and upgrade flow explained.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {[
              {
                q: "How does trial work on paid plans?",
                a: "Professional and Business include a 14-day trial. Starter is free forever with limited modules.",
              },
              {
                q: "Can I switch monthly to yearly later?",
                a: "Yes. You can switch anytime. Yearly billing applies discounted pricing from next cycle.",
              },
              {
                q: "What if my outlet count increases?",
                a: "You can upgrade plan instantly, and all new outlet limits apply without data migration.",
              },
              {
                q: "Do you provide GST invoice and billing history?",
                a: "Yes. Every payment invoice and cycle history is available from billing settings.",
              },
              {
                q: "Can I cancel without lock-in?",
                a: "Yes. There is no long-term lock-in. You can cancel or downgrade from account settings.",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="rounded-xl border border-emerald-100 bg-white p-5 shadow-sm"
              >
                <h4 className="mb-2 flex items-center text-base font-semibold text-gray-900">
                  <FaArrowRight className="mr-2 text-emerald-500" />
                  {faq.q}
                </h4>
                <p className="pl-6 text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

        <MarketingFooter />
      </div>
    </div>
  );
}
