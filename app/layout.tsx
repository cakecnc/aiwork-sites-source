import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeBoot from "./theme-boot";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AIWORK | 업무를 연결하다",
  description:
    "웹, 문서, 이메일과 업무 도구를 연결해 조사부터 제작, 검토까지 하나의 흐름으로 완성하는 AI 업무 플랫폼입니다.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/images/aiwork-agent-yellow-192.png",
    shortcut: "/images/aiwork-agent-yellow-192.png",
    apple: "/images/aiwork-agent-yellow-192.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeBoot />
        {children}
      </body>
    </html>
  );
}
