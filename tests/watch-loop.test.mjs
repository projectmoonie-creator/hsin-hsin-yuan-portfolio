import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

import { initWatchLoops, watchLoopMotionAllowed } from "../src/watch-loop.js";

class FakeEventTarget {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    const listeners = this.listeners.get(type) || new Set();
    listeners.add(listener);
    this.listeners.set(type, listeners);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type, detail = {}) {
    const event = { type, target: this, ...detail };
    this.listeners.get(type)?.forEach((listener) => listener(event));
  }
}

class FakeMediaQuery extends FakeEventTarget {
  constructor(matches) {
    super();
    this.matches = matches;
  }

  setMatches(matches) {
    this.matches = matches;
    this.dispatch("change", { matches });
  }
}

class FakeNode extends FakeEventTarget {
  constructor(kind, { width = 0, clientWidth = 0, speed = "28" } = {}) {
    super();
    this.kind = kind;
    this.width = width;
    this.clientWidth = clientWidth;
    this.dataset = kind === "loop" ? { speed } : {};
    this.style = { overflowX: "", transform: "" };
    this.scrollLeft = 0;
    this.children = [];
    this.parentNode = null;
    this.attributes = new Map();
    this.inert = false;
    this.links = kind === "sequence" ? [{ tabIndex: 0 }, { tabIndex: 0 }] : [];
  }

  append(node) {
    node.parentNode = this;
    this.children.push(node);
  }

  remove() {
    if (!this.parentNode) return;
    this.parentNode.children = this.parentNode.children.filter((child) => child !== this);
    this.parentNode = null;
  }

  cloneNode() {
    return new FakeNode("sequence", { width: this.width });
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  getAttribute(name) {
    return this.attributes.get(name) ?? null;
  }

  getBoundingClientRect() {
    return { width: this.width };
  }

  contains(node) {
    return node === this || node?.loop === this;
  }

  closest(selector) {
    if (selector === "[data-watch-loop]") return this.loop || (this.kind === "loop" ? this : null);
    return null;
  }

  querySelector(selector) {
    if (this.kind !== "loop") return null;
    if (selector === ".watch-loop-viewport") return this.viewport;
    if (selector === "[data-watch-loop-track]") return this.track;
    if (selector === "[data-watch-loop-sequence]") return this.sequence;
    return null;
  }

  querySelectorAll(selector) {
    if (this.kind === "track" && selector === "[data-watch-loop-sequence]") {
      return this.children.slice();
    }
    if (this.kind === "sequence" && selector.includes("[href]")) return this.links;
    return [];
  }
}

function createEnvironment({
  reducedMotion = false,
  narrowViewport = false,
  finePointer = true,
  viewportWidth = 350,
  sequenceWidth = 100,
  speed = "28",
} = {}) {
  const viewport = new FakeNode("viewport", { clientWidth: viewportWidth });
  const track = new FakeNode("track");
  const sequence = new FakeNode("sequence", { width: sequenceWidth });
  const loop = new FakeNode("loop", { speed });
  track.append(sequence);
  loop.viewport = viewport;
  loop.track = track;
  loop.sequence = sequence;

  const root = new FakeEventTarget();
  root.hidden = false;
  root.activeElement = null;
  root.nodeType = 9;
  root.querySelectorAll = (selector) => (selector === "[data-watch-loop]" ? [loop] : []);

  const reducedQuery = new FakeMediaQuery(reducedMotion);
  const narrowQuery = new FakeMediaQuery(narrowViewport);
  const finePointerQuery = new FakeMediaQuery(finePointer);
  const rafCallbacks = new Map();
  let rafId = 0;
  const intersectionObservers = [];
  const resizeObservers = [];

  class FakeIntersectionObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      intersectionObservers.push(this);
    }

    observe(node) {
      this.node = node;
    }

    disconnect() {
      this.disconnected = true;
    }

