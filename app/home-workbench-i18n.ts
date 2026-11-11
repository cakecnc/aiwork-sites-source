import type { Locale } from "./i18n";

type Card = {
  title: string;
  description: string;
};

type Capability = Card & {
  status: string;
};

export type HomeWorkbenchMessage = {
  metadata: {
    title: string;
    description: string;
  };
  brandContext: string;
  hero: {
    eyebrow: string;
    title: [string, string];
    description: string;
    primaryAction: string;
    secondaryAction: string;
    trust: [string, string, string];
  };
  roles: {
    eyebrow: string;
    title: string;
    description: string;
    cards: [Card, Card, Card];
  };
  workbench: {
    eyebrow: string;
    status: string;
    contextTitle: string;
    contexts: [string, string, string, string];
    conversationTitle: string;
    prompt: string;
    responseTitle: string;
    responseBody: string;
    actionTitle: string;
    actions: [string, string, string];
    evidence: string;
  };
  workflow: {
    eyebrow: string;
    title: string;
    description: string;
    steps: [
      Card & { number: string },
      Card & { number: string },
      Card & { number: string },
      Card & { number: string },
      Card & { number: string },
      Card & { number: string },
    ];
  };
  capabilities: {
    eyebrow: string;
    title: string;
    description: string;
    cards: [Capability, Capability, Capability, Capability, Capability, Capability];
  };
  boundary: {
    eyebrow: string;
    title: string;
    description: string;
    items: [Card, Card, Card];
    advancedSummary: string;
    advancedBody: string;
  };
  cta: {
    eyebrow: string;
    title: string;
    description: string;
    primaryAction: string;
    secondaryAction: string;
  };
};

