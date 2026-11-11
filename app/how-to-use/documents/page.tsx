import type { Metadata } from "next";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 선택한 텍스트 자료",
  description: "지원 UTF-8 텍스트 파일 일부의 첨부와 전체 PDF·스프레드시트 분석 제한을 안내합니다.",
  alternates: { canonical: "/how-to-use/documents" },
};

export default function Page() {
  return <DetailPage productTopic="documents" active="guide" eyebrow="AIWORK BROWSER" title="선택한 텍스트 자료" description="지원 UTF-8 텍스트 파일 일부의 첨부와 전체 PDF·스프레드시트 분석 제한을 안내합니다.">{null}</DetailPage>;
}