    trigger(isIntersecting) {
      this.callback([{ target: this.node, isIntersecting }]);
    }
  }

  class FakeResizeObserver {
    constructor(callback) {
      this.callback = callback;
      this.disconnected = false;
      resizeObservers.push(this);
    }

    observe(node) {
      this.node = node;
    }

    disconnect() {
      this.disconnected = true;
    }
  }

  const view = new FakeEventTarget();
  view.matchMedia = (query) => {
    if (query.includes("reduced-motion")) return reducedQuery;
    if (query.includes("max-width")) return narrowQuery;
    if (query.includes("hover: hover") && query.includes("pointer: fine")) return finePointerQuery;
    throw new Error(`Unexpected media query: ${query}`);
  };
  view.requestAnimationFrame = (callback) => {
    const id = ++rafId;
    rafCallbacks.set(id, callback);
    return id;
  };
  view.cancelAnimationFrame = (id) => rafCallbacks.delete(id);
  view.IntersectionObserver = FakeIntersectionObserver;
  view.ResizeObserver = FakeResizeObserver;

  return {
    intersectionObservers,
    finePointerQuery,
    loop,
    narrowQuery,
    pendingFrames: () => rafCallbacks.size,
    reducedQuery,
    resizeObservers,
    root,
    sequence,
    track,
    view,
    viewport,
    flushFrame(time) {
      const callbacks = Array.from(rafCallbacks.values());
      rafCallbacks.clear();
      callbacks.forEach((callback) => callback(time));
    },
  };
}

