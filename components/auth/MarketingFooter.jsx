import Link from "next/link";

const QUICK_LINKS = [
  { label: "Home", href: "/welcome" },
  { label: "Features", href: "/features" },
  { label: "Plan", href: "/plan" },
  { label: "About Us", href: "/about-us" },
];

export default function MarketingFooter() {
  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-24 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          <div>
            <h3 className="text-3xl font-bold text-cyan-400 mb-5">SwadPoint</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering restaurants with smart automation and digital control.
            </p>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Surat, Gujarat</li>
              <li>+91 98765 43210</li>
              <li>support@swadpoint.com</li>
              <li>Mon - Sat | 10:00 AM - 11:00 PM</li>
            </ul>
          </div>

          <div>
            <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to receive product updates and feature releases.
            </p>

            <div className="flex overflow-hidden rounded-full border border-white/20">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-5 py-3 bg-white/10 text-sm focus:outline-none w-full"
              />
              <button className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:opacity-90 transition-all">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
          Copyright {new Date().getFullYear()} SwadPoint Technologies. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
