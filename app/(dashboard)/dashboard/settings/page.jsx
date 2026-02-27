"use client";

import { useMemo, useState } from "react";
import {
  Bell,
  CreditCard,
  QrCode,
  Save,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  Store,
  Undo2,
  Users,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";
import { getPaymentConfig, savePaymentConfig } from "@/helper/storage";

const SETTINGS_STORAGE_KEY = "swadpointProductSettings";
const UPI_ID_REGEX = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^\+?[0-9][0-9\s-]{7,14}$/;
const TIME_REGEX = /^([01]\d|2[0-3]):([0-5]\d)$/;

const clampNumber = (value, min, max) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return min;
  return Math.max(min, Math.min(max, parsed));
};

const sanitizeText = (value, maxLength = 120) =>
  String(value || "")
    .trim()
    .slice(0, maxLength);

const createDefaultSettings = () => {
  const paymentConfig = getPaymentConfig();

  return {
    restaurant: {
      brandName: "SwadPoint Restaurant",
      branchName: "Main Branch",
      supportPhone: "+91 98765 43210",
      supportEmail: "support@swadpoint.com",
      city: "Surat",
      gstNumber: "",
      currency: "INR",
    },
    ordering: {
      autoAcceptOrders: false,
      defaultPrepMinutes: 20,
      allowWalkInWithoutPhone: false,
      splitBillEnabled: true,
      orderReadyDisplay: true,
    },
    qr: {
      requireRegisteredTable: false,
      manualTableEntry: true,
      showTableLabelToCustomer: true,
      useLiveMenuInQr: true,
    },
    payments: {
      enableUpi: true,
      enableCash: true,
      taxPercent: 5,
      serviceChargePercent: 0,
      upiId: paymentConfig.upiId,
      payeeName: paymentConfig.payeeName,
    },
    notifications: {
      lowStockAlerts: true,
      newOrderSound: true,
      paymentFailureAlerts: true,
      dailySummaryMail: true,
      dailySummaryTime: "23:00",
    },
    access: {
      managerCanEditMenu: true,
      cashierCanRefund: false,
      staffCanCloseOrder: true,
      requirePinForRefund: true,
    },
  };
};

const readSavedSettings = () => {
  const defaults = createDefaultSettings();
  if (typeof window === "undefined") return defaults;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return defaults;

    const saved = JSON.parse(raw);
    return {
      restaurant: { ...defaults.restaurant, ...(saved.restaurant || {}) },
      ordering: { ...defaults.ordering, ...(saved.ordering || {}) },
      qr: { ...defaults.qr, ...(saved.qr || {}) },
      payments: { ...defaults.payments, ...(saved.payments || {}) },
      notifications: { ...defaults.notifications, ...(saved.notifications || {}) },
      access: { ...defaults.access, ...(saved.access || {}) },
    };
  } catch {
    return defaults;
  }
};

