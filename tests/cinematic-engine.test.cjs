"use strict";
/* eslint-disable @typescript-eslint/no-require-imports -- This Node test harness is CommonJS. */

const assert = require("node:assert/strict");
const test = require("node:test");
const { readFileSync } = require("node:fs");
const { resolve } = require("node:path");
const { createContext, runInContext } = require("node:vm");
const { createHash } = require("node:crypto");

// Load the actual application engine in an isolated browser-like context. This
// tests drawing/lifecycle behavior without confusing it with visual browser QA.
const filename = resolve(__dirname, "../app/components/matrix-engine.js");
const source = readFileSync(filename, "utf8");

// Undo only the new size cache and lookup to reconstruct the exact v10 engine.
const rainSizeCache = [
  "  // Stable per-stream size buckets are cached once, never selected per frame.",
  "  // Shrink by at most 20%, stopping at 9.1 scene pixels; smaller originals stay put.",
  "  const RAIN_SIZES = Array.from({length:66},(_,i)=>{",
  "    const original=7+rand(i+305)*9,scale=[1,.9,.8][hash(i+903)%3];",
  "    return Math.min(original,Math.max(9.1,original*scale));",
  "  });",
  "",
].join("\n");
const v10CandidateSource = source.replace(rainSizeCache, "")
  .replace("const depth=rand(i+305),size=RAIN_SIZES[i];", "const depth=rand(i+305),size=7+depth*9;");

const smallTrimRemoval = [
  "          // A small further trim: remove one in six v9 surviving streams.",
  "          // Advance all prior glyph phases before dropping the complete stream.",
  "          if(((i-Math.floor(i/6))/2)%6===5)continue;",
  "",
].join("\n");
const v9CandidateSource = v10CandidateSource.replace(smallTrimRemoval, "");

// Reconstruct exact prior candidates by removing only their additive filters.
// Pinned hashes keep the comparisons self-contained and prove all other engine
// bytes unchanged; no private QA files or deployed pages are required.
const halfStreamRemoval = [
  "          // Halve the surviving streams, not the glyph grid or per-stream cells.",
  "          // The surviving-stream ordinal and glyph phase include skipped columns.",
  "          if((i-Math.floor(i/6))%2)continue;",
  "",
].join("\n");
const v7CandidateSource = v9CandidateSource.replace(halfStreamRemoval, "");
const streamRemoval = [
  "          // Drop every sixth stream after advancing the prior survivor phase.",
  "          // Keep count unchanged so remaining columns retain positions and speed.",
  "          if(i%6===5)continue;",
  "",
].join("\n");
const previousCandidateSource = v7CandidateSource.replace(streamRemoval, "");

function eventTarget() {
  const listeners = new Map();
  return {
    addEventListener(name, callback) {
      if (!listeners.has(name)) listeners.set(name, new Set());
      listeners.get(name).add(callback);
    },
    removeEventListener(name, callback) {
      listeners.get(name)?.delete(callback);
      if (!listeners.get(name)?.size) listeners.delete(name);
    },
    dispatch(name, event) {
      for (const callback of listeners.get(name) ?? []) callback(event);
    },
    get listenerCount() {
      return [...listeners.values()].reduce((count, callbacks) => count + callbacks.size, 0);
    },
  };
}

