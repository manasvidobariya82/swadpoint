"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Header from "../../components/ui/Header";
import Sidebar from "./Sidebar";

const NON_ADMIN_ALLOWED_ROUTES = ["/dashboard", "/dashboard/my-account", "/dashboard/logout"];

const canAccessDashboardRoute = (role, pathname) => {
  if (!pathname) return true;
  if (role === "admin") return true;
  return NON_ADMIN_ALLOWED_ROUTES.includes(pathname);
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          if (!cancelled) {
            setUser(null);
            router.replace("/login");
          }
          return;
        }

        const data = await response.json();
        if (!data?.user) {
          if (!cancelled) {
            setUser(null);
            router.replace("/login");
          }
          return;
        }

        if (!cancelled) {
          setUser(data.user);
        }
      } catch {
        if (!cancelled) {
          setUser(null);
          router.replace("/login");
        }
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  useEffect(() => {
    if (!ready || !user) return;
    if (canAccessDashboardRoute(user.role, pathname)) return;
    router.replace("/dashboard");
  }, [pathname, ready, router, user]);

  if (!ready) {
    return null;
  }

  if (!user) {
    return null;
  }

  if (!canAccessDashboardRoute(user.role, pathname)) {
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
