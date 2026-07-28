"use client";

import Link from "next/link";
import { messages, type Locale } from "../i18n";
import { useSitePreferences } from "../preferences";
import { DONATION_URL, SUPPORT_EMAIL } from "../site-config";
import ProductMark from "./ProductMark";

export const shakespeareNotice =
  "As Shakespeare reminds us, “What’s past is prologue.” In that spirit, certain portions of this document have been prepared with reference to AI-assisted materials. All rights, licenses, and editorial responsibility pertaining to this work are retained by its author, Sungjae Lim, Director of Planning.";

const footerLabels: Record<
  Locale,
  {
    guide: string;
    privacy: string;
    businessNumber: string;
    support: string;
  }
> = {
  ko: {
    guide: "사용법",
    privacy: "개인정보처리방침",
    businessNumber: "사업자등록번호",
    support: "고객센터",
  },
  en: {
    guide: "Guide",
    privacy: "Privacy",
    businessNumber: "Business registration",
    support: "Support",
  },
  ja: {
    guide: "使い方",
    privacy: "プライバシー",
    businessNumber: "事業者登録番号",
    support: "サポート",
  },
  "zh-CN": {
    guide: "使用指南",
    privacy: "隐私政策",
    businessNumber: "营业执照号码",
    support: "客户支持",
  },
  ar: {
    guide: "دليل الاستخدام",
    privacy: "الخصوصية",
    businessNumber: "رقم تسجيل الشركة",
    support: "الدعم",
  },
  es: {
    guide: "Guía",
    privacy: "Privacidad",
    businessNumber: "Registro mercantil",
    support: "Soporte",
  },
  fr: {
    guide: "Guide",
    privacy: "Confidentialité",
    businessNumber: "Immatriculation",
    support: "Assistance",
  },
  de: {
    guide: "Anleitung",
    privacy: "Datenschutz",
    businessNumber: "Unternehmensnummer",
    support: "Support",
  },
};

export default function SiteFooter() {
  const { locale } = useSitePreferences();
  const copy = messages[locale];
  const labels = footerLabels[locale];

  return (
    <footer className="site-footer" id="site-footer">
      <section
        className="support-card sitewide-support"
        data-sitewide-support="true"
        aria-labelledby="sitewide-support-title"
      >
        <ProductMark className="support-product-mark" />
        <div>
          <span id="sitewide-support-title">{copy.payments.supportTitle}</span>
          <p>{copy.payments.supportDescription}</p>
        </div>
        <a
          className="secondary-button"
          href={DONATION_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          {copy.payments.supportAction} <span>↗</span>
        </a>
      </section>

      <div className="footer-intro">
        <Link className="brand footer-brand" href="/">
          <ProductMark className="footer-product-mark" />
          <span>AIWORK</span>
        </Link>
        <p>{copy.footer.tagline}</p>
      </div>

      <div className="footer-links">
        <Link href="/product">{copy.nav.product}</Link>
        <Link href="/how-to-use">{labels.guide}</Link>
        <Link href="/security">{copy.nav.security}</Link>
        <Link href="/privacy">{labels.privacy}</Link>
        <Link href="/contact">{copy.nav.contact}</Link>
      </div>

      <address className="business-details">
        <strong>주식회사 씨엔씨코퍼레이션</strong>
        <span>{labels.businessNumber} 140-81-50087</span>
        <span>
          경기도 부천시 원미구 부천로198번길 36
          <br />
          (춘의동, 춘의테크노파크 102-208)
        </span>
        <span>
          {labels.support} <a href="tel:0806647077">080-664-7077</a>
          {" · "}
          <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
        </span>
      </address>

      <div className="footer-legal">
        <small>
          {copy.footer.copyright} A service of C&amp;C Corporation.
        </small>
        <p lang="en">{shakespeareNotice}</p>
      </div>
    </footer>
  );
}
