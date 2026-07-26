import Image from "next/image";
import type { ReactNode } from "react";
import SiteFooter from "./SiteFooter";
import SiteHeader, { type SiteSection } from "./SiteHeader";

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

export default function DetailPage({
  active,
  eyebrow,
  title,
  description,
  status,
  image = "/images/aiwork-agent-yellow.webp",
  imageAlt = "윙크하며 안내하는 AIWORK 에이전트",
  imageLabel = "AIWORK GUIDE AGENT",
  imageTone = "agent",
  children,
}: DetailPageProps) {
  return (
    <main className="site-shell detail-shell" id="main-content">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <SiteHeader active={active} />

      <article className="detail-page">
        <header className="detail-hero">
          <div className="detail-hero-copy">
            <span className="section-kicker">{eyebrow}</span>
            {status && <span className="status-pill">{status}</span>}
            <h1>{title}</h1>
            <p>{description}</p>
          </div>

          <div className={`detail-visual detail-visual-${imageTone}`}>
            <Image
              src={image}
              alt={imageAlt}
              width={imageTone === "wide" ? 1672 : 1024}
              height={imageTone === "wide" ? 941 : 1024}
              priority
              unoptimized
            />
            <span>{imageLabel}</span>
          </div>
        </header>

        {children}
      </article>

      <SiteFooter />
    </main>
  );
}