const ko: HomeWorkbenchMessage = {
  "metadata": {
    "title": "AIWORK Browser | 웹 탐색과 AI 대화를 한 화면에서",
    "description": "macOS에서 실행을 확인한 AIWORK Browser 개발 빌드. 독립 브라우저, NetGhost 프로필, 지원 데이터 가져오기와 선택형 Ollama 대화의 현재 구현·연결 조건·출시 준비 상태를 안내합니다."
  },
  "brandContext": "browser-side AI assistance.",
  "hero": {
    "eyebrow": "AIWORK BROWSER · DESKTOP DEVELOPMENT BUILD",
    "title": [
      "웹을 보면서,",
      "내 일을 돕는 AI."
    ],
    "description": "독립 Chromium 브라우저와 오른쪽 AI 대화창을 하나의 데스크톱 앱에 담았습니다. macOS 개발 빌드에서 탐색·프로필·지원 데이터 가져오기를 구현했습니다. AI 대화는 모델 연결과 동의가 필요하며, 일반 공개 다운로드는 준비 중입니다.",
    "primaryAction": "앱 사용 흐름 보기",
    "secondaryAction": "구현·준비 상태 확인",
    "trust": [
      "macOS 개발 빌드 실행 확인",
      "모델은 직접 선택·활성화",
      "일반 공개 배포 준비 중"
    ]
  },
  "roles": {
    "eyebrow": "ONE CLEAR WORKFLOW",
    "title": "탐색과 대화, 확인을 한 화면에서",
    "description": "AIWORK Browser는 웹 탐색과 AI 대화를 함께 보여 줍니다. 모델 답변과 실제 도구 실행은 구분하고, 사용자가 선택한 자료와 기능만 연결합니다.",
    "cards": [
      {
        "title": "사용자",
        "description": "프로필과 작업 폴더, 사용할 모델과 첨부 자료를 직접 선택합니다."
      },
      {
        "title": "선택한 AI 모델",
        "description": "연결·활성화한 Ollama 모델이 질문에 답합니다. 모델별 품질·계정·비용 조건은 다릅니다."
      },
      {
        "title": "AIWORK Browser",
        "description": "탭·북마크·작업 기록을 관리하고 프로필별 탐색 세션과 모델 설정을 분리합니다."
      }
    ]
  },
  "workbench": {
    "eyebrow": "AIWORK BROWSER · INTERFACE GUIDE",
    "status": "구성 설명용 UI · 실제 앱 캡처 아님",
    "contextTitle": "독립 브라우저 영역",
    "contexts": [
      "웹 탐색 · 탭 · 북마크",
      "NetGhost · 프로필 선택",
      "지원 브라우저 데이터 가져오기",
      "선택한 텍스트 파일 첨부"
    ],
    "conversationTitle": "오른쪽 AI 대화창",
    "prompt": "제가 선택해 첨부한 텍스트에서 핵심과 확인할 항목을 정리해 주세요.",
    "responseTitle": "연결한 모델로 답변을 요청합니다.",
    "responseBody": "아래는 사용 흐름을 설명하는 예시입니다. 기본 상태에서는 모델이 선택·활성화되지 않습니다. 페이지 첨부는 제목·주소만, 텍스트 파일은 제한된 앞부분만 사용합니다. 클라우드 모델과 파일 내용 전송은 각각 확인이 필요합니다.",
    "actionTitle": "구현 범위",
    "actions": [
      "독립 브라우저 · 프로필",
      "Ollama 모델 대화",
      "지원 데이터 가져오기"
    ],
    "evidence": "개발 빌드 구현 · AI는 별도 연결 · 일반 공개 배포 준비 중"
  },
  "workflow": {
    "eyebrow": "HOW IT WORKS",
    "title": "앱에서 시작하는 6단계",
    "description": "이 홈페이지는 제품 안내입니다. 아래 흐름은 별도 데스크톱 개발 빌드에 해당하며 홈페이지에서 브라우저·계정·모델을 자동 연결하지 않습니다.",
    "steps": [
      {
        "number": "01",
        "title": "작업 폴더",
        "description": "첫 설치에서 저장 위치를 확인합니다. 시스템 다운로드 아래 AIWORK Harness를 제안하며 다른 폴더도 선택할 수 있습니다."
      },
      {
        "number": "02",
        "title": "프로필",
        "description": "설정 없는 NetGhost로 시작하거나 기존 프로필을 선택합니다. 전환해도 다른 프로필의 데이터를 지우지 않습니다."
      },
      {
        "number": "03",
        "title": "웹 탐색",
        "description": "일반 웹페이지와 탭을 열고 북마크를 관리합니다. AI Space의 웹 서비스는 직접 로그인해 사용합니다."
      },
      {
        "number": "04",
        "title": "모델 연결",
        "description": "Ollama completion 모델을 직접 선택합니다. 클라우드는 전송 동의와 계정·요금 확인이 필요합니다."
      },
      {
        "number": "05",
        "title": "자료 첨부",
        "description": "선택한 페이지의 제목·주소 또는 지원 텍스트 파일 일부만 첨부합니다. 여러 탭의 본문을 자동 수집하지 않습니다."
      },
      {
        "number": "06",
        "title": "결과 확인",
        "description": "답변을 검토합니다. 모델의 제안만으로 메일 발송·결제·게시가 자동 실행되지는 않습니다."
      }
    ]
  },
  "capabilities": {
    "eyebrow": "CURRENT PRODUCT STATUS",
    "title": "실제 구현과 출시 준비를 구분합니다",
    "description": "2026-11-11 확인 기준입니다. 개발 빌드 구현은 일반 배포·모든 계정 환경의 검증을 뜻하지 않습니다.",
    "cards": [
      {
        "title": "독립 데스크톱 브라우저",
        "description": "Chromium 탐색, 탭·북마크와 독립 웹 창을 구현했습니다. macOS에서 로컬 앱 실행을 확인했습니다.",
        "status": "개발 빌드 구현"
      },
      {
        "title": "NetGhost · 프로필 관리",
        "description": "빈 기본 프로필, 선택·전환·이름 변경·확인 후 삭제를 제공합니다. 현재·마지막 프로필 삭제는 막고 복구용 데이터를 남깁니다.",
        "status": "구현 · 일부 실환경 검증 남음"
      },
      {
        "title": "지원 데이터 가져오기",
        "description": "Chrome·Firefox·Safari의 지원 항목을 사용자가 선택해 가져옵니다. 비밀번호·쿠키는 지원 범위와 OS 승인에 따르며 확장·패스키·전체 프로필 복제는 지원하지 않습니다.",
        "status": "범위 제한 구현"
      },
      {
        "title": "선택형 AI 대화",
        "description": "Ollama 로컬·클라우드 completion 모델을 연결합니다. 클라우드는 명시적 동의가 필요하며 무료 사용을 보장하지 않습니다. ChatGPT·Gemini·Claude 웹은 직접 이용합니다.",
        "status": "연결·동의 필요"
      },
      {
        "title": "자료와 저장 위치",
        "description": "페이지 제목·주소, 선택한 UTF-8 텍스트 일부를 첨부할 수 있습니다. 앱 데이터는 선택 작업 폴더에 보관합니다. PDF·표 전체 분석이나 여러 탭 본문 자동 수집은 미지원입니다.",
        "status": "제한된 첨부 구현"
      },
      {
        "title": "공개 출시와 다음 단계",
        "description": "일반 배포 파일·공증, 광범위한 실계정 검증은 준비 중입니다. 다중 AI 공동 대화·장기 대화 압축·자동 메일 업무는 아직 제공하지 않습니다.",
        "status": "출시 준비 · 일부 계획"
      }
    ]
  },
  "boundary": {
    "eyebrow": "CLEAR BOUNDARIES",
    "title": "무엇을 저장하고 보내는지 확인합니다",
    "description": "브라우저 로그인 세션과 앱 작업 기록은 로컬 작업 폴더에 저장될 수 있습니다. 사이트 로그인과 AI 전송은 별개이며, 로그인 상태 전체를 모델에 전달하지 않습니다.",
    "items": [
      {
        "title": "프로필별 로컬 데이터",
        "description": "탭·북마크·기록·탐색 세션과 모델 설정을 프로필별로 관리합니다. 기존 데이터 가져오기는 사용자가 고른 범위만 처리합니다."
      },
      {
        "title": "클라우드 전송 동의",
        "description": "질문·이전 대화·명시적으로 첨부한 페이지 정보가 전송될 수 있습니다. 파일 내용에는 추가 확인이 필요하며 비용·한도는 공급자 조건을 따릅니다."
      },
      {
        "title": "모델 답변과 실행 구분",
        "description": "답변은 실행 완료 증거가 아닙니다. 일반적인 자동 메일·결제·게시 기능은 제공하지 않으며, 지원 도구도 개별 확인 범위에서 사용합니다."
      }
    ],
    "advancedSummary": "검증 범위와 남은 제한",
    "advancedBody": "자동 회귀 검사와 로컬 앱 화면을 확인했습니다. 모든 사이트 로그인·패스키·프로필 삭제 복구·실계정 세션 격리까지 검증한 것은 아닙니다. 현재 로컬 빌드는 Apple 공증·Touch ID 호환성을 보장하지 않습니다. 실제 앱 캡처와 구성 설명용 예시는 구분하며, 이 사이트는 소스코드·사용자 프로필을 배포하지 않습니다."
  },
  "cta": {
    "eyebrow": "AIWORK BROWSER",
    "title": "현재 구현 범위부터 확인하세요.",
    "description": "데스크톱 개발 빌드의 도입·검증 범위와 공개 배포 일정은 문의해 주세요. 이 페이지의 설명은 즉시 다운로드나 서비스 제공을 약속하지 않습니다.",
    "primaryAction": "제품 안내 보기",
    "secondaryAction": "도입 문의"
  }
};

