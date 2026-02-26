"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  Building2,
  Globe,
  Lock,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Store,
  UserCircle2,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { getOrders, getPayments, getTables } from "@/helper/storage";

const ACCOUNT_STORAGE_KEY = "swadpointAccountProfile";
const SETTINGS_STORAGE_KEY = "swadpointProductSettings";

const readRestaurantSettings = () => {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw)?.restaurant || {};
  } catch {
    return {};
  }
};

const createDefaultAccount = () => {
  const restaurant = readRestaurantSettings();

  return {
    ownerName: "Restaurant Owner",
    role: "Owner",
    email: restaurant.supportEmail || "owner@swadpoint.com",
    phone: restaurant.supportPhone || "+91 90000 00000",
    alternatePhone: "",
    brandName: restaurant.brandName || "SwadPoint Restaurant",
    branchName: restaurant.branchName || "Main Branch",
    city: restaurant.city || "Surat",
    address: "",
    website: "",
    gstNumber: restaurant.gstNumber || "",
    timezone: "Asia/Kolkata",
    language: "English",
    receiveOpsAlerts: true,
    receiveProductTips: true,
    loginEmailAlerts: true,
    twoFactorEnabled: false,
    requirePinForActions: true,
  };
};

const readSavedAccount = () => {
  const defaults = createDefaultAccount();
  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(ACCOUNT_STORAGE_KEY);
    if (!raw) return defaults;
    return { ...defaults, ...JSON.parse(raw) };
  } catch {
    return defaults;
  }
};

const toNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const isToday = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return false;

  const now = new Date();
  return (
    parsed.getFullYear() === now.getFullYear() &&
    parsed.getMonth() === now.getMonth() &&
    parsed.getDate() === now.getDate()
  );
};

