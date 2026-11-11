"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import SiteHeader from "../components/SiteHeader";
import SiteFooter from "../components/SiteFooter";
import { researchCopy, researchPricingCopy, type ResearchLanguage, type ResearchTranslation } from "./research-i18n";
import "./research.css";

const researchSourceNotice: Record<ResearchLanguage, string> = {
  ko: "조회 시 입력한 제품명과 설명은 C&C의 Cake Salon 네이버 검색 연결을 통해 처리됩니다. 제품 사진은 전송하지 않습니다.",
  en: "When you run a search, the product name and description are processed through C&C's Cake Salon NAVER connection. The photo is not sent.",
  ja: "検索時、入力した製品名と説明はC&CのCake Salon NAVER検索接続で処理されます。写真は送信されません。",
  zh: "查询时，输入的产品名称和描述将通过C&C的Cake Salon NAVER搜索连接处理。照片不会被发送。",
};

type SearchItem = { title: string; link: string; description?: string; thumbnail?: string };
type Point = { period: string; ratio: number };
type Evidence<T> = { ok: boolean; items?: T[]; points?: T[]; error?: string };
type ResearchData = {
  query: string;
  retrievedAt: string;
  web: Evidence<SearchItem>;
  blog: Evidence<SearchItem>;
  image: Evidence<SearchItem>;
  trend: Evidence<Point>;
  shoppingCategory: Evidence<Point>;
  shoppingKeyword: Evidence<Point>;
};
type Inputs = {
  productName: string;
  description: string;
  market: string;
  channel: string;
  price: string;
  shoppingCategoryId: string;
};

const initialInputs: Inputs = {
  productName: "", description: "", market: "대한민국", channel: "", price: "", shoppingCategoryId: "",
};

function safeUrl(value: string | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? url.href : null;
  } catch {
    return null;
  }
}

