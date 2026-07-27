const preferenceBoot = String.raw`
(() => {
  const root = document.documentElement;
  const themes = new Set(["system","light","dark","aurora","editorial","console","synthwave"]);
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
  const isHex = (value) => typeof value === "string" && /^#[0-9a-f]{6}$/i.test(value);

  try {
    const storedTheme = localStorage.getItem("aiwork-theme");
    root.dataset.theme = themes.has(storedTheme) ? storedTheme : "synthwave";

    const queryLocale = new URLSearchParams(location.search).get("lang");
    const storedLocale = localStorage.getItem("aiwork-locale");
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

    const rawColors = localStorage.getItem("aiwork-custom-colors");
    if (rawColors) {
      const colors = JSON.parse(rawColors);
      if (
        isHex(colors.accent) &&
        isHex(colors.secondary) &&
        isHex(colors.background)
      ) {
        root.style.setProperty("--custom-accent", colors.accent);
        root.style.setProperty("--custom-secondary", colors.secondary);
        root.style.setProperty("--custom-background", colors.background);
        root.dataset.custom = "true";
      } else {
        localStorage.removeItem("aiwork-custom-colors");
      }
    }
  } catch {
    root.dataset.theme = "synthwave";
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
