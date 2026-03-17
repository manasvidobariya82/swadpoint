import type { NextConfig } from "next";

const appTimeZone = process.env.APP_TIMEZONE || "Asia/Kolkata";
process.env.TZ = appTimeZone;

const nextConfig: NextConfig = {
  env: {
    APP_TIMEZONE: appTimeZone,
    NEXT_PUBLIC_APP_TIMEZONE: appTimeZone,
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/welcome",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
