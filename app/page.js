"use client";

// import { useAuth } from "./components/Header";

export default function HomePage() {
  // const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h1>
      <p className="text-gray-600 mb-8">
        {/* {isAuthenticated ? "You are logged in" : "Please login to continue"} */}
      </p>
    </div>
  );
}
