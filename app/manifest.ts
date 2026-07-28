import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWORK",
    short_name: "AIWORK",
    description:
      "AIWORK Browser RC와 승인 기반 Workbench 제품 비전을 소개하는 AIWORK 공식 홈페이지",
    start_url: "/",
    display: "standalone",
    background_color: "#07071b",
    theme_color: "#07071b",
    lang: "ko",
    icons: [
      {
        src: "/images/aiwork-anime-profile-192.png",
        sizes: "192x192",
        type: "image/png",
      },
    ],
  };
}
