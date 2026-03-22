const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://swadpoint.example.com";

export default function robots() {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
