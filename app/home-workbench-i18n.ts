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
  metadata: {
    title: "AIWORK | AI가 이해하고, AIWORK가 안전하게 실행합니다",
    description:
      "공개된 AIWORK Browser RC와 내부 구현·로컬 검증을 마친 승인 기반 Local Workbench를 소개합니다. 이메일·AI·외부 실행은 별도 활성화 전까지 제공되지 않습니다.",
  },
  brandContext: "safe work orchestration.",
  hero: {
    eyebrow: "AIWORK 제품 비전 · BROWSER RC",
    title: ["AI가 이해하고,", "AIWORK가 안전하게 실행합니다."],
    description:
      "현재 공개 범위는 공식 홈페이지와 사용자 실행형 AIWORK Browser RC입니다. Local Workbench는 구현·로컬 검증을 마친 내부 빌드이며, 이메일·AI·외부 실행은 각각 독립된 활성화 경계로 유지합니다.",
    primaryAction: "작동 방식 보기",
    secondaryAction: "구현 기능 확인",
    trust: ["Browser RC 구현", "Local Workbench 내부 검증", "비밀번호·토큰 저장 안 함"],
  },
  roles: {
    eyebrow: "ONE SAFE WORKFLOW",
    title: "각자가 잘하는 일을 하나의 흐름으로",
    description:
      "AIWORK가 지향하는 후속 구조는 또 하나의 답변 모델이 아니라 사용자, AI 모델, 실제 작업 도구 사이의 안전한 실행 조정자입니다.",
    cards: [
      {
        title: "사용자",
        description: "원하는 결과와 사용할 자료를 정하고, 외부 실행을 최종 승인합니다.",
      },
      {
        title: "선택한 AI 모델",
        description: "질문을 이해하고 추론하며 초안·추천·작업 계획을 만듭니다.",
      },
      {
        title: "AIWORK",
        description: "공개판은 승인된 탭을 수집·저장하고, 내부 Workbench는 자료·근거·승인·결과물·감사를 로컬에서 조정합니다.",
      },
    ],
  },
  workbench: {
    eyebrow: "AIWORK WORKBENCH · INTERNAL VALIDATION",
    status: "Browser RC 공개 범위 · Local Workbench 구현·로컬 검증",
    contextTitle: "검증된 내부 흐름",
    contexts: ["선택 자료만 가져오기", "원문 일치 근거", "건별 승인", "로컬 Audit · 재시작 복구"],
    conversationTitle: "Local Workbench 흐름",
    prompt:
      "선택한 자료와 근거만 사용해 결과물을 만들고, 전체 내용을 확인한 뒤 승인할 수 있게 해 줘.",
    responseTitle: "Local Workbench에서 로컬로 처리합니다.",
    responseBody:
      "선택 자료의 정확한 인용만 근거로 고정하고, 승인 대상 전체 내용을 표시한 뒤 Markdown·인쇄용 결과물과 감사 기록을 로컬에 남깁니다.",
    actionTitle: "구현·검증된 흐름",
    actions: ["근거가 연결된 결과", "승인 대상 전체 검토", "감사·재시작 복구"],
    evidence: "PR #12 내부 빌드 · 공개 배포 전",
  },
  workflow: {
    eyebrow: "HOW IT WORKS",
    title: "Local Workbench의 검증된 6단계",
    description:
      "자료 선택부터 로컬 결과물·감사·재시작 복구까지 구현하고 시뮬레이션 2회와 자동 테스트로 검증했습니다. 실제 외부 실행은 별도 활성화가 필요합니다.",
    steps: [
      { number: "01", title: "맥락", description: "사용할 AI, 공유 탭, 문서와 기억을 확인합니다." },
      { number: "02", title: "문서 비교", description: "변경 전후와 출처를 나란히 검토합니다." },
      { number: "03", title: "계획", description: "AI 답변을 실행 가능한 순서와 결과물로 바꿉니다." },
      { number: "04", title: "승인", description: "대상·값·첨부·수신자를 단건으로 확인합니다." },
      { number: "05", title: "실행", description: "승인된 작업만 한 번 실행하고 재사용을 막습니다." },
      { number: "06", title: "검수·전달", description: "화면·응답·PDF를 확인한 뒤 저장하거나 전달합니다." },
    ],
  },
  capabilities: {
    eyebrow: "CAPABILITIES",
    title: "운영·RC·내부 검증·활성화 필요 상태",
    description:
      "운영 중인 기능, 출시 후보, 내부 검증 빌드와 외부 활성화가 필요한 기능을 명확히 구분합니다.",
    cards: [
      {
        title: "현재 탭 수집·미리보기",
        description: "사용자가 실행한 현재 탭만 수집하고 민감정보 패턴 제거 후 미리봅니다.",
        status: "Browser RC 구현",
      },
      {
        title: "Drive appDataFolder 저장",
        description: "별도 승인과 Google OAuth 후 승인된 기록만 비공개 앱 영역에 저장합니다.",
        status: "RC · OAuth 검증 필요",
      },
      {
        title: "공식 홈페이지·구매 문의",
        description: "aiwork.to와 실패 시 닫히는 구매 문의 흐름을 운영합니다.",
        status: "운영 중",
      },
      {
        title: "개인 AI 프로필",
        description: "사용자가 직접 저장·활성화한 최소 업무 맥락만 브라우저 로컬에 보관합니다.",
        status: "로컬 전용 구현",
      },
      {
        title: "이메일 연결",
        description: "Read-only 수신과 최종 내용을 사용자가 승인한 한 건만 발송하는 계약을 구현·로컬 검증했습니다. 실제 계정·네트워크·발송 Adapter는 아직 활성화하지 않았습니다.",
        status: "내부 구현 · 활성화 필요",
      },
      {
        title: "사용자 선택형 AI",
        description: "특정 모델에 고정하지 않고 Local Runtime 또는 사용자 연결 Cloud Provider와 Model을 작업별로 선택하는 계약을 구현·로컬 검증했습니다. 실제 Model Adapter는 아직 활성화하지 않았습니다.",
        status: "내부 구현 · 활성화 필요",
      },
    ],
  },
  boundary: {
    eyebrow: "CLEAR BOUNDARIES",
    title: "AI는 제안하고, AIWORK가 승인 경계를 지킵니다",
    description:
      "현재 Browser RC와 내부 Local Workbench는 외부 작업을 자동 실행하지 않습니다. 승인 Runtime은 모델 답변만으로 메일을 보내거나 외부 상태를 바꾸지 못하게 검증합니다.",
    items: [
      {
        title: "자격증명 저장 안 함",
        description: "브라우저 코드와 웹사이트에 비밀번호·API 키·토큰·쿠키를 저장하지 않습니다.",
      },
      {
        title: "저장 범위 최소화",
        description: "페이지 미리보기는 임시 보관하고 승인한 기록만 Drive appDataFolder에 저장합니다.",
      },
      {
        title: "외부 실행은 활성화 전",
        description: "메일 발송·게시·권한 변경 계약은 내부 검증됐지만 실제 Adapter와 운영 승인을 연결하기 전에는 사용할 수 없습니다.",
      },
    ],
    advancedSummary: "독립 기능의 검증 상태",
    advancedBody:
      "PR #12의 이메일·AI·외부 실행 계약은 모두 기본 비활성입니다. 특정 이메일 서비스나 AI 모델을 기본값으로 정하지 않으며, 한 기능을 선택해도 다른 외부 기능은 자동 활성화되지 않습니다. 내부 구현은 운영 활성화를 뜻하지 않습니다.",
  },
  cta: {
    eyebrow: "AIWORK",
    title: "원하는 결과를 말하면, 안전한 작업 흐름이 시작됩니다.",
    description:
      "현재는 AIWORK Browser RC와 공식 홈페이지를 제공합니다. Local Workbench는 내부 구현·검증 상태이며, 공개 배포와 외부 Adapter 연결 일정은 문의에서 확인해 주세요.",
    primaryAction: "기능 자세히 보기",
    secondaryAction: "도입 상담",
  },
};

