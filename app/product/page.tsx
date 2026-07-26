import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 제품 방향 | Browser RC와 플랫폼 로드맵",
  description:
    "현재 구현된 AIWORK Browser RC와 문서·웹·이메일·프로젝트 플랫폼 로드맵을 구분해 소개합니다.",
};

const productLayers = [
  {
    label: "CONNECT",
    title: "필요한 자료만 연결",
    description:
      "웹, 문서, 대화와 프로젝트 자료 가운데 작업에 필요한 범위를 사용자가 직접 선택합니다.",
  },
  {
    label: "UNDERSTAND",
    title: "출처가 보이는 정리",
    description:
      "연결한 자료를 업무 목표에 맞춰 요약하고, 근거와 다음 실행 항목으로 구조화합니다.",
  },
  {
    label: "REVIEW",
    title: "결과와 행동을 분리",
    description:
      "답변은 먼저 검토하고, 전송·게시·삭제처럼 외부 상태가 바뀌는 일은 승인 후 진행하는 구조를 지향합니다.",
  },
  {
    label: "REMEMBER",
    title: "필요한 결과만 기억",
    description:
      "최근 대화, 회사·프로젝트 맥락, 사용자가 선택한 결정 사항을 구분해 다시 활용합니다.",
  },
];

const useCases = [
  "회사 문서 기반 질의응답",
  "웹 조사와 출처 기반 보고서",
  "수출시장·바이어 후보 조사",
  "스마트스토어 운영자료 분석",
  "프로젝트별 지식 정리",
  "이메일 검색·분류 워크플로",
];

export default function ProductPage() {
  return (
    <DetailPage
      active="product"
      eyebrow="AIWORK PRODUCT"
      status="Browser RC 구현 · 플랫폼 로드맵"
      title={
        <>
          자료를 연결하고,
          <br />
          생각을 결과로.
        </>
      }
      description="현재 구현 범위는 사용자가 실행한 현재 탭 수집·미리보기와 승인 후 Drive 저장입니다. 문서·AI 추론·RAG·이메일·업무 자동화는 후속 플랫폼 로드맵입니다."
      image="/images/aiwork-synthwave-hero-v2.webp"
      imageAlt="AIWORK의 미래지향적인 연결형 업무 공간 콘셉트"
      imageLabel="AIWORK PRODUCT CONCEPT"
      imageTone="wide"
    >
      <section className="content-section">
        <div className="content-heading">
          <span>PRODUCT FLOW</span>
          <h2>업무가 이어지는 네 단계</h2>
          <p>
            AIWORK는 무조건 많은 데이터를 모으는 대신, 작업에 필요한 범위와 저장
            여부를 사용자가 결정하는 흐름을 중심으로 설계됩니다.
          </p>
        </div>
        <div className="content-grid content-grid-four">
          {productLayers.map((item, index) => (
            <article className="fact-card" key={item.label}>
              <span className="card-number">0{index + 1}</span>
              <small>{item.label}</small>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section split-section">
        <div className="content-heading">
          <span>WORKSPACE</span>
          <h2>자료와 결과를 한 화면에서</h2>
          <p>
            자료 목록, 대화, 다음 작업을 분리해 보여주고 결과가 어떤 근거에서
            나왔는지 확인할 수 있는 업무 공간을 준비하고 있습니다.
          </p>
        </div>
        <div className="workspace-story">
          <div>
            <small>SOURCES</small>
            <strong>웹 · 문서 · 이메일 · 프로젝트</strong>
            <p>선택한 자료의 범위와 상태를 확인합니다.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <small>AIWORK</small>
            <strong>질문 · 분석 · 제작</strong>
            <p>목표와 근거를 연결해 결과를 만듭니다.</p>
          </div>
          <span aria-hidden="true">→</span>
          <div>
            <small>STUDIO</small>
            <strong>검토 · 저장 · 다음 작업</strong>
            <p>필요한 결과만 선택해 다음 흐름으로 보냅니다.</p>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>BUSINESS USE</span>
          <h2>실무에서 시작하는 AI</h2>
          <p>
            현재 문서와 검증 자료를 기준으로 정리한 대표 활용 방향입니다. 실제 제공
            범위는 배포 버전의 기능 상태에 따라 달라질 수 있습니다.
          </p>
        </div>
        <div className="tag-cloud" aria-label="AIWORK 활용 사례">
          {useCases.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </section>

      <section className="detail-cta">
        <div>
          <span>START WITH CLARITY</span>
          <h2>처음 사용하는 흐름부터 확인하세요.</h2>
          <p>출시 전에도 AIWORK가 지향하는 사용 방식과 기능 상태를 볼 수 있습니다.</p>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/how-to-use">
            사용법 보기 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/download">
            출시 상태 확인
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
