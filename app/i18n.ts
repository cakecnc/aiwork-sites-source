export const supportedLocales = [
  "ko",
  "en",
  "ja",
  "zh-CN",
  "ar",
  "es",
  "fr",
  "de",
] as const;

export type Locale = (typeof supportedLocales)[number];

export type ThemeKey =
  | "system"
  | "light"
  | "dark"
  | "aurora"
  | "editorial"
  | "console"
  | "synthwave";

export const localeInfo: Record<
  Locale,
  { nativeName: string; shortName: string; htmlLang: string }
> = {
  ko: { nativeName: "한국어", shortName: "KO", htmlLang: "ko" },
  en: { nativeName: "English", shortName: "EN", htmlLang: "en" },
  ja: { nativeName: "日本語", shortName: "JA", htmlLang: "ja" },
  "zh-CN": { nativeName: "简体中文", shortName: "ZH", htmlLang: "zh-CN" },
  ar: { nativeName: "العربية", shortName: "AR", htmlLang: "ar" },
  es: { nativeName: "Español", shortName: "ES", htmlLang: "es" },
  fr: { nativeName: "Français", shortName: "FR", htmlLang: "fr" },
  de: { nativeName: "Deutsch", shortName: "DE", htmlLang: "de" },
};

export type MessageSet = {
  metadata: { title: string; description: string };
  language: { trigger: string; title: string; note: string };
  nav: {
    product: string;
    features: string;
    security: string;
    payments: string;
    contact: string;
    install: string;
  };
  themes: Record<ThemeKey, { name: string; note: string }>;
  themeMenu: {
    trigger: string;
    title: string;
    note: string;
    customTitle: string;
    customNote: string;
  };
  status: {
    releaseCandidate: string;
    current: string;
    roadmap: string;
    productVision: string;
    browserCapture: string;
  };
  hero: {
    eyebrow: string;
    title: [string, string];
    description: [string, string];
    primaryAction: string;
    secondaryAction: string;
    trust: [string, string, string];
  };
  workspace: {
    sources: [string, string, string, string];
    userPrompt: string;
    responseTitle: string;
    responseBody: string;
    nextWork: string;
    tasks: [string, string, string];
    evidenceLabel: string;
  };
  features: {
    eyebrow: string;
    title: [string, string];
    details: string;
    cards: [
      { label: string; title: string; description: string },
      { label: string; title: string; description: string },
      { label: string; title: string; description: string },
    ];
  };
  workflow: {
    eyebrow: string;
    title: [string, string];
    description: string;
    steps: [
      { number: string; title: string; description: string },
      { number: string; title: string; description: string },
      { number: string; title: string; description: string },
    ];
  };
  payments: {
    eyebrow: string;
    title: [string, string];
    description: string;
    statusLabel: string;
    status: string;
    products: [
      {
        name: string;
        price: string;
        billing: string;
        features: [string, string, string];
        action: string;
      },
      {
        name: string;
        price: string;
        billing: string;
        features: [string, string, string];
        action: string;
      },
      {
        name: string;
        price: string;
        billing: string;
        features: [string, string, string];
        action: string;
      },
    ];
    supportTitle: string;
    supportDescription: string;
    supportAction: string;
    disclaimer: string;
  };
  cta: {
    eyebrow: string;
    title: [string, string];
    description: string;
    releaseAlert: string;
    consultation: string;
  };
  footer: { tagline: string; copyright: string };
  customColors: {
    eyebrow: string;
    title: string;
    description: string;
    previewTagline: string;
    accent: string;
    secondary: string;
    background: string;
    contrastError: string;
    reset: string;
    apply: string;
  };
  aria: {
    home: string;
    skipToContent: string;
    mainNavigation: string;
    close: string;
    themeMenu: string;
    languageMenu: string;
    selectTheme: string;
    selectLanguage: string;
    customColorDialog: string;
    assistantAvatar: string;
  };
};