const en: HomeWorkbenchMessage = {
  metadata: {
    title: "AIWORK | AI understands. AIWORK executes safely.",
    description:
      "The official home of AIWORK Browser RC and the internally implemented and locally tested approval-based Local Workbench. Email, AI, and external actions remain unavailable until separately activated.",
  },
  brandContext: "safe work orchestration.",
  hero: {
    eyebrow: "AIWORK PRODUCT VISION · BROWSER RC",
    title: ["AI understands.", "AIWORK executes safely."],
    description:
      "The current public scope is the AIWORK website and user-invoked Browser RC. Local Workbench is an implemented, locally tested internal build; email, AI, and external actions remain separate activation boundaries.",
    primaryAction: "See how it works",
    secondaryAction: "View capabilities",
    trust: ["Browser RC implemented", "Local Workbench internally tested", "No password or token storage"],
  },
  roles: {
    eyebrow: "ONE SAFE WORKFLOW",
    title: "Let each part do what it does best",
    description:
      "AIWORK's target architecture is not another answer model. It is a safe execution coordinator between you, your chosen AI, and real work tools.",
    cards: [
      { title: "You", description: "Define the outcome and approved context, then authorize external actions." },
      { title: "Your AI model", description: "Understands, reasons, drafts, recommends, and proposes a plan." },
      { title: "AIWORK", description: "The public build captures approved tabs; the internal Workbench coordinates sources, evidence, approval, local artifacts, and audit." },
    ],
  },
  workbench: {
    eyebrow: "AIWORK WORKBENCH · INTERNAL VALIDATION",
    status: "Browser RC public scope · Local Workbench implemented and locally tested",
    contextTitle: "Validated internal flow",
    contexts: ["Selected sources only", "Exact source evidence", "Per-task approval", "Local audit · restart recovery"],
    conversationTitle: "Local Workbench flow",
    prompt:
      "Use only the selected sources and evidence, then let me review the complete artifact before approval.",
    responseTitle: "Handled locally by Local Workbench.",
    responseBody:
      "Exact excerpts are fixed as evidence, the complete approval payload is shown, and Markdown, print-ready output, and audit records stay local.",
    actionTitle: "Implemented and tested flow",
    actions: ["Evidence-linked results", "Review complete approval payload", "Audit and restart recovery"],
    evidence: "PR #12 internal build · before public release",
  },
  workflow: {
    eyebrow: "HOW IT WORKS",
    title: "Six validated Local Workbench steps",
    description: "The flow from selected sources to local artifacts, audit, and restart recovery is implemented and covered by two simulations and automated tests. Real external execution requires separate activation.",
    steps: [
      { number: "01", title: "Context", description: "Review the AI, shared tabs, documents, and memories in use." },
      { number: "02", title: "Compare", description: "Inspect before-and-after content with its sources." },
      { number: "03", title: "Plan", description: "Turn the AI response into ordered actions and deliverables." },
      { number: "04", title: "Approve", description: "Confirm the target, values, files, and recipients once." },
      { number: "05", title: "Execute", description: "Run only the approved action once and reject replay." },
      { number: "06", title: "Verify & deliver", description: "Check the page, response, or PDF before saving or sending." },
    ],
  },
  capabilities: {
    eyebrow: "CAPABILITIES",
    title: "Live, RC, internal validation, and activation-required status",
    description: "Live features, release candidates, internally tested builds, and capabilities requiring external activation are labeled separately.",
    cards: [
      { title: "Current-tab capture", description: "Capture only the user-invoked tab and preview it after sensitive-pattern redaction.", status: "Browser RC implemented" },
      { title: "Drive appDataFolder", description: "Store approved records in the private app area after separate approval and Google OAuth.", status: "RC · OAuth E2E required" },
      { title: "Website & inquiry", description: "Operate aiwork.to with a fail-closed purchase-inquiry flow.", status: "Live" },
      { title: "Personal AI profile", description: "Keep only user-saved and enabled business context in browser-local storage.", status: "Local-only implementation" },
      { title: "Email connections", description: "Read-only intake and one exact user-approved send are implemented and locally tested as contracts. No real account, network, or sending adapter is active.", status: "Internal implementation · activation required" },
      { title: "User-selected AI", description: "Users can choose a local runtime or user-connected cloud Provider and Model per task in the implemented, locally tested contract. No real model adapter is active.", status: "Internal implementation · activation required" },
    ],
  },
  boundary: {
    eyebrow: "CLEAR BOUNDARIES",
    title: "AI proposes. AIWORK protects the execution boundary.",
    description:
      "Browser RC and the internal Local Workbench perform no automatic external action. The approval runtime prevents a model response alone from sending email or changing external state.",
    items: [
      { title: "No credentials stored", description: "Browser and website code store no passwords, API keys, tokens, or cookies." },
      { title: "Minimize storage", description: "Keep previews temporary and store only approved records in Drive appDataFolder." },
      { title: "External actions await activation", description: "Email sending, publishing, and permission-change contracts are internally tested but unavailable until real adapters and release approval are connected." },
    ],
    advancedSummary: "Independent capability status",
    advancedBody:
      "Email, AI, and external-action contracts in PR #12 remain disabled by default. AIWORK sets no default email service or AI model, and choosing one capability never enables another. Internal implementation does not mean production activation.",
  },
  cta: {
    eyebrow: "AIWORK",
    title: "Describe the outcome. Start a safe workflow.",
    description:
      "AIWORK Browser RC and the official website are available now. Local Workbench is internally implemented and tested; contact us about public release and adapter activation.",
    primaryAction: "Explore features",
    secondaryAction: "Talk to us",
  },
};

