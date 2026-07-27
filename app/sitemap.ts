import type { MetadataRoute } from "next";

const routes = [
  "",
  "/product",
  "/features",
  "/security",
  "/pricing",
  "/download",
  "/contact",
  "/privacy",
  "/how-to-use",
  "/how-to-use/browser",
  "/how-to-use/getting-started",
  "/how-to-use/documents",
  "/how-to-use/web-research",
  "/how-to-use/daum-email",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date("2026-07-28T00:00:00+09:00");
  return routes.map((route) => ({
    url: `https://aiwork.to${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : route === "/privacy" ? 0.6 : 0.8,
  }));
}
