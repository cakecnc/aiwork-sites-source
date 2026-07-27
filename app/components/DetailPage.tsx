"use client";

import Image from "next/image";
import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import SiteFooter from "./SiteFooter";
import SiteHeader, { type SiteSection } from "./SiteHeader";
import {
  browserGuide,
  type BrowserGuideCopy,
} from "../browser-guide-i18n";
import { messages, type MessageSet } from "../i18n";
import { useSitePreferences } from "../preferences";
import { SUPPORT_EMAIL } from "../site-config";

type DetailPageProps = {
  active: SiteSection;
  eyebrow: string;
  title: ReactNode;
  description: string;
  status?: string;
  image?: string;
  imageAlt?: string;
  imageLabel?: string;
  imageTone?: "agent" | "wide";
  children: ReactNode;
};

type InternationalHero = {
  eyebrow: string;
  status: string;
  title: [string, string];
  description: string;
};

function getInternationalHero(
  active: SiteSection,
  copy: MessageSet,
): InternationalHero {
  switch (active) {
    case "product":
      return {
        eyebrow: copy.status.productVision,
        status: copy.status.releaseCandidate,
        title: copy.hero.title,
        description: copy.hero.description.join(" "),
      };
    case "features":
      return {
        eyebrow: copy.features.eyebrow,
        status: copy.status.current,
        title: copy.features.title,
        description: copy.features.cards
          .map((card) => card.description)
          .join(" "),
      };
    case "guide":
      return {
        eyebrow: copy.workflow.eyebrow,
        status: copy.status.current,
        title: copy.workflow.title,
        description: copy.workflow.description,
      };
    case "security":
      return {
        eyebrow: "SECURITY BY BOUNDARY",
        status: copy.status.current,
        title: [copy.hero.trust[0], copy.hero.trust[1]],
        description: `${copy.hero.trust[2]}. ${copy.workflow.description}`,
      };
    case "pricing":
      return {
        eyebrow: copy.payments.eyebrow,
        status: copy.payments.status,
        title: copy.payments.title,
        description: copy.payments.description,
      };
    case "download":
      return {
        eyebrow: copy.cta.eyebrow,
        status: copy.status.releaseCandidate,
        title: copy.cta.title,
        description: copy.cta.description,
      };
    case "contact":
      return {
        eyebrow: "CONTACT AIWORK",
        status: copy.status.current,
        title: copy.cta.title,
        description: copy.payments.supportDescription,
      };
    default:
      return {
        eyebrow: copy.hero.eyebrow,
        status: copy.status.releaseCandidate,
        title: copy.hero.title,
        description: copy.hero.description.join(" "),
      };
  }
}

