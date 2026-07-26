import Image from "next/image";
import Link from "next/link";

export type SiteSection =
  | "home"
  | "product"
  | "features"
  | "guide"
  | "security"
  | "pricing"
  | "download"
  | "contact";

const navigation: Array<{
  key: SiteSection;
  label: string;
  href: string;
}> = [
  { key: "product", label: "제품", href: "/product" },
  { key: "features", label: "기능", href: "/features" },
  { key: "guide", label: "사용법", href: "/how-to-use" },
  { key: "security", label: "보안", href: "/security" },
  { key: "pricing", label: "결제", href: "/pricing" },
  { key: "contact", label: "문의", href: "/contact" },
];

export default function SiteHeader({
  active = "home",
  context = "work, connected.",
}: {
  active?: SiteSection;
  context?: string;
}) {
  return (
    <>
      <header className="topbar section-topbar">
        <Link className="brand" href="/" aria-label="AIWORK 홈페이지">
          <Image
            className="brand-avatar"
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="40"
            height="40"
            unoptimized
          />
          <span>AIWORK</span>
          <small>{context}</small>
        </Link>

        <nav
          className="main-nav section-nav"
          aria-label="AIWORK 주요 페이지"
        >
          {navigation.map((item) => (
            <Link
              className={active === item.key ? "active" : ""}
              href={item.href}
              key={item.key}
              aria-current={active === item.key ? "page" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link className="install-small" href="/download">
          설치 안내
        </Link>
      </header>

      <nav className="section-mobile-nav" aria-label="AIWORK 모바일 메뉴">
        {navigation.map((item) => (
          <Link
            className={active === item.key ? "active" : ""}
            href={item.href}
            key={item.key}
            aria-current={active === item.key ? "page" : undefined}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </>
  );
}
