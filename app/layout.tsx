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
  title: "AIWORK Browser | Chrome 확장프로그램 Release Candidate",
  description:
    "사용자가 명시적으로 실행한 현재 탭을 수집하고 민감정보를 제거한 뒤, 승인된 자료만 Google Drive appDataFolder에 저장하는 Chrome 확장프로그램 Release Candidate입니다.",
  icons: {
    icon: "/images/aiwork-anime-profile-192.png",
    shortcut: "/images/aiwork-anime-profile-192.png",
    apple: "/images/aiwork-anime-profile-192.png",
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
