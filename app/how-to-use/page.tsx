import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 사용 흐름 | Browser RC와 로드맵 안내",
  description:
    "현재 Browser RC 사용 범위와 프로젝트·문서·웹 조사·Daum 메일 로드맵 예시를 구분해 안내합니다.",
};

const steps = [
  {
    title: "설치 또는 이용 가능 상태 확인",
    description:
      "공개 배포가 준비된 제품인지 확인합니다. 준비 중인 기능에는 실제 다운로드 버튼 대신 상태가 표시됩니다.",
  },
  {
    title: "업무 프로젝트 만들기",
    description:
      "프로젝트 이름, 목적과 최종 결과물을 짧게 정합니다. 예: ‘UAE 바이어 조사 보고서’.",
  },
  {
    title: "필요한 자료만 추가",
    description:
      "문서, 웹 출처 또는 연결 가능한 업무 자료 가운데 이번 작업에 필요한 범위를 선택합니다.",
  },
  {
    title: "원하는 결과를 구체적으로 요청",
    description:
      "대상, 기준, 형식과 마감 수준을 함께 적으면 더 일관된 결과를 얻을 수 있습니다.",
  },
  {
    title: "답변과 출처 검토",
    description:
      "사실, 가정과 준비 중인 기능을 구분하고 중요한 내용은 원문과 함께 확인합니다.",
  },
  {
    title: "필요한 결과만 저장·실행",
    description:
      "재사용할 결과만 프로젝트 기억에 반영하고 외부 전송이나 변경은 승인 후 진행합니다.",
  },
];

const guides = [
  {
    status: "기본 안내",
    label: "GETTING STARTED",
    title: "첫 프로젝트 만들기",
    description: "목적 설정부터 첫 질문, 출처 확인과 다음 작업까지 따라갑니다.",
    href: "/how-to-use/getting-started",
  },
  {
    status: "지원 방향",
    label: "DOCUMENTS",
    title: "회사 문서 활용하기",
    description: "문서 범위를 정하고 근거를 확인하며 필요한 결과만 저장합니다.",
    href: "/how-to-use/documents",
  },
  {
    status: "업무 사례",
    label: "WEB RESEARCH",
    title: "웹 자료 조사하기",
    description: "조사 목적, 출처, 날짜와 후속 실행안을 연결하는 흐름입니다.",
    href: "/how-to-use/web-research",
  },
  {
    status: "단계 검증 중",
    label: "DAUM EMAIL",
    title: "Daum 메일 연결하기",
    description: "읽기 전용 연결 기준과 계정 보안을 위한 준비 사항을 설명합니다.",
    href: "/how-to-use/daum-email",
  },
];

export default function HowToUsePage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="HOW TO USE AIWORK"
      status="Browser RC + 로드맵 안내"
      title={
        <>
          처음 시작하는
          <br />
          AIWORK.
        </>
      }
      description="현재 구현된 Browser RC는 사용자가 실행한 현재 탭 수집·미리보기와 승인 후 Drive 저장까지입니다. 아래 프로젝트·문서·조사·메일 흐름은 후속 제품 설계 참고입니다."
      imageLabel="YOUR AIWORK GUIDE"
    >
      <section className="warning-panel" role="note">
        <strong>현재 제공 범위</strong>
        <p>
          AI 추론·RAG·프로젝트 생성·문서 업로드·Daum 메일 연결·업무 자동화는
          현재 Browser RC에 구현되지 않았습니다. 아래 예시는 설치 후 실행할 수 있는
          기능 설명이 아니라 후속 제품의 사용 원칙과 설계 방향입니다.
        </p>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>QUICK START</span>
          <h2>공통 사용 흐름 6단계</h2>
          <p>
            제품별 화면은 달라질 수 있지만, 자료 선택·결과 검토·승인이라는 기본
            순서는 같습니다.
          </p>
        </div>
        <ol className="process-list">
          {steps.map((step, index) => (
            <li key={step.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>STEP-BY-STEP GUIDES</span>
          <h2>업무 유형별 개별 안내</h2>
          <p>각 주제를 독립 페이지로 나누어 필요한 설명만 바로 확인할 수 있습니다.</p>
        </div>
        <div className="guide-hub-grid">
          {guides.map((guide) => (
            <Link className="guide-card" href={guide.href} key={guide.label}>
              <div className="card-status-row">
                <small>{guide.label}</small>
                <span className="mini-status">{guide.status}</span>
              </div>
              <h3>{guide.title}</h3>
              <p>{guide.description}</p>
              <b>안내 보기 →</b>
            </Link>
          ))}
        </div>
      </section>

      <section className="prompt-example">
        <div>
          <span className="section-kicker">FIRST PROMPT</span>
          <h2>첫 요청은 이렇게 시작하세요.</h2>
        </div>
        <blockquote>
          “연결한 자료를 바탕으로 핵심 기회 3가지와 위험 요소, 이번 주에 실행할
          작업을 근거와 함께 정리해 주세요.”
        </blockquote>
        <p>
          결과 형식, 우선순위 기준, 제외할 내용과 필요한 언어를 추가하면 더 구체적인
          결과를 만들 수 있습니다.
        </p>
      </section>

      <section className="detail-cta">
        <div>
          <span>RELEASE STATUS</span>
          <h2>아직 설치 전이라면 출시 상태를 확인하세요.</h2>
          <p>AIWORK 배포판이 준비되기 전에도 사용 원칙과 기능별 안내를 볼 수 있습니다.</p>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/download">
            설치·출시 안내 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/contact">
            도입 문의
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
