import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 보안 | 통제 가능한 연결",
  description:
    "AIWORK의 로컬 우선 처리, 최소 데이터 저장, 읽기 전용 연결, 사용자 승인과 비신뢰 입력 처리 원칙을 설명합니다.",
};

const principles = [
  {
    number: "01",
    title: "최소 권한",
    description:
      "처음부터 모든 권한을 요청하지 않고, 현재 작업에 필요한 읽기 범위부터 단계적으로 검증합니다.",
  },
  {
    number: "02",
    title: "사용자 승인",
    description:
      "전송, 게시, 삭제, 결제, 파일 업로드와 권한 변경은 사용자가 확인한 뒤 실행하는 구조를 우선합니다.",
  },
  {
    number: "03",
    title: "비신뢰 입력",
    description:
      "웹페이지, 이메일, 문서와 검색 결과는 명령이 아니라 검토해야 할 외부 데이터로 취급합니다.",
  },
  {
    number: "04",
    title: "비밀정보 분리",
    description:
      "API 키, 토큰, 쿠키와 세션 데이터는 소스 저장소나 일반 로그에 기록하지 않는 것을 원칙으로 합니다.",
  },
  {
    number: "05",
    title: "저장 최소화",
    description:
      "작업에 필요한 범위와 기간만 저장하고, 원문과 메타데이터의 보존 목적을 구분합니다.",
  },
  {
    number: "06",
    title: "단계적 확대",
    description:
      "읽기 전용 검증과 차단 테스트가 끝난 뒤에만 제한된 실행 기능을 추가하는 방향을 따릅니다.",
  },
];

export default function SecurityPage() {
  return (
    <DetailPage
      active="security"
      eyebrow="SECURITY BY BOUNDARY"
      status="보안 설계 원칙"
      title={
        <>
          자동화보다 먼저,
          <br />
          통제 가능한 연결.
        </>
      }
      description="AIWORK는 로컬 우선 처리, 최소 데이터 저장, 읽기 전용 연결과 명시적 사용자 승인을 핵심 보안 원칙으로 삼습니다."
      image="/images/aiwork-synthwave-hero-v2.webp"
      imageAlt="보안 경계를 상징하는 AIWORK 네온 연결 이미지"
      imageLabel="CONTROLLED CONNECTION"
      imageTone="wide"
    >
      <section className="content-section">
        <div className="content-heading">
          <span>CORE PRINCIPLES</span>
          <h2>여섯 가지 기본 원칙</h2>
          <p>
            ‘완벽한 보안’을 약속하는 대신, 권한과 데이터의 경계를 설명하고 실제
            제공 기능에 맞춰 정책을 갱신합니다.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {principles.map((item) => (
            <article className="fact-card" key={item.number}>
              <span className="card-number">{item.number}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-section">
        <div className="content-heading">
          <span>DEFAULT POLICY</span>
          <h2>기본 허용과 기본 제외</h2>
          <p>사용자 동의 없이 학습이나 외부 전송으로 범위를 넓히지 않습니다.</p>
        </div>
        <div className="policy-compare">
          <article>
            <span className="mini-status positive">향후 기본 허용 목표</span>
            <ul>
              <li>Markdown·프로젝트 자료 인덱싱</li>
              <li>로컬 문서 처리</li>
              <li>출처 URL을 포함한 웹 요약</li>
              <li>대화·프로젝트 맥락 기억</li>
            </ul>
          </article>
          <article>
            <span className="mini-status caution">기본 기능 아님</span>
            <ul>
              <li>클라우드 자동 업로드·자동 동기화</li>
              <li>브라우저 자격증명 수집</li>
              <li>모델 병합·LoRA 파인튜닝</li>
              <li>승인 없는 외부 상태 변경</li>
            </ul>
          </article>
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>AIWORK BROWSER</span>
          <h2>확장프로그램 데이터 처리를 자세히 확인하세요.</h2>
        </div>
        <p>
          현재 탭 수집, 로컬 보존 한도, Google Drive appDataFolder, 삭제와 권한 철회
          절차는 공개 개인정보처리방침에서 구체적으로 설명합니다.
        </p>
        <Link className="primary-button" href="/privacy">
          개인정보처리방침 <span>↗</span>
        </Link>
      </section>
    </DetailPage>
  );
}