const en: HomeWorkbenchMessage = {
  "metadata": {
    "title": "AIWORK Browser | Browse and talk to AI in one desktop app",
    "description": "See what the macOS AIWORK Browser development build implements: independent browsing, NetGhost profiles, supported imports and opt-in Ollama chat. Public distribution is still being prepared."
  },
  "brandContext": "browser-side AI assistance.",
  "hero": {
    "eyebrow": "AIWORK BROWSER · DESKTOP DEVELOPMENT BUILD",
    "title": [
      "Browse the web.",
      "Get help with your work."
    ],
    "description": "An independent Chromium browser and a right-side AI conversation in one desktop app. Browsing, profiles and supported imports are implemented in the macOS development build. AI needs a model connection and consent; a general public download is not yet available.",
    "primaryAction": "See the app workflow",
    "secondaryAction": "Check implementation status",
    "trust": [
      "macOS development build checked",
      "Choose and enable your model",
      "Public distribution in preparation"
    ]
  },
  "roles": {
    "eyebrow": "ONE CLEAR WORKFLOW",
    "title": "Browse, ask and review in one place",
    "description": "AIWORK Browser puts browsing beside AI conversations. Model answers and verified tool actions remain distinct, with context and features selected by the user.",
    "cards": [
      {
        "title": "You",
        "description": "Choose the profile, workspace folder, model and material to attach."
      },
      {
        "title": "Your selected model",
        "description": "An enabled Ollama model answers questions. Quality, account requirements and charges depend on the model."
      },
      {
        "title": "AIWORK Browser",
        "description": "Manage tabs, bookmarks and task records, with browsing sessions and model settings separated by profile."
      }
    ]
  },
  "workbench": {
    "eyebrow": "AIWORK BROWSER · INTERFACE GUIDE",
    "status": "Illustrative UI · not an actual app screenshot",
    "contextTitle": "Independent browser area",
    "contexts": [
      "Browse · tabs · bookmarks",
      "NetGhost · profile selection",
      "Import supported browser data",
      "Attach a selected text file"
    ],
    "conversationTitle": "AI conversation on the right",
    "prompt": "Summarize the text I selected and attached, and list what I should check.",
    "responseTitle": "Request an answer from the connected model.",
    "responseBody": "This is an illustrative workflow. No model is selected or enabled by default. Page attachments contain only the title and URL; text attachments use a bounded excerpt. Cloud models require consent, with an additional confirmation for file contents.",
    "actionTitle": "Implemented scope",
    "actions": [
      "Independent browser and profiles",
      "Ollama model conversation",
      "Supported data import"
    ],
    "evidence": "Development build implemented · AI requires setup · Public release in preparation"
  },
  "workflow": {
    "eyebrow": "HOW IT WORKS",
    "title": "Six steps in the desktop app",
    "description": "This website explains the product. The workflow below belongs to the separate development app; this site does not automatically connect browsers, accounts or models.",
    "steps": [
      {
        "number": "01",
        "title": "Choose a workspace",
        "description": "Confirm a folder at first setup. AIWORK Harness under system Downloads is suggested; another folder can be chosen."
      },
      {
        "number": "02",
        "title": "Choose a profile",
        "description": "Start with clean NetGhost or select an existing profile. Switching does not delete another profile’s data."
      },
      {
        "number": "03",
        "title": "Browse",
        "description": "Open websites and tabs and manage bookmarks. Sign in to AI Space web services yourself."
      },
      {
        "number": "04",
        "title": "Connect a model",
        "description": "Choose an Ollama completion model. Cloud use requires consent and a check of account and billing conditions."
      },
      {
        "number": "05",
        "title": "Attach context",
        "description": "Attach a page title and URL or a supported text excerpt. Page bodies across tabs are not collected automatically."
      },
      {
        "number": "06",
        "title": "Review the answer",
        "description": "Check the result. A model suggestion alone does not send email, pay or publish."
      }
    ]
  },
  "capabilities": {
    "eyebrow": "CURRENT PRODUCT STATUS",
    "title": "Implementation and release readiness are different",
    "description": "Checked on 2026-11-11. Implementation in a development build does not mean general availability or validation with every real account.",
    "cards": [
      {
        "title": "Independent desktop browser",
        "description": "Chromium browsing, tabs, bookmarks and separate web windows are implemented. Local app startup has been checked on macOS.",
        "status": "Development build"
      },
      {
        "title": "NetGhost and profile management",
        "description": "Clean default profile, selection, switching, renaming and confirmed deletion. Current/last-profile deletion is blocked and recovery data is retained.",
        "status": "Implemented · live checks remain"
      },
      {
        "title": "Supported browser imports",
        "description": "Choose supported Chrome, Firefox or Safari data. Passwords and cookies depend on support and OS approval; extensions, passkeys and whole-profile cloning are not supported.",
        "status": "Limited implementation"
      },
      {
        "title": "Opt-in AI conversations",
        "description": "Connect local or cloud Ollama completion models. Cloud use needs explicit consent and is not guaranteed free. ChatGPT, Gemini and Claude web services are used directly.",
        "status": "Connection and consent required"
      },
      {
        "title": "Context and local storage",
        "description": "Attach page titles/URLs and bounded UTF-8 text excerpts. Store app data in the chosen workspace. Full PDF/spreadsheet analysis and automatic multi-tab body capture are not supported.",
        "status": "Bounded attachments"
      },
      {
        "title": "Public release and next steps",
        "description": "General installers, notarization and broad real-account validation are pending. Multi-AI shared conversations, long-chat compression and automated email work are not yet provided.",
        "status": "Release preparation · roadmap"
      }
    ]
  },
  "boundary": {
    "eyebrow": "CLEAR BOUNDARIES",
    "title": "Know what is stored and shared",
    "description": "Website login sessions and app records may be stored in the local workspace. Site sign-in and AI transmission are separate; complete login sessions are not sent to a model.",
    "items": [
      {
        "title": "Profile-local data",
        "description": "Manage tabs, bookmarks, history, browsing sessions and model settings per profile. Imports process only the scope chosen by the user."
      },
      {
        "title": "Cloud transmission consent",
        "description": "Questions, prior conversation and explicitly attached page information may be sent. File contents need extra confirmation; provider costs and limits apply."
      },
      {
        "title": "Answers are not action receipts",
        "description": "An answer does not prove an action completed. General automatic email, payment and publishing are not provided; supported tools retain separate confirmation boundaries."
      }
    ],
    "advancedSummary": "Verification scope and remaining limits",
    "advancedBody": "Automated regression checks and local app screens were reviewed. This is not exhaustive validation of website sign-ins, passkeys, deletion recovery or real-account session isolation. The local build does not guarantee Apple notarization or Touch ID compatibility. Actual app captures and workflow illustrations are labeled separately, and this site does not distribute source code or user profiles."
  },
  "cta": {
    "eyebrow": "AIWORK BROWSER",
    "title": "Start with the current implementation scope.",
    "description": "Contact us about development-build access, validation scope and public release plans. This page does not promise an immediate download or service availability.",
    "primaryAction": "Explore the product",
    "secondaryAction": "Contact us"
  }
};

