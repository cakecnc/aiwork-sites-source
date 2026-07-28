"use client";

import { useEffect } from "react";
import Link from "next/link";
import { homeWorkbenchMessages } from "./home-workbench-i18n";
import { messages } from "./i18n";
import ProductMark from "./components/ProductMark";
import SiteFooter from "./components/SiteFooter";
import SiteHeader from "./components/SiteHeader";
import { useSitePreferences } from "./preferences";
import {
  DONATION_URL,
  PURCHASE_PRODUCTS,
  SUPPORT_EMAIL,
  purchaseInquiryHref,
} from "./site-config";

const contextIcons = ["AI", "⌁", "≠", "◇"];
const roleIcons = ["01", "AI", "✓"];
const actionIcons = ["R", "↗", "@"];

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

      <section className="hero home-hero" id="home">
        <ProductMark className="home-product-mark" />
        <div className="eyebrow">
          <span /> {home.hero.eyebrow}
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
        <div className="trust-row">
          {home.hero.trust.map((item) => (
            <span key={item}>
              <i>✓</i> {item}
            </span>
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
          <aside className="home-context-column">
            <small>{home.workbench.contextTitle}</small>
            <div className="home-context-list">
              {home.workbench.contexts.map((context, index) => (
                <div className={index === 0 ? "active" : ""} key={context}>
                  <span>{contextIcons[index]}</span>
                  <strong>{context}</strong>
                </div>
              ))}
            </div>
          </aside>

          <div className="home-conversation-column">
            <small>{home.workbench.conversationTitle}</small>
            <div className="home-user-prompt">{home.workbench.prompt}</div>
            <div className="home-ai-answer">
              <ProductMark className="assistant-product-mark" />
              <div>
                <strong>{home.workbench.responseTitle}</strong>
                <p>{home.workbench.responseBody}</p>
              </div>
            </div>
            <ol className="home-mini-flow" aria-label={home.workflow.title}>
              {home.workflow.steps.map((step, index) => (
                <li className={index === 0 ? "complete" : ""} key={step.number}>
                  <span>{step.number}</span>
                  <b>{step.title}</b>
                </li>
              ))}
            </ol>
          </div>

          <aside className="home-actions-column">
            <small>{home.workbench.actionTitle}</small>
            <div className="home-action-list">
              {home.workbench.actions.map((action, index) => (
                <div key={action}>
                  <span>{actionIcons[index]}</span>
                  <strong>{action}</strong>
                  <b>ROADMAP</b>
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

        <div className="support-card">
          <ProductMark className="support-product-mark" />
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
