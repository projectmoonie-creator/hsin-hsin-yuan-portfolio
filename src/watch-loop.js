const LOOP_SELECTOR = "[data-watch-loop]";
const TRACK_SELECTOR = "[data-watch-loop-track]";
const SEQUENCE_SELECTOR = "[data-watch-loop-sequence]";
const FOCUSABLE_SELECTOR = "a[href], button, input, select, textarea, [tabindex]";

export function watchLoopMotionAllowed({ reducedMotion, narrowViewport, finePointer }) {
  return !reducedMotion && !narrowViewport && finePointer;
}

function addListener(target, type, listener, options) {
  target?.addEventListener?.(type, listener, options);
  return () => target?.removeEventListener?.(type, listener, options);
}

function addMediaListener(query, listener) {
  if (query?.addEventListener) return addListener(query, "change", listener);
  query?.addListener?.(listener);
  return () => query?.removeListener?.(listener);
}

function positiveModulo(value, divisor) {
  return ((value % divisor) + divisor) % divisor;
}

function createWatchLoopController(loop, root, view) {
  const viewport = loop.querySelector(".watch-loop-viewport");
  const track = loop.querySelector(TRACK_SELECTOR);
  const sequence = loop.querySelector(SEQUENCE_SELECTOR);
  if (!viewport || !track || !sequence) return null;

  const page = root.nodeType === 9 ? root : root.ownerDocument || view.document;
  const manualOverflowX = viewport.style.overflowX;
  const configuredSpeed = Number(loop.dataset.speed || 28);
  const speed = Number.isFinite(configuredSpeed) ? configuredSpeed : 28;
  const pauseReasons = new Set();
  let animationFrame = 0;
  let enabled = false;
  let intersectionObserver = null;
  let isIntersecting = false;
  let lastTime = null;
  let offset = 0;
  let pageVisible = !page?.hidden;
  let resizeObserver = null;
  let sequenceWidth = 0;
  let removeInteractionListeners = [];

  function removeCopies() {
    const copies = Array.from(track.querySelectorAll(SEQUENCE_SELECTOR));
    copies.slice(1).forEach((copy) => copy.remove());
  }

  function restoreManualRail() {
    removeCopies();
    track.style.transform = "";
    viewport.style.overflowX = manualOverflowX;
    sequenceWidth = 0;
    offset = 0;
  }

  function makeCloneInert(clone) {
    clone.setAttribute("aria-hidden", "true");
    clone.setAttribute("inert", "");
    clone.inert = true;
    clone.querySelectorAll(FOCUSABLE_SELECTOR).forEach((control) => {
      control.tabIndex = -1;
      control.setAttribute?.("tabindex", "-1");
    });
  }

  function syncLoopCopies() {
    removeCopies();
    sequenceWidth = sequence.getBoundingClientRect().width;
    if (!(sequenceWidth > 0)) {
      track.style.transform = "";
      refreshPlayback();
      return;
    }

    offset = positiveModulo(offset, sequenceWidth);
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;

    const requiredWidth = viewport.clientWidth + sequenceWidth;
    let renderedWidth = sequenceWidth;
    while (renderedWidth < requiredWidth) {
      const clone = sequence.cloneNode(true);
      makeCloneInert(clone);
      track.append(clone);
      renderedWidth += sequenceWidth;
    }
    refreshPlayback();
  }

  function canPlay() {
    return enabled && isIntersecting && pageVisible && pauseReasons.size === 0 && sequenceWidth > 0;
  }

  function tick(time) {
    animationFrame = 0;
    if (!canPlay()) return;

    const deltaSeconds = lastTime === null ? 0 : Math.min(Math.max((time - lastTime) / 1000, 0), 0.08);
    lastTime = time;
    offset = positiveModulo(offset + speed * deltaSeconds, sequenceWidth);
    track.style.transform = `translate3d(${-offset}px, 0, 0)`;
    animationFrame = view.requestAnimationFrame(tick);
  }

  function startLoop() {
    if (animationFrame || !canPlay()) return;
    lastTime = null;
    animationFrame = view.requestAnimationFrame(tick);
  }

  function stopLoop() {
    if (animationFrame) view.cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    lastTime = null;
  }

  function refreshPlayback() {
    if (canPlay()) startLoop();
    else stopLoop();
  }

  function pauseFor(reason) {
    pauseReasons.add(reason);
    refreshPlayback();
  }

  function resumeFrom(reason) {
    pauseReasons.delete(reason);
    refreshPlayback();
  }

  function addInteractionListeners() {
    const removers = [
      addListener(loop, "mouseenter", () => pauseFor("hover")),
      addListener(loop, "mouseleave", () => resumeFrom("hover")),
      addListener(loop, "focusin", () => pauseFor("focus")),
      addListener(loop, "focusout", (event) => {
        if (!event.relatedTarget || !loop.contains(event.relatedTarget)) resumeFrom("focus");
      }),
      addListener(viewport, "pointerdown", () => pauseFor("pointer")),
      addListener(view, "pointerup", () => resumeFrom("pointer")),
      addListener(view, "pointercancel", () => resumeFrom("pointer")),
      addListener(page, "visibilitychange", () => {
        pageVisible = !page.hidden;
        refreshPlayback();
      }),
    ];
    removeInteractionListeners = removers;

    const activeLoop = page?.activeElement?.closest?.(LOOP_SELECTOR);
    if (activeLoop === loop) pauseReasons.add("focus");
  }

  function enable() {
    if (enabled) return;
    enabled = true;
    pageVisible = !page?.hidden;
    viewport.scrollLeft = 0;
    viewport.style.overflowX = "hidden";
    addInteractionListeners();
    syncLoopCopies();

    resizeObserver = view.ResizeObserver ? new view.ResizeObserver(syncLoopCopies) : null;
    resizeObserver?.observe(viewport);

    if (view.IntersectionObserver) {
      isIntersecting = false;
      intersectionObserver = new view.IntersectionObserver(
        (entries) => {
          isIntersecting = entries.some((entry) => entry.isIntersecting);
          refreshPlayback();
        },
        { rootMargin: "20% 0px", threshold: 0.01 },
      );
      intersectionObserver.observe(loop);
    } else {
      isIntersecting = true;
    }

    refreshPlayback();
  }

  function disable() {
    if (!enabled) return;
    enabled = false;
    stopLoop();
    intersectionObserver?.disconnect();
    resizeObserver?.disconnect();
    intersectionObserver = null;
    resizeObserver = null;
    removeInteractionListeners.forEach((remove) => remove());
    removeInteractionListeners = [];
    pauseReasons.clear();
    isIntersecting = false;
    restoreManualRail();
  }

  return { disable, enable };
}