function localizeFromEnglish(input: {
  metadataTitle: string;
  metadataDescription: string;
  heroTitle: [string, string];
  heroDescription: string;
  heroPrimary: string;
  heroSecondary: string;
  roleTitle: string;
  roleDescription: string;
  roleCards: [Card, Card, Card];
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
      description: input.metadataDescription,
    },
    hero: {
      ...en.hero,
      title: input.heroTitle,
      description: input.heroDescription,
      primaryAction: input.heroPrimary,
      secondaryAction: input.heroSecondary,
    },
    roles: {
      ...en.roles,
      title: input.roleTitle,
      description: input.roleDescription,
      cards: input.roleCards,
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
  metadataTitle: "AIWORK | AIが提案し、あなたが決める",
  metadataDescription:
    "AIWORKは、選択したAIモデルと業務ツールの間で、コンテキスト・権限・実行・確認を安全に調整します。",
  heroTitle: ["AIが提案し、", "あなたが決める。"],
  heroDescription:
    "AIWORKは、ユーザー、選択したAIモデル、業務ツールの間で、コンテキスト・権限・実行・確認を安全に調整します。",
  heroPrimary: "仕組みを見る",
  heroSecondary: "検証状況を見る",
  roleTitle: "得意な役割を一つの安全な流れに",
  roleDescription: "AIWORKはモデルとツールを接続し、承認された実行を調整します。",
  roleCards: [
    { title: "ユーザー", description: "目的を設定し、重要な操作を承認します。" },
    { title: "AIモデル", description: "分析・下書き・計画を提案します。" },
    { title: "AIWORK", description: "モデルとツールを接続し、実行を調整します。" },
  ],
  status: "Browser RC 公開範囲 · Local Workbench は内部実装・ローカル検証済み",
  workflowTitle: "誰でも確認できる6段階",
  workflowLabels: ["コンテキスト", "文書比較", "計画", "承認", "実行", "確認・納品"],
  capabilityTitle: "依頼から検証済みの結果まで",
  capabilityLabels: [
    "現在タブの取得・プレビュー",
    "Drive appDataFolder",
    "公式サイト・問い合わせ",
    "パーソナル AI プロファイル",
    "メール接続",
    "ユーザー選択型 AI",
  ],
  taskLabels: [
    "根拠付きリサーチ",
    "承認前の変更確認",
    "検証可能な成果物",
  ],
  ctaTitle: "目的を伝えると、安全な作業フローが始まります。",
  ctaPrimary: "機能を見る",
  ctaSecondary: "相談する",
});

