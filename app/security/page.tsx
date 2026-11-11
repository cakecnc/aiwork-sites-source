import type { Metadata } from "next";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 데이터와 전송 범위",
  description: "프로필별 로컬 데이터, 클라우드 전송 동의와 현재 검증 범위를 안내합니다.",
  alternates: { canonical: "/security" },
};

export default function Page() {
  return <DetailPage productTopic="security" active="security" eyebrow="AIWORK BROWSER" title="데이터와 전송 범위" description="프로필별 로컬 데이터, 클라우드 전송 동의와 현재 검증 범위를 안내합니다.">{null}</DetailPage>;
}
