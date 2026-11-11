import type { Locale } from "./i18n";

export const PRO_MONTHLY_USD = 19;
export const PRO_TERMS = [
  { id: "monthly", months: 1, totalUsd: PRO_MONTHLY_USD },
  { id: "half-year", months: 6, totalUsd: PRO_MONTHLY_USD * 6 },
  { id: "yearly", months: 12, totalUsd: PRO_MONTHLY_USD * 12 },
] as const;
export type ProTermId = (typeof PRO_TERMS)[number]["id"];

// Keep checkout closed until the merchant confirms the billing model and exact
// live PayPal products. A return URL must never grant a Pro entitlement.
export const PAYPAL_CHECKOUT_URLS: Record<ProTermId, string | null> = {
  monthly: null, "half-year": null, yearly: null,
};
const ko = {
  title: "Free로 시작하고, Pro로 확장하세요.",
  description: "AIWORK Pro는 월 USD 19입니다. 6개월 USD 114, 1년 USD 228로 월 요금을 그대로 계산하며 별도 할인은 적용하지 않습니다.",
  month: "월", terms: ["1개월", "6개월", "1년"],
  freeBilling: "기본 버전 · 무료",
  freeFeatures: ["독립 브라우저·탭·북마크와 NetGhost 프로필", "프로젝트 1개", "REA 분석·재구성은 Pro 전용"],
  proFeatures: ["Free 기본 기능과 여러 프로젝트 · 라이선스별 한도", "REA 분석과 정적 웹 화면 재구성", "Hashcat · Studio 추가 이용료 없음"],
  freeAction: "Free 구현 범위 보기", period: "Pro 이용 기간", total: "선택 기간 요금",
  calculation: "USD 19 × {months}개월 · 할인 없음",
  checkout: "PayPal로 결제", pending: "PayPal 연결 준비 중", inquiry: "Pro 도입 문의",
  availability: "현재 macOS 개발 빌드 기준입니다. 일반 공개 설치 파일은 준비 중이며, 무료 버전 표시가 즉시 다운로드 가능하다는 뜻은 아닙니다.",
  paymentNote: "정기 자동갱신 여부와 실제 PayPal 상품을 확인한 뒤 결제를 열 예정입니다. 현재 이 화면에서는 결제되거나 Pro 권한이 부여되지 않습니다.",
  activation: "현재 데스크톱 Pro는 설치 기기에 연결된 서명 라이선스로 활성화합니다. 결제 확인·운영 라이선스 자동 발급·제품 간 권한 연동은 아직 완료되지 않았습니다. 클라우드 AI 공급자의 계정과 사용료는 별도입니다.",
  otherTitle: "다른 상품 문의", otherNote: "기존 Business와 스마트스토어 실무팩은 별도 상품입니다. AIWORK Free/Pro 요금과 구분해 제공 범위를 확인하세요.",
  business: "Business · USD 49 · 개발 중", smartstore: "스마트스토어 실무팩 · USD 29",
};
const en: typeof ko = {
  title: "Start with Free. Expand with Pro.",
  description: "AIWORK Pro is USD 19 per month. Six months is USD 114 and one year is USD 228, calculated at the same monthly rate with no discount.",
  month: "month", terms: ["1 month", "6 months", "1 year"],
  freeBilling: "Basic version · Free",
  freeFeatures: ["Independent browser, tabs, bookmarks and NetGhost profiles", "1 project", "REA analysis and reconstruction require Pro"],
  proFeatures: ["Free features and multiple projects, within the license limit", "REA analysis and static web-view reconstruction", "Hashcat and Studio at no additional usage charge"],
  freeAction: "View implemented Free features", period: "Pro access period", total: "Price for the selected period",
  calculation: "USD 19 × {months} months · No discount",
  checkout: "Pay with PayPal", pending: "PayPal connection pending", inquiry: "Ask about Pro access",
  availability: "Based on the current macOS development build. A general public installer is still pending; a Free listing does not mean an immediate download is available.",
  paymentNote: "Checkout will open after the recurring-billing model and actual PayPal products are verified. This screen does not currently take payment or grant Pro access.",
  activation: "Desktop Pro currently uses a signed license tied to the installation. Payment verification, automatic production-license delivery and cross-product access are not complete. Cloud AI providers have separate account and usage charges.",
  otherTitle: "Other product inquiries", otherNote: "Business and the Smart Store practical pack remain separate products. Check their scope independently of AIWORK Free/Pro pricing.",
  business: "Business · USD 49 · In development", smartstore: "Smart Store practical pack · USD 29",
};
// Product detail copy already uses Korean/English in this release. Mark the
// English fallback explicitly for screen readers rather than mislabelling it.
export function proPricingCopy(locale: Locale) {
  return { text: locale === "ko" ? ko : en, language: locale === "ko" ? "ko" : "en" } as const;
}