export default function MyAccountPage() {
  const [account, setAccount] = useState(() => readSavedAccount());
  const [isSaving, setIsSaving] = useState(false);

  const metrics = useMemo(() => {
    const orders = getOrders();
    const tables = getTables();
    const payments = getPayments();

    const pendingOrders = orders.filter(
      (order) => String(order?.status || "").toLowerCase() === "pending"
    ).length;

    const todayRevenue = payments
      .filter(
        (payment) =>
          String(payment?.status || "").toLowerCase() === "success" &&
          isToday(payment?.timestamp)
      )
      .reduce((sum, payment) => sum + toNumber(payment?.amount), 0);

    const requiredFields = [
      account.ownerName,
      account.email,
      account.phone,
      account.brandName,
      account.branchName,
      account.city,
    ];
    const filled = requiredFields.filter((field) => String(field || "").trim()).length;
    const profileCompletion = Math.round((filled / requiredFields.length) * 100);

    return {
      pendingOrders,
      tablesConfigured: tables.length,
      todayRevenue,
      profileCompletion,
    };
  }, [account]);

  const updateField = (field, value) => {
    setAccount((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const syncFromSettings = () => {
    const restaurant = readRestaurantSettings();
    setAccount((prev) => ({
      ...prev,
      brandName: restaurant.brandName || prev.brandName,
      branchName: restaurant.branchName || prev.branchName,
      email: restaurant.supportEmail || prev.email,
      phone: restaurant.supportPhone || prev.phone,
      city: restaurant.city || prev.city,
      gstNumber: restaurant.gstNumber || prev.gstNumber,
    }));
    toast.success("Synced business details from Settings");
  };

  const saveAccount = async () => {
    if (!String(account.ownerName || "").trim()) {
      toast.error("Owner name is required");
      return;
    }
    if (!String(account.email || "").trim()) {
      toast.error("Email is required");
      return;
    }
    if (!String(account.phone || "").trim()) {
      toast.error("Phone is required");
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(ACCOUNT_STORAGE_KEY, JSON.stringify(account));
      await new Promise((resolve) => setTimeout(resolve, 350));
      toast.success("My Account updated");
    } catch {
      toast.error("Could not save account details");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <UserCircle2 size={24} className="text-blue-600" />
                My Account
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Manage owner profile, business identity, and security controls for
                your SwadPoint dashboard.
              </p>
            </div>
            <button
              type="button"
              onClick={syncFromSettings}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Sync from Settings
            </button>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              label="Pending Orders"
              value={String(metrics.pendingOrders)}
              tone="blue"
            />
            <StatCard
              label="Tables Configured"
              value={String(metrics.tablesConfigured)}
              tone="indigo"
            />
            <StatCard
              label="Today Revenue"
              value={`Rs. ${metrics.todayRevenue.toFixed(2)}`}
              tone="emerald"
            />
            <StatCard
              label="Profile Completion"
              value={`${metrics.profileCompletion}%`}
              tone="amber"
            />
          </div>
        </section>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard
            title="Owner Details"
            description="Primary person responsible for operations, order issues, and billing communication."
            icon={UserCircle2}
          >
            <Input
              label="Owner Name"
              value={account.ownerName}
              onChange={(value) => updateField("ownerName", value)}
            />
            <Input
              label="Role"
              value={account.role}
              onChange={(value) => updateField("role", value)}
            />
            <Input
              label="Email"
              type="email"
              value={account.email}
              onChange={(value) => updateField("email", value)}
              icon={Mail}
            />
            <Input
              label="Phone"
              value={account.phone}
              onChange={(value) => updateField("phone", value)}
              icon={Phone}
            />
            <Input
              label="Alternate Phone"
              value={account.alternatePhone}
              onChange={(value) => updateField("alternatePhone", value)}
            />
          </SectionCard>

          <SectionCard
            title="Business Profile"
            description="Identity details used in QR ordering, invoice headers, and customer support."
            icon={Building2}
          >
            <Input
              label="Brand Name"
              value={account.brandName}
              onChange={(value) => updateField("brandName", value)}
              icon={Store}
            />
            <Input
              label="Branch Name"
              value={account.branchName}
              onChange={(value) => updateField("branchName", value)}
            />
            <Input
              label="City"
              value={account.city}
              onChange={(value) => updateField("city", value)}
              icon={MapPin}
            />
            <Input
              label="Address"
              value={account.address}
              onChange={(value) => updateField("address", value)}
            />
            <Input
              label="Website"
              value={account.website}
              onChange={(value) => updateField("website", value)}
              placeholder="https://yourdomain.com"
              icon={Globe}
            />
            <Input
              label="GST Number"
              value={account.gstNumber}
              onChange={(value) => updateField("gstNumber", value)}
            />
          </SectionCard>

          <SectionCard
            title="Communication Preferences"
            description="Choose what notifications you receive from order, payment, and system activities."
            icon={Bell}
          >
            <Input
              label="Timezone"
              value={account.timezone}
              onChange={(value) => updateField("timezone", value)}
            />
            <Input
              label="Language"
              value={account.language}
              onChange={(value) => updateField("language", value)}
            />
            <Toggle
              label="Receive daily operations alerts"
              checked={account.receiveOpsAlerts}
              onChange={(value) => updateField("receiveOpsAlerts", value)}
            />
            <Toggle
              label="Receive product tips and release updates"
              checked={account.receiveProductTips}
              onChange={(value) => updateField("receiveProductTips", value)}
            />
            <Toggle
              label="Send login activity alerts on email"
              checked={account.loginEmailAlerts}
              onChange={(value) => updateField("loginEmailAlerts", value)}
            />
          </SectionCard>

          <SectionCard
            title="Security Controls"
            description="Protect dashboard access and sensitive actions like refund, discount override, and order closure."
            icon={Lock}
          >
            <Toggle
              label="Enable two-factor authentication"
              checked={account.twoFactorEnabled}
              onChange={(value) => updateField("twoFactorEnabled", value)}
            />
            <Toggle
              label="Require PIN for critical actions"
              checked={account.requirePinForActions}
              onChange={(value) => updateField("requirePinForActions", value)}
            />
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
              <p className="flex items-center gap-2 font-medium">
                <ShieldCheck size={16} />
                Account security status
              </p>
              <p className="mt-1">
                {account.twoFactorEnabled
                  ? "Two-factor is active. Security level is strong."
                  : "Two-factor is off. Enable it for stronger admin protection."}
              </p>
            </div>
          </SectionCard>
        </div>

        <div className="sticky bottom-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              Profile and business changes update immediately in this admin
              dashboard.
            </p>
            <button
              type="button"
              onClick={saveAccount}
              disabled={isSaving}
              className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              <Save size={16} />
              {isSaving ? "Saving..." : "Save My Account"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SectionCard = ({ title, description, icon: Icon, children }) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-5 flex items-start gap-3">
      <div className="rounded-lg bg-slate-100 p-2">
        <Icon size={18} className="text-slate-700" />
      </div>
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600">{description}</p>
      </div>
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);

const Input = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  icon: Icon,
}) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <div className="relative">
      {Icon ? (
        <span className="pointer-events-none absolute left-3 top-2.5 text-slate-400">
          <Icon size={16} />
        </span>
      ) : null}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`w-full rounded-lg border border-slate-300 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100 ${
          Icon ? "pl-9 pr-3" : "px-3"
        }`}
      />
    </div>
  </label>
);

const Toggle = ({ label, checked, onChange }) => (
  <label className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2">
    <span className="pr-3 text-sm text-slate-700">{label}</span>
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition ${
        checked ? "bg-blue-600" : "bg-slate-300"
      }`}
      aria-label={label}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition ${
          checked ? "left-5" : "left-0.5"
        }`}
      />
    </button>
  </label>
);

const StatCard = ({ label, value, tone }) => {
  const toneClass =
    tone === "blue"
      ? "bg-blue-50 text-blue-700"
      : tone === "indigo"
      ? "bg-indigo-50 text-indigo-700"
      : tone === "emerald"
      ? "bg-emerald-50 text-emerald-700"
      : "bg-amber-50 text-amber-700";

  return (
    <div className={`rounded-lg px-3 py-2 ${toneClass}`}>
      <p className="text-xs">{label}</p>
      <p className="font-semibold">{value}</p>
    </div>
  );
};
