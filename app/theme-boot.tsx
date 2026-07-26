"use client";

import { useEffect } from "react";

const supportedThemes = new Set([
  "system",
  "light",
  "dark",
  "aurora",
  "editorial",
  "console",
  "synthwave",
]);

type StoredColors = {
  accent?: unknown;
  secondary?: unknown;
  background?: unknown;
};

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/iu.test(value);
}

export default function ThemeBoot() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("aiwork-theme");
    document.documentElement.dataset.theme =
      savedTheme && supportedThemes.has(savedTheme) ? savedTheme : "synthwave";

    try {
      const rawColors = localStorage.getItem("aiwork-custom-colors");
      if (!rawColors) return;

      const colors = JSON.parse(rawColors) as StoredColors;
      if (
        !isHexColor(colors.accent) ||
        !isHexColor(colors.secondary) ||
        !isHexColor(colors.background)
      ) {
        return;
      }

      document.documentElement.style.setProperty(
        "--custom-accent",
        colors.accent,
      );
      document.documentElement.style.setProperty(
        "--custom-secondary",
        colors.secondary,
      );
      document.documentElement.style.setProperty(
        "--custom-background",
        colors.background,
      );
      document.documentElement.dataset.custom = "true";
    } catch {
      localStorage.removeItem("aiwork-custom-colors");
    }
  }, []);

  return null;
}
