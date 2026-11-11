import { v12Css, addedRuntime, changedRuntime } from "./v12-contract.mjs";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import { transform } from "lightningcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const read = file => file.endsWith(".css") ? v12Css(fs.readFileSync(path.join(root, file), "utf8")) : fs.readFileSync(path.join(root, file), "utf8");
const hash = value => createHash("sha256").update(value).digest("hex");
const baseline = JSON.parse(read("qa/v12-v11-baseline/runtime-hashes.json"));
const files = ["app/cinematic-theme.css", "app/header-flow.css"];
const markers = ["/* V12 CTA hover:", "/* V12 motion repair:"];
const additions = files.map((file, i) => {
  const source = read(file);
  assert.equal(source.split(markers[i]).length, 2, `Exactly one additive v12 layer in ${file}`);
  return source.slice(source.indexOf(markers[i]));
});
const values = rule => Object.fromEntries(rule.nodes.filter(n => n.type === "decl").map(n => [n.prop, n.value]));
const rulesOf = css => {
  const result = [];
  postcss.parse(css).walkRules(rule => result.push(rule));
  return result;
};
const [ctaRules, cardRules] = additions.map(rulesOf);
const normalize = value => value.replace(/\s+/g, " ").trim();
const guard = "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";

// These are syntax, source-integrity and deliberately limited selector-model
// tests, not a substitute for actual browser rendering, hit testing or cascade.
function parseSelectors(selector) {
  const result = [];
  transform({ filename: "selector.css", code: Buffer.from(`${selector}{color:green}`),
    visitor: { Selector(value) { result.push(value); } } });
  return result;
}
const ancestors = element => element?.parent ? [element.parent, ...ancestors(element.parent)] : [];
const node = (tag, attrs = {}, parent = null) => ({ tag, attrs, parent, hovered: true });
function matches(element, tokens) {
  let split = -1;
  tokens.forEach((token, index) => { if (token.type === "combinator") split = index; });
  if (!tokens.slice(split + 1).every(token => component(element, token))) return false;
  if (split === -1) return true;
  const relation = tokens[split].value;
  const candidates = relation === "child" ? [element.parent].filter(Boolean)
    : relation === "descendant" ? ancestors(element) : assert.fail(`Unsupported combinator: ${relation}`);
  return candidates.some(parent => matches(parent, tokens.slice(0, split)));
}
function component(element, token) {
  if (token.type === "universal") return true;
  if (token.type === "type") return element.tag === token.name;
  if (token.type === "class") return (element.attrs.class ?? "").split(/\s+/).includes(token.name);
  if (token.type === "attribute") {
    if (!Object.hasOwn(element.attrs, token.name)) return false;
    if (!token.operation) return true;
    assert.equal(token.operation.operator, "equal");
    return element.attrs[token.name] === token.operation.value;
  }
  assert.equal(token.type, "pseudo-class", `Unsupported token: ${JSON.stringify(token)}`);
  if (token.kind === "root") return !element.parent;
  if (token.kind === "hover") return element.hovered;
  if (token.kind === "disabled") return Object.hasOwn(element.attrs, "disabled");
  if (["is", "where"].includes(token.kind)) return token.selectors.some(selector => matches(element, selector));
  if (token.kind === "not") return !token.selectors.some(selector => matches(element, selector));
  assert.fail(`Unsupported pseudo-class: ${token.kind}`);
}
const matchesRule = (element, rule) => parseSelectors(rule.selector).some(tokens => matches(element, tokens));
function mount(tag, classes, attrs = {}, wrapperAttrs = {}) {
  const html = node("html");
  const body = node("body", {}, html);
  const content = node("main", { class: "aiwork-cinematic-content" }, body);
  const wrapper = node("div", wrapperAttrs, content);
  return node(tag, { class: classes, ...attrs }, wrapper);
}

test("v12 changes exactly two runtime CSS files; all 79 other v11 files remain identical", () => {
  const walk = dir => fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => entry.isDirectory()
    ? walk(path.join(dir, entry.name)) : [path.relative(root, path.join(dir, entry.name))]);
  const runtime = ["app", "public"].flatMap(dir => walk(path.join(root, dir))).filter(file => !addedRuntime.includes(file)).sort();
  assert.equal(runtime.length, 81);
  assert.deepEqual(runtime, Object.keys(baseline).sort(), "No runtime files were added or removed");
  const changed = runtime.filter(file => !changedRuntime.includes(file) && hash(file.endsWith(".css") ? read(file) : fs.readFileSync(path.join(root, file))) !== baseline[file]);
  assert.deepEqual(changed, [...files].sort());
  // Keep the recorded v11 values, not candidate hashes disguised as a baseline.
  assert.equal(baseline[files[0]], "fa53e7dbf0d63d2bd0deb59fe000a34c003f5fa8b73fa1cbd0fbab3ac5212a27");
  assert.equal(baseline[files[1]], "6c46739d6861ffcc101e27f7c86b89d3de8bc905da542a8955152300027a34f4");
});

