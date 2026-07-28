"use client";

import Link from "next/link";
import { messages, type Locale } from "../i18n";
import { PreferenceControls, useSitePreferences } from "../preferences";
import ProductMark from "./ProductMark";

export type SiteSection =
  | "home"
  | "product"
  | "features"
  | "guide"
  | "security"
  | "pricing"
  | "download"
  | "contact";

const guideLabels: Record<Locale, string> = {
  ko: "사용법",
  en: "Guide",
  ja: "使い方",
  "zh-CN": "使用指南",
  ar: "دليل الاستخدام",
  es: "Guía",
  fr: "Guide",
  de: "Anleitung",
};

const navigation: Array<{
  key: SiteSection;
  href: string;
}> = [
  { key: "product", href: "/product" },
  { key: "features", href: "/features" },
  { key: "guide", href: "/how-to-use" },
  { key: "security", href: "/security" },
  { key: "pricing", href: "/pricing" },
  { key: "contact", href: "/contact" },
];

function getNavigationLabel(key: SiteSection, locale: Locale) {
  const copy = messages[locale];
  switch (key) {
    case "product":
      return copy.nav.product;
    case "features":
      return copy.nav.features;
    case "guide":
      return guideLabels[locale];
    case "security":
      return copy.nav.security;
    case "pricing":
      return copy.nav.payments;
    case "contact":
      return copy.nav.contact;
    default:
      return "AIWORK";
  }
}

export default function SiteHeader({
  active = "home",
  context = "work, connected.",
}: {
  active?: SiteSection;
  context?: string;
}) {
  const { locale } = useSitePreferences();
  const copy = messages[locale];

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.aria.skipToContent}
      </a>
      <header className="topbar section-topbar">
        <Link className="brand" href="/" aria-label={copy.aria.home}>
          <ProductMark className="brand-product-mark" />
          <span>AIWORK</span>
          <small>{context}</small>
        </Link>

        <nav
          className="main-nav section-nav"
          aria-label={copy.aria.mainNavigation}
        >
          {navigation.map((item) => (
            <Link
              className={active === item.key ? "active" : ""}
              href={item.href}
              key={item.key}
              aria-current={active === item.key ? "page" : undefined}
            >
              {getNavigationLabel(item.key, locale)}
            </Link>
          ))}
        </nav>

        <div className="header-actions">
          <PreferenceControls />
          <Link className="install-small" href="/download">
            {copy.nav.install}
          </Link>
        </div>
      </header>

      <nav className="section-mobile-nav" aria-label={copy.aria.mainNavigation}>
        {navigation.map((item) => (
          <Link
            className={active === item.key ? "active" : ""}
            href={item.href}
            key={item.key}
            aria-current={active === item.key ? "page" : undefined}
          >
            {getNavigationLabel(item.key, locale)}
          </Link>
        ))}
      </nav>
    </>
  );
}