function createHarness(t, {
  width = 1672, height = 941, supported = true,
  hardwareConcurrency = 8, deviceMemory = 8, saveData = false,
  withPoster = false, posterFailure = false, posterComplete = true, renderCost = 0, bitmapSupport = false,
  engineSource = source, traceRainColumns = false, traceHashCalls = false,
} = {}) {
  const windows = eventTarget();
  const document = Object.assign(eventTarget(), { hidden: false });
  const media = Object.assign(eventTarget(), { matches: false });
  const poster = withPoster ? Object.assign(eventTarget(), { complete: posterComplete, naturalWidth: 1487 }) : undefined;
  const light = { atlasWrites: 0, gridDraws: [], reads: 0, draws: [], composites: [], effects: [], surfaces: [], mask: null };
  document.createElement = () => {
    const surface = { width: 0, height: 0 };
    light.surfaces.push(surface);
    surface.getContext = () => ({
      setTransform() {}, clearRect() {}, translate() {}, scale() {},
      drawImage(...args) { light.gridDraws.push({args, alpha:this.globalAlpha}); }, fillRect() {},
      fillText() { light.atlasWrites++; },
      createLinearGradient() { return { addColorStop() {} }; },
      getImageData() {
        light.reads++;
        if (posterFailure) throw new Error("Image cannot be sampled");
        return { data: new Uint8ClampedArray([0, 8, 3, 255, 25, 245, 70, 255]) };
      },
      putImageData(pixels) { light.mask = [...pixels.data]; },
    });
    return surface;
  };
  const frames = new Map();
  const observers = new Set();
  let nextFrame = 0;
  let viewport = { width, height };
  let operations = [];
  let matrix = [1, 0, 0, 1, 0, 0];
  let path = [];
  let clip = null;
  const stack = [];
  const context = {
    globalAlpha: 1,
    fillStyle: "",
    font: "",
    shadowBlur: 0,
    setTransform(...values) { matrix = values; },
    clearRect() { operations = []; },
    save() {
      stack.push({ matrix: [...matrix], clip, alpha: this.globalAlpha, fillStyle: this.fillStyle });
    },
    restore() {
      const saved = stack.pop();
      matrix = saved.matrix;
      clip = saved.clip;
      this.globalAlpha = saved.alpha;
      this.fillStyle = saved.fillStyle;
    },
    translate(x, y) {
      matrix[4] += matrix[0] * x + matrix[2] * y;
      matrix[5] += matrix[1] * x + matrix[3] * y;
    },
    scale(x, y) { matrix[0] *= x; matrix[1] *= x; matrix[2] *= y; matrix[3] *= y; },
    rotate(angle) {
      const [a, b, c, d] = matrix;
      const cosine = Math.cos(angle), sine = Math.sin(angle);
      matrix[0] = a * cosine + c * sine;
      matrix[1] = b * cosine + d * sine;
      matrix[2] = -a * sine + c * cosine;
      matrix[3] = -b * sine + d * cosine;
    },
    beginPath() { path = []; },
    closePath() {},
    ellipse(...args) { path.push("ellipse", args); },
    moveTo(x, y) { path.push([x, y]); },
    lineTo(x, y) { path.push([x, y]); },
    clip() { clip = path[0] === "ellipse" ? "globe" : path[0][0] < 836 ? "left" : "right"; },
    arc(...args) { path.push({arc: args}); },
    stroke() {
      light.effects.push({kind: "stroke", path: structuredClone(path), matrix: [...matrix],
        alpha: this.globalAlpha, color: this.strokeStyle, width: this.lineWidth});
    },
    fill() {
      light.effects.push({kind: "fill", path: structuredClone(path), matrix: [...matrix],
        alpha: this.globalAlpha, color: this.fillStyle, blur: this.shadowBlur});
    },
    fillRect(...args) {
      light.effects.push({kind: "rect", args, matrix: [...matrix], alpha: this.globalAlpha, color: this.fillStyle});
    },
    drawImage(...args) {
      light.draws.push(args);
      if(args[0].width !== 512) {
        light.composites.push({
          sourceWidth: args[0].width, sourceHeight: args[0].height,
          args: args.slice(1), alpha: this.globalAlpha, transform: [...matrix],
        });
      }
      if(args[0].width === 512) {
        // Read the actual sprite center before extent subtraction/addition can
        // introduce different floating-point roundoff for different glyph sizes.
        const point = traceRainColumns ? scope.__spritePoint : [args[5]+args[7]/2, args[6]+args[8]/2];
        this.fillText(`atlas:${args[1]}:${args[2]}`, point[0], point[1]);
        operations.at(-1).spriteSize = args.slice(7);
      }
    },
    fillText(text, x, y, maxWidth) {
      const dpr = canvas.width / viewport.width;
      operations.push({
        text,
        x: (matrix[0] * x + matrix[2] * y + matrix[4]) / dpr,
        y: (matrix[1] * x + matrix[3] * y + matrix[5]) / dpr,
        alpha: this.globalAlpha,
        color: this.fillStyle,
        font: this.font,
        maxWidth,
        layer: clip ?? "rain",
        ...(traceRainColumns && clip === null ? { column: scope.__rainColumn } : {}),
      });
    },
  };
  const canvas = {
    dataset: {},
    width: 0,
    height: 0,
    setAttribute() {},
    getContext() { return supported ? context : null; },
    getBoundingClientRect() { return viewport; },
  };
  class ResizeObserver {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.add(this); }
    observe(target) { this.targets.add(target); }
    disconnect() { this.targets.clear(); observers.delete(this); }
  }
  const bitmaps=[];
  let clock = 0;
  const scope = createContext({
    createImageBitmap: bitmapSupport ? async surface => { const bitmap={width:surface.width,height:surface.height,closed:false,close(){this.closed=true;}};bitmaps.push(bitmap);return bitmap; } : undefined,
    performance: {now() { clock += renderCost; return clock; }},
    document,
    navigator: { hardwareConcurrency, deviceMemory, connection: { saveData } },
    devicePixelRatio: 2,
    matchMedia: () => media,
    addEventListener: windows.addEventListener,
    removeEventListener: windows.removeEventListener,
    requestAnimationFrame(callback) { frames.set(++nextFrame, callback); return nextFrame; },
    cancelAnimationFrame(id) { frames.delete(id); },
    ResizeObserver,
  });
  // Observe original column identities without changing any draw or state.
  const columnMarker = "        const depth=rand(i+305),size=";
  const spriteMarker = "    function sprite(target,index,x,y,size,head) {";
  if (traceRainColumns) {
    assert.equal(engineSource.split(columnMarker).length, 2, "Rain column tracing must attach exactly once");
    assert.equal(engineSource.split(spriteMarker).length, 2, "Sprite position tracing must attach exactly once");
  }
  const tracedSource = traceRainColumns
    ? engineSource.replace(columnMarker, "        global.__rainColumn=i;\n" + columnMarker)
      .replace(spriteMarker, spriteMarker + "\n      global.__spritePoint=[x,y];")
    : engineSource;
  const measuredSource = traceHashCalls
    ? tracedSource.replace("const hash = (a) => {", "const hash = (a) => { global.__hashCalls=(global.__hashCalls||0)+1;")
    : tracedSource;
  runInContext(measuredSource, scope, { filename });
  const engine = scope.AIWORKMatrix.mount(canvas, { posterElement: poster });
  t.after(() => engine.destroy());
  return {
    api: scope.AIWORKMatrix, engine, canvas, frames, windows, document, media, observers, poster, light, bitmaps,
    operations: () => operations,
    hashCalls: () => scope.__hashCalls ?? 0,
    step(now) {
      const queued = [...frames.values()];
      frames.clear();
      queued.forEach(callback => callback(now));
    },
    setHidden(value) { document.hidden = value; document.dispatch("visibilitychange"); },
    setReducedMotion(value) { media.matches = value; media.dispatch("change"); },
    resize(width, height) {
      viewport = { width, height };
      for (const observer of observers) if (observer.targets.has(canvas)) observer.callback();
      windows.dispatch("resize");
    },
  };
}

test("cover fitting fills the desktop viewport", t => {
  const { api } = createHarness(t);
  const transform = api.sceneTransform(1440, 1000);
  // Multiplying the cover scale back can differ by a fractional floating-point ulp.
  assert.ok(transform.width + 1e-6 >= 1440 && transform.height + 1e-6 >= 1000);
});

test("cover fitting keeps the globe centered on a narrow phone", t => {
  const { api } = createHarness(t);
  const transform = api.sceneTransform(390, 844);
  assert.ok(Math.abs(api.geometry.globe.x * transform.scale + transform.x - 195) < 12);
});

for (const [layer, bounds] of [
  ["rain", [0, 0, 1487, 1058]],
  ["globe", [524, 230, 964, 646]],
  ["left", [68, 198, 286, 480]],
  ["right", [1250, 250, 1436, 520]],
]) {
  test(`${layer} contains independently moving glyphs in its scene region`, t => {
    const { engine, operations } = createHarness(t);
    const inRegion = row => row.layer === layer && row.x >= bounds[0] && row.x <= bounds[2]
      && row.y >= bounds[1] && row.y <= bounds[3];
    engine.renderAt(1);
    const first = operations().filter(inRegion);
    engine.renderAt(3);
    const second = operations().filter(inRegion);
    // Each panel operation is a retained 34-character row; thinning never resizes it.
    const minimum = layer === "left" || layer === "right" ? 5 : 10;
    assert.ok(first.length > minimum && second.length > minimum);
    assert.notDeepEqual(first, second);
  });
}

test("explicit pause cancels scheduled motion without clearing the visible frame", t => {
  const { engine, frames, operations, canvas } = createHarness(t);
  engine.pause();
  assert.equal(frames.size, 0);
  assert.equal(engine.getState().paused, true);
  assert.equal(canvas.dataset.motion, "paused");
  assert.ok(operations().length > 0);
});

test("resume schedules a single animation loop and advances the scene", t => {
  const { engine, frames, step } = createHarness(t);
  engine.pause();
  const previous = engine.getState().time;
  engine.resume();
  engine.resume();
  assert.equal(frames.size, 1);
  step(100);
  step(140);
  assert.ok(engine.getState().time > previous);
  assert.equal(frames.size, 1);
});

test("reduced motion stops animation and resumes when that preference is removed", t => {
  const { engine, frames, operations, canvas, setReducedMotion } = createHarness(t);
  setReducedMotion(true);
  assert.equal(frames.size, 0);
  assert.equal(engine.getState().reducedMotion, true);
  assert.equal(canvas.dataset.motion, "reduced");
  assert.ok(operations().length > 0);
  setReducedMotion(false);
  assert.equal(frames.size, 1);
});

test("hidden documents stop scheduling and visible documents resume once", t => {
  const { engine, frames, setHidden } = createHarness(t);
  setHidden(true);
  assert.equal(frames.size, 0);
  assert.equal(engine.getState().hidden, true);
  setHidden(false);
  assert.equal(frames.size, 1);
});

