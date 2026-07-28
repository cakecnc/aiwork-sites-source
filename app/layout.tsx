import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
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
  title: "AIWORK | AI가 이해하고, AIWORK가 안전하게 실행합니다",
  description:
    "현재 공개된 AIWORK Browser RC와 승인 기반 Workbench 제품 비전을 소개합니다. AI Agent 본체·메일 자동화·화면 직접 조작은 아직 제공되지 않습니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "AIWORK",
    title: "AIWORK | 안전한 AI 업무 실행 조정자",
    description:
      "현재는 사용자 실행형 Browser RC를 제공하며, 선택 AI·문서·메일·실행을 잇는 Workbench는 후속 제품 비전입니다.",
    images: ["/images/cnc-company-logo.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWORK | AI가 이해하고, AIWORK가 안전하게 실행합니다",
    description:
      "공식 홈페이지와 사용자 실행형 Browser RC를 제공하며 AI Agent Runtime은 아직 구현되지 않았습니다.",
    images: ["/images/cnc-company-logo.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/images/cnc-company-logo.png",
    shortcut: "/images/cnc-company-logo.png",
    apple: "/images/cnc-company-logo.png",
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
    <html lang="ko" suppressHydrationWarning>
      <head>
        <ThemeBoot />
        <script type="application/ld+json">
          {JSON.stringify(structuredData).replace(/</g, "\\u003c")}
        </script>
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SitePreferencesProvider>{children}</SitePreferencesProvider>
      </body>
    </html>
  );
}
