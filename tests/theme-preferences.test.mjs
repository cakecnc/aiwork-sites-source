import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const bootSource = readFileSync(new URL("../app/theme-boot.tsx", import.meta.url), "utf8");
const bootScript = bootSource.match(/String.raw`([\s\S]*?)`;/)[1];
function boot(stored = {}, search = "", language = "ko", blocked = false) {
  const values = new Map(Object.entries(stored));
  const root = { dataset: { custom: "true" } };
  vm.runInNewContext(bootScript, {
    document: { documentElement: root }, location: { search }, navigator: { language }, URLSearchParams,
    localStorage: {
      getItem(key) { if (blocked) throw Error("Storage unavailable"); return values.get(key) ?? null; },
      setItem() { throw Error("Bootstrap must not overwrite saved preferences"); },
      removeItem() { throw Error("Bootstrap must not delete saved preferences"); },
    },
  });
  return { root, values };
}
function loadModule(name, mocks = {}, globals = {}) {
  const source = readFileSync(new URL(`../app/${name}`, import.meta.url), "utf8");
  const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const exports = {};
  vm.runInNewContext(js, {
    exports,
    ...globals,
    require: id => mocks[id] ?? (id.startsWith("./") ? loadModule(`${id.slice(2)}.ts`, mocks) : require(id)),
  });
  return exports;
}
const i18n = loadModule("i18n.ts");
const characters = loadModule("characters.ts");
const selections = [];
let activeLocale = "ko";
const preferences = loadModule("preferences.tsx", {
  react: {
    createContext: () => ({}),
    useContext: () => ({ locale: activeLocale, theme: "console", character: "aiwork", setLocale() {}, setTheme: v => selections.push(v), setCharacter() {} }),
    useEffect() {}, useRef: () => ({ current: null }), useState: () => [true, () => {}],
  },
  "next/navigation": { usePathname: () => "/" },
  "next/image": { default: "img" },
});
function flatten(node) {
  if (!node || typeof node !== "object") return [];
  if (Array.isArray(node)) return node.flatMap(flatten);
  return [node, ...flatten(node.props?.children)];
}

for (const storedTheme of [null, "console", "aurora", "system", "light", "dark", "editorial", "synthwave", "invalid"]) {
  test(`bootstrap and client agree on legacy theme ${storedTheme}`, () => {
    const stored = storedTheme === null ? {} : { "aiwork-theme": storedTheme };
    const { root, values } = boot(stored);
    assert.equal(root.dataset.theme, preferences.normalizeTheme(storedTheme));
    assert.deepEqual(Object.fromEntries(values), stored);
    assert.equal(root.dataset.custom, undefined);
  });
}

test("saved custom palettes remain intact but cannot override curated themes", () => {
  for (const colors of ['{"accent":"#ffffff"}', "malformed JSON"]) {
    const stored = { "aiwork-custom-enabled": "true", "aiwork-custom-colors": colors, "aiwork-theme": "aurora", "aiwork-character": "planner" };
    const { root, values } = boot(stored);
    assert.equal(root.dataset.theme, "aurora");
    assert.equal(root.dataset.character, "planner");
    assert.equal(root.dataset.custom, undefined);
    assert.deepEqual(Object.fromEntries(values), stored);
  }
});

