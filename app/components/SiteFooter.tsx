import Image from "next/image";
import Link from "next/link";

export const shakespeareNotice =
  "As Shakespeare reminds us, “What’s past is prologue.” In that spirit, certain portions of this document have been prepared with reference to AI-assisted materials. All rights, licenses, and editorial responsibility pertaining to this work are retained by its author, Sungjae Lim, Director of Planning.";

export default function SiteFooter() {
  return (
    <footer className="site-footer" id="site-footer">
      <div className="footer-intro">
        <Link className="brand footer-brand" href="/">
          <Image
            className="brand-avatar"
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="36"
            height="36"
            unoptimized
          />
          <span>AIWORK</span>
        </Link>
        <p>AI와 업무를 연결하는 새로운 방식.</p>
      </div>

      <div className="footer-links">
        <Link href="/product">제품</Link>
        <Link href="/how-to-use">사용법</Link>
        <Link href="/security">보안</Link>
        <Link href="/privacy">개인정보처리방침</Link>
        <Link href="/contact">문의</Link>
      </div>

      <address className="business-details">
        <strong>주식회사 씨엔씨코퍼레이션</strong>
        <span>사업자등록번호 140-81-50087</span>
        <span>
          경기도 부천시 원미구 부천로198번길 36
          <br />
          (춘의동, 춘의테크노파크 102-208)
        </span>
        <span>
          고객센터 <a href="tel:0806647077">080-664-7077</a>
          {" · "}
          <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
        </span>
      </address>

      <div className="footer-legal">
        <small>
          © 2026 AIWORK. A service of C&amp;C Corporation. All rights reserved.
        </small>
        <p lang="en">{shakespeareNotice}</p>
      </div>
    </footer>
  );
}
