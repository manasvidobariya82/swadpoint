// "use client";

// import { usePathname, useRouter } from "next/navigation";
// import { useState } from "react";

// const QUICK_LINKS = [
//   { label: "Home", href: "/welcome" },
//   { label: "Features", href: "/features" },
//   { label: "Plan", href: "/plan" },
//   { label: "About Us", href: "/about-us" },
// ];

// export default function MarketingFooter() {
//   const router = useRouter();
//   const pathname = usePathname();
//   const [subscriberEmail, setSubscriberEmail] = useState("");
//   const [subscribeStatus, setSubscribeStatus] = useState({
//     type: "",
//     message: "",
//   });

//   const handleSubscribe = (event) => {
//     event.preventDefault();

//     const normalizedEmail = subscriberEmail.trim().toLowerCase();
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     if (!emailRegex.test(normalizedEmail)) {
//       setSubscribeStatus({
//         type: "error",
//         message: "Please enter a valid email address.",
//       });
//       return;
//     }

//     try {
//       const storageKey = "swadpoint_newsletter_subscribers";
//       const existingSubscribers = JSON.parse(
//         localStorage.getItem(storageKey) || "[]"
//       );
//       const alreadyExists = existingSubscribers.some(
//         (entry) =>
//           (typeof entry === "string" ? entry : entry?.email) === normalizedEmail
//       );

//       if (!alreadyExists) {
//         existingSubscribers.push({
//           email: normalizedEmail,
//           subscribedAt: new Date().toISOString(),
//         });
//         localStorage.setItem(storageKey, JSON.stringify(existingSubscribers));
//       }

//       setSubscribeStatus({
//         type: "success",
//         message: alreadyExists
//           ? "This email is already subscribed."
//           : "Subscribed successfully. Updates will be shared on email.",
//       });
//       setSubscriberEmail("");
//     } catch {
//       setSubscribeStatus({
//         type: "error",
//         message: "Could not subscribe right now. Please try again.",
//       });
//     }
//   };

//   const scrollPageToTop = () => {
//     window.scrollTo({ top: 0, behavior: "smooth" });
//     const main = document.querySelector("main");
//     if (main && typeof main.scrollTo === "function") {
//       main.scrollTo({ top: 0, behavior: "smooth" });
//     }
//   };

//   const navigateToSection = (href) => {
//     if (pathname === href) {
//       scrollPageToTop();
//       return;
//     }

//     router.push(href);
//     window.setTimeout(scrollPageToTop, 100);
//   };

//   return (
//     <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-24 pb-10 relative overflow-hidden">
//       <div className="absolute inset-0 opacity-20 pointer-events-none">
//         <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
//         <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
//       </div>

//       <div className="relative z-10 max-w-7xl mx-auto px-6">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
//           <div>
//             <h3 className="text-3xl font-bold text-cyan-400 mb-5">SwadPoint</h3>
//             <p className="text-gray-400 leading-relaxed mb-6">
//               Empowering restaurants with smart automation and digital control.
//             </p>
//           </div>

//           <div>
//             <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
//             <ul className="space-y-4 text-gray-400">
//               {QUICK_LINKS.map((item) => (
//                 <li key={item.href}>
//                   <button
//                     type="button"
//                     onClick={() => navigateToSection(item.href)}
//                     className="text-left hover:text-cyan-400 transition-colors duration-300"
//                   >
//                     {item.label}
//                   </button>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-xl font-semibold mb-6">Contact</h4>
//             <ul className="space-y-4 text-gray-400">
//               <li>Surat, Gujarat</li>
//               <li>+91 98765 43210</li>
//               <li>
//                 <a
//                   href="mailto:support@swadpoint.com"
//                   className="hover:text-cyan-400 transition-colors"
//                 >
//                   support@swadpoint.com
//                 </a>
//               </li>
//               <li>Mon - Sat | 10:00 AM - 11:00 PM</li>
//             </ul>
//           </div>

//           <div>
//             <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
//             <p className="text-gray-400 mb-6">
//               Subscribe to receive product updates and feature releases.
//             </p>

//             <form onSubmit={handleSubscribe}>
//               <div className="flex overflow-hidden rounded-full border border-white/20">
//                 <input
//                   type="email"
//                   placeholder="Enter your email"
//                   className="px-5 py-3 bg-white/10 text-sm focus:outline-none w-full"
//                   value={subscriberEmail}
//                   onChange={(event) => {
//                     setSubscriberEmail(event.target.value);
//                     if (subscribeStatus.message) {
//                       setSubscribeStatus({ type: "", message: "" });
//                     }
//                   }}
//                   required
//                 />
//                 <button
//                   type="submit"
//                   className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:opacity-90 transition-all"
//                 >
//                   Subscribe
//                 </button>
//               </div>
//               {subscribeStatus.message ? (
//                 <p
//                   className={`mt-3 text-xs ${
//                     subscribeStatus.type === "success"
//                       ? "text-emerald-300"
//                       : "text-red-300"
//                   }`}
//                 >
//                   {subscribeStatus.message}
//                 </p>
//               ) : null}
//             </form>
//           </div>
//         </div>

//         <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
//           Copyright {new Date().getFullYear()} SwadPoint Technologies. All rights reserved.
//         </div>
//       </div>
//     </footer>
//   );
// }

"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

const QUICK_LINKS = [
  { label: "Home", href: "/welcome" },
  { label: "Features", href: "/features" },
  { label: "Plan", href: "/plan" },
  { label: "About Us", href: "/about-us" },
];

export default function MarketingFooter() {
  const router = useRouter();
  const pathname = usePathname();
  const [subscriberEmail, setSubscriberEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState({
    type: "",
    message: "",
  });

  const handleSubscribe = (event) => {
    event.preventDefault();

    const normalizedEmail = subscriberEmail.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedEmail)) {
      setSubscribeStatus({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    try {
      const subject = encodeURIComponent("New Newsletter Subscriber");
      const body = encodeURIComponent(
        `Hello SwadPoint Team,

You have received a new newsletter subscription.

Subscriber Email: ${normalizedEmail}

Regards,
SwadPoint Website`,
      );

      const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=support@swadpoint.com&su=${subject}&body=${body}`;

      window.open(gmailURL, "_blank");

      setSubscribeStatus({
        type: "success",
        message: "Redirecting to Gmail...",
      });

      setSubscriberEmail("");
    } catch {
      setSubscribeStatus({
        type: "error",
        message: "Could not redirect to Gmail. Please try again.",
      });
    }
  };

  const scrollPageToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    const main = document.querySelector("main");
    if (main && typeof main.scrollTo === "function") {
      main.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const navigateToSection = (href) => {
    if (pathname === href) {
      scrollPageToTop();
      return;
    }

    router.push(href);
    window.setTimeout(scrollPageToTop, 100);
  };

  return (
    <footer className="bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white pt-24 pb-10 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-10 left-10 w-80 h-80 bg-blue-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-purple-500 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-14">
          {/* Logo & About */}
          <div>
            <h3 className="text-3xl font-bold text-cyan-400 mb-5">SwadPoint</h3>
            <p className="text-gray-400 leading-relaxed mb-6">
              Empowering restaurants with smart automation and digital control.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-gray-400">
              {QUICK_LINKS.map((item) => (
                <li key={item.href}>
                  <button
                    type="button"
                    onClick={() => navigateToSection(item.href)}
                    className="text-left hover:text-cyan-400 transition-colors duration-300"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-gray-400">
              <li>Surat, Gujarat</li>
              <li>+91 98765 43210</li>
              <li>
                <a
                  href="mailto:support@swadpoint.com"
                  className="hover:text-cyan-400 transition-colors"
                >
                  support@swadpoint.com
                </a>
              </li>
              <li>Mon - Sat | 10:00 AM - 11:00 PM</li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-xl font-semibold mb-6">Stay Updated</h4>
            <p className="text-gray-400 mb-6">
              Subscribe to receive product updates and feature releases.
            </p>

            <form onSubmit={handleSubscribe}>
              <div className="flex overflow-hidden rounded-full border border-white/20">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-5 py-3 bg-white/10 text-sm focus:outline-none w-full"
                  value={subscriberEmail}
                  onChange={(event) => {
                    setSubscriberEmail(event.target.value);
                    if (subscribeStatus.message) {
                      setSubscribeStatus({ type: "", message: "" });
                    }
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-6 bg-gradient-to-r from-blue-500 to-cyan-500 font-semibold hover:opacity-90 transition-all"
                >
                  Subscribe
                </button>
              </div>

              {subscribeStatus.message && (
                <p
                  className={`mt-3 text-xs ${
                    subscribeStatus.type === "success"
                      ? "text-emerald-300"
                      : "text-red-300"
                  }`}
                >
                  {subscribeStatus.message}
                </p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-6 text-center text-gray-500 text-sm">
          Copyright {new Date().getFullYear()} SwadPoint Technologies. All
          rights reserved.
        </div>
      </div>
    </footer>
  );
}
