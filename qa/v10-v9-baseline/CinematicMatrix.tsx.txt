"use client";

import { useEffect, useRef, useState } from "react";
import type { Locale } from "../i18n";
import { useSitePreferences } from "../preferences";
import "./matrix-engine.js";

const motionLabels: Record<Locale, { pause: string; play: string; reduced: string }> = {
  ko: { pause: "배경 정지", play: "배경 재생", reduced: "동작 줄이기 적용" },
  en: { pause: "Pause background", play: "Play background", reduced: "Reduced motion on" },
  ja: { pause: "背景を停止", play: "背景を再生", reduced: "動きを抑制中" },
  "zh-CN": { pause: "暂停背景", play: "播放背景", reduced: "已减少动态效果" },
  ar: { pause: "إيقاف حركة الخلفية", play: "تشغيل حركة الخلفية", reduced: "تقليل الحركة مفعّل" },
  es: { pause: "Pausar fondo", play: "Animar fondo", reduced: "Movimiento reducido" },
  fr: { pause: "Arrêter le fond", play: "Animer le fond", reduced: "Mouvement réduit" },
  de: { pause: "Hintergrund anhalten", play: "Hintergrund abspielen", reduced: "Bewegung reduziert" },
};

/** One decorative canvas for all routes; the poster remains visible before hydration. */
export default function CinematicMatrix() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const poster = useRef<HTMLImageElement>(null);
  const engine = useRef<AIWORKMatrixHandle | null>(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const { locale } = useSitePreferences();
  const labels = motionLabels[locale];

  useEffect(() => {
    if (!canvas.current || !window.AIWORKMatrix) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => setReducedMotion(motion.matches);
    syncMotion();
    motion.addEventListener("change", syncMotion);
    engine.current = window.AIWORKMatrix.mount(canvas.current, {
      maxDpr: 1.35, mobileMaxDpr: 1.1,
      desktopFps: 36, mobileFps: 24, intensity: 1,
      posterElement: poster.current ?? undefined,
      onQualityChange: ({ tier }) => {
        document.documentElement.dataset.cinematicPerformance = tier;
      },
    });
    return () => {
      motion.removeEventListener("change", syncMotion);
      engine.current?.destroy();
      engine.current = null;
      delete document.documentElement.dataset.cinematicPerformance;
    };
  }, []);

  useEffect(() => {
    if (paused) engine.current?.pause();
    else engine.current?.resume();
  }, [paused]);

  return (
    <>
      <div className="aiwork-cinematic-scene" aria-hidden="true" inert>
        <picture>
          <source media="(max-width: 700px)" srcSet="/assets/aiwork-matrix-scene-v18-low.webp" />
          <img
            ref={poster}
            className="cinematic-scene-poster"
            src="/assets/aiwork-matrix-scene-v18.webp"
            alt=""
            width={1487}
            height={1058}
            decoding="async"
            fetchPriority="high"
          />
        </picture>
        <canvas ref={canvas} />
      </div>
      <button
        className="cinematic-motion-control"
        type="button"
        onClick={() => setPaused(value => !value)}
        disabled={reducedMotion}
      >
        <span aria-hidden="true">{paused || reducedMotion ? "▶" : "Ⅱ"}</span>
        {reducedMotion ? labels.reduced : paused ? labels.play : labels.pause}
      </button>
    </>
  );
}
