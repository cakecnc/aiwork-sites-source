import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeBoot from "./theme-boot";
import { SitePreferencesProvider } from "./preferences";

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
  title: "AIWORK Browser | Chrome 확장프로그램 Release Candidate",
  description:
    "사용자가 명시적으로 실행한 현재 탭을 수집하고 민감정보를 제거한 뒤, 승인된 자료만 Google Drive appDataFolder에 저장하는 Chrome 확장프로그램 Release Candidate입니다.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "AIWORK",
    title: "AIWORK Browser | 현재 페이지를 안전한 업무 자료로",
    description:
      "사용자가 직접 실행한 현재 페이지를 저장 전 미리보기하고, 승인한 기록만 Google Drive의 AIWORK 전용 영역에 보관합니다.",
    images: [
      {
        url: "/images/aiwork-synthwave-hero-v2.png",
        width: 1672,
        height: 941,
        alt: "AIWORK Browser의 연결형 업무 공간",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIWORK Browser | 현재 페이지를 안전한 업무 자료로",
    description:
      "사용자가 직접 실행한 현재 페이지를 저장 전 미리보기하고 승인한 기록만 보관합니다.",
    images: ["/images/aiwork-synthwave-hero-v2.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/images/aiwork-anime-profile-192.png",
    shortcut: "/images/aiwork-anime-profile-192.png",
    apple: "/images/aiwork-anime-profile-192.png",
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
    email: "cakecnc@daum.net",
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
