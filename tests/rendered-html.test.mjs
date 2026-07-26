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

test("renders development preview metadata", async () => {
  const response = await render("/");

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  assertSecurityHeaders(response);

  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /AIWORK/);
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
