import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 설치 안내 | 배포판 준비 상태",
  description:
    "AIWORK Browser, 데스크톱 앱과 Business Workspace의 현재 배포 준비 상태 및 출시 알림 신청 방법을 안내합니다.",
  alternates: { canonical: "/download" },
};

const releases = [
  {
    label: "CHROME",
    title: "AIWORK Browser",
    status: "공개 출시 준비",
    description:
      "사용자가 요청한 현재 페이지를 안전 미리보기하고, 승인한 Source·Memory·Research 기록을 Google Drive appDataFolder에 저장하는 Chrome 확장프로그램입니다.",
  },
  {
    label: "DESKTOP",
    title: "AIWORK Desktop",
    status: "개발 중",
    description:
      "로컬 자료, 프로젝트 기억과 업무 도구를 한곳에서 다루는 데스크톱 작업 공간을 준비하고 있습니다.",
  },
  {
    label: "BUSINESS",
    title: "Business Workspace",
    status: "개발 중",
    description:
      "팀과 회사의 업무 맥락, 승인 흐름과 관리 기능을 위한 별도 제공 범위를 검토하고 있습니다.",
  },
];

const releaseChecks = [
  {
    label: "AUTOMATED",
    title: "코드 검증",
    status: "통과",
    description:
      "Lint·TypeScript·자동 테스트와 Store 빌드 보안 검사를 최신 작업본에서 통과했습니다.",
  },
  {
    label: "MACOS",
    title: "설치·Toolbar·Side Panel",
    status: "실기기 확인",
    description:
      "분리된 Chrome 프로필에서 확장 설치, Options, Toolbar와 Side Panel 실행을 화면으로 확인했습니다.",
  },
  {
    label: "GOOGLE DRIVE",
    title: "OAuth·저장·삭제",
    status: "진단 대기",
    description:
      "OAuth 연결 오류를 안전한 지원 코드로 구분하는 기능까지 구현했습니다. 실제 계정의 저장·삭제 E2E 합격은 아직 남아 있습니다.",
  },
  {
    label: "CHROME WEB STORE",
    title: "공개 배포",
    status: "제출 전",
    description:
      "Store 패키지 준비와 공개 심사 제출은 다른 단계입니다. 현재 일반 사용자가 설치할 수 있는 공개 항목은 없습니다.",
  },
];

export default function DownloadPage() {
  return (
    <DetailPage
      active="download"
      eyebrow="DOWNLOAD & RELEASE"
      status="배포 파일 준비 중"
      title={
        <>
          설치 파일보다 먼저,
          <br />
          현재 상태를 정확하게.
        </>
      }
      description="검증된 공개 배포 파일이 준비되기 전에는 작동하지 않는 다운로드 버튼이나 버전 번호를 표시하지 않습니다. 출시 알림을 신청하면 제공 범위를 확인한 뒤 안내합니다."
      imageLabel="RELEASE GUIDE"
    >
      <section className="content-section">
        <div className="content-heading">
          <span>RELEASE STATUS</span>
          <h2>제품별 준비 상태</h2>
          <p>
            아래 상태는 일반 사용자가 받을 수 있는 공개 배포 기준입니다. 내부 개발
            상태와 공개 제공 상태를 구분합니다.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {releases.map((item) => (
            <article className="fact-card" key={item.label}>
              <div className="card-status-row">
                <small>{item.label}</small>
                <span className="mini-status">{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>VERIFICATION · 2026-07-28</span>
          <h2>출시 전 검증 현황</h2>
          <p>
            자동 검증과 실기기 검증을 분리해 표시합니다. 남은 Google OAuth·Drive
            검증과 Store 심사가 끝나기 전에는 공개 출시로 표기하지 않습니다.
          </p>
        </div>
        <div className="content-grid content-grid-four">
          {releaseChecks.map((item) => (
            <article className="fact-card" key={item.label}>
              <div className="card-status-row">
                <small>{item.label}</small>
                <span className="mini-status">{item.status}</span>
              </div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="release-panel">
        <div>
          <span className="section-kicker">RELEASE ALERT</span>
          <h2>AIWORK 출시 알림 신청</h2>
          <p>
            이메일 제목에 ‘AIWORK 출시 알림’을 넣어 보내면 공개 배포와 주요 기능
            상태가 확정된 뒤 안내합니다.
          </p>
        </div>
        <a
          className="primary-button"
          href={`mailto:cakecnc@daum.net?subject=${encodeURIComponent(
            "AIWORK 출시 알림 신청",
          )}&body=${encodeURIComponent(
            "AIWORK 공개 배포 및 설치 안내를 받고 싶습니다.\n\n이름/회사명(선택):\n관심 제품: AIWORK Browser / Desktop / Business",
          )}`}
        >
          출시 알림 이메일 <span>↗</span>
        </a>
      </section>

      <section className="detail-cta">
        <div>
          <span>PREVIEW THE FLOW</span>
          <h2>설치 전, 사용 흐름을 먼저 확인하세요.</h2>
          <p>제품이 공개되기 전에 시작 절차와 데이터 처리 원칙을 미리 볼 수 있습니다.</p>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/how-to-use/browser">
            Browser 사용법 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/contact">
            도입 상담
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
