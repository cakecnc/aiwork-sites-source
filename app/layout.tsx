import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./matrix-theme.css";
import GlobalInteractions from "./components/GlobalInteractions";
import "./header-flow.css";
import CinematicMatrix from "./components/CinematicMatrix";
import "./cinematic-theme.css";
import "./glow-cap.css";
import ThemeBoot from "./theme-boot";
import { SitePreferencesProvider } from "./preferences";
import { SUPPORT_EMAIL } from "./site-config";

const siteUrl = new URL("https://aiwork.to");

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "AIWORK",
  title: "AIWORK Browser | 웹 탐색과 AI 대화를 한 화면에서",
  description:
    "macOS에서 실행을 확인한 AIWORK Browser 개발 빌드. 독립 브라우저, NetGhost 프로필, 지원 데이터 가져오기와 선택형 Ollama 대화의 현재 구현·연결 조건·출시 준비 상태를 안내합니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "AIWORK",
    title: "AIWORK Browser | 독립 브라우저와 선택형 AI 대화",
    description:
      "macOS에서 실행을 확인한 AIWORK Browser 개발 빌드. 독립 브라우저, NetGhost 프로필, 지원 데이터 가져오기와 선택형 Ollama 대화의 현재 구현·연결 조건·출시 준비 상태를 안내합니다.",
    images: ["/images/aiwork-wink-assistant-512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWORK Browser | 웹 탐색과 AI 대화를 한 화면에서",
    description:
      "macOS에서 실행을 확인한 AIWORK Browser 개발 빌드. 독립 브라우저, NetGhost 프로필, 지원 데이터 가져오기와 선택형 Ollama 대화의 현재 구현·연결 조건·출시 준비 상태를 안내합니다.",
    images: ["/images/aiwork-wink-assistant-512.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      {
        url: "/favicon-company-rounded-v2.png",
        type: "image/png",
        sizes: "256x256",
      },
      {
        url: "/favicon-company-rounded-v2.ico",
        type: "image/x-icon",
      },
    ],
    shortcut: "/favicon-company-rounded-v2.png",
    apple: "/images/aiwork-wink-assistant-192.png",
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://aiwork.to/#organization",
    name: "주식회사 씨엔씨코퍼레이션",
    alternateName: "C&C Corporation",
    url: "https://aiwork.to",
    email: SUPPORT_EMAIL,
    telephone: "080-664-7077",
    address: {
      "@type": "PostalAddress",
      addressCountry: "KR",
      addressRegion: "경기도",
      addressLocality: "부천시 원미구",
      streetAddress:
        "부천로198번길 36, 춘의테크노파크 102-208",
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://aiwork.to/#website",
    url: "https://aiwork.to",
    name: "AIWORK",
    inLanguage: "ko-KR",
    publisher: {
      "@id": "https://aiwork.to/#organization",
    },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" data-theme="console" suppressHydrationWarning>
      <head>
        <ThemeBoot />
        <script src="/security-hardening.js" defer />
        <script src="/webmcp.js" defer />
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SitePreferencesProvider>
          <CinematicMatrix />
          <GlobalInteractions />
          <div className="aiwork-cinematic-content">{children}</div>
        </SitePreferencesProvider>
      </body>
    </html>
  );
}
