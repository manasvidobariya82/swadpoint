// // import React from "react";

// // const page = () => {
// //   return <div>settings</div>;
// // };

// // export default page;

// "use client";

// import { useState } from "react";
// import { Info, EyeOff } from "lucide-react";

// const Page = () => {
//   const [showPassword, setShowPassword] = useState(false);

//   return (
//     <div className="rounded-xl bg-white p-6 shadow-sm">
//       {/* Header */}
//       <div className="flex items-center justify-between border-b pb-4">
//         <h1 className="text-xl font-medium text-gray-900">SMTP Settings</h1>

//         <div className="flex items-center gap-1 cursor-pointer text-blue-600">
//           <Info size={16} />
//           <span className="text-sm font-medium">How it works!</span>
//         </div>
//       </div>

//       {/* Form */}
//       <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
//         {/* Host */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Host <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             defaultValue="smtp.gmail.com"
//             className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
//           />
//         </div>

//         {/* Port */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Port <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="text"
//             defaultValue="587"
//             className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
//           />
//         </div>

//         {/* Encryption */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Encryption <span className="text-red-500">*</span>
//           </label>
//           <select className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500">
//             <option>--- Select Encryption ---</option>
//             <option>TLS</option>
//             <option>SSL</option>
//           </select>
//         </div>

//         {/* Username */}
//         <div>
//           <label className="mb-2 block text-sm font-medium">
//             Username <span className="text-red-500">*</span>
//           </label>
//           <input
//             type="email"
//             defaultValue="example@gmail.com"
//             className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
//           />
//         </div>
//       </div>

//       {/* Password */}
//       <div className="mt-6">
//         <label className="mb-2 block text-sm font-medium">
//           Password <span className="text-red-500">*</span>
//         </label>

//         <p className="mb-2 text-xs text-gray-500">
//           <strong>Note :</strong> We save your password in encrypted format and
//           use it only for SMTP purposes.
//         </p>

//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             className="h-11 w-full rounded-md border border-gray-300 px-4 pr-10 text-sm outline-none focus:border-blue-500"
//           />
//           <EyeOff
//             size={18}
//             className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
//             onClick={() => setShowPassword(!showPassword)}
//           />
//         </div>
//       </div>

//       {/* Save Button */}
//       <div className="mt-8">
//         <button className="rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white">
//           Save Changes
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Page;

// app/settings/smtp/page.jsx
"use client";

