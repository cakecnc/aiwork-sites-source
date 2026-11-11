const preferenceBoot = String.raw`
(() => {
  const root = document.documentElement;
  // Legacy themes resolve to the original palette without deleting saved data.
  const readPreference = (key) => {
    try { return localStorage.getItem(key); } catch { return null; }
  };
  const characters = new Set(["aiwork","planner"]);
  const locales = new Set(["ko","en","ja","zh-CN","ar","es","fr","de"]);
  const localeMeta = {
    ko: ["ko","ltr"],
    en: ["en","ltr"],
    ja: ["ja","ltr"],
    "zh-CN": ["zh-CN","ltr"],
    ar: ["ar","rtl"],
    es: ["es","ltr"],
    fr: ["fr","ltr"],
    de: ["de","ltr"]
  };

  try {
    const storedTheme = readPreference("aiwork-theme");
    root.dataset.theme = storedTheme === "aurora" ? "aurora" : "console";
    const storedCharacter = readPreference("aiwork-character");
    root.dataset.character = characters.has(storedCharacter)
      ? storedCharacter
      : "aiwork";

    const queryLocale = new URLSearchParams(location.search).get("lang");
    const storedLocale = readPreference("aiwork-locale");
    const browserLanguage = (navigator.language || "").toLowerCase();
    let detectedLocale = "ko";
    if (browserLanguage.startsWith("ar")) detectedLocale = "ar";
    else if (browserLanguage.startsWith("es")) detectedLocale = "es";
    else if (browserLanguage.startsWith("fr")) detectedLocale = "fr";
    else if (browserLanguage.startsWith("de")) detectedLocale = "de";
    else if (browserLanguage.startsWith("ja")) detectedLocale = "ja";
    else if (browserLanguage.startsWith("zh")) detectedLocale = "zh-CN";
    else if (browserLanguage.startsWith("en")) detectedLocale = "en";

    const locale = locales.has(queryLocale)
      ? queryLocale
      : locales.has(storedLocale)
        ? storedLocale
        : detectedLocale;
    root.dataset.locale = locale;
    root.lang = localeMeta[locale][0];
    root.dir = localeMeta[locale][1];

    // Retain saved custom colors, but only the two curated palettes are applied.
    delete root.dataset.custom;
  } catch {
    root.dataset.theme = "console";
    root.dataset.character = "aiwork";
    root.dataset.locale = "ko";
    root.lang = "ko";
    root.dir = "ltr";
    delete root.dataset.custom;
  }
})();
`;

export default function ThemeBoot() {
  return (
    <script
      id="aiwork-preference-boot"
      dangerouslySetInnerHTML={{ __html: preferenceBoot }}
    />
  );
}
