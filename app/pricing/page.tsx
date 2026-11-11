import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";
import { SUPPORT_EMAIL, purchaseInquiryHref } from "../site-config";

export const metadata: Metadata = {
  title: "AIWORK 구매 문의 | 상품과 제공 범위",
  description:
    "AIWORK Professional·Business와 네이버 스마트스토어 실무팩의 제공 범위를 확인하고 구매 상담을 요청할 수 있습니다.",
  alternates: { canonical: "/pricing" },
};

const plans = [
  {
    name: "AIWORK Professional",
    price: "USD 19",
    billing: "출시 전 · 제공 범위 확인",
    status: "일반 출시 전",
    features: [
      "정식 출시 전 구매 문의",
      "Pro 이용자는 Hashcat · Studio 추가 이용료 없음",
      "현재 데스크톱 Pro는 서명 라이선스로 활성화",
    ],
    action: "Professional 구매 문의",
    href: purchaseInquiryHref("professional"),
  },
  {
    name: "AIWORK Business",
    price: "USD 49",
    billing: "개발 중 · 제공 범위 확인",
    status: "개발 중",
    features: [
      "Professional 제공 범위 포함",
      "Business Workspace는 개발 중",
      "우선 지원은 이메일로 제공",
    ],
    action: "Business 구매 문의",
    href: purchaseInquiryHref("business"),
  },
  {
    name: "네이버 스마트스토어 실무팩",
    price: "USD 29",
    billing: "디지털 상품 · 구성 확인",
    status: "현재 제공",
    features: [
      "상세페이지 기획",
      "상품명·검색 키워드·마케팅 문구",
      "고객응대·체크리스트·AI 프롬프트",
    ],
    action: "실무팩 구매 문의",
    href: purchaseInquiryHref("smartstore-pack"),
  },
];

export default function PricingPage() {
  return (
    <DetailPage
      active="pricing"
      eyebrow="PLANS & INQUIRY"
      status="구매 문의 접수"
      title={
        <>
          제공 범위를 확인하고,
          <br />
          필요한 상품만.
        </>
      }
      description="AIWORK Professional과 Business는 정식 출시 전입니다. 구매 문의에서 제공 범위와 일정을 먼저 확인해 주세요."
      imageLabel="INQUIRY GUIDE"
    >
      <section className="content-section">
        <p className="payment-disclaimer detail-disclaimer">
          Professional과 Business는 아직 일반 출시되지 않았습니다. Chrome
          Extension은 공개 출시 후, Google Drive 기능은 Google OAuth 승인 완료 후
          제공됩니다. 구매 문의를 등록하거나 {SUPPORT_EMAIL}로 제공 범위와 일정을
          먼저 확인해 주세요. 문의 등록은 구매·결제 완료를 뜻하지 않습니다. 향후
          결제 기능이 활성화되면 주문번호와 결제 이메일을 다시 입력하지 않습니다.
          서버가 결제 채널의 완료 상태를 확인한 뒤 이용코드를 발급하며, AIWORK에서는
          발급된 코드만 등록합니다.
        </p>

        <div className="content-grid content-grid-three pricing-detail-grid">
          {plans.map((plan, index) => (
            <article
              className={`price-card ${index === 0 ? "featured" : ""}`}
              key={plan.name}
            >
              <div className="card-status-row">
                <small className="product-name">{plan.name}</small>
                <span className="mini-status">{plan.status}</span>
              </div>
              <div className="price">
                <strong>
                  <bdi dir="ltr">{plan.price}</bdi>
                </strong>
                <span>{plan.billing}</span>
              </div>
              <ul>
                {plan.features.map((feature) => (
                  <li key={feature}>
                    <i>✓</i> {feature}
                  </li>
                ))}
              </ul>
              <Link
                className={
                  index === 0
                    ? "primary-button payment-button"
                    : "secondary-button payment-button"
                }
                href={plan.href}
              >
                {plan.action} <span>↗</span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>PAYMENT & ACCESS</span>
          <h2>결제부터 이용코드 등록까지 간단하게.</h2>
        </div>
        <p>
          상품 선택 → PayPal 또는 네이버 결제 → 서버의 결제 완료 확인 → 이용코드
          발급 → AIWORK에서 코드 등록 순서로 진행합니다. 고객은 주문번호와 결제
          이메일을 다시 입력하지 않습니다. 네이버 주문을 자동으로 확인하기 어려운
          경우에만 상품주문번호 확인을 요청할 수 있습니다. 문의에는 비밀번호나 API
          키를 포함하지 마세요.
        </p>
        <Link className="secondary-button" href="/contact">
          구매 문의 등록 <span>↗</span>
        </Link>
      </section>
    </DetailPage>
  );
}
