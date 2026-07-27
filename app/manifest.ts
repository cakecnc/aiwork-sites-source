import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "AIWORK",
    short_name: "AIWORK",
    description:
      "사용자가 직접 실행한 현재 페이지를 저장 전 미리보기하고 승인한 기록만 보관하는 AIWORK 공식 홈페이지",
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