test("pixel density is capped on desktop and phone", t => {
  const { engine, resize } = createHarness(t);
  assert.ok(engine.getState().dpr <= 1.35);
  resize(390, 844);
  assert.equal(engine.getState().dpr, 1.1);
});

test("six-thread devices keep the full cinematic composition until measured cost requires a step-down", t => {
  const { engine, canvas } = createHarness(t, {
    hardwareConcurrency: 6, deviceMemory: 6,
  });
  assert.ok(engine.getState().quality >= .9);
  assert.equal(engine.getState().qualityTier, "full");
  assert.equal(canvas.dataset.qualityTier, "full");
});

test("constrained devices retain every motion region at a lower render cost", t => {
  const { engine, operations, canvas } = createHarness(t, {
    width: 2560, height: 1440, hardwareConcurrency: 2, deviceMemory: 2, saveData: true,
  });
  const state = engine.getState();
  assert.ok(state.quality >= .46 && state.quality <= .5);
  assert.equal(state.qualityTier, "lowest");
  assert.ok(state.dpr <= 1);
  assert.ok(canvas.width * canvas.height < 652000);
  assert.equal(canvas.dataset.qualityTier, "lowest");
  engine.renderAt(2);
  for (const layer of ["rain", "globe", "left", "right"]) {
    assert.ok(operations().filter(row => row.layer === layer).length >= 5, `${layer} remains visible`);
  }
});

test("four-thread devices use the reduced tier instead of losing the cinematic scene", t => {
  const { engine, canvas } = createHarness(t, {
    hardwareConcurrency: 4, deviceMemory: 4,
  });
  assert.ok(engine.getState().quality >= .66 && engine.getState().quality <= .7);
  assert.equal(engine.getState().qualityTier, "reduced");
  assert.equal(engine.getState().dpr, 1.05);
  assert.equal(canvas.dataset.qualityTier, "reduced");
});

test("destroy unregisters listeners, resize observers and scheduled frames", t => {
  const { engine, frames, windows, document, media, observers } = createHarness(t);
  engine.destroy();
  assert.equal(frames.size, 0);
  assert.equal(windows.listenerCount, 0);
  assert.equal(document.listenerCount, 0);
  assert.equal(media.listenerCount, 0);
  assert.equal(observers.size, 0);
});

test("manual pause is preserved across visibility and reduced-motion changes", t => {
  const { engine, frames, setHidden, setReducedMotion } = createHarness(t);
  engine.pause();
  setHidden(true);
  setReducedMotion(true);
  setHidden(false);
  setReducedMotion(false);
  assert.equal(engine.getState().paused, true);
  assert.equal(frames.size, 0);
});

test("resize updates cover geometry and pixel allocation without duplicating the loop", t => {
  const { engine, canvas, frames, resize } = createHarness(t);
  resize(390, 844);
  const state = engine.getState();
  assert.equal(state.width, 390);
  assert.equal(state.height, 844);
  assert.equal(canvas.width, Math.round(390 * state.dpr));
  assert.equal(canvas.height, Math.round(844 * state.dpr));
  assert.ok(state.transform.width >= 390 && state.transform.height >= 844);
  assert.equal(frames.size, 1);
});

test("unavailable Canvas2D degrades safely without scheduling motion", t => {
  const { engine, frames, windows, document, media, observers } = createHarness(t, { supported: false });
  assert.equal(engine.getState().supported, false);
  assert.doesNotThrow(() => { engine.pause(); engine.resume(); engine.destroy(); });
  assert.equal(frames.size, 0);
  assert.equal(windows.listenerCount + document.listenerCount + media.listenerCount + observers.size, 0);
});


test("fixed letter light samples the poster once and keeps dark pixels transparent", t => {
  const { engine, canvas, light } = createHarness(t, { withPoster: true });
  assert.equal(canvas.dataset.fixedGlyphLight, "ready");
  assert.equal(light.reads, 1);
  assert.equal(light.mask[3], 0);
  assert.ok(light.mask[7] > 200);
  const start = light.draws.length;
  engine.renderAt(2); engine.renderAt(7);
  assert.ok(light.draws.length > start + 2);
  assert.equal(light.reads, 1, "No per-frame pixel sampling or mask allocation");
  assert.equal(light.surfaces.length, 3);
});

test("fixed letter light is registered to the unchanged poster at 50% 46%", t => {
  const { engine, light } = createHarness(t, { withPoster: true });
  const { width, height, transform } = engine.getState();
  const mask = light.surfaces.find(surface => surface.width === 1487);
  const [, , sourceY, , sourceHeight, x, y, w, h] = light.draws.filter(args => args[0] === mask).at(-1);
  const maskScale = mask.width / 1487;
  assert.equal(x, (width - transform.width) / 2);
  assert.ok(Math.abs(y - ((height - transform.height) * .46 + sourceY / maskScale * transform.scale)) < 1e-6);
  assert.equal(w, transform.width); assert.ok(Math.abs(h - sourceHeight / maskScale * transform.scale) < 1e-6);
});

test("mobile light uses a bounded cached mask and disables extra light in reduced motion", t => {
  const { engine, light, frames, setReducedMotion } = createHarness(t, { width: 390, height: 844, withPoster: true });
  const mask = light.surfaces.find(surface => surface.width === 960);
  assert.ok(mask.height < 700);
  const count = light.draws.filter(args => args[0] === mask).length;
  setReducedMotion(true); engine.renderAt(8);
  assert.equal(frames.size, 0); assert.equal(light.draws.filter(args => args[0] === mask).length, count);
  setReducedMotion(false);
  assert.equal(frames.size, 1);
});

test("delayed poster load adds fixed light and unmount removes its listener", t => {
  const { engine, poster, canvas, light } = createHarness(t, { withPoster: true, posterComplete: false });
  assert.equal(light.reads, 0);
  poster.complete = true; poster.dispatch("load");
  assert.equal(canvas.dataset.fixedGlyphLight, "ready"); assert.equal(light.reads, 1);
  engine.destroy();
  assert.equal(poster.listenerCount, 0);
  poster.dispatch("load"); assert.equal(light.reads, 1);
});

test("unavailable poster pixels leave every original Matrix layer and controls usable", t => {
  const { engine, canvas, operations } = createHarness(t, { withPoster: true, posterFailure: true });
  assert.equal(canvas.dataset.fixedGlyphLight, "unavailable");
  assert.doesNotThrow(() => { engine.renderAt(4); engine.pause(); engine.resume(); });
  assert.ok(operations().length > 100);
});


test("all fixed cells mutate with local neon cycles using one cached atlas", t => {
  const {engine, light, canvas} = createHarness(t);
  const firstState=engine.getState(), writes=light.atlasWrites, surfaces=light.surfaces.length;
  assert.equal(canvas.dataset.glyphAtlas, "ready");
  assert.ok(firstState.gridCells > 800);
  light.gridDraws.length=0;engine.renderAt(1);
  const first=light.gridDraws.slice();
  light.gridDraws.length=0;engine.renderAt(5);
  const next=light.gridDraws.slice();
  assert.equal(first.length, firstState.gridCells);assert.equal(next.length, first.length);
  let changed=0, brightnessChanged=0;
  for(let i=0;i<first.length;i++) {
    assert.deepEqual(first[i].args.slice(5), next[i].args.slice(5), "Cell coordinates stay fixed");
    if(first[i].args[1]!==next[i].args[1] || first[i].args[2]!==next[i].args[2]) changed++;
    if(first[i].alpha!==next[i].alpha) brightnessChanged++;
  }
  assert.ok(changed > first.length*.9);assert.equal(brightnessChanged, first.length);
  assert.equal(light.atlasWrites,writes);assert.equal(light.surfaces.length,surfaces);
});

