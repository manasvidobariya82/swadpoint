// import React from 'react'

// const page = () => {
//   return (
//     <div>page</div>
//   )
// }

// export default page

// "use client";

// import React from "react";
// import { FiEdit2, FiInfo } from "react-icons/fi";

// export default function PaymentGateway() {
//   const gateways = [
//     { name: "Stripe", link: "https://stripe.com" },
//     { name: "CCAvenue", link: "https://www.ccavenue.com" },
//     { name: "PhonePe", link: "https://www.phonepe.com" },
//     { name: "Razorpay", link: "https://razorpay.com" },
//   ];

//   return (
//     <div className="p-6 bg-gray-100 min-h-screen">
//       <div className="bg-white rounded-lg shadow-sm p-6">
//         {/* Header */}
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-xl font-semibold">Payment Gateway</h2>
//           <button className="flex items-center gap-2 text-blue-600 text-sm">
//             <FiInfo />
//             How it works!
//           </button>
//         </div>

//         {/* Table */}
//         <div className="overflow-x-auto">
//           <table className="w-full border-collapse">
//             <thead>
//               <tr className="border-b text-left text-gray-700">
//                 <th className="py-3">Gateway Name</th>
//                 <th className="py-3">Is Configured?</th>
//                 <th className="py-3">Activate</th>
//                 <th className="py-3">Configure</th>
//               </tr>
//             </thead>

//             <tbody>
//               {gateways.map((gateway, index) => (
//                 <tr key={index} className="border-b last:border-none text-sm">
//                   {/* Gateway Name */}
//                   <td className="py-4">
//                     <div className="flex items-center gap-3">
//                       <span className="font-medium">{gateway.name}</span>
//                       <a
//                         href={gateway.link}
//                         target="_blank"
//                         className="text-blue-500 text-xs"
//                       >
//                         Register Now
//                       </a>
//                     </div>
//                   </td>

//                   {/* Is Configured */}
//                   <td className="py-4">
//                     <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
//                       No
//                     </span>
//                   </td>

//                   {/* Activate */}
//                   <td className="py-4 text-gray-400">—</td>

//                   {/* Configure */}
//                   <td className="py-4">
//                     <button className="bg-green-100 text-green-600 p-2 rounded">
//                       <FiEdit2 />
//                     </button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";

export default function PaymentGateway() {
  const gateways = [
    { name: "Stripe", link: "https://stripe.com" },
    { name: "CCAvenue", link: "https://www.ccavenue.com" },
    { name: "PhonePe", link: "https://www.phonepe.com" },
    { name: "Razorpay", link: "https://razorpay.com" },
  ];

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-sm p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Gateway</h2>
          <button className="flex items-center gap-2 text-blue-600 text-sm">
            ℹ️ How it works!
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b text-left text-gray-700">
                <th className="py-3">Gateway Name</th>
                <th className="py-3">Is Configured?</th>
                <th className="py-3">Activate</th>
                <th className="py-3">Configure</th>
              </tr>
            </thead>

            <tbody>
              {gateways.map((gateway, index) => (
                <tr key={index} className="border-b last:border-none text-sm">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-medium">{gateway.name}</span>
                      <a
                        href={gateway.link}
                        target="_blank"
                        className="text-blue-500 text-xs"
                      >
                        Register Now
                      </a>
                    </div>
                  </td>

                  <td className="py-4">
                    <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-semibold">
                      No
                    </span>
                  </td>

                  <td className="py-4 text-gray-400">—</td>

                  <td className="py-4">
                    <button className="bg-green-100 text-green-600 px-3 py-1 rounded text-sm">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