const zhCN = localizeFromEnglish({
  metadataTitle: "AIWORK | AI 提议，由你决定",
  metadataDescription: "AIWORK 在用户、所选 AI 模型和工作工具之间，安全协调上下文、权限、执行与复核。",
  heroTitle: ["AI 提议，", "由你决定。"],
  heroDescription: "AIWORK 在用户、所选 AI 模型和工作工具之间，安全协调上下文、权限、执行与复核。",
  heroPrimary: "查看工作方式",
  heroSecondary: "查看验证状态",
  roleTitle: "让每个角色在同一安全流程中发挥所长",
  roleDescription: "AIWORK 连接模型与工具，并协调经过审批的执行。",
  roleCards: [
    { title: "用户", description: "设定目标并审批重要操作。" },
    { title: "AI 模型", description: "提供分析、草稿和计划。" },
    { title: "AIWORK", description: "连接模型与工具并协调执行。" },
  ],
  status: "Browser RC 为公开范围 · Local Workbench 已内部实现并完成本地验证",
  workflowTitle: "任何人都能遵循的六个步骤",
  workflowLabels: ["理解上下文", "文档对比", "制定计划", "审批", "执行", "复核与交付"],
  capabilityTitle: "从需求到经过验证的结果",
  capabilityLabels: [
    "当前标签页采集与预览",
    "Drive appDataFolder",
    "官方网站与咨询",
    "个人 AI 配置",
    "电子邮件连接",
    "用户选择型 AI",
  ],
  taskLabels: ["带依据的调研", "审批前审查变更", "可验证的成果"],
  ctaTitle: "说明目标，即可启动安全的工作流程。",
  ctaPrimary: "查看功能",
  ctaSecondary: "联系我们",
});