function localizeFromEnglish(input: {
  metadataTitle: string;
  boundaryDescription: string;
  heroTitle: [string, string];
  heroPrimary: string;
  heroSecondary: string;
  roleTitle: string;
  roleCards: [Card, Card, Pick<Card, "title">];
  status: string;
  workflowTitle: string;
  workflowLabels: [string, string, string, string, string, string];
  capabilityTitle: string;
  capabilityLabels: [string, string, string, string, string, string];
  taskLabels: [string, string, string];
  ctaTitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
}): HomeWorkbenchMessage {
  return {
    ...en,
    metadata: {
      title: input.metadataTitle,
      description: input.boundaryDescription,
    },
    hero: {
      ...en.hero,
      title: input.heroTitle,
      description: input.boundaryDescription,
      primaryAction: input.heroPrimary,
      secondaryAction: input.heroSecondary,
    },
    roles: {
      ...en.roles,
      title: input.roleTitle,
      description: input.boundaryDescription,
      cards: [
        input.roleCards[0],
        input.roleCards[1],
        { ...input.roleCards[2], description: input.boundaryDescription },
      ],
    },
    workbench: {
      ...en.workbench,
      status: input.status,
      actions: input.taskLabels,
    },
    workflow: {
      ...en.workflow,
      title: input.workflowTitle,
      steps: [
        { ...en.workflow.steps[0], title: input.workflowLabels[0] },
        { ...en.workflow.steps[1], title: input.workflowLabels[1] },
        { ...en.workflow.steps[2], title: input.workflowLabels[2] },
        { ...en.workflow.steps[3], title: input.workflowLabels[3] },
        { ...en.workflow.steps[4], title: input.workflowLabels[4] },
        { ...en.workflow.steps[5], title: input.workflowLabels[5] },
      ],
    },
    capabilities: {
      ...en.capabilities,
      title: input.capabilityTitle,
      cards: [
        { ...en.capabilities.cards[0], title: input.capabilityLabels[0] },
        { ...en.capabilities.cards[1], title: input.capabilityLabels[1] },
        { ...en.capabilities.cards[2], title: input.capabilityLabels[2] },
        { ...en.capabilities.cards[3], title: input.capabilityLabels[3] },
        { ...en.capabilities.cards[4], title: input.capabilityLabels[4] },
        { ...en.capabilities.cards[5], title: input.capabilityLabels[5] },
      ],
    },
    cta: {
      ...en.cta,
      title: input.ctaTitle,
      primaryAction: input.ctaPrimary,
      secondaryAction: input.ctaSecondary,
    },
  };
}

