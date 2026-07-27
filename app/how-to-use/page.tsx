import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser 사용법 | 수집·미리보기·Drive 저장",
  description:
    "AIWORK Browser 1.0 RC의 설치 전 확인, 현재 페이지 수집, 안전 미리보기, Source·Memory·Research 분류, Drive 저장과 삭제·연결 해제 방법을 안내합니다.",
  alternates: { canonical: "/how-to-use" },
};

const steps = [
  {
    title: "설치 가능 상태와 동의 확인",
    description:
      "현재는 공개 배포 전 Release Candidate입니다. 공개 출시 후 Chrome 116 이상에서 설치하고, 첫 실행 때 페이지 처리 동의와 Drive 저장 동의를 각각 확인합니다.",
  },
  {
    title: "현재 페이지에서 수집 실행",
    description:
      "수집할 페이지를 연 뒤 Toolbar 아이콘, 수집 단축키 또는 우클릭 Context Menu의 AIWORK 항목을 사용합니다. 사이드 패널은 Alt+Shift+A로 열 수 있습니다.",
  },
  {
    title: "안전 미리보기 검토",
    description:
      "제목·URL·선택 텍스트·본문 일부를 확인합니다. [REDACTED]로 치환된 민감정보와 프롬프트 인젝션 경고가 있으면 저장 전에 내용을 다시 검토합니다.",
  },
  {
    title: "템플릿·메모·분류 선택",
    description:
      "필요하면 업무 템플릿을 적용하고 메모와 태그를 추가한 뒤 Source·Memory·Research 중 저장 종류를 선택합니다.",
  },
  {
    title: "Drive 연결 후 승인 저장",
    description:
      "필요한 때에만 Google Drive를 연결합니다. AIWORK는 drive.appdata 범위만 사용하며, 승인한 기록만 비공개 appDataFolder에 저장합니다.",
  },
  {
    title: "Library·Queue·설정에서 관리",
    description:
      "Library에서 기록을 확인·삭제하고, Queue에서 저장·재시도 상태를 확인합니다. 설정에서는 언어·테마·Drive 연결과 동의 상태를 관리합니다.",
  },
];

const guides = [
  {
    status: "현재 기능",
    label: "BROWSER 1.0",
    title: "현재 페이지 수집·저장하기",
    description:
      "Toolbar·단축키·Context Menu부터 미리보기, 분류, Drive 저장과 삭제까지 따라갑니다.",
    href: "/how-to-use/browser",
  },
  {
    status: "기본 안내",
    label: "GETTING STARTED",
    title: "첫 실행 준비하기",
    description: "설치 조건, 초기 동의, 화면 설정과 첫 수집 전 확인 사항을 안내합니다.",
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
      status="Browser 1.0 RC · 공개 배포 전"
      title={
        <>
          현재 페이지를
          <br />
          안전하게 저장하는 방법.
        </>
      }
      description="AIWORK Browser 1.0 RC의 실제 흐름은 명시적 현재 페이지 수집, 안전 미리보기, 템플릿·메모·분류, 승인 후 Drive 저장과 기록 관리입니다."
      imageLabel="YOUR AIWORK GUIDE"
    >
      <section className="warning-panel" role="note">
        <strong>배포 상태</strong>
        <p>
          최종 Store 패키지는 준비됐지만 아직 Chrome Web Store에서 공개 배포되지
          않았습니다. 아래 Browser 사용법은 승인된 1.0 RC 기준이며, 설치 버튼은
          실제 공개 출시 후 제공합니다.
        </p>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>QUICK START</span>
          <h2>Browser 사용 흐름 6단계</h2>
          <p>
            자동 수집하지 않습니다. 사용자가 현재 페이지에서 직접 실행하고,
            미리보기와 저장 범위를 확인한 뒤 승인합니다.
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

      <section className="content-section split-section">
        <div className="content-heading">
          <span>CAPTURE METHODS</span>
          <h2>세 가지 방법으로 현재 페이지를 수집합니다</h2>
          <p>
            어떤 방법을 사용해도 현재 활성 페이지에 한해 사용자가 직접 실행해야
            합니다.
          </p>
        </div>
        <div className="format-grid">
          <span>Toolbar AIWORK 아이콘</span>
          <span>Alt+Shift+S</span>
          <span>Mac · Control+Shift+S</span>
          <span>우클릭 Context Menu</span>
          <span>사이드 패널 · Alt+Shift+A</span>
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>RECORD TYPES</span>
          <h2>Memory는 자동 AI 기억이 아닙니다.</h2>
        </div>
        <p>
          Source·Memory·Research는 사용자가 고르는 기록 분류입니다. 자동 AI
          Memory, RAG 또는 모델 학습을 의미하지 않습니다. Queue도 저장과 Drive
          동기화 재시도 상태를 보여주는 기능이며, 범용 자동화 예약 기능이 아닙니다.
        </p>
        <Link className="secondary-button" href="/how-to-use/browser">
          Browser 상세 사용법 <span>↗</span>
        </Link>
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
          <span className="section-kicker">FIRST RECORD</span>
          <h2>첫 기록은 이렇게 정리하세요.</h2>
        </div>
        <blockquote>
          “Source · UAE 시장 조사 / 태그 · 수출, 바이어 / 메모 · 최신 날짜와
          공식 출처를 다음 검토에서 다시 확인”
        </blockquote>
        <p>
          현재 Browser 1.0은 AI 답변을 생성하지 않습니다. 저장 종류, 태그와 메모를
          명확히 적으면 Library에서 다시 찾고 검토하기 쉽습니다.
        </p>
      </section>

      <section className="detail-cta">
        <div>
          <span>RELEASE STATUS</span>
          <h2>설치 전에는 출시 상태를 확인하세요.</h2>
          <p>공개 배포 전에는 계정 정보나 앱 비밀번호를 입력하지 마세요.</p>
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
