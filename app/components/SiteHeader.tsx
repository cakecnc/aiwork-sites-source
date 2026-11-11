"use client";

import { useEffect, useRef } from "react";
import { messages, type Locale } from "../i18n";
import { PreferenceControls, useSitePreferences } from "../preferences";
import ProductMark from "./ProductMark";

export type SiteSection =
  | "home"
  | "product"
  | "features"
  | "guide"
  | "security"
  | "research"
  | "hashcat"
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
  { key: "research", href: "/research" },
  { key: "hashcat", href: "/hashcat" },
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
    case "research":
      return "RESEARCH";
    case "hashcat":
      return "HASHCAT";
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
  const header = useRef<HTMLElement>(null);

  useEffect(() => {
    const element = header.current;
    if (!element) return;

    const root = document.documentElement;
    const previousHeight = root.style.getPropertyValue("--header-height");
    let measuredHeight = "";
    const updateHeight = () => {
      const nextHeight = `${Math.ceil(element.getBoundingClientRect().height)}px`;
      if (nextHeight === measuredHeight) return;
      measuredHeight = nextHeight;
      root.style.setProperty("--header-height", nextHeight);
    };

    // The expanded navigation can wrap when the viewport or language changes.
    // Reserve its actual height so content and anchor targets stay visible.
    const observer = typeof ResizeObserver === "undefined"
      ? null
      : new ResizeObserver(updateHeight);
    observer?.observe(element);
    window.addEventListener("resize", updateHeight, { passive: true });
    updateHeight();

    return () => {
      observer?.disconnect();
      window.removeEventListener("resize", updateHeight);
      if (root.style.getPropertyValue("--header-height") === measuredHeight) {
        if (previousHeight) root.style.setProperty("--header-height", previousHeight);
        else root.style.removeProperty("--header-height");
      }
    };
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">
        {copy.aria.skipToContent}
      </a>
      <header
        ref={header}
        className="topbar section-topbar unified-header"
        data-locale={locale}
        data-navigation="expanded"
        data-cinematic-surface="header"
      >
        <a className="brand" href="/" aria-label={copy.aria.home}>
          <ProductMark className="brand-product-mark" />
          <span>AIWORK</span>
          <small>{context}</small>
        </a>

        <div className="header-panel" id="aiwork-header-panel">
          <nav
            className="main-nav section-nav"
            aria-label={copy.aria.mainNavigation}
          >
            {navigation.map((item) => (
              <a
                className={active === item.key ? "active" : ""}
                href={item.href}
                key={item.key}
                aria-current={active === item.key ? "page" : undefined}
              >
                {getNavigationLabel(item.key, locale)}
              </a>
            ))}
          </nav>

          <div className="header-actions">
            <PreferenceControls />
            <a className="install-small" href="/download">
              {copy.nav.install}
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
