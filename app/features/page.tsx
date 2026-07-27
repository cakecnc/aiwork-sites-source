import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 주요 기능 | 자료·기억·승인 중심 업무",
  description:
    "AIWORK의 로컬 우선 작업 공간, 자료 기반 답변, 프로젝트 기억, 브라우저와 이메일 워크플로의 제공 상태를 확인합니다.",
};

const features = [
  {
    status: "제품 원칙",
    label: "LOCAL FIRST",
    title: "로컬 우선 작업 공간",
    description:
      "민감한 업무 자료를 가능한 한 사용자 환경에서 처리하고, 비밀정보는 소스 코드가 아닌 승인된 보안 저장 방식으로 다룹니다.",
  },
  {
    status: "준비 중",
    label: "SOURCE AWARE",
    title: "자료 기반 답변",
    description:
      "등록한 문서와 웹 출처를 기반으로 핵심 내용, 판단 근거, 위험과 다음 실행안을 함께 정리하는 흐름을 준비하고 있습니다.",
  },
  {
    status: "준비 중",
    label: "PROJECT MEMORY",
    title: "업무 기억",
    description:
      "최근 대화, 사용자·회사·프로젝트 맥락과 사용자가 선택한 결과를 구분해 다시 활용하는 구조를 지향합니다.",
  },
  {
    status: "RC 구현 · 공개 준비",
    label: "AIWORK BROWSER",
    title: "현재 탭 자료 수집",
    description:
      "사용자가 직접 실행한 현재 탭만 읽고, 안전 미리보기와 별도 동의를 거쳐 선택한 Source·Memory·Research 기록을 Drive appDataFolder에 저장합니다.",
  },
  {
    status: "RC 구현 · 공개 준비",
    label: "TEMPLATES",
    title: "업무 템플릿·메모·태그",
    description:
      "수집한 페이지에 작업 템플릿을 적용하고 메모와 태그를 검토해 저장 맥락을 정리합니다.",
  },
  {
    status: "RC 구현 · 공개 준비",
    label: "LIBRARY",
    title: "Source·Memory·Research 자료함",
    description:
      "사용자가 선택한 기록 종류별로 Library에서 항목을 확인하고 개별 기록을 삭제할 수 있습니다.",
  },
  {
    status: "RC 구현 · 공개 준비",
    label: "QUEUE",
    title: "저장·동기화 상태 확인",
    description:
      "Queue에서 백그라운드 저장, Drive 동기화와 제한된 재시도 상태를 확인합니다. 범용 자동화 예약 기능은 아닙니다.",
  },
  {
    status: "미구현 · 설계 검증",
    label: "EMAIL",
    title: "읽기 전용 이메일 정리",
    description:
      "Daum 메일 읽기 전용 검색·분류는 설계 자료만 검토 중이며 현재 Browser RC에 구현되지 않았습니다. 발송 기능도 제공하지 않습니다.",
  },
  {
    status: "연구 중",
    label: "APPROVED ACTIONS",
    title: "승인 기반 실행",
    description:
      "브라우저·예약 작업 등은 격리된 실행 환경과 명시적 승인, 감사 가능한 결과를 전제로 연구하고 있습니다.",
  },
];

export default function FeaturesPage() {
  return (
    <DetailPage
      active="features"
      eyebrow="CONNECTED INTELLIGENCE"
      status="기능 상태를 투명하게 표시합니다"
      title={
        <>
          필요한 기능만,
          <br />
          통제 가능한 방식으로.
        </>
      }
      description="AIWORK는 기능의 수보다 자료의 출처, 저장 범위, 사용자의 승인과 실제 업무 연결을 우선합니다. 아래 상태 배지는 현재 자료로 확인되는 제공 단계를 뜻합니다."
      imageLabel="AIWORK GUIDE AGENT"
    >
      <section className="content-section">
        <div className="content-heading">
          <span>CAPABILITIES</span>
          <h2>기능과 현재 상태</h2>
          <p>
            아직 일반 공개되지 않은 기능을 완성된 기능처럼 표시하지 않습니다.
            배포판이 준비되면 이 페이지의 상태도 함께 갱신됩니다.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {features.map((item) => (
            <article className="fact-card feature-detail-card" key={item.label}>
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

      <section className="callout-panel">
        <div>
          <span>AIWORK PRINCIPLE</span>
          <h2>기본값은 더 적은 권한입니다.</h2>
        </div>
        <p>
          클라우드 업로드, 자동 동기화, 브라우저 자격증명 수집, 모델 병합과
          파인튜닝은 기본 동작이 아닙니다. 외부 상태 변경은 읽기 전용 검증과 사용자
          승인 단계를 먼저 거치는 방향으로 설계합니다.
        </p>
        <Link className="secondary-button" href="/security">
          보안 원칙 보기 <span>↗</span>
        </Link>
      </section>

      <section className="detail-cta">
        <div>
          <span>LEARN BY DOING</span>
          <h2>기능별 사용 흐름을 먼저 살펴보세요.</h2>
          <p>현재 Browser 사용법과 후속 프로젝트·문서·웹 조사·Daum 메일 안내를 구분했습니다.</p>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/how-to-use/browser">
            Browser 사용법 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/contact">
            도입 문의
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
