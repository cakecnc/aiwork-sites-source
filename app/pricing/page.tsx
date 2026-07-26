import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 결제 안내 | 사전 구매와 디지털 상품",
  description:
    "AIWORK Professional·Business 사전 구매 및 네이버 스마트스토어 실무팩의 제공 범위와 결제 전 확인 사항을 안내합니다.",
};

const plans = [
  {
    name: "AIWORK Professional",
    price: "USD 19",
    billing: "사전 구매 · 1회 결제",
    status: "일반 출시 전",
    features: [
      "정식 출시 전 사전 구매",
      "Chrome Extension은 공개 출시 후 제공",
      "Google Drive는 OAuth 승인 후 활성화",
    ],
    action: "Professional 사전 구매",
    href: "https://www.paypal.com/ncp/payment/TF7HCLYC5PM8S",
  },
  {
    name: "AIWORK Business",
    price: "USD 49",
    billing: "사전 구매 · 1회 결제",
    status: "개발 중",
    features: [
      "Professional 사전 구매 범위 포함",
      "Business Workspace는 개발 중",
      "우선 지원은 이메일로 제공",
    ],
    action: "Business 사전 구매",
    href: "https://www.paypal.com/ncp/payment/WTD5ZEKLT5GJS",
  },
  {
    name: "네이버 스마트스토어 실무팩",
    price: "USD 29",
    billing: "디지털 상품 · 1회 결제",
    status: "현재 제공",
    features: [
      "상세페이지 기획",
      "상품명·검색 키워드·마케팅 문구",
      "고객응대·체크리스트·AI 프롬프트",
    ],
    action: "실무팩 구매",
    href: "https://www.paypal.com/ncp/payment/H5SXU7HJ8GVRE",
  },
];

export default function PricingPage() {
  return (
    <DetailPage
      active="pricing"
      eyebrow="GLOBAL PAYMENTS"
      status="PayPal 1회 결제"
      title={
        <>
          제공 범위를 확인하고,
          <br />
          필요한 상품만.
        </>
      }
      description="AIWORK Professional과 Business는 정식 출시 전 사전 구매 상품입니다. 결제 전에 제공 범위와 일정을 반드시 확인해 주세요."
      imageLabel="PAYMENT GUIDE"
    >
      <section className="content-section">
        <p className="payment-disclaimer detail-disclaimer">
          Professional과 Business는 아직 일반 출시되지 않았습니다. Chrome
          Extension은 공개 출시 후, Google Drive 기능은 Google OAuth 승인 완료 후
          제공됩니다. 결제 전에 cakecnc@daum.net으로 제공 범위와 일정을 확인해
          주세요. 거래 확인과 상품·라이선스 제공은 수동으로 진행되며 PayPal 영수증과
          거래 ID를 보관해야 합니다.
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
              <a
                className={
                  index === 0
                    ? "primary-button payment-button"
                    : "secondary-button payment-button"
                }
                href={plan.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {plan.action} <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>BEFORE PAYMENT</span>
          <h2>결제 전 확인이 필요하신가요?</h2>
        </div>
        <p>
          사전 구매 일정, 제공 방식, 라이선스와 디지털 상품의 구성은 이메일로 먼저
          확인할 수 있습니다. 문의에는 비밀번호나 API 키를 포함하지 마세요.
        </p>
        <Link className="secondary-button" href="/contact">
          결제 전 문의 <span>↗</span>
        </Link>
      </section>
    </DetailPage>
  );
}
