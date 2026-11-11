import type { Metadata } from "next";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | Daum 메일 범위",
  description: "웹메일의 수동 사용과 아직 제공하지 않는 자동 메일 연결·분류·발송을 구분합니다.",
  alternates: { canonical: "/how-to-use/daum-email" },
};

export default function Page() {
  return <DetailPage productTopic="email" active="guide" eyebrow="AIWORK BROWSER" title="Daum 메일 범위" description="웹메일의 수동 사용과 아직 제공하지 않는 자동 메일 연결·분류·발송을 구분합니다.">{null}</DetailPage>;
}
