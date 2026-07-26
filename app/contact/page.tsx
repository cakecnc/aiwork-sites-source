import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 문의 | 도입·결제·출시 상담",
  description:
    "AIWORK 도입, 출시 알림, 사전 구매와 Business Workspace에 관한 문의 방법 및 운영 사업자 정보를 안내합니다.",
};

const inquiries = [
  {
    label: "PRODUCT",
    title: "제품·출시 문의",
    description: "AIWORK Browser와 Desktop의 공개 일정, 제공 환경을 확인합니다.",
    subject: "AIWORK 제품·출시 문의",
  },
  {
    label: "BUSINESS",
    title: "도입 상담",
    description: "현재 업무 도구, 연결할 자료, 보안과 승인 요구사항을 함께 검토합니다.",
    subject: "AIWORK 도입 상담",
  },
  {
    label: "PAYMENT",
    title: "결제 전 확인",
    description: "사전 구매 범위, 디지털 상품 제공 방식과 거래 확인 절차를 문의합니다.",
    subject: "AIWORK 결제 전 문의",
  },
];

export default function ContactPage() {
  return (
    <DetailPage
      active="contact"
      eyebrow="CONTACT AIWORK"
      status="이메일·전화 상담"
      title={
        <>
          업무 환경에 맞는 도입을,
          <br />
          함께 검토합니다.
        </>
      }
      description="연결할 자료와 현재 업무 흐름, 필요한 결과를 알려주면 AIWORK의 현재 제공 범위와 준비 상태를 기준으로 안내합니다."
      imageLabel="AIWORK CONTACT AGENT"
    >
      <section className="content-section">
        <div className="content-heading">
          <span>CONTACT PATH</span>
          <h2>문의 목적을 선택하세요</h2>
          <p>
            아래 버튼은 이메일 앱을 엽니다. 비밀번호, API 키, 메일 앱 비밀번호,
            주민등록번호나 결제정보는 문의 내용에 입력하지 마세요.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {inquiries.map((item) => (
            <article className="fact-card contact-card" key={item.label}>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
              <a
                className="secondary-button"
                href={`mailto:cakecnc@daum.net?subject=${encodeURIComponent(
                  item.subject,
                )}&body=${encodeURIComponent(
                  "이름:\n회사명:\n현재 사용 도구:\n관심 기능:\n도입 목적:\n희망 일정:\n",
                )}`}
              >
                이메일 작성 <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-information">
        <div>
          <span className="section-kicker">CONTACT</span>
          <h2>AIWORK 운영 문의</h2>
          <p>평일 업무시간 기준으로 확인 후 순차 답변합니다.</p>
        </div>
        <address>
          <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
          <a href="tel:0806647077">080-664-7077</a>
        </address>
      </section>

      <section className="company-panel">
        <div>
          <span>OPERATOR</span>
          <h2>주식회사 씨엔씨코퍼레이션</h2>
        </div>
        <dl>
          <div>
            <dt>사업자등록번호</dt>
            <dd>140-81-50087</dd>
          </div>
          <div>
            <dt>사업장 주소</dt>
            <dd>
              경기도 부천시 원미구 부천로198번길 36
              <br />
              (춘의동, 춘의테크노파크 102-208)
            </dd>
          </div>
        </dl>
        <Link className="secondary-button" href="/privacy">
          개인정보처리방침
        </Link>
      </section>
    </DetailPage>
  );
}
