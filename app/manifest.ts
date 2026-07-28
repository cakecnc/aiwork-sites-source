import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWORK",
    short_name: "AIWORK",
    description:
      "AIWORK Browser RC와 승인 기반 Workbench 제품 비전을 소개하는 AIWORK 공식 홈페이지",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#0f5fa8",
    lang: "ko",
    icons: [
      {
        src: "/images/aiwork-product-mark-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/aiwork-product-mark-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
