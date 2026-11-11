"use client";
import { useSitePreferences } from "../preferences";
const copy = {
  ko: ["현재 제공 범위", "공식 사이트 운영 · 데스크톱 개발 빌드 구현", "macOS 앱의 현재 구현과 공개 배포 준비 상태를 구분해 안내합니다. 이 사이트에서 앱·계정·모델을 자동 연결하지 않습니다. 실제 앱 캡처와 구성 설명용 예시는 각각 표시했습니다."],
  "en": ["Available today", "Website live · Desktop development build", "The macOS app has implemented features; general public distribution remains pending. This site does not automatically connect apps, accounts or models. Actual app captures and workflow illustrations are labeled separately."],
  "ja": ["現在の状況", "公式サイト公開・デスクトップ開発ビルド", "macOSアプリの実装と一般公開の準備を区別して案内します。本サイトはアプリ・アカウント・モデルを自動接続しません。実際のアプリ画像と説明用の図は、それぞれ区別して表示しています。"],
  "zh-CN": ["当前状态", "网站已上线 · 桌面开发版", "区分 macOS 应用已实现的功能与公开发布准备。本网站不会自动连接应用、账户或模型。实际应用截图与流程示意图分别标注。"],
  "ar": ["الحالة الحالية", "الموقع متاح · نسخة تطوير لسطح المكتب", "نميز ميزات تطبيق macOS المنفذة عن الإصدار العام قيد الإعداد. لا يربط الموقع التطبيقات أو الحسابات أو النماذج تلقائيًا. تم تمييز لقطات التطبيق الفعلية عن الرسوم التوضيحية."],
  "es": ["Estado actual", "Sitio disponible · Versión de desarrollo", "Distinguimos las funciones implementadas en macOS de la publicación general pendiente. Este sitio no conecta apps, cuentas ni modelos automáticamente. Las capturas reales y las ilustraciones se identifican por separado."],
  "fr": ["État actuel", "Site en ligne · Version de développement", "Les fonctions macOS implémentées sont distinguées de la publication générale en préparation. Ce site ne connecte pas automatiquement applications, comptes ou modèles. Les captures réelles et les illustrations sont identifiées séparément."],
  "de": ["Aktueller Stand", "Website verfügbar · Entwicklungsbuild", "Implementierte macOS-Funktionen werden von der noch ausstehenden allgemeinen Veröffentlichung getrennt. Diese Website verbindet Apps, Konten oder Modelle nicht automatisch. Echte App-Aufnahmen und Ablaufillustrationen sind getrennt gekennzeichnet."],
};
export default function AvailabilityNotice() {
 const { locale } = useSitePreferences(); const text = copy[locale];
 return <aside className="availability-notice"><span>{text[0]}</span><strong>{text[1]}</strong><p>{text[2]}</p></aside>;
}
