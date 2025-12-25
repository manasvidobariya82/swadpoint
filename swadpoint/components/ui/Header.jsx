"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "./Button";

export default function Header({ isAuthenticated = false, user }) {
  const [language, setLanguage] = useState("EN");
  const router = useRouter();

  const toggleLanguage = () => {
    setLanguage(language === "EN" ? "HI" : "EN");
  };

  return (
    <header className="w-full h-16 bg-white flex items-center justify-between px-6">
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="SwadPoint" className="h-20 w-12 " />
        {/* <span className="text-xl font-semibold text-blue-600 leading-none">
          SwadPoint
        </span> */}
      </div>

      <div className="flex items-center gap-4">
        {!isAuthenticated ? (
          <>
            <Button variant="primary" onClick={() => router.push("/login")}>
              Log in
            </Button>
            <Button variant="text">Request A Demo</Button>
            <button
              onClick={toggleLanguage}
              className="px-3 py-1 text-sm border rounded-md text-gray-700 hover:bg-gray-100"
            >
              {language}
            </button>
          </>
        ) : (
          <>
            <span className="text-sm text-gray-600">
              Hello, {user?.name || "Admin"}
            </span>
            <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
              {user?.name?.charAt(0) || "A"}
            </div>
          </>
        )}
      </div>
    </header>
  );
}
