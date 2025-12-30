"use client";
import React, { useState } from "react";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

const OffersPage = () => {
  const [offers, setOffers] = useState([
    {
      title: "Flat 20% Discount",
      desc: "On selected menu items",
      points: [
        "On selected menu items",
        "Limited time offer",
        "Auto-apply at checkout",
        "Validity: 7 days",
      ],
      active: false,
      badgeColor: "bg-pink-500",
    },
    {
      title: "Buy 1 Get 1 Free",
      desc: "Weekend special",
      points: [
        "Weekend special",
        "Perfect for customer retention",
        "Easy control from dashboard",
        "Applicable on selected items",
      ],
      active: false,
      badgeColor: "bg-yellow-500",
    },
    {
      title: "Free Add-on Offer",
      desc: "On orders above ₹499",
      points: [
        "On orders above ₹499",
        "Free beverage or item",
        "Best to increase average order value",
        "Customizable free item",
      ],
      active: false,
      badgeColor: "bg-blue-500",
    },
  ]);

  const toggleOffer = (index) => {
    const updatedOffers = [...offers];
    updatedOffers[index].active = !updatedOffers[index].active;
    setOffers(updatedOffers);
  };

  return (
    <motion.div
      className="p-8 min-h-screen bg-gradient-to-br from-gray-50 to-blue-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      {/* HEADER */}
      <motion.h1
        className="text-3xl font-bold mb-1 text-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Today's Special Offers
      </motion.h1>

      <p className="text-gray-600 mb-8">
        Boost sales — attract customers with exciting deals 🎯
      </p>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <StatCard
          title="Active Offers"
          value={offers.filter((o) => o.active).length}
        />
        <StatCard title="Available Templates" value={offers.length} />
        <StatCard title="Avg. Order Increase" value="15-25%" />
      </div>

      {/* OFFER CARDS */}
      <div className="grid md:grid-cols-3 sm:grid-cols-1 gap-6">
        {offers.map((offer, index) => (
          <motion.div
            key={index}
            className="rounded-xl shadow-xl p-6 backdrop-blur-xl bg-white/70 hover:shadow-2xl transition-all border border-gray-200 hover:-translate-y-2"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span
              className={`px-3 py-1 rounded-full text-white text-xs ${offer.badgeColor} shadow-md`}
            >
              {offer.active ? "Active" : "Inactive"}
            </span>

            <h3 className="text-xl font-bold mt-4">{offer.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{offer.desc}</p>

            <ul className="space-y-2 text-gray-700">
              {offer.points.map((point, i) => (
                <li key={i} className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  {point}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => toggleOffer(index)}
              whileTap={{ scale: 0.95 }}
              className={`mt-6 w-full flex items-center justify-center gap-2 text-white py-2 rounded-lg font-medium transition-all 
                ${
                  offer.active
                    ? "bg-red-600 hover:bg-red-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
            >
              <Zap size={18} />
              {offer.active ? "Deactivate" : "Activate Now"}
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// Stats Component
const StatCard = ({ title, value }) => (
  <motion.div
    className="bg-white rounded-xl shadow p-4 text-center border"
    whileHover={{ scale: 1.06 }}
  >
    <h2 className="text-3xl font-bold text-blue-600">{value}</h2>
    <p className="text-gray-500 text-sm">{title}</p>
  </motion.div>
);

export default OffersPage;