test("grid is rate-limited and low-device cache stays bounded without dropping regions", t => {
  const {engine,light}=createHarness(t,{width:390,height:844,hardwareConcurrency:2,deviceMemory:2});
  engine.renderAt(1);const revision=engine.getState().gridRevision;
  engine.renderAt(1.04);assert.equal(engine.getState().gridRevision,revision);
  assert.ok(engine.getState().gridPixels<=360000);
  assert.ok(engine.getState().gridCells>150);
  const cells=light.gridDraws.slice(-engine.getState().gridCells);
  assert.ok(cells.some(cell=>cell.args[6]<100));assert.ok(cells.some(cell=>cell.args[6]>900));
});

test("measured slow frames reduce quality and resize grid without allocating new atlases", t => {
  const {engine,step,light}=createHarness(t,{renderCost:40});
  const initial=engine.getState().quality,writes=light.atlasWrites;
  for(let i=1;i<=50;i++)step(i*80);
  assert.ok(engine.getState().quality<initial);
  assert.equal(engine.getState().qualityTier,"lowest");
  assert.equal(light.atlasWrites,writes);assert.equal(light.surfaces.length,2);
});

test("hidden, paused and reduced states never advance animation on queued ticks", t => {
  const {engine,step,setHidden,setReducedMotion}=createHarness(t);
  for(const stop of [()=>setHidden(true),()=>{setHidden(false);engine.pause();},()=>{engine.resume();setReducedMotion(true);}]) {
    stop();const before=engine.getState();step(800);step(900);
    assert.equal(engine.getState().time,before.time);assert.equal(engine.getState().gridRevision,before.gridRevision);
  }
});


test("one bitmap atlas is reused and released on destruction", async t => {
  const {engine,canvas,bitmaps}=createHarness(t,{bitmapSupport:true});
  await Promise.resolve();
  assert.equal(canvas.dataset.glyphAtlas,"bitmap");assert.equal(bitmaps.length,1);
  engine.renderAt(2);engine.renderAt(3);assert.equal(bitmaps.length,1);
  engine.destroy();assert.equal(bitmaps[0].closed,true);
});

test("an atlas bitmap resolving after destruction is immediately released", async t => {
  const {engine,bitmaps}=createHarness(t,{bitmapSupport:true});
  engine.destroy();await Promise.resolve();assert.equal(bitmaps[0].closed,true);
});

// Baselines captured from the actual current deployment's engine before this change.
// Previous engine SHA256: 4ff26dd019b22f0d8d8b85c86b3f57482eee671b7435b018074de35df21184b0.
// That baseline already halved all generated layers, then removed another third
// of rain only. Counts below compare against THAT engine, never original density.
// Every retained draw was verified against an identical prior draw at eight times
// on six device/quality profiles. Grid/sprite/row traces preserve coordinates,
// sizes, characters, color and alpha. Light fixtures come directly from the prior
// engine, including poster composites, globe arcs, panel scans/bars and waves.
// These committed fixtures are self-contained and need no private QA snapshot.
const snapshotTimes = [0, 1, 3, 9, 17, 45, 120, 603];
const traceHash = value => createHash("sha256").update(JSON.stringify(value)).digest("hex");
const densityLayers = ["rain", "globe", "left", "right"];
const densityFixtures = [
  {
    name: "full desktop", options: {},
    before: [[1254,226,119,510,544],[1254,231,126,510,544],[1254,233,126,510,544],[1254,239,119,510,544],[1254,271,126,510,544],[1254,209,126,510,544],[1254,212,126,510,544],[1254,220,119,510,544]],
    after: [[836,147,84,340,374],[836,151,84,340,374],[836,153,84,340,374],[836,160,77,340,374],[836,184,84,340,374],[836,142,84,340,374],[836,145,84,340,374],[836,147,84,340,374]],
    retainedGlyphTraceHash: "68493dc90d7037ed4a6cec967c9371455b8d3b1260ff1925a2af5f0d72dd5425",
    unchangedLightTraceHash: "f3b1ae3211d4aa7c45bc56982525803dcf6bcde08dc4bd27b3d89d536fd421d6",
  },
  {
    name: "full mobile", options: {"width":390,"height":844},
    before: [[541,118,119,510,544],[541,118,126,510,544],[541,118,126,510,544],[541,116,119,510,544],[541,134,126,510,544],[541,109,126,510,544],[541,110,126,510,544],[541,110,119,510,544]],
    after: [[361,76,84,340,374],[361,77,84,340,374],[361,77,84,340,374],[361,78,77,340,374],[361,91,84,340,374],[361,75,84,340,374],[361,76,84,340,374],[361,74,84,340,374]],
    retainedGlyphTraceHash: "d998472471f7c88903afb098e38ee4739910c78b6d3a279e81a4de252bdf24e1",
    unchangedLightTraceHash: "48da6e6bc656807b02d3e101fa1bb04ebbca133a81f1b02864be2b678cfecadb",
  },
  {
    name: "reduced desktop", options: {"hardwareConcurrency":4,"deviceMemory":4},
    before: [[880,150,55,340,374],[880,153,60,340,374],[880,154,55,340,374],[880,154,60,340,374],[880,184,55,340,374],[880,151,55,340,374],[880,149,60,340,374],[880,144,60,340,374]],
    after: [[587,97,35,238,238],[587,100,40,238,238],[587,101,35,238,238],[587,103,40,238,238],[587,125,35,238,238],[587,103,35,238,238],[587,102,40,238,238],[587,97,40,238,238]],
    retainedGlyphTraceHash: "6df973489c05d2adbff65710417733bab1d1f9df348a9609d485e7c051988c52",
    unchangedLightTraceHash: "5560876cf311e705418ec56e722975104fdda6332ace2ae1eacadda0e95f4cd6",
  },
  {
    name: "lowest desktop", options: {"width":2560,"height":1440,"hardwareConcurrency":2,"deviceMemory":2,"saveData":true},
    before: [[608,105,36,272,306],[608,105,40,272,306],[608,105,40,272,306],[608,113,36,272,306],[608,116,36,272,306],[608,96,40,272,306],[608,97,40,272,306],[608,100,36,272,306]],
    after: [[405,67,24,170,204],[405,68,27,170,204],[405,68,27,170,204],[405,76,23,170,204],[405,78,24,170,204],[405,66,26,170,204],[405,66,26,170,204],[405,67,24,170,204]],
    retainedGlyphTraceHash: "10deed91a945b7af40d6d20ecd15f1d1a051b2d01a71e2db49715c5cb7bcf32a",
    unchangedLightTraceHash: "4745881f3c61407d089162e2d7deaacd0e3022f4c1d85b9bfc50cf046572b93c",
  },
  {
    name: "reduced mobile", options: {"width":390,"height":844,"hardwareConcurrency":4,"deviceMemory":4},
    before: [[390,83,55,340,374],[390,84,60,340,374],[390,87,55,340,374],[390,90,60,340,374],[390,86,55,340,374],[390,70,55,340,374],[390,73,60,340,374],[390,69,60,340,374]],
    after: [[260,54,35,238,238],[260,56,40,238,238],[260,57,35,238,238],[260,61,40,238,238],[260,57,35,238,238],[260,49,35,238,238],[260,49,40,238,238],[260,47,40,238,238]],
    retainedGlyphTraceHash: "58e69167b7b837fd6c3b80037e33e3f37ab32a7f364266836bc467e4f34dbd60",
    unchangedLightTraceHash: "d477c70b32f7ccba99977adec3ee18f423c2226a4633f3118f6eff07eb220680",
  },
  {
    name: "lowest mobile", options: {"width":390,"height":844,"hardwareConcurrency":2,"deviceMemory":2},
    before: [[281,66,36,272,306],[281,66,40,272,306],[281,67,40,272,306],[281,68,36,272,306],[281,69,36,272,306],[281,51,40,272,306],[281,53,40,272,306],[281,59,36,272,306]],
    after: [[187,44,24,170,204],[187,45,27,170,204],[187,45,27,170,204],[187,46,23,170,204],[187,46,24,170,204],[187,36,26,170,204],[187,36,26,170,204],[187,40,24,170,204]],
    retainedGlyphTraceHash: "2eb8d04a3a1e015b49400d922859701dac20373cdc158b51f8f2777a9c0c8fc0",
    unchangedLightTraceHash: "30f80b465d2ae34126546ca9f7530a6ea09f97fa3a099c7fc32150ba3cf1c1ef",
  },
];