const sanitizeSettings = (candidate) => {
  const defaults = createDefaultSettings();
  const source = candidate && typeof candidate === "object" ? candidate : {};
  const merged = {
    restaurant: { ...defaults.restaurant, ...(source.restaurant || {}) },
    ordering: { ...defaults.ordering, ...(source.ordering || {}) },
    qr: { ...defaults.qr, ...(source.qr || {}) },
    payments: { ...defaults.payments, ...(source.payments || {}) },
    notifications: { ...defaults.notifications, ...(source.notifications || {}) },
    access: { ...defaults.access, ...(source.access || {}) },
  };

  return {
    restaurant: {
      brandName: sanitizeText(merged.restaurant.brandName, 80),
      branchName: sanitizeText(merged.restaurant.branchName, 80),
      supportPhone: sanitizeText(merged.restaurant.supportPhone, 18),
      supportEmail: sanitizeText(merged.restaurant.supportEmail, 120),
      city: sanitizeText(merged.restaurant.city, 60),
      gstNumber: sanitizeText(merged.restaurant.gstNumber, 20),
      currency: "INR",
    },
    ordering: {
      autoAcceptOrders: Boolean(merged.ordering.autoAcceptOrders),
      defaultPrepMinutes: clampNumber(merged.ordering.defaultPrepMinutes, 1, 240),
      allowWalkInWithoutPhone: Boolean(merged.ordering.allowWalkInWithoutPhone),
      splitBillEnabled: Boolean(merged.ordering.splitBillEnabled),
      orderReadyDisplay: Boolean(merged.ordering.orderReadyDisplay),
    },
    qr: {
      requireRegisteredTable: Boolean(merged.qr.requireRegisteredTable),
      manualTableEntry: Boolean(merged.qr.manualTableEntry),
      showTableLabelToCustomer: Boolean(merged.qr.showTableLabelToCustomer),
      useLiveMenuInQr: Boolean(merged.qr.useLiveMenuInQr),
    },
    payments: {
      enableUpi: Boolean(merged.payments.enableUpi),
      enableCash: Boolean(merged.payments.enableCash),
      taxPercent: clampNumber(merged.payments.taxPercent, 0, 28),
      serviceChargePercent: clampNumber(merged.payments.serviceChargePercent, 0, 50),
      upiId: sanitizeText(merged.payments.upiId, 60),
      payeeName: sanitizeText(merged.payments.payeeName, 80),
    },
    notifications: {
      lowStockAlerts: Boolean(merged.notifications.lowStockAlerts),
      newOrderSound: Boolean(merged.notifications.newOrderSound),
      paymentFailureAlerts: Boolean(merged.notifications.paymentFailureAlerts),
      dailySummaryMail: Boolean(merged.notifications.dailySummaryMail),
      dailySummaryTime: sanitizeText(merged.notifications.dailySummaryTime, 5),
    },
    access: {
      managerCanEditMenu: Boolean(merged.access.managerCanEditMenu),
      cashierCanRefund: Boolean(merged.access.cashierCanRefund),
      staffCanCloseOrder: Boolean(merged.access.staffCanCloseOrder),
      requirePinForRefund: Boolean(merged.access.requirePinForRefund),
    },
  };
};

const validateSettings = (settings) => {
  if (settings.restaurant.brandName.length < 2) {
    return "Brand name must be at least 2 characters.";
  }
  if (settings.restaurant.branchName.length < 2) {
    return "Branch name must be at least 2 characters.";
  }
  if (!PHONE_REGEX.test(settings.restaurant.supportPhone)) {
    return "Support phone format is invalid.";
  }
  if (!EMAIL_REGEX.test(settings.restaurant.supportEmail)) {
    return "Support email format is invalid.";
  }
  if (settings.restaurant.city.length < 2) {
    return "City must be at least 2 characters.";
  }
  if (!settings.payments.enableUpi && !settings.payments.enableCash) {
    return "Enable at least one payment method (UPI or Cash).";
  }
  if (settings.payments.enableUpi && !UPI_ID_REGEX.test(settings.payments.upiId)) {
    return "UPI ID format is invalid.";
  }
  if (settings.payments.enableUpi && settings.payments.payeeName.length < 2) {
    return "Payee name must be at least 2 characters.";
  }
  if (!TIME_REGEX.test(settings.notifications.dailySummaryTime)) {
    return "Daily summary time must be in HH:MM format.";
  }
  return "";
};

