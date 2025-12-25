// import React from "react";

// const page = () => {
//   return <div>settings</div>;
// };

// export default page;

"use client";

import { useState } from "react";
import { Info, EyeOff } from "lucide-react";

const Page = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="rounded-xl bg-white p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        <h1 className="text-xl font-medium text-gray-900">SMTP Settings</h1>

        <div className="flex items-center gap-1 cursor-pointer text-blue-600">
          <Info size={16} />
          <span className="text-sm font-medium">How it works!</span>
        </div>
      </div>

      {/* Form */}
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Host */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Host <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            defaultValue="smtp.gmail.com"
            className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Port */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Port <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            defaultValue="587"
            className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
          />
        </div>

        {/* Encryption */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Encryption <span className="text-red-500">*</span>
          </label>
          <select className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500">
            <option>--- Select Encryption ---</option>
            <option>TLS</option>
            <option>SSL</option>
          </select>
        </div>

        {/* Username */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Username <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            defaultValue="example@gmail.com"
            className="h-11 w-full rounded-md border border-gray-300 px-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* Password */}
      <div className="mt-6">
        <label className="mb-2 block text-sm font-medium">
          Password <span className="text-red-500">*</span>
        </label>

        <p className="mb-2 text-xs text-gray-500">
          <strong>Note :</strong> We save your password in encrypted format and
          use it only for SMTP purposes.
        </p>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="h-11 w-full rounded-md border border-gray-300 px-4 pr-10 text-sm outline-none focus:border-blue-500"
          />
          <EyeOff
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-8">
        <button className="rounded-full bg-gray-600 px-6 py-2 text-sm font-medium text-white">
          Save Changes
        </button>
      </div>
    </div>
  );
};

export default Page;
