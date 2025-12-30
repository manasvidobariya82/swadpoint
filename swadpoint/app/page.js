// // src/app/page.js
// // import Hero from "@/components/Hero";

// // export default function Home() {
// //   return <></>;
// // }

// "use client";96
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();

//   return (
//     <div className="h-screen flex items-center justify-center">
//       <div className="p-10 shadow rounded text-center w-[500px]">
//         <h1 className="text-2xl mb-4">Create your digital menu now!!!</h1>

//         <button
//           onClick={() => router.push("/add-menu")}
//           className="text-blue-600 underline"
//         >
//           + Add Menu Item
//         </button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useAuth } from "./components/Header";

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p className="text-gray-600 mb-8">
        {isAuthenticated ? "You are logged in" : "Please login to continue"}
      </p>
    </div>
  );
}
