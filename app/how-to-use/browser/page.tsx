import type { Metadata } from "next";
import Link from "next/link";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser 1.0 사용법 | 현재 페이지 수집과 Drive 저장",
  description:
    "AIWORK Browser 1.0 RC의 설치 조건, 페이지 수집, 안전 미리보기, 템플릿·메모·태그, Source·Memory·Research 분류, Drive 저장과 삭제 방법을 안내합니다.",
};

const browserSteps = [
  {
    title: "설치와 동의 확인",
    body: "공개 출시 후 Chrome 116 이상에서 설치합니다. 첫 실행 때 페이지 처리 동의와 Google Drive 저장 동의를 각각 읽고 선택합니다.",
  },
  {
    title: "현재 페이지에서 수집 실행",
    body: "Toolbar AIWORK 아이콘, Alt+Shift+S(Windows) 또는 Control+Shift+S(Mac), 우클릭 Context Menu 중 한 가지 방법을 사용합니다.",
  },
  {
    title: "안전 미리보기 검토",
    body: "제목, URL, 선택 텍스트와 본문 일부를 확인합니다. [REDACTED] 치환과 프롬프트 인젝션 경고가 있으면 원문과 저장 범위를 다시 확인합니다.",
  },
  {
    title: "템플릿과 분류 추가",
    body: "업무 템플릿을 적용하거나 메모와 태그를 추가한 뒤 Source·Memory·Research 중 목적에 맞는 기록 종류를 선택합니다.",
  },
  {
    title: "Drive 연결과 저장 승인",
    body: "필요한 때에 Google Drive 연결을 시작합니다. drive.appdata 범위만 사용하며 승인한 기록은 AIWORK 전용 비공개 appDataFolder에 저장됩니다.",
  },
  {
    title: "Library·Queue·설정 관리",
    body: "Library에서 기록을 확인·삭제하고 Queue에서 저장과 제한된 재시도 상태를 확인합니다. 설정에서는 언어·테마·사용자 색상, Drive 연결과 동의를 관리합니다.",
  },
];

const captureMethods = [
  {
    label: "TOOLBAR",
    title: "AIWORK 아이콘",
    body: "현재 활성 페이지에서 확장 아이콘을 눌러 수집을 시작합니다.",
  },
  {
    label: "SHORTCUT",
    title: "Alt+Shift+S",
    body: "Windows 수집 단축키입니다. Mac에서는 Control+Shift+S를 사용합니다.",
  },
  {
    label: "CONTEXT MENU",
    title: "우클릭 AIWORK",
    body: "페이지 또는 선택 텍스트에서 우클릭해 AIWORK 수집 항목을 실행합니다.",
  },
];

const recordTypes = [
  {
    label: "SOURCE",
    title: "원문 자료",
    body: "나중에 다시 확인할 웹페이지, 선택 영역과 출처를 저장할 때 사용합니다.",
  },
  {
    label: "MEMORY",
    title: "사용자가 선택한 기억 자료",
    body: "반복 업무에 참고할 내용을 사용자가 직접 분류합니다. 자동 AI Memory나 RAG가 아닙니다.",
  },
  {
    label: "RESEARCH",
    title: "조사 자료",
    body: "시장조사나 비교 검토처럼 조사 프로젝트에 다시 사용할 출처를 구분합니다.",
  },
];

