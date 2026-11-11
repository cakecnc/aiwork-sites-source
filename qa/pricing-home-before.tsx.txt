"use client";

import "./home-spacing.css";

import AvailabilityNotice from "./components/AvailabilityNotice";
import { ActualScreenshots, ProAccessNotice } from "./components/ProductEvidence";

import { useEffect } from "react";
import Link from "next/link";
import { homeWorkbenchMessages } from "./home-workbench-i18n";
import { messages, type Locale } from "./i18n";
import ProductMark from "./components/ProductMark";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useSitePreferences } from "./preferences";
import {
  PURCHASE_PRODUCTS,
  SUPPORT_EMAIL,
  purchaseInquiryHref,
} from "./site-config";

const contextIcons = ["AI", "⌁", "≠", "◇"];
const roleIcons = ["01", "AI", "✓"];
const actionIcons = ["R", "↗", "@"];

type DigitalProductsCopy = {
  eyebrow: string;
  title: string;
  description: string;
  digitalLabel: string;
  shippingLabel: string;
  termLabel: string;
  action: string;
  products: Array<{
    name: string;
    price: string;
    description: string;
    href: string;
  }>;
};

const digitalProductsCopy: Record<Locale, DigitalProductsCopy> = {
  ko: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "전문 작업을 위한 디지털 도구",
    description: "결제 확인 후 등록 코드를 발급하는 1년 이용권입니다. 실물 상품이 아니므로 배송지 입력과 배송비가 없습니다.",
    digitalLabel: "디지털 콘텐츠",
    shippingLabel: "실물 배송 없음 · 배송비 0원",
    termLabel: "1년 이용권",
    action: "제품 자세히 보기",
    products: [
      {
        name: "Research Pro",
        price: "$120 / 1년",
        description: "출처 중심 조사 흐름과 다국어 안내를 갖춘 전문 리서치 도구입니다.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / 1년",
        description: "승인된 로컬 보안 점검을 안전하게 안내하며 파일을 서버로 전송하지 않습니다.",
        href: "/hashcat",
      },
    ],
  },
  en: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "Digital tools for focused professional work",
    description: "One-year access is activated by a registration code after payment verification. Nothing is shipped, so no delivery address or shipping fee is required.",
    digitalLabel: "Digital content",
    shippingLabel: "No physical delivery · No shipping fee",
    termLabel: "1-year access",
    action: "View product details",
    products: [
      {
        name: "Research Pro",
        price: "$120 / year",
        description: "A professional research workspace with evidence-led steps and multilingual guidance.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / year",
        description: "Guidance for authorized local security checks without uploading files to a server.",
        href: "/hashcat",
      },
    ],
  },
  ja: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "専門作業のためのデジタルツール",
    description: "支払い確認後に登録コードを発行する1年間の利用権です。物理配送、配送先入力、送料はありません。",
    digitalLabel: "デジタルコンテンツ",
    shippingLabel: "物理配送なし・送料0円",
    termLabel: "1年間利用",
    action: "製品詳細を見る",
    products: [
      {
        name: "Research Pro",
        price: "$120 / 1年",
        description: "根拠を重視した調査フローと多言語ガイドを備えた専門リサーチツールです。",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / 1年",
        description: "ファイルをサーバーへ送信せず、許可されたローカルセキュリティ確認を案内します。",
        href: "/hashcat",
      },
    ],
  },
  "zh-CN": {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "面向专业工作的数字工具",
    description: "付款核验后发放注册码，使用期为一年。无需实物配送、收货地址或运费。",
    digitalLabel: "数字内容",
    shippingLabel: "无实物配送 · 运费为0",
    termLabel: "一年使用权",
    action: "查看产品详情",
    products: [
      {
        name: "Research Pro",
        price: "$120 / 年",
        description: "提供以证据为核心的研究流程和多语言指南。",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / 年",
        description: "用于经授权的本地安全检查，文件不会上传到服务器。",
        href: "/hashcat",
      },
    ],
  },
  ar: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "أدوات رقمية للعمل المهني",
    description: "صلاحية رقمية لمدة عام تُفعّل برمز تسجيل بعد التحقق من الدفع. لا يوجد شحن مادي أو عنوان تسليم أو رسوم شحن.",
    digitalLabel: "محتوى رقمي",
    shippingLabel: "لا شحن مادي · رسوم الشحن صفر",
    termLabel: "صلاحية سنة",
    action: "عرض تفاصيل المنتج",
    products: [
      {
        name: "Research Pro",
        price: "$120 / سنة",
        description: "مساحة بحث احترافية بخطوات قائمة على الأدلة وإرشادات متعددة اللغات.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / سنة",
        description: "إرشادات لفحوص أمنية محلية مصرح بها دون رفع الملفات إلى الخادم.",
        href: "/hashcat",
      },
    ],
  },
  es: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "Herramientas digitales para trabajo profesional",
    description: "Acceso digital por un año mediante un código emitido tras verificar el pago. No hay entrega física, dirección de envío ni gastos de envío.",
    digitalLabel: "Contenido digital",
    shippingLabel: "Sin entrega física · Envío gratis",
    termLabel: "Acceso por 1 año",
    action: "Ver detalles",
    products: [
      {
        name: "Research Pro",
        price: "$120 / año",
        description: "Un espacio profesional de investigación con pasos basados en evidencia y guía multilingüe.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / año",
        description: "Guía para comprobaciones locales de seguridad autorizadas sin subir archivos al servidor.",
        href: "/hashcat",
      },
    ],
  },
  fr: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "Des outils numériques pour le travail professionnel",
    description: "Accès numérique d’un an activé par un code après vérification du paiement. Aucun produit physique, aucune adresse de livraison et aucun frais de port.",
    digitalLabel: "Contenu numérique",
    shippingLabel: "Aucune livraison · Frais de port 0",
    termLabel: "Accès 1 an",
    action: "Voir le produit",
    products: [
      {
        name: "Research Pro",
        price: "$120 / an",
        description: "Un espace de recherche professionnel fondé sur les sources avec un guide multilingue.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / an",
        description: "Un guide pour les contrôles de sécurité locaux autorisés, sans téléversement de fichiers.",
        href: "/hashcat",
      },
    ],
  },
  de: {
    eyebrow: "C&C DIGITAL TOOLS",
    title: "Digitale Werkzeuge für professionelle Aufgaben",
    description: "Ein Jahr digitaler Zugriff per Registrierungscode nach Zahlungsprüfung. Kein physischer Versand, keine Lieferadresse und keine Versandkosten.",
    digitalLabel: "Digitaler Inhalt",
    shippingLabel: "Kein Versand · 0 Versandkosten",
    termLabel: "1 Jahr Zugriff",
    action: "Produktdetails ansehen",
    products: [
      {
        name: "Research Pro",
        price: "$120 / Jahr",
        description: "Ein professioneller Recherchebereich mit belegorientiertem Ablauf und mehrsprachiger Anleitung.",
        href: "/research",
      },
      {
        name: "Hashcat Pro",
        price: "$55 / Jahr",
        description: "Anleitung für autorisierte lokale Sicherheitsprüfungen ohne Datei-Upload auf einen Server.",
        href: "/hashcat",
      },
    ],
  },
};

