"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { messages } from "./i18n";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useSitePreferences } from "./preferences";
import {
  DONATION_URL,
  PURCHASE_PRODUCTS,
  SUPPORT_EMAIL,
  purchaseInquiryHref,
} from "./site-config";

const sourceIcons = ["⌘", "◇", "✉", "▤"];
const taskIcons = ["▥", "◇", "✓"];
const featureIcons = ["↗", "⌁", "◫"];

export default function Home() {
  const { locale, ready } = useSitePreferences();
  const copy = messages[locale];

  useEffect(() => {
    if (!ready) return;
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
  }, [copy.metadata.description, copy.metadata.title, ready]);

  return (
    <main className="site-shell" id="main-content">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <SiteHeader active="home" />

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
          <Link className="primary-button" href="/download">
            {copy.hero.primaryAction} <span>↗</span>
          </Link>
          <Link className="secondary-button" href="/product">
            {copy.hero.secondaryAction} <span>↓</span>
          </Link>
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
          <span>{copy.status.productVision}</span>
          <span className="live">
            <i /> {copy.status.releaseCandidate}
          </span>
        </div>
        <div className="workspace-grid">
          <aside className="source-column">
            <small>{copy.status.current}</small>
            {copy.workspace.sources.map((source, index) => (
              <div className={index === 0 ? "source active" : "source"} key={source}>
                <span>{sourceIcons[index]}</span>
                {source}
              </div>
            ))}
          </aside>
          <div className="conversation-column">
            <small>{copy.status.browserCapture}</small>
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
              </div>
            </div>
          </div>
          <aside className="studio-column">
            <small>{copy.status.current}</small>
            <strong>{copy.workspace.nextWork}</strong>
            {copy.workspace.tasks.map((item, index) => (
              <div className="studio-task" key={item}>
                <span>{taskIcons[index]}</span>
                {item}
                <b>＋</b>
              </div>
            ))}
            <div className="source-badge">
              {copy.workspace.evidenceLabel}
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
              <small>
                {card.label} · {index === 0 ? copy.status.current : copy.status.roadmap}
              </small>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
              <Link
                href={
                  index === 0
                    ? "/features"
                    : index === 1
                      ? "/how-to-use"
                      : "/security"
                }
              >
                {copy.features.details} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section" id="how-it-works">
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
              <Link
                className={index === 0 ? "primary-button payment-button" : "secondary-button payment-button"}
                href={purchaseInquiryHref(PURCHASE_PRODUCTS[index].id)}
              >
                {product.action} <span>↗</span>
              </Link>
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
            href={DONATION_URL}
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
            href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent("AIWORK release update")}`}
          >
            {copy.cta.releaseAlert} <span>↗</span>
          </a>
          <Link className="secondary-button" href="/contact">
            {copy.cta.consultation}
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