test("both v12 files preserve their entire v11 bytes before the additive repair", () => {
  files.forEach((file, i) => {
    assert.equal(hash(read(file).split(markers[i])[0].trimEnd() + "\n"), baseline[file], file);
  });
});

test("both complete stylesheets and the additive layers parse without recovery or warnings", () => {
  for (const file of files) {
    const code = read(file);
    assert.doesNotThrow(() => postcss.parse(code, { from: file }));
    assert.deepEqual(transform({ filename: file, code: Buffer.from(code), errorRecovery: false }).warnings, []);
  }
  for (const css of additions) {
    const ast = postcss.parse(css);
    assert.equal(ast.nodes.filter(n => n.type !== "comment").length, 1);
    assert.equal(ast.nodes.find(n => n.type !== "comment").name, "media");
  }
});

test("every new transition and transform is fine-hover and no-reduced-motion gated", () => {
  for (const rule of [...ctaRules, ...cardRules]) {
    assert.equal(rule.parent.name, "media");
    assert.equal(rule.parent.params, guard);
    assert.doesNotMatch(rule.selector, /data-theme|data-cinematic-performance|:active|:focus|::/);
    for (const declaration of rule.nodes) {
      assert.equal(declaration.type, "decl");
      assert.equal(declaration.important, undefined);
    }
  }
  assert.equal(ctaRules.length, 2);
  assert.equal(cardRules.length, 1);
});

test("card repair composes 140ms movement and existing 120ms outline/shadow transitions", () => {
  assert.deepEqual(values(cardRules[0]), {
    transition: "transform 140ms ease, border-color 140ms ease,\n      background-color 140ms ease, outline-color 120ms linear,\n      box-shadow 120ms linear",
  });
  assert.equal(normalize(cardRules[0].selector), ":is(.home-workbench,.detail-visual,.home-role-grid article, .home-capability-grid article,.home-boundary-grid article, .price-card,.support-card,.fact-card,.guide-card)[data-proximity-glow]");
  assert.doesNotMatch(additions[1], /transform\s*:/, "Card displacement comes only from unchanged globals.css");
  for (const [tag, name, parentClass] of [
    ["div", "home-workbench"], ["div", "detail-visual"],
    ["article", "", "home-role-grid"], ["article", "", "home-capability-grid"], ["article", "", "home-boundary-grid"],
    ...["price-card", "support-card", "fact-card", "guide-card"].map(name => ["div", name]),
  ]) {
    assert.ok(matchesRule(mount(tag, name, { "data-proximity-glow": "" }, { class: parentClass ?? "" }), cardRules[0]), name || parentClass);
    assert.ok(!matchesRule(mount(tag, name, {}, { class: parentClass ?? "" }), cardRules[0]), "Only registered proximity targets need composition");
  }
  assert.ok(!matchesRule(mount("button", "theme-trigger", { "data-proximity-glow": "" }), cardRules[0]));
});

test("existing 2–3px card transforms and important reduced-motion resets stay intact", () => {
  const globals = rulesOf(read("app/globals.css"));
  const expected = {
    ".home-workbench:hover, .detail-visual:hover": "translateY(-3px)",
    ".home-role-grid article:hover, .home-boundary-grid article:hover, .price-card:hover, .support-card:hover, .fact-card:hover, .guide-card:hover": "translateY(-2px)",
    ".home-capability-grid article:hover": "translateX(3px)",
  };
  for (const [selector, translation] of Object.entries(expected)) {
    const rule = globals.find(r => normalize(r.selector) === selector);
    assert.equal(values(rule).transform, translation);
    assert.equal(rule.parent.params, "(hover: hover) and (pointer: fine)");
  }
  const reset = globals.find(rule => rule.parent.params === "(prefers-reduced-motion: reduce)" && rule.selector.includes(".home-workbench"));
  assert.equal(values(reset).transform, "none");
  assert.equal(reset.nodes.find(n => n.prop === "transform").important, true);
  const headerReset = rulesOf(read(files[1])).find(rule => rule.parent.params === "(prefers-reduced-motion: reduce)");
  assert.equal(values(headerReset).transition, "none");
  assert.equal(headerReset.nodes.find(n => n.prop === "transition").important, true);
});

