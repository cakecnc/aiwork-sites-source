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
  assert.match(html, /AI가 이해하고/);
  assert.match(html, /AIWORK가 안전하게 실행합니다/);
  assert.match(html, /AI Agent 본체 미구현/);
  assert.match(html, /맥락/);
  assert.match(html, /문서 비교/);
  assert.match(html, /검수·전달/);
  assert.match(html, /현재 탭 수집·미리보기/);
  assert.match(html, /Drive appDataFolder 저장/);
  assert.match(html, /공식 홈페이지·구매 문의/);
  assert.match(html, /개인 AI 프로필/);
  assert.match(html, /Daum Email·Gemma4/);
  assert.match(html, /Agent Runtime·외부 실행/);
  assert.match(html, /Browser RC 구현 · AI Agent 본체 미구현/);
  assert.match(html, /후속 실행 엔진 상태/);
  assert.match(html, /OpenClaw Gateway/);
  assert.match(html, /Desktop Helper 직접 조작/);
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
  assert.match(html, /support@aiwork\.to/);
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
  assert.match(html, /support@aiwork\.to/);
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
  ["/features", "CONNECTED INTELLIGENCE", "미구현 · 설계 검증"],
  ["/security", "SECURITY BY BOUNDARY", "향후 기본 허용 목표"],
  ["/pricing", "PLANS &amp; INQUIRY", "구매 문의 접수"],
  ["/download", "DOWNLOAD &amp; RELEASE", "배포 파일 준비 중"],
  ["/contact", "CONTACT AIWORK", "PURCHASE INQUIRY"],
  ["/how-to-use", "HOW TO USE AIWORK", "Browser 사용 흐름 6단계"],
  ["/how-to-use/browser", "AIWORK BROWSER 1.0", "확장 아이콘은 수집"],
  ["/how-to-use/getting-started", "GETTING STARTED", "첫 수집 체크리스트"],
  ["/how-to-use/documents", "DOCUMENTS", "현재 파일 업로드 기능 없음"],
  ["/how-to-use/web-research", "WEB RESEARCH", "현재 자동 Research 기능 없음"],
  ["/how-to-use/daum-email", "DAUM EMAIL", "현재 연결 화면이 없습니다"],
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
    assert.match(html, /aiwork-anime-profile-v1\.webp/);
    assert.match(html, /aiwork-preference-boot/);
    assert.match(html, /aria-controls="aiwork-language-menu"/);
    assert.match(html, /aria-controls="aiwork-theme-menu"/);
  }
});

test("fails closed when purchase email automation is not configured", async () => {
  const readiness = await render("/api/purchase-inquiries");
  assert.equal(readiness.status, 200);
  assert.deepEqual(await readiness.json(), {
    available: false,
    supportEmail: "support@aiwork.to",
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

test("keeps every branded image referenced by the website", async () => {
  const css = await readFile(
    new URL("../app/globals.css", import.meta.url),
    "utf8",
  );
  const heroReference = css.match(
    /url\(["']?(\/images\/aiwork-synthwave-hero-v2\.(?:png|webp))["']?\)/i,
  )?.[1];

  assert.ok(heroReference, "Synthwave hero reference must be present");
  await Promise.all([
    access(
      new URL(
        "../public/images/aiwork-anime-profile-192.png",
        import.meta.url,
      ),
    ),
    access(
      new URL(
        "../public/images/aiwork-anime-profile-v1.webp",
        import.meta.url,
      ),
    ),
    access(new URL(`../public${heroReference}`, import.meta.url)),
  ]);
});