export default function ProductSettingsPage() {
  const [settings, setSettings] = useState(() =>
    sanitizeSettings(readSavedSettings())
  );
  const [isSaving, setIsSaving] = useState(false);

  const paymentMethodsEnabled = useMemo(() => {
    const methods = [];
    if (settings.payments.enableUpi) methods.push("UPI");
    if (settings.payments.enableCash) methods.push("Cash");
    return methods.join(", ") || "None";
  }, [settings.payments.enableCash, settings.payments.enableUpi]);

  const updateField = (section, field, value) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        [section]: {
          ...prev[section],
          [field]: value,
        },
      };

      return sanitizeSettings(next);
    });
  };

  const saveAllSettings = async () => {
    const normalized = sanitizeSettings(settings);
    const validationError = validateSettings(normalized);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setIsSaving(true);

    try {
      if (typeof window !== "undefined") {
        localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
      }

      savePaymentConfig({
        upiId: normalized.payments.upiId,
        payeeName: normalized.payments.payeeName,
      });

      setSettings(normalized);
      await new Promise((resolve) => setTimeout(resolve, 400));
      toast.success("Settings saved successfully");
    } catch {
      toast.error("Could not save settings. Please retry.");
    } finally {
      setIsSaving(false);
    }
  };

  const resetDefaults = () => {
    setSettings(sanitizeSettings(createDefaultSettings()));
    toast.success("Default settings restored");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <Toaster position="top-right" />

      <div className="mx-auto max-w-7xl space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
                <Settings2 size={24} className="text-blue-600" />
                Product Settings
              </h1>
              <p className="mt-1 text-sm text-slate-600">
                Configure how SwadPoint works for your restaurant operations.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
              <div className="rounded-lg bg-blue-50 px-3 py-2 text-blue-700">
                <p className="text-xs">Prep Time</p>
                <p className="font-semibold">
                  {settings.ordering.defaultPrepMinutes} min
                </p>
              </div>
              <div className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-700">
                <p className="text-xs">Payments</p>
                <p className="font-semibold">{paymentMethodsEnabled}</p>
              </div>
              <div className="rounded-lg bg-indigo-50 px-3 py-2 text-indigo-700">
                <p className="text-xs">QR Mode</p>
                <p className="font-semibold">
                  {settings.qr.requireRegisteredTable ? "Strict" : "Flexible"}
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 px-3 py-2 text-amber-700">
                <p className="text-xs">Daily Report</p>
                <p className="font-semibold">
                  {settings.notifications.dailySummaryMail ? "On" : "Off"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <SectionCard
            title="Restaurant Identity"
            description="Core business profile shown across invoices, receipts, and customer communication."
            icon={Store}
          >
            <Input
              label="Brand Name"
              value={settings.restaurant.brandName}
              onChange={(value) => updateField("restaurant", "brandName", value)}
            />
            <Input
              label="Branch Name"
              value={settings.restaurant.branchName}
              onChange={(value) => updateField("restaurant", "branchName", value)}
            />
            <Input
              label="Support Phone"
              value={settings.restaurant.supportPhone}
              onChange={(value) => updateField("restaurant", "supportPhone", value)}
            />
            <Input
              label="Support Email"
              value={settings.restaurant.supportEmail}
              onChange={(value) => updateField("restaurant", "supportEmail", value)}
            />
            <Input
              label="City"
              value={settings.restaurant.city}
              onChange={(value) => updateField("restaurant", "city", value)}
            />
            <Input
              label="GST Number"
              value={settings.restaurant.gstNumber}
              onChange={(value) => updateField("restaurant", "gstNumber", value)}
            />
          </SectionCard>

          <SectionCard
            title="Order Workflow"
            description="Control how fast orders enter kitchen queue and what operators can do."
            icon={SlidersHorizontal}
          >
            <Toggle
              label="Auto accept new orders"
              checked={settings.ordering.autoAcceptOrders}
              onChange={(value) => updateField("ordering", "autoAcceptOrders", value)}
            />
            <Toggle
              label="Allow walk-in order without mobile number"
              checked={settings.ordering.allowWalkInWithoutPhone}
              onChange={(value) =>
                updateField("ordering", "allowWalkInWithoutPhone", value)
              }
            />
            <Toggle
              label="Enable split bill option"
              checked={settings.ordering.splitBillEnabled}
              onChange={(value) => updateField("ordering", "splitBillEnabled", value)}
            />
            <Toggle
              label="Show order-ready display on dashboard"
              checked={settings.ordering.orderReadyDisplay}
              onChange={(value) => updateField("ordering", "orderReadyDisplay", value)}
            />
            <Input
              label="Default Preparation Time (minutes)"
              type="number"
              value={String(settings.ordering.defaultPrepMinutes)}
              onChange={(value) =>
                updateField("ordering", "defaultPrepMinutes", Number(value) || 0)
              }
            />
          </SectionCard>

          <SectionCard
            title="Table QR Behavior"
            description="Define table validation strictness and what customer sees after scanning QR."
            icon={QrCode}
          >
            <Toggle
              label="Require registered table number"
              checked={settings.qr.requireRegisteredTable}
              onChange={(value) =>
                updateField("qr", "requireRegisteredTable", value)
              }
            />
            <Toggle
              label="Allow manual table entry in customer flow"
              checked={settings.qr.manualTableEntry}
              onChange={(value) => updateField("qr", "manualTableEntry", value)}
            />
            <Toggle
              label="Show table label to customer"
              checked={settings.qr.showTableLabelToCustomer}
              onChange={(value) =>
                updateField("qr", "showTableLabelToCustomer", value)
              }
            />
            <Toggle
              label="Always use latest dashboard menu in QR links"
              checked={settings.qr.useLiveMenuInQr}
              onChange={(value) => updateField("qr", "useLiveMenuInQr", value)}
            />
          </SectionCard>

          <SectionCard
            title="Payments & Billing"
            description="Configure accepted methods and tax behavior for order totals."
            icon={CreditCard}
          >
            <Toggle
              label="Enable UPI payments"
              checked={settings.payments.enableUpi}
              onChange={(value) => updateField("payments", "enableUpi", value)}
            />
            <Toggle
              label="Enable cash payments"
              checked={settings.payments.enableCash}
              onChange={(value) => updateField("payments", "enableCash", value)}
            />
            <Input
              label="UPI ID"
              value={settings.payments.upiId}
              onChange={(value) => updateField("payments", "upiId", value)}
            />
            <Input
              label="Payee Name"
              value={settings.payments.payeeName}
              onChange={(value) => updateField("payments", "payeeName", value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Tax (%)"
                type="number"
                value={String(settings.payments.taxPercent)}
                onChange={(value) =>
                  updateField("payments", "taxPercent", Number(value) || 0)
                }
              />
              <Input
                label="Service Charge (%)"
                type="number"
                value={String(settings.payments.serviceChargePercent)}
                onChange={(value) =>
                  updateField(
                    "payments",
                    "serviceChargePercent",
                    Number(value) || 0
                  )
                }
              />
            </div>
          </SectionCard>

          <SectionCard
            title="Notifications & Reports"
            description="Select operational alerts and daily report timing for management."
            icon={Bell}
          >
            <Toggle
              label="Low stock alerts"
              checked={settings.notifications.lowStockAlerts}
              onChange={(value) =>
                updateField("notifications", "lowStockAlerts", value)
              }
            />
            <Toggle
              label="New order sound"
              checked={settings.notifications.newOrderSound}
              onChange={(value) =>
                updateField("notifications", "newOrderSound", value)
              }
            />
            <Toggle
              label="Payment failure alerts"
              checked={settings.notifications.paymentFailureAlerts}
              onChange={(value) =>
                updateField("notifications", "paymentFailureAlerts", value)
              }
            />
            <Toggle
              label="Daily summary email"
              checked={settings.notifications.dailySummaryMail}
              onChange={(value) =>
                updateField("notifications", "dailySummaryMail", value)
              }
            />
            <Input
              label="Daily Summary Time"
              type="time"
              value={settings.notifications.dailySummaryTime}
              onChange={(value) =>
                updateField("notifications", "dailySummaryTime", value)
              }
            />
          </SectionCard>

          <SectionCard
            title="Team Access Rules"
            description="Role-based restrictions to keep cashier, manager, and staff actions controlled."
            icon={Users}
          >
            <Toggle
              label="Manager can edit menu and pricing"
              checked={settings.access.managerCanEditMenu}
              onChange={(value) => updateField("access", "managerCanEditMenu", value)}
            />
            <Toggle
              label="Cashier can process refund directly"
              checked={settings.access.cashierCanRefund}
              onChange={(value) => updateField("access", "cashierCanRefund", value)}
            />
            <Toggle
              label="Staff can close completed orders"
              checked={settings.access.staffCanCloseOrder}
              onChange={(value) => updateField("access", "staffCanCloseOrder", value)}
            />
            <Toggle
              label="Require PIN before refund approval"
              checked={settings.access.requirePinForRefund}
              onChange={(value) => updateField("access", "requirePinForRefund", value)}
            />
          </SectionCard>
        </div>

        <div className="sticky bottom-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600">
              <span className="mr-2 inline-flex items-center gap-1 font-semibold text-slate-900">
                <ShieldCheck size={16} className="text-emerald-600" />
                Safe to update:
              </span>
              Changes apply immediately to dashboard and customer ordering flow.
            </p>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetDefaults}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                <Undo2 size={16} />
                Reset
              </button>
              <button
                type="button"
                onClick={saveAllSettings}
                disabled={isSaving}
                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? "Saving..." : "Save Settings"}
              </button>
            </div>
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

const Input = ({ label, value, onChange, type = "text" }) => (
  <label className="block">
    <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
    />
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
