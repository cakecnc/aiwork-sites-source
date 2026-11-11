import { v12Css, addedRuntime, changedRuntime } from "./v12-contract.mjs";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";
import { createHash } from "node:crypto";
import postcss from "postcss";
import { transform } from "lightningcss";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const filename = path.join(root, "app/cinematic-theme.css");
const css = v12Css(fs.readFileSync(filename, "utf8"));
const marker = "/* Enabled controls: a bright, control-sized green halo with a deep slow pulse.";
// Keep the v8 control contracts independent of the additive foreground-copy layer.
// Frozen transforms below are still the default. The exact v12 fine-pointer,
// no-reduced-motion CTA-only exception is guarded in hover-motion.test.mjs.
const foregroundMarker = "/* Foreground copy: static green light on the text region under the mouse.";
const block = css.slice(css.indexOf(marker), css.indexOf(foregroundMarker));
const ast = postcss.parse(block, { from: filename });
const rules = [];
ast.walkRules(rule => rules.push(rule));
const declarations = rule => Object.fromEntries((rule.nodes ?? [])
  .filter(node => node.type === "decl").map(node => [node.prop, node.value]));
const inKeyframes = rule => rule.parent?.type === "atrule" && rule.parent.name === "keyframes";
const mediaFor = rule => {
  const media = [];
  for (let parent = rule.parent; parent; parent = parent.parent) {
    if (parent.type === "atrule" && parent.name === "media") media.push(parent.params);
  }
  return media.join(" ");
};
const controls = rules.filter(rule => !inKeyframes(rule));

// Self-contained stylesheet contracts: syntax, guarded media/state selectors,
// static label light, contrast arithmetic and unchanged v7 styles. They do not
// claim browser rendering or computed-style verification.
test("the complete stylesheet parses without recovery or CSS compiler warnings", () => {
  assert.ok(css.includes(marker));
  assert.doesNotThrow(() => postcss.parse(css, { from: filename }));
  const compiled = transform({ filename, code: Buffer.from(css), errorRecovery: false });
  assert.deepEqual(compiled.warnings, []);
});