const ar = localizeFromEnglish({
  metadataTitle: "AIWORK | يقترح الذكاء الاصطناعي، وأنت تقرّر",
  metadataDescription:
    "ينسّق AIWORK بأمان السياق والصلاحيات والتنفيذ والمراجعة بينك وبين نموذج الذكاء الاصطناعي وأدوات العمل.",
  heroTitle: ["يقترح الذكاء الاصطناعي،", "وأنت تقرّر."],
  heroDescription:
    "ينسّق AIWORK بأمان السياق والصلاحيات والتنفيذ والمراجعة بينك وبين نموذج الذكاء الاصطناعي الذي تختاره وأدوات العمل.",
  heroPrimary: "تعرّف على آلية العمل",
  heroSecondary: "اطّلع على حالة التحقق",
  roleTitle: "يجمع الأدوار في مسار عمل آمن واحد",
  roleDescription: "يربط AIWORK النموذج بالأدوات وينسّق التنفيذ المعتمد.",
  roleCards: [
    { title: "المستخدم", description: "يحدّد الهدف ويوافق على الإجراءات المهمة." },
    { title: "نموذج الذكاء الاصطناعي", description: "يقترح التحليل والمسودات والخطط." },
    { title: "AIWORK", description: "يربط النموذج بالأدوات وينسّق التنفيذ." },
  ],
  status: "Browser RC ضمن النطاق العام · تم تنفيذ Local Workbench واختباره محليًا داخليًا",
  workflowTitle: "ست مراحل واضحة للجميع",
  workflowLabels: ["فهم السياق", "مقارنة المستندات", "الخطة", "الموافقة", "التنفيذ", "المراجعة والتسليم"],
  capabilityTitle: "من الطلب إلى نتيجة تم التحقق منها",
  capabilityLabels: [
    "التقاط علامة التبويب الحالية ومعاينتها",
    "Drive appDataFolder",
    "الموقع الرسمي والاستفسارات",
    "ملف AI الشخصي",
    "اتصالات البريد الإلكتروني",
    "ذكاء اصطناعي يختاره المستخدم",
  ],
  taskLabels: ["بحث مرتبط بالأدلة", "مراجعة التغييرات قبل الموافقة", "نتائج قابلة للتحقق"],
  ctaTitle: "صِف النتيجة وابدأ مسار عمل آمنًا.",
  ctaPrimary: "استكشف الميزات",
  ctaSecondary: "تواصل معنا",
});

const es = localizeFromEnglish({
  metadataTitle: "AIWORK | La IA propone. Tú decides.",
  metadataDescription:
    "AIWORK coordina de forma segura el contexto, los permisos, la ejecución y la revisión entre tú, la IA que elijas y tus herramientas.",
  heroTitle: ["La IA propone.", "Tú decides."],
  heroDescription:
    "AIWORK coordina de forma segura el contexto, los permisos, la ejecución y la revisión entre tú, el modelo de IA que elijas y tus herramientas.",
  heroPrimary: "Ver cómo funciona",
  heroSecondary: "Ver estado de validación",
  roleTitle: "Cada parte aporta lo mejor en un flujo seguro",
  roleDescription: "AIWORK conecta modelos y herramientas y coordina la ejecución aprobada.",
  roleCards: [
    { title: "Usuario", description: "Define el objetivo y aprueba acciones importantes." },
    { title: "Modelo de IA", description: "Propone análisis, borradores y planes." },
    { title: "AIWORK", description: "Conecta modelos y herramientas y coordina la ejecución." },
  ],
  status: "Browser RC público · Local Workbench implementado y probado localmente de forma interna",
  workflowTitle: "Seis pasos que cualquiera puede seguir",
  workflowLabels: ["Contexto", "Comparación", "Plan", "Aprobación", "Ejecución", "Revisión y entrega"],
  capabilityTitle: "De la solicitud a un resultado verificado",
  capabilityLabels: [
    "Captura y vista previa de la pestaña actual",
    "Drive appDataFolder",
    "Sitio oficial y consultas",
    "Perfil personal de IA",
    "Conexiones de correo",
    "IA seleccionada por el usuario",
  ],
  taskLabels: ["Investigación con evidencias", "Revisar cambios antes de aprobar", "Resultados verificables"],
  ctaTitle: "Describe el resultado y empieza un flujo seguro.",
  ctaPrimary: "Explorar funciones",
  ctaSecondary: "Hablar con nosotros",
});

