"use client";

import type { ReactNode } from "react";
import type { Locale } from "../i18n";
import { useSitePreferences } from "../preferences";

const privacyCopy: Record<
  Locale,
  {
    title: string;
    description: string;
    version: string;
    effective: string;
    product: string;
    englishNote: string;
  }
> = {
  ko: {
    title: "개인정보처리방침",
    description:
      "AIWORK Browser는 사용자가 직접 요청한 현재 탭만 처리합니다. 이 문서는 확장프로그램이 어떤 데이터를 언제 읽고, 어디에 얼마나 보관하며, 사용자가 이를 어떻게 삭제하거나 철회할 수 있는지 설명합니다.",
    version: "정책 버전",
    effective: "시행일",
    product: "제품 버전",
    englishNote: "영문 요약",
  },
  en: {
    title: "Privacy Policy",
    description:
      "AIWORK Browser processes only the active tab you explicitly ask it to capture. This policy explains what is read, where it is stored, how long it is retained, and how you can delete data or withdraw consent.",
    version: "Policy version",
    effective: "Effective",
    product: "Product version",
    englishNote: "English summary",
  },
  ja: {
    title: "プライバシーポリシー",
    description:
      "AIWORK Browserは、ユーザーが明示的に収集を依頼した現在のタブのみを処理します。読み取る情報、保存先、保持期間、削除および同意撤回の方法を説明します。",
    version: "ポリシー版",
    effective: "施行日",
    product: "製品版",
    englishNote: "英語版の要約",
  },
  "zh-CN": {
    title: "隐私政策",
    description:
      "AIWORK Browser 仅处理用户明确要求采集的当前标签页。本政策说明读取的数据、存储位置、保留期限，以及删除数据或撤回同意的方法。",
    version: "政策版本",
    effective: "生效日期",
    product: "产品版本",
    englishNote: "英文摘要",
  },
  ar: {
    title: "سياسة الخصوصية",
    description:
      "يعالج AIWORK Browser علامة التبويب النشطة التي تطلب صراحةً التقاطها فقط. توضح هذه السياسة البيانات المقروءة ومكان حفظها ومدة الاحتفاظ بها وكيفية حذفها أو سحب الموافقة.",
    version: "إصدار السياسة",
    effective: "تاريخ السريان",
    product: "إصدار المنتج",
    englishNote: "ملخص باللغة الإنجليزية",
  },
  es: {
    title: "Política de privacidad",
    description:
      "AIWORK Browser solo procesa la pestaña activa que solicitas capturar de forma explícita. Esta política explica qué se lee, dónde se guarda, durante cuánto tiempo y cómo eliminar datos o retirar el consentimiento.",
    version: "Versión de la política",
    effective: "Vigente desde",
    product: "Versión del producto",
    englishNote: "Resumen en inglés",
  },
  fr: {
    title: "Politique de confidentialité",
    description:
      "AIWORK Browser traite uniquement l’onglet actif que vous demandez explicitement de capturer. Cette politique explique les données lues, leur stockage, leur durée de conservation et les moyens de les supprimer ou de retirer votre consentement.",
    version: "Version de la politique",
    effective: "Entrée en vigueur",
    product: "Version du produit",
    englishNote: "Résumé en anglais",
  },
  de: {
    title: "Datenschutzerklärung",
    description:
      "AIWORK Browser verarbeitet nur den aktiven Tab, dessen Erfassung Sie ausdrücklich auslösen. Diese Erklärung beschreibt gelesene Daten, Speicherort, Aufbewahrungsdauer sowie Löschung und Widerruf.",
    version: "Richtlinienversion",
    effective: "Gültig ab",
    product: "Produktversion",
    englishNote: "Englische Zusammenfassung",
  },
};

export function PrivacyHero({
  policyVersion,
  effectiveDate,
}: {
  policyVersion: string;
  effectiveDate: string;
}) {
  const { locale } = useSitePreferences();
  const copy = privacyCopy[locale];

  return (
    <header className="privacy-hero">
      <span className="section-kicker">AIWORK BROWSER · PRIVACY</span>
      <h1>{copy.title}</h1>
      <p>{copy.description}</p>
      <div className="policy-meta" aria-label={copy.title}>
        <span>
          {copy.version} <b>{policyVersion}</b>
        </span>
        <span>
          {copy.effective}{" "}
          <time dateTime={effectiveDate}>{effectiveDate}</time>
        </span>
        <span>
          {copy.product} <b>AIWORK Browser 1.0</b>
        </span>
      </div>
      {locale !== "ko" && (
        <p className="privacy-language-note">
          {copy.englishNote} ↓
        </p>
      )}
    </header>
  );
}

export function KoreanPrivacyDetails({ children }: { children: ReactNode }) {
  const { locale } = useSitePreferences();
  return locale === "ko" ? children : null;
}