const ja = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | ウェブを見ながら仕事を支えるAI",
  boundaryDescription: "macOS開発ビルドに独立ブラウザー、プロファイル、対応データのインポートを実装しました。AIにはモデル接続と同意が必要です。一般公開ダウンロードは準備中です。",
  heroTitle: ["ウェブを見ながら、", "仕事を支えるAI。"],
  heroPrimary: "仕組みを見る",
  heroSecondary: "検証状況を見る",
  roleTitle: "得意な役割を一つの安全な流れに",
  roleCards: [
    { title: "ユーザー", description: "目的を設定し、重要な操作を承認します。" },
    { title: "AIモデル", description: "分析・下書き・計画を提案します。" },
    { title: "AIWORK" },
  ],
  status: "説明用UI・実際のアプリ画面ではありません",
  workflowTitle: "一つのチャットで進む6段階",
  workflowLabels: ["作業フォルダー", "プロファイル", "ウェブ閲覧", "モデル接続", "資料添付", "回答確認"],
  capabilityTitle: "依頼から検証済みの結果まで",
  capabilityLabels: ["独立デスクトップブラウザー", "NetGhostとプロファイル管理", "対応ブラウザーデータのインポート", "選択式AI会話", "資料とローカル保存", "公開リリースと次の段階"],
  taskLabels: ["独立デスクトップブラウザー", "選択式AI会話", "対応ブラウザーデータのインポート"],
  ctaTitle: "目的を伝えると、安全な作業フローが始まります。",
  ctaPrimary: "機能を見る",
  ctaSecondary: "相談する",
});

