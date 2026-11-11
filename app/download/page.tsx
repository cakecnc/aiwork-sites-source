import type { Metadata } from "next";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 설치·출시 안내",
  description: "macOS 개발 빌드는 로컬 확인 단계이며 일반 공개 설치 파일과 공증은 준비 중입니다.",
  alternates: { canonical: "/download" },
};

export default function Page() {
  return <DetailPage productTopic="download" active="download" eyebrow="AIWORK BROWSER" title="설치·출시 안내" description="macOS 개발 빌드는 로컬 확인 단계이며 일반 공개 설치 파일과 공증은 준비 중입니다.">{null}</DetailPage>;
}