function captureScene(harness, time) {
  // Force a fresh cache revision even at t=0, then capture exactly that time.
  harness.engine.renderAt(time + .2);
  harness.light.gridDraws.length = 0;
  harness.light.composites.length = 0;
  harness.light.effects.length = 0;
  harness.engine.renderAt(time);
  return {
    glyphs: {
      grid: harness.light.gridDraws.map(({args, alpha}) => ({args: args.slice(1), alpha})),
      operations: harness.operations(),
    },
    lights: {composites: harness.light.composites.slice(), effects: harness.light.effects.slice()},
  };
}

for (const fixture of densityFixtures) {
  test(`${fixture.name} prior candidate retains approximately two thirds of EACH earlier generated layer`, t => {
    const harness = createHarness(t, {...fixture.options, withPoster: true, engineSource: previousCandidateSource});
    const retained = [], lights = [];
    for (const [index, time] of snapshotTimes.entries()) {
      const snapshot = captureScene(harness, time);
      const counts = [harness.engine.getState().gridCells, ...densityLayers.map(layer =>
        snapshot.glyphs.operations.filter(row => row.layer === layer).reduce((sum, row) =>
          sum + (row.spriteSize ? 1 : Array.from(row.text).length), 0))];
      const before = fixture.before[index];
      assert.deepEqual(counts, fixture.after[index]);
      assert.equal(counts[0], Math.round(before[0] * 2 / 3), "Grid removes a third of its current cells, rounded");
      for (const layer of [1, 2]) {
        assert.ok(Math.abs(counts[layer] / before[layer] - 2 / 3) < .05,
          "Stable identity selection plus clipping stays within five percentage points of two thirds");
      }
      for (const layer of [3, 4]) {
        assert.equal(counts[layer] / 34, Math.round(before[layer] / 34 * 2 / 3),
          "Each panel retains two thirds of current complete rows, rounded, without resizing text");
      }
      retained.push(snapshot.glyphs);
      lights.push(snapshot.lights);
      assert.deepEqual(captureScene(harness, time), snapshot,
        "Repeated rendering preserves exactly the same survivors and lights");
    }
    assert.equal(traceHash(retained), fixture.retainedGlyphTraceHash,
      "Retained glyph positions, sizes, characters, colors and brightness match the prior live engine across time");
    assert.equal(traceHash(lights), fixture.unchangedLightTraceHash,
      "Poster lighting, arcs, scans, bars, waves and composite timing stay identical to the prior live engine");
  });
}

test("fixed grids keep two thirds of the current half-density cells across sizes and tiers", t => {
  for (const [width, height] of [[320, 568], [390, 844], [1440, 1000], [1672, 941], [2560, 1440]]) {
    for (const hardwareConcurrency of [2, 4, 6, 8]) {
      const {engine, canvas} = createHarness(t, {width, height, hardwareConcurrency, deviceMemory: hardwareConcurrency});
      const {quality, transform, gridCells} = engine.getState();
      const spacing = quality < .6 ? 34 : quality < .86 ? 28 : 23;
      const left = Math.max(0, -transform.x / transform.scale), right = Math.min(1487, (width - transform.x) / transform.scale);
      const top = Math.max(0, -transform.y / transform.scale), bottom = Math.min(1058, (height - transform.y) / transform.scale);
      const originalCells = (Math.ceil(bottom / spacing) - Math.floor(top / spacing) + 1)
        * (Math.ceil(right / spacing) - Math.floor(left / spacing) + 1);
      const currentCells = Math.ceil(originalCells / 2);
      assert.equal(gridCells, Math.round(currentCells * 2 / 3));
      assert.equal(canvas.dataset.gridCells, String(gridCells));
      engine.destroy();
    }
  }
});

test("further-thinned scenes remain fixed while paused or in reduced motion on every tier", t => {
  for (const fixture of densityFixtures) {
    const {engine, frames, light, operations, step, setReducedMotion} = createHarness(t, fixture.options);
    engine.renderAt(3);
    engine.pause();
    let before = engine.getState(), visible = operations(), draws = light.gridDraws.length;
    step(800); step(900);
    assert.equal(frames.size, 0);
    assert.deepEqual(operations(), visible);
    assert.equal(engine.getState().gridRevision, before.gridRevision);
    assert.equal(light.gridDraws.length, draws);
    assert.equal(engine.getState().gridCells, fixture.after[0][0]);
    engine.resume(); setReducedMotion(true);
    before = engine.getState(); visible = operations(); draws = light.gridDraws.length;
    step(1000); step(1100);
    assert.equal(frames.size, 0);
    assert.deepEqual(operations(), visible);
    assert.equal(engine.getState().time, before.time);
    assert.equal(engine.getState().gridRevision, before.gridRevision);
    assert.equal(light.gridDraws.length, draws);
    setReducedMotion(false);
    assert.equal(frames.size, 1);
  }
});


test("the v7 stream filter is the only change from its preceding candidate engine", () => {
  assert.equal(source.split(streamRemoval).length, 2, "Exactly one stream filter is present");
  assert.equal(createHash("sha256").update(previousCandidateSource).digest("hex"),
    "db406051f111cbbf255558909d1414713502bc03b20f6e5f5dea16c8cdc08012",
    "All non-rain code and every existing rain calculation stay byte-identical");
});

