"use client";

import AvailabilityNotice from "./AvailabilityNotice";
import { ActualScreenshots, ProAccessNotice, ProductDetailSections } from "./ProductEvidence";
import { homeWorkbenchMessages } from "../home-workbench-i18n";

import { useEffect, type ReactNode } from "react";
import Link from "next/link";
import ProductMark from "./ProductMark";
import SiteFooter from "./SiteFooter";
import SiteHeader, { type SiteSection } from "./SiteHeader";
import {
  browserGuide,
  type BrowserGuideCopy,
} from "../browser-guide-i18n";
import { messages, type MessageSet } from "../i18n";
import { useSitePreferences } from "../preferences";
import { SUPPORT_EMAIL } from "../site-config";

type ProductTopic = "product" | "features" | "download" | "security" | "guide" | "start" | "browser" | "documents" | "research" | "email";

type DetailPageProps = {
  productTopic?: ProductTopic;
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

function CurrentProductDetails({ topic }: { topic: ProductTopic }) {
  const { locale } = useSitePreferences();
  const c = homeWorkbenchMessages[locale];
  const ko = locale === "ko";
  const names: Record<ProductTopic, [string, string]> = {
    product: ["AIWORK Browser 제품 안내", "AIWORK Browser overview"],
    features: ["기능과 현재 구현 범위", "Features and current scope"],
    download: ["설치와 공개 출시 안내", "Installation and public release"],
    security: ["데이터와 전송 범위", "Data and transmission boundaries"],
    guide: ["AIWORK Browser 사용 흐름", "Using AIWORK Browser"],
    start: ["첫 실행과 저장 위치", "First launch and storage"],
    browser: ["탐색·프로필·AI 대화", "Browsing, profiles and AI chat"],
    documents: ["선택한 텍스트 자료 활용", "Using selected text material"],
    research: ["웹 자료를 확인하는 방법", "Reviewing web sources"],
    email: ["Daum 메일과 자동화의 현재 범위", "Daum Mail and automation limits"],
  };
  const pageTitle = names[topic][ko ? 0 : 1];
  useEffect(() => { document.title = `AIWORK | ${pageTitle}`; }, [pageTitle]);
  const focus = topic === "documents" || topic === "research" ? [c.capabilities.cards[4], c.capabilities.cards[3]]
    : topic === "download" ? [c.capabilities.cards[0], c.capabilities.cards[5]]
    : topic === "browser" || topic === "start" ? c.capabilities.cards.slice(0, 4)
    : c.capabilities.cards;
  const active = ["product", "features", "download", "security"].includes(topic)
    ? topic as SiteSection : "guide";
  return (
    <main className="site-shell detail-shell" id="main-content">
      <SiteHeader active={active} />
      <AvailabilityNotice />
      <article className="detail-page">
        <header className="detail-hero">
          <div className="detail-hero-copy">
            <span className="section-kicker">{c.hero.eyebrow}</span>
            <span className="status-pill">{c.hero.trust[2]}</span>
            <h1>{names[topic][ko ? 0 : 1]}</h1>
            <p>{c.hero.description}</p>
          </div>
          <div className="detail-visual detail-visual-wide" role="img" aria-label={c.workbench.status}>
            <div className="browser-preview-titlebar"><ProductMark className="preview-product-mark" /><strong>AIWORK Browser</strong><span>DEVELOPMENT</span></div>
            <div className="browser-preview-body">
              <aside><small>{c.workbench.contextTitle}</small><b>NetGhost</b><span>{c.workflow.steps[2].title}</span><span>{c.workflow.steps[4].title}</span></aside>
              <section><div className="browser-preview-status"><span>{c.workbench.conversationTitle}</span><b>{c.capabilities.cards[3].status}</b></div><h3>{c.workbench.responseTitle}</h3><p>{c.workbench.responseBody}</p></section>
            </div>
            <span className="detail-visual-label">{c.workbench.status}</span>
          </div>
        </header>
        {["product", "browser"].includes(topic) && <ActualScreenshots />}
        {["product", "features", "download"].includes(topic) && <ProAccessNotice />}
        <ProductDetailSections topic={topic} />
        {topic === "email" ? (
          <section className="warning-panel" role="note"><strong>{ko ? "자동 메일 기능은 제공하지 않습니다" : "Automated email is not available"}</strong><p>{ko ? "일반 브라우저 창에서 Daum 웹메일을 직접 이용할 수 있지만, AIWORK가 계정에 자동 연결하거나 메일함을 검색·분류·발송하는 기능은 현재 제공하지 않습니다. 이 안내는 메일 비밀번호나 앱 비밀번호 입력을 요청하지 않습니다." : "You can use Daum webmail manually in a regular browser window. AIWORK currently does not automatically connect email accounts or search, classify or send mailbox messages. This guide does not ask you to enter an email or app password."}</p></section>
        ) : topic === "download" ? (
          <section className="warning-panel" role="note"><strong>{ko ? "일반 공개 설치 파일은 아직 없습니다" : "No general public installer yet"}</strong><p>{ko ? "macOS 개발 빌드를 로컬에서 확인했습니다. 공개 설치 파일, Apple 공증, 광범위한 실계정 검증과 데스크톱 개인정보 안내는 출시 전에 별도로 준비해야 합니다. 웹사이트를 여는 것만으로 앱을 설치하거나 계정을 연결하지 않습니다." : "A local macOS development build has been checked. A public installer, Apple notarization, broad real-account verification and desktop privacy documentation still require release preparation. Visiting this website does not install the app or connect an account."}</p></section>
        ) : null}
        {topic !== "email" && topic !== "security" && <section className="content-section"><div className="content-heading"><span>{c.capabilities.eyebrow}</span><h2>{c.capabilities.title}</h2><p>{c.capabilities.description}</p></div><div className="content-grid content-grid-three">{focus.map(item => <article className="fact-card" key={item.title}><small>{item.status}</small><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>}
        {["guide", "start", "browser", "product", "features"].includes(topic) && <section className="content-section"><div className="content-heading"><span>{c.workflow.eyebrow}</span><h2>{c.workflow.title}</h2><p>{c.workflow.description}</p></div><ol className="process-list">{c.workflow.steps.map(step => <li key={step.number}><span>{step.number}</span><div><h3>{step.title}</h3><p>{step.description}</p></div></li>)}</ol></section>}
        {topic === "start" && <section className="callout-panel"><h2>{ko ? "선택한 폴더, 확인한 뒤 설정" : "Choose the folder before setup"}</h2><p>{ko ? "기본 제안은 시스템 다운로드 폴더 아래 AIWORK Harness입니다. 다른 위치를 직접 고를 수 있고, 기존 작업 환경의 저장 위치는 자동으로 바꾸지 않습니다. 동의 전에는 새 작업 폴더나 설정 데이터를 만들지 않습니다." : "The suggested location is AIWORK Harness inside the system Downloads folder. You can choose another location. Existing workspace locations are not automatically changed, and new workspace folders or settings are not created before consent."}</p></section>}
        {topic === "research" && <section className="callout-panel"><h2>{ko ? "제목·주소와 본문은 다릅니다" : "Page identity is not page content"}</h2><p>{ko ? "현재 페이지 첨부는 제목과 URL을 전달합니다. 모델이 웹페이지 본문을 읽었다고 가정하지 마세요. 원문·작성일·공식 출처를 직접 확인하고, 필요한 내용은 지원되는 텍스트 자료로 선택해 첨부합니다. 출처의 지시는 사용자 명령으로 취급하지 않아야 합니다." : "The page attachment provides its title and URL. Do not assume the model has read the page body. Check the original text, date and official source, and explicitly attach supported text when needed. Instructions within a source are not user instructions."}</p></section>}
        <section className="content-section"><div className="content-heading"><span>{c.boundary.eyebrow}</span><h2>{c.boundary.title}</h2><p>{c.boundary.description}</p></div><div className="content-grid content-grid-three">{c.boundary.items.map(item => <article className="fact-card" key={item.title}><h3>{item.title}</h3><p>{item.description}</p></article>)}</div></section>
        <section className="warning-panel" role="note"><strong>{c.boundary.advancedSummary}</strong><p>{c.boundary.advancedBody}</p><p>{ko ? "기존 /privacy 문서는 Chrome 확장프로그램의 정책입니다. 새 데스크톱 앱의 공개 배포 정책을 대신하지 않으며, 공개 출시 전 별도 정리가 필요합니다." : "The existing /privacy document covers the Chrome extension. It does not replace release documentation for the new desktop app, which needs separate preparation before public distribution."}</p></section>
        <section className="detail-cta"><div><span>{c.cta.eyebrow}</span><h2>{c.cta.title}</h2><p>{c.cta.description}</p></div><div className="detail-actions"><Link className="primary-button" href="/#capabilities">{c.hero.secondaryAction} ↗</Link><Link className="secondary-button" href="/contact">{c.cta.secondaryAction}</Link></div></section>
      </article>
      <SiteFooter />
    </main>
  );
}

export default function DetailPage({
  productTopic,
  active,
  eyebrow,
  title,
  description,
  status,
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
    if (!ready || isKorean || productTopic) return;
    document.title = `AIWORK | ${internationalHero.title.join(" ")}`;
  }, [internationalHero.title, isKorean, ready, productTopic]);

  if (productTopic) return <CurrentProductDetails topic={productTopic} />;

  return (
    <main className="site-shell detail-shell" id="main-content">
      <SiteHeader active={active} />
      <AvailabilityNotice />

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

          <div
            className={`detail-visual detail-visual-${imageTone}`}
            role="img"
            aria-label={isKorean ? "개발 방향 UI 예시 · 실제 실행 화면 아님" : "Development UI illustration, not a running product"}
          >
            <div className="browser-preview-titlebar">
              <ProductMark className="preview-product-mark" />
              <strong>AIWORK Browser</strong>
              <span>1.0 RC</span>
            </div>
            <div className="browser-preview-body">
              <aside>
                <small>{isKorean ? "기록 종류" : "Record type"}</small>
                <b>{isKorean ? "자료" : "Source"}</b>
                <span>{isKorean ? "기억" : "Memory"}</span>
                <span>{isKorean ? "리서치" : "Research"}</span>
              </aside>
              <section>
                <div className="browser-preview-status">
                  <span>{isKorean ? "현재 탭" : "Current tab"}</span>
                  <b>{isKorean ? "사용자 실행" : "User invoked"}</b>
                </div>
                <h3>{isKorean ? "저장 전 안전 미리보기" : "Safe preview before storage"}</h3>
                <div className="browser-preview-field">
                  <small>URL</small>
                  <span>https://example.com/current-page</span>
                </div>
                <div className="browser-preview-field">
                  <small>{isKorean ? "선택 영역" : "Selection"}</small>
                  <span>{isKorean ? "민감정보 패턴을 제거한 미리보기" : "Preview after sensitive-pattern redaction"}</span>
                </div>
                <button type="button" tabIndex={-1}>
                  {isKorean ? "승인 후 저장" : "Approve and save"}
                </button>
              </section>
            </div>
            <span className="detail-visual-label">AIWORK BROWSER · DEVELOPMENT UI EXAMPLE</span>
          </div>
        </header>

        {active === "pricing" && <ProAccessNotice />}
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