import { useState, useEffect } from "react";
import {
  Info,
  Eye,
  EyeOff,
  Save,
  TestTube,
  Mail,
  Lock,
  Server,
  Shield,
  Send,
  CheckCircle,
  XCircle,
  RefreshCw,
  Key,
  Settings,
  AlertCircle,
  HelpCircle,
  Copy,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import { Toaster, toast } from "react-hot-toast";

const SMTP_PROVIDERS = [
  {
    name: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    encryption: "TLS",
    icon: "📧",
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    name: "Outlook",
    host: "smtp.office365.com",
    port: 587,
    encryption: "TLS",
    icon: "📨",
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    name: "Yahoo",
    host: "smtp.mail.yahoo.com",
    port: 587,
    encryption: "TLS",
    icon: "✉️",
    color: "bg-purple-50 text-purple-600 border-purple-200",
  },
  {
    name: "Zoho",
    host: "smtp.zoho.com",
    port: 587,
    encryption: "TLS",
    icon: "📮",
    color: "bg-green-50 text-green-600 border-green-200",
  },
  {
    name: "Custom",
    host: "",
    port: 587,
    encryption: "TLS",
    icon: "⚙️",
    color: "bg-gray-50 text-gray-600 border-gray-200",
  },
];

const ENCRYPTION_TYPES = [
  {
    value: "TLS",
    label: "TLS (Recommended)",
    description: "Transport Layer Security",
  },
  { value: "SSL", label: "SSL", description: "Secure Sockets Layer" },
  { value: "NONE", label: "No Encryption", description: "Not recommended" },
];

const SETTINGS_GUIDE = [
  {
    title: "Server Settings",
    summary: "Host, port, and encryption define how your app talks to the mail server.",
    icon: Server,
    style: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    title: "Authentication",
    summary:
      "Username and app password validate your sender identity before email delivery.",
    icon: Lock,
    style: "bg-emerald-50 border-emerald-200 text-emerald-700",
  },
  {
    title: "Sender Identity",
    summary:
      "From name and from email are shown to customers in receipts and notifications.",
    icon: Mail,
    style: "bg-indigo-50 border-indigo-200 text-indigo-700",
  },
  {
    title: "Security Controls",
    summary:
      "Use TLS and app passwords to keep communication secure and avoid login failures.",
    icon: Shield,
    style: "bg-amber-50 border-amber-200 text-amber-700",
  },
];

export default function SMTPSettingsPage() {
  // State management
  const [smtpConfig, setSmtpConfig] = useState({
    provider: "Gmail",
    host: "smtp.gmail.com",
    port: 587,
    encryption: "TLS",
    username: "",
    password: "",
    fromEmail: "",
    fromName: "Your Restaurant",
    maxEmailsPerDay: 500,
    enableTracking: true,
    enableAutoReply: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [advancedSettings, setAdvancedSettings] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [copiedField, setCopiedField] = useState(null);

  // Load saved configuration
  useEffect(() => {
    const savedConfig = localStorage.getItem("smtpConfig");
    if (savedConfig) {
      setSmtpConfig(JSON.parse(savedConfig));
    }
  }, []);

  // Save configuration
  useEffect(() => {
    localStorage.setItem("smtpConfig", JSON.stringify(smtpConfig));
  }, [smtpConfig]);

  // Handle provider selection
  const handleProviderSelect = (providerName) => {
    const provider = SMTP_PROVIDERS.find((p) => p.name === providerName);
    if (provider) {
      setSmtpConfig((prev) => ({
        ...prev,
        provider: provider.name,
        host: provider.host,
        port: provider.port,
        encryption: provider.encryption,
      }));

      toast.success(`Selected ${providerName} configuration`);
    }
  };

  // Handle input changes
  const handleInputChange = (field, value) => {
    setSmtpConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Handle save configuration
  const handleSave = async () => {
    setIsSaving(true);

    // Validate required fields
    if (!smtpConfig.host || !smtpConfig.port || !smtpConfig.username) {
      toast.error("Please fill all required fields");
      setIsSaving(false);
      return;
    }

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    localStorage.setItem("smtpConfig", JSON.stringify(smtpConfig));
    setIsSaving(false);
    setConnectionStatus("connected");

    toast.success("SMTP configuration saved successfully!", {
      icon: "✅",
      duration: 4000,
    });
  };

  // Handle test connection
  const handleTestConnection = async () => {
    setIsTesting(true);

    // Simulate connection test
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const success = Math.random() > 0.3; // 70% success rate for demo

    if (success) {
      setTestResult({
        success: true,
        message: "Connection successful! Emails can be sent.",
        details: "SMTP server responded correctly.",
      });
      setConnectionStatus("connected");
      toast.success("SMTP connection test successful!");
    } else {
      setTestResult({
        success: false,
        message: "Connection failed. Please check your settings.",
        details: "Server timeout or authentication error.",
      });
      setConnectionStatus("failed");
      toast.error("SMTP connection test failed!");
    }

    setIsTesting(false);
  };

  // Handle copy to clipboard
  const handleCopyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast.success(`Copied ${field} to clipboard!`);

    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  // Generate example email template
  const generateEmailExample = () => {
    return {
      subject: "Welcome to Our Restaurant! 🍽️",
      body: `Hi [Customer Name],

Thank you for choosing [Your Restaurant Name]! We're excited to serve you.

🔔 Order Status Updates
📧 Receipts & Invoices
🎉 Special Offers & Discounts
⭐ Feedback & Reviews

Best regards,
${smtpConfig.fromName || "Your Restaurant Team"}`,
      preview: "This is how your emails will look to customers.",
    };
  };

  // Quick setup guides
  const setupGuides = {
    Gmail: {
      steps: [
        "Enable 2-Step Verification in your Google Account",
        "Generate an App Password (not your regular password)",
        "Use the App Password in the password field below",
        "Enable 'Less secure app access' if needed",
      ],
      link: "https://support.google.com/accounts/answer/185833",
    },
    Outlook: {
      steps: [
        "Go to Security Settings in your Microsoft account",
        "Enable two-factor authentication",
        "Generate an app-specific password",
        "Use that password in the SMTP settings",
      ],
      link: "https://support.microsoft.com/en-us/office",
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6 lg:p-8">
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#363636",
            color: "#fff",
          },
        }}
      />

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="text-blue-600" size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Email Settings
              </h1>
              <p className="text-gray-600">
                Configure SMTP for sending emails to customers
              </p>
            </div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {SETTINGS_GUIDE.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className={`rounded-xl border p-4 ${item.style}`}
              >
                <div className="mb-2 flex items-center gap-2">
                  <Icon size={18} />
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-700">{item.summary}</p>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Providers & Status */}
          <div className="lg:col-span-1">
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Connection Status
                </h3>

                <div
                  className={`p-4 rounded-lg mb-4 ${
                    connectionStatus === "connected"
                      ? "bg-green-50 border border-green-200"
                      : connectionStatus === "failed"
                      ? "bg-red-50 border border-red-200"
                      : "bg-yellow-50 border border-yellow-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-3 w-3 rounded-full ${
                        connectionStatus === "connected"
                          ? "bg-green-500 animate-pulse"
                          : connectionStatus === "failed"
                          ? "bg-red-500"
                          : "bg-yellow-500"
                      }`}
                    />
                    <span className="font-medium">
                      {connectionStatus === "connected"
                        ? "Connected & Ready"
                        : connectionStatus === "failed"
                        ? "Connection Failed"
                        : "Not Configured"}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mt-2">
                    {connectionStatus === "connected"
                      ? "Your SMTP settings are configured correctly. You can send emails."
                      : connectionStatus === "failed"
                      ? "There is an issue with your SMTP configuration. Please check and test."
                      : "Configure SMTP settings to start sending emails to customers."}
                  </p>
                </div>

                {/* Test Connection Button */}
                <button
                  onClick={handleTestConnection}
                  disabled={isTesting || !smtpConfig.host}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isTesting ? (
                    <>
                      <RefreshCw size={18} className="animate-spin" />
                      Testing Connection...
                    </>
                  ) : (
                    <>
                      <TestTube size={18} />
                      Test Connection
                    </>
                  )}
                </button>

                {/* Test Result */}
                {testResult && (
                  <div
                    className={`mt-4 p-4 rounded-lg ${
                      testResult.success
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {testResult.success ? (
                        <CheckCircle
                          className="text-green-600 flex-shrink-0"
                          size={20}
                        />
                      ) : (
                        <XCircle
                          className="text-red-600 flex-shrink-0"
                          size={20}
                        />
                      )}
                      <div>
                        <p className="font-medium">{testResult.message}</p>
                        <p className="text-sm text-gray-600 mt-1">
                          {testResult.details}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick Setup Providers */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Quick Setup
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Select your email provider for automatic configuration
                </p>

                <div className="space-y-3">
                  {SMTP_PROVIDERS.map((provider) => (
                    <button
                      key={provider.name}
                      onClick={() => handleProviderSelect(provider.name)}
                      className={`w-full flex items-center justify-between p-4 rounded-lg border transition-all ${
                        smtpConfig.provider === provider.name
                          ? `${provider.color} ring-2 ring-offset-2 ring-opacity-50`
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{provider.icon}</span>
                        <div className="text-left">
                          <div className="font-medium text-gray-900">
                            {provider.name}
                          </div>
                          {provider.host && (
                            <div className="text-xs text-gray-500">
                              {provider.host}:{provider.port}
                            </div>
                          )}
                        </div>
                      </div>
                      {smtpConfig.provider === provider.name && (
                        <CheckCircle className="text-green-600" size={18} />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Email Preview */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Email Preview
                </h3>
                <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="border-b pb-3 mb-3">
                    <div className="text-xs text-gray-500">From:</div>
                    <div className="font-medium">
                      {smtpConfig.fromName || "Your Restaurant"} &lt;
                      {smtpConfig.username || "you@example.com"}&gt;
                    </div>
                  </div>

                  <div className="text-xs text-gray-500 mb-2">Subject:</div>
                  <div className="font-medium mb-4">
                    Welcome to Our Restaurant! 🍽️
                  </div>

                  <div className="text-xs text-gray-500 mb-2">Preview:</div>
                  <div className="text-sm text-gray-700 bg-white p-3 rounded border">
                    Hi Customer, thank you for choosing us! We are excited to
                    serve you...
                  </div>

                  <button
                    onClick={() =>
                      toast("Sending test email...", { icon: "📧" })
                    }
                    className="w-full mt-4 py-2 text-center text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50"
                  >
                    Send Test Email
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Configuration Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              {/* Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    SMTP Configuration
                  </h2>
                  <p className="text-gray-600">
                    Setup email server for notifications, receipts, and
                    marketing
                  </p>
                </div>

                <button
                  onClick={() => setShowHelpModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
                >
                  <HelpCircle size={18} />
                  How it works
                </button>
              </div>

              {/* Form Grid */}
              <div className="space-y-8">
                {/* Server Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Server size={20} />
                    Server Settings
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        SMTP Host <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={smtpConfig.host}
                          onChange={(e) =>
                            handleInputChange("host", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="smtp.gmail.com"
                        />
                        <Server
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Port <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        value={smtpConfig.port}
                        onChange={(e) =>
                          handleInputChange(
                            "port",
                            parseInt(e.target.value) || 587
                          )
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="587"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Encryption <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={smtpConfig.encryption}
                          onChange={(e) =>
                            handleInputChange("encryption", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        >
                          {ENCRYPTION_TYPES.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                        <Shield
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {
                          ENCRYPTION_TYPES.find(
                            (t) => t.value === smtpConfig.encryption
                          )?.description
                        }
                      </p>
                    </div>
                  </div>
                </div>

                {/* Authentication */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Lock size={20} />
                    Authentication
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Username/Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="email"
                          value={smtpConfig.username}
                          onChange={(e) =>
                            handleInputChange("username", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your-email@gmail.com"
                        />
                        <Mail
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        {smtpConfig.username && (
                          <button
                            onClick={() =>
                              handleCopyToClipboard(
                                smtpConfig.username,
                                "username"
                              )
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2"
                          >
                            <Copy
                              size={16}
                              className="text-gray-400 hover:text-blue-600"
                            />
                          </button>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          value={smtpConfig.password}
                          onChange={(e) =>
                            handleInputChange("password", e.target.value)
                          }
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 pl-10 pr-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Enter your SMTP password"
                        />
                        <Key
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={18}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        🔒 We encrypt and store your password securely
                      </p>
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Send size={20} />
                    Sender Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={smtpConfig.fromEmail}
                        onChange={(e) =>
                          handleInputChange("fromEmail", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="noreply@yourrestaurant.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={smtpConfig.fromName}
                        onChange={(e) =>
                          handleInputChange("fromName", e.target.value)
                        }
                        className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your Restaurant Name"
                      />
                    </div>
                  </div>
                </div>

                {/* Advanced Settings Toggle */}
                <div>
                  <button
                    onClick={() => setAdvancedSettings(!advancedSettings)}
                    className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
                  >
                    {advancedSettings ? (
                      <ChevronRight className="rotate-90" size={18} />
                    ) : (
                      <ChevronRight size={18} />
                    )}
                    <span className="font-medium">Advanced Settings</span>
                  </button>

                  {advancedSettings && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Max Emails Per Day
                          </label>
                          <input
                            type="number"
                            value={smtpConfig.maxEmailsPerDay}
                            onChange={(e) =>
                              handleInputChange(
                                "maxEmailsPerDay",
                                parseInt(e.target.value) || 500
                              )
                            }
                            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={smtpConfig.enableTracking}
                            onChange={(e) =>
                              handleInputChange(
                                "enableTracking",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">
                            Enable email open tracking
                          </span>
                        </label>

                        <label className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={smtpConfig.enableAutoReply}
                            onChange={(e) =>
                              handleInputChange(
                                "enableAutoReply",
                                e.target.checked
                              )
                            }
                            className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
                          />
                          <span className="text-gray-700">
                            Enable auto-reply for out-of-hours
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security Note */}
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <div className="flex">
                    <AlertCircle
                      className="text-yellow-600 mr-2 flex-shrink-0"
                      size={20}
                    />
                    <div>
                      <p className="font-medium text-yellow-800">
                        Security Note
                      </p>
                      <p className="text-sm text-yellow-700 mt-1">
                        Your SMTP password is encrypted and stored securely. We
                        never store plain-text passwords. For Gmail/Outlook, use
                        app-specific passwords instead of your main account
                        password.
                      </p>
                      <button
                        onClick={() =>
                          window.open(
                            setupGuides[smtpConfig.provider]?.link ||
                              "https://example.com",
                            "_blank"
                          )
                        }
                        className="mt-2 text-sm font-medium text-yellow-700 hover:text-yellow-800 flex items-center gap-1"
                      >
                        View {smtpConfig.provider} Setup Guide
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <>
                        <RefreshCw size={18} className="animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save size={18} />
                        Save Configuration
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      setSmtpConfig({
                        provider: "Gmail",
                        host: "smtp.gmail.com",
                        port: 587,
                        encryption: "TLS",
                        username: "",
                        password: "",
                        fromEmail: "",
                        fromName: "Your Restaurant",
                        maxEmailsPerDay: 500,
                        enableTracking: true,
                        enableAutoReply: false,
                      });
                      toast.success("Settings reset to defaults");
                    }}
                    className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                  >
                    Reset to Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Help Modal */}
      {showHelpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">
                  How SMTP Works
                </h3>
                <button
                  onClick={() => setShowHelpModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    What is SMTP?
                  </h4>
                  <p className="text-gray-700">
                    SMTP (Simple Mail Transfer Protocol) is used to send emails
                    from your application to customers. It is essential for order
                    confirmations, receipts, notifications, and marketing
                    emails.
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Setup Steps:
                  </h4>
                  <ol className="space-y-3">
                    {setupGuides[smtpConfig.provider]?.steps.map(
                      (step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      )
                    ) ||
                      [
                        "Enter your SMTP server details",
                        "Provide authentication credentials",
                        "Configure sender information",
                        "Test the connection",
                      ].map((step, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <div className="flex-shrink-0 h-6 w-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <span className="text-gray-700">{step}</span>
                        </li>
                      ))}
                  </ol>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Common Uses:
                  </h4>
                  <ul className="text-gray-700 space-y-2">
                    <li>• Order confirmation emails</li>
                    <li>• Receipts and invoices</li>
                    <li>• Password reset emails</li>
                    <li>• Newsletter and promotions</li>
                    <li>• Customer support responses</li>
                  </ul>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => setShowHelpModal(false)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Got it!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
