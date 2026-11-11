import type { Metadata } from "next";
import DetailPage from "../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 사용 흐름",
  description: "작업 폴더, 프로필, 탐색, 모델 연결, 자료 첨부와 답변 검토의 흐름입니다.",
  alternates: { canonical: "/how-to-use" },
};

export default function Page() {
  return <DetailPage productTopic="guide" active="guide" eyebrow="AIWORK BROWSER" title="사용 흐름" description="작업 폴더, 프로필, 탐색, 모델 연결, 자료 첨부와 답변 검토의 흐름입니다.">{null}</DetailPage>;
}
