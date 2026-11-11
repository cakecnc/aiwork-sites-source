"use client";
import { useEffect, useRef } from "react";
import { useSitePreferences } from "../preferences";
import { trackMouseInput } from "./mouse-input";

export default function GlobalInteractions() {
  const top = useRef<HTMLButtonElement>(null);
  const { locale } = useSitePreferences();
  useEffect(() => {
    const selector = 'a,button,input,select,textarea,[role="button"],article,aside,[class*="-card"],[class*="-panel"],.home-workbench,.detail-visual,.research-form,.hashcat-generator';
    const visible = new Set<HTMLElement>();
    const registered = new Set<HTMLElement>();
    const excluded = ':disabled,[aria-disabled="true"],[hidden],[inert],.browser-preview,.aiwork-cinematic-scene,.honeypot';
    let x = -10000, y = -10000, frame = 0;
    const update = () => {
      frame = 0;
      if (top.current && top.current.hidden !== (window.scrollY < 400)) top.current.hidden = window.scrollY < 400;
      for (const element of visible) {
        if (!input.hasHoverPointer() || document.hidden || element.closest(excluded)) {
          element.style.setProperty("--proximity-strength", "0");
          continue;
        }
        const rect = element.getBoundingClientRect();
        const distance = Math.hypot(Math.max(rect.left - x, 0, x - rect.right), Math.max(rect.top - y, 0, y - rect.bottom));
        const strength = rect.width && rect.height ? Math.max(0, 1 - distance / 130) : 0;
        element.style.setProperty("--proximity-strength", strength.toFixed(3));
        if (strength) {
          element.style.setProperty("--pointer-x", `${x - rect.left}px`);
          element.style.setProperty("--pointer-y", `${y - rect.top}px`);
        }
      }
    };
    const schedule = () => { if (!frame && !document.hidden) frame = requestAnimationFrame(update); };
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const node = entry.target as HTMLElement;
        if (entry.isIntersecting) visible.add(node);
        else { visible.delete(node); node.style.setProperty("--proximity-strength", "0"); }
      }
      schedule();
    });
    const register = (root: ParentNode) => {
      const nodes = [...root.querySelectorAll<HTMLElement>(selector)];
      if (root instanceof HTMLElement && root.matches(selector)) nodes.push(root);
      for (const node of nodes) if (!registered.has(node) && !node.closest('.aiwork-cinematic-scene')) {
        registered.add(node); node.dataset.proximityGlow = ""; observer.observe(node);
      }
    };
    register(document);
    const mutations = new MutationObserver(records => {
      for (const record of records) for (const node of record.addedNodes) if (node instanceof HTMLElement) register(node);
      for (const node of registered) if (!node.isConnected) { observer.unobserve(node); registered.delete(node); visible.delete(node); }
      schedule();
    });
    mutations.observe(document.body, { childList: true, subtree: true,
      attributes: true, attributeFilter: ["disabled", "aria-disabled", "hidden", "inert"] });
    const move = (event: PointerEvent) => { x = event.clientX; y = event.clientY; schedule(); };
    const reset = () => {
      x = y = -10000;
      cancelAnimationFrame(frame); frame = 0;
      for (const node of visible) {
        node.style.setProperty("--proximity-strength", "0");
        node.style.removeProperty("--pointer-x"); node.style.removeProperty("--pointer-y");
      }
    };
    const input = trackMouseInput(window, document, move, reset);
    const visibility = () => {
      if (document.hidden) { cancelAnimationFrame(frame); frame = 0; for (const node of visible) node.style.setProperty("--proximity-strength", "0"); }
      else schedule();
    };
    window.addEventListener("scroll", schedule, { passive: true, capture: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.addEventListener("visibilitychange", visibility);
    schedule();
    return () => {
      cancelAnimationFrame(frame); observer.disconnect(); mutations.disconnect();
      input.dispose();
      window.removeEventListener("scroll", schedule, true); window.removeEventListener("resize", schedule);
      document.removeEventListener("visibilitychange", visibility);
      for (const node of registered) { delete node.dataset.proximityGlow; node.style.removeProperty("--proximity-strength"); node.style.removeProperty("--pointer-x"); node.style.removeProperty("--pointer-y"); }
    };
  }, []);
  return <button ref={top} hidden className="back-to-top" type="button" aria-label={locale === "ko" ? "맨 위로 이동" : "Back to top"} onClick={() => {
    window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.querySelector<HTMLElement>(".unified-header .brand")?.focus({ preventScroll: true });
  }}>↑ Top</button>;
}