const fr = localizeFromEnglish({
  metadataTitle: "AIWORK | L’IA propose. Vous décidez.",
  metadataDescription:
    "AIWORK coordonne en toute sécurité le contexte, les autorisations, l’exécution et la vérification entre vous, l’IA choisie et vos outils.",
  heroTitle: ["L’IA propose.", "Vous décidez."],
  heroDescription:
    "AIWORK coordonne en toute sécurité le contexte, les autorisations, l’exécution et la vérification entre vous, le modèle d’IA choisi et vos outils.",
  heroPrimary: "Voir le fonctionnement",
  heroSecondary: "Voir l’état de validation",
  roleTitle: "Chaque rôle réuni dans un flux sûr",
  roleDescription: "AIWORK relie modèles et outils et coordonne l’exécution approuvée.",
  roleCards: [
    { title: "Utilisateur", description: "Définit l’objectif et approuve les actions importantes." },
    { title: "Modèle d’IA", description: "Propose analyses, brouillons et plans." },
    { title: "AIWORK", description: "Relie modèles et outils et coordonne l’exécution." },
  ],
  status: "Browser RC public · Local Workbench implémenté et testé localement en interne",
  workflowTitle: "Six étapes simples à suivre",
  workflowLabels: ["Contexte", "Comparaison", "Plan", "Approbation", "Exécution", "Vérification et livraison"],
  capabilityTitle: "De la demande au résultat vérifié",
  capabilityLabels: [
    "Capture et aperçu de l’onglet actuel",
    "Drive appDataFolder",
    "Site officiel et demandes",
    "Profil IA personnel",
    "Connexions e-mail",
    "IA choisie par l’utilisateur",
  ],
  taskLabels: ["Recherche liée aux preuves", "Vérifier les changements avant approbation", "Livrables vérifiables"],
  ctaTitle: "Décrivez le résultat et lancez un flux sûr.",
  ctaPrimary: "Explorer les fonctions",
  ctaSecondary: "Nous contacter",
});

const de = localizeFromEnglish({
  metadataTitle: "AIWORK | Die KI schlägt vor. Sie entscheiden.",
  metadataDescription:
    "AIWORK koordiniert Kontext, Berechtigungen, Ausführung und Prüfung sicher zwischen Ihnen, dem gewählten KI-Modell und Ihren Werkzeugen.",
  heroTitle: ["Die KI schlägt vor.", "Sie entscheiden."],
  heroDescription:
    "AIWORK koordiniert Kontext, Berechtigungen, Ausführung und Prüfung sicher zwischen Ihnen, dem gewählten KI-Modell und Ihren Arbeitswerkzeugen.",
  heroPrimary: "Funktionsweise ansehen",
  heroSecondary: "Prüfstatus ansehen",
  roleTitle: "Jede Rolle in einem sicheren Ablauf",
  roleDescription: "AIWORK verbindet Modelle und Werkzeuge und koordiniert freigegebene Ausführungen.",
  roleCards: [
    { title: "Nutzer", description: "Definiert das Ziel und genehmigt wichtige Aktionen." },
    { title: "KI-Modell", description: "Schlägt Analysen, Entwürfe und Pläne vor." },
    { title: "AIWORK", description: "Verbindet Modelle und Werkzeuge und koordiniert die Ausführung." },
  ],
  status: "Browser RC öffentlich · Local Workbench intern implementiert und lokal getestet",
  workflowTitle: "Sechs verständliche Schritte",
  workflowLabels: ["Kontext", "Dokumentenvergleich", "Plan", "Freigabe", "Ausführung", "Prüfung & Übergabe"],
  capabilityTitle: "Von der Anfrage zum geprüften Ergebnis",
  capabilityLabels: [
    "Aktuellen Tab erfassen und prüfen",
    "Drive appDataFolder",
    "Offizielle Website und Anfragen",
    "Persönliches KI-Profil",
    "E-Mail-Verbindungen",
    "Vom Nutzer gewählte KI",
  ],
  taskLabels: ["Recherche mit Belegen", "Änderungen vor Freigabe prüfen", "Prüfbare Ergebnisse"],
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