export const messages: Record<Locale, MessageSet> = {
  ko: {
    metadata: {
      title: "AIWORK Browser RC | 현재 탭 수집·Drive 저장",
      description:
        "사용자가 명시적으로 실행한 현재 탭을 수집·미리보기하고, 별도 승인과 OAuth 후 Google Drive appDataFolder에 저장하는 Chrome 확장프로그램 출시 후보입니다. AI 분석·RAG·이메일·업무 도구 연동은 로드맵입니다.",
    },
    language: {
      trigger: "언어",
      title: "언어 선택",
      note: "사용할 언어를 선택하세요",
    },
    nav: {
      product: "제품",
      features: "기능",
      security: "보안",
      payments: "결제",
      contact: "문의",
      install: "출시 알림",
    },
    themes: {
      system: { name: "시스템", note: "기기 설정에 맞춤" },
      light: { name: "라이트", note: "맑고 선명하게" },
      dark: { name: "다크", note: "차분하고 편안하게" },
      aurora: { name: "프리미엄 오로라", note: "딥네이비 · 퍼플" },
      editorial: { name: "에디토리얼 워크플로", note: "아이보리 · 블루" },
      console: { name: "운영 콘솔", note: "차콜 · 민트" },
      synthwave: { name: "신스웨이브", note: "마젠타 · 시안" },
    },
    themeMenu: {
      trigger: "테마",
      title: "화면 테마",
      note: "원하는 분위기를 선택하세요",
      customTitle: "컬러 커스텀",
      customNote: "브랜드 컬러를 직접 지정",
    },
    status: {
      releaseCandidate: "출시 후보",
      current: "현재 · BROWSER RC",
      roadmap: "로드맵",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "현재 탭 수집 미리보기",
    },
    hero: {
      eyebrow: "CHROME 확장프로그램 · RELEASE CANDIDATE",
      title: ["사용자가 실행한 현재 탭을", "안전하게 수집·저장합니다."],
      description: [
        "제목·URL·본문 또는 선택 영역을 민감정보 패턴 제거 후 미리보기하고,",
        "별도 승인과 OAuth 설정 후 Google Drive appDataFolder에 저장합니다.",
      ],
      primaryAction: "출시 알림 받기",
      secondaryAction: "현재 범위 확인",
      trust: ["사용자 명시 실행", "민감정보 패턴 제거", "승인·OAuth 후 Drive 저장"],
    },
    workspace: {
      sources: ["현재 탭", "선택 영역", "민감정보 패턴 제거", "Drive · OAuth 후"],
      userPrompt: "현재 탭에서 선택한 내용을 저장 전 미리보기로 준비해 주세요.",
      responseTitle: "현재 탭을 수집했습니다.",
      responseBody:
        "제목·URL·본문 또는 선택 영역을 민감정보 패턴 제거 후 임시 미리보기로 준비했습니다. 별도 승인과 OAuth 설정 후 appDataFolder에 저장할 수 있습니다.",
      nextWork: "현재 제공 동작",
      tasks: ["Drive 저장 승인", "저장 기록 확인", "삭제·연결 해제"],
      evidenceLabel: "현재 탭 1개",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["업무의 모든 순간을", "하나의 흐름으로"],
      details: "자세히 보기",
      cards: [
        {
          label: "BROWSER",
          title: "명시적으로 실행한 현재 탭",
          description:
            "Toolbar·수집 단축키·Context Menu로 실행한 탭을 수집하고 저장 전 미리봅니다.",
        },
        {
          label: "WORKFLOW",
          title: "업무 연동은 로드맵",
          description:
            "문서·이메일·업무 도구 자동화는 현재 Browser RC에 포함되지 않습니다.",
        },
        {
          label: "MEMORY",
          title: "기록 Library는 현재, AI Memory는 로드맵",
          description:
            "Source·Memory·Research 분류와 Library 저장은 현재 기능입니다. AI 분석·RAG·자동 장기 Memory는 후속 개발합니다.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["현재 Browser RC는", "세 단계로 동작합니다."],
      description: "수집과 Drive 저장은 각각 사용자가 직접 실행하고 승인합니다.",
      steps: [
        {
          number: "01",
          title: "현재 탭에서 실행",
          description: "Toolbar·수집 단축키·Context Menu로 읽을 탭을 명시합니다.",
        },
        {
          number: "02",
          title: "미리보기·승인",
          description: "민감정보 패턴이 제거된 결과를 확인하고 저장 여부를 결정합니다.",
        },
        {
          number: "03",
          title: "Drive 저장",
          description: "별도 동의와 OAuth 후 승인한 기록만 appDataFolder에 저장합니다.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["제공 범위를 확인하고,", "1회 결제로 시작하세요."],
      description:
        "Professional과 Business는 정식 출시 전 사전 구매 상품이며, 스마트스토어 실무팩은 현재 제공되는 디지털 상품입니다. 결제는 PayPal 공식 페이지에서 처리됩니다.",
      statusLabel: "결제 상태",
      status: "출시 전 제공 조건 표시",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "사전 구매 · 1회 결제",
          features: ["정식 출시 전 사전 구매", "Chrome Extension은 공개 출시 후 제공", "Google Drive는 OAuth 승인 후 활성화"],
          action: "Professional 사전 구매",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "사전 구매 · 1회 결제",
          features: ["Professional 사전 구매 범위 포함", "Business Workspace는 개발 중", "우선 지원은 이메일로 제공"],
          action: "Business 사전 구매",
        },
        {
          name: "네이버 스마트스토어 실무팩",
          price: "USD 29",
          billing: "디지털 상품 · 1회 결제",
          features: ["상세페이지 기획", "상품명·검색 키워드·마케팅 문구", "고객응대·체크리스트·AI 프롬프트"],
          action: "실무팩 구매",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "AIWORK 개발, 문서화, 서비스 개선과 사용자 지원을 위한 자발적 후원입니다.",
      supportAction: "PayPal로 후원",
      disclaimer:
        "Professional과 Business는 아직 일반 출시되지 않았습니다. Chrome Extension은 공개 출시 후, Google Drive 기능은 Google OAuth 승인 완료 후 제공됩니다. 결제 전에 cakecnc@daum.net으로 제공 범위와 일정을 확인해 주세요. 거래 확인과 상품·라이선스 제공은 수동으로 진행되며 PayPal 영수증과 거래 ID를 보관해야 합니다.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["업무가 있는 곳에서", "AIWORK를 시작하세요."],
      description: "Chrome 확장프로그램과 데스크톱 앱을 준비하고 있습니다.",
      releaseAlert: "출시 알림 신청",
      consultation: "도입 상담",
    },
    footer: {
      tagline: "AI와 업무를 연결하는 새로운 방식.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "컬러 커스텀",
      description: "AIWORK를 사용자 브랜드에 맞게 조정하세요.",
      previewTagline: "Work, connected.",
      accent: "포인트 컬러",
      secondary: "보조 컬러",
      background: "배경 컬러",
      contrastError:
        "색상 대비가 부족합니다. 배경과 보조색, 배경과 포인트색의 차이를 더 크게 조정해 주세요.",
      reset: "기본값 복원",
      apply: "컬러 적용하기",
    },
    aria: {
      home: "AIWORK 홈",
      skipToContent: "본문으로 바로가기",
      mainNavigation: "주요 메뉴",
      close: "닫기",
      themeMenu: "테마 메뉴",
      languageMenu: "언어 메뉴",
      selectTheme: "{name} 테마 선택",
      selectLanguage: "{name}로 언어 변경",
      customColorDialog: "사용자 지정 색상 설정",
      assistantAvatar: "AIWORK 애니메이션 프로필",
    },
  },
  en: {
    metadata: {
      title: "AIWORK Browser RC | Current-tab capture and Drive storage",
      description:
        "A Chrome extension release candidate that captures and previews a user-invoked current tab, then stores approved records in Google Drive appDataFolder after OAuth. AI analysis, RAG, email, and work-tool integrations are roadmap items.",
    },
    language: {
      trigger: "Language",
      title: "Choose language",
      note: "Select your preferred language",
    },
    nav: {
      product: "Product",
      features: "Features",
      security: "Security",
      payments: "Payments",
      contact: "Contact",
      install: "Release updates",
    },
    themes: {
      system: { name: "System", note: "Matches your device" },
      light: { name: "Light", note: "Crisp and clear" },
      dark: { name: "Dark", note: "Calm and comfortable" },
      aurora: { name: "Premium Aurora", note: "Deep navy · purple" },
      editorial: { name: "Editorial Workflow", note: "Ivory · blue" },
      console: { name: "Operations Console", note: "Charcoal · mint" },
      synthwave: { name: "Synthwave", note: "Magenta · cyan" },
    },
    themeMenu: {
      trigger: "Theme",
      title: "Display theme",
      note: "Choose the look that fits you",
      customTitle: "Custom colors",
      customNote: "Set your own brand colors",
    },
    status: {
      releaseCandidate: "RELEASE CANDIDATE",
      current: "CURRENT · BROWSER RC",
      roadmap: "ROADMAP",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "CURRENT-TAB CAPTURE PREVIEW",
    },
    hero: {
      eyebrow: "CHROME EXTENSION · RELEASE CANDIDATE",
      title: ["Capture the tab you invoke.", "Preview and store it safely."],
      description: [
        "Preview the title, URL, body, or selection after sensitive-pattern removal,",
        "then save approved records to Google Drive appDataFolder after OAuth.",
      ],
      primaryAction: "Get release updates",
      secondaryAction: "See the current scope",
      trust: ["Explicit user action", "Sensitive-pattern removal", "Drive after consent and OAuth"],
    },
    workspace: {
      sources: ["Current tab", "Selected text", "Sensitive-pattern removal", "Drive · after OAuth"],
      userPrompt: "Prepare the selected current-tab content for preview before saving.",
      responseTitle: "The current tab was captured.",
      responseBody:
        "The title, URL, body, or selection is shown temporarily after sensitive-pattern removal. You can save it to appDataFolder after separate approval and OAuth setup.",
      nextWork: "Available actions",
      tasks: ["Approve Drive save", "Review saved records", "Delete or disconnect"],
      evidenceLabel: "1 current tab",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Every step of work,", "in one connected flow"],
      details: "Learn more",
      cards: [
        {
          label: "BROWSER",
          title: "The current tab you explicitly invoke",
          description:
            "Capture a tab through the toolbar, capture shortcut, or context menu and preview it before saving.",
        },
        {
          label: "WORKFLOW",
          title: "Work integrations are roadmap",
          description:
            "Document, email, and work-tool automation are not included in the current Browser RC.",
        },
        {
          label: "MEMORY",
          title: "Record Library now; AI Memory is roadmap",
          description: "Source, Memory, and Research record types with Library storage are current. AI analysis, RAG, and automatic long-term Memory remain roadmap items.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["The current Browser RC", "works in three steps."],
      description: "You explicitly invoke capture and separately approve Drive storage.",
      steps: [
        {
          number: "01",
          title: "Invoke on the current tab",
          description: "Use the toolbar, capture shortcut, or context menu on the tab to read.",
        },
        {
          number: "02",
          title: "Preview and approve",
          description: "Review the result after sensitive-pattern removal and decide whether to save.",
        },
        {
          number: "03",
          title: "Save to Drive",
          description: "After separate consent and OAuth, save only approved records to appDataFolder.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["Review what is available,", "then choose a one-time purchase."],
      description:
        "Professional and Business are pre-release purchases. The SmartStore pack is a currently available digital product. Payments are processed on PayPal’s official pages.",
      statusLabel: "Payment status",
      status: "Pre-release terms displayed",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "pre-release · one-time",
          features: ["Pre-release purchase", "Chrome Extension after public release", "Google Drive after OAuth approval"],
          action: "Pre-purchase Professional",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "pre-release · one-time",
          features: ["Includes the Professional pre-release scope", "Business Workspace is in development", "Priority support is provided by email"],
          action: "Pre-purchase Business",
        },
        {
          name: "Naver SmartStore Operations Pack",
          price: "USD 29",
          billing: "digital product · one-time",
          features: ["Product-page planning", "Titles, search keywords, and marketing copy", "Support scripts, checklists, and AI prompts"],
          action: "Buy the operations pack",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "Voluntary contributions support AIWORK development, documentation, service improvements, and user support.",
      supportAction: "Support with PayPal",
      disclaimer:
        "Professional and Business are not yet generally available. The Chrome Extension will be provided after public release, and Google Drive features after Google OAuth approval. Before paying, confirm the delivery scope and timing at cakecnc@daum.net. Transactions and product or license delivery are verified manually; keep your PayPal receipt and transaction ID.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["Start AIWORK", "wherever work happens."],
      description: "The Chrome extension and desktop app are coming soon.",
      releaseAlert: "Get release updates",
      consultation: "Talk to our team",
    },
    footer: {
      tagline: "A new way to connect AI and work.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "Custom colors",
      description: "Adapt AIWORK to your brand.",
      previewTagline: "Work, connected.",
      accent: "Accent color",
      secondary: "Secondary color",
      background: "Background color",
      contrastError:
        "These colors do not have enough contrast. Increase the difference between the background, accent, and secondary colors.",
      reset: "Restore defaults",
      apply: "Apply colors",
    },
    aria: {
      home: "AIWORK home",
      skipToContent: "Skip to main content",
      mainNavigation: "Main navigation",
      close: "Close",
      themeMenu: "Theme menu",
      languageMenu: "Language menu",
      selectTheme: "Select {name} theme",
      selectLanguage: "Switch language to {name}",
      customColorDialog: "Custom color settings",
      assistantAvatar: "AIWORK anime profile",
    },
  },
  ja: {
    metadata: {
      title: "AIWORK Browser RC｜現在のタブ収集・Drive保存",
      description:
        "ユーザーが明示的に実行した現在のタブを収集・プレビューし、別途承認とOAuth後にGoogle Drive appDataFolderへ保存するChrome拡張機能のリリース候補です。AI分析・RAG・メール・業務ツール連携はロードマップです。",
    },
    language: {
      trigger: "言語",
      title: "言語を選択",
      note: "使用する言語を選んでください",
    },
    nav: {
      product: "製品",
      features: "機能",
      security: "セキュリティ",
      payments: "お支払い",
      contact: "お問い合わせ",
      install: "リリース通知",
    },
    themes: {
      system: { name: "システム", note: "端末設定に合わせる" },
      light: { name: "ライト", note: "明るくクリア" },
      dark: { name: "ダーク", note: "落ち着いた表示" },
      aurora: { name: "プレミアムオーロラ", note: "ディープネイビー・パープル" },
      editorial: { name: "エディトリアルワークフロー", note: "アイボリー・ブルー" },
      console: { name: "オペレーションコンソール", note: "チャコール・ミント" },
      synthwave: { name: "シンセウェーブ", note: "マゼンタ・シアン" },
    },
    themeMenu: {
      trigger: "テーマ",
      title: "表示テーマ",
      note: "好みのスタイルを選んでください",
      customTitle: "カスタムカラー",
      customNote: "ブランドカラーを直接設定",
    },
    status: {
      releaseCandidate: "リリース候補",
      current: "現在 · BROWSER RC",
      roadmap: "ロードマップ",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "現在のタブ収集プレビュー",
    },
    hero: {
      eyebrow: "CHROME拡張機能 · リリース候補",
      title: ["明示的に実行した現在のタブを", "安全に収集・保存します。"],
      description: [
        "タイトル・URL・本文または選択範囲を機密パターン除去後にプレビューし、",
        "別途承認とOAuth設定後にGoogle Drive appDataFolderへ保存します。",
      ],
      primaryAction: "リリース通知を受け取る",
      secondaryAction: "現在の範囲を見る",
      trust: ["ユーザーの明示操作", "機密パターン除去", "承認・OAuth後にDrive保存"],
    },
    workspace: {
      sources: ["現在のタブ", "選択範囲", "機密パターン除去", "Drive · OAuth後"],
      userPrompt: "現在のタブで選択した内容を保存前プレビューにしてください。",
      responseTitle: "現在のタブを収集しました。",
      responseBody:
        "タイトル・URL・本文または選択範囲を機密パターン除去後の一時プレビューとして表示します。別途承認とOAuth設定後にappDataFolderへ保存できます。",
      nextWork: "現在利用できる操作",
      tasks: ["Drive保存を承認", "保存記録を確認", "削除・接続解除"],
      evidenceLabel: "現在のタブ 1件",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["仕事のすべての瞬間を", "ひとつの流れに"],
      details: "詳しく見る",
      cards: [
        {
          label: "BROWSER",
          title: "明示的に実行した現在のタブ",
          description:
            "ツールバー・収集ショートカット・コンテキストメニューからタブを収集し、保存前にプレビューします。",
        },
        {
          label: "WORKFLOW",
          title: "業務連携はロードマップ",
          description:
            "文書・メール・業務ツール自動化は現在のBrowser RCには含まれません。",
        },
        {
          label: "MEMORY",
          title: "記録Libraryは現在、AI Memoryはロードマップ",
          description:
            "Source・Memory・Researchの分類とLibrary保存は現在の機能です。AI分析・RAG・自動長期Memoryはロードマップです。",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["現在のBrowser RCは", "3ステップで動作します。"],
      description: "収集とDrive保存は、それぞれユーザーが明示的に実行・承認します。",
      steps: [
        {
          number: "01",
          title: "現在のタブで実行",
          description: "ツールバー・収集ショートカット・コンテキストメニューで対象タブを明示します。",
        },
        {
          number: "02",
          title: "プレビュー・承認",
          description: "機密パターン除去後の結果を確認し、保存するか決定します。",
        },
        {
          number: "03",
          title: "Driveへ保存",
          description: "別途同意とOAuth後、承認した記録だけをappDataFolderへ保存します。",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["提供範囲を確認してから", "一回購入を選択してください。"],
      description:
        "ProfessionalとBusinessは正式リリース前の事前購入商品です。SmartStore実務パックは現在提供中のデジタル商品です。決済はPayPal公式ページで処理されます。",
      statusLabel: "決済状況",
      status: "リリース前の提供条件を表示",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "事前購入・一回払い",
          features: ["正式リリース前の事前購入", "Chrome Extensionは公開後に提供", "Google DriveはOAuth承認後に有効化"],
          action: "Professionalを事前購入",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "事前購入・一回払い",
          features: ["Professionalの事前購入範囲を含む", "Business Workspaceは開発中", "優先サポートはメールで提供"],
          action: "Businessを事前購入",
        },
        {
          name: "Naver SmartStore 実務パック",
          price: "USD 29",
          billing: "デジタル商品・一回購入",
          features: ["商品ページ企画", "商品名・検索キーワード・販促コピー", "顧客対応・チェックリスト・AIプロンプト"],
          action: "実務パックを購入",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "AIWORKの開発、文書化、サービス改善、ユーザーサポートのための任意の支援です。",
      supportAction: "PayPalで支援",
      disclaimer:
        "ProfessionalとBusinessはまだ一般公開されていません。Chrome Extensionは公開後、Google Drive機能はGoogle OAuth承認後に提供されます。決済前にcakecnc@daum.netで提供範囲と時期をご確認ください。取引確認と商品・ライセンス提供は手動で行われるため、PayPalの領収書と取引IDを保管してください。",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["業務のある場所から", "AIWORKを始めましょう。"],
      description: "Chrome拡張機能とデスクトップアプリを準備中です。",
      releaseAlert: "リリース通知を受け取る",
      consultation: "導入相談",
    },
    footer: {
      tagline: "AIと業務をつなぐ、新しい方法。",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "カスタムカラー",
      description: "AIWORKをブランドに合わせて調整できます。",
      previewTagline: "Work, connected.",
      accent: "アクセントカラー",
      secondary: "サブカラー",
      background: "背景カラー",
      contrastError:
        "色のコントラストが不足しています。背景色とアクセント・サブカラーの差を大きくしてください。",
      reset: "初期設定に戻す",
      apply: "カラーを適用",
    },
    aria: {
      home: "AIWORKホーム",
      skipToContent: "本文へ移動",
      mainNavigation: "メインナビゲーション",
      close: "閉じる",
      themeMenu: "テーマメニュー",
      languageMenu: "言語メニュー",
      selectTheme: "{name}テーマを選択",
      selectLanguage: "言語を{name}に変更",
      customColorDialog: "カスタムカラー設定",
      assistantAvatar: "AIWORKアニメプロフィール",
    },
  },
  "zh-CN": {
    metadata: {
      title: "AIWORK Browser RC｜当前标签页采集与Drive存储",
      description:
        "Chrome扩展发布候选版：采集并预览用户明确触发的当前标签页，在单独批准与OAuth后将记录保存到Google Drive appDataFolder。AI分析、RAG、邮件和工作工具集成属于路线图。",
    },
    language: {
      trigger: "语言",
      title: "选择语言",
      note: "请选择使用语言",
    },
    nav: {
      product: "产品",
      features: "功能",
      security: "安全",
      payments: "支付",
      contact: "联系",
      install: "发布通知",
    },
    themes: {
      system: { name: "系统", note: "跟随设备设置" },
      light: { name: "浅色", note: "清晰明快" },
      dark: { name: "深色", note: "沉稳舒适" },
      aurora: { name: "高级极光", note: "深海军蓝 · 紫色" },
      editorial: { name: "编辑工作流", note: "象牙白 · 蓝色" },
      console: { name: "运营控制台", note: "炭黑 · 薄荷绿" },
      synthwave: { name: "合成波", note: "洋红 · 青色" },
    },
    themeMenu: {
      trigger: "主题",
      title: "显示主题",
      note: "选择喜欢的视觉风格",
      customTitle: "自定义颜色",
      customNote: "设置专属品牌颜色",
    },
    status: {
      releaseCandidate: "发布候选版",
      current: "当前 · BROWSER RC",
      roadmap: "路线图",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "当前标签页采集预览",
    },
    hero: {
      eyebrow: "CHROME扩展 · 发布候选版",
      title: ["采集您明确触发的当前标签页，", "安全预览并保存。"],
      description: [
        "移除敏感信息模式后预览标题、URL、正文或选中内容，",
        "经单独批准与OAuth设置后保存到Google Drive appDataFolder。",
      ],
      primaryAction: "获取发布通知",
      secondaryAction: "查看当前范围",
      trust: ["用户明确操作", "移除敏感信息模式", "同意与OAuth后保存到Drive"],
    },
    workspace: {
      sources: ["当前标签页", "选中内容", "移除敏感信息模式", "Drive · OAuth后"],
      userPrompt: "请在保存前预览当前标签页中选中的内容。",
      responseTitle: "已采集当前标签页。",
      responseBody: "标题、URL、正文或选中内容会在移除敏感信息模式后临时显示。单独批准并设置OAuth后，可保存到appDataFolder。",
      nextWork: "当前可用操作",
      tasks: ["批准Drive保存", "查看保存记录", "删除或断开连接"],
      evidenceLabel: "1个当前标签页",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["让工作的每个环节", "汇入同一流程"],
      details: "了解详情",
      cards: [
        {
          label: "BROWSER",
          title: "您明确触发的当前标签页",
          description: "通过工具栏、采集快捷键或上下文菜单采集标签页，并在保存前预览。",
        },
        {
          label: "WORKFLOW",
          title: "工作集成属于路线图",
          description: "文档、邮件与工作工具自动化不包含在当前Browser RC中。",
        },
        {
          label: "MEMORY",
          title: "记录Library现已提供，AI Memory仍在路线图中",
          description: "Source、Memory、Research分类与Library存储是当前功能；AI分析、RAG和自动长期Memory仍属于后续路线图。",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["当前Browser RC", "通过三步运行。"],
      description: "采集与Drive存储均由用户分别明确触发和批准。",
      steps: [
        {
          number: "01",
          title: "在当前标签页触发",
          description: "使用工具栏、采集快捷键或上下文菜单明确指定要读取的标签页。",
        },
        {
          number: "02",
          title: "预览并批准",
          description: "查看移除敏感信息模式后的结果，并决定是否保存。",
        },
        {
          number: "03",
          title: "保存到Drive",
          description: "单独同意并完成OAuth后，仅将批准记录保存到appDataFolder。",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["确认当前提供范围后，", "再选择一次性购买。"],
      description:
        "Professional 和 Business 为正式发布前的预购商品；SmartStore 实务包是目前可提供的数字商品。付款将在 PayPal 官方页面处理。",
      statusLabel: "付款状态",
      status: "已显示发布前提供条件",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "预购 · 一次付款",
          features: ["正式发布前预购", "Chrome Extension 在公开发布后提供", "Google Drive 在 OAuth 获批后启用"],
          action: "预购 Professional",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "预购 · 一次付款",
          features: ["包含 Professional 预购范围", "Business Workspace 仍在开发", "通过电子邮件提供优先支持"],
          action: "预购 Business",
        },
        {
          name: "Naver SmartStore 实务包",
          price: "USD 29",
          billing: "数字商品 · 一次购买",
          features: ["商品详情页策划", "商品名、搜索关键词与营销文案", "客户应对、运营清单与 AI 提示词"],
          action: "购买实务包",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "自愿支持将用于 AIWORK 开发、文档、服务改进与用户支持。",
      supportAction: "通过 PayPal 支持",
      disclaimer:
        "Professional 和 Business 尚未正式公开发布。Chrome Extension 将在公开发布后提供，Google Drive 功能将在 Google OAuth 获批后提供。付款前请通过 cakecnc@daum.net 确认交付范围和时间。交易确认及商品或许可证交付均为人工处理，请保留 PayPal 收据和交易 ID。",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["在工作发生的地方", "开始使用 AIWORK。"],
      description: "Chrome 扩展程序和桌面应用即将推出。",
      releaseAlert: "订阅发布通知",
      consultation: "咨询部署",
    },
    footer: {
      tagline: "连接 AI 与工作的全新方式。",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "自定义颜色",
      description: "根据品牌风格调整 AIWORK。",
      previewTagline: "Work, connected.",
      accent: "强调色",
      secondary: "辅助色",
      background: "背景色",
      contrastError:
        "颜色对比度不足。请增大背景色与强调色、辅助色之间的差异。",
      reset: "恢复默认",
      apply: "应用颜色",
    },
    aria: {
      home: "AIWORK 首页",
      skipToContent: "跳到主要内容",
      mainNavigation: "主导航",
      close: "关闭",
      themeMenu: "主题菜单",
      languageMenu: "语言菜单",
      selectTheme: "选择{name}主题",
      selectLanguage: "切换语言为{name}",
      customColorDialog: "自定义颜色设置",
      assistantAvatar: "AIWORK 动漫头像",
    },
  },
  ar: {
    metadata: {
      title: "AIWORK Browser RC | التقاط علامة التبويب الحالية وحفظها في Drive",
      description:
        "مرشح إصدار لإضافة Chrome تلتقط وتعاين علامة التبويب الحالية التي يشغّلها المستخدم صراحة، ثم تحفظ السجلات المعتمدة في Google Drive appDataFolder بعد موافقة منفصلة وOAuth. تحليل AI وRAG والبريد وأدوات العمل ضمن خارطة الطريق.",
    },
    language: {
      trigger: "اللغة",
      title: "اختر اللغة",
      note: "اختر لغتك المفضلة",
    },
    nav: {
      product: "المنتج",
      features: "الميزات",
      security: "الأمان",
      payments: "الدفع",
      contact: "تواصل معنا",
      install: "تحديثات الإصدار",
    },
    themes: {
      system: { name: "النظام", note: "وفق إعدادات جهازك" },
      light: { name: "فاتح", note: "واضح ومشرق" },
      dark: { name: "داكن", note: "هادئ ومريح" },
      aurora: { name: "الشفق المميز", note: "كحلي داكن · أرجواني" },
      editorial: { name: "سير العمل التحريري", note: "عاجي · أزرق" },
      console: { name: "لوحة العمليات", note: "فحمي · نعناعي" },
      synthwave: { name: "Synthwave", note: "ماجنتا · سماوي" },
    },
    themeMenu: {
      trigger: "السمة",
      title: "سمة العرض",
      note: "اختر المظهر الأنسب لك",
      customTitle: "ألوان مخصصة",
      customNote: "حدّد ألوان علامتك التجارية",
    },
    status: {
      releaseCandidate: "مرشح للإصدار",
      current: "الحالي · BROWSER RC",
      roadmap: "خارطة الطريق",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "معاينة التقاط علامة التبويب الحالية",
    },
    hero: {
      eyebrow: "إضافة CHROME · مرشح للإصدار",
      title: ["التقط علامة التبويب التي تشغّلها صراحة،", "وعاينها واحفظها بأمان."],
      description: [
        "عاين العنوان والرابط والنص أو التحديد بعد إزالة أنماط البيانات الحساسة،",
        "ثم احفظ السجلات المعتمدة في Google Drive appDataFolder بعد OAuth.",
      ],
      primaryAction: "احصل على تحديثات الإصدار",
      secondaryAction: "اعرض النطاق الحالي",
      trust: ["إجراء صريح من المستخدم", "إزالة أنماط حساسة", "Drive بعد الموافقة وOAuth"],
    },
    workspace: {
      sources: ["علامة التبويب الحالية", "النص المحدد", "إزالة الأنماط الحساسة", "Drive · بعد OAuth"],
      userPrompt: "جهّز المحتوى المحدد من علامة التبويب الحالية للمعاينة قبل الحفظ.",
      responseTitle: "تم التقاط علامة التبويب الحالية.",
      responseBody:
        "يُعرض العنوان والرابط والنص أو التحديد مؤقتاً بعد إزالة الأنماط الحساسة. يمكن الحفظ في appDataFolder بعد موافقة منفصلة وإعداد OAuth.",
      nextWork: "الإجراءات المتاحة",
      tasks: ["الموافقة على حفظ Drive", "مراجعة السجلات", "الحذف أو قطع الاتصال"],
      evidenceLabel: "علامة تبويب حالية واحدة",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["كل مراحل العمل،", "في تدفق واحد مترابط"],
      details: "اعرف المزيد",
      cards: [
        {
          label: "BROWSER",
          title: "علامة التبويب التي تشغّلها صراحة",
          description:
            "التقطها عبر شريط الأدوات أو اختصار الالتقاط أو قائمة السياق وعاينها قبل الحفظ.",
        },
        {
          label: "WORKFLOW",
          title: "تكاملات العمل ضمن خارطة الطريق",
          description:
            "أتمتة المستندات والبريد وأدوات العمل غير مضمنة في Browser RC الحالي.",
        },
        {
          label: "MEMORY",
          title: "مكتبة السجلات متاحة الآن وAI Memory ضمن خارطة الطريق",
          description:
            "تصنيفات Source وMemory وResearch وحفظها في Library متاحة حاليًا، أما تحليل AI وRAG والذاكرة التلقائية طويلة الأمد فهي ضمن خارطة الطريق.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["يعمل Browser RC الحالي", "في ثلاث خطوات."],
      description: "يشغّل المستخدم الالتقاط ويوافق على حفظ Drive كلٌ على حدة.",
      steps: [
        {
          number: "01",
          title: "شغّل من علامة التبويب الحالية",
          description: "استخدم شريط الأدوات أو اختصار الالتقاط أو قائمة السياق على علامة التبويب.",
        },
        {
          number: "02",
          title: "عاين ووافق",
          description: "راجع النتيجة بعد إزالة الأنماط الحساسة وقرّر إن كنت تريد حفظها.",
        },
        {
          number: "03",
          title: "احفظ في Drive",
          description: "بعد موافقة منفصلة وOAuth، احفظ السجلات المعتمدة فقط في appDataFolder.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["راجع نطاق التوفر الحالي", "ثم اختر الشراء لمرة واحدة."],
      description:
        "Professional وBusiness منتجان للشراء المسبق قبل الإطلاق الرسمي، بينما حزمة SmartStore منتج رقمي متاح حالياً. تتم معالجة المدفوعات على صفحات PayPal الرسمية.",
      statusLabel: "حالة الدفع",
      status: "شروط ما قبل الإطلاق معروضة",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "شراء مسبق · دفعة واحدة",
          features: [
            "شراء مسبق قبل الإطلاق الرسمي",
            "يتوفر Chrome Extension بعد الإطلاق العام",
            "يُفعّل Google Drive بعد موافقة OAuth",
          ],
          action: "شراء Professional مسبقاً",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "شراء مسبق · دفعة واحدة",
          features: ["يشمل نطاق Professional المسبق", "Business Workspace قيد التطوير", "دعم ذو أولوية عبر البريد الإلكتروني"],
          action: "شراء Business مسبقاً",
        },
        {
          name: "حزمة تشغيل Naver SmartStore",
          price: "USD 29",
          billing: "منتج رقمي · دفعة واحدة",
          features: [
            "تخطيط صفحات المنتجات",
            "عناوين وكلمات بحث ونصوص تسويقية",
            "نصوص دعم وقوائم تحقق ومطالبات AI",
          ],
          action: "شراء حزمة التشغيل",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "مساهمات طوعية لدعم تطوير AIWORK وتوثيقه وتحسين الخدمة ودعم المستخدمين.",
      supportAction: "ادعم عبر PayPal",
      disclaimer:
        "لم يُطرح Professional وBusiness للعامة بعد. سيتوفر Chrome Extension بعد الإطلاق العام، وستتوفر ميزات Google Drive بعد موافقة Google OAuth. قبل الدفع، أكّد نطاق التسليم وموعده عبر cakecnc@daum.net. يتم التحقق من المعاملة وتسليم المنتج أو الترخيص يدوياً؛ احتفظ بإيصال PayPal ومعرّف المعاملة.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["ابدأ مع AIWORK", "حيثما يجري العمل."],
      description: "يتوفر Chrome Extension وتطبيق سطح المكتب قريباً.",
      releaseAlert: "احصل على تحديثات الإطلاق",
      consultation: "تحدث مع فريقنا",
    },
    footer: {
      tagline: "طريقة جديدة لربط الذكاء الاصطناعي بالعمل.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "ألوان مخصصة",
      description: "كيّف AIWORK مع علامتك التجارية.",
      previewTagline: "Work, connected.",
      accent: "اللون الرئيسي",
      secondary: "اللون الثانوي",
      background: "لون الخلفية",
      contrastError:
        "تباين الألوان غير كافٍ. زد الفرق بين الخلفية واللونين الرئيسي والثانوي.",
      reset: "استعادة الإعدادات الافتراضية",
      apply: "تطبيق الألوان",
    },
    aria: {
      home: "الصفحة الرئيسية لـ AIWORK",
      skipToContent: "الانتقال إلى المحتوى الرئيسي",
      mainNavigation: "التنقل الرئيسي",
      close: "إغلاق",
      themeMenu: "قائمة السمات",
      languageMenu: "قائمة اللغات",
      selectTheme: "اختيار سمة {name}",
      selectLanguage: "تغيير اللغة إلى {name}",
      customColorDialog: "إعدادات الألوان المخصصة",
      assistantAvatar: "صورة AIWORK بأسلوب الأنمي",
    },
  },
  es: {
    metadata: {
      title: "AIWORK Browser RC | Captura de la pestaña actual y Drive",
      description:
        "Versión candidata de una extensión de Chrome que captura y previsualiza la pestaña actual invocada por el usuario, y guarda los registros aprobados en Google Drive appDataFolder tras consentimiento y OAuth. El análisis con IA, RAG, correo e integraciones son hoja de ruta.",
    },
    language: {
      trigger: "Idioma",
      title: "Elegir idioma",
      note: "Selecciona tu idioma preferido",
    },
    nav: {
      product: "Producto",
      features: "Funciones",
      security: "Seguridad",
      payments: "Pagos",
      contact: "Contacto",
      install: "Avisos de lanzamiento",
    },
    themes: {
      system: { name: "Sistema", note: "Se adapta a tu dispositivo" },
      light: { name: "Claro", note: "Nítido y luminoso" },
      dark: { name: "Oscuro", note: "Sereno y cómodo" },
      aurora: { name: "Aurora Premium", note: "Azul marino · púrpura" },
      editorial: { name: "Flujo editorial", note: "Marfil · azul" },
      console: { name: "Consola de operaciones", note: "Carbón · menta" },
      synthwave: { name: "Synthwave", note: "Magenta · cian" },
    },
    themeMenu: {
      trigger: "Tema",
      title: "Tema de pantalla",
      note: "Elige el estilo que mejor encaje",
      customTitle: "Colores personalizados",
      customNote: "Define los colores de tu marca",
    },
    status: {
      releaseCandidate: "VERSIÓN CANDIDATA",
      current: "ACTUAL · BROWSER RC",
      roadmap: "HOJA DE RUTA",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "VISTA PREVIA DE LA PESTAÑA ACTUAL",
    },
    hero: {
      eyebrow: "EXTENSIÓN DE CHROME · VERSIÓN CANDIDATA",
      title: ["Captura la pestaña que invocas.", "Previsualízala y guárdala con seguridad."],
      description: [
        "Previsualiza título, URL, cuerpo o selección tras eliminar patrones sensibles,",
        "y guarda registros aprobados en Google Drive appDataFolder después de OAuth.",
      ],
      primaryAction: "Recibir avisos de lanzamiento",
      secondaryAction: "Ver el alcance actual",
      trust: [
        "Acción explícita del usuario",
        "Eliminación de patrones sensibles",
        "Drive tras consentimiento y OAuth",
      ],
    },
    workspace: {
      sources: [
        "Pestaña actual",
        "Texto seleccionado",
        "Eliminación de patrones sensibles",
        "Drive · tras OAuth",
      ],
      userPrompt: "Prepara una vista previa del contenido seleccionado antes de guardarlo.",
      responseTitle: "Se capturó la pestaña actual.",
      responseBody:
        "El título, la URL, el cuerpo o la selección se muestran temporalmente tras eliminar patrones sensibles. Puedes guardar en appDataFolder tras aprobación y OAuth.",
      nextWork: "Acciones disponibles",
      tasks: ["Aprobar guardado en Drive", "Revisar registros", "Eliminar o desconectar"],
      evidenceLabel: "1 pestaña actual",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Cada etapa del trabajo,", "en un único flujo conectado"],
      details: "Más información",
      cards: [
        {
          label: "BROWSER",
          title: "La pestaña actual que invocas",
          description:
            "Captura mediante la barra, el atajo o el menú contextual y previsualiza antes de guardar.",
        },
        {
          label: "WORKFLOW",
          title: "Las integraciones son hoja de ruta",
          description:
            "La automatización de documentos, correo y herramientas no está en el Browser RC actual.",
        },
        {
          label: "MEMORY",
          title: "Library de registros disponible; AI Memory en la hoja de ruta",
          description:
            "Los tipos Source, Memory y Research y su almacenamiento en Library ya están disponibles. El análisis con IA, RAG y la memoria automática a largo plazo siguen en la hoja de ruta.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["El Browser RC actual", "funciona en tres pasos."],
      description: "Invocas la captura y apruebas por separado el guardado en Drive.",
      steps: [
        {
          number: "01",
          title: "Invoca en la pestaña actual",
          description: "Usa la barra, el atajo de captura o el menú contextual en la pestaña.",
        },
        {
          number: "02",
          title: "Previsualiza y aprueba",
          description: "Revisa el resultado tras eliminar patrones sensibles y decide si guardarlo.",
        },
        {
          number: "03",
          title: "Guarda en Drive",
          description: "Tras consentimiento y OAuth, guarda solo registros aprobados en appDataFolder.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["Revisa lo que está disponible", "antes de elegir un pago único."],
      description:
        "Professional y Business son compras anticipadas antes del lanzamiento oficial. El paquete SmartStore es un producto digital disponible actualmente. Los pagos se procesan en las páginas oficiales de PayPal.",
      statusLabel: "Estado del pago",
      status: "Condiciones de prelanzamiento visibles",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "compra anticipada · pago único",
          features: [
            "Compra anticipada antes del lanzamiento",
            "Chrome Extension después del lanzamiento público",
            "Google Drive después de la aprobación OAuth",
          ],
          action: "Reservar Professional",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "compra anticipada · pago único",
          features: [
            "Incluye el alcance anticipado de Professional",
            "Business Workspace está en desarrollo",
            "Soporte prioritario por correo electrónico",
          ],
          action: "Reservar Business",
        },
        {
          name: "Paquete operativo para Naver SmartStore",
          price: "USD 29",
          billing: "producto digital · pago único",
          features: [
            "Planificación de páginas de producto",
            "Títulos, palabras clave y textos de marketing",
            "Guiones de atención, listas de control y prompts de IA",
          ],
          action: "Comprar el paquete operativo",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "Las aportaciones voluntarias apoyan el desarrollo, la documentación, la mejora del servicio y la atención a usuarios de AIWORK.",
      supportAction: "Apoyar con PayPal",
      disclaimer:
        "Professional y Business aún no están disponibles de forma general. Chrome Extension se entregará tras el lanzamiento público y Google Drive tras la aprobación de Google OAuth. Antes de pagar, confirma el alcance y la fecha de entrega en cakecnc@daum.net. La transacción y la entrega del producto o licencia se verifican manualmente; conserva el recibo de PayPal y el ID de la transacción.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["Empieza con AIWORK", "dondequiera que trabajes."],
      description:
        "Chrome Extension y la aplicación de escritorio estarán disponibles próximamente.",
      releaseAlert: "Recibir novedades",
      consultation: "Hablar con el equipo",
    },
    footer: {
      tagline: "Una nueva forma de conectar la IA y el trabajo.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "Colores personalizados",
      description: "Adapta AIWORK a tu marca.",
      previewTagline: "Work, connected.",
      accent: "Color de acento",
      secondary: "Color secundario",
      background: "Color de fondo",
      contrastError:
        "Los colores no tienen suficiente contraste. Aumenta la diferencia entre el fondo y los colores de acento y secundario.",
      reset: "Restaurar valores",
      apply: "Aplicar colores",
    },
    aria: {
      home: "Inicio de AIWORK",
      skipToContent: "Saltar al contenido principal",
      mainNavigation: "Navegación principal",
      close: "Cerrar",
      themeMenu: "Menú de temas",
      languageMenu: "Menú de idiomas",
      selectTheme: "Seleccionar el tema {name}",
      selectLanguage: "Cambiar el idioma a {name}",
      customColorDialog: "Ajustes de colores personalizados",
      assistantAvatar: "Perfil anime de AIWORK",
    },
  },
  fr: {
    metadata: {
      title: "AIWORK Browser RC | Capture de l’onglet actuel et Drive",
      description:
        "Version candidate d’une extension Chrome qui capture et prévisualise l’onglet actuel invoqué par l’utilisateur, puis enregistre les éléments approuvés dans Google Drive appDataFolder après consentement et OAuth. L’analyse IA, RAG, les e-mails et intégrations sont sur la feuille de route.",
    },
    language: {
      trigger: "Langue",
      title: "Choisir la langue",
      note: "Sélectionnez votre langue",
    },
    nav: {
      product: "Produit",
      features: "Fonctionnalités",
      security: "Sécurité",
      payments: "Paiements",
      contact: "Contact",
      install: "Actualités de sortie",
    },
    themes: {
      system: { name: "Système", note: "Suit les réglages de l’appareil" },
      light: { name: "Clair", note: "Net et lumineux" },
      dark: { name: "Sombre", note: "Calme et confortable" },
      aurora: { name: "Aurore Premium", note: "Bleu nuit · violet" },
      editorial: { name: "Workflow éditorial", note: "Ivoire · bleu" },
      console: { name: "Console d’exploitation", note: "Anthracite · menthe" },
      synthwave: { name: "Synthwave", note: "Magenta · cyan" },
    },
    themeMenu: {
      trigger: "Thème",
      title: "Thème d’affichage",
      note: "Choisissez le style qui vous convient",
      customTitle: "Couleurs personnalisées",
      customNote: "Définissez les couleurs de votre marque",
    },
    status: {
      releaseCandidate: "VERSION CANDIDATE",
      current: "ACTUEL · BROWSER RC",
      roadmap: "FEUILLE DE ROUTE",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "APERÇU DE L’ONGLET ACTUEL",
    },
    hero: {
      eyebrow: "EXTENSION CHROME · VERSION CANDIDATE",
      title: ["Capturez l’onglet que vous invoquez.", "Prévisualisez et stockez en sécurité."],
      description: [
        "Prévisualisez titre, URL, corps ou sélection après suppression des motifs sensibles,",
        "puis enregistrez les éléments approuvés dans appDataFolder après OAuth.",
      ],
      primaryAction: "Recevoir les actualités de sortie",
      secondaryAction: "Voir le périmètre actuel",
      trust: [
        "Action explicite de l’utilisateur",
        "Suppression des motifs sensibles",
        "Drive après consentement et OAuth",
      ],
    },
    workspace: {
      sources: [
        "Onglet actuel",
        "Texte sélectionné",
        "Suppression des motifs sensibles",
        "Drive · après OAuth",
      ],
      userPrompt: "Préparez un aperçu du contenu sélectionné avant l’enregistrement.",
      responseTitle: "L’onglet actuel a été capturé.",
      responseBody:
        "Le titre, l’URL, le corps ou la sélection s’affichent temporairement après suppression des motifs sensibles. L’enregistrement dans appDataFolder nécessite une approbation et OAuth.",
      nextWork: "Actions disponibles",
      tasks: [
        "Approuver l’enregistrement Drive",
        "Vérifier les éléments",
        "Supprimer ou déconnecter",
      ],
      evidenceLabel: "1 onglet actuel",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Chaque étape du travail,", "dans un flux unique et connecté"],
      details: "En savoir plus",
      cards: [
        {
          label: "BROWSER",
          title: "L’onglet actuel que vous invoquez",
          description:
            "Capturez via la barre, le raccourci ou le menu contextuel, puis prévisualisez avant d’enregistrer.",
        },
        {
          label: "WORKFLOW",
          title: "Les intégrations sont sur la feuille de route",
          description:
            "L’automatisation des documents, e-mails et outils n’est pas incluse dans le Browser RC actuel.",
        },
        {
          label: "MEMORY",
          title: "Library de dossiers disponible, AI Memory en feuille de route",
          description:
            "Les catégories Source, Memory et Research et leur stockage dans Library sont disponibles. L’analyse IA, RAG et la mémoire automatique durable restent sur la feuille de route.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Le Browser RC actuel", "fonctionne en trois étapes."],
      description:
        "Vous invoquez la capture et approuvez séparément l’enregistrement Drive.",
      steps: [
        {
          number: "01",
          title: "Invoquez sur l’onglet actuel",
          description: "Utilisez la barre, le raccourci de capture ou le menu contextuel de l’onglet.",
        },
        {
          number: "02",
          title: "Prévisualisez et approuvez",
          description: "Vérifiez le résultat après suppression des motifs sensibles et décidez de l’enregistrer.",
        },
        {
          number: "03",
          title: "Enregistrez dans Drive",
          description: "Après consentement et OAuth, enregistrez uniquement les éléments approuvés dans appDataFolder.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["Vérifiez ce qui est disponible", "avant de choisir un paiement unique."],
      description:
        "Professional et Business sont des préachats avant leur lancement officiel. Le pack SmartStore est un produit numérique actuellement disponible. Les paiements sont traités sur les pages officielles de PayPal.",
      statusLabel: "État du paiement",
      status: "Conditions de prélancement affichées",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "préachat · paiement unique",
          features: [
            "Préachat avant le lancement officiel",
            "Chrome Extension après le lancement public",
            "Google Drive après l’approbation OAuth",
          ],
          action: "Préacheter Professional",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "préachat · paiement unique",
          features: [
            "Inclut le périmètre de préachat Professional",
            "Business Workspace est en développement",
            "Support prioritaire par e-mail",
          ],
          action: "Préacheter Business",
        },
        {
          name: "Pack opérationnel Naver SmartStore",
          price: "USD 29",
          billing: "produit numérique · paiement unique",
          features: [
            "Planification des pages produit",
            "Titres, mots-clés et textes marketing",
            "Scripts de support, listes de contrôle et prompts IA",
          ],
          action: "Acheter le pack opérationnel",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "Les contributions volontaires soutiennent le développement, la documentation, l’amélioration du service et l’assistance aux utilisateurs d’AIWORK.",
      supportAction: "Soutenir via PayPal",
      disclaimer:
        "Professional et Business ne sont pas encore disponibles au public. Chrome Extension sera fourni après le lancement public et Google Drive après l’approbation Google OAuth. Avant de payer, confirmez le périmètre et le calendrier de livraison à cakecnc@daum.net. La transaction et la livraison du produit ou de la licence sont vérifiées manuellement ; conservez votre reçu PayPal et l’identifiant de transaction.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["Démarrez AIWORK", "là où le travail se fait."],
      description:
        "Chrome Extension et l’application de bureau seront bientôt disponibles.",
      releaseAlert: "Recevoir les actualités",
      consultation: "Parler à notre équipe",
    },
    footer: {
      tagline: "Une nouvelle façon de relier l’IA et le travail.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "Couleurs personnalisées",
      description: "Adaptez AIWORK à votre marque.",
      previewTagline: "Work, connected.",
      accent: "Couleur d’accent",
      secondary: "Couleur secondaire",
      background: "Couleur d’arrière-plan",
      contrastError:
        "Le contraste est insuffisant. Augmentez l’écart entre l’arrière-plan et les couleurs d’accent et secondaire.",
      reset: "Rétablir les valeurs",
      apply: "Appliquer les couleurs",
    },
    aria: {
      home: "Accueil AIWORK",
      skipToContent: "Aller au contenu principal",
      mainNavigation: "Navigation principale",
      close: "Fermer",
      themeMenu: "Menu des thèmes",
      languageMenu: "Menu des langues",
      selectTheme: "Sélectionner le thème {name}",
      selectLanguage: "Passer la langue à {name}",
      customColorDialog: "Réglages des couleurs personnalisées",
      assistantAvatar: "Profil anime AIWORK",
    },
  },
  de: {
    metadata: {
      title: "AIWORK Browser RC | Aktuellen Tab erfassen und in Drive speichern",
      description:
        "Release Candidate einer Chrome-Erweiterung, die den ausdrücklich ausgelösten aktuellen Tab erfasst und voranzeigt und freigegebene Einträge nach Zustimmung und OAuth in Google Drive appDataFolder speichert. KI-Analyse, RAG, E-Mail und Tool-Integrationen sind Roadmap.",
    },
    language: {
      trigger: "Sprache",
      title: "Sprache wählen",
      note: "Wählen Sie Ihre bevorzugte Sprache",
    },
    nav: {
      product: "Produkt",
      features: "Funktionen",
      security: "Sicherheit",
      payments: "Zahlungen",
      contact: "Kontakt",
      install: "Release-Updates",
    },
    themes: {
      system: { name: "System", note: "Folgt den Geräteeinstellungen" },
      light: { name: "Hell", note: "Klar und freundlich" },
      dark: { name: "Dunkel", note: "Ruhig und angenehm" },
      aurora: { name: "Premium Aurora", note: "Dunkelblau · Violett" },
      editorial: { name: "Redaktions-Workflow", note: "Elfenbein · Blau" },
      console: { name: "Betriebskonsole", note: "Anthrazit · Mint" },
      synthwave: { name: "Synthwave", note: "Magenta · Cyan" },
    },
    themeMenu: {
      trigger: "Design",
      title: "Anzeige-Design",
      note: "Wählen Sie den passenden Stil",
      customTitle: "Eigene Farben",
      customNote: "Legen Sie Ihre Markenfarben fest",
    },
    status: {
      releaseCandidate: "RELEASE CANDIDATE",
      current: "AKTUELL · BROWSER RC",
      roadmap: "ROADMAP",
      productVision: "AIWORK BROWSER / RC",
      browserCapture: "VORSCHAU DES AKTUELLEN TABS",
    },
    hero: {
      eyebrow: "CHROME-ERWEITERUNG · RELEASE CANDIDATE",
      title: [
        "Erfassen Sie den Tab, den Sie auslösen.",
        "Sicher voranzeigen und speichern.",
      ],
      description: [
        "Titel, URL, Text oder Auswahl nach Entfernung sensibler Muster voranzeigen,",
        "dann freigegebene Einträge nach OAuth in Google Drive appDataFolder speichern.",
      ],
      primaryAction: "Release-Updates erhalten",
      secondaryAction: "Aktuellen Umfang ansehen",
      trust: [
        "Explizite Nutzeraktion",
        "Entfernung sensibler Muster",
        "Drive nach Zustimmung und OAuth",
      ],
    },
    workspace: {
      sources: [
        "Aktueller Tab",
        "Ausgewählter Text",
        "Entfernung sensibler Muster",
        "Drive · nach OAuth",
      ],
      userPrompt: "Bereiten Sie den ausgewählten Inhalt vor dem Speichern als Vorschau vor.",
      responseTitle: "Der aktuelle Tab wurde erfasst.",
      responseBody:
        "Titel, URL, Text oder Auswahl werden nach Entfernung sensibler Muster vorübergehend angezeigt. Das Speichern in appDataFolder erfordert Freigabe und OAuth.",
      nextWork: "Verfügbare Aktionen",
      tasks: [
        "Drive-Speicherung freigeben",
        "Einträge prüfen",
        "Löschen oder trennen",
      ],
      evidenceLabel: "1 aktueller Tab",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Jeder Arbeitsschritt", "in einem vernetzten Ablauf"],
      details: "Mehr erfahren",
      cards: [
        {
          label: "BROWSER",
          title: "Der ausdrücklich ausgelöste aktuelle Tab",
          description:
            "Über Symbolleiste, Erfassungs-Shortcut oder Kontextmenü erfassen und vor dem Speichern prüfen.",
        },
        {
          label: "WORKFLOW",
          title: "Arbeitsintegrationen sind Roadmap",
          description:
            "Dokument-, E-Mail- und Tool-Automatisierung ist im aktuellen Browser RC nicht enthalten.",
        },
        {
          label: "MEMORY",
          title: "Datensatz-Library verfügbar, AI Memory bleibt Roadmap",
          description:
            "Source-, Memory- und Research-Kategorien mit Library-Speicherung sind verfügbar. KI-Analyse, RAG und automatisches Langzeit-Memory bleiben auf der Roadmap.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Der aktuelle Browser RC", "arbeitet in drei Schritten."],
      description:
        "Sie lösen die Erfassung aus und genehmigen die Drive-Speicherung separat.",
      steps: [
        {
          number: "01",
          title: "Im aktuellen Tab auslösen",
          description: "Symbolleiste, Erfassungs-Shortcut oder Kontextmenü des Tabs verwenden.",
        },
        {
          number: "02",
          title: "Vorschau und Freigabe",
          description: "Ergebnis nach Entfernung sensibler Muster prüfen und über das Speichern entscheiden.",
        },
        {
          number: "03",
          title: "In Drive speichern",
          description: "Nach Zustimmung und OAuth nur freigegebene Einträge in appDataFolder speichern.",
        },
      ],
    },
    payments: {
      eyebrow: "GLOBAL PAYMENTS",
      title: ["Prüfen Sie den aktuellen Umfang", "vor der Einmalzahlung."],
      description:
        "Professional und Business sind Vorabkäufe vor der offiziellen Veröffentlichung. Das SmartStore-Paket ist ein derzeit verfügbares Digitalprodukt. Zahlungen werden auf den offiziellen PayPal-Seiten verarbeitet.",
      statusLabel: "Zahlungsstatus",
      status: "Vorabbedingungen werden angezeigt",
      products: [
        {
          name: "AIWORK Professional",
          price: "USD 19",
          billing: "Vorabkauf · Einmalzahlung",
          features: [
            "Vorabkauf vor der Veröffentlichung",
            "Chrome Extension nach öffentlicher Veröffentlichung",
            "Google Drive nach OAuth-Genehmigung",
          ],
          action: "Professional vorab kaufen",
        },
        {
          name: "AIWORK Business",
          price: "USD 49",
          billing: "Vorabkauf · Einmalzahlung",
          features: [
            "Umfasst den Professional-Vorabumfang",
            "Business Workspace ist in Entwicklung",
            "Bevorzugter Support per E-Mail",
          ],
          action: "Business vorab kaufen",
        },
        {
          name: "Naver SmartStore Praxispaket",
          price: "USD 29",
          billing: "Digitalprodukt · Einmalzahlung",
          features: [
            "Planung von Produktseiten",
            "Titel, Suchbegriffe und Marketingtexte",
            "Supportvorlagen, Checklisten und KI-Prompts",
          ],
          action: "Praxispaket kaufen",
        },
      ],
      supportTitle: "Support AIWORK",
      supportDescription:
        "Freiwillige Beiträge unterstützen die Entwicklung, Dokumentation, Serviceverbesserung und Nutzerbetreuung von AIWORK.",
      supportAction: "Mit PayPal unterstützen",
      disclaimer:
        "Professional und Business sind noch nicht allgemein verfügbar. Chrome Extension wird nach der öffentlichen Veröffentlichung, Google Drive nach der Google-OAuth-Genehmigung bereitgestellt. Bestätigen Sie vor der Zahlung Umfang und Termin unter cakecnc@daum.net. Transaktion und Produkt- oder Lizenzbereitstellung werden manuell geprüft; bewahren Sie PayPal-Beleg und Transaktions-ID auf.",
    },
    cta: {
      eyebrow: "AIWORK BROWSER",
      title: ["Starten Sie AIWORK", "direkt dort, wo Sie arbeiten."],
      description: "Chrome Extension und Desktop-App sind in Vorbereitung.",
      releaseAlert: "Release-Updates erhalten",
      consultation: "Mit unserem Team sprechen",
    },
    footer: {
      tagline: "Eine neue Art, KI und Arbeit zu verbinden.",
      copyright: "© 2026 AIWORK. All rights reserved.",
    },
    customColors: {
      eyebrow: "COLOR LAB",
      title: "Eigene Farben",
      description: "Passen Sie AIWORK an Ihre Marke an.",
      previewTagline: "Work, connected.",
      accent: "Akzentfarbe",
      secondary: "Sekundärfarbe",
      background: "Hintergrundfarbe",
      contrastError:
        "Der Farbkontrast ist zu gering. Vergrößern Sie den Unterschied zwischen Hintergrund, Akzent- und Sekundärfarbe.",
      reset: "Standard wiederherstellen",
      apply: "Farben anwenden",
    },
    aria: {
      home: "AIWORK-Startseite",
      skipToContent: "Zum Hauptinhalt springen",
      mainNavigation: "Hauptnavigation",
      close: "Schließen",
      themeMenu: "Designmenü",
      languageMenu: "Sprachmenü",
      selectTheme: "Design {name} auswählen",
      selectLanguage: "Sprache zu {name} wechseln",
      customColorDialog: "Einstellungen für eigene Farben",
      assistantAvatar: "AIWORK-Animeprofil",
    },
  },
};
