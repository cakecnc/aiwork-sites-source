"use client";

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import {
  localeInfo,
  messages,
  supportedLocales,
  type Locale,
  type ThemeKey,
} from "./i18n";

export const themeKeys: ThemeKey[] = [
  "system",
  "light",
  "dark",
  "aurora",
  "editorial",
  "console",
  "synthwave",
];

export const themeColors: Record<ThemeKey, string[]> = {
  system: ["#f8fafc", "#111827", "#7357ff"],
  light: ["#ffffff", "#182033", "#2563eb"],
  dark: ["#090d18", "#eaf0ff", "#8b5cf6"],
  aurora: ["#07091a", "#a78bfa", "#22d3ee"],
  editorial: ["#f4f0e7", "#17336b", "#dc6b3f"],
  console: ["#101614", "#62f5c3", "#1f332d"],
  synthwave: ["#07071b", "#ff3dbb", "#18d8ff"],
};

export type CustomColors = {
  accent: string;
  secondary: string;
  background: string;
};

export const defaultColors: CustomColors = {
  accent: "#ff3dbb",
  secondary: "#18d8ff",
  background: "#07071b",
};

type PreferencesContextValue = {
  locale: Locale;
  theme: ThemeKey;
  customColors: CustomColors;
  customEnabled: boolean;
  ready: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeKey) => void;
  applyCustomColors: (colors: CustomColors) => void;
  resetCustomColors: () => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isTheme(value: string | null | undefined): value is ThemeKey {
  return Boolean(value && themeKeys.includes(value as ThemeKey));
}

function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}

function isHexColor(value: unknown): value is string {
  return typeof value === "string" && /^#[0-9a-f]{6}$/iu.test(value);
}

function readCustomColors(): CustomColors | null {
  try {
    const raw = localStorage.getItem("aiwork-custom-colors");
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CustomColors>;
    if (
      !isHexColor(parsed.accent) ||
      !isHexColor(parsed.secondary) ||
      !isHexColor(parsed.background)
    ) {
      localStorage.removeItem("aiwork-custom-colors");
      return null;
    }
    return {
      accent: parsed.accent,
      secondary: parsed.secondary,
      background: parsed.background,
    };
  } catch {
    localStorage.removeItem("aiwork-custom-colors");
    return null;
  }
}