for (const locale of i18n.supportedLocales) {
  test(`${locale}: locale precedence, direction, two themes then characters`, () => {
    const { root } = boot({ "aiwork-locale": "en" }, `?lang=${locale}`, "ja");
    assert.equal(root.lang, locale);
    assert.equal(root.dir, locale === "ar" ? "rtl" : "ltr");
    activeLocale = locale;
    const nodes = flatten(preferences.PreferenceControls());
    const themeOptions = nodes.filter(n => n.props?.className?.startsWith("theme-option "));
    assert.equal(themeOptions.length, 2);
    assert.deepEqual(themeOptions.map(n => n.key), ["console", "aurora"]);
    for (const node of themeOptions) {
      assert.equal(node.props.role, "menuitemradio");
      assert.equal(typeof node.props["aria-label"], "string");
      assert.equal(node.props["aria-checked"], node.key === "console");
    }
    const characterOptions = nodes.filter(n => n.props?.className?.startsWith("character-option "));
    assert.equal(characterOptions.length, characters.characterKeys.length);
    assert.ok(nodes.indexOf(characterOptions[0]) > nodes.indexOf(themeOptions[1]));
    assert.equal(nodes.filter(n => n.props?.className?.startsWith("language-option ")).length, 8);
    assert.ok(!nodes.some(n => n.type === "dialog" || n.props?.type === "color" || n.props?.className?.includes("custom-link")));
    assert.deepEqual(Object.keys(i18n.messages[locale].themes).sort(), ["aurora", "console"]);
  });
}

test("Korean labels match the requested options and choosing emits supported keys", () => {
  assert.equal(i18n.messages.ko.themes.console.name, "원본");
  assert.equal(i18n.messages.ko.themes.aurora.name, "프리미엄 오로라");
  const options = flatten(preferences.PreferenceControls()).filter(n => n.props?.className?.startsWith("theme-option "));
  options.forEach(n => n.props.onClick());
  assert.deepEqual(selections, ["console", "aurora"]);
});

test("storage failure retains URL/browser locale detection and safe original theme", () => {
  assert.equal(boot({}, "?lang=ar", "en", true).root.lang, "ar");
  assert.equal(boot({}, "", "fr-FR", true).root.lang, "fr");
  assert.equal(boot({}, "", "en", true).root.dataset.theme, "console");
});

test("stored locale and character remain usable", () => {
  const { root } = boot({ "aiwork-locale": "de", "aiwork-character": "planner" }, "?lang=invalid", "ja");
  assert.equal(root.lang, "de");
  assert.equal(root.dataset.character, "planner");
  assert.equal(boot({ "aiwork-character": "retired" }).root.dataset.character, "aiwork");
});


test("provider persists explicit choices safely and normalizes cross-tab legacy changes", () => {
  const writes = [];
  const stateChanges = [];
  const effects = [];
  let onStorage;
  let blocked = false;
  const provider = loadModule("preferences.tsx", {
    react: {
      createContext: () => ({ Provider: "provider" }),
      useEffect: effect => effects.push(effect),
      useState: initial => [initial, value => stateChanges.push(value)],
    },
    "next/navigation": { usePathname: () => "/" },
    "next/image": { default: "img" },
  }, {
    localStorage: {
      setItem(key, value) { if (blocked) throw Error("Blocked"); writes.push([key, value]); },
    },
    window: {
      addEventListener(name, callback) { if (name === "storage") onStorage = callback; },
      removeEventListener() {},
    },
  });
  const rendered = provider.SitePreferencesProvider({ children: null });
  rendered.props.value.setTheme("aurora");
  assert.deepEqual(writes, [["aiwork-theme", "aurora"]]);
  blocked = true;
  assert.doesNotThrow(() => rendered.props.value.setTheme("console"));
  assert.equal(stateChanges.at(-1), "console");
  effects.at(-1)();
  onStorage({ key: "aiwork-theme", newValue: "synthwave" });
  assert.equal(stateChanges.at(-1), "console");
  onStorage({ key: "aiwork-theme", newValue: "aurora" });
  assert.equal(stateChanges.at(-1), "aurora");
  onStorage({ key: "aiwork-theme", newValue: null });
  assert.equal(stateChanges.at(-1), "console");
  assert.deepEqual(writes, [["aiwork-theme", "aurora"]]);
});