function offsetFromTransform(transform) {
  const match = /translate3d\((-?[\d.]+)px/.exec(transform);
  return match ? Math.abs(Number(match[1])) : 0;
}

test("watch loop auto motion requires a wide, motion-safe fine pointer", () => {
  assert.equal(watchLoopMotionAllowed({ reducedMotion: false, narrowViewport: false, finePointer: true }), true);
  assert.equal(watchLoopMotionAllowed({ reducedMotion: true, narrowViewport: false, finePointer: true }), false);
  assert.equal(watchLoopMotionAllowed({ reducedMotion: false, narrowViewport: true, finePointer: true }), false);
  assert.equal(watchLoopMotionAllowed({ reducedMotion: false, narrowViewport: false, finePointer: false }), false);

  const source = readFileSync(new URL("../src/watch-loop.js", import.meta.url), "utf8");
  assert.match(source, /max-width:\s*820px/);
  assert.match(source, /hover:\s*hover/);
  assert.match(source, /pointer:\s*fine/);
});

test("mobile, reduced-motion, and touch-only modes leave the original sequence manual", () => {
  for (const settings of [{ narrowViewport: true }, { reducedMotion: true }, { finePointer: false }]) {
    const environment = createEnvironment(settings);
    initWatchLoops(environment.root, environment.view);

    assert.equal(environment.track.children.length, 1);
    assert.equal(environment.track.style.transform, "");
    assert.equal(environment.viewport.style.overflowX, "");
    assert.equal(environment.pendingFrames(), 0);
  }
});

test("active autoplay owns horizontal movement and disabling restores the manual overflow rail", () => {
  const environment = createEnvironment();
  environment.viewport.scrollLeft = 96;

  initWatchLoops(environment.root, environment.view);

  assert.equal(environment.viewport.style.overflowX, "hidden");
  assert.equal(environment.viewport.scrollLeft, 0);
  assert.ok(environment.track.children.length > 1);

  environment.finePointerQuery.setMatches(false);
  assert.equal(environment.viewport.style.overflowX, "");
  assert.equal(environment.track.children.length, 1);
  assert.equal(environment.track.style.transform, "");
  assert.equal(environment.pendingFrames(), 0);
});

test("desktop enhancement creates inert copies wide enough to wrap without a blank", () => {
  const environment = createEnvironment({ viewportWidth: 350, sequenceWidth: 100, speed: "1000" });
  initWatchLoops(environment.root, environment.view);

  assert.ok(environment.track.children.length * 100 >= 450);
  environment.track.children.slice(1).forEach((clone) => {
    assert.equal(clone.getAttribute("aria-hidden"), "true");
    assert.equal(clone.inert, true);
    assert.deepEqual(clone.links.map((link) => link.tabIndex), [-1, -1]);
  });

  environment.intersectionObservers[0].trigger(true);
  environment.flushFrame(0);
  environment.flushFrame(100);
  assert.equal(offsetFromTransform(environment.track.style.transform), 80);
  environment.flushFrame(200);
  assert.equal(offsetFromTransform(environment.track.style.transform), 60);
  assert.ok(offsetFromTransform(environment.track.style.transform) < 100);
});

test("hover, focus, pointer, viewport, and page visibility pause and resume motion", () => {
  const environment = createEnvironment();
  initWatchLoops(environment.root, environment.view);
  const observer = environment.intersectionObservers[0];
  observer.trigger(true);
  assert.equal(environment.pendingFrames(), 1);

  environment.flushFrame(0);
  environment.flushFrame(100);
  const movingOffset = offsetFromTransform(environment.track.style.transform);
  assert.ok(movingOffset > 0);

  environment.loop.dispatch("mouseenter");
  assert.equal(environment.pendingFrames(), 0);
  environment.loop.dispatch("mouseleave");
  assert.equal(environment.pendingFrames(), 1);

  environment.loop.dispatch("focusin");
  assert.equal(environment.pendingFrames(), 0);
  environment.loop.dispatch("focusout", { relatedTarget: null });
  assert.equal(environment.pendingFrames(), 1);

  environment.viewport.dispatch("pointerdown");
  assert.equal(environment.pendingFrames(), 0);
  environment.view.dispatch("pointerup");
  assert.equal(environment.pendingFrames(), 1);

  environment.root.hidden = true;
  environment.root.dispatch("visibilitychange");
  assert.equal(environment.pendingFrames(), 0);
  environment.root.hidden = false;
  environment.root.dispatch("visibilitychange");
  assert.equal(environment.pendingFrames(), 1);

  observer.trigger(false);
  assert.equal(environment.pendingFrames(), 0);
  observer.trigger(true);
  assert.equal(environment.pendingFrames(), 1);
});

test("switching to a narrow viewport restores the manual rail", () => {
  const environment = createEnvironment();
  initWatchLoops(environment.root, environment.view);
  assert.ok(environment.track.children.length > 1);

  environment.narrowQuery.setMatches(true);
  assert.equal(environment.track.children.length, 1);
  assert.equal(environment.track.style.transform, "");
  assert.equal(environment.viewport.style.overflowX, "");
  assert.equal(environment.pendingFrames(), 0);

  environment.narrowQuery.setMatches(false);
  assert.ok(environment.track.children.length > 1);
});

test("a later non-zero layout measurement can start the visible loop", () => {
  const environment = createEnvironment({ sequenceWidth: 0 });
  initWatchLoops(environment.root, environment.view);
  environment.intersectionObservers[0].trigger(true);
  assert.equal(environment.pendingFrames(), 0);

  environment.sequence.width = 100;
  environment.resizeObservers[0].callback();
  assert.ok(environment.track.children.length > 1);
  assert.equal(environment.pendingFrames(), 1);
});

test("main runtime keeps core controls without retired ambient libraries", () => {
  const mainSource = readFileSync(new URL("../src/main.js", import.meta.url), "utf8");
  const packageSource = readFileSync(new URL("../package.json", import.meta.url), "utf8");
  const lockSource = readFileSync(new URL("../package-lock.json", import.meta.url), "utf8");

  assert.match(mainSource, /initWatchLoops/);
  assert.match(mainSource, /data-showreel-play/);
  assert.ok(
    mainSource.indexOf("showreelVideo.controls = false;") < mainSource.indexOf("function playShowreel"),
    "enhanced mode should remove hidden native controls before wiring the custom player",
  );
  assert.match(mainSource, /data-contact-form/);
  assert.doesNotMatch(mainSource, /anime|ambient-background|initAmbientBackground|data-scroll-stack|GuidingLight|edge-glow/i);
  assert.doesNotMatch(packageSource, /"(?:animejs|ogl)"/);
  assert.doesNotMatch(lockSource, /node_modules\/(?:animejs|ogl)/);
  assert.match(packageSource, /"media:validate"/);
});
