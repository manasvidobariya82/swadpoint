import MarketingFooter from "@/components/auth/MarketingFooter";

export const metadata = {
  title: "Privacy Policy",
  description:
    "Read the SwadPoint privacy policy for information about customer data, order data, billing information, and security practices.",
};

const POLICY_SECTIONS = [
  {
    title: "Information We Collect",
    body:
      "SwadPoint may store user account details, customer names, mobile numbers, order items, billing details, and operational configuration required to run restaurant workflows.",
  },
  {
    title: "How Data Is Used",
    body:
      "Collected data is used to process orders, manage billing, track customer activity, improve service quality, and operate the restaurant dashboard securely.",
  },
  {
    title: "Payments",
    body:
      "Payment-related information such as payment method, transaction reference, and payment status may be stored to support billing records and reconciliation.",
  },
  {
    title: "Authentication And Access",
    body:
      "User accounts are protected using hashed passwords and signed sessions. Admin-only routes are restricted to authorized users.",
  },
  {
    title: "Data Storage",
    body:
      "Core application records such as users, menu items, and orders are stored in the connected PostgreSQL database configured for the project.",
  },
  {
    title: "Contact",
    body:
      "For privacy-related questions, restaurant operators can use the contact channels listed on the SwadPoint website or support materials.",
  },
];

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Legal
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            Privacy Policy
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            This page describes the primary privacy expectations for SwadPoint
            user accounts, customer orders, and operational data.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {POLICY_SECTIONS.map((section) => (
            <section
              key={section.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {section.title}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {section.body}
              </p>
            </section>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