const streamCounts = [
  [66, 55], [34, 29], [45, 38], [30, 25], [23, 20], [18, 15],
];
for (const [profileIndex, fixture] of densityFixtures.entries()) {
  test(`${fixture.name} v7 drops complete streams while preserving survivor positions and phases`, t => {
    const before = createHarness(t, {...fixture.options, withPoster: true,
      engineSource: previousCandidateSource, traceRainColumns: true});
    const after = createHarness(t, {...fixture.options, withPoster: true,
      engineSource: v7CandidateSource, traceRainColumns: true});
    const [previousCount, retainedCount] = streamCounts[profileIndex];
    const {width, quality} = before.engine.getState();
    assert.equal(Math.max(width < 700 ? 18 : 30, Math.round((width < 700 ? 34 : 66) * quality)),
      previousCount, "The original positioning denominator is unchanged");
    const expectedColumns = Array.from({length: previousCount}, (_, index) => index)
      .filter(index => index % 6 !== 5);
    assert.equal(expectedColumns.length, retainedCount);
    const seenBefore = new Set(), seenAfter = new Set();
    const counts = [];
    for (const [timeIndex, time] of snapshotTimes.entries()) {
      const previous = captureScene(before, time), current = captureScene(after, time);
      const oldRain = previous.glyphs.operations.filter(row => row.layer === "rain");
      const newRain = current.glyphs.operations.filter(row => row.layer === "rain");
      assert.equal(oldRain.length, fixture.after[timeIndex][1], "Exact preceding candidate rain count");
      assert.ok(newRain.length < oldRain.length, "Fewer glyphs at every sampled time");
      assert.deepEqual(newRain, oldRain.filter(row => row.column % 6 !== 5),
        "Whole streams only: every retained glyph keeps its column, position, size, character, color, and alpha");
      for (const row of oldRain) seenBefore.add(row.column);
      for (const row of newRain) seenAfter.add(row.column);
      assert.deepEqual(current.glyphs.grid, previous.glyphs.grid, "Fixed grid is unchanged");
      assert.deepEqual(current.glyphs.operations.filter(row => row.layer !== "rain"),
        previous.glyphs.operations.filter(row => row.layer !== "rain"),
        "Globe and both side-panel traces are unchanged");
      assert.deepEqual(current.lights, previous.lights,
        "Poster lighting, arcs, scans, bars, waves, and composite timing are unchanged");
      assert.deepEqual(captureScene(after, time), current,
        "Repeated renders retain exactly the same columns, survivor phases, and lights");
      counts.push([oldRain.length, newRain.length]);
    }
    assert.deepEqual([...seenBefore].sort((a, b) => a - b),
      Array.from({length: previousCount}, (_, index) => index),
      "Sampled times cover every prior stream, including clipped streams at other times");
    assert.deepEqual([...seenAfter].sort((a, b) => a - b), expectedColumns,
      "All and only the selected streams remain across animation phases");
    t.diagnostic(`${previousCount} -> ${retainedCount} streams; rain glyph counts: ${JSON.stringify(counts)}`);
  });
}


test("halving v7 streams is the only engine change, with glyph phase advanced before either filter", () => {
  assert.equal(source.split(halfStreamRemoval).length, 2, "Exactly one stream-halving filter is present");
  assert.equal(createHash("sha256").update(v7CandidateSource).digest("hex"),
    "e2c18e4d23d32cab745323e188f22d4be7582cf6116d47dc03dfceb4c586484a",
    "Exact v7 runtime: all other layer code, glyph selection, positions, speeds and colors are unchanged");
  assert.ok(source.indexOf("if(retainedGlyph++%3===1)continue;") < source.indexOf("if(i%6===5)continue;"));
  assert.ok(source.indexOf("if(i%6===5)continue;") < source.indexOf("if((i-Math.floor(i/6))%2)continue;"));
});

test("surviving-stream ordinal halves every possible rain tier, rounding odd totals up", () => {
  for (let count = 18; count <= 66; count++) {
    const columns = Array.from({length: count}, (_, index) => index);
    const v7 = columns.filter(index => index % 6 !== 5);
    const current = v7.filter(index => (index - Math.floor(index / 6)) % 2 === 0);
    assert.equal(current.length, Math.ceil(v7.length / 2));
    assert.deepEqual(current, v7.filter((_, ordinal) => ordinal % 2 === 0));
  }
});

for (const [profileIndex, fixture] of densityFixtures.entries()) {
  test(`${fixture.name} v9 baseline halves only v7 rain streams and preserves retained draws`, t => {
    const before = createHarness(t, {...fixture.options, withPoster: true,
      engineSource: v7CandidateSource, traceRainColumns: true});
    const after = createHarness(t, {...fixture.options, withPoster: true, engineSource: v9CandidateSource, traceRainColumns: true});
    const [originalCount, previousCount] = streamCounts[profileIndex];
    const v7Columns = Array.from({length: originalCount}, (_, index) => index)
      .filter(index => index % 6 !== 5);
    const expectedColumns = v7Columns.filter((_, ordinal) => ordinal % 2 === 0);
    assert.equal(v7Columns.length, previousCount);
    assert.equal(expectedColumns.length, Math.ceil(previousCount / 2));
    const retained = new Set(expectedColumns), seenBefore = new Set(), seenAfter = new Set(), counts = [];
    for (const time of snapshotTimes) {
      const previous = captureScene(before, time), current = captureScene(after, time);
      const oldRain = previous.glyphs.operations.filter(row => row.layer === "rain");
      const newRain = current.glyphs.operations.filter(row => row.layer === "rain");
      assert.deepEqual(newRain, oldRain.filter(row => retained.has(row.column)),
        "Each retained stream keeps every glyph position, speed, size, mutation phase, color and brightness");
      assert.ok(newRain.length < oldRain.length, "The selected complete streams are removed at every sampled time");
      for (const row of oldRain) seenBefore.add(row.column);
      for (const row of newRain) seenAfter.add(row.column);
      assert.deepEqual(current.glyphs.grid, previous.glyphs.grid, "No further grid thinning or light changes");
      assert.deepEqual(current.glyphs.operations.filter(row => row.layer !== "rain"),
        previous.glyphs.operations.filter(row => row.layer !== "rain"),
        "Globe and panel glyphs, light phases and coordinates remain identical");
      assert.deepEqual(current.lights, previous.lights, "All existing poster, globe, panel and wave effects remain identical");
      assert.deepEqual(captureScene(after, time), current, "Deterministic retention never flickers");
      counts.push([oldRain.length, newRain.length]);
    }
    assert.deepEqual([...seenBefore].sort((a,b) => a-b), v7Columns);
    assert.deepEqual([...seenAfter].sort((a,b) => a-b), expectedColumns);
    t.diagnostic(`v7 ${previousCount} -> ${expectedColumns.length} streams; rain glyph counts: ${JSON.stringify(counts)}`);
  });
}


