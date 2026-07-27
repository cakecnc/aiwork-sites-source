import type { Locale } from "./i18n";

export type BrowserGuideCopy = {
  title: [string, string];
  description: string;
  status: string;
  steps: Array<{ title: string; description: string }>;
  captureMethods: [string, string, string];
  recordTypesNote: string;
  queueNote: string;
  controlNote: string;
  roadmapWarning: string;
};

export const browserGuide = {
  ko: {
    title: ["AIWORK Browser를", "6단계로 시작하세요."],
    description:
      "AIWORK Browser v1.0 RC는 사용자가 명시적으로 실행한 현재 페이지만 수집·미리보기하고, 승인한 Source·Memory·Research 기록만 Google Drive의 비공개 appDataFolder에 저장합니다.",
    status: "출시 후보 · 공개 배포 준비 중",
    steps: [
      {
        title: "설치 및 동의 확인",
        description:
          "공개 배포 후 Chrome 116 이상에서 설치합니다. 첫 실행에서 페이지 접근 동의와 Drive 저장 동의를 각각 확인합니다.",
      },
      {
        title: "현재 페이지 수집",
        description:
          "대상 페이지를 연 뒤 Toolbar 아이콘, 수집 단축키 또는 AIWORK Context Menu로 수집합니다. Alt+Shift+A(Mac: Control+Shift+A)는 Side Panel을 엽니다.",
      },
      {
        title: "안전 미리보기 검토",
        description:
          "제목, URL, 선택 영역과 페이지 일부를 확인합니다. [REDACTED] 처리와 프롬프트 인젝션 경고를 검토하고 남은 민감정보는 직접 제거합니다.",
      },
      {
        title: "맥락 추가와 기록 종류 선택",
        description:
          "필요하면 작업 템플릿으로 메모 초안을 만든 뒤 메모와 태그를 검토하고 Source, Memory 또는 Research를 선택합니다.",
      },
      {
        title: "Drive 연결과 저장",
        description:
          "필요할 때만 Drive를 연결합니다. AIWORK는 drive.appdata 권한만 사용하며 승인한 기록을 비공개 appDataFolder에 저장합니다.",
      },
      {
        title: "기록 확인과 통제",
        description:
          "Library에서 기록을 확인·삭제하고, Queue에서 저장·동기화 재시도를 확인하며, 설정에서 화면·Drive·동의를 관리합니다.",
      },
    ],
    captureMethods: [
      "Toolbar의 AIWORK 아이콘",
      "수집 단축키 Alt+Shift+S(Mac: Control+Shift+S)",
      "페이지 우클릭 후 AIWORK Context Menu",
    ],
    recordTypesNote:
      "Source·Memory·Research는 사용자가 선택하는 기록 분류입니다. Memory는 자동 AI 기억, RAG 또는 모델 학습을 의미하지 않습니다.",
    queueNote:
      "Queue는 백그라운드 저장과 Drive 동기화 상태 및 제한된 재시도를 보여줍니다. 일반 업무 자동화 예약 기능이 아닙니다.",
    controlNote:
      "개별 기록 삭제는 해당 기록을 지웁니다. Drive 연결 해제나 동의 철회는 이미 Drive에 저장된 기록을 자동 삭제하지 않으므로 필요하면 별도로 삭제해야 합니다.",
    roadmapWarning:
      "AI 분석, RAG, 프로젝트 생성, 문서 업로드, 자동 웹 조사, IMAP 메일 연결, 메일 검색·분류·발송과 업무 자동화는 승인된 v1.0 RC에 포함되지 않습니다.",
  },
  en: {
    title: ["Use AIWORK Browser", "in six clear steps."],
    description:
      "AIWORK Browser v1.0 RC captures and previews only the current page you explicitly invoke, then saves only approved Source, Memory, or Research records to the private Google Drive appDataFolder.",
    status: "Release candidate · Public distribution pending",
    steps: [
      {
        title: "Install and review consent",
        description:
          "After public release, install it in Chrome 116 or later. On first run, review page-access consent and Drive-storage consent separately.",
      },
      {
        title: "Capture the current page",
        description:
          "Open the target page, then capture it with the toolbar icon, capture shortcut, or AIWORK context menu. Alt+Shift+A(Mac: Control+Shift+A) opens the Side Panel.",
      },
      {
        title: "Review the safe preview",
        description:
          "Check the title, URL, selected text, and page excerpt. Review any [REDACTED] replacement and prompt-injection warning; pattern matching may not remove every sensitive value.",
      },
      {
        title: "Add context and choose a type",
        description:
          "If useful, apply a work template to draft the note, review the note and tags, then choose Source, Memory, or Research.",
      },
      {
        title: "Connect Drive and save",
        description:
          "Connect Drive only when needed. AIWORK uses only the drive.appdata scope and stores approved records in the private appDataFolder.",
      },
      {
        title: "Review and stay in control",
        description:
          "Use Library to review or delete records, Queue to check save and sync retries, and Settings to manage display, Drive, and consent.",
      },
    ],
    captureMethods: [
      "AIWORK toolbar icon",
      "Capture shortcut Alt+Shift+S(Mac: Control+Shift+S)",
      "AIWORK in the page’s right-click context menu",
    ],
    recordTypesNote:
      "Source, Memory, and Research are user-selected record categories. Memory does not mean automatic AI memory, RAG, or model training.",
    queueNote:
      "Queue shows background save and Drive-sync status and keeps bounded retries visible; it is not a general automation scheduler.",
    controlNote:
      "Deleting a record removes that record. Disconnecting Drive or revoking consent does not automatically delete records already stored in Drive; remove them explicitly when needed.",
    roadmapWarning:
      "AI analysis, RAG, project creation, document upload, automatic web research, IMAP mailbox connection, email search, classification or sending, and workflow automation are not included in the approved v1.0 RC.",
  },
  ja: {
    title: ["AIWORK Browserを", "6ステップで始めましょう。"],
    description:
      "AIWORK Browser v1.0 RCは、ユーザーが明示的に実行した現在のページだけを収集・プレビューし、承認したSource・Memory・Researchの記録だけをGoogle Driveの非公開appDataFolderに保存します。",
    status: "リリース候補 · 公開配布準備中",
    steps: [
      {
        title: "インストールと同意の確認",
        description:
          "公開後、Chrome 116以降にインストールします。初回起動時に、ページアクセスへの同意とDrive保存への同意を個別に確認します。",
      },
      {
        title: "現在のページを収集",
        description:
          "対象ページを開き、ツールバーアイコン、収集ショートカット、またはAIWORKコンテキストメニューで収集します。Alt+Shift+A（Mac: Control+Shift+A）でSide Panelを開きます。",
      },
      {
        title: "安全なプレビューを確認",
        description:
          "タイトル、URL、選択範囲、ページの抜粋を確認します。[REDACTED]置換とプロンプトインジェクション警告を確認し、残った機密情報は手動で削除してください。",
      },
      {
        title: "コンテキストと記録種類を選択",
        description:
          "必要に応じて作業テンプレートでメモの下書きを作り、メモとタグを確認してSource・Memory・Researchのいずれかを選択します。",
      },
      {
        title: "Driveに接続して保存",
        description:
          "必要な場合だけDriveに接続します。AIWORKはdrive.appdataスコープだけを使用し、承認した記録を非公開appDataFolderに保存します。",
      },
      {
        title: "記録を確認して管理",
        description:
          "Libraryで記録の確認・削除、Queueで保存・同期の再試行確認、Settingsで表示・Drive・同意を管理します。",
      },
    ],
    captureMethods: [
      "ツールバーのAIWORKアイコン",
      "収集ショートカット Alt+Shift+S（Mac: Control+Shift+S）",
      "ページを右クリックしてAIWORKコンテキストメニュー",
    ],
    recordTypesNote:
      "Source・Memory・Researchはユーザーが選択する記録分類です。Memoryは自動AIメモリ、RAG、モデル学習を意味しません。",
    queueNote:
      "Queueはバックグラウンド保存とDrive同期の状態、制限された再試行を表示します。一般的な自動化スケジューラーではありません。",
    controlNote:
      "個別記録を削除するとその記録が削除されます。Drive接続解除や同意撤回では既存のDrive記録は自動削除されないため、必要に応じて明示的に削除してください。",
    roadmapWarning:
      "AI分析、RAG、プロジェクト作成、文書アップロード、自動Web調査、IMAPメールボックス接続、メール検索・分類・送信、ワークフロー自動化は、承認済みv1.0 RCには含まれていません。",
  },
  "zh-CN": {
    title: ["使用 AIWORK Browser，", "六步即可开始。"],
    description:
      "AIWORK Browser v1.0 RC 仅采集并预览用户明确触发的当前页面，只有用户批准的 Source、Memory 或 Research 记录才会保存到 Google Drive 的私有 appDataFolder。",
    status: "发布候选版 · 公开发布准备中",
    steps: [
      {
        title: "安装并确认授权",
        description:
          "公开发布后，请在 Chrome 116 或更高版本中安装。首次运行时，分别确认页面访问授权和 Drive 存储授权。",
      },
      {
        title: "采集当前页面",
        description:
          "打开目标页面，然后使用工具栏图标、采集快捷键或AIWORK上下文菜单进行采集。Alt+Shift+A（Mac: Control+Shift+A）用于打开侧边栏。",
      },
      {
        title: "检查安全预览",
        description:
          "检查标题、URL、选中内容和页面摘录。查看所有[REDACTED]替换和提示词注入警告；模式匹配不能保证移除全部敏感信息。",
      },
      {
        title: "添加上下文并选择记录类型",
        description:
          "如有需要，可使用工作模板生成备注草稿。检查备注和标签后，选择Source、Memory或Research。",
      },
      {
        title: "连接Drive并保存",
        description:
          "仅在需要时连接Drive。AIWORK只使用drive.appdata权限范围，并将批准的记录保存到私有appDataFolder。",
      },
      {
        title: "检查记录并保持控制",
        description:
          "在资料库中检查或删除记录，在任务队列中查看保存和同步重试，并在设置中管理显示、Drive和授权。",
      },
    ],
    captureMethods: [
      "工具栏中的AIWORK图标",
      "采集快捷键 Alt+Shift+S（Mac: Control+Shift+S）",
      "右键页面后选择AIWORK上下文菜单",
    ],
    recordTypesNote:
      "Source、Memory和Research是用户选择的记录分类。Memory不代表自动AI记忆、RAG或模型训练。",
    queueNote:
      "任务队列显示后台保存、Drive同步状态和有限次数的重试；它不是通用自动化调度器。",
    controlNote:
      "删除单条记录会移除该记录。断开Drive或撤回授权不会自动删除已存入Drive的记录；需要时请明确删除。",
    roadmapWarning:
      "已批准的v1.0 RC不包含AI分析、RAG、项目创建、文档上传、自动网页研究、IMAP邮箱连接、邮件搜索、分类或发送以及工作流自动化。",
  },
  ar: {
    title: ["استخدم AIWORK Browser", "في ست خطوات واضحة."],
    description:
      "لا يلتقط AIWORK Browser v1.0 RC ويعاين إلا الصفحة الحالية التي تستدعيه فيها صراحةً، ثم لا يحفظ في المجلد الخاص appDataFolder على Google Drive إلا سجلات Source أو Memory أو Research التي وافقت عليها.",
    status: "نسخة مرشحة للإصدار · التوزيع العام قيد الانتظار",
    steps: [
      {
        title: "ثبّت الإضافة وراجع الموافقات",
        description:
          "بعد الإصدار العام، ثبّت AIWORK Browser على Chrome 116 أو إصدار أحدث. عند التشغيل لأول مرة، راجع بشكل منفصل الموافقة على الوصول إلى الصفحات والموافقة على التخزين في Drive.",
      },
      {
        title: "التقط الصفحة الحالية",
        description:
          "افتح الصفحة المستهدفة، ثم التقطها عبر أيقونة شريط الأدوات أو اختصار الالتقاط أو خيار AIWORK في قائمة السياق. يفتح Alt+Shift+A (على Mac: Control+Shift+A) اللوحة الجانبية.",
      },
      {
        title: "راجع المعاينة الآمنة",
        description:
          "تحقق من العنوان وعنوان URL والنص المحدد ومقتطف الصفحة. راجع استبدالات [REDACTED] وتحذير حقن التعليمات؛ وقد لا تزيل مطابقة الأنماط كل البيانات الحساسة.",
      },
      {
        title: "أضف السياق واختر نوعًا",
        description:
          "استخدم قالب عمل لصياغة مسودة الملاحظة عند الحاجة، ثم راجع الملاحظة والوسوم واختر Source أو Memory أو Research.",
      },
      {
        title: "اربط Drive واحفظ",
        description:
          "اربط Drive عند الحاجة فقط. لا يستخدم AIWORK سوى النطاق drive.appdata، ويخزن السجلات التي وافقت عليها في المجلد الخاص appDataFolder.",
      },
      {
        title: "راجع كل شيء وحافظ على سيطرتك",
        description:
          "استخدم المكتبة لمراجعة السجلات أو حذفها، وقائمة الانتظار للتحقق من محاولات الحفظ وإعادة المزامنة، والإعدادات لإدارة العرض وDrive والموافقات.",
      },
    ],
    captureMethods: [
      "أيقونة AIWORK في شريط الأدوات",
      "اختصار الالتقاط Alt+Shift+S (على Mac: Control+Shift+S)",
      "AIWORK في قائمة السياق التي تظهر بالنقر بزر الماوس الأيمن في الصفحة",
    ],
    recordTypesNote:
      "Source وMemory وResearch فئات سجلات يختارها المستخدم. ولا تعني Memory وجود ذاكرة تلقائية للذكاء الاصطناعي أو RAG أو تدريب للنموذج.",
    queueNote:
      "تعرض قائمة الانتظار حالة الحفظ في الخلفية والمزامنة مع Drive، وتُظهر محاولات إعادة التنفيذ المحدودة؛ وهي ليست أداة عامة لجدولة الأتمتة.",
    controlNote:
      "يؤدي حذف سجل إلى إزالة ذلك السجل. ولا يؤدي قطع الاتصال بـDrive أو سحب الموافقة إلى حذف السجلات المخزنة مسبقًا في Drive تلقائيًا؛ احذفها صراحةً عند الحاجة.",
    roadmapWarning:
      "لا يتضمن الإصدار v1.0 RC المعتمد تحليل الذكاء الاصطناعي، أو RAG، أو إنشاء المشاريع، أو رفع المستندات، أو البحث التلقائي على الويب، أو الاتصال بصناديق بريد IMAP، أو البحث في البريد الإلكتروني وتصنيفه أو إرساله، أو أتمتة سير العمل.",
  },
  es: {
    title: ["Usa AIWORK Browser", "en seis pasos claros."],
    description:
      "AIWORK Browser v1.0 RC solo captura y previsualiza la página actual en la que lo activas de forma explícita; después, guarda únicamente los registros Source, Memory o Research aprobados en la carpeta privada appDataFolder de Google Drive.",
    status: "Versión candidata · Distribución pública pendiente",
    steps: [
      {
        title: "Instala y revisa los consentimientos",
        description:
          "Tras el lanzamiento público, instálalo en Chrome 116 o una versión posterior. En el primer uso, revisa por separado el consentimiento de acceso a las páginas y el de almacenamiento en Drive.",
      },
      {
        title: "Captura la página actual",
        description:
          "Abre la página que quieras capturar y usa el icono de la barra de herramientas, el atajo de captura o la opción AIWORK del menú contextual. Alt+Shift+A (Mac: Control+Shift+A) abre el panel lateral.",
      },
      {
        title: "Revisa la vista previa segura",
        description:
          "Comprueba el título, la URL, el texto seleccionado y el extracto de la página. Revisa las sustituciones [REDACTED] y la advertencia de inyección; la coincidencia de patrones puede no eliminar todos los datos sensibles.",
      },
      {
        title: "Añade contexto y elige un tipo",
        description:
          "Si resulta útil, usa una plantilla de trabajo para preparar el borrador de la nota. Revisa la nota y las etiquetas y elige Source, Memory o Research.",
      },
      {
        title: "Conecta Drive y guarda",
        description:
          "Conecta Drive solo cuando sea necesario. AIWORK utiliza únicamente el alcance drive.appdata y almacena los registros aprobados en la carpeta privada appDataFolder.",
      },
      {
        title: "Revisa y mantén el control",
        description:
          "Usa la Biblioteca para revisar o eliminar registros, la Cola para comprobar los reintentos de guardado y sincronización, y Ajustes para gestionar la visualización, Drive y los consentimientos.",
      },
    ],
    captureMethods: [
      "Icono de AIWORK en la barra de herramientas",
      "Atajo de captura Alt+Shift+S (Mac: Control+Shift+S)",
      "AIWORK en el menú contextual de la página",
    ],
    recordTypesNote:
      "Source, Memory y Research son categorías de registro seleccionadas por el usuario. Memory no implica memoria automática de IA, RAG ni entrenamiento del modelo.",
    queueNote:
      "La Cola muestra el estado del guardado en segundo plano y de la sincronización con Drive, y mantiene visibles los reintentos limitados; no es un programador de automatizaciones de propósito general.",
    controlNote:
      "Al eliminar un registro, se elimina ese registro. Desconectar Drive o revocar el consentimiento no elimina automáticamente los registros ya almacenados en Drive; elimínalos de forma explícita cuando sea necesario.",
    roadmapWarning:
      "El v1.0 RC aprobado no incluye análisis con IA, RAG, creación de proyectos, carga de documentos, investigación web automática, conexión a buzones IMAP, búsqueda, clasificación o envío de correos electrónicos ni automatización de flujos de trabajo.",
  },
  fr: {
    title: ["Utilisez AIWORK Browser", "en six étapes claires."],
    description:
      "AIWORK Browser v1.0 RC capture et prévisualise uniquement la page actuelle que vous invoquez explicitement, puis enregistre seulement les éléments Source, Memory ou Research approuvés dans l’appDataFolder privé de Google Drive.",
    status: "Version candidate · Diffusion publique en attente",
    steps: [
      {
        title: "Installer et examiner les consentements",
        description:
          "Après la publication publique, installez l’extension dans Chrome 116 ou une version ultérieure. Au premier lancement, examinez séparément le consentement d’accès aux pages et celui du stockage Drive.",
      },
      {
        title: "Capturer la page actuelle",
        description:
          "Ouvrez la page cible, puis utilisez l’icône de la barre d’outils, le raccourci de capture ou le menu contextuel AIWORK. Alt+Shift+A (Mac : Control+Shift+A) ouvre le panneau latéral.",
      },
      {
        title: "Vérifier l’aperçu sécurisé",
        description:
          "Vérifiez le titre, l’URL, le texte sélectionné et l’extrait de page. Examinez les remplacements [REDACTED] et l’alerte d’injection ; la détection par motifs peut laisser subsister des données sensibles.",
      },
      {
        title: "Ajouter le contexte et choisir un type",
        description:
          "Si nécessaire, utilisez un modèle de travail pour préparer la note. Vérifiez la note et les étiquettes, puis choisissez Source, Memory ou Research.",
      },
      {
        title: "Connecter Drive et enregistrer",
        description:
          "Connectez Drive uniquement si nécessaire. AIWORK utilise seulement le périmètre drive.appdata et stocke les éléments approuvés dans l’appDataFolder privé.",
      },
      {
        title: "Vérifier et garder le contrôle",
        description:
          "Utilisez la Bibliothèque pour consulter ou supprimer les éléments, la File pour vérifier les nouvelles tentatives d’enregistrement et de synchronisation, et les Paramètres pour gérer l’affichage, Drive et les consentements.",
      },
    ],
    captureMethods: [
      "Icône AIWORK dans la barre d’outils",
      "Raccourci de capture Alt+Shift+S (Mac : Control+Shift+S)",
      "AIWORK dans le menu contextuel obtenu par clic droit",
    ],
    recordTypesNote:
      "Source, Memory et Research sont des catégories choisies par l’utilisateur. Memory ne signifie pas mémoire IA automatique, RAG ou entraînement de modèle.",
    queueNote:
      "La File affiche l’état des enregistrements en arrière-plan, de la synchronisation Drive et des nouvelles tentatives limitées ; ce n’est pas un planificateur d’automatisation général.",
    controlNote:
      "La suppression d’un élément retire cet élément. Déconnecter Drive ou retirer le consentement ne supprime pas automatiquement les éléments déjà stockés dans Drive ; supprimez-les explicitement si nécessaire.",
    roadmapWarning:
      "L’analyse IA, RAG, la création de projets, l’importation de documents, la recherche Web automatique, la connexion aux boîtes IMAP, la recherche, le classement ou l’envoi d’e-mails et l’automatisation des flux ne font pas partie du v1.0 RC approuvé.",
  },
  de: {
    title: ["AIWORK Browser verwenden", "in sechs klaren Schritten."],
    description:
      "AIWORK Browser v1.0 RC erfasst und zeigt nur die aktuelle Seite an, deren Erfassung Sie ausdrücklich auslösen, und speichert nur genehmigte Source-, Memory- oder Research-Einträge im privaten Google-Drive-appDataFolder.",
    status: "Release Candidate · Öffentliche Bereitstellung ausstehend",
    steps: [
      {
        title: "Installieren und Einwilligungen prüfen",
        description:
          "Installieren Sie die Erweiterung nach der öffentlichen Veröffentlichung in Chrome 116 oder höher. Prüfen Sie beim ersten Start den Seitenzugriff und die Drive-Speicherung getrennt.",
      },
      {
        title: "Aktuelle Seite erfassen",
        description:
          "Öffnen Sie die Zielseite und verwenden Sie das Symbol in der Symbolleiste, das Erfassungs-Kürzel oder das AIWORK-Kontextmenü. Alt+Shift+A (Mac: Control+Shift+A) öffnet das Seitenpanel.",
      },
      {
        title: "Sichere Vorschau prüfen",
        description:
          "Prüfen Sie Titel, URL, markierten Text und Seitenauszug. Kontrollieren Sie [REDACTED]-Ersetzungen und die Prompt-Injection-Warnung; ein Musterabgleich entfernt möglicherweise nicht alle sensiblen Daten.",
      },
      {
        title: "Kontext ergänzen und Typ wählen",
        description:
          "Verwenden Sie bei Bedarf eine Arbeitsvorlage für den Notizentwurf. Prüfen Sie Notiz und Tags und wählen Sie Source, Memory oder Research.",
      },
      {
        title: "Drive verbinden und speichern",
        description:
          "Verbinden Sie Drive nur bei Bedarf. AIWORK verwendet ausschließlich den Bereich drive.appdata und speichert genehmigte Einträge im privaten appDataFolder.",
      },
      {
        title: "Einträge prüfen und Kontrolle behalten",
        description:
          "Prüfen oder löschen Sie Einträge in der Bibliothek, kontrollieren Sie Speicher- und Synchronisationsversuche in der Warteschlange und verwalten Sie Darstellung, Drive und Einwilligungen in den Einstellungen.",
      },
    ],
    captureMethods: [
      "AIWORK-Symbol in der Symbolleiste",
      "Erfassungs-Kürzel Alt+Shift+S (Mac: Control+Shift+S)",
      "AIWORK im Kontextmenü der Seite",
    ],
    recordTypesNote:
      "Source, Memory und Research sind vom Benutzer gewählte Eintragskategorien. Memory bedeutet weder automatisches KI-Gedächtnis noch RAG oder Modelltraining.",
    queueNote:
      "Die Warteschlange zeigt den Status von Hintergrundspeicherung, Drive-Synchronisierung und begrenzten Wiederholungsversuchen; sie ist kein allgemeiner Automatisierungsplaner.",
    controlNote:
      "Das Löschen eines Eintrags entfernt diesen Eintrag. Das Trennen von Drive oder Widerrufen der Einwilligung löscht bereits in Drive gespeicherte Einträge nicht automatisch; löschen Sie sie bei Bedarf ausdrücklich.",
    roadmapWarning:
      "KI-Analyse, RAG, Projekterstellung, Dokument-Upload, automatische Webrecherche, IMAP-Postfachverbindung, E-Mail-Suche, -Klassifizierung oder -Versand und Workflow-Automatisierung sind im genehmigten v1.0 RC nicht enthalten.",
  },
} satisfies Record<Locale, BrowserGuideCopy>;
