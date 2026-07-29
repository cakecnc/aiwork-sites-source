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
      "현재 공개된 AIWORK Browser RC와 승인 기반 Workbench 제품 비전을 소개합니다. AI Agent 본체·메일 자동화·화면 직접 조작은 아직 제공되지 않습니다.",
  },
  brandContext: "safe work orchestration.",
  hero: {
    eyebrow: "AIWORK 제품 비전 · BROWSER RC",
    title: ["AI가 이해하고,", "AIWORK가 안전하게 실행합니다."],
    description:
      "현재 공개 범위는 공식 홈페이지와 사용자 실행형 AIWORK Browser RC입니다. 후속 Workbench의 각 기능은 독립된 선택·승인 경계로 검증하며, 특정 서비스나 모델을 기본값으로 묶지 않습니다.",
    primaryAction: "작동 방식 보기",
    secondaryAction: "구현 기능 확인",
    trust: ["Browser RC 구현", "비밀번호·토큰 저장 안 함", "AI Agent 본체 미구현"],
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
        description: "현재는 승인된 탭을 수집·저장하며, 향후 맥락·승인·검수 흐름을 조정합니다.",
      },
    ],
  },
  workbench: {
    eyebrow: "AIWORK WORKBENCH · PRODUCT VISION",
    status: "Browser RC 구현 · AI Agent 본체 미구현",
    contextTitle: "현재 제공 범위",
    contexts: ["현재 탭 · 사용자 실행", "저장 전 미리보기", "민감정보 패턴 제거", "Drive · OAuth 후"],
    conversationTitle: "현재 제공 흐름",
    prompt:
      "현재 탭의 선택 내용을 안전하게 미리보고 승인한 기록만 저장해 줘.",
    responseTitle: "Browser RC에서 처리합니다.",
    responseBody:
      "제목·URL·선택 영역을 민감정보 패턴 제거 후 미리보기로 준비하고, 별도 승인과 OAuth 후 Drive appDataFolder에 저장합니다.",
    actionTitle: "후속 Workbench 목표",
    actions: ["근거가 연결된 조사 결과", "승인 전 변경점 검토", "검수 가능한 결과물"],
    evidence: "현재 구현 · Browser RC / 후속 · Agent Runtime",
  },
  workflow: {
    eyebrow: "HOW IT WORKS",
    title: "후속 Workbench의 목표 6단계",
    description:
      "현재 구현은 사용자 실행형 탭 수집·미리보기·승인 저장입니다. 문서 비교 이후의 Agent Runtime 단계는 아직 제공되지 않습니다.",
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
    title: "GitHub main 기준 구현 상태",
    description:
      "운영 중인 기능, 출시 후보, 비활성 계약, 미구현 기능을 명확히 구분합니다.",
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
        description: "수신은 Read-only가 기본입니다. 최종 내용을 사용자가 승인한 한 건만 발송하도록 계약을 검증 중이며, 실제 네트워크·발송 기능은 없습니다.",
        status: "계약 검증 중 · 미구현",
      },
      {
        title: "사용자 선택형 AI",
        description: "특정 모델에 고정하지 않고 Local Runtime 또는 사용자 연결 Cloud Provider와 Model을 작업별로 선택하는 계약을 검증 중입니다.",
        status: "계약 검증 중 · 미구현",
      },
    ],
  },
  boundary: {
    eyebrow: "CLEAR BOUNDARIES",
    title: "AI는 제안하고, AIWORK가 승인 경계를 지킵니다",
    description:
      "현재 Browser RC는 외부 작업을 실행하지 않습니다. 후속 Agent Runtime도 모델 답변만으로 메일을 보내거나 상품을 공개하지 않도록 설계합니다.",
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
        title: "외부 실행은 아직 미제공",
        description: "메일 발송·결제·게시·권한 변경은 현재 제품 기능이 아닙니다.",
      },
    ],
    advancedSummary: "독립 기능의 검증 상태",
    advancedBody:
      "GitHub의 후속 계약은 모두 기본 비활성입니다. 특정 이메일 서비스나 AI 모델을 기본값으로 정하지 않으며, 한 기능을 선택해도 다른 외부 기능은 자동 활성화되지 않습니다. 아직 운영 기능이 아닙니다.",
  },
  cta: {
    eyebrow: "AIWORK",
    title: "원하는 결과를 말하면, 안전한 작업 흐름이 시작됩니다.",
    description:
      "현재는 AIWORK Browser RC와 공식 홈페이지를 제공합니다. 후속 Workbench의 도입 범위와 연결 일정은 문의에서 확인해 주세요.",
    primaryAction: "기능 자세히 보기",
    secondaryAction: "도입 상담",
  },
};

