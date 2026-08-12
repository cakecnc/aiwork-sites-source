import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const removedProductPayments = [
  "TF7HCLYC5PM8S",
  "WTD5ZEKLT5GJS",
  "H5SXU7HJ8GVRE",
];

function assertSecurityHeaders(response) {
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(
    response.headers.get("cross-origin-opener-policy"),
    "same-origin",
  );
  assert.equal(
    response.headers.get("referrer-policy"),
    "strict-origin-when-cross-origin",
  );
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /frame-ancestors 'none'/i,
  );
  assert.match(
    response.headers.get("content-security-policy") ?? "",
    /object-src 'none'/i,
  );
  assert.match(
    response.headers.get("permissions-policy") ?? "",
    /camera=\(\).*microphone=\(\).*geolocation=\(\)/i,
  );
  assert.match(
    response.headers.get("strict-transport-security") ?? "",
    /max-age=31536000/i,
  );
}

async function render(pathname = "/", hostname = "localhost") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${encodeURIComponent(pathname)}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://${hostname}${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("renders the safe AI work orchestration homepage", async () => {
  const response = await render("/");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assertSecurityHeaders(response);

  const html = await response.text();
  assert.match(
    html,
    /<link(?=[^>]*\brel=["']canonical["'])(?=[^>]*\bhref=["']https:\/\/aiwork\.to\/["'])[^>]*>/i,
  );
  assert.match(html, /property=["']og:title["']/i);
  assert.match(html, /name=["']twitter:card["']/i);
  assert.match(html, /"@type":"Organization"/);
  assert.match(html, /"@type":"WebSite"/);
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /AIWORK/);
  assert.match(html, /data-page-transition=["']enter["']/);
  assert.match(html, /AI가 이해하고/);
  assert.match(html, /AIWORK가 안전하게 실행합니다/);
  assert.match(html, /Local Workbench 내부 검증/);
  assert.match(html, /맥락/);
  assert.match(html, /문서 비교/);
  assert.match(html, /검수·전달/);
  assert.match(html, /현재 탭 수집·미리보기/);
  assert.match(html, /Drive appDataFolder 저장/);
  assert.match(html, /공식 홈페이지·구매 문의/);
  assert.match(html, /개인 AI 프로필/);
  assert.match(html, /이메일 연결/);
  assert.match(html, /Read-only 수신과 최종 내용을 사용자가 승인한 한 건만 발송/);
  assert.match(html, /사용자 선택형 AI/);
  assert.match(html, /특정 모델에 고정하지 않고/);
  assert.doesNotMatch(html, /Daum Email(?:·| &amp;| & )Gemma4/);
  assert.match(html, /Browser RC 공개 범위 · Local Workbench 구현·로컬 검증/);
  assert.match(html, /내부 구현 · 활성화 필요/);
  assert.doesNotMatch(html, /AI Agent 본체 미구현/);
  assert.match(html, /독립 기능의 검증 상태/);
  assert.match(html, /한 기능을 선택해도 다른 외부 기능은 자동 활성화되지 않습니다/);
  assert.match(html, /비밀번호·API 키·토큰·쿠키를 저장하지 않습니다/);
  assert.doesNotMatch(html, /AIWORK ASSISTANT/);
  assert.doesNotMatch(html, /Ai-byMrL/i);
  assert.match(html, /Professional과 Business는 아직 일반 출시되지 않았습니다/);
  assert.match(html, /\/contact\?product=professional#purchase-inquiry/);
  assert.match(html, /\/contact\?product=business#purchase-inquiry/);
  assert.match(html, /\/contact\?product=smartstore-pack#purchase-inquiry/);
  for (const paymentId of removedProductPayments) {
    assert.doesNotMatch(
      html,
      new RegExp(paymentId),
      `Product payment ${paymentId} must not be exposed`,
    );
  }
  assert.match(
    html,
    /https:\/\/www\.paypal\.com\/ncp\/payment\/R3NBTNC3KYCVE/,
  );
  assert.match(html, /cakecnc@daum\.net/);
  assert.match(html, /src=["']\/security-hardening\.js["']/);
  assert.match(html, /src=["']\/webmcp\.js["']/);

  const rightClickScript = await readFile(
    new URL("../dist/client/security-hardening.js", import.meta.url),
    "utf8",
  );
  const webmcpScript = await readFile(
    new URL("../dist/client/webmcp.js", import.meta.url),
    "utf8",
  );
  assert.match(rightClickScript, /우클릭은 사용할 수 없습니다/);
  assert.match(rightClickScript, /font-weight:700/);
  assert.match(rightClickScript, /text-align:center/);
  assert.match(webmcpScript, /aiwork-page-context/);
  assert.match(webmcpScript, /aiwork-page-links/);
  assert.match(webmcpScript, /aiwork-page-sections/);
  assert.match(webmcpScript, /registerTool/);
});

test("ships accessible page transition and loading fallbacks", async () => {
  const response = await render("/features");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /data-page-transition=["']enter["']/);
  assert.match(html, /route-enter-progress/);

  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(styles, /\.route-enter-progress/);
  assert.match(styles, /@keyframes aiwork-page-enter/);
  assert.match(styles, /@keyframes aiwork-loading-progress/);
  assert.match(
    styles,
    /@media \(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.route-enter-progress\s*{[\s\S]*?display:\s*none;/,
  );

  const loadingSource = await readFile(
    new URL("../app/loading.tsx", import.meta.url),
    "utf8",
  );
  assert.match(loadingSource, /aria-busy=["']true["']/);
  assert.match(loadingSource, /role=["']status["']/);
  assert.match(loadingSource, /aria-live=["']polite["']/);
  assert.match(loadingSource, /페이지를 안전하게 준비하고 있습니다/);
});

test("renders the public AIWORK Browser privacy policy", async () => {
  const response = await render("/privacy");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assertSecurityHeaders(response);

  const html = await response.text();
  assert.match(html, /AIWORK Browser 개인정보처리방침/);
  assert.match(html, /정책 버전[\s\S]{0,120}2026-07-28/);
  assert.match(html, /activeTab/);
  assert.match(html, /drive\.appdata/);
  assert.match(html, /appDataFolder/);
  assert.match(html, /1,000,000 bytes/);
  assert.match(html, /__cf_bm/);
  assert.match(html, /광고·맞춤형[\s\S]{0,80}추적 쿠키/);
  assert.match(html, /ENGLISH SUMMARY/);
  assert.match(html, /cakecnc@daum\.net/);
  assert.match(html, /90일 만료값/);
  assert.match(html, /다음 접근이나 서비스 자료 삭제 시점/);
  assert.match(html, /Turnstile은 봇 방지를 위해 토큰·IP/);
  assert.match(html, /Resend는 운영자 전달을 위해 이름·회사명/);
  assert.match(html, /주식회사 씨엔씨코퍼레이션/);
  assert.match(html, /140-81-50087/);
  assert.match(html, /What’s past is prologue/);
});

const detailRoutes = [
  ["/product", "AIWORK PRODUCT", "플랫폼 로드맵"],
  ["/features", "CONNECTED INTELLIGENCE", "내부 구현 · 로컬 검증"],
  ["/security", "SECURITY BY BOUNDARY", "향후 기본 허용 목표"],
  ["/pricing", "PLANS &amp; INQUIRY", "구매 문의 접수"],
  ["/download", "DOWNLOAD &amp; RELEASE", "배포 파일 준비 중"],
  ["/contact", "CONTACT AIWORK", "PURCHASE INQUIRY"],
  ["/how-to-use", "HOW TO USE AIWORK", "Browser 사용 흐름 6단계"],
  ["/how-to-use/browser", "AIWORK BROWSER 1.0", "확장 아이콘은 수집"],
  ["/how-to-use/getting-started", "GETTING STARTED", "첫 수집 체크리스트"],
  ["/how-to-use/documents", "DOCUMENTS", "현재 파일 업로드 기능 없음"],
  ["/how-to-use/web-research", "WEB RESEARCH", "현재 자동 Research 기능 없음"],
  ["/how-to-use/daum-email", "EMAIL PROVIDER GUIDE", "현재 연결 화면이 없습니다"],
];

test("renders every section as an individual page", async () => {
  for (const [pathname, marker, scopeMarker] of detailRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must render`);
    assertSecurityHeaders(response);

    const html = await response.text();
    const canonicalPath = pathname.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(
      html,
      new RegExp(
        `<link(?=[^>]*\\brel=["']canonical["'])(?=[^>]*\\bhref=["']https://aiwork\\.to${canonicalPath}["'])[^>]*>`,
        "i",
      ),
      `${pathname} canonical URL is missing`,
    );
    assert.match(html, new RegExp(marker, "i"), `${pathname} marker is missing`);
    assert.match(
      html,
      new RegExp(scopeMarker, "i"),
      `${pathname} implementation-scope marker is missing`,
    );
    assert.match(html, /주식회사 씨엔씨코퍼레이션/);
    assert.match(html, /140-81-50087/);
    assert.match(html, /What’s past is prologue/);
    assert.match(html, /aiwork-wink-assistant/);
    assert.match(html, /aiwork-assistant-open\.webp/);
    assert.match(html, /aiwork-assistant-wink\.webp/);
    assert.match(html, /favicon-company-rounded-v2\.png/);
    assert.match(html, /aiwork-preference-boot/);
    assert.match(html, /aria-controls="aiwork-language-menu"/);
    assert.match(html, /aria-controls="aiwork-theme-menu"/);
  }
});

test("publishes email and AI as independent activation-required capabilities", async () => {
  const featuresResponse = await render("/features");
  assert.equal(featuresResponse.status, 200);
  const featuresHtml = await featuresResponse.text();
  assert.match(featuresHtml, /읽기 전용 기본·승인 후 발송/);
  assert.match(featuresHtml, /최종 발신 계정·수신자·제목·본문·첨부/);
  assert.match(featuresHtml, /Local·Cloud AI 직접 선택/);
  assert.match(featuresHtml, /특정 모델에 고정하지 않습니다/);
  assert.match(featuresHtml, /자료 → 근거 → 승인 → 결과물/);
  assert.match(featuresHtml, /내부 구현 · 활성화 필요/);
  assert.match(featuresHtml, /실제 Model Adapter는 활성화 전/);
  assert.doesNotMatch(featuresHtml, /Daum Email(?:·| &amp;| & )Gemma4/);

  const guideResponse = await render("/how-to-use/daum-email");
  assert.equal(guideResponse.status, 200);
  const guideHtml = await guideResponse.text();
  assert.match(guideHtml, /Daum은 검증 중인 이메일 Provider 후보 중 하나/);
  assert.match(guideHtml, /승인 ID의 원자적 소비/);
  assert.doesNotMatch(guideHtml, /Gemma4/);
});

test("renders the site-wide AIWORK support card exactly once per page", async () => {
  const publicRoutes = [
    "/",
    "/privacy",
    ...detailRoutes.map(([pathname]) => pathname),
  ];

  for (const pathname of publicRoutes) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must render`);

    const html = await response.text();
    assert.equal(
      html.match(/data-sitewide-support=["']true["']/g)?.length,
      1,
      `${pathname} must render exactly one site-wide support card`,
    );
    assert.equal(
      html.match(
        /href=["']https:\/\/www\.paypal\.com\/ncp\/payment\/R3NBTNC3KYCVE["']/g,
      )?.length,
      1,
      `${pathname} must render exactly one PayPal support action`,
    );
  }

  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  assert.match(
    styles,
    /\.site-footer\s*>\s*\.sitewide-support\s*{[\s\S]*?grid-template-columns:\s*auto minmax\(0,\s*1fr\) auto;/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*860px\)[\s\S]*?\.site-footer\s*>\s*\.sitewide-support\s*{[\s\S]*?grid-template-columns:\s*auto minmax\(0,\s*1fr\);[\s\S]*?\.site-footer\s*>\s*\.sitewide-support\s*>\s*a\s*{[\s\S]*?grid-column:\s*1\s*\/\s*-1;/,
  );
});

test("fails closed when purchase email automation is not configured", async () => {
  const readiness = await render("/api/purchase-inquiries");
  assert.equal(readiness.status, 200);
  assert.deepEqual(await readiness.json(), {
    available: false,
    supportEmail: "cakecnc@daum.net",
  });

  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-inquiry`);
  const { default: worker } = await import(workerUrl.href);
  const response = await worker.fetch(
    new Request("https://localhost/api/purchase-inquiries", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://localhost",
      },
      body: JSON.stringify({ product: "professional" }),
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
  assert.equal(response.status, 503);
  assert.equal((await response.json()).error, "EMAIL_NOT_CONFIGURED");
});

test("keeps the inquiry endpoint bounded and idempotent", async () => {
  const routeSource = await readFile(
    new URL("../app/api/purchase-inquiries/route.ts", import.meta.url),
    "utf8",
  );
  const schemaSource = await readFile(
    new URL("../db/schema.ts", import.meta.url),
    "utf8",
  );

  assert.match(routeSource, /request\.body\.getReader\(\)/);
  assert.match(routeSource, /reader\.cancel\(\)/);
  assert.doesNotMatch(routeSource, /request\.text\(\)/);
  assert.match(routeSource, /IDEMPOTENCY_CONFLICT/);
  assert.match(routeSource, /payload_hash/);
  assert.match(routeSource, /attempt:ip:/);
  assert.match(routeSource, /INSERT INTO inquiry_quota_reservations/);
  assert.match(routeSource, /email_hash = \? AND bucket = \?/);
  assert.match(routeSource, /ip_hash = \? AND bucket = \?/);
  assert.match(routeSource, /ON CONFLICT\("key"\) DO UPDATE/);
  assert.match(schemaSource, /inquiry_rate_limits/);
  assert.match(schemaSource, /inquiry_quota_reservations/);
  assert.match(schemaSource, /payload_hash/);
});

test("serves crawl metadata and canonical host redirects", async () => {
  const robots = await render("/robots.txt");
  assert.equal(robots.status, 200);
  assert.match(await robots.text(), /Sitemap:\s*https:\/\/aiwork\.to\/sitemap\.xml/i);

  const sitemap = await render("/sitemap.xml");
  assert.equal(sitemap.status, 200);
  const sitemapXml = await sitemap.text();
  assert.match(sitemapXml, /<loc>https:\/\/aiwork\.to\/?<\/loc>/i);
  assert.match(sitemapXml, /<loc>https:\/\/aiwork\.to\/privacy<\/loc>/i);

  const manifest = await render("/manifest.webmanifest");
  assert.equal(manifest.status, 200);
  assert.match(manifest.headers.get("content-type") ?? "", /json/i);
  assert.match(await manifest.text(), /"name"\s*:\s*"AIWORK"/);

  const redirect = await render("/how-to-use?ref=test", "www.aiwork.to");
  assert.equal(redirect.status, 308);
  assert.equal(
    redirect.headers.get("location"),
    "https://aiwork.to/how-to-use?ref=test",
  );
  assertSecurityHeaders(redirect);

  const assetHeaders = await readFile(
    new URL("../dist/client/_headers", import.meta.url),
    "utf8",
  );
  assert.match(
    assetHeaders,
    /\/images\/\*[\s\S]*max-age=604800/i,
  );
  assert.match(
    assetHeaders,
    /\/assets\/\*[\s\S]*max-age=31536000,\s*immutable/i,
  );
});

test("renders one global preference bootstrap and controls on public routes", async () => {
  for (const pathname of ["/", "/privacy", ...detailRoutes.map(([route]) => route)]) {
    const response = await render(pathname);
    assert.equal(response.status, 200, `${pathname} must render`);
    const html = await response.text();

    assert.equal(
      html.match(/id="aiwork-preference-boot"/g)?.length,
      1,
      `${pathname} must render exactly one preference bootstrap`,
    );
    assert.match(html, /aiwork-theme/);
    assert.match(html, /aiwork-locale/);
    assert.match(html, /aria-controls="aiwork-language-menu"/);
    assert.match(html, /aria-controls="aiwork-theme-menu"/);
  }
});

test("switches the page background with presets and exits custom mode", async () => {
  const [preferences, bootstrap, styles] = await Promise.all([
    readFile(new URL("../app/preferences.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/theme-boot.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(preferences, /CUSTOM_THEME_ACTIVE_KEY/);
  assert.match(
    preferences,
    /function chooseTheme[\s\S]*setCustomEnabled\(false\)[\s\S]*removeItem\(CUSTOM_THEME_ACTIVE_KEY\)[\s\S]*applyCustomToDocument\(null\)/,
  );
  assert.match(bootstrap, /aiwork-custom-enabled/);
  assert.match(styles, /body\s*{[\s\S]*background-color:\s*var\(--bg\)/);
  assert.match(styles, /\.home-shell\s*{[\s\S]*background:\s*var\(--bg\)/);

  for (const theme of [
    "light",
    "dark",
    "aurora",
    "editorial",
    "console",
    "synthwave",
    "system",
  ]) {
    assert.match(
      styles,
      new RegExp(`:root\\[data-theme="${theme}"\\][\\s\\S]*?--bg:`),
      `${theme} must define its own page background`,
    );
  }
});

test("keeps detail pages compact on desktop and single-column on mobile", async () => {
  const styles = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );

  assert.match(
    styles,
    /\.detail-hero\s*{[\s\S]*?min-height:\s*0;[\s\S]*?padding:\s*64px 0 56px;/,
  );
  assert.match(
    styles,
    /\.content-section\s*{[\s\S]*?padding:\s*clamp\(56px,\s*6vw,\s*72px\) 0;/,
  );
  assert.match(
    styles,
    /\.process-list\s*{[\s\S]*?grid-template-columns:\s*repeat\(3,\s*minmax\(0,\s*1fr\)\);/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*860px\)[\s\S]*?\.process-list,[\s\S]*?grid-template-columns:\s*1fr;/,
  );
  assert.match(styles, /\.detail-hero\s*{\s*padding:\s*40px 0;/);
  assert.match(styles, /\.content-section\s*{\s*padding:\s*42px 0;/);
});

test("uses the rounded company logo only for the browser favicon", async () => {
  await access(
    new URL(
      "../public/favicon-company-rounded-v2.png",
      import.meta.url,
    ),
  );
  await access(
    new URL("../public/favicon-company-rounded-v2.ico", import.meta.url),
  );
  await access(
    new URL("../public/images/aiwork-wink-assistant.webp", import.meta.url),
  );
  await access(
    new URL(
      "../public/images/aiwork-wink-assistant-192.png",
      import.meta.url,
    ),
  );
  await access(
    new URL(
      "../public/images/aiwork-wink-assistant-512.png",
      import.meta.url,
    ),
  );
  await access(
    new URL("../public/images/aiwork-assistant-open.webp", import.meta.url),
  );
  await access(
    new URL("../public/images/aiwork-assistant-wink.webp", import.meta.url),
  );
  await access(
    new URL("../public/images/aiwork-planner-open.webp", import.meta.url),
  );
  await access(
    new URL("../public/images/aiwork-agent-yellow.webp", import.meta.url),
  );
});

test("changes the assistant from open eyes to a wink on pointer interaction", async () => {
  const [characters, productMark, styles] = await Promise.all([
    readFile(new URL("../app/characters.ts", import.meta.url), "utf8"),
    readFile(
      new URL("../app/components/ProductMark.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(characters, /aiwork-assistant-open\.webp/);
  assert.match(characters, /aiwork-assistant-wink\.webp/);
  assert.match(characters, /aiwork-planner-open\.webp/);
  assert.match(characters, /aiwork-agent-yellow\.webp/);
  assert.match(productMark, /characterKeys\.map/);
  assert.match(productMark, /data-character-layer=\{item\}/);
  assert.match(productMark, /product-mark-image-open/);
  assert.match(productMark, /product-mark-image-wink/);
  assert.match(productMark, /onPointerUp=\{triggerTouchWink\}/);
  assert.match(productMark, /event\.pointerType === "mouse"/);
  assert.match(productMark, /\}, 720\);/);
  assert.match(
    styles,
    /\.product-mark\.is-touch-winking \.product-mark-image-open\s*{\s*opacity:\s*0;/,
  );
  assert.match(
    styles,
    /\.product-mark\.is-touch-winking \.product-mark-image-wink\s*{\s*opacity:\s*1;/,
  );
  assert.match(
    styles,
    /@media \(hover: hover\) and \(pointer: fine\)[\s\S]*?\.product-mark:hover \.product-mark-image-open[\s\S]*?opacity:\s*0;[\s\S]*?\.product-mark:hover \.product-mark-image-wink[\s\S]*?opacity:\s*1;/,
  );
  assert.match(
    styles,
    /@media \(hover: none\) and \(pointer: coarse\)[\s\S]*?\.product-mark:active \.product-mark-image-open[\s\S]*?opacity:\s*0;[\s\S]*?\.product-mark:active \.product-mark-image-wink[\s\S]*?opacity:\s*1;/,
  );
});

test("persists one site-wide character selection inside the theme menu", async () => {
  const [characters, preferences, bootstrap, styles] = await Promise.all([
    readFile(new URL("../app/characters.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/preferences.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/theme-boot.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(characters, /characterKeys = \["aiwork", "planner"\]/);
  assert.match(characters, /characterPickerCopy: Record<Locale/);
  assert.match(preferences, /CHARACTER_STORAGE_KEY = "aiwork-character"/);
  assert.match(preferences, /character:\s*CharacterKey/);
  assert.match(preferences, /setCharacter:\s*\(character:\s*CharacterKey\)/);
  assert.match(
    preferences,
    /root\.dataset\.character = character;[\s\S]*localStorage\.setItem\(CHARACTER_STORAGE_KEY, character\)/,
  );
  assert.match(
    preferences,
    /event\.key === CHARACTER_STORAGE_KEY[\s\S]*setCharacterState\(event\.newValue\)/,
  );
  assert.match(preferences, /id="aiwork-character-picker-title"/);
  assert.match(preferences, /className="character-grid"/);
  assert.match(preferences, /role="menuitemradio"/);
  assert.match(preferences, /className="theme-trigger-character-layer"/);
  assert.match(bootstrap, /const characters = new Set\(\["aiwork","planner"\]\)/);
  assert.match(bootstrap, /localStorage\.getItem\("aiwork-character"\)/);
  assert.match(bootstrap, /root\.dataset\.character = characters\.has/);
  assert.match(styles, /\.character-grid\s*{[\s\S]*grid-template-columns:\s*repeat\(2,/);
  assert.match(styles, /\.character-option\s*{[\s\S]*min-height:\s*82px;/);
  assert.match(
    styles,
    /@media \(max-width:\s*620px\)[\s\S]*?\.character-option\s*{[\s\S]*?min-height:\s*78px;/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*360px\)[\s\S]*?\.character-grid\s*{[\s\S]*?grid-template-columns:\s*1fr;/,
  );
  assert.match(
    styles,
    /:root\[data-character="planner"\] \.product-mark\s*{[\s\S]*--mark-scale:\s*1\.04;/,
  );
  assert.match(
    styles,
    /:root\[data-character="planner"\] \.product-mark-character\[data-character-layer="planner"\]\s*{[\s\S]*display:\s*block;/,
  );
  assert.match(
    styles,
    /:root\[data-character="planner"\] \.theme-trigger-character-layer\[data-character-layer="planner"\]\s*{[\s\S]*display:\s*block !important;/,
  );
});

test("keeps localized header controls and the product mark from overlapping", async () => {
  const [header, styles] = await Promise.all([
    readFile(
      new URL("../app/components/SiteHeader.tsx", import.meta.url),
      "utf8",
    ),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);

  assert.match(header, /data-locale=\{locale\}/);
  assert.match(
    styles,
    /\.section-topbar\s*>\s*\*,[\s\S]*?min-width:\s*0;/,
  );
  assert.match(
    styles,
    /\.home-hero-intro \.eyebrow\s*{[\s\S]*?max-width:\s*calc\(100% - 80px\);[\s\S]*?overflow-wrap:\s*anywhere;/,
  );
  assert.match(styles, /\.brand-product-mark\s*{\s*--mark-size:\s*40px;/);
  assert.match(styles, /\.home-product-mark\s*{\s*--mark-size:\s*64px;/);
  assert.match(styles, /\.assistant-product-mark\s*{\s*--mark-size:\s*44px;/);
  assert.match(styles, /\.support-product-mark\s*{\s*--mark-size:\s*54px;/);
  assert.match(styles, /\.preview-product-mark\s*{\s*--mark-size:\s*32px;/);
  assert.match(
    styles,
    /\.browser-preview-titlebar\s*{\s*grid-template-columns:\s*32px 1fr auto;/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*620px\)[\s\S]*?\.brand-product-mark\s*{\s*--mark-size:\s*34px;[\s\S]*?\.home-product-mark\s*{\s*--mark-size:\s*54px;/,
  );
  assert.match(styles, /max-width:\s*calc\(100% - 66px\);/);
  assert.match(
    styles,
    /\.theme-menu,[\s\S]*?\.language-menu\s*{[\s\S]*?inset-inline-end:\s*0;/,
  );
  assert.match(
    styles,
    /@media \(max-width:\s*1240px\)[\s\S]*?\.section-topbar \.main-nav\s*{[\s\S]*?display:\s*none;[\s\S]*?\.section-mobile-nav\s*{[\s\S]*?display:\s*flex;/,
  );
  assert.match(
    styles,
    /@media \(min-width:\s*1241px\)[\s\S]*?\.section-topbar:not\(\[data-locale="ko"\]\) \.section-nav\s*{[\s\S]*?gap:\s*13px;/,
  );
});
