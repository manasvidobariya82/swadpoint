"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Toaster, toast } from "react-hot-toast";
import Header from "../../components/ui/Header";
import Sidebar from "./Sidebar";

const SETTINGS_STORAGE_KEY = "swadpointProductSettings";

const readNewOrderSoundEnabled = () => {
  if (typeof window === "undefined") return true;

  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return true;
    const parsed = JSON.parse(raw);
    return parsed?.notifications?.newOrderSound !== false;
  } catch {
    return true;
  }
};

const playNotificationTone = () => {
  if (typeof window === "undefined") return;

  try {
    const AudioContextClass =
      window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    const audioContext = new AudioContextClass();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
    gainNode.gain.setValueAtTime(0.001, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.08,
      audioContext.currentTime + 0.02,
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      audioContext.currentTime + 0.35,
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.35);
    oscillator.onended = () => {
      audioContext.close().catch(() => {});
    };
  } catch {
    // Ignore browser audio restrictions.
  }
};

export default function DashboardLayout({ children }) {
  const router = useRouter();
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
    if (!user) return undefined;

    const seenEvents = new Set();
    const eventSource = new EventSource("/api/orders/stream");

    const handleOrderEvent = (event) => {
      try {
        const payload = JSON.parse(event.data);
        if (!payload || payload.type !== "order.created") return;

        const eventKey = `${payload.type}:${payload.orderId}:${payload.timestamp}`;
        if (seenEvents.has(eventKey)) return;
        seenEvents.add(eventKey);

        toast.success(`New order received${payload.orderId ? ` (${payload.orderId})` : ""}`);

        if (readNewOrderSoundEnabled()) {
          playNotificationTone();
        }

        window.dispatchEvent(
          new CustomEvent("swadpoint-order-event", {
            detail: payload,
          }),
        );
      } catch {
        // Ignore malformed events.
      }
    };

    eventSource.addEventListener("orders", handleOrderEvent);

    return () => {
      eventSource.removeEventListener("orders", handleOrderEvent);
      eventSource.close();
    };
  }, [user]);

  if (!ready) {
    return null;
  }

  if (!user) {
    return null;
  }
 
  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Toaster position="top-right" />
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
