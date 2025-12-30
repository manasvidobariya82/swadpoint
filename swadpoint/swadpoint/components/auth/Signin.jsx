// "use client";

// import { useState } from "react";
// import Button from "../ui/Button";

// export default function AuthPage() {
//   const [showSignup, setShowSignup] = useState(false);

//   const [signupData, setSignupData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });

//   const [loginData, setLoginData] = useState({
//     email: "",
//     password: "",
//   });

//   const [passwordError, setPasswordError] = useState("");

//   // ================= PASSWORD VALIDATION =================
//   const validatePassword = (password) => {
//     if (password.length < 8) {
//       return "Password must be at least 8 characters";
//     }
//     if (!/[A-Z]/.test(password)) {
//       return "Password must contain at least 1 uppercase letter";
//     }
//     if (!/[0-9]/.test(password)) {
//       return "Password must contain at least 1 number";
//     }
//     if (!/[!@#$%^&*]/.test(password)) {
//       return "Password must contain at least 1 special character";
//     }
//     return "";
//   };

//   // ================= CREATE ACCOUNT =================
//   const handleSignup = (e) => {
//     e.preventDefault();

//     if (!signupData.name || !signupData.email || !signupData.password) {
//       alert("All fields are required");
//       return;
//     }

//     const error = validatePassword(signupData.password);
//     if (error) {
//       setPasswordError(error);
//       return;
//     }

//     setPasswordError("");
//     console.log("ACCOUNT CREATED:", signupData);
//     alert("Account Created Successfully 🎉");

//     setShowSignup(false); // back to sign in
//   };

//   // ================= SIGN IN =================
//   const handleLogin = (e) => {
//     e.preventDefault();

//     if (!loginData.email || !loginData.password) {
//       alert("Email & Password required");
//       return;
//     }

//     console.log("LOGIN SUCCESS:", loginData);
//     alert("Login Successful ✅");
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
//         {/* ========== SIGN IN FORM ========== */}
//         {!showSignup && (
//           <form onSubmit={handleLogin}>
//             <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

//             <input
//               type="email"
//               placeholder="Email"
//               value={loginData.email}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, email: e.target.value })
//               }
//               className="w-full mb-4 px-4 py-3 border rounded-lg"
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               value={loginData.password}
//               onChange={(e) =>
//                 setLoginData({ ...loginData, password: e.target.value })
//               }
//               className="w-full mb-6 px-4 py-3 border rounded-lg"
//             />

//             <Button type="submit" className="w-full">
//               Sign In
//             </Button>

//             <p className="text-center text-sm text-gray-600 mt-4">
//               Don’t have an account?{" "}
//               <span
//                 onClick={() => setShowSignup(true)}
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//               >
//                 Create Account
//               </span>
//             </p>
//           </form>
//         )}

//         {/* ========== CREATE ACCOUNT FORM ========== */}
//         {showSignup && (
//           <form onSubmit={handleSignup}>
//             <h2 className="text-2xl font-semibold text-center mb-6">
//               Create Account
//             </h2>

//             <input
//               type="text"
//               placeholder="Full Name"
//               value={signupData.name}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, name: e.target.value })
//               }
//               className="w-full mb-4 px-4 py-3 border rounded-lg"
//             />

//             <input
//               type="email"
//               placeholder="Email"
//               value={signupData.email}
//               onChange={(e) =>
//                 setSignupData({ ...signupData, email: e.target.value })
//               }
//               className="w-full mb-4 px-4 py-3 border rounded-lg"
//             />

//             <input
//               type="password"
//               placeholder="Password"
//               value={signupData.password}
//               onChange={(e) => {
//                 setSignupData({
//                   ...signupData,
//                   password: e.target.value,
//                 });
//                 setPasswordError(validatePassword(e.target.value));
//               }}
//               className={`w-full mb-2 px-4 py-3 border rounded-lg outline-none
//                 ${
//                   passwordError
//                     ? "border-red-500 focus:ring-red-500"
//                     : "focus:ring-blue-500"
//                 }`}
//             />

//             {/* PASSWORD ERROR */}
//             {passwordError && (
//               <p className="text-red-500 text-sm mb-4">{passwordError}</p>
//             )}

//             <Button type="submit" className="w-full">
//               Create Account
//             </Button>

//             <p className="text-center text-sm text-gray-600 mt-4">
//               Already have an account?{" "}
//               <span
//                 onClick={() => setShowSignup(false)}
//                 className="text-blue-600 font-semibold cursor-pointer hover:underline"
//               >
//                 Sign In
//               </span>
//             </p>
//           </form>
//         )}
//       </div>
//     </div>
//   );
// }

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";

export default function AuthPage() {
  const router = useRouter();

  const [showSignup, setShowSignup] = useState(false);

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [passwordError, setPasswordError] = useState("");

  // ================= PASSWORD VALIDATION =================
  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least 1 uppercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least 1 number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least 1 special character";
    }
    return "";
  };

  // ================= CREATE ACCOUNT =================
  const handleSignup = (e) => {
    e.preventDefault();

    if (!signupData.name || !signupData.email || !signupData.password) {
      alert("All fields are required");
      return;
    }

    const error = validatePassword(signupData.password);
    if (error) {
      setPasswordError(error);
      return;
    }

    setPasswordError("");
    console.log("ACCOUNT CREATED:", signupData);
    alert("Account Created Successfully 🎉");

    setShowSignup(false);
  };

  // ================= SIGN IN =================
  const handleLogin = (e) => {
    e.preventDefault();

    if (!loginData.email || !loginData.password) {
      alert("Email & Password required");
      return;
    }

    console.log("LOGIN SUCCESS:", loginData);

    // ✅ redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-lg">
        {/* ========== SIGN IN FORM ========== */}
        {!showSignup && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-semibold text-center mb-6">Sign In</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full mb-4 px-4 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full mb-6 px-4 py-3 border rounded-lg"
            />

            <Button type="submit" className="w-full">
              Sign In
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <span
                onClick={() => setShowSignup(true)}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Create Account
              </span>
            </p>
          </form>
        )}

        {/* ========== CREATE ACCOUNT FORM ========== */}
        {showSignup && (
          <form onSubmit={handleSignup}>
            <h2 className="text-2xl font-semibold text-center mb-6">
              Create Account
            </h2>

            <input
              type="text"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({ ...signupData, name: e.target.value })
              }
              className="w-full mb-4 px-4 py-3 border rounded-lg"
            />

            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({ ...signupData, email: e.target.value })
              }
              className="w-full mb-4 px-4 py-3 border rounded-lg"
            />

            <input
              type="password"
              placeholder="Password"
              value={signupData.password}
              onChange={(e) => {
                setSignupData({
                  ...signupData,
                  password: e.target.value,
                });
                setPasswordError(validatePassword(e.target.value));
              }}
              className={`w-full mb-2 px-4 py-3 border rounded-lg outline-none
                ${
                  passwordError
                    ? "border-red-500 focus:ring-red-500"
                    : "focus:ring-blue-500"
                }`}
            />

            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}

            <Button type="submit" className="w-full">
              Create Account
            </Button>

            <p className="text-center text-sm text-gray-600 mt-4">
              Already have an account?{" "}
              <span
                onClick={() => setShowSignup(false)}
                className="text-blue-600 font-semibold cursor-pointer hover:underline"
              >
                Sign In
              </span>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
