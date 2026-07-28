import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK 문서 사용법 | 회사 자료 활용하기",
  description:
    "회사 문서의 처리 범위를 정하고 질문·요약·근거 확인·선택적 저장으로 이어가는 AIWORK 문서 활용 흐름을 안내합니다.",
  alternates: { canonical: "/how-to-use/documents" },
};

const documentSteps = [
  "작업에 필요한 문서만 선택합니다.",
  "문서 전체 또는 특정 장·표·기간 등 처리 범위를 정합니다.",
  "요약, 비교, 위험 점검 또는 결과물 형식을 요청합니다.",
  "답변에 사용된 문서와 근거 부분을 확인합니다.",
  "재사용할 결과만 프로젝트 기억이나 다음 작업으로 연결합니다.",
];

const formats = ["PDF", "TXT", "Markdown", "CSV", "XLSX"];

export default function DocumentsGuidePage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="GUIDE 02 · DOCUMENTS"
      status="로드맵 · 현재 미구현"
      title={
        <>
          회사 문서를
          <br />
          업무 지식으로.
        </>
      }
      description="문서 업로드·분석·RAG는 현재 Browser RC에 구현되지 않았습니다. 아래 내용은 후속 문서 기능의 처리 원칙과 지원 목표입니다."
      imageTone="wide"
    >
      <section className="warning-panel" role="note">
        <strong>현재 파일 업로드 기능 없음</strong>
        <p>
          PDF·TXT·Markdown·CSV·XLSX 처리와 AI 요약은 로드맵입니다. 민감 문서를
          현재 확장프로그램이나 문의 이메일로 보내지 마세요.
        </p>
      </section>

      <section className="content-section split-section">
        <div className="content-heading">
          <span>SUPPORTED DIRECTION</span>
          <h2>지원 예정 문서 형식</h2>
          <p>
            아래 형식은 현재 아키텍처의 지원 목표입니다. 실제 배포판의 검증이 끝나기
            전까지 ‘사용 가능’으로 단정하지 않습니다.
          </p>
        </div>
        <div className="format-grid">
          {formats.map((format) => (
            <span key={format}>{format}</span>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>DOCUMENT FLOW</span>
          <h2>문서 작업 5단계</h2>
        </div>
        <ol className="compact-steps">
          {documentSteps.map((step, index) => (
            <li key={step}>
              <span>0{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="callout-panel">
        <div>
          <span>SAFE INPUT</span>
          <h2>민감정보는 필요한 범위만.</h2>
        </div>
        <p>
          비밀번호, 인증 코드, API 키, 카드번호와 불필요한 개인정보가 포함된 문서는
          추가하지 마세요. 원문을 외부에 전송해야 하는 기능은 별도 동의와 제공 상태를
          먼저 확인해야 합니다.
        </p>
        <Link className="secondary-button" href="/security">
          보안 원칙 확인 <span>↗</span>
        </Link>
      </section>
    </DetailPage>
  );
}
