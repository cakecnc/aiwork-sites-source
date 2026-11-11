import type { Metadata } from "next";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 제품 안내",
  description: "독립 Chromium 브라우저와 오른쪽 AI 대화, 프로필 및 공개 출시 준비 상태를 안내합니다.",
  alternates: { canonical: "/product" },
};

export default function Page() {
  return <DetailPage productTopic="product" active="product" eyebrow="AIWORK BROWSER" title="제품 안내" description="독립 Chromium 브라우저와 오른쪽 AI 대화, 프로필 및 공개 출시 준비 상태를 안내합니다.">{null}</DetailPage>;
}
