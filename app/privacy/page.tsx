import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "AIWORK Browser 개인정보처리방침",
  description:
    "AIWORK Browser의 현재 탭 수집, 로컬 저장, Google Drive appDataFolder 사용과 삭제·철회 절차를 설명합니다.",
};

const policyVersion = "1.0.0";
const effectiveDate = "2026-07-26";

export default function PrivacyPolicy() {
  return (
    <main className="privacy-shell" id="main-content">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="privacy-topbar">
        <Link className="brand" href="/" aria-label="AIWORK 홈페이지">
          <Image
            className="brand-avatar"
            src="/images/aiwork-anime-profile-v1.webp"
            alt=""
            width="40"
            height="40"
            unoptimized
          />
          <span>AIWORK</span>
          <small>Privacy Center</small>
        </Link>
        <Link className="privacy-home-link" href="/">
          홈으로 돌아가기 <span aria-hidden="true">↗</span>
        </Link>
      </header>

      <article className="privacy-document">
        <header className="privacy-hero">
          <span className="section-kicker">AIWORK BROWSER · PRIVACY</span>
          <h1>개인정보처리방침</h1>
          <p>
            AIWORK Browser는 사용자가 직접 요청한 현재 탭만 처리합니다. 이 문서는
            확장프로그램이 어떤 데이터를 언제 읽고, 어디에 얼마나 보관하며, 사용자가
            이를 어떻게 삭제하거나 철회할 수 있는지 설명합니다.
          </p>
          <div className="policy-meta" aria-label="정책 정보">
            <span>정책 버전 <b>{policyVersion}</b></span>
            <span>시행일 <time dateTime={effectiveDate}>{effectiveDate}</time></span>
            <span>제품 버전 <b>AIWORK Browser 1.0</b></span>
          </div>
        </header>

        <nav className="privacy-toc" aria-label="개인정보처리방침 목차">
          <a href="#scope">처리 범위</a>
          <a href="#storage">저장과 보존</a>
          <a href="#drive">Google Drive</a>
          <a href="#control">삭제와 철회</a>
          <a href="#english">English summary</a>
        </nav>

        <section className="privacy-section privacy-highlight" id="scope">
          <div>
            <span className="privacy-number">01</span>
            <h2>요청한 현재 탭만 읽습니다</h2>
          </div>
          <div className="privacy-copy">
            <p>
              사용자가 확장 아이콘, 사이드 패널의 수집 버튼, 단축키 또는 컨텍스트
              메뉴를 직접 실행한 때에만 Chrome의 <code>activeTab</code> 권한으로
              활성 탭을 읽습니다. 자동 수집이나 백그라운드 탭 감시는 하지 않습니다.
            </p>
            <div className="privacy-columns">
              <div>
                <h3>처리할 수 있는 항목</h3>
                <ul>
                  <li>현재 페이지의 제목, URL, 설명, 언어와 사이트 이름</li>
                  <li>화면에 표시된 본문, 제목 구조, 사용자가 선택한 텍스트</li>
                  <li>사용자가 직접 입력한 메모, 태그와 저장 종류</li>
                  <li>메일 페이지에서 수집을 실행한 경우 현재 화면에 보이는 내용</li>
                </ul>
              </div>
              <div>
                <h3>수집하지 않는 항목</h3>
                <ul>
                  <li>비밀번호, OTP, 숨겨진 입력값과 브라우저 저장 비밀번호</li>
                  <li>쿠키, 세션 토큰, 인증 헤더, Local/Session Storage</li>
                  <li>전체 방문 기록, 다른 탭이나 백그라운드 탭의 내용</li>
                  <li>사용자 동작 없이 지속적으로 생성되는 활동 기록</li>
                </ul>
              </div>
            </div>
            <p className="privacy-note">
              페이지 콘텐츠는 비신뢰 외부 자료로 취급합니다. 페이지 안의 문구가
              권한 요청, Drive 저장 또는 외부 행동을 자동으로 실행할 수 없습니다.
            </p>
          </div>
        </section>

        <section className="privacy-section" id="storage">
          <div>
            <span className="privacy-number">02</span>
            <h2>저장 위치와 보존 기간</h2>
          </div>
          <div className="privacy-copy">
            <div className="privacy-table-wrap">
              <table>
                <caption>AIWORK Browser 데이터 저장 기준</caption>
                <thead>
                  <tr>
                    <th scope="col">데이터</th>
                    <th scope="col">위치와 한도</th>
                    <th scope="col">보존·삭제 기준</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">현재 페이지 임시본</th>
                    <td>Chrome Session Storage, 최대 256 KiB</td>
                    <td>최대 30분, 브라우저 세션 종료 또는 동의 철회 시 삭제</td>
                  </tr>
                  <tr>
                    <th scope="row">저장 대기 원문</th>
                    <td>
                      Chrome Local Storage 재시도 버퍼, 최대 8개
                      (개별 256 KiB·합계 1,000,000 bytes)
                    </td>
                    <td>최대 30분, 저장 성공·최종 실패 또는 동의 철회 시 삭제</td>
                  </tr>
                  <tr>
                    <th scope="row">로컬 메타데이터</th>
                    <td>Chrome Local Storage, 전체 최대 1.5 MB</td>
                    <td>설정과 동의는 삭제 전까지, 완료 작업은 24시간, 실패 작업은 7일</td>
                  </tr>
                  <tr>
                    <th scope="row">감사·작업 상태</th>
                    <td>원문 없는 이벤트 최대 100개, 작업 메타데이터 최대 50개</td>
                    <td>오래된 항목부터 자동 정리</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p>
              로컬 메타데이터에는 언어·테마·사용자 색상, 동의 상태,
              재시도 횟수, 안전한 오류 코드, 불투명한 Drive 파일 ID와 동기화 시각이
              포함될 수 있습니다. 페이지 원문을 장기 로컬 저장소로 사용하지 않습니다.
              OAuth 액세스 토큰은 Chrome Identity가 관리하며 AIWORK 저장소나 로그에
              기록하지 않습니다.
            </p>
          </div>
        </section>

        <section className="privacy-section" id="drive">
          <div>
            <span className="privacy-number">03</span>
            <h2>Google Drive 장기 저장</h2>
          </div>
          <div className="privacy-copy">
            <p>
              Source·Memory·Research 장기 저장은 ① 개인정보 처리 동의, ② 별도의
              Drive 저장 동의, ③ 사용자가 시작한 Google 연결, ④ 저장 버튼 실행을
              모두 거친 뒤에만 이루어집니다. 사용하는 OAuth 범위는
              <code>drive.appdata</code> 하나이며, AIWORK 전용 비공개
              <code>appDataFolder</code>만 읽고 씁니다. 일반 Drive 파일 목록이나
              다른 앱의 파일에는 접근할 수 없습니다.
            </p>
            <p>
              Drive 레코드에는 저장한 페이지의 제목·URL·본문, 사용자가 작성한
              메모·태그, 자료 종류와 생성·수정 시각이 포함될 수 있습니다. 데이터는
              HTTPS Google Drive API로만 전송되며 AIWORK 운영 서버, 제3자 AI,
              광고 또는 분석 서비스로 전송하지 않습니다.
            </p>
            <div className="limited-use">
              <strong>Google API Limited Use</strong>
              <p>
                Google API에서 받은 정보의 사용과 다른 앱으로의 전송은
                Google API Services User Data Policy와 Limited Use 요구사항을
                준수합니다.
              </p>
              <p lang="en">
                AIWORK Browser&apos;s use and transfer to any other app of
                information received from Google APIs will adhere to the
                Google API Services User Data Policy, including the Limited
                Use requirements.
              </p>
            </div>
            <p className="privacy-note">
              Google Drive 기능은 유효한 OAuth 구성이 포함된 배포본에서만 사용할 수
              있습니다. 이 정책의 공개는 확장프로그램의 스토어 게시 또는 OAuth
              공개 활성화를 의미하지 않습니다.
            </p>
          </div>
        </section>

        <section className="privacy-section" id="permissions">
          <div>
            <span className="privacy-number">04</span>
            <h2>사이트 권한과 데이터 이용</h2>
          </div>
          <div className="privacy-copy">
            <p>
              AIWORK Browser는 SmartStore, Coupang Wing, Naver Mail, Daum Mail을
              포함한 사이트에 지속적인 호스트 권한을 요청하지 않습니다. 사이트별
              어댑터는 사용자가 직접 수집한 현재 페이지의 URL을 기준으로 자료 형식만
              분류합니다. 실제 페이지 읽기는 그 순간의 <code>activeTab</code> 접근과
              사용자 동작이 있어야 하며, 메일함이나 사이트를 백그라운드에서
              둘러볼 수 없습니다.
            </p>
            <ul>
              <li>광고 표시·맞춤형 광고·신용평가에 사용하지 않습니다.</li>
              <li>데이터를 판매하거나 대여하지 않습니다.</li>
              <li>텔레메트리, 행동 분석, 원격 오류 수집을 하지 않습니다.</li>
              <li>사용자 콘텐츠를 AI 모델 학습에 사용하지 않습니다.</li>
              <li>AIWORK 담당자가 저장 원문을 열람하는 운영 기능이 없습니다.</li>
            </ul>
          </div>
        </section>

        <section className="privacy-section" id="control">
          <div>
            <span className="privacy-number">05</span>
            <h2>삭제, 연결 해제와 동의 철회</h2>
          </div>
          <div className="privacy-copy">
            <ol>
              <li>
                <strong>개별 기록 삭제:</strong> AIWORK Browser에서 Drive 기록을
                선택해 삭제할 수 있습니다.
              </li>
              <li>
                <strong>Drive 연결 해제:</strong> 설정에서 연결을 해제하면 Chrome에
                캐시된 토큰과 로컬 연결 메타데이터를 제거합니다. Drive에 이미 저장된
                기록은 자동 삭제되지 않습니다.
              </li>
              <li>
                <strong>전체 Drive 데이터 삭제:</strong> Google Drive 설정의
                앱 관리에서 AIWORK의 숨겨진 앱 데이터를 삭제할 수 있습니다.
              </li>
              <li>
                <strong>Google 권한 완전 철회:</strong> Google 계정의 제3자 앱
                연결 관리에서 AIWORK 접근 권한을 제거할 수 있습니다.
              </li>
              <li>
                <strong>개인정보 동의 철회:</strong> 확장 설정에서 철회하면 새 페이지
                수집과 Drive 저장을 즉시 차단하고 임시 원문과 저장 대기 원문을
                제거합니다. 기존 Drive 기록은 사용자의 명시적 삭제 전까지 유지됩니다.
              </li>
              <li>
                <strong>로컬 데이터 삭제:</strong> 확장프로그램을 제거하거나 Chrome의
                확장 데이터 삭제 기능을 사용하면 남은 설정·작업 메타데이터를 삭제할
                수 있습니다.
              </li>
            </ol>
          </div>
        </section>

        <section className="privacy-section" id="website">
          <div>
            <span className="privacy-number">06</span>
            <h2>웹사이트와 외부 링크</h2>
          </div>
          <div className="privacy-copy">
            <p>
              <Link href="/">aiwork.to</Link>는 언어, 테마와 사용자 지정 색상을 브라우저
              Local Storage에만 저장합니다. 쿠키, 회원가입, 광고 추적, 분석 도구,
              서버 주문 저장은 현재 사용하지 않습니다. PayPal 결제 또는 이메일
              문의 링크를 선택하면 해당 외부 서비스의 개인정보처리방침이 적용됩니다.
            </p>
          </div>
        </section>

        <section className="privacy-section" id="changes">
          <div>
            <span className="privacy-number">07</span>
            <h2>정책 변경과 문의</h2>
          </div>
          <div className="privacy-copy">
            <p>
              데이터 항목, 권한, 저장 위치 또는 보존 기간이 실질적으로 바뀌면 이
              페이지의 버전과 시행일을 갱신합니다. 재동의가 필요한 변경은 기존 동의
              상태를 그대로 간주하지 않고 확장프로그램에서 다시 안내합니다.
            </p>
            <p>
              운영 주체: AIWORK · 개인정보 문의:
              {" "}
              <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
              {" "}· 공식 홈페이지: <Link href="/">https://aiwork.to</Link>
            </p>
          </div>
        </section>

        <section className="english-summary" id="english" lang="en">
          <span className="section-kicker">ENGLISH SUMMARY</span>
          <h2>Privacy at a glance</h2>
          <p>
            AIWORK Browser reads only the active tab that you explicitly ask
            it to capture. It does not collect passwords, cookies, browsing
            history, authentication data, or background tabs.
          </p>
          <ul>
            <li>
              Page previews stay in session storage for up to 30 minutes.
              A bounded save-retry payload may remain in local storage for up
              to 30 minutes; other local data is limited to settings, consent,
              sync, audit, and retry metadata.
            </li>
            <li>
              Saved Source, Memory, and Research records go only to the private
              Google Drive <code>appDataFolder</code>, after separate consent
              and a user-initiated action, using only the
              <code>drive.appdata</code> scope.
            </li>
            <li>
              AIWORK requests no persistent site or mail host access. Adapters
              only classify a page that you explicitly capture. AIWORK has no
              telemetry, ads, sale of data, or use of your content for model
              training.
            </li>
            <li>
              You can delete individual Drive records, disconnect Drive,
              revoke consent, remove all hidden app data in Google Drive, or
              remove the extension&apos;s local data.
            </li>
          </ul>
          <p>
            Contact: <a href="mailto:cakecnc@daum.net">cakecnc@daum.net</a>
            {" "}· Policy version {policyVersion} · Effective {effectiveDate}
          </p>
        </section>

        <footer className="privacy-footer">
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
          <p>사용자가 요청한 범위만, 사용자가 선택한 저장소에.</p>
          <div className="footer-links">
            <Link href="/">홈</Link>
            <a href="mailto:cakecnc@daum.net">문의</a>
          </div>
          <small>© 2026 AIWORK. All rights reserved.</small>
        </footer>
      </article>
    </main>
  );
}
