// "use client";
// import { motion } from "framer-motion";

// export default function Hero() {
//   return (
//     <section className="relative min-h-screen bg-gradient-to-br from-orange-500 to-red-500 text-white flex items-center">
//       <div className="container mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
//         {/* Left */}
//         <motion.div
//           initial={{ opacity: 0, y: 40 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.6 }}
//         >
//           <h1 className="text-4xl md:text-6xl font-bold leading-tight">
//             Powering <br /> Smart Food Businesses
//           </h1>
//           <p className="mt-6 text-lg opacity-90">
//             One platform to manage orders, menus, customers & growth.
//           </p>

//           <div className="mt-8 flex gap-4">
//             <button className="bg-white text-orange-600 px-6 py-3 rounded-lg font-semibold">
//               Get Started
//             </button>
//             <button className="border border-white px-6 py-3 rounded-lg">
//               Request Demo
//             </button>
//           </div>
//         </motion.div>

//         {/* Right */}
//         <motion.img
//           src="/images/dashboard-mock.png"
//           alt="Dashboard"
//           className="rounded-xl shadow-2xl"
//           initial={{ opacity: 0, x: 40 }}
//           animate={{ opacity: 1, x: 0 }}
//         />
//       </div>
//     </section>
//   );
// }
