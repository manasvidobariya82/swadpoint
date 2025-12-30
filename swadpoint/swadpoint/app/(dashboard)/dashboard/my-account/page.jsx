// import React from "react";

// const page = () => {
//   return <div>bhhwbsisj</div>;
// };

// export default page;

"use client";

import { Camera } from "lucide-react";

export default function MyAccountPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-6xl rounded-xl bg-white p-8 shadow">
        {/* Header */}
        <h1 className="text-2xl font-semibold text-gray-900">Edit Profile</h1>
        <p className="text-sm text-gray-500">
          Set Up Your Personal Information
        </p>

        <div className="my-6 border-b" />

        {/* Profile Image Section */}
        <div className="mb-10 flex items-center gap-8">
          <div className="relative">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gray-500 text-white text-sm">
              LOGO
            </div>

            <button className="absolute bottom-0 right-0 rounded-full bg-black p-2 text-white">
              <Camera size={14} />
            </button>
          </div>

          <p className="text-sm text-gray-500">
            Only jpg, jpeg or png are allowed.
          </p>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <input
            defaultValue="en"
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            defaultValue="manasvidobariya82@gmail.com"
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <div className="flex items-center gap-3 rounded-lg border px-4 py-3">
            <span>🇮🇳</span>
            <input
              defaultValue="+91 91791 61261"
              className="w-full outline-none"
            />
          </div>

          <input
            defaultValue="₹"
            className="rounded-lg border px-4 py-3 outline-none focus:ring-2 focus:ring-black"
          />

          <input
            placeholder="Address Line 1"
            className="rounded-lg border px-4 py-3 outline-none"
          />

          <input
            placeholder="Address Line 2"
            className="rounded-lg border px-4 py-3 outline-none"
          />

          <select className="rounded-lg border px-4 py-3">
            <option>Gujarat</option>
            <option>Maharashtra</option>
          </select>

          <select className="rounded-lg border px-4 py-3">
            <option>Agol</option>
            <option>Surat</option>
          </select>

          <input defaultValue="mn" className="rounded-lg border px-4 py-3" />

          <input defaultValue="mn" className="rounded-lg border px-4 py-3" />
        </div>

        {/* Location Links */}
        <div className="mt-4 flex justify-between text-sm">
          <button className="text-blue-600 hover:underline">
            Use Current Location
          </button>
          <button className="text-blue-600 hover:underline">View on Map</button>
        </div>

        {/* Save Button */}
        <div className="mt-10 text-right">
          <button className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800">
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
