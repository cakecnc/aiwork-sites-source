import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

const payments = [
  { id: "TF7HCLYC5PM8S", price: "USD 19" },
  { id: "WTD5ZEKLT5GJS", price: "USD 49" },
  { id: "H5SXU7HJ8GVRE", price: "USD 29" },
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

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    `${process.pid}-${Date.now()}-${encodeURIComponent(pathname)}`,
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`https://localhost${pathname}`, {
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

test("renders honest release-candidate product status", async () => {
  const response = await render("/");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assertSecurityHeaders(response);

  const html = await response.text();
  assert.doesNotMatch(html, developmentPreviewMeta);
  assert.match(html, /AIWORK/);
  assert.match(html, /Release Candidate/);
  assert.match(html, /현재 탭/);
  assert.match(html, /로드맵/);
  assert.doesNotMatch(html, /AIWORK ASSISTANT/);
  assert.doesNotMatch(html, /근거 자료[\s\S]{0,20}>8</);
  const releaseNotice =
    "Professional과 Business는 아직 일반 출시되지 않았습니다";
  assert.notEqual(html.indexOf(releaseNotice), -1);
  assert.ok(
    html.indexOf(releaseNotice) < html.indexOf(payments[0].id),
    "Pre-release terms must appear before the first payment link",
  );
  let previousPaymentIndex = -1;
  for (const payment of payments) {
    const priceIndex = html.indexOf(payment.price, previousPaymentIndex + 1);
    const linkIndex = html.indexOf(payment.id, priceIndex);
    assert.ok(priceIndex > previousPaymentIndex, `${payment.price} is missing or out of order`);
    assert.ok(linkIndex > priceIndex, `${payment.id} is not mapped to ${payment.price}`);
    previousPaymentIndex = linkIndex;
  }
  assert.match(html, /R3NBTNC3KYCVE/);
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
  assert.match(html, /정책 버전[\s\S]{0,120}2026-07-26/);
  assert.match(html, /activeTab/);
  assert.match(html, /drive\.appdata/);
  assert.match(html, /appDataFolder/);
  assert.match(html, /1,000,000 bytes/);
  assert.match(html, /__cf_bm/);
  assert.match(html, /광고·맞춤형[\s\S]{0,80}추적 쿠키/);
  assert.match(html, /ENGLISH SUMMARY/);
  assert.match(html, /cakecnc@daum\.net/);
  assert.match(html, /주식회사 씨엔씨코퍼레이션/);
  assert.match(html, /140-81-50087/);
  assert.match(html, /What’s past is prologue/);
});

const detailRoutes = [
  ["/product", "AIWORK PRODUCT", "플랫폼 로드맵"],
  ["/features", "CONNECTED INTELLIGENCE", "미구현 · 설계 검증"],
  ["/security", "SECURITY BY BOUNDARY", "향후 기본 허용 목표"],
  ["/pricing", "GLOBAL PAYMENTS", "아직 일반 출시되지 않았습니다"],
  ["/download", "DOWNLOAD &amp; RELEASE", "배포 파일 준비 중"],
  ["/contact", "CONTACT AIWORK", "운영 사업자 정보"],
  ["/how-to-use", "HOW TO USE AIWORK", "Browser 사용 흐름 6단계"],
  ["/how-to-use/browser", "AIWORK BROWSER 1.0", "Drive 연결 해제"],
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
