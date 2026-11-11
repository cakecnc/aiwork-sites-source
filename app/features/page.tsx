import type { Metadata } from "next";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 기능과 구현 범위",
  description: "탐색, NetGhost 프로필, 지원 데이터 가져오기, 선택형 모델과 첨부 범위를 구분합니다.",
  alternates: { canonical: "/features" },
};

export default function Page() {
  return <DetailPage productTopic="features" active="features" eyebrow="AIWORK BROWSER" title="기능과 구현 범위" description="탐색, NetGhost 프로필, 지원 데이터 가져오기, 선택형 모델과 첨부 범위를 구분합니다.">{null}</DetailPage>;
}
