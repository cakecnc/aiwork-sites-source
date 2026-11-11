import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hashcat 안전 사용 가이드",
  description: "본인 소유 또는 승인된 자료를 로컬에서 복구하고 점검하기 위한 Hashcat 초보자 안내입니다.",
  alternates: { canonical: "/hashcat" },
};

export default function HashcatLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
