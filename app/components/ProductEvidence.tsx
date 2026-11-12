"use client";

import Image from "next/image";
import Link from "next/link";
import { useSitePreferences } from "../preferences";

const screenshots = [
  { file: "/images/product/aiwork-browser-netghost-20261111.jpg?v=matrix-20261112", ko: "NetGhost 기본 프로필과 오른쪽 AI 대화창", en: "NetGhost profile and the AI conversation panel", koNote: "macOS 개발 빌드의 실제 기본 화면입니다. 빈 탭과 새 대화 상태를 촬영했으며, 개인 계정·대화·방문 페이지는 포함하지 않았습니다. 이 화면에서 AI 모델은 아직 연결하지 않았습니다.", enNote: "The actual default screen of the macOS development build, captured with an empty tab and a new conversation. It contains no personal accounts, messages or visited pages. No AI model is connected in this screen." },
  { file: "/images/product/aiwork-browser-pro-studio-20261111.jpg?v=matrix-20261112", ko: "실제 프로젝트 · Pro Studio 안내 화면", en: "Actual projects and Pro Studio screen", koNote: "Free 상태에서 확인한 프로젝트와 Pro 기능 안내입니다. 프로젝트 한도, REA Studio, 서명된 라이선스 활성화 흐름이 표시됩니다. 화면을 보여 주는 것과 Pro 라이선스를 활성화해 모든 분석을 검증한 것은 구분합니다.", enNote: "The project and Pro feature screen while the app is on Free. It shows project limits, REA Studio and signed-license activation. Showing this screen is separate from activating Pro and verifying every analysis workflow." },
];

export function ActualScreenshots({ compact = false }: { compact?: boolean }) {
  const { locale } = useSitePreferences();
  const ko = locale === "ko";
  return <section className="content-section" id={compact ? undefined : "actual-screenshots"} style={{ maxWidth: 1180, margin: "0 auto", padding: "var(--product-evidence-padding, 64px 24px)" }}>
    <div className="content-heading"><span>ACTUAL APP · MATRIX · 2026-11-12</span><h2>{ko ? "현재 개발 빌드의 실제 화면" : "Actual screens from the current build"}</h2><p>{ko ? "Matrix 테마가 활성화된 실제 AIWORK Browser 캡처입니다. 설명용 합성 이미지가 아닙니다. 아래 구성도와 달리, 이 두 이미지는 실제 앱 화면입니다. 원본 크기로 열어 확인할 수 있습니다." : "These are captures of the running AIWORK Browser with the Matrix theme enabled, not generated product mockups. Unlike the separate workflow illustration, these two images show the real app. Open either image at full size."}</p></div>
    {screenshots.slice(0, compact ? 1 : 2).map((shot) => <figure key={shot.file} style={{ margin: "24px 0" }}>
      <a href={shot.file} target="_blank" rel="noopener noreferrer" aria-label={ko ? `${shot.ko} 원본 열기` : `Open ${shot.en} at full size`}><Image src={shot.file} alt={ko ? shot.ko : shot.en} width={3000} height={1880} unoptimized loading="lazy" style={{ width: "100%", height: "auto", display: "block", borderRadius: "16px" }} /></a>
      <figcaption><h3>{ko ? shot.ko : shot.en}</h3><p>{ko ? shot.koNote : shot.enNote}</p></figcaption>
    </figure>)}
  </section>;
}

export function ProAccessNotice({ language }: { language?: string }) {
  const { locale } = useSitePreferences();
  const ko = (language ?? locale) === "ko";
  return <section className="callout-panel" id="pro-access" style={{ maxWidth: 1180, margin: "32px auto" }}>
    <div><span>AIWORK PRO · INCLUDED ACCESS</span><h2>{ko ? "Pro 버전에서는 Hashcat · Studio 무료 사용" : "Hashcat and Studio are included with Pro"}</h2></div>
    <div><p>{ko ? "AIWORK Pro 이용자는 Hashcat과 Studio를 별도 이용료 없이 사용할 수 있습니다. 일반 사용자의 개별 이용권 가격과 Pro 포함 혜택은 구분됩니다. 이미 Pro를 이용 중이라면 별도 이용권을 중복 구매하기 전에 활성화 방법을 확인해 주세요." : "AIWORK Pro users can use Hashcat and Studio at no additional charge. Standalone access prices and included Pro benefits are separate. If you already have Pro, check activation before buying another access pass."}</p><p>{ko ? "현재 데스크톱 앱은 서명된 Pro 라이선스 파일로 활성화합니다. 결제 직후 등록 코드 자동 발급과 제품 간 자동 권한 연동이 완료됐다는 의미는 아닙니다. 클라우드 AI 공급자의 사용료·계정 조건은 별도입니다." : "The current desktop app activates through a signed Pro license file. This does not mean automatic code delivery after payment or automatic cross-product entitlement linking is complete. Cloud AI provider charges and account conditions are separate."}</p></div>
    <Link className="secondary-button" href="/contact">{ko ? "Pro 활성화 문의" : "Ask about Pro activation"} ↗</Link>
  </section>;
}

