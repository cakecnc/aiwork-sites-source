import type { Metadata } from "next";
import PricingPageContent from "../components/PricingPageContent";
export const metadata: Metadata = {
  title: "AIWORK Free · Pro 요금 | 월 USD 19",
  description: "AIWORK Free와 Pro 비교. Pro 월 USD 19, 6개월 USD 114, 1년 USD 228. 현재 개발 빌드와 PayPal 연결 준비 상태를 안내합니다.",
  alternates: { canonical: "/pricing" },
};
export default function PricingPage() { return <PricingPageContent />; }
