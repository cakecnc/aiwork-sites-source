import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 웹 조사 사용법 | 출처 기반 리서치",
  description:
    "조사 목적 설정, URL·검색 주제 추가, 출처·날짜 검토와 보고서 전환까지 AIWORK 웹 조사 흐름을 설명합니다.",
  alternates: { canonical: "/how-to-use/web-research" },
};

const researchSteps = [
  {
    title: "조사 목적과 결정 질문 작성",
    body: "‘누가 잠재 바이어인가?’처럼 결과로 내려야 할 결정을 먼저 정합니다.",
  },
  {
    title: "URL 또는 검색 주제 추가",
    body: "기준 자료와 조사 범위를 구분하고, 최신성이 중요한 항목은 확인 날짜를 적습니다.",
  },
  {
    title: "출처별 핵심 내용 정리",
    body: "사실, 출처의 주장과 AIWORK의 해석을 구분해 읽습니다.",
  },
  {
    title: "원문과 날짜 확인",
    body: "가격, 규정, 연락처와 일정처럼 바뀔 수 있는 정보는 원문을 다시 확인합니다.",
  },
  {
    title: "보고서와 실행안으로 전환",
    body: "후보 목록, 우선순위, 위험, 연락 초안과 다음 검증 항목으로 나눕니다.",
  },
];

export default function WebResearchGuidePage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="GUIDE 03 · WEB RESEARCH"
      status="로드맵 업무 사례 · 현재 미구현"
      title={
        <>
          웹 자료를
          <br />
          근거 있는 실행안으로.
        </>
      }
      description="자동 웹 검색·AI 분석·보고서 작성은 현재 Browser RC에 구현되지 않았습니다. 아래 내용은 후속 Research 기능을 위한 업무 사례입니다."
      image="/images/aiwork-synthwave-hero-v2.webp"
      imageAlt="웹 리서치와 출처 연결을 표현한 AIWORK 콘셉트"
      imageLabel="SOURCE-AWARE RESEARCH"
      imageTone="wide"
    >
      <section className="warning-panel" role="note">
        <strong>현재 자동 Research 기능 없음</strong>
        <p>
          Browser RC는 사용자가 실행한 현재 탭만 수집합니다. 검색 자동화, RAG,
          후보 발굴과 AI 보고서 작성은 후속 개발 항목입니다.
        </p>
      </section>

      <section className="callout-panel">
        <div>
          <span>CURRENT MANUAL FLOW</span>
          <h2>현재 페이지를 Research 기록으로 저장할 수 있습니다.</h2>
        </div>
        <p>
          자동 검색이나 AI 보고서 생성은 없지만, 사용자가 직접 연 조사 페이지를
          Browser로 수집하고 미리보기를 검토한 뒤 Research 종류로 저장하는 수동
          흐름은 1.0 RC에 포함됩니다.
        </p>
        <Link className="secondary-button" href="/how-to-use/browser">
          Browser 수집 방법 <span>↗</span>
        </Link>
      </section>

      <section className="content-section">
        <ol className="process-list process-list-detailed">
          {researchSteps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="case-study-panel">
        <div>
          <span className="section-kicker">RESEARCH EXAMPLE</span>
          <h2>수출 바이어 조사 사례</h2>
          <p>
            시장 우선순위, 제품 적합성, 공개 연락 가능성을 기준으로 후보를 정리하고
            샘플 패키지와 90일 실행계획까지 연결한 조사 방식입니다.
          </p>
        </div>
        <div className="case-metrics">
          <span>
            <strong>01</strong> 시장 기준
          </span>
          <span>
            <strong>02</strong> 제품 적합성
          </span>
          <span>
            <strong>03</strong> 실행 가능성
          </span>
        </div>
      </section>

      <section className="prompt-example">
        <div>
          <span className="section-kicker">RESEARCH PROMPT</span>
          <h2>조사 요청 예시</h2>
        </div>
        <blockquote>
          “공식 웹사이트와 최신 공개 자료를 기준으로 [시장]의 [대상] 후보를
          조사해 주세요. 평가 기준은 [기준 1·2·3]이며, 각 후보의 근거 링크,
          확인일, 위험 요소와 다음 접촉안을 표로 정리해 주세요.”
        </blockquote>
      </section>

      <section className="detail-cta">
        <div>
          <span>NEED A REVIEW?</span>
          <h2>업무에 맞는 조사 구조를 함께 검토합니다.</h2>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/contact">
            도입 상담 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/how-to-use">
            사용법 허브
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
