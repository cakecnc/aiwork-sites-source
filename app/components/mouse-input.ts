/** Ephemeral input evidence, installed after hydration. No device guesses or storage. */
export function trackMouseInput(
  win: Window,
  doc: Document,
  onMove: (event: PointerEvent) => void,
  onReset: () => void,
) {
  const root = doc.documentElement;
  const touchPointers = new Set<number>();
  const fine = win.matchMedia("(hover: hover) and (pointer: fine)");
  let lastTouch = -Infinity;
  let mouse = false;
  let pen = false;
  const options = { capture: true, passive: true };
  const reset = () => {
    if (!mouse && !pen && root.dataset.aiworkInput === "off") return;
    mouse = false;
    pen = false;
    root.dataset.aiworkInput = "off";
    onReset();
  };
  const pointer = (event: PointerEvent) => {
    if (!event.isTrusted) return;
    // Preserve an already supported hovering pen, but never infer new pen
    // support from contact or enable the mouse-only fallback for a coarse pen.
    if (event.pointerType === "pen" && fine.matches && !doc.hidden && !touchPointers.size &&
      (event.type === "pointerover" || event.type === "pointermove") && !event.buttons && !event.pressure) {
      mouse = false; pen = true;
      if (root.dataset.aiworkInput !== "pen") root.dataset.aiworkInput = "pen";
      onMove(event);
      return;
    }
    if (event.pointerType !== "mouse") {
      if (event.pointerType === "touch") {
        lastTouch = win.performance.now();
        if (event.type === "pointerdown") touchPointers.add(event.pointerId);
        if (event.type === "pointerup" || event.type === "pointercancel") touchPointers.delete(event.pointerId);
      }
      reset();
      return;
    }
    if (event.type === "pointercancel") { reset(); return; }
    // Pointer Events avoid ordinary touch-generated mouse compatibility events.
    // Also reject browsers' explicitly touch-derived events and the short tail
    // after a touch gesture, without treating a hybrid's media query as truth.
    const capabilities = (event as PointerEvent & { sourceCapabilities?: { firesTouchEvents?: boolean } | null }).sourceCapabilities;
    if (capabilities?.firesTouchEvents) { lastTouch = win.performance.now(); reset(); return; }
    if (doc.hidden || touchPointers.size || win.performance.now() - lastTouch < 500) return;
    if (event.type === "pointerup") return;
    mouse = true;
    pen = false;
    if (root.dataset.aiworkInput !== "mouse") root.dataset.aiworkInput = "mouse";
    onMove(event);
  };
  const leave = (event: PointerEvent) => {
    if (!event.isTrusted || event.target !== root) return;
    if (event.pointerType === "touch") {
      touchPointers.delete(event.pointerId);
      lastTouch = win.performance.now();
    }
    reset();
  };
  const blur = () => { touchPointers.clear(); reset(); };
  const visibility = () => { if (doc.hidden) blur(); };
  const keyboard = (event: KeyboardEvent) => { if (event.isTrusted) reset(); };
  const capability = () => { if (pen && !fine.matches) reset(); };
  const events = ["pointerover", "pointermove", "pointerdown", "pointerup", "pointercancel"] as const;
  for (const name of events) win.addEventListener(name, pointer, options);
  root.addEventListener("pointerleave", leave, options);
  win.addEventListener("blur", blur);
  doc.addEventListener("visibilitychange", visibility);
  win.addEventListener("keydown", keyboard, options);
  fine.addEventListener("change", capability);
  return {
    hasHoverPointer: () => mouse || (pen && fine.matches),
    dispose() {
      for (const name of events) win.removeEventListener(name, pointer, true);
      root.removeEventListener("pointerleave", leave, true);
      win.removeEventListener("blur", blur);
      doc.removeEventListener("visibilitychange", visibility);
      win.removeEventListener("keydown", keyboard, true);
      fine.removeEventListener("change", capability);
      touchPointers.clear();
      delete root.dataset.aiworkInput;
    },
  };
}
