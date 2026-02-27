"use client";
import React, { useState } from "react";
import { Check, Zap } from "lucide-react";
import { motion } from "framer-motion";

const MAX_OFFER_TITLE_LENGTH = 80;
const MAX_OFFER_DESC_LENGTH = 140;
const MAX_POINT_LENGTH = 120;
const ALLOWED_BADGE_COLORS = [
  "bg-pink-500",
  "bg-yellow-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-red-500",
];

const sanitizeText = (value, maxLength) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const sanitizeOffer = (offer, index) => {
  if (!offer || typeof offer !== "object") return null;

  const title = sanitizeText(offer.title, MAX_OFFER_TITLE_LENGTH);
  const desc = sanitizeText(offer.desc, MAX_OFFER_DESC_LENGTH);
  const points = (Array.isArray(offer.points) ? offer.points : [])
    .map((point) => sanitizeText(point, MAX_POINT_LENGTH))
    .filter(Boolean)
    .slice(0, 5);

  if (!title || !desc || points.length === 0) return null;

  return {
    id: sanitizeText(offer.id, 32) || `offer-${index + 1}`,
    title,
    desc,
    points,
    active: Boolean(offer.active),
    badgeColor: ALLOWED_BADGE_COLORS.includes(offer.badgeColor)
      ? offer.badgeColor
      : "bg-blue-500",
  };
};

const normalizeOffers = (offers) =>
  (Array.isArray(offers) ? offers : [])
    .map((offer, index) => sanitizeOffer(offer, index))
    .filter(Boolean);

const OffersPage = () => {
  const [offers, setOffers] = useState(() =>
    normalizeOffers([
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
        desc: "On orders above Rs. 499",
        points: [
          "On orders above Rs. 499",
          "Free beverage or item",
          "Best to increase average order value",
          "Customizable free item",
        ],
        active: false,
        badgeColor: "bg-blue-500",
      },
    ])
  );

  const toggleOffer = (index) => {
    if (!Number.isInteger(index) || index < 0 || index >= offers.length) return;

    setOffers((prev) =>
      prev.map((offer, offerIndex) =>
        offerIndex === index ? { ...offer, active: !offer.active } : offer
      )
    );
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.h1
        className="mb-1 text-3xl font-bold text-gray-800"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        Today&apos;s Special Offers
      </motion.h1>

      <p className="mb-8 text-gray-600">
        Boost sales by attracting customers with focused deals.
      </p>

      <div className="mb-10 grid grid-cols-3 gap-4">
        <StatCard title="Active Offers" value={offers.filter((o) => o.active).length} />
        <StatCard title="Available Templates" value={offers.length} />
        <StatCard title="Avg. Order Increase" value="15-25%" />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
        {offers.map((offer, index) => (
          <motion.div
            key={offer.id}
            className="rounded-xl border border-gray-200 bg-white/70 p-6 shadow-xl backdrop-blur-xl transition-all hover:-translate-y-2 hover:shadow-2xl"
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <span
              className={`rounded-full px-3 py-1 text-xs text-white shadow-md ${offer.badgeColor}`}
            >
              {offer.active ? "Active" : "Inactive"}
            </span>

            <h3 className="mt-4 text-xl font-bold">{offer.title}</h3>
            <p className="mb-4 text-sm text-gray-600">{offer.desc}</p>

            <ul className="space-y-2 text-gray-700">
              {offer.points.map((point, pointIndex) => (
                <li key={`${offer.id}-point-${pointIndex}`} className="flex items-center gap-2">
                  <Check size={16} className="text-green-600" />
                  {point}
                </li>
              ))}
            </ul>

            <motion.button
              onClick={() => toggleOffer(index)}
              whileTap={{ scale: 0.95 }}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-lg py-2 font-medium text-white transition-all ${
                offer.active ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-700"
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

const StatCard = ({ title, value }) => (
  <motion.div
    className="rounded-xl border bg-white p-4 text-center shadow"
    whileHover={{ scale: 1.06 }}
  >
    <h2 className="text-3xl font-bold text-blue-600">{value}</h2>
    <p className="text-sm text-gray-500">{title}</p>
  </motion.div>
);

export default OffersPage;