export function initWatchLoops(root = document, view = window) {
  const reducedMotionQuery = view.matchMedia("(prefers-reduced-motion: reduce)");
  const narrowViewportQuery = view.matchMedia("(max-width: 820px)");
  const finePointerQuery = view.matchMedia("(hover: hover) and (pointer: fine)");
  const controllers = Array.from(root.querySelectorAll(LOOP_SELECTOR))
    .map((loop) => createWatchLoopController(loop, root, view))
    .filter(Boolean);

  function applyMotionPolicy() {
    const allowed = watchLoopMotionAllowed({
      reducedMotion: reducedMotionQuery.matches,
      narrowViewport: narrowViewportQuery.matches,
      finePointer: finePointerQuery.matches,
    });
    controllers.forEach((controller) => (allowed ? controller.enable() : controller.disable()));
  }

  const removeMediaListeners = [
    addMediaListener(reducedMotionQuery, applyMotionPolicy),
    addMediaListener(narrowViewportQuery, applyMotionPolicy),
    addMediaListener(finePointerQuery, applyMotionPolicy),
  ];

  let destroyed = false;
  const destroy = () => {
    if (destroyed) return;
    destroyed = true;
    controllers.forEach((controller) => controller.disable());
    removeMediaListeners.forEach((remove) => remove());
    removePageHide();
  };
  const removePageHide = addListener(view, "pagehide", destroy, { once: true });

  applyMotionPolicy();
  return destroy;
}
