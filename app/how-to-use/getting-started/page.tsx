import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 프로젝트 흐름 | 로드맵 안내",
  description:
    "아직 구현되지 않은 AIWORK 프로젝트 기능의 목표 설정·자료 선택·검토 원칙을 로드맵 참고로 안내합니다.",
};

const steps = [
  {
    title: "프로젝트 이름 정하기",
    body: "누가 보더라도 목적을 알 수 있게 ‘시장 조사’, ‘제품 상세페이지’, ‘주간 이메일 브리핑’처럼 정합니다.",
  },
  {
    title: "완성할 결과 정의하기",
    body: "보고서, 제안서, 체크리스트, 이메일 초안 등 최종 산출물과 사용할 언어를 적습니다.",
  },
  {
    title: "자료 범위 선택하기",
    body: "이번 작업과 직접 관련된 문서와 URL부터 추가합니다. 민감정보는 필요하지 않다면 제외합니다.",
  },
  {
    title: "첫 질문 작성하기",
    body: "대상, 판단 기준, 분량, 형식과 제외할 항목을 한 문장에 함께 넣습니다.",
  },
  {
    title: "근거와 상태 확인하기",
    body: "출처의 날짜와 원문, 실제 구현 상태와 계획을 구분해 검토합니다.",
  },
  {
    title: "저장하거나 다음 작업으로 연결하기",
    body: "재사용할 결과만 저장하고, 외부 전송이나 게시가 필요하면 승인 단계를 확인합니다.",
  },
];

export default function GettingStartedPage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="GUIDE 01 · GETTING STARTED"
      status="로드맵 안내 · 현재 미구현"
      title={
        <>
          첫 프로젝트를
          <br />
          만드는 방법.
        </>
      }
      description="프로젝트 생성과 AI 결과 작성은 현재 Browser RC에 구현되지 않았습니다. 아래 내용은 후속 제품을 위한 업무 설계 참고입니다."
      imageLabel="GETTING STARTED"
    >
      <section className="warning-panel" role="note">
        <strong>로드맵 참고</strong>
        <p>
          현재 설치 가능한 공개 제품 절차가 아닙니다. Browser RC의 실제 범위는
          현재 탭 수집·미리보기와 승인 후 Drive 저장이며, 프로젝트·AI 추론·RAG는
          후속 개발 항목입니다.
        </p>
      </section>

      <section className="content-section">
        <ol className="process-list process-list-detailed">
          {steps.map((step, index) => (
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

      <section className="prompt-example">
        <div>
          <span className="section-kicker">COPY &amp; START</span>
          <h2>바로 사용할 첫 요청</h2>
        </div>
        <blockquote>
          “이 프로젝트의 목적은 [목적]입니다. 연결한 자료만 사용해 [결과물]을 만들고,
          중요한 주장마다 근거를 표시해 주세요. 확인되지 않은 내용은 추정하지 말고
          ‘확인 필요’로 구분해 주세요.”
        </blockquote>
      </section>

      <section className="detail-cta">
        <div>
          <span>NEXT GUIDE</span>
          <h2>이제 자료 유형에 맞는 안내를 선택하세요.</h2>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/how-to-use/documents">
            문서 활용 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/how-to-use/web-research">
            웹 조사
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