test("v10 engine changes only one small deterministic whole-stream filter", () => {
  assert.equal(source.split(smallTrimRemoval).length, 2);
  assert.equal(createHash("sha256").update(v9CandidateSource).digest("hex"),
    "07b5333383c473ea9fe7f499dc6092fd2311d13a4335c4dd6192bc8fbbefc4f3");
  assert.ok(source.indexOf("if(retainedGlyph++%3===1)continue;") < source.indexOf("if(((i-Math.floor(i/6))/2)%6===5)continue;"));
});

for (const [profileIndex, fixture] of densityFixtures.entries()) {
  test(`${fixture.name} v10 trims one in six streams without changing remaining layers`, t => {
    const before=createHarness(t,{...fixture.options,withPoster:true,engineSource:v9CandidateSource,traceRainColumns:true});
    const after=createHarness(t,{...fixture.options,withPoster:true,engineSource:v10CandidateSource,traceRainColumns:true});
    const originalCount=streamCounts[profileIndex][0];
    const previousColumns=Array.from({length:originalCount},(_,i)=>i).filter(i=>i%6!==5&&(i-Math.floor(i/6))%2===0);
    const expected=previousColumns.filter((_,ordinal)=>ordinal%6!==5),seen=new Set();
    for(const time of snapshotTimes){
      const old=captureScene(before,time),next=captureScene(after,time);
      assert.deepEqual(next.glyphs.operations.filter(row=>row.layer==='rain'),
        old.glyphs.operations.filter(row=>row.layer==='rain'&&expected.includes(row.column)));
      for(const row of next.glyphs.operations.filter(row=>row.layer==='rain'))seen.add(row.column);
      assert.deepEqual(next.glyphs.grid,old.glyphs.grid);
      assert.deepEqual(next.glyphs.operations.filter(row=>row.layer!=='rain'),old.glyphs.operations.filter(row=>row.layer!=='rain'));
      assert.deepEqual(next.lights,old.lights,'Active globe, panels and waves keep exact geometry and lighting');
      assert.deepEqual(captureScene(after,time),next);
    }
    assert.deepEqual([...seen].sort((a,b)=>a-b),expected);
    assert.equal(after.light.reads,1,'Original poster light mask still samples once, never per frame');
    assert.equal(after.light.surfaces.length,3,'Original poster mask, glyph atlas and grid cache are preserved');
    t.diagnostic(`v9 ${previousColumns.length} -> v10 ${expected.length} full streams`);
  });
}

// V11 changes only the cached size of falling glyphs. These tests compare with
// a byte-pinned v10 engine, not a formula-only facsimile or a live deployment.
test("v11 changes only a once-built rain size cache and one size lookup", () => {
  assert.equal(source.split(rainSizeCache).length, 2);
  assert.equal(source.split("size=RAIN_SIZES[i]").length, 2);
  assert.equal(createHash("sha256").update(v10CandidateSource).digest("hex"),
    "a2991bae4abb01c53a52090a845be8daeb38963703982c2074215013953da7f2",
    "Removing precisely the size cache and lookup restores every byte of v10");
  assert.ok(source.indexOf(rainSizeCache) < source.indexOf("function mount("),
    "The 66-entry cache is initialized once for the module, not on mount or render");
  assert.doesNotMatch(source, /Math\.random/);
});

const sizeProfiles = [
  ...densityFixtures.map((fixture, i) => ({...fixture, expectedColumns: [24,13,16,11,9,7][i],
    expectedShrunk: [13,6,7,4,3,2][i]})),
  {name: "six-thread desktop", options: {hardwareConcurrency:6,deviceMemory:6}},
  {name: "six-thread mobile", options: {width:390,height:844,hardwareConcurrency:6,deviceMemory:6}},
  {name: "save-data desktop", options: {saveData:true}},
  {name: "save-data mobile", options: {width:390,height:844,saveData:true}},
  {name: "small phone", options: {width:320,height:568}},
  {name: "large desktop", options: {width:2560,height:1440}},
];
const glyphCharacters = Array.from("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウカキツメ天中文字가나다라अकमष");
function scriptGroup(character) {
  if (/[0-9]/.test(character)) return "digits";
  if (/[A-Z]/.test(character)) return "latin";
  if (/[\u30a0-\u30ff]/.test(character)) return "katakana";
  if (/[\u4e00-\u9fff]/.test(character)) return "han";
  if (/[\uac00-\ud7af]/.test(character)) return "hangul";
  return "devanagari";
}
function withoutRainSize(row) {
  const {font,spriteSize,...rest}=row;
  return {...rest,font:font.replace(/[\d.]+px/,'SIZEpx'),spriteShape:spriteSize[0]/spriteSize[1]};
}
for (const profile of sizeProfiles) {
  test(`${profile.name} v11 preserves exact v10 rain columns and every non-size draw property`, t => {
    const before=createHarness(t,{...profile.options,withPoster:true,engineSource:v10CandidateSource,traceRainColumns:true});
    const after=createHarness(t,{...profile.options,withPoster:true,traceRainColumns:true});
    const measured=new Map(),scripts=new Set();
    for (const time of snapshotTimes) {
      const old=captureScene(before,time),next=captureScene(after,time);
      const oldRain=old.glyphs.operations.filter(row=>row.layer==='rain');
      const newRain=next.glyphs.operations.filter(row=>row.layer==='rain');
      assert.deepEqual(newRain.map(withoutRainSize),oldRain.map(withoutRainSize),
        "Exact column, center x/y, order, glyph, mutation phase, color, alpha and spacing are preserved");
      for (const [index,row] of newRain.entries()) {
        const original=parseFloat(oldRain[index].font.split(' ')[1]),size=parseFloat(row.font.split(' ')[1]);
        assert.ok(size<=original,'Never larger than this same stream in v10');
        assert.ok(size>=original*.8,'No stream loses more than 20% of its own size');
        if(original<=9.1)assert.equal(size,original,'Already-small original glyphs are not reduced at all');
        else assert.ok(size>=9.1,'Any reduction stops at 9.1 scene pixels');
        assert.ok(size===original||size===9.1||size===original*.9||size===original*.8,
          'Only the original, 90%, 80%, or the readability guard can be selected');
        assert.equal(row.spriteSize[0],size*32/19,'The actual atlas draw uses the same bounded size');
        assert.equal(row.spriteSize[1],row.spriteSize[0],'Glyph proportions are unchanged');
        if(measured.has(row.column))assert.deepEqual({original,size},measured.get(row.column),
          'A stream never changes size as it moves or changes character');
        measured.set(row.column,{original,size});
        const [,sx,sy]=row.text.split(':').map(Number);
        const glyphIndex=sx/32+(sy/32%Math.ceil(glyphCharacters.length/16))*16;
        scripts.add(scriptGroup(glyphCharacters[glyphIndex]));
      }
      assert.deepEqual(next.glyphs.grid,old.glyphs.grid,'Fixed background code grid is unchanged');
      assert.deepEqual(next.glyphs.operations.filter(row=>row.layer!=='rain'),old.glyphs.operations.filter(row=>row.layer!=='rain'),
        'Globe and side-panel letters retain their exact old sizes and behavior');
      assert.deepEqual(next.lights,old.lights,'Poster, continent, rings, scans, waves and lighting remain untouched');
      assert.deepEqual(captureScene(after,time),next,'Repeated identical times produce identical output');
    }
    if(profile.expectedColumns)assert.equal(measured.size,profile.expectedColumns,'Every v10 stream remains');
    const shrunk=[...measured.values()].filter(row=>row.size<row.original).length;
    if(profile.expectedShrunk)assert.equal(shrunk,profile.expectedShrunk);
    assert.ok(shrunk>0&&shrunk<measured.size,'There are both smaller and original-size streams');
    assert.deepEqual([...scripts].sort(),['digits','latin','katakana','han','hangul','devanagari'].sort(),
      'All six glyph script families obey the same size policy');
    t.diagnostic(`${measured.size} streams: ${shrunk} smaller, ${measured.size-shrunk} unchanged`);
  });
}