const zhCN = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | 浏览网页时帮助你工作的 AI",
  boundaryDescription: "macOS 开发版已实现独立浏览器、配置文件和支持的数据导入。AI 需要连接模型并确认同意。面向公众的下载仍在准备中。",
  heroTitle: ["浏览网页时，", "AI 帮助你工作。"],
  heroPrimary: "查看工作方式",
  heroSecondary: "查看验证状态",
  roleTitle: "让每个角色在同一安全流程中发挥所长",
  roleCards: [
    { title: "用户", description: "设定目标并审批重要操作。" },
    { title: "AI 模型", description: "提供分析、草稿和计划。" },
    { title: "AIWORK" },
  ],
  status: "界面示意 · 并非实际应用截图",
  workflowTitle: "在一个对话中完成六步",
  workflowLabels: ["选择工作文件夹", "选择配置文件", "浏览网页", "连接模型", "附加资料", "检查答案"],
  capabilityTitle: "从需求到经过验证的结果",
  capabilityLabels: ["独立桌面浏览器", "NetGhost 与配置文件管理", "支持的浏览器数据导入", "自主选择的 AI 对话", "资料与本地存储", "公开发布与后续计划"],
  taskLabels: ["独立桌面浏览器", "自主选择的 AI 对话", "支持的浏览器数据导入"],
  ctaTitle: "说明目标，即可启动安全的工作流程。",
  ctaPrimary: "查看功能",
  ctaSecondary: "联系我们",
});

