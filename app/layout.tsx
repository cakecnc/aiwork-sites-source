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
    "공개된 AIWORK Browser RC와 내부 구현·로컬 검증을 마친 승인 기반 Local Workbench를 소개합니다. 이메일·AI·외부 실행은 별도 활성화가 필요합니다.",
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
      "Browser RC는 공개 범위이며, 자료·근거·승인·결과물·감사를 잇는 Local Workbench는 내부 구현·로컬 검증 상태입니다.",
    images: ["/images/aiwork-wink-assistant-512.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWORK | AI가 이해하고, AIWORK가 안전하게 실행합니다",
    description:
      "공식 홈페이지와 Browser RC를 제공하며 Local Workbench는 내부 구현·로컬 검증 상태입니다. 외부 Adapter는 활성화 전입니다.",
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
