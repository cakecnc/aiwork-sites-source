"use client";
import { useState } from "react";
import Link from "next/link";
import { useSitePreferences } from "../preferences";
import { PRO_MONTHLY_USD, PRO_TERMS, PAYPAL_CHECKOUT_URLS, proPricingCopy, type ProTermId } from "../pro-pricing";
import { purchaseInquiryHref } from "../site-config";
import "../pricing-plans.css";

export default function PricingPlans({ page = false }: { page?: boolean }) {
  const { locale } = useSitePreferences();
  const { text: copy, language } = proPricingCopy(locale);
  const [termId, setTermId] = useState<ProTermId>("monthly");
  const selected = PRO_TERMS.find(term => term.id === termId) ?? PRO_TERMS[0];
  const checkoutUrl = PAYPAL_CHECKOUT_URLS[selected.id];
  const Heading = page ? "h1" : "h2";
  return (
    <section className="payment-section pro-pricing" id="payments" lang={language}>
      <div className="payment-heading"><div><span className="section-kicker">AIWORK FREE &amp; PRO</span><Heading>{copy.title}</Heading><p>{copy.description}</p></div></div>
      <p className="payment-disclaimer">{copy.availability}</p>
      <div className="pricing-grid pro-plan-grid">
        <article className="price-card">
          <h2 className="product-name">AIWORK Free</h2>
          <div className="price"><strong><bdi dir="ltr">USD 0</bdi></strong><span>{copy.freeBilling}</span></div>
          <ul>{copy.freeFeatures.map(feature => <li key={feature}><i aria-hidden="true">✓</i>{feature}</li>)}</ul>
          <Link className="secondary-button payment-button" href="/features/">{copy.freeAction}<span aria-hidden="true">↗</span></Link>
        </article>
        <article className="price-card featured">
          <h2 className="product-name">AIWORK Pro</h2>
          <div className="price"><strong><bdi dir="ltr">USD {PRO_MONTHLY_USD}</bdi></strong><span>/ {copy.month}</span></div>
          <ul>{copy.proFeatures.map(feature => <li key={feature}><i aria-hidden="true">✓</i>{feature}</li>)}</ul>
          <fieldset className="pro-periods"><legend>{copy.period}</legend>
            {PRO_TERMS.map((term, index) => <label className="pro-period" key={term.id}>
              <input type="radio" name={page ? "pricing-pro-period" : "home-pro-period"} value={term.id} checked={term.id === selected.id} onChange={() => setTermId(term.id)} />
              <span>{copy.terms[index]}</span><strong><bdi dir="ltr">USD {term.totalUsd}</bdi></strong>
            </label>)}
          </fieldset>
          <div className="pro-total" aria-live="polite" aria-atomic="true"><span>{copy.total}</span><strong><bdi dir="ltr">USD {selected.totalUsd}</bdi></strong><small>{copy.calculation.replace("{months}", String(selected.months)).replace("1 months", "1 month")}</small></div>
          {checkoutUrl ? <a className="primary-button payment-button" href={checkoutUrl} rel="noopener noreferrer">{copy.checkout}<span aria-hidden="true">↗</span></a> : <button className="primary-button payment-button" type="button" disabled>{copy.pending}</button>}
          <Link className="secondary-button payment-button" href={purchaseInquiryHref("professional")}>{copy.inquiry}<span aria-hidden="true">↗</span></Link>
        </article>
      </div>
      <div className="pro-payment-notice" role="note"><p>{copy.paymentNote}</p><p>{copy.activation}</p></div>
      <div className="pro-other-products"><h3>{copy.otherTitle}</h3><p>{copy.otherNote}</p><div className="detail-actions">
        <Link className="secondary-button" href={purchaseInquiryHref("business")}>{copy.business}<span aria-hidden="true">↗</span></Link>
        <Link className="secondary-button" href={purchaseInquiryHref("smartstore-pack")}>{copy.smartstore}<span aria-hidden="true">↗</span></Link>
      </div></div>
    </section>
  );
}
