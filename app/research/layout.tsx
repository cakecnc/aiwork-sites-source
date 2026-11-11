import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Research (대한민국시장조사용)",
  description: "제품 설명을 바탕으로 네이버 웹, 블로그, 이미지, 검색어 트렌드와 쇼핑 인사이트 근거를 확인합니다.",
  alternates: { canonical: "/research" },
};

export default function ResearchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
