export const dynamic = "force-static";
import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWORK",
    short_name: "AIWORK",
    description:
      "Local Workbench와 활성화가 필요한 Browser RC의 현재 상태를 구분해 소개하는 AIWORK 공식 홈페이지",
    start_url: "/",
    display: "standalone",
    background_color: "#f7f9fc",
    theme_color: "#0f5fa8",
    lang: "ko",
    icons: [
      {
        src: "/images/aiwork-wink-assistant-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/aiwork-wink-assistant-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
