// src/components/Navbar.jsx
import Navbar from "@/components/auth/Navbar";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="flex justify-between items-center px-10 py-5">
      <h1 className="text-2xl font-bold text-orange-500">SwadPoint</h1>

      <nav className="hidden md:flex gap-6">
        <Link href="/pricing">Pricing</Link>
        <Link href="/login">Login</Link>
        <Link href="/signup">Signup</Link>
      </nav>

      <Link href="/login" className="bg-orange-500 px-4 py-2 rounded-lg">
        Get Started
      </Link>
    </header>
  );
}