const ar = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | ذكاء اصطناعي يساعدك أثناء التصفح",
  boundaryDescription: "نُفّذ المتصفح المستقل والملفات الشخصية واستيراد البيانات المدعومة في نسخة تطوير macOS. يتطلب الذكاء الاصطناعي ربط نموذج والموافقة. التنزيل العام ما زال قيد الإعداد.",
  heroTitle: ["تصفّح الويب،", "ودع الذكاء الاصطناعي يساعدك."],
  heroPrimary: "تعرّف على آلية العمل",
  heroSecondary: "اطّلع على حالة التحقق",
  roleTitle: "يجمع الأدوار في مسار عمل آمن واحد",
  roleCards: [
    { title: "المستخدم", description: "يحدّد الهدف ويوافق على الإجراءات المهمة." },
    { title: "نموذج الذكاء الاصطناعي", description: "يقترح التحليل والمسودات والخطط." },
    { title: "AIWORK" },
  ],
  status: "واجهة توضيحية وليست لقطة فعلية للتطبيق",
  workflowTitle: "ست خطوات في محادثة واحدة",
  workflowLabels: ["اختر مجلد العمل", "اختر ملفًا شخصيًا", "تصفح", "اربط نموذجًا", "أرفق السياق", "راجع الإجابة"],
  capabilityTitle: "من الطلب إلى نتيجة تم التحقق منها",
  capabilityLabels: ["متصفح سطح مكتب مستقل", "NetGhost وإدارة الملفات الشخصية", "استيراد بيانات المتصفح المدعومة", "محادثات ذكاء اصطناعي اختيارية", "السياق والتخزين المحلي", "الإصدار العام والخطوات التالية"],
  taskLabels: ["متصفح سطح مكتب مستقل", "محادثات ذكاء اصطناعي اختيارية", "استيراد بيانات المتصفح المدعومة"],
  ctaTitle: "صِف النتيجة وابدأ مسار عمل آمنًا.",
  ctaPrimary: "استكشف الميزات",
  ctaSecondary: "تواصل معنا",
});

const es = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | IA que te ayuda mientras navegas",
  boundaryDescription: "La versión de desarrollo para macOS implementa navegador independiente, perfiles e importaciones compatibles. La IA requiere conectar un modelo y dar consentimiento. La descarga pública está en preparación.",
  heroTitle: ["Navega por la web.", "La IA te ayuda a trabajar."],
  heroPrimary: "Ver cómo funciona",
  heroSecondary: "Ver estado de validación",
  roleTitle: "Cada parte aporta lo mejor en un flujo seguro",
  roleCards: [
    { title: "Usuario", description: "Define el objetivo y aprueba acciones importantes." },
    { title: "Modelo de IA", description: "Propone análisis, borradores y planes." },
    { title: "AIWORK" },
  ],
  status: "Interfaz ilustrativa · no es una captura de la aplicación",
  workflowTitle: "Seis pasos en un solo chat",
  workflowLabels: ["Carpeta de trabajo", "Perfil", "Navegar", "Conectar modelo", "Adjuntar contexto", "Revisar respuesta"],
  capabilityTitle: "De la solicitud a un resultado verificado",
  capabilityLabels: ["Navegador de escritorio independiente", "NetGhost y gestión de perfiles", "Importaciones compatibles", "Conversaciones de IA opcionales", "Contexto y almacenamiento local", "Lanzamiento público y próximos pasos"],
  taskLabels: ["Navegador de escritorio independiente", "Conversaciones de IA opcionales", "Importaciones compatibles"],
  ctaTitle: "Describe el resultado y empieza un flujo seguro.",
  ctaPrimary: "Explorar funciones",
  ctaSecondary: "Hablar con nosotros",
});