test("the interaction layer is scoped and preserves idle palettes, text metrics and layout", () => {
  assert.ok(controls.length > 0);
  for (const rule of controls) {
    assert.match(rule.selector, /:root.*body/s);
    assert.match(rule.selector, /aiwork-cinematic-content/);
    if (rule.selector.endsWith("::before")) continue;
    if (declarations(rule).color || declarations(rule).background || declarations(rule)["text-shadow"]) {
      assert.match(rule.selector, /:is\(:active,:focus-visible\)|:hover/, "Label light applies only during interaction");
      assert.match(rule.selector, /:not\(:disabled/, "Disabled targets never receive label light");
    }
    for (const prop of Object.keys(declarations(rule))) {
      assert.ok(!/^(?:opacity|animation)(?:-|$)/.test(prop), `${prop} must animate only the decoration, never the button or text`);
      assert.ok(!/^(?:font|padding|margin|width|height|display|overflow|z-index|clip-path)(?:-|$)/.test(prop), `${prop} must not change the control's content or geometry`);
    }
  }
  assert.doesNotMatch(block, /data-theme|--accent\s*:|--text\s*:|--surface\s*:/);
  const anchored = controls.filter(rule => declarations(rule).position === "relative");
  assert.equal(anchored.length, 1);
  assert.doesNotMatch(anchored[0].selector, /cinematic-motion-control|back-to-top/);
  const stable = controls.find(rule => declarations(rule).transform === "none");
  assert.equal(declarations(stable).transition, "none");
  assert.equal(declarations(stable).filter, "none");
});

test("enabled controls include CTAs, navigation, form buttons and floating controls", () => {
  const targets = controls.filter(rule => rule.selector.includes(":not(:disabled"));
  assert.ok(targets.length >= 8);
  for (const rule of targets) {
    assert.match(rule.selector, /\[aria-disabled="true"\]/);
    assert.match(rule.selector, /\[hidden\]/);
    assert.match(rule.selector, /\[inert\]/);
    assert.match(rule.selector, /\.browser-preview \*/);
  }
  const selector = targets[0].selector;
  for (const target of ["button", ".primary-button", ".secondary-button", ".install-small", ".hashcat-primary", ".hashcat-paypal", ".research-paypal", ".section-nav a", ".cinematic-motion-control", ".back-to-top"]) {
    assert.ok(selector.includes(target), `Missing ${target}`);
  }
});

test("the light outlines the whole control without changing text, hit boxes or navigation after", () => {
  for (const rule of controls) assert.doesNotMatch(rule.selector, /::after/);
  const pseudo = controls.find(rule => rule.selector.endsWith("::before"));
  const value = declarations(pseudo);
  assert.equal(value.content, '""');
  assert.equal(value.position, "absolute");
  assert.equal(value["pointer-events"], "none");
  assert.equal(value.inset, "1px");
  assert.equal(value["box-sizing"], "border-box");
  assert.equal(value.border, "1px solid #b8ffcd");
  assert.equal(value["border-radius"], "inherit");
  assert.equal(value.background, "transparent");
  assert.equal(value.width, undefined);
  assert.equal(value.height, undefined);
  assert.equal(value["z-index"], undefined);
  assert.match(value["box-shadow"], /0 0 16px rgb\(49 255 128 \/ 95%\)/);
  assert.match(value["box-shadow"], /0 0 32px rgb\(49 255 128 \/ 70%\)/);
  assert.match(value["box-shadow"], /inset 0 0 14px rgb\(49 255 128 \/ 45%\)/);
  assert.equal(value.opacity, "var(--control-light-opacity)");
  assert.doesNotMatch(block, /will-change\s*:|backdrop-filter\s*:/);
});

test("hover cannot become sticky touch animation and all pulses respect reduced motion", () => {
  for (const rule of controls.filter(rule => rule.selector.includes(":hover"))) {
    assert.match(mediaFor(rule), /\(hover: hover\)/);
    assert.match(mediaFor(rule), /\(pointer: fine\)/);
  }
  const animationRules = controls.filter(rule => /matrix-control-/.test(declarations(rule)["--control-light-motion"] ?? ""));
  assert.equal(animationRules.length, 2);
  for (const rule of animationRules) {
    assert.match(mediaFor(rule), /\(prefers-reduced-motion: no-preference\)/);
    assert.match(rule.selector, /:hover$/);
    const duration = Number(declarations(rule)["--control-light-motion"].match(/ (\d+(?:\.\d+)?)s /)[1]);
    assert.ok(duration >= 2 && duration <= 3, "The pulse is slow, not a strobe");
  }
  const base = controls.find(rule => declarations(rule)["--control-light-motion"] === "none");
  assert.equal(declarations(base)["--control-light-opacity"], "0");
  assert.equal(mediaFor(base), "");
});

test("every tier has a deep slow pulse; only full quality adds slight halo expansion", () => {
  const frames = new Map();
  ast.walkAtRules("keyframes", frame => frames.set(frame.params, frame));
  assert.deepEqual([...frames.keys()].sort(), ["matrix-control-current", "matrix-control-pulse"]);
  const properties = frame => {
    const result = new Set();
    frame.walkDecls(decl => result.add(decl.prop));
    return [...result].sort();
  };
  assert.deepEqual(properties(frames.get("matrix-control-pulse")), ["opacity"]);
  assert.deepEqual(properties(frames.get("matrix-control-current")), ["opacity", "transform"]);
  const drift = controls.find(rule => (declarations(rule)["--control-light-motion"] ?? "").startsWith("matrix-control-current"));
  assert.match(drift.selector, /:root:not\(\[data-cinematic-performance="reduced"\],\[data-cinematic-performance="lowest"\]\)/);
  for (const frame of frames.values()) {
    const opacity = frame.nodes.flatMap(rule => rule.nodes.filter(node => node.prop === "opacity").map(node => Number(node.value)));
    assert.equal(Math.min(...opacity), .08);
    assert.equal(Math.max(...opacity), 1);
    assert.ok(Math.max(...opacity) / Math.min(...opacity) >= 10, "A pronounced dim-to-bright halo, not the former .42 floor");
    frame.walkDecls(decl => assert.ok(!/shadow|filter|background|width|height/.test(decl.prop)));
  }
});

test("focus has an inset high-contrast ring even on clipped buttons and mouse overlap", () => {
  const focus = controls.find(rule => rule.selector.endsWith(":focus-visible"));
  const value = declarations(focus);
  assert.equal(value.outline, "2px solid #b8ffcd");
  assert.equal(value["outline-offset"], "4px");
  assert.match(value["box-shadow"], /inset 0 0 0 2px #001c09,inset 0 0 0 4px #b8ffcd/);
  const hover = controls.find(rule => rule.selector.includes(":hover") && declarations(rule)["box-shadow"]);
  assert.match(hover.selector, /:hover:not\(:focus-visible\)$/);
  const active = controls.find(rule => rule.selector.endsWith(":is(:active,:focus-visible)"));
  assert.equal(mediaFor(active), "");
  assert.equal(declarations(active)["--control-light-opacity"], ".9");
});

test("disabled controls suppress the legacy important proximity shadow", () => {
  const disabled = controls.find(rule => declarations(rule)["box-shadow"] === "none");
  assert.match(disabled.selector, /:disabled/);
  assert.match(disabled.selector, /\[aria-disabled="true"\]/);
  assert.equal(disabled.nodes.find(node => node.prop === "box-shadow").important, true);
  for (const rule of controls.filter(rule => !rule.selector.endsWith("::before") && declarations(rule)["box-shadow"] && declarations(rule)["box-shadow"] !== "none")) {
    assert.equal(rule.nodes.find(node => node.prop === "box-shadow").important, true);
  }
});

// The complete pre-interaction prefix is unchanged from the current deployment.
// This guards both themes, the original poster, surfaces and existing typography.
test("all CSS preceding the interaction layer stays byte-identical to the current baseline", () => {
  const prefix = css.slice(0, css.indexOf(marker));
  assert.equal(createHash("sha256").update(prefix).digest("hex"), "f7ca8caf2ebe0d183c80d471ff5f32884868f536714c59d20df95f9b9b5821ab");
});


const labelMarker = "/* Luminous labels stay steady while the separate boundary halo pulses.";
const labelRules = controls.filter(rule => declarations(rule)["text-shadow"]);
const backgroundRules = controls.filter(rule => declarations(rule).background === "#001c09");

test("new label lighting leaves the entire v7 stylesheet byte-identical", () => {
  assert.ok(css.includes(labelMarker));
  const previous = css.slice(0, css.indexOf(labelMarker)).trimEnd() + "\n";
  assert.equal(createHash("sha256").update(previous).digest("hex"),
    "d6fae370daada6c14d70b8d7d31ce4d85a0542f249c4d6da7730b8dcedf21f38",
    "Idle themes, typography, layout, focus ring, boundary halo and its exact pulse stay unchanged");
});

test("actual labels and nested text receive luminous green without shadow animation", () => {
  assert.equal(labelRules.length, 4, "Each state path covers both the control and text descendants");
  const sourceSelector = controls.find(rule => declarations(rule)["--control-light-motion"] === "none").selector;
  for (const rule of labelRules) {
    const value = declarations(rule);
    assert.equal(value.color, "#b8ffcd");
    assert.equal(value["text-shadow"], "0 0 2px #b8ffcd,0 0 8px #31ff80,0 0 18px rgb(49 255 128 / 75%)");
    assert.ok(rule.selector.replace(/\s+/g, " ").startsWith(sourceSelector.replace(/\s+/g, " ")),
      "Exactly the existing guarded controls receive the effect");
    assert.equal(value.animation, undefined);
    assert.equal(value.transition, undefined);
    assert.equal(value.opacity, undefined);
    assert.equal(value.filter, undefined);
  }
  const nested = labelRules.filter(rule => rule.selector.endsWith(":is(span,strong,b,em,small)"));
  assert.equal(nested.length, 2, "Explicit label colors override nested theme, language and CTA text palettes");
  ast.walkAtRules("keyframes", frame => frame.walkDecls(decl => {
    assert.ok(!/color|shadow|background|filter/.test(decl.prop), "Label light and background must never animate per frame");
  }));
});

test("hover-only light is mouse-gated; focus and touch-active light stay static in all motion modes", () => {
  for (const state of [":is(:active,:focus-visible)", ":hover"]) {
    const stateLabels = labelRules.filter(rule => rule.selector.includes(state));
    assert.equal(stateLabels.length, 2);
    assert.equal(backgroundRules.filter(rule => rule.selector.includes(state)).length, 2,
      "Each state protects control text and colored selected-option badges");
    for (const rule of stateLabels) {
      if (state === ":hover") assert.equal(mediaFor(rule), "(hover: hover) and (pointer: fine)");
      else assert.equal(mediaFor(rule), "", "Keyboard/touch states still light without animation or hover capability");
      assert.doesNotMatch(mediaFor(rule), /no-preference/, "Reduced-motion users keep the static text light");
    }
  }
  for (const rule of controls.filter(rule => declarations(rule).animation)) {
    assert.ok(rule.selector.endsWith("::before"), "Only the decorative boundary may animate");
  }
});

const luminance = hex => {
  const rgb = hex.replace("#", "").match(/.{2}/g).map(channel => parseInt(channel, 16) / 255)
    .map(channel => channel <= .04045 ? channel / 12.92 : ((channel + .055) / 1.055) ** 2.4);
  return rgb[0] * .2126 + rgb[1] * .7152 + rgb[2] * .0722;
};
const contrast = (a,b) => {
  const [bright,dark] = [luminance(a),luminance(b)].sort((x,y) => y-x);
  return (bright + .05) / (dark + .05);
};

test("solid interaction backing protects green text on both theme CTAs and yellow payment buttons", () => {
  const text = declarations(labelRules[0]).color;
  assert.equal(backgroundRules.length, 4);
  for (const rule of backgroundRules) {
    assert.ok(contrast(text, declarations(rule).background) >= 7, "AAA text contrast before any optional glow");
  }
  // These real idle fills would be unreadable with green text alone. State rules
  // replace the entire background, including gradients, rather than overlaying it.
  for (const idleFill of ["#54ff78", "#9aff71", "#8b5cf6", "#22d3ee", "#ffd140", "#ffc439"]) {
    assert.ok(contrast(text, idleFill) < 4.5, `${idleFill} needs the solid state-only backing`);
  }
  for (const rule of labelRules.filter(rule => !rule.selector.endsWith(":is(span,strong,b,em,small)"))) {
    assert.equal(declarations(rule).background, "#001c09");
    for (const target of [".primary-button", ".install-small", ".hashcat-primary", ".hashcat-paypal", ".research-paypal", "button"]) {
      assert.ok(rule.selector.includes(target), `Solid backing must include ${target}`);
    }
  }
  const badges = backgroundRules.filter(rule => rule.selector.endsWith("> b"));
  assert.equal(badges.length, 2);
  for (const rule of badges) assert.match(rule.selector, /:is\(\.theme-option,\.character-option,\.language-option\)/);
});
