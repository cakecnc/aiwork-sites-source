import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser 시작하기 | 설치·동의·첫 수집",
  description:
    "AIWORK Browser 1.0 RC의 설치 조건, 초기 동의, 언어·테마 설정, Drive 연결과 첫 페이지 수집 준비를 안내합니다.",
  alternates: { canonical: "/how-to-use/getting-started" },
};

const steps = [
  {
    title: "공식 공개 상태 확인",
    body: "현재는 공개 배포 전입니다. Chrome Web Store의 공식 AIWORK 항목이 공개된 뒤 Chrome 116 이상에서 설치합니다.",
  },
  {
    title: "페이지 처리 동의 검토",
    body: "현재 활성 페이지를 사용자가 직접 수집할 때 처리되는 제목·URL·선택 영역·본문 범위를 읽고 동의 여부를 선택합니다.",
  },
  {
    title: "Drive 저장 동의 분리 확인",
    body: "페이지 처리와 Drive 저장은 별도 동의입니다. Drive에 저장하지 않고 미리보기만 확인할 수 있는 범위도 구분합니다.",
  },
  {
    title: "언어와 화면 설정",
    body: "설정에서 8개 언어, 7개 테마와 사용자 색상을 선택합니다. 이 값은 AIWORK Browser의 로컬 설정에 저장됩니다.",
  },
  {
    title: "필요할 때 Drive 연결",
    body: "Google 연결은 사용자가 시작합니다. AIWORK는 drive.appdata 범위만 사용하며 일반 Drive 파일 목록에는 접근하지 않습니다.",
  },
  {
    title: "민감하지 않은 페이지로 첫 수집",
    body: "공개 문서처럼 민감정보가 없는 페이지에서 Toolbar 아이콘, 수집 단축키 또는 Context Menu를 사용해 미리보기 흐름을 먼저 확인합니다.",
  },
];

export default function GettingStartedPage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="GUIDE 01 · GETTING STARTED"
      status="Browser 1.0 RC · 공개 배포 전"
      title={
        <>
          첫 실행을
          <br />
          안전하게 준비하는 방법.
        </>
      }
      description="공식 배포 확인부터 초기 동의, 화면 설정, Drive 연결과 첫 페이지 수집까지 AIWORK Browser 1.0의 시작 순서를 안내합니다."
      imageLabel="GETTING STARTED"
    >
      <section className="warning-panel" role="note">
        <strong>공개 전 안내</strong>
        <p>
          최종 Store 패키지는 준비됐지만 아직 일반 사용자가 설치할 수 없습니다.
          공개 전 비공식 ZIP을 설치하거나 Google 계정, 비밀번호, 인증 코드를
          전달하지 마세요.
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
          <span className="section-kicker">FIRST CAPTURE</span>
          <h2>첫 수집 체크리스트</h2>
        </div>
        <blockquote>
          “공개 페이지인가? · 비밀번호나 개인정보가 보이지 않는가? · 선택 영역이
          필요한 범위인가? · [REDACTED]와 경고를 확인했는가? · 저장 종류와
          Drive 동의를 확인했는가?”
        </blockquote>
      </section>

      <section className="detail-cta">
        <div>
          <span>NEXT GUIDE</span>
          <h2>이제 실제 Browser 수집 흐름을 확인하세요.</h2>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/how-to-use/browser">
            Browser 사용법 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/privacy">
            개인정보처리방침
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
