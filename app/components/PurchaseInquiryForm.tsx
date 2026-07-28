"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import {
  PURCHASE_PRODUCTS,
  SUPPORT_EMAIL,
  type PurchaseProductId,
} from "../site-config";

type Readiness = {
  available: boolean;
  siteKey?: string;
};

type TurnstileApi = {
  render(
    element: HTMLElement,
    options: {
      sitekey: string;
      action: string;
      callback(token: string): void;
      "expired-callback"(): void;
      "error-callback"(): void;
    },
  ): string;
  reset(widgetId: string): void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

function selectedProductFromUrl(): PurchaseProductId {
  const requested = new URLSearchParams(window.location.search).get("product");
  return PURCHASE_PRODUCTS.some((product) => product.id === requested)
    ? (requested as PurchaseProductId)
    : "professional";
}

function createRequestKey() {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  const values = new Uint32Array(4);
  if (typeof globalThis.crypto?.getRandomValues === "function") {
    globalThis.crypto.getRandomValues(values);
  } else {
    for (let index = 0; index < values.length; index += 1) {
      values[index] = Math.floor(Math.random() * 0xffffffff);
    }
  }

  return `${Date.now().toString(36)}-${Array.from(values, (value) =>
    value.toString(36),
  ).join("-")}`;
}

export default function PurchaseInquiryForm() {
  const [product, setProduct] = useState<PurchaseProductId>("professional");
  const [readiness, setReadiness] = useState<Readiness>({ available: false });
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<
    { tone: "neutral" | "success" | "error"; message: string } | undefined
  >();
  const [submitting, setSubmitting] = useState(false);
  const startedAt = useRef(0);
  const requestKey = useRef("");
  const turnstileContainer = useRef<HTMLDivElement>(null);
  const turnstileWidget = useRef<string | undefined>(undefined);

  useEffect(() => {
    startedAt.current = Date.now();
    requestKey.current = createRequestKey();
    const frame = window.requestAnimationFrame(() => {
      setProduct(selectedProductFromUrl());
    });
    void fetch("/api/purchase-inquiries", {
      headers: { accept: "application/json" },
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("readiness unavailable");
        return (await response.json()) as Readiness;
      })
      .then(setReadiness)
      .catch(() => setReadiness({ available: false }));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!readiness.available || !readiness.siteKey || !turnstileContainer.current) {
      return;
    }

    const scriptId = "aiwork-turnstile";
    const renderWidget = () => {
      if (
        !window.turnstile ||
        !turnstileContainer.current ||
        turnstileWidget.current
      ) {
        return;
      }
      turnstileWidget.current = window.turnstile.render(
        turnstileContainer.current,
        {
          sitekey: readiness.siteKey ?? "",
          action: "purchase-inquiry",
          callback: setTurnstileToken,
          "expired-callback": () => setTurnstileToken(""),
          "error-callback": () => setTurnstileToken(""),
        },
      );
    };

    const existing = document.getElementById(scriptId) as
      | HTMLScriptElement
      | null;
    if (existing) {
      existing.addEventListener("load", renderWidget, { once: true });
      renderWidget();
      return () => existing.removeEventListener("load", renderWidget);
    }

    const script = document.createElement("script");
    script.id = scriptId;
    script.src =
      "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
    script.async = true;
    script.defer = true;
    script.addEventListener("load", renderWidget, { once: true });
    document.head.append(script);
    return () => script.removeEventListener("load", renderWidget);
  }, [readiness]);

  function openEmailFallback(form: HTMLFormElement) {
    const data = new FormData(form);
    const productName =
      PURCHASE_PRODUCTS.find((item) => item.id === product)?.name ?? product;
    const body = [
      `상품: ${productName}`,
      `이름: ${String(data.get("name") ?? "")}`,
      `회사명: ${String(data.get("company") ?? "")}`,
      `회신 이메일: ${String(data.get("email") ?? "")}`,
      "",
      String(data.get("message") ?? ""),
    ].join("\n");
    window.location.href = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(
      `AIWORK 구매 문의 · ${productName}`,
    )}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!readiness.available) {
      openEmailFallback(form);
      return;
    }
    if (!turnstileToken) {
      setStatus({
        tone: "error",
        message: "보안 확인을 완료한 뒤 다시 제출해 주세요.",
      });
      return;
    }

    const data = new FormData(form);
    requestKey.current ||= createRequestKey();
    setSubmitting(true);
    setStatus({ tone: "neutral", message: "구매 문의를 안전하게 접수하는 중입니다." });
    try {
      const response = await fetch("/api/purchase-inquiries", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          product,
          name: data.get("name"),
          company: data.get("company"),
          email: data.get("email"),
          message: data.get("message"),
          consent: data.get("consent") === "on",
          website: data.get("website"),
          startedAt: startedAt.current,
          requestKey: requestKey.current,
          turnstileToken,
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        error?: string;
      };
      if (!response.ok) {
        throw new Error(result.message || result.error || "접수하지 못했습니다.");
      }
      setStatus({
        tone: "success",
        message:
          result.message ??
          "구매 문의가 접수됐습니다. 입력한 이메일의 확인 메일을 확인해 주세요.",
      });
      form.reset();
      setProduct("professional");
      startedAt.current = Date.now();
      requestKey.current = createRequestKey();
    } catch (error) {
      setStatus({
        tone: "error",
        message:
          error instanceof Error
            ? error.message
            : "접수하지 못했습니다. 잠시 후 다시 시도해 주세요.",
      });
    } finally {
      setSubmitting(false);
      setTurnstileToken("");
      if (turnstileWidget.current && window.turnstile) {
        window.turnstile.reset(turnstileWidget.current);
      }
    }
  }

  return (
    <form className="purchase-inquiry-form" lang="ko" onSubmit={handleSubmit}>
      <div className="form-grid">
        <label className="form-field form-field-wide">
          <span>관심 상품</span>
          <select
            name="product"
            value={product}
            onChange={(event) =>
              setProduct(event.target.value as PurchaseProductId)
            }
          >
            {PURCHASE_PRODUCTS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </label>
        <label className="form-field">
          <span>이름</span>
          <input name="name" required minLength={2} maxLength={80} autoComplete="name" />
        </label>
        <label className="form-field">
          <span>회사명 <small>선택</small></span>
          <input name="company" maxLength={100} autoComplete="organization" />
        </label>
        <label className="form-field form-field-wide">
          <span>회신 이메일</span>
          <input
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
          />
        </label>
        <label className="form-field form-field-wide">
          <span>확인할 내용</span>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={2000}
            rows={6}
            placeholder="필요한 기능, 사용 인원, 희망 일정 등을 입력하세요. 비밀번호·API 키·결제정보는 입력하지 마세요."
          />
        </label>
        <label className="honeypot" aria-hidden="true">
          웹사이트
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <label className="consent-check">
        <input name="consent" type="checkbox" required />
        <span>
          문의 처리와 회신을 위해 이름·이메일·문의 내용을 처리하고, 봇 방지
          검증 및 Resend·Daum 메일 전달에 사용하는 데 동의합니다. 자세한 내용은{" "}
          <a href="/privacy">개인정보처리방침</a>에서 확인할 수 있습니다.
        </span>
      </label>
      {readiness.available ? (
        <div className="turnstile-slot" ref={turnstileContainer} />
      ) : (
        <p className="form-availability">
          자동 확인 이메일은 발신 도메인 인증을 준비 중입니다. 현재 제출 버튼은
          안전하게 <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a> 메일 작성으로
          연결됩니다.
        </p>
      )}
      {status && (
        <p className="form-status" data-tone={status.tone} role="status" aria-live="polite">
          {status.message}
        </p>
      )}
      <button className="primary-button form-submit" type="submit" disabled={submitting}>
        {submitting
          ? "접수 중…"
          : readiness.available
            ? "구매 문의 등록"
            : "이메일로 구매 문의"}{" "}
        <span aria-hidden="true">↗</span>
      </button>
    </form>
  );
}
