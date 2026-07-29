import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 이메일 연결 설계 안내 | Daum Provider 후보",
  description:
    "이메일은 읽기 전용이 기본이며 최종 내용을 사용자가 승인한 한 건만 발송하는 정책과, 현재 미구현인 Daum Provider 후보의 검증 범위를 안내합니다.",
  alternates: { canonical: "/how-to-use/daum-email" },
};

const setupSteps = [
  {
    title: "Daum에서 IMAP 사용 설정 확인",
    body: "Daum 메일 환경설정에서 IMAP 사용이 허용되어 있는지 확인합니다.",
  },
  {
    title: "2단계 인증과 앱 비밀번호 준비",
    body: "계정 비밀번호 대신 Daum이 발급한 메일 앱 전용 비밀번호를 사용합니다.",
  },
  {
    title: "AIWORK에서 Daum Email 선택",
    body: "공개 배포판에서 해당 기능이 ‘사용 가능’ 또는 ‘베타’인지 먼저 확인합니다.",
  },
  {
    title: "이메일 주소와 앱 비밀번호 입력",
    body: "앱 비밀번호는 승인된 운영체제 보안 저장소에서만 다뤄야 하며 일반 문서나 문의 메일에 남기지 않습니다.",
  },
  {
    title: "읽기 전용 연결 테스트",
    body: "메일 삭제, 발송, 읽음 처리와 플래그 변경이 차단된 상태인지 확인합니다.",
  },
  {
    title: "수동 동기화 후 검색·분류",
    body: "처음에는 사용자가 시작한 동기화로 목록, 검색, 규칙 분류와 상세 보기만 검증합니다.",
  },
];

const phases = [
  {
    status: "우선 검증",
    title: "읽기 전용 수집·검색·규칙 분류",
    body: "메일 목록과 제한된 본문을 안전하게 읽고 중복 없이 저장하는 기본 단계입니다.",
  },
  {
    status: "후속 계획",
    title: "로컬 요약·일일 브리핑",
    body: "선택한 메일을 로컬에서 요약하고 중요도와 다음 행동으로 정리하는 단계입니다.",
  },
  {
    status: "후속 계획",
    title: "답장 초안·승인 대기",
    body: "초안을 만든 뒤 사용자가 수신자와 내용을 검토하도록 분리합니다.",
  },
  {
    status: "후속 계획",
    title: "단건 승인 후 발송",
    body: "최종 발신 계정·수신자·제목·본문·첨부를 확인한 승인 한 건만 원자적으로 소비해 발송하도록 검증하는 단계입니다.",
  },
  {
    status: "후속 계획",
    title: "첨부파일 격리 처리",
    body: "첨부파일의 크기·형식·악성 가능성을 분리해 다루는 별도 단계입니다.",
  },
  {
    status: "후속 계획",
    title: "선택한 메일만 기억 반영",
    body: "자동 학습이 아니라 사용자가 승인한 정보만 프로젝트 맥락으로 넘기는 단계입니다.",
  },
];

export default function DaumEmailGuidePage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="EMAIL PROVIDER GUIDE · DAUM CANDIDATE"
      status="현재 미구현 · 설계 참고"
      title={
        <>
          이메일은 읽기 전용부터.
          <br />
          발송은 최종 승인 후.
        </>
      }
      description="Daum은 검증 중인 이메일 Provider 후보 중 하나이며 AIWORK의 필수 서비스가 아닙니다. 실제 IMAP·SMTP·메일 검색·분류는 현재 Browser RC에 구현되지 않았습니다."
      imageLabel="SAFE EMAIL GUIDE"
    >
      <section className="warning-panel" role="note">
        <strong>현재 연결 화면이 없습니다</strong>
        <p>
          아래 단계는 향후 구현 검토용이며 지금 실행하는 절차가 아닙니다. 메일 앱
          비밀번호, 계정 비밀번호, 인증 코드와 복구 코드를 AIWORK 문의 이메일,
          확장프로그램 또는 일반 문서에 입력하지 마세요.
        </p>
      </section>

      <section className="callout-panel">
        <div>
          <span>CURRENT MANUAL FLOW</span>
          <h2>현재 화면만 일반 페이지처럼 수집합니다.</h2>
        </div>
        <p>
          Daum Mail·Naver Mail 계정이나 메일함에 연결하지 않습니다. 사용자가 현재
          보고 있는 메일 페이지에서 직접 Browser 수집을 실행한 경우에만 화면에
          보이는 범위를 미리보기로 준비할 수 있습니다. 계정·앱 비밀번호는 입력하지
          마세요.
        </p>
        <Link className="secondary-button" href="/how-to-use/browser">
          Browser 수집 방법 <span>↗</span>
        </Link>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>READ-ONLY SETUP</span>
          <h2>연결 준비 6단계</h2>
          <p>
            화면 명칭은 배포 버전에 따라 달라질 수 있습니다. 실제 기능이 활성화된
            버전에서만 진행하세요.
          </p>
        </div>
        <ol className="process-list process-list-detailed">
          {setupSteps.map((step, index) => (
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

      <section className="content-section">
        <div className="content-heading">
          <span>DELIVERY PHASES</span>
          <h2>현재 단계와 후속 단계를 구분합니다</h2>
        </div>
        <div className="content-grid content-grid-three">
          {phases.map((phase) => (
            <article className="fact-card" key={phase.title}>
              <span className="mini-status">{phase.status}</span>
              <h3>{phase.title}</h3>
              <p>{phase.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>DATA CONTROL</span>
          <h2>읽기 전용이 먼저입니다.</h2>
        </div>
        <p>
          초기 검증에서는 SMTP 발송, 삭제, 플래그 변경, 첨부 실행을 허용하지 않는
          것이 기준입니다. 보내기 기능은 최종 발신 계정·수신자·제목·본문·첨부를
          확인한 건별 승인과 승인 ID의 원자적 소비를 별도로 검증한 뒤에만 추가할
          수 있습니다.
        </p>
        <Link className="secondary-button" href="/security">
          AIWORK 보안 원칙 <span>↗</span>
        </Link>
      </section>
    </DetailPage>
  );
}
