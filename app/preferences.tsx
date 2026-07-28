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

const CUSTOM_THEME_ACTIVE_KEY = "aiwork-custom-enabled";
const CUSTOM_THEME_COLORS_KEY = "aiwork-custom-colors";

type PreferencesContextValue = {
  locale: Locale;
  theme: ThemeKey;
  customColors: CustomColors;
  customEnabled: boolean;
  ready: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeKey) => void;
  applyCustomColors: (colors: CustomColors) => boolean;
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

function relativeLuminance(color: string) {
  const channels = [
    Number.parseInt(color.slice(1, 3), 16),
    Number.parseInt(color.slice(3, 5), 16),
    Number.parseInt(color.slice(5, 7), 16),
  ].map((channel) => {
    const value = channel / 255;
    return value <= 0.04045
      ? value / 12.92
      : ((value + 0.055) / 1.055) ** 2.4;
  });

  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

function contrastRatio(first: string, second: string) {
  const lighter = Math.max(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  const darker = Math.min(
    relativeLuminance(first),
    relativeLuminance(second),
  );
  return (lighter + 0.05) / (darker + 0.05);
}

function readableTextColor(background: string) {
  return contrastRatio("#ffffff", background)
    >= contrastRatio("#111827", background)
    ? "#ffffff"
    : "#111827";
}

function hasAccessibleContrast(colors: CustomColors) {
  if (
    !isHexColor(colors.accent) ||
    !isHexColor(colors.secondary) ||
    !isHexColor(colors.background)
  ) {
    return false;
  }

  return (
    contrastRatio(readableTextColor(colors.background), colors.background)
      >= 4.5
    && contrastRatio(colors.secondary, colors.background) >= 4.5
    && contrastRatio(
      readableTextColor(colors.accent),
      colors.accent,
    ) >= 4.5
    && contrastRatio(colors.accent, colors.background) >= 3
  );
}

function readCustomColors(): CustomColors | null {
  try {
    const raw = localStorage.getItem(CUSTOM_THEME_COLORS_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CustomColors>;
    if (
      !isHexColor(parsed.accent) ||
      !isHexColor(parsed.secondary) ||
      !isHexColor(parsed.background)
    ) {
      localStorage.removeItem(CUSTOM_THEME_COLORS_KEY);
      localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
      return null;
    }
    const colors = {
      accent: parsed.accent,
      secondary: parsed.secondary,
      background: parsed.background,
    };
    if (!hasAccessibleContrast(colors)) {
      localStorage.removeItem(CUSTOM_THEME_COLORS_KEY);
      localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
      return null;
    }
    return colors;
  } catch {
    localStorage.removeItem(CUSTOM_THEME_COLORS_KEY);
    localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
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
    root.style.removeProperty("--custom-text");
    root.style.removeProperty("--custom-accent-text");
    root.style.removeProperty("--custom-color-scheme");
    return;
  }

  root.style.setProperty("--custom-accent", colors.accent);
  root.style.setProperty("--custom-secondary", colors.secondary);
  root.style.setProperty("--custom-background", colors.background);
  root.style.setProperty(
    "--custom-text",
    readableTextColor(colors.background),
  );
  root.style.setProperty(
    "--custom-accent-text",
    readableTextColor(colors.accent),
  );
  root.style.setProperty(
    "--custom-color-scheme",
    readableTextColor(colors.background) === "#ffffff" ? "dark" : "light",
  );
  root.dataset.custom = "true";
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [theme, setThemeState] = useState<ThemeKey>("light");
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
      const customActive =
        localStorage.getItem(CUSTOM_THEME_ACTIVE_KEY) === "true";

      setLocaleState(isLocale(bootLocale) ? bootLocale : "ko");
      setThemeState(isTheme(bootTheme) ? bootTheme : "light");
      if (customActive && storedCustom) {
        setCustomColors(storedCustom);
        setCustomEnabled(true);
        applyCustomToDocument(storedCustom);
      } else {
        if (customActive) {
          localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
        }
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
      if (
        event.key === CUSTOM_THEME_COLORS_KEY ||
        event.key === CUSTOM_THEME_ACTIVE_KEY
      ) {
        const next = readCustomColors();
        const nextEnabled =
          localStorage.getItem(CUSTOM_THEME_ACTIVE_KEY) === "true";
        if (next && nextEnabled) {
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
    setCustomEnabled(false);
    localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
    applyCustomToDocument(null);
    setThemeState(next);
  }

  function applyCustomColors(next: CustomColors) {
    if (!hasAccessibleContrast(next)) {
      return false;
    }
    setCustomColors(next);
    setCustomEnabled(true);
    localStorage.setItem(CUSTOM_THEME_COLORS_KEY, JSON.stringify(next));
    localStorage.setItem(CUSTOM_THEME_ACTIVE_KEY, "true");
    applyCustomToDocument(next);
    return true;
  }

  function resetCustomColors() {
    setCustomColors(defaultColors);
    setCustomEnabled(false);
    localStorage.removeItem(CUSTOM_THEME_COLORS_KEY);
    localStorage.removeItem(CUSTOM_THEME_ACTIVE_KEY);
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
    customEnabled,
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
  const [customError, setCustomError] = useState("");
  const languageButton = useRef<HTMLButtonElement>(null);
  const themeButton = useRef<HTMLButtonElement>(null);
  const customCloseButton = useRef<HTMLButtonElement>(null);
  const customDialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = customDialog.current;
    if (!dialog) return;

    if (customOpen && !dialog.open) {
      dialog.showModal();
      customCloseButton.current?.focus();
      return;
    }
    if (!customOpen && dialog.open) {
      dialog.close();
    }
  }, [customOpen]);

  useEffect(() => {
    const closeMenus = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
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
  }, [languageOpen, themeOpen]);

  function closeCustomDialog() {
    setCustomOpen(false);
    setCustomError("");
    themeButton.current?.focus();
  }

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
                    className={`theme-option ${
                      !customEnabled && theme === item ? "active" : ""
                    }`}
                    type="button"
                    role="menuitemradio"
                    aria-checked={!customEnabled && theme === item}
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
                    {!customEnabled && theme === item && <b>✓</b>}
                  </button>
                ))}
              </div>
              <button
                className={`custom-link ${customEnabled ? "active" : ""}`}
                type="button"
                aria-pressed={customEnabled}
                onClick={() => {
                  setThemeOpen(false);
                  setCustomDraft(customColors);
                  setCustomError("");
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

      <dialog
        ref={customDialog}
        className="custom-overlay"
        aria-label={copy.aria.customColorDialog}
        onCancel={(event) => {
          event.preventDefault();
          closeCustomDialog();
        }}
        onClick={(event) => {
          if (event.target === event.currentTarget) {
            closeCustomDialog();
          }
        }}
      >
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
                onClick={closeCustomDialog}
                aria-label={copy.aria.close}
              >
                ×
              </button>
            </div>
            <div
              className="custom-preview"
              style={{ background: customDraft.background }}
            >
              <span
                style={{
                  background: customDraft.accent,
                  color: readableTextColor(customDraft.accent),
                }}
              >
                AIWORK
              </span>
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
                    onChange={(event) => {
                      setCustomError("");
                      setCustomDraft({
                        ...customDraft,
                        [key]: event.target.value,
                      });
                    }}
                  />
                </label>
              ))}
            </div>
            {customError && (
              <p className="custom-error" role="alert">
                {customError}
              </p>
            )}
            <div className="custom-actions">
              <button
                type="button"
                onClick={() => {
                  resetCustomColors();
                  setCustomDraft(defaultColors);
                  setCustomError("");
                }}
              >
                {copy.customColors.reset}
              </button>
              <button
                type="button"
                className="save-custom"
                onClick={() => {
                  if (!applyCustomColors(customDraft)) {
                    setCustomError(copy.customColors.contrastError);
                    return;
                  }
                  closeCustomDialog();
                }}
              >
                {copy.customColors.apply}
              </button>
            </div>
        </section>
      </dialog>
    </>
  );
}
