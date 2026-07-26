"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  localeInfo,
  messages,
  supportedLocales,
  type Locale,
  type ThemeKey,
} from "./i18n";

const themeKeys: ThemeKey[] = [
  "system",
  "light",
  "dark",
  "aurora",
  "editorial",
  "console",
  "synthwave",
];

const themeColors: Record<ThemeKey, string[]> = {
  system: ["#f8fafc", "#111827", "#7357ff"],
  light: ["#ffffff", "#182033", "#2563eb"],
  dark: ["#090d18", "#eaf0ff", "#8b5cf6"],
  aurora: ["#07091a", "#a78bfa", "#22d3ee"],
  editorial: ["#f4f0e7", "#17336b", "#dc6b3f"],
  console: ["#101614", "#62f5c3", "#1f332d"],
  synthwave: ["#07071b", "#ff3dbb", "#18d8ff"],
};

const sourceIcons = ["⌘", "◇", "✉", "▤"];
const taskIcons = ["▥", "◇", "✓"];
const featureIcons = ["↗", "⌁", "◫"];

const paymentLinks = [
  "https://www.paypal.com/ncp/payment/TF7HCLYC5PM8S",
  "https://www.paypal.com/ncp/payment/WTD5ZEKLT5GJS",
  "https://www.paypal.com/ncp/payment/H5SXU7HJ8GVRE",
];

const supportLink =
  "https://www.paypal.com/ncp/payment/R3NBTNC3KYCVE";

const defaultColors = {
  accent: "#ff3dbb",
  secondary: "#18d8ff",
  background: "#07071b",
};

function isTheme(value: string | null): value is ThemeKey {
  return Boolean(value && themeKeys.includes(value as ThemeKey));
}

function isLocale(value: string | null): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/iu.test(value);
}

function detectLocale(): Locale {
  const queryLocale = new URLSearchParams(window.location.search).get("lang");
  if (isLocale(queryLocale)) return queryLocale;

  const savedLocale = localStorage.getItem("aiwork-locale");
  if (isLocale(savedLocale)) return savedLocale;

  const browserLanguage = navigator.language.toLowerCase();
  if (browserLanguage.startsWith("ar")) return "ar";
  if (browserLanguage.startsWith("es")) return "es";
  if (browserLanguage.startsWith("fr")) return "fr";
  if (browserLanguage.startsWith("de")) return "de";
  if (browserLanguage.startsWith("ja")) return "ja";
  if (browserLanguage.startsWith("zh")) return "zh-CN";
  if (browserLanguage.startsWith("en")) return "en";
  return "ko";
}

