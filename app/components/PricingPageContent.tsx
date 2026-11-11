"use client";
import AvailabilityNotice from "./AvailabilityNotice";
import PricingPlans from "./PricingPlans";
import SiteFooter from "./SiteFooter";
import SiteHeader from "./SiteHeader";
export default function PricingPageContent() {
  return <main className="site-shell" id="main-content"><SiteHeader active="pricing" context="Free & Pro" /><AvailabilityNotice /><PricingPlans page /><SiteFooter /></main>;
}
