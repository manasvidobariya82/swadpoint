import "./globals.css";

export default function DashboardLayout({ children }) {
  return (
    <>
      <html>
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