function InternationalBody({
  active,
  copy,
  guide,
}: {
  active: SiteSection;
  copy: MessageSet;
  guide: BrowserGuideCopy;
}) {
  if (active === "guide") {
    return (
      <>
        <section className="content-section">
          <div className="content-heading">
            <span>AIWORK BROWSER 1.0</span>
            <h2>{guide.title.join(" ")}</h2>
            <p>{guide.description}</p>
          </div>
          <ol className="process-list process-list-detailed">
            {guide.steps.map((step, index) => (
              <li key={step.title}>
                <span>0{index + 1}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="content-section split-section">
          <div className="content-heading">
            <span>CAPTURE METHODS</span>
            <h2>{copy.workflow.title.join(" ")}</h2>
            <p>{guide.recordTypesNote}</p>
          </div>
          <div className="format-grid">
            {guide.captureMethods.map((method) => (
              <span key={method}>{method}</span>
            ))}
          </div>
        </section>

        <section className="callout-panel">
          <div>
            <span>LIBRARY &amp; QUEUE</span>
            <h2>{guide.queueNote}</h2>
          </div>
          <p>{guide.controlNote}</p>
          <Link className="secondary-button" href="/privacy">
            PRIVACY <span>↗</span>
          </Link>
        </section>

        <section className="warning-panel" role="note">
          <strong>ROADMAP</strong>
          <p>{guide.roadmapWarning}</p>
        </section>
      </>
    );
  }

  if (active === "pricing") {
    return (
      <section className="content-section">
        <div className="content-heading">
          <span>{copy.payments.eyebrow}</span>
          <h2>{copy.payments.title.join(" ")}</h2>
          <p>{copy.payments.disclaimer}</p>
        </div>
        <div className="content-grid content-grid-three">
          {copy.payments.products.map((product) => (
            <article className="fact-card" key={product.name}>
              <small>{product.billing}</small>
              <h3>{product.name}</h3>
              <p>
                <bdi dir="ltr">{product.price}</bdi>
                {" · "}
                {product.features.join(" · ")}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  if (active === "download" || active === "contact") {
    return (
      <>
        <section className="content-section">
          <div className="content-heading">
            <span>{copy.cta.eyebrow}</span>
            <h2>{copy.cta.title.join(" ")}</h2>
            <p>{copy.cta.description}</p>
          </div>
          <div className="detail-actions">
            <a
              className="primary-button"
              href={`mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
                "AIWORK release update",
              )}`}
            >
              {copy.cta.releaseAlert} <span>↗</span>
            </a>
            <Link className="secondary-button" href="/how-to-use">
              {copy.workflow.eyebrow}
            </Link>
          </div>
        </section>
        <section className="contact-information">
          <div>
            <span className="section-kicker">AIWORK SUPPORT</span>
            <h2>{copy.payments.supportTitle}</h2>
            <p>{copy.payments.supportDescription}</p>
          </div>
          <address>
            <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>
            <a href="tel:0806647077">080-664-7077</a>
          </address>
        </section>
      </>
    );
  }

  const cards =
    active === "security"
      ? copy.hero.trust.map((title, index) => ({
          label: `0${index + 1}`,
          title,
          description: copy.workflow.steps[index].description,
        }))
      : copy.features.cards;

  return (
    <>
      <section className="content-section">
        <div className="content-heading">
          <span>{copy.features.eyebrow}</span>
          <h2>{copy.features.title.join(" ")}</h2>
          <p>{copy.workflow.description}</p>
        </div>
        <div className="content-grid content-grid-three">
          {cards.map((card) => (
            <article className="fact-card" key={card.title}>
              <small>{card.label}</small>
              <h3>{card.title}</h3>
              <p>{card.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="content-section">
        <div className="content-heading">
          <span>{copy.workflow.eyebrow}</span>
          <h2>{copy.workflow.title.join(" ")}</h2>
          <p>{copy.workflow.description}</p>
        </div>
        <ol className="process-list">
          {copy.workflow.steps.map((step) => (
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
    </>
  );
}

export default function DetailPage({
  active,
  eyebrow,
  title,
  description,
  status,
  image = "/images/aiwork-anime-profile-v1.webp",
  imageAlt = "윙크하며 안내하는 AIWORK 에이전트",
  imageLabel = "AIWORK GUIDE AGENT",
  imageTone = "agent",
  children,
}: DetailPageProps) {
  const { locale, ready } = useSitePreferences();
  const copy = messages[locale];
  const guide = browserGuide[locale];
  const internationalHero =
    active === "guide"
      ? {
          eyebrow: "AIWORK BROWSER 1.0",
          status: guide.status,
          title: guide.title,
          description: guide.description,
        }
      : getInternationalHero(active, copy);
  const isKorean = locale === "ko";

  useEffect(() => {
    if (!ready || isKorean) return;
    document.title = `AIWORK | ${internationalHero.title.join(" ")}`;
  }, [internationalHero.title, isKorean, ready]);

  return (
    <main className="site-shell detail-shell" id="main-content">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <SiteHeader active={active} />

      <article className="detail-page">
        <header className="detail-hero">
          <div className="detail-hero-copy">
            <span className="section-kicker">
              {isKorean ? eyebrow : internationalHero.eyebrow}
            </span>
            {(isKorean ? status : internationalHero.status) && (
              <span className="status-pill">
                {isKorean ? status : internationalHero.status}
              </span>
            )}
            <h1>
              {isKorean ? (
                title
              ) : (
                <>
                  {internationalHero.title[0]}
                  <br />
                  {internationalHero.title[1]}
                </>
              )}
            </h1>
            <p>{isKorean ? description : internationalHero.description}</p>
          </div>

          <div className={`detail-visual detail-visual-${imageTone}`}>
            <Image
              src={image}
              alt={isKorean ? imageAlt : copy.aria.assistantAvatar}
              width={imageTone === "wide" ? 1672 : 1024}
              height={imageTone === "wide" ? 941 : 1024}
              priority
              unoptimized
            />
            <span>{imageLabel}</span>
          </div>
        </header>

        {isKorean ? (
          children
        ) : (
          <InternationalBody active={active} copy={copy} guide={guide} />
        )}
      </article>

      <SiteFooter />
    </main>
  );
}
