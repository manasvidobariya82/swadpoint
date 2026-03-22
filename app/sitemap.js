const siteUrl =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://swadpoint.example.com";

const routes = [
  "",
  "/welcome",
  "/features",
  "/plan",
  "/about-us",
  "/contact",
  "/faq",
  "/privacy-policy",
  "/login",
  "/signup",
  "/menu",
];

export default function sitemap() {
  const now = new Date();

  return routes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: now,
    changeFrequency: route === "" || route === "/welcome" ? "weekly" : "monthly",
    priority: route === "" || route === "/welcome" ? 1 : 0.7,
  }));
}
