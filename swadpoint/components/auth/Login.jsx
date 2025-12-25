// // "use client";

// // import { useRouter } from "next/navigation";
// // import Button from "../ui/Button";
// // import Link from "next/link";

// // export default function Login() {
// //   const router = useRouter();

// //   return (
// //     <div className="min-h-screen flex items-center justify-center bg-gray-100">
// //       <div className="bg-white p-8 rounded-xl shadow-md w-96">
// //         <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
// //           Login
// //         </h2>

// //         <input
// //           type="email"
// //           placeholder="Email"
// //           className="border w-full p-2 mb-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //         />

// //         <input
// //           type="password"
// //           placeholder="Password"
// //           className="border w-full p-2 mb-5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
// //         />

// //         {/* LOGIN BUTTON */}
// //         <Button
// //           variant="primary"
// //           className="w-full"
// //           onClick={() => router.push("/dashboard")}
// //         >
// //           Login
// //         </Button>

// //         {/* SIGN UP LINE */}
// //         <p className="text-sm text-gray-600 text-center mt-5">
// //           Don&apos;t have an account?{" "}
// //           <Link
// //             href="/signup"
// //             className="text-blue-600 font-semibold hover:underline"
// //           >
// //             Sign up
// //           </Link>
// //         </p>
// //       </div>
// //     </div>
// //   );
// // }

// "use client";

// import { useRouter } from "next/navigation";
// import Button from "../ui/Button";
// import Link from "next/link";
// import { useState } from "react";
// import { FcGoogle } from "react-icons/fc";

// export default function Login() {
//   const router = useRouter();

//   const [form, setForm] = useState({
//     email: "",
//     password: "",
//   });

//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);

//   const validate = () => {
//     const newErrors = {};

//     if (!form.email) {
//       newErrors.email = "Email is required";
//     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
//       newErrors.email = "Enter a valid email address";
//     }

//     if (!form.password) {
//       newErrors.password = "Password is required";
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleLogin = () => {
//     if (!validate()) return;

//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       router.push("/dashboard");
//     }, 1000);
//   };

//   const handleGoogleLogin = () => {
//     // future: Google OAuth
//     alert("Google Login Integration Pending");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-sm bg-white border rounded-xl p-8 shadow-sm">
//         {/* LOGO / BRAND */}
//         <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
//           SwadPoint
//         </h1>
//         <p className="text-sm text-gray-500 text-center mb-6">
//           Login to your dashboard
//         </p>

//         {/* EMAIL */}
//         <div className="mb-4">
//           <input
//             type="email"
//             placeholder="Email address"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             className={`w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 ${
//               errors.email
//                 ? "border-red-500 focus:ring-red-200"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           />
//           {errors.email && (
//             <p className="text-xs text-red-500 mt-1">{errors.email}</p>
//           )}
//         </div>

//         {/* PASSWORD */}
//         <div className="mb-5">
//           <input
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             className={`w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 ${
//               errors.password
//                 ? "border-red-500 focus:ring-red-200"
//                 : "border-gray-300 focus:ring-blue-500"
//             }`}
//           />
//           {errors.password && (
//             <p className="text-xs text-red-500 mt-1">{errors.password}</p>
//           )}
//         </div>

//         {/* LOGIN */}
//         <Button
//           variant="primary"
//           className="w-full py-3 text-sm rounded-md"
//           disabled={loading}
//           onClick={handleLogin}
//         >
//           {loading ? "Logging in..." : "Login"}
//         </Button>

//         {/* DIVIDER */}
//         <div className="flex items-center gap-3 my-6">
//           <div className="h-px bg-gray-200 flex-1"></div>
//           <span className="text-xs text-gray-400">OR</span>
//           <div className="h-px bg-gray-200 flex-1"></div>
//         </div>

//         {/* GOOGLE LOGIN */}
//         <button
//           onClick={handleGoogleLogin}
//           className="w-full flex items-center justify-center gap-3 border rounded-md py-3 text-sm font-medium hover:bg-gray-50 transition"
//         >
//           <FcGoogle size={20} />
//           Continue with Google
//         </button>

//         {/* SIGN UP */}
//         <p className="text-sm text-gray-600 text-center mt-6">
//           Don&apos;t have an account?{" "}
//           <Link
//             href="/signup"
//             className="text-blue-600 font-semibold hover:underline"
//           >
//             Sign up
//           </Link>
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import Button from "../ui/Button";

export default function Login() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors = {};

    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(form.email)) {
      newErrors.email = "Enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (!validate()) return;

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/dashboard");
    }, 1000);
  };

  const handleGoogleLogin = () => {
    alert("Google Login Integration Pending");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 relative
      bg-[url('/images/food-bg.jpg')] bg-cover bg-center"
    >
      {/* LIGHT OVERLAY */}
      <div className="absolute inset-0 bg-white/70 backdrop-blur-sm"></div>

      {/* LOGIN CARD */}
      <div className="relative z-10 w-full max-w-sm bg-white border rounded-xl p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-900 mb-1">
          SwadPoint
        </h1>
        <p className="text-sm text-gray-500 text-center mb-6">
          Login to your dashboard
        </p>

        {/* EMAIL */}
        <div className="mb-4">
          <input
            type="email"
            placeholder="Email address"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className={`w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 ${
              errors.email
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email}</p>
          )}
        </div>

        {/* PASSWORD */}
        <div className="mb-5">
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className={`w-full px-4 py-3 rounded-md border text-sm focus:outline-none focus:ring-2 ${
              errors.password
                ? "border-red-500 focus:ring-red-200"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
          {errors.password && (
            <p className="text-xs text-red-500 mt-1">{errors.password}</p>
          )}
        </div>

        {/* LOGIN BUTTON */}
        <Button
          variant="primary"
          className="w-full py-3 text-sm rounded-md"
          disabled={loading}
          onClick={handleLogin}
        >
          {loading ? "Logging in..." : "Login"}
        </Button>

        {/* DIVIDER */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-gray-200 flex-1"></div>
          <span className="text-xs text-gray-400">OR</span>
          <div className="h-px bg-gray-200 flex-1"></div>
        </div>

        {/* GOOGLE LOGIN */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 border rounded-md py-3 text-sm font-medium hover:bg-gray-50 transition"
        >
          <FcGoogle size={20} />
          Continue with Google
        </button>

        {/* SIGN UP */}
        <p className="text-sm text-gray-600 text-center mt-6">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
