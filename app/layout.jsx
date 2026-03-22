import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://swadpoint.example.com";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "SwadPoint",
    template: "%s | SwadPoint",
  },
  description:
    "SwadPoint is a restaurant ordering and admin management platform with menu, orders, billing, customers, and dashboard tools.",
  keywords: [
    "SwadPoint",
    "restaurant management",
    "digital menu",
    "order management",
    "restaurant dashboard",
  ],
  openGraph: {
    title: "SwadPoint",
    description:
      "Restaurant ordering, billing, and admin dashboard platform built with Next.js and PostgreSQL.",
    url: siteUrl,
    siteName: "SwadPoint",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
};

export default function DashboardLayout({ children }) {
  return (
    <>
      <html lang="en">
        <body>{children}</body>
      </html>
    </>
  );
}

// "use client";

// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";

// export default function DashboardLayout({ children }) {
//   const router = useRouter();
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = localStorage.getItem("currentUser");

//     if (!storedUser) {
//       router.push("/login");
//     } else {
//       setUser(storedUser);
//     }
//   }, []);

//   if (!user) return null;

//   return <>{children}</>;
// }
