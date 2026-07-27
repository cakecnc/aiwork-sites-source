import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://aiwork.to/sitemap.xml",
    host: "https://aiwork.to",
  };
}
