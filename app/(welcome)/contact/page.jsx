"use client";

import { useState } from "react";
import MarketingFooter from "@/components/auth/MarketingFooter";

const INITIAL_FORM = {
  fullName: "",
  restaurantName: "",
  outlets: "",
  email: "",
  phone: "",
  requirement: "",
};

export default function ContactPage() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    localStorage.setItem(
      "swadpoint_enterprise_lead",
      JSON.stringify({
        ...form,
        submittedAt: new Date().toISOString(),
      })
    );
    setSubmitted(true);
    setForm(INITIAL_FORM);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-blue-100 bg-white p-8 shadow-lg">
            <h1 className="text-3xl font-bold text-slate-900 md:text-4xl">
              Custom Plan Request
            </h1>
            <p className="mt-4 text-slate-600">
              Share your restaurant requirements and our team will help you with
              enterprise pricing, deployment plan, and onboarding.
            </p>
            <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-slate-900">
                What you get
              </h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-600">
                <li>Dedicated onboarding and training plan</li>
                <li>Custom branding and multi-outlet setup</li>
                <li>Priority support with rollout assistance</li>
              </ul>
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                required
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                placeholder="Full name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <input
                required
                value={form.restaurantName}
                onChange={(event) =>
                  handleChange("restaurantName", event.target.value)
                }
                placeholder="Restaurant name"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  required
                  value={form.outlets}
                  onChange={(event) => handleChange("outlets", event.target.value)}
                  placeholder="Number of outlets"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                />
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(event) => handleChange("phone", event.target.value)}
                  placeholder="Phone number"
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                />
              </div>
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) => handleChange("email", event.target.value)}
                placeholder="Business email"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <textarea
                required
                value={form.requirement}
                onChange={(event) =>
                  handleChange("requirement", event.target.value)
                }
                rows={4}
                placeholder="Describe your custom requirements"
                className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
              <button
                type="submit"
                className="w-full rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Submit Custom Plan Request
              </button>
            </form>

            {submitted ? (
              <p className="mt-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Request submitted successfully. Our team will contact you soon.
              </p>
            ) : null}
          </section>
        </div>
      </div>
      <MarketingFooter />
    </div>
  );
}
