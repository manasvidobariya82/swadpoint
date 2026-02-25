"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/ui/Header";
import Sidebar from "./Sidebar";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const rawUser = localStorage.getItem("currentUser");

    if (!rawUser) {
      setReady(true);
      router.replace("/login");
      return;
    }

    try {
      setUser(JSON.parse(rawUser));
    } catch {
      setUser(null);
      router.replace("/login");
    } finally {
      setReady(true);
    }
  }, [router]);

  if (!ready) {
    return null;
  }

  if (!user) {
    return null;
  }
 
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      {/* HEADER (TOP) */}
      <header className="h-16 bg-white border-b flex-shrink-0 z-10">
        <Header isAuthenticated={Boolean(user)} user={user} />
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
