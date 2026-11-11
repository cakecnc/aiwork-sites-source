"use client";

import Image from "next/image";
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type KeyboardEvent as ReactKeyboardEvent,
} from "react";
import { usePathname } from "next/navigation";
import {
  characterKeys,
  characterPickerCopy,
  characterProfiles,
  type CharacterKey,
} from "./characters";
import {
  localeInfo,
  messages,
  supportedLocales,
  type Locale,
  type ThemeKey,
} from "./i18n";

// Keep the existing Matrix palette as the original theme.
export const themeKeys: ThemeKey[] = ["console", "aurora"];

export const themeColors: Record<ThemeKey, string[]> = {
  console: ["#000400", "#54ff78", "#174d21"],
  aurora: ["#07091a", "#a78bfa", "#22d3ee"],
};

export function normalizeTheme(value: string | null | undefined): ThemeKey {
  return value === "aurora" ? "aurora" : "console";
}

function persistPreference(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Preferences still work for this visit when storage is unavailable.
  }
}

const CHARACTER_STORAGE_KEY = "aiwork-character";

type PreferencesContextValue = {
  locale: Locale;
  theme: ThemeKey;
  character: CharacterKey;
  ready: boolean;
  setLocale: (locale: Locale) => void;
  setTheme: (theme: ThemeKey) => void;
  setCharacter: (character: CharacterKey) => void;
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

function isLocale(value: string | null | undefined): value is Locale {
  return Boolean(value && supportedLocales.includes(value as Locale));
}

function isCharacter(
  value: string | null | undefined,
): value is CharacterKey {
  return Boolean(value && characterKeys.includes(value as CharacterKey));
}

// Re-read the source preferences after mount: hydration recovery can replace
// the HTML element and discard the attributes set by the early boot script.
function readPreference(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function resolveInitialPreferences() {
  const queryLocale = new URLSearchParams(window.location.search).get("lang");
  const storedLocale = readPreference("aiwork-locale");
  const browserLanguage = (navigator.language || "").toLowerCase();
  const detectedLocale = supportedLocales.find((item) =>
    browserLanguage.startsWith(item === "zh-CN" ? "zh" : item),
  ) ?? "ko";
  const storedCharacter = readPreference(CHARACTER_STORAGE_KEY);
  return {
    locale: isLocale(queryLocale) ? queryLocale
      : isLocale(storedLocale) ? storedLocale : detectedLocale,
    theme: normalizeTheme(readPreference("aiwork-theme")),
    character: isCharacter(storedCharacter) ? storedCharacter : "aiwork" as const,
  };
}

export function SitePreferencesProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [locale, setLocaleState] = useState<Locale>("ko");
  const [theme, setThemeState] = useState<ThemeKey>("console");
  const [character, setCharacterState] =
    useState<CharacterKey>("aiwork");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      const root = document.documentElement;
      const initial = resolveInitialPreferences();
      setLocaleState(initial.locale);
      setThemeState(initial.theme);
      setCharacterState(initial.character);
      delete root.dataset.custom;
      setReady(true);
    });

    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.theme = theme;
    // Do not overwrite a legacy preference during hydration or cross-tab sync.
  }, [ready, theme]);

  useEffect(() => {
    if (!ready) return;
    const root = document.documentElement;
    root.dataset.character = character;
    persistPreference(CHARACTER_STORAGE_KEY, character);
  }, [character, ready]);

  useEffect(() => {
    if (!ready) return;

    const root = document.documentElement;
    const localeMeta = localeInfo[locale];
    root.lang = localeMeta.htmlLang;
    root.dir = locale === "ar" ? "rtl" : "ltr";
    root.dataset.locale = locale;
    persistPreference("aiwork-locale", locale);

    const url = new URL(window.location.href);
    if (locale === "ko") {
      url.searchParams.delete("lang");
    } else {
      url.searchParams.set("lang", locale);
    }
    window.history.replaceState(window.history.state, "", url);
  }, [locale, pathname, ready]);

  useEffect(() => {
    const syncFromStorage = (event: StorageEvent) => {
      if (event.key === "aiwork-theme") {
        setThemeState(normalizeTheme(event.newValue));
      }
      if (event.key === "aiwork-locale" && isLocale(event.newValue)) {
        setLocaleState(event.newValue);
      }
      if (
        event.key === CHARACTER_STORAGE_KEY
        && isCharacter(event.newValue)
      ) {
        setCharacterState(event.newValue);
      }

    };
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  function chooseLocale(next: Locale) {
    setLocaleState(next);
  }

  function chooseTheme(next: ThemeKey) {
    const normalized = normalizeTheme(next);
    persistPreference("aiwork-theme", normalized);
    setThemeState(normalized);
  }

  function chooseCharacter(next: CharacterKey) {
    setCharacterState(next);
  }

  return (
    <PreferencesContext.Provider
      value={{
        locale,
        theme,
        character,
        ready,
        setLocale: chooseLocale,
        setTheme: chooseTheme,
        setCharacter: chooseCharacter,
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

function navigateMenu(event: ReactKeyboardEvent<HTMLDivElement>) {
  if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
  const options = Array.from(
    event.currentTarget.querySelectorAll<HTMLButtonElement>("button"),
  );
  if (!options.length) return;
  event.preventDefault();
  const current = options.indexOf(document.activeElement as HTMLButtonElement);
  const index = event.key === "Home" ? 0
    : event.key === "End" ? options.length - 1
    : (current + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
  options[index].focus();
}

export function PreferenceControls() {
  const {
    locale,
    theme,
    character,
    setLocale,
    setTheme,
    setCharacter,
  } = useSitePreferences();
  const copy = messages[locale];
  const localeMeta = localeInfo[locale];
  const characterCopy = characterPickerCopy[locale];
  const [themeOpen, setThemeOpen] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const languageButton = useRef<HTMLButtonElement>(null);
  const themeButton = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const menuId = themeOpen ? "aiwork-theme-menu" : languageOpen ? "aiwork-language-menu" : null;
    if (menuId) {
      document.getElementById(menuId)
        ?.querySelector<HTMLButtonElement>('[aria-checked="true"], [role="menuitemradio"]')
        ?.focus();
    }
  }, [themeOpen, languageOpen]);

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
              aria-label={copy.language.title}
              onKeyDown={navigateMenu}
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
            <span className="theme-trigger-character" aria-hidden="true">
              {characterKeys.map((item) => (
                <Image
                  className="theme-trigger-character-layer"
                  data-character-layer={item}
                  src={characterProfiles[item].thumbnailSrc}
                  alt=""
                  width={64}
                  height={64}
                  unoptimized
                  key={item}
                />
              ))}
            </span>
            <span className="trigger-label">{copy.themeMenu.trigger}</span>
            <span className="chevron" aria-hidden="true">
              {themeOpen ? "▲" : "▼"}
            </span>
          </button>

          {themeOpen && (
            <div className="theme-menu" id="aiwork-theme-menu" role="menu" aria-label={copy.themeMenu.title} onKeyDown={navigateMenu}>
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
              <div className="theme-grid" role="group" aria-label={copy.themeMenu.title}>
                {themeKeys.map((item) => (
                  <button
                    className={`theme-option ${
                      theme === item ? "active" : ""
                    }`}
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
              <section
                className="character-picker"
                role="group"
                aria-labelledby="aiwork-character-picker-title"
              >
                <div className="character-picker-head">
                  <strong id="aiwork-character-picker-title">
                    {characterCopy.title}
                  </strong>
                  <span>{characterCopy.note}</span>
                </div>
                <div className="character-grid">
                  {characterKeys.map((item) => (
                    <button
                      className={`character-option ${
                        character === item ? "active" : ""
                      }`}
                      type="button"
                      role="menuitemradio"
                      aria-checked={character === item}
                      key={item}
                      onClick={() => {
                        setCharacter(item);
                        setThemeOpen(false);
                        themeButton.current?.focus();
                      }}
                      aria-label={replaceName(
                        characterCopy.selectLabel,
                        characterCopy.options[item].name,
                      )}
                    >
                      <span
                        className="character-option-image"
                        data-character={item}
                        aria-hidden="true"
                      >
                        <Image
                          src={characterProfiles[item].thumbnailSrc}
                          alt=""
                          width={128}
                          height={128}
                          unoptimized
                        />
                      </span>
                      <span>
                        <strong>
                          {characterCopy.options[item].name}
                        </strong>
                        <small>{characterCopy.options[item].note}</small>
                      </span>
                      {character === item && <b aria-hidden="true">✓</b>}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
