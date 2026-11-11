import type { Metadata } from "next";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 웹 자료 확인",
  description: "페이지 첨부의 제목·URL 범위와 사용자가 직접 확인해야 할 출처를 설명합니다.",
  alternates: { canonical: "/how-to-use/web-research" },
};

export default function Page() {
  return <DetailPage productTopic="research" active="guide" eyebrow="AIWORK BROWSER" title="웹 자료 확인" description="페이지 첨부의 제목·URL 범위와 사용자가 직접 확인해야 할 출처를 설명합니다.">{null}</DetailPage>;
}
