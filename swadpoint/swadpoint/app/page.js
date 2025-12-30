// src/app/page.js
// import Hero from "@/components/Hero";

// export default function Home() {
//   return <></>;
// }

"use client";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="p-10 shadow rounded text-center w-[500px]">
        <h1 className="text-2xl mb-4">Create your digital menu now!!!</h1>

        <button
          onClick={() => router.push("/add-menu")}
          className="text-blue-600 underline"
        >
          + Add Menu Item
        </button>
      </div>
    </div>
  );
}