export default function Home() {
  const { locale, ready } = useSitePreferences();
  const copy = messages[locale];
  const home = homeWorkbenchMessages[locale];

  useEffect(() => {
    if (!ready) return;
    document.title = home.metadata.title;

    let description = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]',
    );
    if (!description) {
      description = document.createElement("meta");
      description.name = "description";
      document.head.appendChild(description);
    }
    description.content = home.metadata.description;
  }, [home.metadata.description, home.metadata.title, ready]);

  return (
    <main className="site-shell home-shell" id="main-content">
      <SiteHeader active="home" context={home.brandContext} />
      <AvailabilityNotice />

      <section className="hero home-hero" id="home">
        <div className="home-hero-intro">
          <ProductMark className="home-product-mark" />
          <div className="eyebrow">
            <span /> {home.hero.eyebrow}
          </div>
        </div>
        <h1>
          {home.hero.title[0]}
          <br />
          <em>{home.hero.title[1]}</em>
        </h1>
        <p>{home.hero.description}</p>
        <div className="hero-actions">
          <a className="primary-button" href="#how-it-works">
            {home.hero.primaryAction} <span>↓</span>
          </a>
          <a className="secondary-button" href="#capabilities">
            {home.hero.secondaryAction} <span>↗</span>
          </a>
        </div>
        <nav className="hero-actions" aria-label={digitalProductsCopy[locale].title}>
          <Link className="secondary-button" href="/research">RESEARCH <span aria-hidden="true">↗</span></Link>
          <Link className="secondary-button" href="/hashcat">HASHCAT <span aria-hidden="true">↗</span></Link>
        </nav>
        <div className="trust-row">
          {home.hero.trust.map((item) => (
            <span key={item}>
              <i>✓</i> {item}
            </span>
          ))}
        </div>
      </section>

      <ActualScreenshots />
      <ProAccessNotice />

      <section className="home-capability-section" id="capabilities">
        <div className="home-section-heading">
          <span>{home.capabilities.eyebrow}</span>
          <div>
            <h2>{home.capabilities.title}</h2>
            <p>{home.capabilities.description}</p>
          </div>
        </div>
        <div className="home-capability-grid">
          {home.capabilities.cards.map((card) => (
            <article key={card.title}>
              <div className="home-capability-card-top">
                <h3>{card.title}</h3>
                <b>{card.status}</b>
              </div>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-workbench" id="product" aria-labelledby="workbench-title">
        <div className="home-workbench-topline">
          <span id="workbench-title">{home.workbench.eyebrow}</span>
          <span className="live">
            <i /> {home.workbench.status}
          </span>
        </div>
        <div className="home-workbench-grid">
          <div className="home-browser-column">
            <div className="home-browser-bar" aria-hidden="true">
              <i />
              <i />
              <i />
              <span>aiwork.to</span>
            </div>
            <small>{home.workbench.contextTitle}</small>
            <div className="home-browser-page">
              <span>AIWORK BROWSER</span>
              <h3>{home.hero.title.join(" ")}</h3>
              <p>{home.hero.description}</p>
            </div>
            <div className="home-context-list">
              {home.workbench.contexts.map((context, index) => (
                <div className={index === 0 ? "active" : ""} key={context}>
                  <span>{contextIcons[index]}</span>
                  <strong>{context}</strong>
                </div>
              ))}
            </div>
          </div>

          <aside className="home-conversation-column">
            <small>{home.workbench.conversationTitle}</small>
            <div className="home-user-prompt">{home.workbench.prompt}</div>
            <div className="home-ai-answer">
              <ProductMark className="assistant-product-mark" />
              <div>
                <strong>{home.workbench.responseTitle}</strong>
                <p>{home.workbench.responseBody}</p>
              </div>
            </div>
            <small className="home-status-title">{home.workbench.actionTitle}</small>
            <div className="home-action-list">
              {home.workbench.actions.map((action, index) => (
                <div key={action}>
                  <span>{actionIcons[index]}</span>
                  <strong>{action}</strong>
                  <b>{["LOCAL BUILD", "OPT-IN", "LOCAL BUILD"][index]}</b>
                </div>
              ))}
            </div>
            <div className="home-evidence">{home.workbench.evidence}</div>
          </aside>
        </div>
      </section>

      <section className="home-role-section" id="roles">
        <div className="home-section-heading">
          <span>{home.roles.eyebrow}</span>
          <div>
            <h2>{home.roles.title}</h2>
            <p>{home.roles.description}</p>
          </div>
        </div>
        <div className="home-role-grid">
          {home.roles.cards.map((card, index) => (
            <article key={card.title}>
              <span>{roleIcons[index]}</span>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="home-flow-section" id="how-it-works">
        <div className="home-flow-copy">
          <span>{home.workflow.eyebrow}</span>
          <h2>{home.workflow.title}</h2>
          <p>{home.workflow.description}</p>
        </div>
        <ol className="home-flow-list">
          {home.workflow.steps.map((step) => (
            <li key={step.number}>
              <span>{step.number}</span>
              <div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section className="home-capability-section home-digital-section" id="digital-tools">
        <div className="home-section-heading">
          <span>{digitalProductsCopy[locale].eyebrow}</span>
          <div>
            <h2>{digitalProductsCopy[locale].title}</h2>
            <p>{digitalProductsCopy[locale].description}</p>
          </div>
        </div>
        <div className="home-capability-grid home-digital-grid">
          {digitalProductsCopy[locale].products.map((product) => (
            <article className="home-digital-card" key={product.name}>
              <div className="home-capability-card-top">
                <h3><Link href={product.href}>{product.name}</Link></h3>
                <b>{product.price}</b>
              </div>
              <p>{product.description}</p>
              <div className="home-digital-meta" aria-label={digitalProductsCopy[locale].digitalLabel}>
                <span>{digitalProductsCopy[locale].digitalLabel}</span>
                <span>{digitalProductsCopy[locale].shippingLabel}</span>
                <span>{digitalProductsCopy[locale].termLabel}</span>
              </div>
              <a
                className="secondary-button home-digital-action"
                href={product.href}
              >
                {digitalProductsCopy[locale].action} <span>↗</span>
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="home-boundary-section" id="security">
        <div className="home-boundary-copy">
          <span>{home.boundary.eyebrow}</span>
          <h2>{home.boundary.title}</h2>
          <p>{home.boundary.description}</p>
        </div>
        <div className="home-boundary-grid">
          {home.boundary.items.map((item, index) => (
            <article key={item.title}>
              <span>0{index + 1}</span>
              <div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            </article>
          ))}
        </div>
        <details className="home-runtime-details">
          <summary>{home.boundary.advancedSummary}</summary>
          <p>{home.boundary.advancedBody}</p>
        </details>
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
              <Link
                className={
                  index === 0
                    ? "primary-button payment-button"
                    : "secondary-button payment-button"
                }
                href={purchaseInquiryHref(PURCHASE_PRODUCTS[index].id)}
              >
                {product.action} <span>↗</span>
              </Link>
            </article>
          ))}
        </div>

      </section>

      <section className="cta-section home-cta" id="download">
        <span>{home.cta.eyebrow}</span>
        <h2>{home.cta.title}</h2>
        <p>{home.cta.description}</p>
        <div>
          <Link className="primary-button" href="/features">
            {home.cta.primaryAction} <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/contact">
            {home.cta.secondaryAction}
          </Link>
        </div>
        <a
          className="home-release-email"
          href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("AIWORK release update")}`}
        >
          {copy.cta.releaseAlert}
        </a>
      </section>

      <SiteFooter />
    </main>
  );
}
