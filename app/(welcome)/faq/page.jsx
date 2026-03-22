import MarketingFooter from "@/components/auth/MarketingFooter";

export const metadata = {
  title: "FAQ",
  description:
    "Frequently asked questions about SwadPoint restaurant ordering, billing, dashboard access, and setup.",
};

const FAQS = [
  {
    question: "What is SwadPoint?",
    answer:
      "SwadPoint is a restaurant management platform for digital menus, table ordering, billing, customer insights, and admin operations.",
  },
  {
    question: "Can customers place orders without talking to staff?",
    answer:
      "Yes. Customers can scan a table QR, browse the menu, add items to the cart, and place orders directly from the menu page.",
  },
  {
    question: "Does SwadPoint support admin login?",
    answer:
      "Yes. Authenticated admin users can access the dashboard, manage menu items, review customers, billing, orders, and restaurant settings.",
  },
  {
    question: "How are orders tracked?",
    answer:
      "Each order is saved in PostgreSQL with customer details, items, totals, payment details, timestamps, and completion status.",
  },
  {
    question: "Which payment methods are supported?",
    answer:
      "The current setup supports UPI and Cash workflows. Payment configuration is managed through the billing settings and payment APIs.",
  },
  {
    question: "Is SwadPoint mobile friendly?",
    answer:
      "Yes. The menu and dashboard screens are built with responsive layouts so they can adapt to phones, tablets, and desktops.",
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">
            Help Center
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">FAQ</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-gray-600">
            Common questions about authentication, customer ordering, dashboard
            access, and platform workflow.
          </p>
        </div>

        <div className="mt-8 space-y-4">
          {FAQS.map((item) => (
            <section
              key={item.question}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {item.question}
              </h2>
              <p className="mt-3 text-sm leading-7 text-gray-600">
                {item.answer}
              </p>
            </section>
          ))}
        </div>
      </main>

      <MarketingFooter />
    </div>
  );
}
