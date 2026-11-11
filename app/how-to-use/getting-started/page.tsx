import type { Metadata } from "next";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 첫 실행 준비",
  description: "다운로드 아래 AIWORK Harness를 제안하며 다른 저장 폴더도 직접 선택할 수 있습니다.",
  alternates: { canonical: "/how-to-use/getting-started" },
};

export default function Page() {
  return <DetailPage productTopic="start" active="guide" eyebrow="AIWORK BROWSER" title="첫 실행 준비" description="다운로드 아래 AIWORK Harness를 제안하며 다른 저장 폴더도 직접 선택할 수 있습니다.">{null}</DetailPage>;
}
