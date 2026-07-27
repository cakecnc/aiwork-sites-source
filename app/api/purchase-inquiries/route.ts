import {
  PURCHASE_PRODUCTS,
  SUPPORT_EMAIL,
  type PurchaseProductId,
} from "../../site-config";

const MAX_BODY_BYTES = 16 * 1024;
const CONSENT_VERSION = "2026-07-28";
const HOUR_MS = 60 * 60 * 1000;
const RETENTION_MS = 90 * 24 * HOUR_MS;
const PROCESSING_LEASE_MS = 2 * 60 * 1000;
const ATTEMPT_IP_LIMIT = 30;
const ATTEMPT_GLOBAL_LIMIT = 1_000;
const APPROVED_EMAIL_LIMIT = 3;
const APPROVED_IP_LIMIT = 5;
const APPROVED_GLOBAL_LIMIT = 200;

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
}

interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  first<T = unknown>(): Promise<T | null>;
  run<T = unknown>(): Promise<D1Result<T>>;
}

interface D1DatabaseLike {
  prepare(query: string): D1Statement;
}

type Bindings = {
  DB?: D1DatabaseLike;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  INQUIRY_HMAC_KEY?: string;
  INQUIRY_FROM?: string;
};

type InquiryPayload = {
  product?: unknown;
  name?: unknown;
  company?: unknown;
  email?: unknown;
  message?: unknown;
  consent?: unknown;
  website?: unknown;
  startedAt?: unknown;
  requestKey?: unknown;
  turnstileToken?: unknown;
};

type InquiryRow = {
  id: string;
  product: string;
  email_hash: string;
  payload_hash: string;
  consent_version: string;
  updated_at: number;
  operator_status: string;
  customer_status: string;
};

async function bindings(): Promise<Bindings> {
  try {
    const cloudflare = await import("cloudflare:workers");
    return cloudflare.env as unknown as Bindings;
  } catch {
    return {};
  }
}

function isConfigured(config: Bindings): config is Required<
  Pick<
    Bindings,
    "DB" | "RESEND_API_KEY" | "TURNSTILE_SECRET_KEY" | "TURNSTILE_SITE_KEY" | "INQUIRY_HMAC_KEY"
  >
> & Bindings {
  return Boolean(
    config.DB &&
      config.RESEND_API_KEY &&
      config.TURNSTILE_SECRET_KEY &&
      config.TURNSTILE_SITE_KEY &&
      config.INQUIRY_HMAC_KEY &&
      config.INQUIRY_HMAC_KEY.length >= 32,
  );
}

function jsonError(status: number, error: string, message: string) {
  return Response.json({ error, message }, { status });
}

function text(value: unknown, maxLength: number): string | undefined {
  if (typeof value !== "string") return undefined;
  const normalized = value.trim();
  if (!normalized || normalized.length > maxLength) return undefined;
  return normalized;
}

function singleLine(value: unknown, maxLength: number): string | undefined {
  const normalized = text(value, maxLength);
  if (!normalized || /[\u0000-\u001f\u007f]/u.test(normalized)) return undefined;
  return normalized;
}

function optionalSingleLine(value: unknown, maxLength: number): string | undefined {
  if (value === undefined || value === null || value === "") return "";
  return singleLine(value, maxLength);
}

function multiline(value: unknown, maxLength: number): string | undefined {
  const normalized = text(value, maxLength);
  if (
    !normalized ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(normalized)
  ) {
    return undefined;
  }
  return normalized.replace(/\r\n?/gu, "\n");
}

function isEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(value);
}

async function readPayload(request: Request): Promise<InquiryPayload | Response> {
  if (!request.body) {
    return jsonError(400, "BODY_REQUIRED", "문의 내용을 입력해 주세요.");
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      totalBytes += value.byteLength;
      if (totalBytes > MAX_BODY_BYTES) {
        await reader.cancel().catch(() => undefined);
        return jsonError(413, "REQUEST_TOO_LARGE", "문의 내용이 너무 깁니다.");
      }
      chunks.push(value);
    }
  } catch {
    return jsonError(400, "BODY_INVALID", "문의 내용을 읽을 수 없습니다.");
  }

  const bytes = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.byteLength;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(new TextDecoder("utf-8", { fatal: true }).decode(bytes));
  } catch {
    return jsonError(400, "JSON_INVALID", "문의 내용을 읽을 수 없습니다.");
  }
  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed) ||
    Object.getPrototypeOf(parsed) !== Object.prototype
  ) {
    return jsonError(400, "JSON_INVALID", "문의 형식이 올바르지 않습니다.");
  }
  return parsed as InquiryPayload;
}