function recoverPreferences({ stored = {}, search = "", language = "ko", blocked = false, dataset = {} } = {}) {
  const values = new Map(Object.entries(stored));
  const state = [];
  let stateIndex = 0;
  let effects = [];
  const root = { dataset: { ...dataset } };
  let href = `https://aiwork.to/research${search}`;
  const provider = loadModule("preferences.tsx", {
    react: {
      createContext: () => ({ Provider: "provider" }),
      useEffect: effect => effects.push(effect),
      useState(initial) {
        const index = stateIndex++;
        if (!(index in state)) state[index] = initial;
        return [state[index], value => { state[index] = value; }];
      },
    },
    "next/navigation": { usePathname: () => "/research" },
    "next/image": { default: "img" },
  }, {
    URL, URLSearchParams, navigator: { language }, document: { documentElement: root },
    localStorage: {
      getItem(key) { if (blocked) throw Error("Blocked"); return values.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw Error("Blocked"); values.set(key, value); },
    },
    window: {
      location: { search, href },
      requestAnimationFrame(callback) { callback(); return 1; },
      cancelAnimationFrame() {}, addEventListener() {}, removeEventListener() {},
      history: { state: null, replaceState(_state, _title, url) { href = String(url); } },
    },
  });
  const initial = provider.SitePreferencesProvider({ children: null }).props.value;
  assert.equal(initial.locale, "ko", "first client render remains identical to SSR");
  assert.equal(initial.theme, "console");
  assert.equal(initial.character, "aiwork");
  assert.equal(initial.ready, false);
  // Commit mount effects, then the render scheduled by the frame callback.
  effects.forEach(effect => effect());
  effects = [];
  stateIndex = 0;
  const resolved = provider.SitePreferencesProvider({ children: null }).props.value;
  effects.slice(1).forEach(effect => effect());
  return { resolved, root, values, href };
}

for (const locale of i18n.supportedLocales) {
  test(`recovery without boot dataset preserves ${locale}, aurora and planner`, () => {
    const result = recoverPreferences({
      stored: { "aiwork-locale": locale, "aiwork-theme": "aurora", "aiwork-character": "planner" },
      search: "?section=latest",
      language: "en-US",
      dataset: { theme: "console" },
    });
    assert.equal(result.resolved.locale, locale);
    assert.equal(result.resolved.theme, "aurora");
    assert.equal(result.resolved.character, "planner");
    assert.equal(result.resolved.ready, true);
    assert.equal(result.values.get("aiwork-locale"), locale);
    assert.equal(result.values.get("aiwork-character"), "planner");
    assert.equal(result.root.dir, locale === "ar" ? "rtl" : "ltr");
    assert.equal(new URL(result.href).searchParams.get("section"), "latest");
    assert.equal(new URL(result.href).searchParams.get("lang"), locale === "ko" ? null : locale);
  });
}

test("recovery preserves an explicit lang query instead of replacing it with a default", () => {
  const result = recoverPreferences({ stored: { "aiwork-locale": "de" }, search: "?lang=ar&section=latest", language: "en" });
  assert.equal(result.resolved.locale, "ar");
  assert.equal(result.values.get("aiwork-locale"), "ar");
  assert.equal(new URL(result.href).searchParams.get("lang"), "ar");
  assert.equal(new URL(result.href).searchParams.get("section"), "latest");
});

test("recovery and boot agree when storage is blocked or legacy values are present", () => {
  for (const language of ["ko-KR", "en-US", "ja-JP", "zh-TW", "ar-SA", "es-ES", "fr-FR", "de-DE", "unknown"]) {
    const result = recoverPreferences({ language, blocked: true });
    const early = boot({}, "", language, true);
    assert.equal(result.resolved.locale, early.root.dataset.locale);
    assert.equal(result.resolved.theme, early.root.dataset.theme);
    assert.equal(result.resolved.character, early.root.dataset.character);
  }
  const result = recoverPreferences({ stored: { "aiwork-theme": "synthwave", "aiwork-character": "planner" } });
  assert.equal(result.resolved.theme, "console");
  assert.equal(result.values.get("aiwork-theme"), "synthwave");
  assert.equal(result.values.get("aiwork-character"), "planner");
  const explicit = recoverPreferences({ search: "?lang=ja", language: "en", blocked: true });
  assert.equal(explicit.resolved.locale, "ja");
  assert.equal(new URL(explicit.href).searchParams.get("lang"), "ja");
});