function replaceName(template: string, name: string) {
  return template.replace("{name}", name);
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeKey>("synthwave");
  const [locale, setLocale] = useState<Locale>("ko");
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customEnabled, setCustomEnabled] = useState(false);
  const [custom, setCustom] = useState(defaultColors);

  const copy = messages[locale];
  const localeMeta = localeInfo[locale];

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const savedTheme = localStorage.getItem("aiwork-theme");
      if (isTheme(savedTheme)) setTheme(savedTheme);

      try {
        const savedColors = localStorage.getItem("aiwork-custom-colors");
        if (savedColors) {
          const parsed = JSON.parse(savedColors);
          if (
            isHexColor(parsed?.accent) &&
            isHexColor(parsed?.secondary) &&
            isHexColor(parsed?.background)
          ) {
            setCustom(parsed);
            setCustomEnabled(true);
          }
        }
      } catch {
        localStorage.removeItem("aiwork-custom-colors");
      }

      setLocale(detectLocale());
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    localStorage.setItem("aiwork-theme", theme);
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  useEffect(() => {
    if (customEnabled) {
      document.documentElement.dataset.custom = "true";
    } else {
      delete document.documentElement.dataset.custom;
    }
  }, [customEnabled]);

  useEffect(() => {
    localStorage.setItem("aiwork-locale", locale);
    document.documentElement.lang = localeMeta.htmlLang;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.locale = locale;
    document.title = copy.metadata.title;

    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = copy.metadata.description;

    const url = new URL(window.location.href);
    if (locale === "ko") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    window.history.replaceState({}, "", url);
  }, [copy.metadata.description, copy.metadata.title, locale, localeMeta.htmlLang]);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setThemeOpen(false);
        setLanguageOpen(false);
        setCustomOpen(false);
      }
    };
    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, []);

  const customStyle = useMemo(
    () =>
      ({
        "--custom-accent": custom.accent,
        "--custom-secondary": custom.secondary,
        "--custom-background": custom.background,
      }) as React.CSSProperties,
    [custom],
  );

  function chooseTheme(next: ThemeKey) {
    setTheme(next);
    setThemeOpen(false);
  }

  function chooseLocale(next: Locale) {
    setLocale(next);
    setLanguageOpen(false);
  }

  function saveCustom() {
    localStorage.setItem("aiwork-custom-colors", JSON.stringify(custom));
    setCustomEnabled(true);
    setCustomOpen(false);
  }

  function resetCustom() {
    setCustom(defaultColors);
    setCustomEnabled(false);
    localStorage.removeItem("aiwork-custom-colors");
  }

  return (
    <main className="site-shell" id="main-content" style={customStyle}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#home" aria-label={copy.aria.home}>
          <Image
            className="brand-avatar"
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="40"
            height="40"
            unoptimized
          />
          <span>AIWORK</span>
          <small>work, connected.</small>
        </a>

        <nav className="main-nav" aria-label={copy.aria.mainNavigation}>
          <a href="#product">{copy.nav.product}</a>
          <a href="#workflow">{copy.nav.features}</a>
          <a href="#security">{copy.nav.security}</a>
          <a href="#payments">{copy.nav.payments}</a>
          <a href="#contact">{copy.nav.contact}</a>
        </nav>

        <div className="header-actions">
          <div className="language-anchor">
            <button
              className="language-trigger"
              type="button"
              aria-expanded={languageOpen}
              aria-label={copy.aria.languageMenu}
              onClick={() => {
                setLanguageOpen((value) => !value);
                setThemeOpen(false);
              }}
            >
              <span aria-hidden="true">◎</span>
              <b>{localeMeta.shortName}</b>
              <span className="chevron">{languageOpen ? "▲" : "▼"}</span>
            </button>

            {languageOpen && (
              <div className="language-menu" role="menu">
                <div className="theme-menu-head">
                  <div>
                    <strong>{copy.language.title}</strong>
                    <span>{copy.language.note}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLanguageOpen(false)}
                    aria-label={copy.aria.close}
                  >
                    ×
                  </button>
                </div>
                <div className="language-list">
                  {supportedLocales.map((item) => (
                    <button
                      className={`language-option ${locale === item ? "active" : ""}`}
                      type="button"
                      role="menuitem"
                      key={item}
                      onClick={() => chooseLocale(item)}
                      aria-label={replaceName(
                        copy.aria.selectLanguage,
                        localeInfo[item].nativeName,
                      )}
                    >
                      <span>{localeInfo[item].shortName}</span>
                      <strong>{localeInfo[item].nativeName}</strong>
                      {locale === item && <b>✓</b>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="theme-anchor">
            <button
              className="theme-trigger"
              type="button"
              aria-expanded={themeOpen}
              aria-label={copy.aria.themeMenu}
              onClick={() => {
                setThemeOpen((value) => !value);
                setLanguageOpen(false);
              }}
            >
              <span className="palette-icon">◐</span>
              <span className="trigger-label">{copy.themeMenu.trigger}</span>
              <span className="chevron">{themeOpen ? "▲" : "▼"}</span>
            </button>
            {themeOpen && (
              <div className="theme-menu">
                <div className="theme-menu-head">
                  <div>
                    <strong>{copy.themeMenu.title}</strong>
                    <span>{copy.themeMenu.note}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setThemeOpen(false)}
                    aria-label={copy.aria.close}
                  >
                    ×
                  </button>
                </div>
                <div className="theme-grid">
                  {themeKeys.map((item) => (
                    <button
                      className={`theme-option ${theme === item ? "active" : ""}`}
                      type="button"
                      key={item}
                      onClick={() => chooseTheme(item)}
                      aria-label={replaceName(
                        copy.aria.selectTheme,
                        copy.themes[item].name,
                      )}
                    >
                      <span className="swatches">
                        {themeColors[item].map((color) => (
                          <i key={color} style={{ background: color }} />
                        ))}
                      </span>
                      <strong>{copy.themes[item].name}</strong>
                      <small>{copy.themes[item].note}</small>
                      {theme === item && <b>✓</b>}
                    </button>
                  ))}
                </div>
                <button
                  className="custom-link"
                  type="button"
                  onClick={() => {
                    setThemeOpen(false);
                    setCustomOpen(true);
                  }}
                >
                  <span>✦</span>
                  <span>
                    <strong>{copy.themeMenu.customTitle}</strong>
                    <small>{copy.themeMenu.customNote}</small>
                  </span>
                  <b>→</b>
                </button>
              </div>
            )}
          </div>
          <a className="install-small" href="#download">
            {copy.nav.install}
          </a>
        </div>
      </header>

      <section className="hero" id="home">
        <div className="eyebrow">
          <span /> {copy.hero.eyebrow}
        </div>
        <h1>
          {copy.hero.title[0]}
          <br />
          <em>{copy.hero.title[1]}</em>
        </h1>
        <p>
          {copy.hero.description[0]}
          <br className="desktop-only" />
          {copy.hero.description[1]}
        </p>
        <div className="hero-actions">
          <a className="primary-button" href="#download">
            {copy.hero.primaryAction} <span>↗</span>
          </a>
          <a className="secondary-button" href="#product">
            {copy.hero.secondaryAction} <span>↓</span>
          </a>
        </div>
        <div className="trust-row">
          {copy.hero.trust.map((item) => (
            <span key={item}>
              <i>✓</i> {item}
            </span>
          ))}
        </div>
      </section>

      <section className="product-panel" id="product">
        <div className="panel-topline">
          <span>AIWORK / WORKSPACE</span>
          <span className="live">
            <i /> READY
          </span>
        </div>
        <div className="workspace-grid">
          <aside className="source-column">
            <small>SOURCES</small>
            {copy.workspace.sources.map((source, index) => (
              <div className={index === 0 ? "source active" : "source"} key={source}>
                <span>{sourceIcons[index]}</span>
                {source}
              </div>
            ))}
          </aside>
          <div className="conversation-column">
            <small>AIWORK ASSISTANT</small>
            <div className="user-bubble">{copy.workspace.userPrompt}</div>
            <div className="ai-response">
              <Image
                className="assistant-avatar"
                src="/images/aiwork-anime-profile-v1.webp"
                alt={copy.aria.assistantAvatar}
                width="42"
                height="42"
                unoptimized
              />
              <div>
                <strong>{copy.workspace.responseTitle}</strong>
                <p>{copy.workspace.responseBody}</p>
                <div className="progress-lines">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
            </div>
          </div>
          <aside className="studio-column">
            <small>STUDIO PANEL</small>
            <strong>{copy.workspace.nextWork}</strong>
            {copy.workspace.tasks.map((item, index) => (
              <button key={item}>
                <span>{taskIcons[index]}</span>
                {item}
                <b>＋</b>
              </button>
            ))}
            <div className="source-badge">
              {copy.workspace.evidenceLabel} <strong>8</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="feature-section" id="workflow">
        <div className="section-heading">
          <span>{copy.features.eyebrow}</span>
          <h2>
            {copy.features.title[0]}
            <br />
            {copy.features.title[1]}
          </h2>
        </div>
        <div className="feature-grid">
          {copy.features.cards.map((card, index) => (
            <article key={card.label}>
              <span className="feature-icon">{featureIcons[index]}</span>
              <small>{card.label}</small>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <a href="#contact">{copy.features.details} →</a>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="security">
        <div>
          <span className="section-kicker">{copy.workflow.eyebrow}</span>
          <h2>
            {copy.workflow.title[0]}
            <br />
            {copy.workflow.title[1]}
          </h2>
          <p>{copy.workflow.description}</p>
        </div>
        <div className="steps">
          {copy.workflow.steps.map((step) => (
            <article key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="payment-section" id="payments">
        <div className="payment-heading">
          <div>
            <span className="section-kicker">{copy.payments.eyebrow}</span>
            <h2>
              {copy.payments.title[0]}
              <br />
              {copy.payments.title[1]}
            </h2>
            <p>{copy.payments.description}</p>
          </div>
          <div className="payment-status">
            <span>{copy.payments.statusLabel}</span>
            <strong>
              <i /> {copy.payments.status}
            </strong>
          </div>
        </div>

        <p className="payment-disclaimer">{copy.payments.disclaimer}</p>

        <div className="pricing-grid">
          {copy.payments.products.map((product, index) => (
            <article
              className={`price-card ${index === 0 ? "featured" : ""}`}
              key={product.name}
            >
              {index === 0 && <span className="recommended">RECOMMENDED</span>}
              <small className="product-name">{product.name}</small>
              <div className="price">
                <strong>
                  <bdi dir="ltr">{product.price}</bdi>
                </strong>
                <span>{product.billing}</span>
              </div>
              <ul>
                {product.features.map((feature) => (
                  <li key={feature}>
                    <i>✓</i> {feature}
                  </li>
                ))}
              </ul>
              <a
                className={index === 0 ? "primary-button payment-button" : "secondary-button payment-button"}
                href={paymentLinks[index]}
                target="_blank"
                rel="noopener noreferrer"
              >
                {product.action} <span>↗</span>
              </a>
            </article>
          ))}
        </div>

        <div className="support-card">
          <Image
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="64"
            height="64"
            unoptimized
          />
          <div>
            <span>{copy.payments.supportTitle}</span>
            <p>{copy.payments.supportDescription}</p>
          </div>
          <a
            className="secondary-button"
            href={supportLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            {copy.payments.supportAction} <span>↗</span>
          </a>
        </div>
      </section>

      <section className="cta-section" id="download">
        <span>{copy.cta.eyebrow}</span>
        <h2>
          {copy.cta.title[0]}
          <br />
          {copy.cta.title[1]}
        </h2>
        <p>{copy.cta.description}</p>
        <div>
          <a
            className="primary-button"
            href={`mailto:cakecnc@daum.net?subject=${encodeURIComponent("AIWORK release update")}`}
          >
            {copy.cta.releaseAlert} <span>↗</span>
          </a>
          <a className="secondary-button" href="#contact">
            {copy.cta.consultation}
          </a>
        </div>
      </section>

      <footer id="contact">
        <div className="brand footer-brand">
          <Image
            className="brand-avatar"
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="36"
            height="36"
            unoptimized
          />
          <span>AIWORK</span>
        </div>
        <p>{copy.footer.tagline}</p>
        <div className="footer-links">
          <Link href="/privacy">Privacy</Link>
          <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
        </div>
        <small>{copy.footer.copyright}</small>
      </footer>

      {customOpen && (
        <div
          className="custom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={copy.aria.customColorDialog}
        >
          <button
            className="overlay-close"
            aria-label={copy.aria.close}
            onClick={() => setCustomOpen(false)}
          />
          <section className="custom-panel">
            <div className="custom-head">
              <div>
                <span>{copy.customColors.eyebrow}</span>
                <h2>{copy.customColors.title}</h2>
                <p>{copy.customColors.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setCustomOpen(false)}
                aria-label={copy.aria.close}
              >
                ×
              </button>
            </div>
            <div className="custom-preview" style={{ background: custom.background }}>
              <span style={{ background: custom.accent }}>AIWORK</span>
              <strong style={{ color: custom.secondary }}>
                {copy.customColors.previewTagline}
              </strong>
              <i
                style={{
                  background: `linear-gradient(90deg, ${custom.accent}, ${custom.secondary})`,
                }}
              />
            </div>
            <div className="color-controls">
              {(
                [
                  ["accent", copy.customColors.accent],
                  ["secondary", copy.customColors.secondary],
                  ["background", copy.customColors.background],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <span>
                    {label}
                    <small>{custom[key].toUpperCase()}</small>
                  </span>
                  <input
                    type="color"
                    value={custom[key]}
                    onChange={(event) =>
                      setCustom({ ...custom, [key]: event.target.value })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="custom-actions">
              <button type="button" onClick={resetCustom}>
                {copy.customColors.reset}
              </button>
              <button type="button" className="save-custom" onClick={saveCustom}>
                {copy.customColors.apply}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}