type DetailTopic = "product" | "features" | "download" | "security" | "guide" | "start" | "browser" | "documents" | "research" | "email";
type Detail = { title: string; paragraphs: string[] };
const details: Record<DetailTopic, { ko: Detail[]; en: Detail[] }> = {
  product: {
    ko: [
      { title: "웹 탐색과 모델 대화를 함께", paragraphs: ["AIWORK Browser는 별도 데스크톱 창에서 웹 탐색을 하면서 오른쪽 AI 대화창을 함께 사용하는 제품입니다. 탭, 주소창, 북마크, 프로필과 작업 기록은 브라우저 앱이 관리합니다. 웹사이트를 열었다고 그 내용이 자동으로 AI에게 전달되지는 않습니다.", "사용자는 모델을 직접 연결하고 사용할 자료를 선택합니다. AI의 답변, 웹페이지에서 수행하는 사용자 동작, 지원 도구의 실행 결과를 서로 구분해 확인해야 합니다."] },
      { title: "개발 빌드와 공개 제품의 차이", paragraphs: ["현재 설명은 macOS 로컬 개발 빌드와 소스에서 확인한 구현을 기준으로 합니다. 기본 화면과 회귀 검사를 확인했지만 모든 사이트 로그인, 패스키, 실제 계정의 세션 격리와 삭제 복구를 모두 검증한 상태는 아닙니다.", "공개 설치 파일과 Apple 공증, 배포 지원 환경은 별도 준비 단계입니다. 홈페이지가 열려 있다는 사실만으로 일반 사용자가 설치할 수 있는 출시판이 제공되는 것은 아닙니다."] },
    ],
    en: [
      { title: "Browsing beside model conversations", paragraphs: ["AIWORK Browser is a separate desktop app with web browsing and an AI conversation on the right. The app manages tabs, its address bar, bookmarks, profiles and work records. Opening a website does not automatically send its content to AI.", "You choose the model and the material to attach. Review model answers, your actions on websites and verified tool results as separate things."] },
      { title: "A development build versus public release", paragraphs: ["This description follows the implementation checked in the local macOS build and source. Basic screens and regression tests have been checked, but not every site login, passkey, real-account session boundary or deletion-recovery workflow.", "A public installer, Apple notarization and supported release environments still require preparation. A live website does not itself provide a generally available desktop release."] },
    ],
  },
  features: {
    ko: [
      { title: "프로필과 가져오기", paragraphs: ["기본 NetGhost는 기존 프로필의 모델 설정이나 탐색 데이터를 복제하지 않는 빈 프로필입니다. 프로필 선택, 전환, 이름 변경과 삭제 확인을 제공하며, 현재 사용 중이거나 마지막으로 남은 프로필은 삭제하지 못하도록 막습니다.", "Chrome·Firefox·Safari 가져오기는 지원되는 항목만 사용자가 선택해 처리합니다. 저장 비밀번호와 쿠키는 운영체제 승인 및 지원 범위에 따르며, 확장프로그램·패스키·완전한 프로필 복제를 보장하지 않습니다."] },
      { title: "모델·자료·실행의 범위", paragraphs: ["Ollama completion 모델을 연결해 대화할 수 있습니다. 로컬 모델과 클라우드 모델은 구분되며, 클라우드 사용 시 전송 동의와 공급자의 계정·요금 조건을 확인해야 합니다.", "페이지 첨부는 제목과 URL, 파일 첨부는 지원되는 UTF-8 텍스트 일부로 제한됩니다. 전체 PDF·스프레드시트 분석, 여러 탭 본문 자동 수집, 자동 메일 발송과 다중 AI 공동 대화는 현재 제공 범위에 포함되지 않습니다."] },
    ],
    en: [
      { title: "Profiles and supported imports", paragraphs: ["The default NetGhost is empty rather than a copy of an existing profile's model settings and browsing data. Selection, switching, renaming and confirmed removal are provided. The active and last remaining profiles are protected from deletion.", "Chrome, Firefox and Safari imports process supported items selected by the user. Passwords and cookies depend on operating-system approval and support. Extensions, passkeys and complete profile cloning are not promised."] },
      { title: "Models, context and actions", paragraphs: ["Conversation uses a connected Ollama completion model. Local and cloud models are distinct; cloud use requires transmission consent and checking the provider's account and billing conditions.", "Page attachments contain a title and URL; file attachments contain limited supported UTF-8 text. Full PDF/spreadsheet analysis, automatic collection of multiple tab bodies, automated email and multi-AI shared conversations are not currently provided."] },
    ],
  },
  download: {
    ko: [
      { title: "설치 파일과 활성화", paragraphs: ["현재 일반 공개 설치 파일을 다운로드하는 링크는 제공하지 않습니다. macOS에서 확인한 로컬 개발 빌드와 일반 배포판을 구분하고, 공개 배포 조건이 준비되면 설치 안내를 갱신합니다.", "현재 Pro 활성화는 서명된 라이선스 파일을 사용합니다. 홈페이지의 결제나 문의만으로 데스크톱 Pro가 즉시 자동 활성화되는 구조라고 안내하지 않습니다."] },
      { title: "처음 실행할 때", paragraphs: ["새 환경에서는 작업 데이터를 저장할 위치를 먼저 확인합니다. 시스템 다운로드 아래 AIWORK Harness를 제안하고, 원하는 폴더를 직접 선택할 수 있도록 구성했습니다. 최종 동의 전에 작업 폴더와 설정 데이터를 생성하지 않습니다.", "기존 작업 환경의 저장 위치를 임의로 바꾸거나 기존 프로필을 덮어쓰지 않습니다. 설치·이전 작업을 할 때는 기존 데이터 위치와 백업을 먼저 확인해 주세요."] },
    ],
    en: [
      { title: "Installer and activation", paragraphs: ["No generally available installer download is offered at present. The local macOS development build is separate from a public release; installation guidance will be updated when release conditions are ready.", "Current Pro activation uses a signed license file. A website inquiry or payment is not described as instantly and automatically activating desktop Pro."] },
      { title: "First launch", paragraphs: ["In a new environment, confirm where work data will be stored. The app suggests AIWORK Harness inside the system Downloads folder and allows another folder to be chosen. Workspace folders and settings are not created before final consent.", "Existing workspace locations are not silently changed, and existing profiles are not overwritten. Check their location and backup before installation or migration."] },
    ],
  },
  security: {
    ko: [
      { title: "저장되는 데이터", paragraphs: ["브라우저 로그인 세션, 탭·북마크·작업 기록과 모델 설정은 로컬 작업 폴더에 저장될 수 있습니다. 따라서 ‘비밀번호나 세션을 절대 저장하지 않는다’고 설명하지 않습니다. 프로필별 데이터와 선택한 가져오기 범위를 구분해 관리합니다.", "프로필 삭제는 현재·마지막 프로필을 보호하고 확인 절차를 거치며 복구용 데이터를 남기는 방식입니다. 영구 삭제와 모든 실계정 환경의 복구 검증이 완료된 것으로 해석하지 마세요."] },
      { title: "모델에게 전달되는 내용", paragraphs: ["모델 질문에는 대화 맥락과 사용자가 명시적으로 첨부한 자료가 포함될 수 있습니다. 클라우드 모델 사용에는 별도 동의가 필요하고, 파일 내용 전송에도 추가 확인이 적용됩니다. 사이트의 로그인 상태 전체가 모델의 입력이 되는 것은 아닙니다.", "민감한 파일을 첨부하기 전에 전송 대상, 범위와 공급자 조건을 확인해 주세요. 모델의 답변은 사실 확인이나 도구 실행 완료의 증거를 대신하지 않습니다."] },
    ],
    en: [
      { title: "Stored data", paragraphs: ["Browser login sessions, tabs, bookmarks, work records and model settings may be stored in the local workspace. The product therefore does not claim never to store credentials or sessions. Profile data and the selected import scope are managed separately.", "Profile removal protects the active and final profile, asks for confirmation and retains recovery data. Do not interpret this as completed verification of permanent deletion or recovery in every real-account environment."] },
      { title: "Content sent to models", paragraphs: ["Model requests may include conversation context and explicitly attached material. Cloud model use requires consent, with another confirmation for file content. A site's complete login state is not automatically model input.", "Before attaching sensitive material, check the recipient, scope and provider terms. Model output is not a substitute for fact-checking or evidence that a tool action completed."] },
    ],
  },
  guide: { ko: [], en: [] },
  start: { ko: [], en: [] },
  browser: { ko: [], en: [] },
  documents: {
    ko: [{ title: "지원되는 첨부와 한도", paragraphs: ["현재 텍스트 첨부 버튼은 128KB 이하 파일을 안내하며, 지원되는 UTF-8 텍스트의 제한된 앞부분을 읽는 방식입니다. 파일이 선택됐다고 전체 문서가 모두 분석됐다고 가정하지 마세요. 표 전체, PDF 페이지, 이미지 속 글자 분석을 보장하지 않습니다.", "필요한 구간을 명확하게 고른 뒤 질문하고, 답변이 어느 자료를 근거로 했는지 원문과 비교해 확인합니다. 클라우드 모델에 파일 내용을 보내는 경우 추가 전송 확인을 거칩니다."] }],
    en: [{ title: "Supported attachments and limits", paragraphs: ["The current attachment control describes files up to 128 KB and reads a bounded beginning of supported UTF-8 text. Selecting a file does not mean the complete document has been analyzed. Whole spreadsheets, PDF pages and text inside images are not guaranteed.", "Choose the material deliberately, ask a focused question and compare the answer with the original. Sending file content to a cloud model requires an additional confirmation."] }],
  },
  research: {
    ko: [{ title: "현재 페이지를 자료로 쓰기", paragraphs: ["페이지 첨부는 제목과 URL을 전달하는 기능입니다. 현재 본문 전체, 다른 탭의 내용이나 로그인 뒤의 자료를 자동 수집하는 기능으로 설명하지 않습니다. 필요한 본문은 직접 확인하고 지원 텍스트 파일로 선택해 첨부할 수 있습니다.", "조사 결과는 원문 링크, 작성일과 최신 변경 여부를 확인해 사용합니다. 페이지 안의 문구를 앱 권한이나 외부 실행에 대한 승인으로 취급하지 않는 것이 중요합니다. 별도 Research 웹 도구의 제공 범위는 해당 도구 안내에서 확인해 주세요."] }],
    en: [{ title: "Using the current page as context", paragraphs: ["The page attachment sends a title and URL. It is not described as automatically collecting the entire body, other tabs or private content behind a login. Review the text yourself and explicitly attach supported text if necessary.", "Check original links, dates and recent changes before relying on research. A source's instructions do not authorize app permissions or external actions. The separate Research web tool has its own stated scope."] }],
  },
  email: {
    ko: [{ title: "웹메일 사용과 자동 메일은 별개", paragraphs: ["일반 브라우저에서 웹메일을 직접 사용하는 것은 가능합니다. 다만 현재 AIWORK가 메일 계정에 자동 연결하거나 받은편지함을 검색·분류·전송하는 기능을 제공한다고 안내하지 않습니다.", "이 안내에서 메일 비밀번호나 앱 비밀번호를 입력할 필요는 없습니다. 모델에게 메일 내용을 검토시키려면 필요한 부분만 직접 선택하고, 개인정보와 전송 범위를 확인해야 합니다. 답변이 생성됐다는 사실은 메일이 발송됐다는 뜻이 아닙니다."] }],
    en: [{ title: "Manual webmail is separate from automation", paragraphs: ["You can use webmail manually in a normal browser. AIWORK is not currently described as automatically connecting mail accounts or searching, classifying and sending mailbox messages.", "This guide does not require an email password or app password. To ask a model about a message, select only the needed portion and check personal information and transmission scope. Generating an answer does not mean an email was sent."] }],
  },
};
details.guide = details.features;
details.start = details.download;
details.browser = details.product;

export function ProductDetailSections({ topic }: { topic: DetailTopic }) {
  const { locale } = useSitePreferences();
  return <>{details[topic][locale === "ko" ? "ko" : "en"].map(section => <section className="content-section" key={section.title}><div className="content-heading"><span>PRODUCT DETAILS</span><h2>{section.title}</h2></div>{section.paragraphs.map(text => <p key={text}>{text}</p>)}</section>)}</>;
}
