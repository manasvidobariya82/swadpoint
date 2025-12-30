"use client";

import { useEffect } from "react";
import Header from "../../components/ui/Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const user = localStorage.getItem("currentUser");
  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER (TOP) */}
      <header className="h-16 bg-white border-b flex-shrink-0 z-10">
        <Header isAuthenticated={true} user={JSON.parse(user)} />
      </header>

      {/* BODY (SIDEBAR + MAIN) */}
      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-64 bg-white border-r">
          <Sidebar />
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
