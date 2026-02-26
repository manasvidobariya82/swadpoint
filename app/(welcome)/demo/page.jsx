"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import MarketingFooter from "@/components/auth/MarketingFooter";

const DEMO_STAGES = [
  {
    id: "scan",
    title: "1. Scan Table QR",
    summary: "Customer scans table QR from any mobile device.",
    points: [
      "No app install required",
      "Opens menu instantly in browser",
      "Table identity is auto-mapped",
    ],
  },
  {
    id: "cart",
    title: "2. Select Items & Place Order",
    summary: "Customer adds dishes to cart and confirms order.",
    points: [
      "Live menu with real-time prices",
      "Notes/customization support",
      "Secure checkout flow",
    ],
  },
  {
    id: "kitchen",
    title: "3. Order Sync to Admin & Kitchen",
    summary: "Order appears instantly in dashboard and kitchen panel.",
    points: [
      "New order notification",
      "Status updates: preparing -> ready -> served",
      "Multi-device live sync",
    ],
  },
  {
    id: "billing",
    title: "4. Billing, Reports & Customer History",
    summary: "Completed order updates billing, reports, and customer insights.",
    points: [
      "Invoice-ready data",
      "Daily revenue and item analytics",
      "Customer visit and order history",
    ],
  },
];

export default function DemoPage() {
  const router = useRouter();
  const [activeStage, setActiveStage] = useState(DEMO_STAGES[0].id);

  const active = useMemo(
    () => DEMO_STAGES.find((stage) => stage.id === activeStage) ?? DEMO_STAGES[0],
    [activeStage]
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-xl md:p-12">
          <div className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-blue-700">
            Live Product Demo
          </div>
          <h1 className="mt-4 text-3xl font-bold text-slate-900 md:text-5xl">
            SwadPoint End-to-End Ordering Flow
          </h1>
          <p className="mt-4 max-w-3xl text-base text-slate-600 md:text-lg">
            This walkthrough shows exactly how QR ordering moves from customer
            mobile to admin dashboard, billing, reports, and customer history.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Start Free Trial
            </button>
            <button
              type="button"
              onClick={() => router.push("/contact")}
              className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Request Custom Setup
            </button>
          </div>
        </section>

        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-3">
            {DEMO_STAGES.map((stage) => (
              <button
                key={stage.id}
                type="button"
                onClick={() => setActiveStage(stage.id)}
                className={`w-full rounded-2xl border p-5 text-left transition ${
                  activeStage === stage.id
                    ? "border-blue-500 bg-blue-50 shadow"
                    : "border-slate-200 bg-white hover:border-blue-200"
                }`}
              >
                <h3 className="text-lg font-semibold text-slate-900">
                  {stage.title}
                </h3>
                <p className="mt-2 text-sm text-slate-600">{stage.summary}</p>
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">{active.title}</h2>
            <p className="mt-2 text-slate-600">{active.summary}</p>
            <ul className="mt-5 space-y-3">
              {active.points.map((point) => (
                <li
                  key={point}
                  className="rounded-lg border border-blue-100 bg-blue-50/60 px-4 py-3 text-sm text-slate-700"
                >
                  {point}
                </li>
              ))}
            </ul>
          </div>
        </section>
      </div>
      <MarketingFooter />
    </div>
  );
}