function plainText(value: string | undefined) {
  return (value || "").replace(/<[^>]*>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");
}

function SearchCard({ title, evidence, empty, onRetry, copy }: { title: string; evidence?: Evidence<SearchItem>; empty: string; onRetry: () => void; copy: ResearchTranslation["common"] }) {
  return (
    <section className="research-card">
      <h3>{title}</h3>
      {!evidence ? <p>{copy.pending}</p> : !evidence.ok ? <div><p className="research-error">{evidence.error || copy.lookupFailed}</p><button className="research-retry" type="button" onClick={onRetry}>{copy.retry}</button></div> :
        evidence.items?.length ? <ul className="research-results">{evidence.items.map((item, index) => {
          const href = safeUrl(item.link);
          return <li key={`${item.link}-${index}`}>
            {href ? <a href={href} target="_blank" rel="noopener noreferrer">{plainText(item.title) || copy.source}</a> : <strong>{plainText(item.title)}</strong>}
            {item.description && <p>{plainText(item.description)}</p>}
            {/* eslint-disable-next-line @next/next/no-img-element -- Avoid proxying third-party NAVER results through this server. */}
            {safeUrl(item.thumbnail) && <img className="research-thumbnail" src={safeUrl(item.thumbnail)!} alt={`${copy.imageAlt}: ${plainText(item.title)}`} loading="lazy" referrerPolicy="no-referrer" />}
          </li>;
        })}</ul> : <p>{empty}</p>}
    </section>
  );
}

function RatioCard({ title, evidence, query, note, directUrl, onRetry, copy }: { title: string; evidence?: Evidence<Point>; query: string; note: string; directUrl: string; onRetry: () => void; copy: ResearchTranslation["common"] }) {
  const points = evidence?.points || evidence?.items || [];
  return (
    <section className="research-card">
      <h3>{title}</h3>
      {!evidence ? <p>{copy.pending}</p> : !evidence.ok ? <div><p className="research-error">{evidence.error || copy.lookupFailed}</p><button className="research-retry" type="button" onClick={onRetry}>{copy.retry}</button></div> : points.length ?
        <div className="research-ratios" aria-label={title}>{points.map((point, index) => <div key={`${point.period}-${index}`}>
          <span>{point.period}</span><meter min="0" max="100" value={Math.max(0, Math.min(100, Number(point.ratio) || 0))} />
          <span>{Number(point.ratio).toFixed(1)}</span>
        </div>)}</div> : <p>{copy.noPoints}</p>}
      <p className="research-note">{note}</p>
      <a href={`${directUrl}${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{copy.source}</a>
    </section>
  );
}

export default function ResearchPage() {
  const [language, setLanguage] = useState<ResearchLanguage>("ko");
  const [inputs, setInputs] = useState(initialInputs);
  const [previewUrl, setPreviewUrl] = useState("");
  const [reportInputs, setReportInputs] = useState<Inputs | null>(null);
  const [data, setData] = useState<ResearchData | null>(null);
  const [loading, setLoading] = useState(false);
  const [requestError, setRequestError] = useState("");
  const t = researchCopy[language];
  const pricing = researchPricingCopy[language];
  const locale = { ko: "ko-KR", en: "en-US", ja: "ja-JP", zh: "zh-CN" }[language];

  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);
  useEffect(() => { document.title = `${t.hero.title} | C&C Corporation`; }, [t.hero.title]);

  async function runResearch(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (!inputs.productName.trim() && !inputs.description.trim()) {
      setRequestError(t.form.missing);
      return;
    }
    if (!reportInputs || JSON.stringify(reportInputs) !== JSON.stringify(inputs)) setData(null);
    setReportInputs({ ...inputs });
    setLoading(true);
    setRequestError("");
    try {
      // Photo stays in browser memory; only the text fields below are sent.
      const response = await fetch("/api/research/naver-search", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inputs),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || t.form.failed);
      setData(result.data || result);
    } catch (error) {
      setRequestError(error instanceof Error ? error.message : t.form.failed);
    } finally {
      setLoading(false);
    }
  }

  const product = reportInputs?.productName.trim() || reportInputs?.description.trim().slice(0, 40) || t.report.productFallback;
  const query = data?.query || product;
  const naverSearch = (where: string) => `https://search.naver.com/search.naver?where=${where}&query=`;
  const retrievedAt = data?.retrievedAt ? new Date(data.retrievedAt).toLocaleString(locale) : t.report.noResult;

  return <><SiteHeader active="research" /><main id="main-content" className="research-page" lang={t.htmlLang}>
    <header className="research-hero">
      <div className="research-topbar">
        <Link href="/" className="research-brand" aria-label="C&C Corporation"><img src="/cnc-logo-transparent.png?v=white-20261102" alt="C&C Corporation" width="1744" height="901" /></Link>
        <div className="research-language"><select value={language} aria-label={t.hero.language} onChange={(event) => setLanguage(event.target.value as ResearchLanguage)}>{(Object.keys(researchCopy) as ResearchLanguage[]).map((code) => <option key={code} value={code}>{researchCopy[code].name}</option>)}</select></div>
      </div>
      <span className="research-kicker">{t.hero.kicker}</span>
      <h1>{t.hero.title}</h1>
      <p>{t.hero.intro}</p>
    </header>

    <form className="research-form" onSubmit={runResearch} aria-busy={loading}>
      <div className="research-field research-photo">
        <label htmlFor="research-photo">{t.form.photo}</label>
        <input id="research-photo" type="file" accept="image/*" onChange={(event) => setPreviewUrl(event.currentTarget.files?.[0] ? URL.createObjectURL(event.currentTarget.files[0]) : "")} />
        {/* eslint-disable-next-line @next/next/no-img-element -- Keep the object URL in this browser instead of using an image proxy. */}
        {previewUrl && <img src={previewUrl} alt={t.form.photo} />}
        <small>{t.form.photoNote}</small>
      </div>
      <div className="research-fields">
        <label>{t.form.product}<input value={inputs.productName} maxLength={100} onChange={(event) => setInputs({ ...inputs, productName: event.target.value })} placeholder={t.form.productPh} /></label>
        <label>{t.form.description}<textarea value={inputs.description} maxLength={1000} onChange={(event) => setInputs({ ...inputs, description: event.target.value })} placeholder={t.form.descriptionPh} /></label>
        <label>{t.form.market}<input value={inputs.market} maxLength={60} onChange={(event) => setInputs({ ...inputs, market: event.target.value })} placeholder={t.form.marketPh} /></label>
        <label>{t.form.channel}<input value={inputs.channel} maxLength={60} onChange={(event) => setInputs({ ...inputs, channel: event.target.value })} placeholder={t.form.channelPh} /></label>
        <label>{t.form.price}<input type="number" min="0" value={inputs.price} onChange={(event) => setInputs({ ...inputs, price: event.target.value })} placeholder={t.form.pricePh} /></label>
        <label>{t.form.category}<input inputMode="numeric" pattern="[0-9]{8}" title={t.form.category} value={inputs.shoppingCategoryId} onChange={(event) => setInputs({ ...inputs, shoppingCategoryId: event.target.value })} placeholder={t.form.categoryPh} /></label>
      </div>
      <p className="research-note">{t.form.disclaimer}</p>
      <p className="research-note">{researchSourceNotice[language]}</p>
      <button type="submit" disabled={loading}>{loading ? t.form.loading : reportInputs ? t.form.rerun : t.form.create}</button>
      {requestError && <p className="research-error" role="alert">{requestError} {t.form.preserve}</p>}
    </form>

    <section className="research-payment-form" id="pricing" aria-labelledby="research-pricing-title">
      <header>
        <span className="research-kicker">ACCESS PLANS</span>
        <h2 id="research-pricing-title">{pricing.title}</h2>
        <p>{pricing.status} · {pricing.digital}</p>
      </header>
      <div className="research-plan-grid">
        <article className="research-plan-option">
          <span><strong>{pricing.sixMonth.name}</strong><small>{pricing.sixMonth.billing}</small></span>
          <b>{pricing.sixMonth.price}</b>
          <a className="research-paypal" href="https://www.paypal.com/ncp/payment/6C9AFV8LYB5WN" target="_blank" rel="noopener noreferrer" aria-label={`${pricing.sixMonth.name} · ${pricing.sixMonth.price} · ${pricing.paypalCta}`}>{pricing.paypalCta} <span aria-hidden="true">↗</span></a>
        </article>
        <article className="research-plan-option research-plan-pro">
          <span><strong>{pricing.pro.name}</strong><small>{pricing.pro.billing}</small></span>
          <b>{pricing.pro.price}</b>
          <a className="research-paypal" href="https://www.paypal.com/ncp/payment/3Q8Q8YPXYLR3W" target="_blank" rel="noopener noreferrer" aria-label={`${pricing.pro.name} · ${pricing.pro.price} · ${pricing.paypalCta}`}>{pricing.paypalCta} <span aria-hidden="true">↗</span></a>
        </article>
      </div>
      <div className="research-payment-guide">
        <h3>{pricing.process}</h3>
        <ol><li>{pricing.checkout}</li><li>{pricing.accessCode}</li><li>{pricing.activation}</li></ol>
      </div>
      <div className="research-payment-footer"><p>{pricing.card}</p></div>
    </section>

    {reportInputs && <div className="research-report" aria-live="polite">
      <header><span className="research-kicker">{t.report.kicker}</span><h2>{product}</h2><p>{t.report.query}: <strong>{query}</strong> · {t.report.retrieved}: {retrievedAt}</p></header>
      <div className="research-grid">
        <section className="research-card"><h3>{t.report.customerTitle}</h3><p>{t.report.customer(reportInputs.market, reportInputs.channel, product)}</p><p className="research-note">{t.report.hypothesisNote}</p></section>
        <section className="research-card"><h3>{t.report.positioningTitle}</h3><p>{t.report.positioning(reportInputs.description, product, reportInputs.price)}</p></section>
        <section className="research-card"><h3>{t.report.competitionTitle}</h3><p>{t.report.competition}</p></section>
        <SearchCard title={t.report.webTitle} evidence={data?.web} empty={t.report.webEmpty} onRetry={() => void runResearch()} copy={t.common} />
        <SearchCard title={t.report.blogTitle} evidence={data?.blog} empty={t.report.blogEmpty} onRetry={() => void runResearch()} copy={t.common} />
        <SearchCard title={t.report.imageTitle} evidence={data?.image} empty={t.report.imageEmpty} onRetry={() => void runResearch()} copy={t.common} />
        <RatioCard title={t.report.trendTitle} evidence={data?.trend} query={query} note={t.report.trendNote} directUrl="https://datalab.naver.com/keyword/trendResult.naver?keyword=" onRetry={() => void runResearch()} copy={t.common} />
        <RatioCard title={t.report.categoryTrendTitle} evidence={data?.shoppingCategory} query={query} note={t.report.categoryTrendNote} directUrl="https://datalab.naver.com/shoppingInsight/sCategory.naver?keyword=" onRetry={() => void runResearch()} copy={t.common} />
        <RatioCard title={t.report.keywordTrendTitle} evidence={data?.shoppingKeyword} query={query} note={t.report.keywordTrendNote} directUrl="https://datalab.naver.com/shoppingInsight/sKeyword.naver?keyword=" onRetry={() => void runResearch()} copy={t.common} />
        <section className="research-card"><h3>{t.report.risksTitle}</h3><p>{t.report.risks}</p></section>
        <section className="research-card"><h3>{t.report.planTitle}</h3><ol>{t.report.plan.map((item) => <li key={item}>{item}</li>)}</ol></section>
      </div>
      <footer className="research-sources"><h3>{t.report.sourcesTitle}</h3><p>{t.report.usedQuery}: {query} · {t.report.apiTime}: {retrievedAt}</p><p>{t.report.sourcesNote} <a href={`${naverSearch("web")}${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{t.report.webSearch}</a> · <a href={`${naverSearch("blog")}${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{t.report.blogSearch}</a> · <a href={`${naverSearch("image")}${encodeURIComponent(query)}`} target="_blank" rel="noopener noreferrer">{t.report.imageSearch}</a></p></footer>
    </div>}
  </main><SiteFooter /></>;
}