async function hmac(value: string, key: string): Promise<string> {
  const encoder = new TextEncoder();
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(key),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
  return Array.from(new Uint8Array(signature), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}

async function cleanupExpired(db: D1DatabaseLike, now: number): Promise<void> {
  await Promise.all([
    db.prepare("DELETE FROM purchase_inquiries WHERE expires_at < ?").bind(now).run(),
    db.prepare("DELETE FROM inquiry_rate_limits WHERE expires_at < ?").bind(now).run(),
    db.prepare("DELETE FROM inquiry_quota_reservations WHERE expires_at < ?")
      .bind(now)
      .run(),
  ]);
}

async function reserveQuota(
  db: D1DatabaseLike,
  scope: string,
  limit: number,
  now: number,
): Promise<boolean> {
  const bucket = Math.floor(now / HOUR_MS);
  const expiresAt = (bucket + 2) * HOUR_MS;
  const reserved = await db.prepare(
    `INSERT INTO inquiry_rate_limits ("key", "count", expires_at)
     VALUES (?, 1, ?)
     ON CONFLICT("key") DO UPDATE SET "count" = inquiry_rate_limits."count" + 1
     WHERE inquiry_rate_limits."count" < ?
     RETURNING "count"`,
  )
    .bind(`${scope}:${bucket}`, expiresAt, limit)
    .first<{ count: number }>();
  return Boolean(reserved);
}

async function reserveApprovedQuota(
  db: D1DatabaseLike,
  id: string,
  emailHash: string,
  ipHash: string,
  now: number,
): Promise<boolean> {
  const bucket = Math.floor(now / HOUR_MS);
  const expiresAt = (bucket + 2) * HOUR_MS;
  const reserved = await db.prepare(
    `INSERT INTO inquiry_quota_reservations
       (id, bucket, email_hash, ip_hash, expires_at)
     SELECT ?, ?, ?, ?, ?
     WHERE
       (SELECT COUNT(*) FROM inquiry_quota_reservations
         WHERE email_hash = ? AND bucket = ?) < ?
       AND
       (SELECT COUNT(*) FROM inquiry_quota_reservations
         WHERE ip_hash = ? AND bucket = ?) < ?
       AND
       (SELECT COUNT(*) FROM inquiry_quota_reservations
         WHERE bucket = ?) < ?
     ON CONFLICT(id) DO NOTHING
     RETURNING id`,
  )
    .bind(
      id,
      bucket,
      emailHash,
      ipHash,
      expiresAt,
      emailHash,
      bucket,
      APPROVED_EMAIL_LIMIT,
      ipHash,
      bucket,
      APPROVED_IP_LIMIT,
      bucket,
      APPROVED_GLOBAL_LIMIT,
    )
    .first<{ id: string }>();
  return Boolean(reserved);
}

async function verifyTurnstile(
  token: string,
  secret: string,
  request: Request,
): Promise<boolean> {
  try {
    const form = new FormData();
    form.set("secret", secret);
    form.set("response", token);
    const remoteIp = request.headers.get("cf-connecting-ip");
    if (remoteIp) form.set("remoteip", remoteIp);
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body: form },
    );
    if (!response.ok) return false;
    const result = (await response.json()) as {
      success?: boolean;
      hostname?: string;
      action?: string;
    };
    return Boolean(
      result.success &&
        result.hostname === new URL(request.url).hostname &&
        result.action === "purchase-inquiry",
    );
  } catch {
    return false;
  }
}