export default function BrowserGuidePage() {
  return (
    <DetailPage
      active="guide"
      eyebrow="GUIDE 00 · AIWORK BROWSER 1.0"
      status="Release Candidate · 공개 배포 전"
      title={
        <>
          현재 페이지를
          <br />
          안전하게 수집·저장합니다.
        </>
      }
      description="AIWORK Browser는 사용자가 직접 실행한 현재 페이지만 처리합니다. 수집 결과를 먼저 검토하고, 필요한 기록만 분류해 Google Drive의 비공개 appDataFolder에 저장합니다."
      image="/images/aiwork-synthwave-hero-v2.webp"
      imageAlt="AIWORK Browser의 현재 페이지 수집과 기록 관리 콘셉트"
      imageLabel="AIWORK BROWSER 1.0 GUIDE"
      imageTone="wide"
    >
      <section className="warning-panel" role="note">
        <strong>설치 전 안내</strong>
        <p>
          Store 패키지는 준비됐지만 아직 일반 공개되지 않았습니다. 공식 배포 전에는
          비공식 파일을 설치하거나 Google 계정, 비밀번호, API 키 또는 인증 코드를
          입력하지 마세요.
        </p>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>QUICK START</span>
          <h2>처음부터 기록 관리까지 6단계</h2>
          <p>
            수집과 Drive 저장은 서로 다른 사용자 동작과 동의를 거칩니다. 자동 수집
            또는 백그라운드 탭 감시는 하지 않습니다.
          </p>
        </div>
        <ol className="process-list process-list-detailed">
          {browserSteps.map((step, index) => (
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
          <span>CAPTURE METHODS</span>
          <h2>상황에 맞는 수집 방법을 선택하세요</h2>
          <p>
            사이드 패널은 Alt+Shift+A로 열 수 있습니다. 실제 페이지 읽기는 현재
            활성 탭에서 수집을 실행한 순간에만 시작됩니다.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {captureMethods.map((method) => (
            <article className="fact-card" key={method.label}>
              <small>{method.label}</small>
              <h3>{method.title}</h3>
              <p>{method.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>SAFE PREVIEW</span>
          <h2>저장 버튼을 누르기 전에 확인하세요</h2>
          <p>
            제목·URL·선택 영역·본문 일부가 목적에 맞는지 보고, 필요하지 않은
            개인정보나 민감정보가 남아 있으면 저장하지 않습니다.
          </p>
        </div>
        <div className="privacy-columns">
          <div>
            <h3>확인할 항목</h3>
            <ul>
              <li>수집 대상 페이지와 URL이 맞는지</li>
              <li>선택 텍스트와 본문 범위가 필요한 만큼인지</li>
              <li>메모·태그·기록 종류가 목적에 맞는지</li>
              <li>Drive 저장 동의를 별도로 확인했는지</li>
            </ul>
          </div>
          <div>
            <h3>중단해야 할 경우</h3>
            <ul>
              <li>비밀번호·OTP·인증 코드가 보이는 경우</li>
              <li>[REDACTED] 치환 내용을 이해하지 못한 경우</li>
              <li>프롬프트 인젝션 경고가 표시된 경우</li>
              <li>출처 또는 저장 목적이 불명확한 경우</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>RECORD TYPES</span>
          <h2>세 가지 기록 분류</h2>
          <p>
            분류 이름은 AI 기능의 실행을 뜻하지 않습니다. 사용자가 Library에서
            자료를 구분하기 위한 기록 종류입니다.
          </p>
        </div>
        <div className="content-grid content-grid-three">
          {recordTypes.map((record) => (
            <article className="fact-card" key={record.label}>
              <small>{record.label}</small>
              <h3>{record.title}</h3>
              <p>{record.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="callout-panel">
        <div>
          <span>DELETE &amp; DISCONNECT</span>
          <h2>연결 해제와 기록 삭제는 다릅니다.</h2>
        </div>
        <p>
          Drive 연결 해제 또는 동의 철회만으로 이미 저장된 Drive 기록이 자동
          삭제되지는 않습니다. Library에서 필요한 기록을 명시적으로 삭제하고,
          전체 숨김 앱 데이터는 Google Drive 설정의 앱 관리에서 삭제할 수 있습니다.
        </p>
        <Link className="secondary-button" href="/privacy">
          개인정보처리방침 <span>↗</span>
        </Link>
      </section>

      <section className="warning-panel" role="note">
        <strong>로드맵과 구분</strong>
        <p>
          승인된 1.0 RC에는 AI 분석·RAG·프로젝트 생성·문서 업로드·자동 웹 조사·
          IMAP 메일함 연결·메일 검색·분류·발송·범용 업무 자동화가 포함되지
          않습니다. Naver Mail 또는 Daum Mail도 사용자가 현재 보이는 페이지에서
          직접 수집을 실행하는 범위만 지원합니다.
        </p>
      </section>

      <section className="detail-cta">
        <div>
          <span>RELEASE STATUS</span>
          <h2>공식 배포 상태를 먼저 확인하세요.</h2>
          <p>공개 출시 전에는 설치 파일 대신 출시 알림과 개인정보처리방침을 제공합니다.</p>
        </div>
        <div className="detail-actions">
          <Link className="primary-button" href="/download">
            출시 상태 확인 <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/how-to-use">
            사용법 허브
          </Link>
        </div>
      </section>
    </DetailPage>
  );
}