test("v11 size cache adds no per-frame hashing, draw calls, surfaces, listeners or animation loops", t => {
  const before=createHarness(t,{withPoster:true,engineSource:v10CandidateSource,traceHashCalls:true});
  const after=createHarness(t,{withPoster:true,traceHashCalls:true});
  const costs=h=>({hashes:h.hashCalls(),draws:h.light.draws.length,surfaces:h.light.surfaces.length,
    atlas:h.light.atlasWrites,posterReads:h.light.reads,frames:h.frames.size,
    listeners:h.windows.listenerCount+h.document.listenerCount+h.media.listenerCount+h.poster.listenerCount,
    observers:h.observers.size});
  for(const time of [0,1,3,120,603]){
    const startBefore=costs(before),startAfter=costs(after);
    before.engine.renderAt(time);after.engine.renderAt(time);
    const endBefore=costs(before),endAfter=costs(after);
    for(const key of Object.keys(endBefore))assert.equal(endAfter[key]-startAfter[key],endBefore[key]-startBefore[key],key);
    for(const key of ['surfaces','atlas','posterReads','frames','listeners','observers'])assert.equal(endAfter[key],endBefore[key],key);
    assert.deepEqual(structuredClone(after.engine.getState()),structuredClone(before.engine.getState()));
  }
  for(const h of [before,after]){
    h.engine.pause();h.setHidden(true);h.setHidden(false);h.setReducedMotion(true);h.setReducedMotion(false);
    assert.equal(h.frames.size,0,'Manual pause survives visibility and motion preference changes');
    const visible=h.operations();h.step(900);assert.deepEqual(h.operations(),visible);
    h.engine.resume();h.engine.resume();assert.equal(h.frames.size,1);
    h.resize(390,844);assert.equal(h.frames.size,1);
    h.engine.destroy();const state=costs(h);
    for(const key of ['frames','listeners','observers'])assert.equal(state[key],0,key);
  }
});

test("stable stream sizes survive adaptive quality changes and repeated desktop/mobile resizing", t => {
  const before=createHarness(t,{engineSource:v10CandidateSource,renderCost:40,traceRainColumns:true});
  const after=createHarness(t,{renderCost:40,traceRainColumns:true});
  const sizes=new Map();
  function compare(){
    const previous=before.operations().filter(row=>row.layer==='rain'),current=after.operations().filter(row=>row.layer==='rain');
    assert.deepEqual(current.map(withoutRainSize),previous.map(withoutRainSize));
    assert.deepEqual(structuredClone(after.engine.getState()),structuredClone(before.engine.getState()));
    for(const row of current){
      if(sizes.has(row.column))assert.equal(row.font,sizes.get(row.column),'Size belongs to the stream, never the quality or viewport');
      sizes.set(row.column,row.font);
    }
    assert.equal(after.frames.size,1);assert.equal(before.frames.size,1);
  }
  compare();
  for(let frame=1;frame<=50;frame++){before.step(frame*80);after.step(frame*80);compare();}
  assert.equal(after.engine.getState().qualityTier,'lowest');
  for(const [width,height] of [[390,844],[320,568],[1672,941],[2560,1440],[390,844]]){
    before.resize(width,height);after.resize(width,height);
    for(const time of snapshotTimes){before.engine.renderAt(time);after.engine.renderAt(time);compare();}
  }
});



for(const [width,height] of [[320,568],[390,844],[430,932]]){
  for(const hardwareConcurrency of [2,4,6,8]){
    test(`${width}×${height} portrait at ${hardwareConcurrency} threads keeps the overall visible minimum`, t => {
      const options={width,height,hardwareConcurrency,deviceMemory:hardwareConcurrency,traceRainColumns:true};
      const before=createHarness(t,{...options,engineSource:v10CandidateSource});
      const after=createHarness(t,options);
      const seen=new Map();
      let previousMinimum=Infinity,currentMinimum=Infinity;
      // Include the short interval where only column 21 is visible. Its own
      // size can shrink, while the animation's overall smallest glyphs stay put.
      for(const time of [4.8,48,48.5,49,...snapshotTimes]){
        before.engine.renderAt(time);after.engine.renderAt(time);
        const visible=row=>row.layer==='rain'&&row.x>=0&&row.x<=width&&row.y>=0&&row.y<=height;
        const original=before.operations().filter(visible),current=after.operations().filter(visible);
        assert.deepEqual(current.map(withoutRainSize),original.map(withoutRainSize));
        if(!current.length)continue;
        const sceneSize=row=>parseFloat(row.font.split(' ')[1]);
        for(const [index,row] of current.entries()){
          const originalSize=sceneSize(original[index]),size=sceneSize(row);
          assert.ok(size<=originalSize);
          if(originalSize<=9.1)assert.equal(size,originalSize,'Protect every already-small visible stream');
          else assert.ok(size>=9.1);
          seen.set(row.column,{before:originalSize,after:size});
          previousMinimum=Math.min(previousMinimum,originalSize);
          currentMinimum=Math.min(currentMinimum,size);
        }
      }
      assert.equal(currentMinimum,previousMinimum,'The smallest visible size across the animation is unchanged');
      const scale=after.engine.getState().transform.scale;
      assert.equal(scale,Math.max(width/1487,height/1058));
      t.diagnostic(`Overall minimum ${previousMinimum*scale} CSS px unchanged; visible columns ${JSON.stringify([...seen])}`);
    });
  }
}

test("full portrait mobile visibly shrinks one larger stream and protects the three smaller streams",t=>{
  const before=createHarness(t,{width:390,height:844,engineSource:v10CandidateSource,traceRainColumns:true});
  const after=createHarness(t,{width:390,height:844,traceRainColumns:true});
  before.engine.renderAt(4.8);after.engine.renderAt(4.8);
  const visible=row=>row.layer==='rain'&&row.x>=0&&row.x<=390&&row.y>=0&&row.y<=844;
  const original=before.operations().filter(visible),current=after.operations().filter(visible);
  assert.deepEqual([...new Set(current.map(row=>row.column))],[14,16,19,21]);
  for(const [index,row] of current.entries()){
    if(row.column===21){
      assert.equal(parseFloat(row.font.split(' ')[1]),9.1);
      assert.ok(row.spriteSize[0]<original[index].spriteSize[0]);
    }else assert.deepEqual(row,original[index]);
  }
  t.diagnostic('Column 21: 9.652→9.1 scene px (about 5.7% smaller), or 7.700→7.259 nominal CSS px at 390×844.');
});