async function sendEmail(
  apiKey: string,
  idempotencyKey: string,
  payload: Record<string, unknown>,
): Promise<string> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${apiKey}`,
      "content-type": "application/json",
      "idempotency-key": idempotencyKey,
      "user-agent": "AIWORK Website/1.0",
    },
    body: JSON.stringify(payload),
  });
  const result = (await response.json()) as { id?: string; message?: string };
  if (!response.ok || !result.id) {
    throw new Error(result.message || "EMAIL_DELIVERY_FAILED");
  }
  return result.id;
}

function sameInquiry(
  row: InquiryRow,
  product: string,
  emailHash: string,
  payloadHash: string,
): boolean {
  return (
    row.product === product &&
    row.email_hash === emailHash &&
    row.payload_hash === payloadHash &&
    row.consent_version === CONSENT_VERSION
  );
}

async function readInquiry(
  db: D1DatabaseLike,
  id: string,
): Promise<InquiryRow | null> {
  return db.prepare(
    `SELECT id, product, email_hash, payload_hash, consent_version, updated_at,
            operator_status, customer_status
       FROM purchase_inquiries WHERE id = ?`,
  )
    .bind(id)
    .first<InquiryRow>();
}

export async function GET() {
  const config = await bindings();
  if (config.DB) {
    await cleanupExpired(config.DB, Date.now());
  }
  return Response.json({
    available: isConfigured(config),
    siteKey: isConfigured(config) ? config.TURNSTILE_SITE_KEY : undefined,
    supportEmail: SUPPORT_EMAIL,
  });
}

export async function POST(request: Request) {
  const config = await bindings();
  if (!isConfigured(config)) {
    return jsonError(
      503,
      "EMAIL_NOT_CONFIGURED",
      `자동 확인 이메일을 준비 중입니다. ${SUPPORT_EMAIL}로 문의해 주세요.`,
    );
  }

  const requestUrl = new URL(request.url);
  const origin = request.headers.get("origin");
  let originUrl: URL | undefined;
  try {
    originUrl = origin ? new URL(origin) : undefined;
  } catch {
    originUrl = undefined;
  }
  if (!originUrl || originUrl.origin !== requestUrl.origin) {
    return jsonError(403, "ORIGIN_INVALID", "요청 출처를 확인할 수 없습니다.");
  }

  const contentType = request.headers.get("content-type") ?? "";
  if (!contentType.toLowerCase().startsWith("application/json")) {
    return jsonError(415, "REQUEST_INVALID", "요청 형식이 올바르지 않습니다.");
  }
  const contentLengthHeader = request.headers.get("content-length");
  if (
    contentLengthHeader &&
    (!/^\d+$/u.test(contentLengthHeader) ||
      Number(contentLengthHeader) > MAX_BODY_BYTES)
  ) {
    return jsonError(413, "REQUEST_TOO_LARGE", "문의 내용이 너무 깁니다.");
  }

  const parsed = await readPayload(request);
  if (parsed instanceof Response) return parsed;
  const payload = parsed;

  if (payload.website) {
    return jsonError(400, "SPAM_REJECTED", "문의 내용을 확인해 주세요.");
  }
  const now = Date.now();
  if (
    typeof payload.startedAt !== "number" ||
    now - payload.startedAt < 2_000 ||
    now - payload.startedAt > 24 * HOUR_MS
  ) {
    return jsonError(400, "FORM_TIMING_INVALID", "페이지를 새로고침한 뒤 다시 작성해 주세요.");
  }

  const productIds = new Set(PURCHASE_PRODUCTS.map((product) => product.id));
  const product =
    typeof payload.product === "string" && productIds.has(payload.product as PurchaseProductId)
      ? (payload.product as PurchaseProductId)
      : undefined;
  const name = singleLine(payload.name, 80);
  const company = optionalSingleLine(payload.company, 100);
  const email = singleLine(payload.email, 254)?.toLowerCase();
  const message = multiline(payload.message, 2_000);
  const turnstileToken = singleLine(payload.turnstileToken, 2_048);
  const requestKey = singleLine(payload.requestKey, 64);
  if (
    !product ||
    !name ||
    company === undefined ||
    !email ||
    !isEmail(email) ||
    !message ||
    message.length < 10 ||
    payload.consent !== true ||
    !turnstileToken ||
    !requestKey ||
    !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu.test(
      requestKey,
    )
  ) {
    return jsonError(400, "VALIDATION_FAILED", "필수 항목과 개인정보 동의를 확인해 주세요.");
  }

  const emailHash = await hmac(email, config.INQUIRY_HMAC_KEY);
  const ipHash = await hmac(
    request.headers.get("cf-connecting-ip") ?? "unknown",
    config.INQUIRY_HMAC_KEY,
  );
  const payloadHash = await hmac(
    JSON.stringify([
      product,
      "ko",
      name,
      company,
      email,
      message,
      CONSENT_VERSION,
    ]),
    config.INQUIRY_HMAC_KEY,
  );

  await cleanupExpired(config.DB, now);
  if (
    !(await reserveQuota(
      config.DB,
      `attempt:ip:${ipHash}`,
      ATTEMPT_IP_LIMIT,
      now,
    )) ||
    !(await reserveQuota(
      config.DB,
      "attempt:global",
      ATTEMPT_GLOBAL_LIMIT,
      now,
    ))
  ) {
    return jsonError(429, "RATE_LIMITED", "잠시 후 다시 시도해 주세요.");
  }

  if (
    !(await verifyTurnstile(
      turnstileToken,
      config.TURNSTILE_SECRET_KEY,
      request,
    ))
  ) {
    return jsonError(400, "BOT_CHECK_FAILED", "보안 확인을 다시 완료해 주세요.");
  }

  let inquiry = await readInquiry(config.DB, requestKey);
  let inserted = false;
  if (inquiry) {
    if (!sameInquiry(inquiry, product, emailHash, payloadHash)) {
      return jsonError(
        409,
        "IDEMPOTENCY_CONFLICT",
        "동일한 접수번호에 다른 문의 내용을 사용할 수 없습니다.",
      );
    }
    if (inquiry.customer_status === "sent") {
      return Response.json({
        id: requestKey,
        message: "이미 접수된 구매 문의입니다. 확인 이메일을 확인해 주세요.",
      });
    }
    if (
      inquiry.operator_status === "pending" &&
      inquiry.customer_status === "pending" &&
      now - inquiry.updated_at < PROCESSING_LEASE_MS
    ) {
      return Response.json(
        {
          id: requestKey,
          message: "구매 문의를 처리 중입니다. 잠시 후 확인 이메일을 확인해 주세요.",
        },
        { status: 202 },
      );
    }
    const claimed = await config.DB.prepare(
      `UPDATE purchase_inquiries SET updated_at = ?
       WHERE id = ? AND updated_at = ?
       RETURNING id`,
    )
      .bind(now, requestKey, inquiry.updated_at)
      .first<{ id: string }>();
    if (!claimed) {
      return Response.json(
        {
          id: requestKey,
          message: "구매 문의를 처리 중입니다. 잠시 후 확인 이메일을 확인해 주세요.",
        },
        { status: 202 },
      );
    }
    inquiry = { ...inquiry, updated_at: now };
  } else {
    const created = await config.DB.prepare(
      `INSERT INTO purchase_inquiries
        (id, product, locale, email_hash, ip_hash, payload_hash, consent_version,
         created_at, updated_at, expires_at, operator_status, customer_status)
       VALUES (?, ?, 'ko', ?, ?, ?, ?, ?, ?, ?, 'pending', 'pending')
       ON CONFLICT(id) DO NOTHING
       RETURNING id`,
    )
      .bind(
        requestKey,
        product,
        emailHash,
        ipHash,
        payloadHash,
        CONSENT_VERSION,
        now,
        now,
        now + RETENTION_MS,
      )
      .first<{ id: string }>();
    if (!created) {
      const winner = await readInquiry(config.DB, requestKey);
      if (!winner || !sameInquiry(winner, product, emailHash, payloadHash)) {
        return jsonError(
          409,
          "IDEMPOTENCY_CONFLICT",
          "동일한 접수번호에 다른 문의 내용을 사용할 수 없습니다.",
        );
      }
      return Response.json(
        {
          id: requestKey,
          message: "구매 문의를 처리 중입니다. 잠시 후 확인 이메일을 확인해 주세요.",
        },
        { status: 202 },
      );
    }
    inserted = true;
    inquiry = {
      id: requestKey,
      product,
      email_hash: emailHash,
      payload_hash: payloadHash,
      consent_version: CONSENT_VERSION,
      updated_at: now,
      operator_status: "pending",
      customer_status: "pending",
    };
  }

  if (
    inserted &&
    !(await reserveApprovedQuota(
      config.DB,
      requestKey,
      emailHash,
      ipHash,
      now,
    ))
  ) {
    await config.DB.prepare(
      `DELETE FROM purchase_inquiries
       WHERE id = ? AND operator_status = 'pending' AND customer_status = 'pending'`,
    )
      .bind(requestKey)
      .run();
    return jsonError(429, "RATE_LIMITED", "잠시 후 다시 시도해 주세요.");
  }

  const productName =
    PURCHASE_PRODUCTS.find((item) => item.id === product)?.name ?? product;
  const from = config.INQUIRY_FROM ?? "AIWORK <receipts@notify.aiwork.to>";
  const operatorText = [
    "AIWORK 홈페이지 구매 문의가 접수됐습니다.",
    `접수번호: ${requestKey}`,
    `상품: ${productName}`,
    `이름: ${name}`,
    `회사명: ${company || "-"}`,
    `회신 이메일: ${email}`,
    "",
    "문의 내용",
    message,
  ].join("\n");

  try {
    const operatorProviderId =
      inquiry.operator_status === "sent"
        ? undefined
        : await sendEmail(config.RESEND_API_KEY, `${requestKey}:operator`, {
            from,
            to: [SUPPORT_EMAIL],
            subject: `[AIWORK 구매 문의] ${productName} · ${name}`,
            text: operatorText,
            reply_to: email,
          });
    if (operatorProviderId) {
      await config.DB.prepare(
        `UPDATE purchase_inquiries
         SET operator_status = 'sent', operator_provider_id = ?, updated_at = ?
         WHERE id = ?`,
      )
        .bind(operatorProviderId, Date.now(), requestKey)
        .run();
    }
  } catch {
    await config.DB.prepare(
      `UPDATE purchase_inquiries
       SET operator_status = 'failed', customer_status = 'not_sent', updated_at = ?
       WHERE id = ?`,
    )
      .bind(Date.now(), requestKey)
      .run();
    return jsonError(502, "OPERATOR_EMAIL_FAILED", "접수하지 못했습니다. 이메일로 문의해 주세요.");
  }

  const customerText = [
    `${name}님, AIWORK 구매 문의가 접수됐습니다.`,
    "",
    `접수번호: ${requestKey}`,
    `관심 상품: ${productName}`,
    "",
    "이 메일은 구매·결제 완료 영수증이 아닙니다.",
    `제공 범위와 일정 확인 후 ${SUPPORT_EMAIL}에서 순차 답변합니다.`,
  ].join("\n");
  try {
    const customerProviderId = await sendEmail(
      config.RESEND_API_KEY,
      `${requestKey}:customer`,
      {
        from,
        to: [email],
        subject: `[AIWORK] 구매 문의 접수 확인 · ${productName}`,
        text: customerText,
        reply_to: SUPPORT_EMAIL,
      },
    );
    await config.DB.prepare(
      `UPDATE purchase_inquiries
       SET customer_status = 'sent', customer_provider_id = ?, updated_at = ?
       WHERE id = ?`,
    )
      .bind(customerProviderId, Date.now(), requestKey)
      .run();
  } catch {
    await config.DB.prepare(
      "UPDATE purchase_inquiries SET customer_status = 'failed', updated_at = ? WHERE id = ?",
    )
      .bind(Date.now(), requestKey)
      .run();
    return Response.json(
      {
        id: requestKey,
        message:
          "구매 문의는 접수됐지만 확인 이메일 발송이 지연되고 있습니다. 운영자가 순차 확인합니다.",
      },
      { status: 202 },
    );
  }

  return Response.json(
    {
      id: requestKey,
      message: "구매 문의가 접수됐습니다. 입력한 이메일로 확인 메일을 보냈습니다.",
    },
    { status: 201 },
  );
}