const fr = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | L’IA qui vous aide pendant la navigation",
  boundaryDescription: "La version de développement macOS intègre un navigateur indépendant, des profils et les imports pris en charge. L’IA nécessite un modèle connecté et votre accord. Le téléchargement public est en préparation.",
  heroTitle: ["Parcourez le web.", "L’IA vous aide à travailler."],
  heroPrimary: "Voir le fonctionnement",
  heroSecondary: "Voir l’état de validation",
  roleTitle: "Chaque rôle réuni dans un flux sûr",
  roleCards: [
    { title: "Utilisateur", description: "Définit l’objectif et approuve les actions importantes." },
    { title: "Modèle d’IA", description: "Propose analyses, brouillons et plans." },
    { title: "AIWORK" },
  ],
  status: "Interface illustrative · pas une capture réelle de l’application",
  workflowTitle: "Six étapes dans un seul chat",
  workflowLabels: ["Dossier de travail", "Profil", "Navigation", "Connexion du modèle", "Joindre le contexte", "Vérifier la réponse"],
  capabilityTitle: "De la demande au résultat vérifié",
  capabilityLabels: ["Navigateur de bureau indépendant", "NetGhost et gestion des profils", "Imports de navigateur pris en charge", "Conversations IA au choix", "Contexte et stockage local", "Lancement public et prochaines étapes"],
  taskLabels: ["Navigateur de bureau indépendant", "Conversations IA au choix", "Imports de navigateur pris en charge"],
  ctaTitle: "Décrivez le résultat et lancez un flux sûr.",
  ctaPrimary: "Explorer les fonctions",
  ctaSecondary: "Nous contacter",
});

const de = localizeFromEnglish({
  metadataTitle: "AIWORK Browser | KI-Hilfe beim Surfen",
  boundaryDescription: "Der macOS-Entwicklungsbuild implementiert einen eigenständigen Browser, Profile und unterstützte Importe. KI benötigt eine Modellverbindung und Zustimmung. Ein öffentlicher Download wird vorbereitet.",
  heroTitle: ["Im Web surfen.", "KI hilft bei der Arbeit."],
  heroPrimary: "Funktionsweise ansehen",
  heroSecondary: "Prüfstatus ansehen",
  roleTitle: "Jede Rolle in einem sicheren Ablauf",
  roleCards: [
    { title: "Nutzer", description: "Definiert das Ziel und genehmigt wichtige Aktionen." },
    { title: "KI-Modell", description: "Schlägt Analysen, Entwürfe und Pläne vor." },
    { title: "AIWORK" },
  ],
  status: "Illustrative Oberfläche · kein tatsächlicher App-Screenshot",
  workflowTitle: "Sechs Schritte in einem Chat",
  workflowLabels: ["Arbeitsordner", "Profil", "Surfen", "Modell verbinden", "Kontext anhängen", "Antwort prüfen"],
  capabilityTitle: "Von der Anfrage zum geprüften Ergebnis",
  capabilityLabels: ["Eigenständiger Desktop-Browser", "NetGhost und Profilverwaltung", "Unterstützte Browserimporte", "Optionale KI-Gespräche", "Kontext und lokale Speicherung", "Öffentliche Veröffentlichung und Ausblick"],
  taskLabels: ["Eigenständiger Desktop-Browser", "Optionale KI-Gespräche", "Unterstützte Browserimporte"],
  ctaTitle: "Beschreiben Sie das Ergebnis und starten Sie einen sicheren Ablauf.",
  ctaPrimary: "Funktionen ansehen",
  ctaSecondary: "Kontakt aufnehmen",
});

export const homeWorkbenchMessages: Record<Locale, HomeWorkbenchMessage> = {
  ko,
  en,
  ja,
  "zh-CN": zhCN,
  ar,
  es,
  fr,
  de,
};
