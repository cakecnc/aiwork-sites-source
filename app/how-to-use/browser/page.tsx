import type { Metadata } from "next";
import DetailPage from "../../components/DetailPage";

export const metadata: Metadata = {
  title: "AIWORK Browser | 브라우저 사용법",
  description: "독립 브라우저와 프로필을 선택하고 동의한 모델에 질문하는 현재 개발 빌드 안내입니다.",
  alternates: { canonical: "/how-to-use/browser" },
};

export default function Page() {
  return <DetailPage productTopic="browser" active="guide" eyebrow="AIWORK BROWSER" title="브라우저 사용법" description="독립 브라우저와 프로필을 선택하고 동의한 모델에 질문하는 현재 개발 빌드 안내입니다.">{null}</DetailPage>;
}