const en: HomeWorkbenchMessage = {
  metadata: {
    title: "AIWORK | AI understands. AIWORK executes safely.",
    description:
      "The official home of the AIWORK Browser release candidate and the approval-based Workbench product vision. The AI Agent runtime, email automation, and direct screen control are not yet available.",
  },
  brandContext: "safe work orchestration.",
  hero: {
    eyebrow: "AIWORK PRODUCT VISION · BROWSER RC",
    title: ["AI understands.", "AIWORK executes safely."],
    description:
      "The current public scope is the AIWORK website and user-invoked Browser RC. Each future Workbench capability is validated behind its own selection and approval boundary, without bundling a default service or model.",
    primaryAction: "See how it works",
    secondaryAction: "View capabilities",
    trust: ["Browser RC implemented", "No password or token storage", "AI Agent runtime not implemented"],
  },
  roles: {
    eyebrow: "ONE SAFE WORKFLOW",
    title: "Let each part do what it does best",
    description:
      "AIWORK's target architecture is not another answer model. It is a safe execution coordinator between you, your chosen AI, and real work tools.",
    cards: [
      { title: "You", description: "Define the outcome and approved context, then authorize external actions." },
      { title: "Your AI model", description: "Understands, reasons, drafts, recommends, and proposes a plan." },
      { title: "AIWORK", description: "Currently captures approved tabs; future versions coordinate context, approval, and verification." },
    ],
  },
  workbench: {
    eyebrow: "AIWORK WORKBENCH · PRODUCT VISION",
    status: "Browser RC implemented · AI Agent runtime not implemented",
    contextTitle: "Current scope",
    contexts: ["Current tab · user invoked", "Preview before storage", "Sensitive-pattern redaction", "Drive · after OAuth"],
    conversationTitle: "Current flow",
    prompt:
      "Preview the selected content from the current tab and store only the record I approve.",
    responseTitle: "Handled by Browser RC.",
    responseBody:
      "The title, URL, and selected content are redacted and previewed, then stored in Drive appDataFolder only after approval and OAuth.",
    actionTitle: "Future Workbench goals",
    actions: ["Evidence-linked research", "Review changes before approval", "Verifiable deliverables"],
    evidence: "Current · Browser RC / Future · Agent Runtime",
  },
  workflow: {
    eyebrow: "HOW IT WORKS",
    title: "Six target steps for the future Workbench",
    description: "Today's implementation is user-invoked capture, preview, and approved storage. Agent Runtime steps after that are not yet available.",
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
    title: "Implementation status from GitHub main",
    description: "Live features, release candidates, disabled contracts, and unimplemented work are labeled separately.",
    cards: [
      { title: "Current-tab capture", description: "Capture only the user-invoked tab and preview it after sensitive-pattern redaction.", status: "Browser RC implemented" },
      { title: "Drive appDataFolder", description: "Store approved records in the private app area after separate approval and Google OAuth.", status: "RC · OAuth E2E required" },
      { title: "Website & inquiry", description: "Operate aiwork.to with a fail-closed purchase-inquiry flow.", status: "Live" },
      { title: "Personal AI profile", description: "Keep only user-saved and enabled business context in browser-local storage.", status: "Local-only implementation" },
      { title: "Email connections", description: "Intake is read-only by default. A contract for sending one exact, user-approved final draft is under validation; no network or sending runtime exists.", status: "Contract validation · not implemented" },
      { title: "User-selected AI", description: "A contract lets users choose a local runtime or a user-connected cloud Provider and Model per task, with no fixed default.", status: "Contract validation · not implemented" },
    ],
  },
  boundary: {
    eyebrow: "CLEAR BOUNDARIES",
    title: "AI proposes. AIWORK protects the execution boundary.",
    description:
      "Browser RC performs no external actions. A future Agent Runtime is also designed so a model response alone cannot send email or publish products.",
    items: [
      { title: "No credentials stored", description: "Browser and website code store no passwords, API keys, tokens, or cookies." },
      { title: "Minimize storage", description: "Keep previews temporary and store only approved records in Drive appDataFolder." },
      { title: "External actions unavailable", description: "Email sending, payment, publishing, and permission changes are not current product features." },
    ],
    advancedSummary: "Independent capability status",
    advancedBody:
      "Future contracts in GitHub remain disabled by default. AIWORK sets no default email service or AI model, and choosing one capability never enables another external capability. None is a production feature yet.",
  },
  cta: {
    eyebrow: "AIWORK",
    title: "Describe the outcome. Start a safe workflow.",
    description:
      "AIWORK Browser RC and the official website are available now. Contact us to confirm the scope and timing of the future Workbench.",
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
  status: "Browser RC 実装済み · AI Agent ランタイム未実装",
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
  status: "Browser RC 已实现 · AI Agent 运行时未实现",
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
  status: "تم تنفيذ Browser RC · وقت تشغيل وكيل AI غير منفذ",
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
  status: "Browser RC implementado · runtime del agente de IA no implementado",
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
  status: "Browser RC implémenté · runtime de l’agent IA non implémenté",
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
  status: "Browser RC implementiert · AI-Agent-Runtime nicht implementiert",
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
