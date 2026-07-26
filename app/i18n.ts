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

type MessageSet = {
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
    reset: string;
    apply: string;
  };
  aria: {
    home: string;
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
      title: "AIWORK | AI와 업무를 연결하는 지능형 업무 플랫폼",
      description:
        "AIWORK는 웹, 문서, 이메일과 업무 도구를 연결해 조사부터 제작·검토까지 더 빠르게 완성하는 AI 업무 플랫폼입니다.",
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
      install: "설치하기",
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
    hero: {
      eyebrow: "AI 업무의 새로운 기준",
      title: ["흩어진 업무를 연결하고,", "생각을 결과로."],
      description: [
        "AIWORK는 웹, 문서, 이메일과 업무 도구를 하나로 연결해",
        "조사부터 제작, 검토까지 더 빠르고 명확하게 완성합니다.",
      ],
      primaryAction: "AIWORK 시작하기",
      secondaryAction: "서비스 알아보기",
      trust: ["사용자 승인 중심", "선택한 자료만 연결", "다국어 지원 인터페이스"],
    },
    workspace: {
      sources: ["웹페이지 조사", "Google Drive", "업무 이메일", "프로젝트 문서"],
      userPrompt: "이 자료를 바탕으로 시장 기회와 다음 실행안을 정리해줘.",
      responseTitle: "핵심 기회 3가지를 확인했습니다.",
      responseBody:
        "자료의 근거를 연결해 우선순위, 위험 요소, 바로 실행할 작업으로 나누어 정리하겠습니다.",
      nextWork: "다음 작업",
      tasks: ["시장조사 보고서", "제안서 초안", "실행 체크리스트"],
      evidenceLabel: "근거 자료",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["업무의 모든 순간을", "하나의 흐름으로"],
      details: "자세히 보기",
      cards: [
        {
          label: "BROWSER",
          title: "보고 있는 화면에서 바로",
          description:
            "웹페이지를 읽고, 핵심을 정리하고, 다음 업무를 사이드 패널에서 이어갑니다.",
        },
        {
          label: "WORKFLOW",
          title: "반복 업무를 하나의 흐름으로",
          description:
            "조사, 문서, 이미지, 검토와 승인까지 업무 단계를 끊김 없이 연결합니다.",
        },
        {
          label: "MEMORY",
          title: "자료가 쌓일수록 더 정확하게",
          description:
            "사용자가 선택한 자료와 결정 사항을 업무 맥락으로 정리해 다시 활용합니다.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["복잡한 업무도", "세 단계면 충분합니다."],
      description: "연결 범위와 실행 단계를 사용자가 직접 확인하고 결정합니다.",
      steps: [
        {
          number: "01",
          title: "자료 연결",
          description: "웹, 문서, 이메일과 필요한 업무 자료를 선택합니다.",
        },
        {
          number: "02",
          title: "AIWORK 실행",
          description: "목표에 맞는 분석과 제작 워크플로를 시작합니다.",
        },
        {
          number: "03",
          title: "검토·완성",
          description: "근거와 결과를 확인하고 다음 작업으로 연결합니다.",
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
      reset: "기본값 복원",
      apply: "컬러 적용하기",
    },
    aria: {
      home: "AIWORK 홈",
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
      title: "AIWORK | Connected AI for Modern Work",
      description:
        "AIWORK connects the web, documents, email, and work tools so teams can move faster from research to creation and review.",
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
      install: "Install",
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
    hero: {
      eyebrow: "A NEW STANDARD FOR AI WORK",
      title: ["Connect scattered work.", "Turn ideas into outcomes."],
      description: [
        "AIWORK brings the web, documents, email, and work tools together",
        "so research, creation, and review move faster and stay clear.",
      ],
      primaryAction: "Get started with AIWORK",
      secondaryAction: "Explore the service",
      trust: ["User approval first", "Only selected sources connect", "Multilingual interface"],
    },
    workspace: {
      sources: ["Web research", "Google Drive", "Work email", "Project documents"],
      userPrompt:
        "Using these materials, summarize the market opportunities and recommended next actions.",
      responseTitle: "I found three key opportunities.",
      responseBody:
        "I’ll link each insight to its source and organize the result into priorities, risks, and actions you can take now.",
      nextWork: "Next actions",
      tasks: ["Market research report", "Proposal draft", "Action checklist"],
      evidenceLabel: "Evidence sources",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Every step of work,", "in one connected flow"],
      details: "Learn more",
      cards: [
        {
          label: "BROWSER",
          title: "Work right where you browse",
          description:
            "Read pages, capture the essentials, and continue the task from the side panel.",
        },
        {
          label: "WORKFLOW",
          title: "Turn repeat work into one flow",
          description:
            "Connect research, documents, images, review, and approval in one continuous flow.",
        },
        {
          label: "MEMORY",
          title: "Smarter with every source",
          description: "Turn selected sources and decisions into reusable work context.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Complex work,", "simplified in three steps."],
      description: "You stay in control of what connects and what each workflow executes.",
      steps: [
        {
          number: "01",
          title: "Connect sources",
          description: "Choose the web, documents, email, and work sources you need.",
        },
        {
          number: "02",
          title: "Run AIWORK",
          description: "Start the analysis and creation workflow for your goal.",
        },
        {
          number: "03",
          title: "Review and complete",
          description: "Verify the evidence and results, then move to the next task.",
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
      reset: "Restore defaults",
      apply: "Apply colors",
    },
    aria: {
      home: "AIWORK home",
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
      title: "AIWORK｜AIと業務をつなぐワークプラットフォーム",
      description:
        "AIWORKはWeb、文書、メール、業務ツールをつなぎ、調査から制作・レビューまでをより速く明確に進めるAIワークプラットフォームです。",
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
      install: "インストール",
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
    hero: {
      eyebrow: "AIワークの新しいスタンダード",
      title: ["散らばる業務をつなぎ、", "思考を成果へ。"],
      description: [
        "AIWORKはWeb、文書、メール、業務ツールをひとつにつなぎ、",
        "調査から制作、レビューまでをより速く明確に進めます。",
      ],
      primaryAction: "AIWORKを始める",
      secondaryAction: "サービスを見る",
      trust: ["ユーザー確認を最優先", "選択した資料だけを接続", "多言語インターフェース"],
    },
    workspace: {
      sources: ["Webページ調査", "Google Drive", "業務メール", "プロジェクト文書"],
      userPrompt: "この資料をもとに、市場機会と次の実行案をまとめてください。",
      responseTitle: "3つの重要な機会を確認しました。",
      responseBody:
        "資料の根拠を結び付け、優先順位、リスク、すぐに実行できる作業に分けて整理します。",
      nextWork: "次の作業",
      tasks: ["市場調査レポート", "提案書ドラフト", "実行チェックリスト"],
      evidenceLabel: "根拠資料",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["仕事のすべての瞬間を", "ひとつの流れに"],
      details: "詳しく見る",
      cards: [
        {
          label: "BROWSER",
          title: "見ている画面から、そのまま",
          description:
            "ページを読み、要点を整理し、次の作業をサイドパネルで続けられます。",
        },
        {
          label: "WORKFLOW",
          title: "繰り返す業務をひとつの流れに",
          description:
            "調査、文書、画像、レビュー、承認までを途切れなくつなぎます。",
        },
        {
          label: "MEMORY",
          title: "資料が増えるほど、より的確に",
          description:
            "選んだ資料と意思決定を業務コンテキストとして整理し、再活用します。",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["複雑な業務も", "3ステップで完結。"],
      description: "接続範囲と実行ステップは、ユーザーが確認して決定します。",
      steps: [
        {
          number: "01",
          title: "資料を接続",
          description: "Web、文書、メールから必要な業務資料を選びます。",
        },
        {
          number: "02",
          title: "AIWORKを実行",
          description: "目的に合った分析・制作ワークフローを開始します。",
        },
        {
          number: "03",
          title: "確認・完成",
          description: "根拠と成果を確認し、次の作業へつなげます。",
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
      reset: "初期設定に戻す",
      apply: "カラーを適用",
    },
    aria: {
      home: "AIWORKホーム",
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
      title: "AIWORK｜连接 AI 与工作的智能平台",
      description:
        "AIWORK 连接网页、文档、电子邮件与工作工具，帮助团队更快、更清晰地完成调研、创作与审核。",
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
      install: "安装",
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
    hero: {
      eyebrow: "AI 工作的新标准",
      title: ["连接分散的工作，", "让想法成为成果。"],
      description: [
        "AIWORK 将网页、文档、电子邮件和工作工具连接在一起，",
        "让调研、创作与审核更快、更清晰地完成。",
      ],
      primaryAction: "开始使用 AIWORK",
      secondaryAction: "了解服务",
      trust: ["以用户确认为中心", "仅连接所选资料", "多语言界面"],
    },
    workspace: {
      sources: ["网页调研", "Google Drive", "工作邮件", "项目文档"],
      userPrompt: "请根据这些资料，梳理市场机会和下一步行动方案。",
      responseTitle: "已发现三个关键机会。",
      responseBody: "我会关联资料依据，并按优先级、风险和可立即执行的任务进行整理。",
      nextWork: "下一步工作",
      tasks: ["市场调研报告", "提案初稿", "执行清单"],
      evidenceLabel: "依据资料",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["让工作的每个环节", "汇入同一流程"],
      details: "了解详情",
      cards: [
        {
          label: "BROWSER",
          title: "就在浏览的页面中开始",
          description: "读取网页、提炼重点，并在侧边面板中继续下一步工作。",
        },
        {
          label: "WORKFLOW",
          title: "将重复工作连成一个流程",
          description: "从调研、文档、图像到审核和批准，让每个环节顺畅衔接。",
        },
        {
          label: "MEMORY",
          title: "资料越丰富，结果越精准",
          description: "将所选资料与决策整理成可复用的工作上下文。",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["复杂工作", "三步即可完成。"],
      description: "连接范围和执行步骤均由用户亲自确认和决定。",
      steps: [
        {
          number: "01",
          title: "连接资料",
          description: "从网页、文档和电子邮件中选择所需的工作资料。",
        },
        {
          number: "02",
          title: "运行 AIWORK",
          description: "启动符合目标的分析与创作工作流。",
        },
        {
          number: "03",
          title: "审核并完成",
          description: "核对依据与结果，再衔接下一项工作。",
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
      reset: "恢复默认",
      apply: "应用颜色",
    },
    aria: {
      home: "AIWORK 首页",
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
      title: "AIWORK | منصة ذكية تربط الذكاء الاصطناعي بالعمل",
      description:
        "يربط AIWORK الويب والمستندات والبريد الإلكتروني وأدوات العمل، ليساعد الفرق على إنجاز البحث والإنتاج والمراجعة بسرعة ووضوح أكبر.",
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
      install: "تثبيت",
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
    hero: {
      eyebrow: "معيار جديد للعمل بالذكاء الاصطناعي",
      title: ["اربط أعمالك المتفرقة،", "وحوّل الأفكار إلى نتائج."],
      description: [
        "يجمع AIWORK الويب والمستندات والبريد الإلكتروني وأدوات العمل،",
        "لتنجز البحث والإنتاج والمراجعة بسرعة ووضوح أكبر.",
      ],
      primaryAction: "ابدأ مع AIWORK",
      secondaryAction: "استكشف الخدمة",
      trust: ["موافقة المستخدم أولاً", "ربط المصادر المحددة فقط", "واجهة متعددة اللغات"],
    },
    workspace: {
      sources: ["بحث الويب", "Google Drive", "بريد العمل", "مستندات المشروع"],
      userPrompt:
        "استناداً إلى هذه المواد، لخّص فرص السوق والإجراءات التالية الموصى بها.",
      responseTitle: "حددت ثلاث فرص رئيسية.",
      responseBody:
        "سأربط كل نتيجة بمصدرها، ثم أنظمها حسب الأولويات والمخاطر والإجراءات القابلة للتنفيذ فوراً.",
      nextWork: "الإجراءات التالية",
      tasks: ["تقرير أبحاث السوق", "مسودة عرض", "قائمة تنفيذ"],
      evidenceLabel: "مصادر الأدلة",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["كل مراحل العمل،", "في تدفق واحد مترابط"],
      details: "اعرف المزيد",
      cards: [
        {
          label: "BROWSER",
          title: "اعمل مباشرة من صفحة التصفح",
          description:
            "اقرأ الصفحات، واستخلص أهم النقاط، وتابع المهمة من اللوحة الجانبية.",
        },
        {
          label: "WORKFLOW",
          title: "حوّل العمل المتكرر إلى تدفق واحد",
          description:
            "اربط البحث والمستندات والصور والمراجعة والموافقة في مسار متواصل.",
        },
        {
          label: "MEMORY",
          title: "دقة أكبر مع كل مصدر",
          description:
            "حوّل المصادر والقرارات المحددة إلى سياق عمل قابل لإعادة الاستخدام.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["بسّط الأعمال المعقدة", "في ثلاث خطوات."],
      description: "تبقى متحكماً في المصادر المتصلة وما ينفذه كل سير عمل.",
      steps: [
        {
          number: "01",
          title: "اربط المصادر",
          description:
            "اختر ما تحتاجه من الويب والمستندات والبريد الإلكتروني ومصادر العمل.",
        },
        {
          number: "02",
          title: "شغّل AIWORK",
          description: "ابدأ سير التحليل والإنتاج المناسب لهدفك.",
        },
        {
          number: "03",
          title: "راجع وأكمل",
          description: "تحقق من الأدلة والنتائج، ثم انتقل إلى المهمة التالية.",
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
      reset: "استعادة الإعدادات الافتراضية",
      apply: "تطبيق الألوان",
    },
    aria: {
      home: "الصفحة الرئيسية لـ AIWORK",
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
      title: "AIWORK | IA conectada para el trabajo moderno",
      description:
        "AIWORK conecta la web, los documentos, el correo y las herramientas de trabajo para agilizar la investigación, la creación y la revisión.",
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
      install: "Instalar",
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
    hero: {
      eyebrow: "UN NUEVO ESTÁNDAR PARA EL TRABAJO CON IA",
      title: ["Conecta el trabajo disperso.", "Convierte ideas en resultados."],
      description: [
        "AIWORK reúne la web, los documentos, el correo y las herramientas de trabajo",
        "para agilizar la investigación, la creación y la revisión.",
      ],
      primaryAction: "Empezar con AIWORK",
      secondaryAction: "Explorar el servicio",
      trust: [
        "Aprobación del usuario primero",
        "Solo se conectan las fuentes elegidas",
        "Interfaz multilingüe",
      ],
    },
    workspace: {
      sources: [
        "Investigación web",
        "Google Drive",
        "Correo de trabajo",
        "Documentos del proyecto",
      ],
      userPrompt:
        "Con estos materiales, resume las oportunidades de mercado y las próximas acciones recomendadas.",
      responseTitle: "He encontrado tres oportunidades clave.",
      responseBody:
        "Vincularé cada conclusión con su fuente y organizaré el resultado por prioridades, riesgos y acciones inmediatas.",
      nextWork: "Próximas acciones",
      tasks: ["Informe de mercado", "Borrador de propuesta", "Lista de acciones"],
      evidenceLabel: "Fuentes de evidencia",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Cada etapa del trabajo,", "en un único flujo conectado"],
      details: "Más información",
      cards: [
        {
          label: "BROWSER",
          title: "Trabaja donde navegas",
          description:
            "Lee páginas, extrae lo esencial y continúa la tarea desde el panel lateral.",
        },
        {
          label: "WORKFLOW",
          title: "Unifica el trabajo repetitivo",
          description:
            "Conecta investigación, documentos, imágenes, revisión y aprobación en un flujo continuo.",
        },
        {
          label: "MEMORY",
          title: "Más precisión con cada fuente",
          description:
            "Convierte las fuentes y decisiones seleccionadas en contexto de trabajo reutilizable.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Trabajo complejo,", "simplificado en tres pasos."],
      description: "Tú decides qué se conecta y qué ejecuta cada flujo de trabajo.",
      steps: [
        {
          number: "01",
          title: "Conecta las fuentes",
          description:
            "Elige la web, los documentos, el correo y las fuentes de trabajo que necesites.",
        },
        {
          number: "02",
          title: "Ejecuta AIWORK",
          description:
            "Inicia el flujo de análisis y creación adecuado para tu objetivo.",
        },
        {
          number: "03",
          title: "Revisa y finaliza",
          description:
            "Verifica las evidencias y los resultados antes de pasar a la siguiente tarea.",
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
      reset: "Restaurar valores",
      apply: "Aplicar colores",
    },
    aria: {
      home: "Inicio de AIWORK",
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
      title: "AIWORK | L’IA connectée au travail moderne",
      description:
        "AIWORK relie le web, les documents, les e-mails et les outils de travail pour accélérer la recherche, la création et la validation.",
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
      install: "Installer",
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
    hero: {
      eyebrow: "UNE NOUVELLE NORME POUR LE TRAVAIL AVEC L’IA",
      title: ["Reliez vos tâches dispersées.", "Transformez les idées en résultats."],
      description: [
        "AIWORK réunit le web, les documents, les e-mails et les outils de travail",
        "pour accélérer la recherche, la création et la validation.",
      ],
      primaryAction: "Démarrer avec AIWORK",
      secondaryAction: "Découvrir le service",
      trust: [
        "Validation de l’utilisateur d’abord",
        "Connexion des seules sources choisies",
        "Interface multilingue",
      ],
    },
    workspace: {
      sources: [
        "Recherche web",
        "Google Drive",
        "E-mail professionnel",
        "Documents du projet",
      ],
      userPrompt:
        "À partir de ces éléments, résumez les opportunités de marché et les prochaines actions recommandées.",
      responseTitle: "J’ai identifié trois opportunités clés.",
      responseBody:
        "Je relierai chaque conclusion à sa source, puis organiserai le résultat par priorités, risques et actions immédiates.",
      nextWork: "Prochaines actions",
      tasks: [
        "Rapport d’étude de marché",
        "Projet de proposition",
        "Liste d’actions",
      ],
      evidenceLabel: "Sources probantes",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Chaque étape du travail,", "dans un flux unique et connecté"],
      details: "En savoir plus",
      cards: [
        {
          label: "BROWSER",
          title: "Travaillez là où vous naviguez",
          description:
            "Lisez les pages, retenez l’essentiel et poursuivez la tâche depuis le panneau latéral.",
        },
        {
          label: "WORKFLOW",
          title: "Unifiez les tâches répétitives",
          description:
            "Reliez recherche, documents, images, validation et approbation dans un flux continu.",
        },
        {
          label: "MEMORY",
          title: "Plus précis à chaque source",
          description:
            "Transformez les sources et décisions sélectionnées en contexte de travail réutilisable.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Le travail complexe,", "simplifié en trois étapes."],
      description:
        "Vous gardez le contrôle sur les connexions et les actions de chaque workflow.",
      steps: [
        {
          number: "01",
          title: "Connectez les sources",
          description:
            "Choisissez les sources web, les documents, les e-mails et les outils nécessaires.",
        },
        {
          number: "02",
          title: "Lancez AIWORK",
          description:
            "Démarrez le workflow d’analyse et de création adapté à votre objectif.",
        },
        {
          number: "03",
          title: "Validez et finalisez",
          description:
            "Vérifiez les preuves et les résultats, puis passez à la tâche suivante.",
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
      reset: "Rétablir les valeurs",
      apply: "Appliquer les couleurs",
    },
    aria: {
      home: "Accueil AIWORK",
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
      title: "AIWORK | Vernetzte KI für moderne Arbeit",
      description:
        "AIWORK verbindet Web, Dokumente, E-Mail und Arbeitstools, damit Teams schneller von Recherche zu Erstellung und Prüfung gelangen.",
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
      install: "Installieren",
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
    hero: {
      eyebrow: "EIN NEUER STANDARD FÜR KI-GESTÜTZTE ARBEIT",
      title: [
        "Verteilen Sie Arbeit nicht länger.",
        "Machen Sie Ideen zu Ergebnissen.",
      ],
      description: [
        "AIWORK vereint Web, Dokumente, E-Mail und Arbeitstools,",
        "damit Recherche, Erstellung und Prüfung schneller und klarer werden.",
      ],
      primaryAction: "Mit AIWORK starten",
      secondaryAction: "Service entdecken",
      trust: [
        "Nutzerfreigabe zuerst",
        "Nur ausgewählte Quellen werden verbunden",
        "Mehrsprachige Oberfläche",
      ],
    },
    workspace: {
      sources: [
        "Webrecherche",
        "Google Drive",
        "Geschäftliche E-Mail",
        "Projektdokumente",
      ],
      userPrompt:
        "Fassen Sie anhand dieser Unterlagen die Marktchancen und empfohlenen nächsten Schritte zusammen.",
      responseTitle: "Ich habe drei zentrale Chancen identifiziert.",
      responseBody:
        "Ich verknüpfe jede Erkenntnis mit ihrer Quelle und ordne das Ergebnis nach Prioritäten, Risiken und sofort umsetzbaren Maßnahmen.",
      nextWork: "Nächste Schritte",
      tasks: [
        "Marktforschungsbericht",
        "Angebotsentwurf",
        "Maßnahmen-Checkliste",
      ],
      evidenceLabel: "Belegquellen",
    },
    features: {
      eyebrow: "CONNECTED INTELLIGENCE",
      title: ["Jeder Arbeitsschritt", "in einem vernetzten Ablauf"],
      details: "Mehr erfahren",
      cards: [
        {
          label: "BROWSER",
          title: "Arbeiten Sie direkt beim Browsen",
          description:
            "Lesen Sie Seiten, erfassen Sie das Wesentliche und setzen Sie die Aufgabe im Seitenpanel fort.",
        },
        {
          label: "WORKFLOW",
          title: "Wiederkehrende Arbeit in einem Ablauf",
          description:
            "Verbinden Sie Recherche, Dokumente, Bilder, Prüfung und Freigabe ohne Unterbrechung.",
        },
        {
          label: "MEMORY",
          title: "Präziser mit jeder Quelle",
          description:
            "Machen Sie ausgewählte Quellen und Entscheidungen zu wiederverwendbarem Arbeitskontext.",
        },
      ],
    },
    workflow: {
      eyebrow: "HOW IT WORKS",
      title: ["Komplexe Arbeit,", "vereinfacht in drei Schritten."],
      description:
        "Sie bestimmen, was verbunden wird und was jeder Workflow ausführt.",
      steps: [
        {
          number: "01",
          title: "Quellen verbinden",
          description:
            "Wählen Sie benötigte Webinhalte, Dokumente, E-Mails und Arbeitsquellen aus.",
        },
        {
          number: "02",
          title: "AIWORK ausführen",
          description:
            "Starten Sie den Analyse- und Erstellungsworkflow für Ihr Ziel.",
        },
        {
          number: "03",
          title: "Prüfen und abschließen",
          description:
            "Prüfen Sie Belege und Ergebnisse und wechseln Sie zur nächsten Aufgabe.",
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
      reset: "Standard wiederherstellen",
      apply: "Farben anwenden",
    },
    aria: {
      home: "AIWORK-Startseite",
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