test("only whole enabled primary, secondary and install CTA anchors/buttons get 1px lift", () => {
  const [transition, hover] = ctaRules;
  assert.deepEqual(values(transition), { transition: "transform 140ms ease" });
  assert.deepEqual(values(hover), { transform: "translateY(-1px)" });
  assert.equal(hover.selector, `${transition.selector}:hover`);
  assert.equal(normalize(transition.selector), ':root body .aiwork-cinematic-content :is(a,button):is( .primary-button,.secondary-button,.install-small ):not(:disabled,[aria-disabled="true"],[hidden],[inert],[inert] *,.browser-preview *)');
  for (const tag of ["a", "button"]) {
    for (const name of ["primary-button", "secondary-button", "install-small"]) {
      const control = mount(tag, name);
      assert.ok(matchesRule(control, transition));
      assert.ok(matchesRule(control, hover));
      control.hovered = false;
      assert.ok(matchesRule(control, transition), "Both hover entry and exit remain smooth");
      assert.ok(!matchesRule(control, hover));
      assert.ok(!matchesRule(node("span", {}, control), hover), "The complete CTA moves, not individual labels");
    }
  }
});

test("CTA exception excludes disabled, inert, hidden, preview and unrelated controls", () => {
  for (const rule of ctaRules) {
    for (const attrs of [{ disabled: "" }, { "aria-disabled": "true" }, { hidden: "" }, { inert: "" }]) {
      assert.ok(!matchesRule(mount("button", "primary-button", attrs), rule), JSON.stringify(attrs));
    }
    for (const wrapper of [{ inert: "" }, { class: "browser-preview" }]) {
      assert.ok(!matchesRule(mount("a", "primary-button", {}, wrapper), rule), JSON.stringify(wrapper));
    }
    for (const name of ["theme-trigger", "language-trigger", "theme-option", "language-option", "character-option", "hashcat-primary", "hashcat-paypal", "research-paypal", "cinematic-motion-control", "back-to-top", ""]) {
      assert.ok(!matchesRule(mount("button", name), rule), name || "ordinary button");
      assert.ok(!matchesRule(mount("a", name), rule), name || "ordinary link");
    }
    assert.ok(!matchesRule(mount("div", "primary-button"), rule));
    const outside = mount("button", "primary-button");
    outside.parent.parent.attrs.class = "unrelated-content";
    assert.ok(!matchesRule(outside, rule));
  }
});

test("unchanged v11 default freezes other controls and keeps the separate 2.6s halo", () => {
  const prior = read(files[0]).split(markers[0])[0];
  const rules = rulesOf(prior);
  const frozen = rules.find(rule => rule.selector.includes(":not(:disabled") && values(rule).transform === "none");
  assert.equal(values(frozen).transition, "none");
  assert.equal(values(frozen).filter, "none");
  for (const name of ["primary-button", "secondary-button", "install-small", "theme-trigger", "language-trigger"]) {
    assert.ok(matchesRule(mount("button", name), frozen), "The frozen default is preserved outside the guarded exception");
  }
  const animations = rules.filter(rule => /matrix-control-/.test(values(rule)["--control-light-motion"] ?? ""));
  assert.equal(animations.length, 2);
  animations.forEach(rule => assert.match(values(rule)["--control-light-motion"], / 2\.6s /));
  const pseudo = rules.find(rule => rule.selector.endsWith("::before") && values(rule).animation);
  assert.equal(values(pseudo).animation, "var(--control-light-motion)");
  assert.doesNotMatch(additions.join("\n"), /animation\s*:|text-shadow\s*:|color\s*:|background\s*:|filter\s*:|opacity\s*:|font\s*:|outline\s*:/);
});

test("focus, text glow, black edges, themes, locales and scene implementation remain byte preserved", () => {
  // Prefix equality above guards the complete lighting/focus cascade. These
  // anchors make the deliberately preserved contracts visible in test output.
  const prior = read(files[0]).split(markers[0])[0];
  assert.match(prior, /outline: 2px solid #b8ffcd/);
  assert.match(prior, /inset 0 0 0 2px #001c09,inset 0 0 0 4px #b8ffcd/);
  assert.match(prior, /-webkit-text-stroke: \.8px #000/);
  assert.match(prior, /0 0 8px #31ff80,0 0 18px rgb\(49 255 128 \/ 75%\)/);
  for (const file of ["app/preferences.tsx", "app/i18n.ts", "app/globals.css", "app/matrix-theme.css", "app/components/GlobalInteractions.tsx", "app/components/CinematicMatrix.tsx", "app/components/matrix-engine.js", "public/assets/aiwork-matrix-structure.svg", "public/assets/aiwork-matrix-scene-v18.webp"]) {
    if (!changedRuntime.includes(file)) assert.equal(hash(file.endsWith(".css") ? read(file) : fs.readFileSync(path.join(root, file))), baseline[file], file);
  }
});