function applyCustomToDocument(colors: CustomColors | null) {
  const root = document.documentElement;
  if (!colors) {
    delete root.dataset.custom;
    root.style.removeProperty("--custom-accent");
    root.style.removeProperty("--custom-secondary");
    root.style.removeProperty("--custom-background");
    return;
  }

  root.style.setProperty("--custom-accent", colors.accent);
  root.style.setProperty("--custom-secondary", colors.secondary);
  root.style.setProperty("--custom-background", colors.background);
  root.dataset.custom = "true";
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [theme, setThemeState] = useState<ThemeKey>("synthwave");
  const [customColors, setCustomColors] =
    useState<CustomColors>(defaultColors);
  const [customEnabled, setCustomEnabled] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const bootLocale = root.dataset.locale;
      const bootTheme = root.dataset.theme;
      const storedCustom = readCustomColors();

      setLocaleState(isLocale(bootLocale) ? bootLocale : "ko");
      setThemeState(isTheme(bootTheme) ? bootTheme : "synthwave");
      if (storedCustom) {
        setCustomColors(storedCustom);
        setCustomEnabled(true);
        applyCustomToDocument(storedCustom);
      } else {
        setCustomEnabled(false);
        applyCustomToDocument(null);
      }
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    localStorage.setItem("aiwork-theme", theme);
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;
    const localeMeta = localeInfo[locale];
    root.lang = localeMeta.htmlLang;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    root.dataset.locale = locale;
    localStorage.setItem("aiwork-locale", locale);

    const url = new URL(window.location.href);
    if (locale === "ko") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [locale, pathname, ready]);

  useEffect(() => {
    if (!ready) return;
    applyCustomToDocument(customEnabled ? customColors : null);
  }, [customColors, customEnabled, ready]);

  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === "aiwork-theme" && isTheme(event.newValue)) {
        setThemeState(event.newValue);
      }
      if (event.key === "aiwork-locale" && isLocale(event.newValue)) {
        setLocaleState(event.newValue);
      }
      if (event.key === "aiwork-custom-colors") {
        const next = readCustomColors();
        if (next) {
          setCustomColors(next);
          setCustomEnabled(true);
        } else {
          setCustomEnabled(false);
        }
      }
    };
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  function chooseLocale(next: Locale) {
    setLocaleState(next);
  }

  function chooseTheme(next: ThemeKey) {
    setThemeState(next);
  }

  function applyCustomColors(next: CustomColors) {
    if (
      !isHexColor(next.accent) ||
      !isHexColor(next.secondary) ||
      !isHexColor(next.background)
    ) {
      return;
    }
    setCustomColors(next);
    setCustomEnabled(true);
    localStorage.setItem("aiwork-custom-colors", JSON.stringify(next));
    applyCustomToDocument(next);
  }

  function resetCustomColors() {
    setCustomColors(defaultColors);
    setCustomEnabled(false);
    localStorage.removeItem("aiwork-custom-colors");
    applyCustomToDocument(null);
  }

  return (
    <PreferencesContext.Provider
      value={{
        locale,
        theme,
        customColors,
        customEnabled,
        ready,
        setLocale: chooseLocale,
        setTheme: chooseTheme,
        applyCustomColors,
        resetCustomColors,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function useSitePreferences() {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error(
      "useSitePreferences must be used inside SitePreferencesProvider",
    );
  }
  return value;
}

function replaceName(template: string, name: string) {
  return template.replace("{name}", name);
}

export function PreferenceControls() {
  const {
    locale,
    theme,
    customColors,
    setLocale,
    setTheme,
    applyCustomColors,
    resetCustomColors,
  } = useSitePreferences();
  const copy = messages[locale];
  const localeMeta = localeInfo[locale];
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [customOpen, setCustomOpen] = useState(false);
  const [customDraft, setCustomDraft] =
    useState<CustomColors>(customColors);
  const languageButton = useRef<HTMLButtonElement>(null);
  const themeButton = useRef<HTMLButtonElement>(null);
  const customButton = useRef<HTMLButtonElement>(null);
  const customCloseButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (customOpen) {
      customCloseButton.current?.focus();
    }
  }, [customOpen]);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      if (customOpen) {
        setCustomOpen(false);
        customButton.current?.focus();
        return;
      }
      if (themeOpen) {
        setThemeOpen(false);
        themeButton.current?.focus();
      }
      if (languageOpen) {
        setLanguageOpen(false);
        languageButton.current?.focus();
      }
    };
    window.addEventListener("keydown", closeMenus);
    return () => window.removeEventListener("keydown", closeMenus);
  }, [customOpen, languageOpen, themeOpen]);

  return (
    <>
      <div className="preference-actions">
        <div className="language-anchor">
          <button
            ref={languageButton}
            className="language-trigger"
            type="button"
            aria-expanded={languageOpen}
            aria-haspopup="menu"
            aria-controls="aiwork-language-menu"
            aria-label={copy.aria.languageMenu}
            onClick={() => {
              setLanguageOpen((value) => !value);
              setThemeOpen(false);
            }}
          >
            <span aria-hidden="true">◎</span>
            <b>{localeMeta.shortName}</b>
            <span className="chevron" aria-hidden="true">
              {languageOpen ? "▲" : "▼"}
            </span>
          </button>

          {languageOpen && (
            <div
              className="language-menu"
              id="aiwork-language-menu"
              role="menu"
            >
              <div className="theme-menu-head">
                <div>
                  <strong>{copy.language.title}</strong>
                  <span>{copy.language.note}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLanguageOpen(false);
                    languageButton.current?.focus();
                  }}
                  aria-label={copy.aria.close}
                >
                  ×
                </button>
              </div>
              <div className="language-list">
                {supportedLocales.map((item) => (
                  <button
                    className={`language-option ${locale === item ? "active" : ""}`}
                    type="button"
                    role="menuitemradio"
                    aria-checked={locale === item}
                    key={item}
                    onClick={() => {
                      setLocale(item);
                      setLanguageOpen(false);
                      languageButton.current?.focus();
                    }}
                    aria-label={replaceName(
                      copy.aria.selectLanguage,
                      localeInfo[item].nativeName,
                    )}
                  >
                    <span>{localeInfo[item].shortName}</span>
                    <strong>{localeInfo[item].nativeName}</strong>
                    {locale === item && <b>✓</b>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="theme-anchor">
          <button
            ref={themeButton}
            className="theme-trigger"
            type="button"
            aria-expanded={themeOpen}
            aria-haspopup="menu"
            aria-controls="aiwork-theme-menu"
            aria-label={copy.aria.themeMenu}
            onClick={() => {
              setThemeOpen((value) => !value);
              setLanguageOpen(false);
            }}
          >
            <span className="palette-icon" aria-hidden="true">
              ◐
            </span>
            <span className="trigger-label">{copy.themeMenu.trigger}</span>
            <span className="chevron" aria-hidden="true">
              {themeOpen ? "▲" : "▼"}
            </span>
          </button>

          {themeOpen && (
            <div className="theme-menu" id="aiwork-theme-menu" role="menu">
              <div className="theme-menu-head">
                <div>
                  <strong>{copy.themeMenu.title}</strong>
                  <span>{copy.themeMenu.note}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setThemeOpen(false);
                    themeButton.current?.focus();
                  }}
                  aria-label={copy.aria.close}
                >
                  ×
                </button>
              </div>
              <div className="theme-grid">
                {themeKeys.map((item) => (
                  <button
                    className={`theme-option ${theme === item ? "active" : ""}`}
                    type="button"
                    role="menuitemradio"
                    aria-checked={theme === item}
                    key={item}
                    onClick={() => {
                      setTheme(item);
                      setThemeOpen(false);
                      themeButton.current?.focus();
                    }}
                    aria-label={replaceName(
                      copy.aria.selectTheme,
                      copy.themes[item].name,
                    )}
                  >
                    <span className="swatches" aria-hidden="true">
                      {themeColors[item].map((color) => (
                        <i key={color} style={{ background: color }} />
                      ))}
                    </span>
                    <strong>{copy.themes[item].name}</strong>
                    <small>{copy.themes[item].note}</small>
                    {theme === item && <b>✓</b>}
                  </button>
                ))}
              </div>
              <button
                ref={customButton}
                className="custom-link"
                type="button"
                onClick={() => {
                  setThemeOpen(false);
                  setCustomDraft(customColors);
                  setCustomOpen(true);
                }}
              >
                <span aria-hidden="true">✦</span>
                <span>
                  <strong>{copy.themeMenu.customTitle}</strong>
                  <small>{copy.themeMenu.customNote}</small>
                </span>
                <b aria-hidden="true">→</b>
              </button>
            </div>
          )}
        </div>
      </div>

      {customOpen && (
        <div
          className="custom-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={copy.aria.customColorDialog}
        >
          <button
            className="overlay-close"
            aria-label={copy.aria.close}
            onClick={() => {
              setCustomOpen(false);
              customButton.current?.focus();
            }}
          />
          <section className="custom-panel">
            <div className="custom-head">
              <div>
                <span>{copy.customColors.eyebrow}</span>
                <h2>{copy.customColors.title}</h2>
                <p>{copy.customColors.description}</p>
              </div>
              <button
                ref={customCloseButton}
                type="button"
                onClick={() => {
                  setCustomOpen(false);
                  customButton.current?.focus();
                }}
                aria-label={copy.aria.close}
              >
                ×
              </button>
            </div>
            <div
              className="custom-preview"
              style={{ background: customDraft.background }}
            >
              <span style={{ background: customDraft.accent }}>AIWORK</span>
              <strong style={{ color: customDraft.secondary }}>
                {copy.customColors.previewTagline}
              </strong>
              <i
                style={{
                  background: `linear-gradient(90deg, ${customDraft.accent}, ${customDraft.secondary})`,
                }}
              />
            </div>
            <div className="color-controls">
              {(
                [
                  ["accent", copy.customColors.accent],
                  ["secondary", copy.customColors.secondary],
                  ["background", copy.customColors.background],
                ] as const
              ).map(([key, label]) => (
                <label key={key}>
                  <span>
                    {label}
                    <small>{customDraft[key].toUpperCase()}</small>
                  </span>
                  <input
                    type="color"
                    value={customDraft[key]}
                    onChange={(event) =>
                      setCustomDraft({
                        ...customDraft,
                        [key]: event.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>
            <div className="custom-actions">
              <button
                type="button"
                onClick={() => {
                  resetCustomColors();
                  setCustomDraft(defaultColors);
                }}
              >
                {copy.customColors.reset}
              </button>
              <button
                type="button"
                className="save-custom"
                onClick={() => {
                  applyCustomColors(customDraft);
                  setCustomOpen(false);
                  customButton.current?.focus();
                }}
              >
                {copy.customColors.apply}
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
