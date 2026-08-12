import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";

import * as reelSelection from "../src/archive-reel-selection.js";

const mainSource = readFileSync(join(process.cwd(), "src/main.js"), "utf8")
  .replace(
    /^import \{ (?:selectClosestVisibleArchiveReel|selectClosestVisibleReel) \} from "\.\/archive-reel-selection\.js";\n\n/,
    "",
  );

class EventHub {
  constructor() {
    this.listeners = new Map();
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }

  dispatch(type, detail = {}) {
    const event = {
      type,
      currentTarget: this,
      target: this,
      defaultPrevented: false,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...detail,
    };
    for (const listener of [...(this.listeners.get(type) || [])]) {
      listener(event);
    }
    return event;
  }

  listenerCount(type) {
    return this.listeners.get(type)?.size || 0;
  }
}

class FakeClassList {
  constructor() {
    this.values = new Set();
  }

  add(value) {
    this.values.add(value);
  }

  remove(value) {
    this.values.delete(value);
  }

  contains(value) {
    return this.values.has(value);
  }
}

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, reject, resolve };
}

class FakeVideo extends EventHub {
  constructor(name) {
    super();
    this.name = name;
    this.classList = new FakeClassList();
    this.currentTime = 9;
    this.muted = false;
    this.paused = true;
    this.pauseCalls = 0;
    this.playRequests = [];
    this.preload = "none";
    this.loadCalls = 0;
    this.rect = { left: 0, right: 100, top: 0, bottom: 100 };
    this.panel = null;
    this.media = null;
    this.archiveCard = null;
    this.archiveMedia = null;
  }

  getBoundingClientRect() {
    return this.rect;
  }

  setRect(rect) {
    this.rect = rect;
  }

  pause() {
    this.pauseCalls += 1;
    this.paused = true;
  }

  play() {
    const request = deferred();
    this.playRequests.push(request);
    this.paused = false;
    return request.promise;
  }

  load() {
    this.loadCalls += 1;
  }

  closest(selector) {
    if (selector === ".work-panel") return this.panel;
    if (selector === ".media-frame") return this.media;
    if (selector === ".archive-card") return this.archiveCard;
    if (selector === ".archive-card-media") return this.archiveMedia;
    return null;
  }
}

class FakePanel extends EventHub {
  constructor(id, video) {
    super();
    this.id = id;
    this.video = video;
  }

  contains(target) {
    return target === this || target === this.video || target === this.video.media;
  }

  querySelector(selector) {
    return selector === "[data-featured-reel-video]" ? this.video : null;
  }
}

class FakeMediaFrame extends EventHub {
  constructor(video, linked = true) {
    super();
    this.classList = new FakeClassList();
    this.video = video;
    this.linked = linked;
  }

  matches(selector) {
    return selector === ".media-frame-link" && this.linked;
  }

  querySelector(selector) {
    return selector === "[data-featured-reel-video]" ? this.video : null;
  }
}

class FakeArchiveCard extends EventHub {
  constructor(video, linked = true) {
    super();
    this.video = video;
    this.linked = linked;
    this.media = null;
  }

  contains(target) {
    return target === this || target === this.video || target === this.media;
  }
}

class FakeArchiveMedia extends EventHub {
  constructor(video, card) {
    super();
    this.video = video;
    this.card = card;
  }

  closest(selector) {
    return selector === "a[href]" && this.card.linked ? this.card : null;
  }
}

class FakeScreeningCard {
  constructor(targetId) {
    this.targetId = targetId;
  }

  closest(selector) {
    return selector === '.watch-loop-card[href^="#"]' ? this : null;
  }

  getAttribute(name) {
    return name === "href" ? `#${this.targetId}` : null;
  }
}

class FakeImage extends EventHub {
  constructor(complete = false) {
    super();
    this.complete = complete;
    this.naturalWidth = complete ? 1200 : 0;
  }
}

class FakeClock {
  constructor() {
    this.now = 0;
    this.nextId = 1;
    this.timers = new Map();
  }

  setTimeout(callback, delay) {
    const id = this.nextId;
    this.nextId += 1;
    this.timers.set(id, { callback, due: this.now + Number(delay) });
    return id;
  }

  clearTimeout(id) {
    this.timers.delete(id);
  }

  advance(milliseconds) {
    const target = this.now + milliseconds;
    while (true) {
      const next = [...this.timers.entries()]
        .filter(([, timer]) => timer.due <= target)
        .sort((left, right) => left[1].due - right[1].due || left[0] - right[0])[0];
      if (!next) break;
      const [id, timer] = next;
      this.timers.delete(id);
      this.now = timer.due;
      timer.callback();
    }
    this.now = target;
  }

  pendingCount() {
    return this.timers.size;
  }
}

function createRuntime(videoCount = 1, options = {}) {
  const videos = Array.from({ length: videoCount }, (_, index) => new FakeVideo(`video-${index + 1}`));
  const panels = videos.map((video, index) => new FakePanel(`work-${index + 1}`, video));
  const mediaFrames = videos.map((video, index) => new FakeMediaFrame(
    video,
    options.linkedVideos?.[index] ?? true,
  ));
  const screeningCards = panels.map((panel) => new FakeScreeningCard(panel.id));
  const heroImage = new FakeImage(Boolean(options.heroComplete));
  videos.forEach((video, index) => {
    video.panel = panels[index];
    video.media = mediaFrames[index];
  });
  const archiveVideos = Array.from(
    { length: options.archiveCount || 0 },
    (_, index) => new FakeVideo(`archive-video-${index + 1}`),
  );
  const archiveCards = archiveVideos.map((video, index) => new FakeArchiveCard(
    video,
    options.archiveLinked?.[index] ?? true,
  ));
  const archiveMedia = archiveVideos.map((video, index) => {
    const media = new FakeArchiveMedia(video, archiveCards[index]);
    archiveCards[index].media = media;
    video.archiveCard = archiveCards[index];
    video.archiveMedia = media;
    return media;
  });
  const clock = new FakeClock();
  const observers = [];
  const animationFrames = new Map();
  const mediaQueries = new Map();
  let nextAnimationFrameId = 1;

  class FakeIntersectionObserver {
    constructor(callback, options) {
      this.callback = callback;
      this.options = options;
      this.targets = new Set();
      this.observeCounts = new Map();
      this.disconnectCalls = 0;
      observers.push(this);
    }

    observe(target) {
      this.targets.add(target);
      this.observeCounts.set(target, (this.observeCounts.get(target) || 0) + 1);
    }

    disconnect() {
      this.disconnectCalls += 1;
      this.targets.clear();
    }

    emit(entries) {
      const eligibleEntries = entries.filter((entry) => this.targets.has(entry.target));
      if (eligibleEntries.length) this.callback(eligibleEntries);
    }
  }

  const document = new EventHub();
  document.activeElement = null;
  document.readyState = options.readyState || "loading";
  document.visibilityState = "visible";
  document.querySelector = (selector) =>
    selector === ".hero-media-image" ? heroImage : null;
  document.getElementById = (id) => panels.find((panel) => panel.id === id) || null;
  document.querySelectorAll = (selector) => {
    if (selector === "[data-featured-reel-video]") return videos;
    if (selector === "[data-archive-reel-video]") return archiveVideos;
    return [];
  };

  const window = new EventHub();
  window.history = {
    scrollRestoration: "auto",
    replaceState() {},
  };
  window.location = { hash: "", pathname: "/en/", search: "" };
  window.innerWidth = options.width || (options.mobile ? 390 : 1440);
  window.innerHeight = options.height || (options.mobile ? 844 : 900);
  window.IntersectionObserver = FakeIntersectionObserver;
  const connection = new EventHub();
  connection.saveData = Boolean(options.saveData);
  connection.effectiveType = options.effectiveType || "4g";
  window.navigator = { connection };
  window.matchMedia = (query) => {
    if (!mediaQueries.has(query)) {
      const mediaQuery = new EventHub();
      mediaQuery.matches = query === "(max-width: 820px)"
        ? Boolean(options.mobile)
        : query === "(prefers-reduced-motion: reduce)"
          ? Boolean(options.reducedMotion)
          : false;
      mediaQueries.set(query, mediaQuery);
    }
    return mediaQueries.get(query);
  };
  window.requestAnimationFrame = (callback) => {
    const id = nextAnimationFrameId;
    nextAnimationFrameId += 1;
    animationFrames.set(id, callback);
    return id;
  };
  window.cancelAnimationFrame = (id) => animationFrames.delete(id);
  window.scrollToCalls = 0;
  window.scrollTo = () => {
    window.scrollToCalls += 1;
  };

  vm.runInNewContext(mainSource, {
    clearTimeout: (id) => clock.clearTimeout(id),
    console,
    document,
    IntersectionObserver: FakeIntersectionObserver,
    selectClosestVisibleArchiveReel: reelSelection.selectClosestVisibleArchiveReel,
    selectClosestVisibleReel: reelSelection.selectClosestVisibleReel,
    setTimeout: (callback, delay) => clock.setTimeout(callback, delay),
    URLSearchParams,
    window,
  }, { filename: "src/main.js" });

  const featuredObserver = observers.find((observer) =>
    Array.isArray(observer.options.threshold)
      && videos.some((video) => observer.targets.has(video)));
  const warmObserver = observers.find((observer) =>
    observer.options.rootMargin === "200% 0px");
  const archiveObserver = observers.find((observer) =>
    Array.isArray(observer.options.threshold)
      && archiveVideos.some((video) => observer.targets.has(video)));
  if (!options.reducedMotion && videos.length) {
    assert.ok(featuredObserver, "the real Featured controller observes its videos");
  }
  if (!options.reducedMotion && archiveVideos.length) {
    assert.ok(archiveObserver, "the real Archive controller observes its videos");
  }

  function intersect(entries) {
    assert.ok(featuredObserver, "Featured playback observer is available");
    featuredObserver.emit(entries.map(([target, ratio]) => ({
      target,
      isIntersecting: ratio > 0,
      intersectionRatio: ratio,
    })));
  }

  function warmIntersect(entries) {
    assert.ok(warmObserver, "Featured warm observer is available");
    warmObserver.emit(entries.map(([target, isIntersecting]) => ({
      target,
      isIntersecting,
      intersectionRatio: isIntersecting ? 1 : 0,
    })));
  }

  function archiveIntersect(entries) {
    assert.ok(archiveObserver, "Archive playback observer is available");
    archiveObserver.emit(entries.map(([target, ratio]) => ({
      target,
      isIntersecting: ratio > 0,
      intersectionRatio: ratio,
    })));
  }

  function flushAnimationFrames() {
    const callbacks = [...animationFrames.values()];
    animationFrames.clear();
    callbacks.forEach((callback) => callback(clock.now));
  }

  return {
    archiveCards,
    archiveIntersect,
    archiveMedia,
    archiveObserver,
    archiveVideos,
    clock,
    connection,
    document,
    featuredObserver,
    flushAnimationFrames,
    heroImage,
    intersect,
    mediaFrames,
    mediaQueries,
    panels,
    screeningCards,
    videos,
    warmIntersect,
    warmObserver,
    window,
  };
}

function dispatchTouch(surface, pointerId, points = {}) {
  const startX = points.startX ?? 120;
  const startY = points.startY ?? 300;
  const endX = points.endX ?? startX;
  const endY = points.endY ?? startY;
  surface.dispatch("pointerdown", {
    pointerType: "touch", pointerId, clientX: startX, clientY: startY,
  });
  if (points.move) {
    surface.dispatch("pointermove", {
      pointerType: "touch", pointerId, clientX: endX, clientY: endY,
    });
  }
  surface.dispatch("pointerup", {
    pointerType: "touch", pointerId, clientX: endX, clientY: endY,
  });
  return surface.dispatch("click");
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

test("Archive linked media uses first mobile tap for preview and second for destination", () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 1,
    archiveLinked: [true],
  });
  const [video] = runtime.archiveVideos;
  const [media] = runtime.archiveMedia;

  const firstClick = dispatchTouch(media, 101);
  assert.equal(firstClick.defaultPrevented, true);
  assert.equal(video.playRequests.length, 1);
  assert.equal(video.preload, "metadata");
  assert.equal(video.loadCalls, 1);

  video.dispatch("playing");
  const secondClick = dispatchTouch(media, 102);
  assert.equal(secondClick.defaultPrevented, false);
  assert.equal(video.playRequests.length, 1);
});

test("Archive linked media touch movement remains scrolling without navigation", () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 1,
    archiveLinked: [true],
  });
  const [video] = runtime.archiveVideos;
  const [media] = runtime.archiveMedia;

  const click = dispatchTouch(media, 103, {
    move: true,
    endX: 122,
    endY: 326,
  });
  assert.equal(click.defaultPrevented, true);
  assert.equal(video.playRequests.length, 0);
  assert.equal(video.preload, "none");
  assert.equal(video.loadCalls, 0);

  media.dispatch("pointerdown", {
    pointerType: "touch", pointerId: 110, clientX: 120, clientY: 300,
  });
  media.dispatch("pointercancel", { pointerType: "touch", pointerId: 110 });
  assert.equal(media.dispatch("click").defaultPrevented, true);
  assert.equal(video.playRequests.length, 0);
});

test("Archive unlinked media can preview and retry after a play rejection", async () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 1,
    archiveLinked: [false],
  });
  const [video] = runtime.archiveVideos;
  const [media] = runtime.archiveMedia;

  assert.equal(dispatchTouch(media, 104).defaultPrevented, false);
  assert.equal(video.playRequests.length, 1);
  video.playRequests[0].reject(new Error("archive preview unavailable"));
  await flushPromises();
  assert.equal(video.paused, true);

  assert.equal(dispatchTouch(media, 105).defaultPrevented, false);
  assert.equal(video.playRequests.length, 2);
});

test("Archive desktop hover and existing link focus bypass the passive hold", () => {
  const runtime = createRuntime(0, { archiveCount: 1, archiveLinked: [true] });
  const [video] = runtime.archiveVideos;
  const [card] = runtime.archiveCards;

  card.dispatch("pointerenter", { pointerType: "mouse" });
  assert.equal(video.playRequests.length, 1);
  assert.equal(video.preload, "metadata");
  assert.equal(video.loadCalls, 1);
  card.dispatch("pointerleave", { pointerType: "mouse" });
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);

  card.dispatch("focusin", { target: card });
  assert.equal(video.playRequests.length, 2);
  card.dispatch("focusout", { target: card, relatedTarget: null });
  assert.equal(video.paused, true);
});

test("Archive desktop hover and focus keep previewing until both intents leave", () => {
  const runtime = createRuntime(0, { archiveCount: 1, archiveLinked: [true] });
  const [video] = runtime.archiveVideos;
  const [card] = runtime.archiveCards;

  card.dispatch("focusin", { target: card });
  card.dispatch("pointerenter", { pointerType: "mouse" });
  card.dispatch("pointerleave", { pointerType: "mouse" });
  assert.equal(video.paused, false, "focus must retain playback after pointer exit");
  card.dispatch("focusout", { target: card, relatedTarget: null });
  assert.equal(video.paused, true);

  card.dispatch("pointerenter", { pointerType: "mouse" });
  card.dispatch("focusin", { target: card });
  card.dispatch("focusout", { target: card, relatedTarget: null });
  assert.equal(video.paused, false, "hover must retain playback after focus exit");
  card.dispatch("pointerleave", { pointerType: "mouse" });
  assert.equal(video.paused, true);
});

test("Archive keeps its 35% plus 1400ms passive fallback", () => {
  const runtime = createRuntime(0, { archiveCount: 1 });
  const [video] = runtime.archiveVideos;

  runtime.archiveIntersect([[video, 0.35]]);
  runtime.clock.advance(1399);
  assert.equal(video.playRequests.length, 0);
  runtime.clock.advance(1);
  assert.equal(video.playRequests.length, 1);
});

test("Archive intent owns one reel and stale events cannot reveal or reset it", async () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 2,
    archiveLinked: [true, true],
  });
  const [first, second] = runtime.archiveVideos;
  const [firstMedia, secondMedia] = runtime.archiveMedia;

  dispatchTouch(firstMedia, 106);
  const staleRequest = first.playRequests[0];
  dispatchTouch(secondMedia, 107);
  assert.equal(first.paused, true);
  assert.equal(second.playRequests.length, 1);

  first.dispatch("playing");
  assert.equal(first.classList.contains("is-playing"), false);
  second.playRequests[0].resolve();
  await flushPromises();
  assert.equal(second.classList.contains("is-playing"), true);

  second.currentTime = 6;
  staleRequest.reject(new Error("stale Archive playback rejection"));
  await flushPromises();
  assert.equal(second.paused, false);
  assert.equal(second.currentTime, 6);
});

test("a stale Archive error cannot clear a newer reel owner", async () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 2,
    archiveLinked: [true, true],
  });
  const [first, second] = runtime.archiveVideos;
  const [firstMedia, secondMedia] = runtime.archiveMedia;

  dispatchTouch(firstMedia, 111);
  dispatchTouch(secondMedia, 112);
  first.dispatch("error");
  second.playRequests[0].resolve();
  await flushPromises();

  assert.equal(second.paused, false);
  assert.equal(second.classList.contains("is-playing"), true);
});

test("a stale same-reel playing event cannot reveal a newer activation", async () => {
  const runtime = createRuntime(0, { archiveCount: 1, archiveLinked: [true] });
  const [video] = runtime.archiveVideos;
  const [card] = runtime.archiveCards;

  card.dispatch("pointerenter", { pointerType: "mouse" });
  const staleRequest = video.playRequests[0];
  card.dispatch("pointerleave", { pointerType: "mouse" });
  card.dispatch("pointerenter", { pointerType: "mouse" });
  const currentRequest = video.playRequests[1];

  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);
  staleRequest.resolve();
  await flushPromises();
  assert.equal(video.classList.contains("is-playing"), false);

  currentRequest.resolve();
  await flushPromises();
  assert.equal(video.classList.contains("is-playing"), true);
});

test("Archive linked failure releases the next stationary tap to its destination", async () => {
  const runtime = createRuntime(0, {
    mobile: true,
    archiveCount: 1,
    archiveLinked: [true],
  });
  const [video] = runtime.archiveVideos;
  const [media] = runtime.archiveMedia;

  assert.equal(dispatchTouch(media, 108).defaultPrevented, true);
  video.playRequests[0].reject(new Error("archive preview unavailable"));
  await flushPromises();

  assert.equal(dispatchTouch(media, 109).defaultPrevented, false);
  assert.equal(video.playRequests.length, 1);
});

test("desktop 35% entry holds for 1400ms and an early exit cancels playback", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;

  runtime.intersect([[video, 0.35]]);
  assert.equal(runtime.clock.pendingCount(), 1);
  runtime.clock.advance(1399);
  assert.equal(video.playRequests.length, 0);

  runtime.intersect([[video, 0]]);
  assert.equal(runtime.clock.pendingCount(), 0);
  assert.equal(video.currentTime, 0);
  runtime.clock.advance(1);
  assert.equal(video.playRequests.length, 0);
});

test("the last qualifying Featured video in DOM order owns playback", () => {
  const runtime = createRuntime(2);
  const [first, second] = runtime.videos;

  runtime.intersect([[second, 0.8], [first, 0.8]]);
  runtime.clock.advance(1400);

  assert.equal(first.playRequests.length, 0);
  assert.equal(first.currentTime, 0);
  assert.equal(second.playRequests.length, 1);
  assert.equal(second.paused, false);
});

test("mobile gives the viewport-center Featured video a 700ms poster hold", () => {
  const runtime = createRuntime(2, { mobile: true, width: 390, height: 844 });
  const [first, second] = runtime.videos;
  first.setRect({ left: 20, right: 370, top: 300, bottom: 500 });
  second.setRect({ left: 20, right: 370, top: 560, bottom: 760 });

  runtime.intersect([[first, 0.8], [second, 0.8]]);
  runtime.clock.advance(699);
  assert.equal(first.playRequests.length, 0);
  assert.equal(second.playRequests.length, 0);

  runtime.clock.advance(1);
  assert.equal(first.playRequests.length, 1);
  assert.equal(second.playRequests.length, 0);
});

test("mobile proximity warm waits for the Hero image rather than the full page load", () => {
  const runtime = createRuntime(2, { mobile: true, width: 390, height: 844 });
  const [first, second] = runtime.videos;
  first.setRect({ left: 20, right: 370, top: 900, bottom: 1100 });
  second.setRect({ left: 20, right: 370, top: 1180, bottom: 1380 });

  runtime.warmIntersect([[first, true], [second, true]]);
  runtime.clock.advance(1000);
  assert.equal(first.loadCalls, 0);
  assert.equal(second.loadCalls, 0);

  runtime.window.dispatch("load");
  runtime.clock.advance(1000);
  assert.equal(first.loadCalls, 0);

  runtime.heroImage.complete = true;
  runtime.heroImage.naturalWidth = 1200;
  runtime.heroImage.dispatch("load");
  runtime.clock.advance(179);
  assert.equal(first.loadCalls, 0);
  runtime.clock.advance(1);
  assert.equal(first.preload, "metadata");
  assert.equal(first.loadCalls, 1);
  assert.equal(second.preload, "none");
  assert.equal(second.loadCalls, 0);
});

test("late pageshow never yanks an already navigated mobile page back to the top", () => {
  const untouched = createRuntime(1, { mobile: true });
  untouched.window.dispatch("pageshow", { persisted: false });
  assert.equal(untouched.window.scrollToCalls, 1);

  const navigated = createRuntime(1, { mobile: true });
  navigated.window.dispatch("scroll");
  navigated.window.dispatch("pageshow", { persisted: false });
  assert.equal(navigated.window.scrollToCalls, 0);

  const engaged = createRuntime(1, { mobile: true });
  engaged.document.dispatch("pointerdown", { pointerType: "touch" });
  engaged.window.dispatch("pageshow", { persisted: false });
  assert.equal(engaged.window.scrollToCalls, 0);
});

test("mobile warm handoff cancels the old request before warming one new candidate", () => {
  const runtime = createRuntime(2, { mobile: true, width: 390, height: 844 });
  const [first, second] = runtime.videos;
  first.setRect({ left: 20, right: 370, top: 900, bottom: 1100 });
  second.setRect({ left: 20, right: 370, top: 1180, bottom: 1380 });
  runtime.heroImage.complete = true;
  runtime.heroImage.naturalWidth = 1200;
  runtime.heroImage.dispatch("load");
  runtime.warmIntersect([[first, true], [second, true]]);
  runtime.clock.advance(180);

  first.setRect({ left: 20, right: 370, top: -500, bottom: -300 });
  second.setRect({ left: 20, right: 370, top: 700, bottom: 900 });
  runtime.warmIntersect([[first, false], [second, true]]);
  runtime.clock.advance(180);

  assert.equal(first.preload, "none");
  assert.equal(first.loadCalls, 2);
  assert.equal(second.preload, "metadata");
  assert.equal(second.loadCalls, 1);
});

test("desktop, data saver, 2G, and reduced motion never warm Featured media", () => {
  const cases = [
    createRuntime(1),
    createRuntime(1, { mobile: true, saveData: true }),
    createRuntime(1, { mobile: true, effectiveType: "2g" }),
  ];
  for (const runtime of cases) {
    runtime.heroImage.complete = true;
    runtime.heroImage.naturalWidth = 1200;
    runtime.heroImage.dispatch("load");
    runtime.warmIntersect([[runtime.videos[0], true]]);
    runtime.clock.advance(1000);
    assert.equal(runtime.videos[0].loadCalls, 0);
    assert.equal(runtime.videos[0].preload, "none");
  }

  const reduced = createRuntime(1, { mobile: true, reducedMotion: true });
  reduced.heroImage.complete = true;
  reduced.heroImage.naturalWidth = 1200;
  reduced.heroImage.dispatch("load");
  reduced.clock.advance(1000);
  assert.equal(reduced.warmObserver, undefined);
  assert.equal(reduced.videos[0].loadCalls, 0);
});

test("active Featured playback blocks a second proximity warm", () => {
  const runtime = createRuntime(2, { mobile: true, width: 390, height: 844 });
  const [first, second] = runtime.videos;
  first.setRect({ left: 20, right: 370, top: 300, bottom: 500 });
  second.setRect({ left: 20, right: 370, top: 560, bottom: 760 });
  runtime.heroImage.complete = true;
  runtime.heroImage.naturalWidth = 1200;
  runtime.heroImage.dispatch("load");
  runtime.warmIntersect([[first, true], [second, true]]);
  runtime.intersect([[first, 0.8], [second, 0.8]]);
  runtime.clock.advance(700);
  assert.equal(first.playRequests.length, 1);

  runtime.warmIntersect([[first, false], [second, true]]);
  runtime.clock.advance(1000);
  assert.equal(second.loadCalls, 0);
});

test("mobile scroll hands Featured ownership to the new center without an observer event", () => {
  const runtime = createRuntime(2, { mobile: true, width: 390, height: 844 });
  const [first, second] = runtime.videos;
  first.setRect({ left: 20, right: 370, top: 300, bottom: 500 });
  second.setRect({ left: 20, right: 370, top: 560, bottom: 760 });
  runtime.intersect([[first, 0.8], [second, 0.8]]);
  runtime.clock.advance(400);

  first.setRect({ left: 20, right: 370, top: 40, bottom: 240 });
  second.setRect({ left: 20, right: 370, top: 320, bottom: 520 });
  runtime.window.dispatch("scroll");
  runtime.flushAnimationFrames();

  runtime.clock.advance(699);
  assert.equal(first.playRequests.length, 0);
  assert.equal(second.playRequests.length, 0);
  runtime.clock.advance(1);
  assert.equal(second.playRequests.length, 1);
  assert.equal(first.currentTime, 0);
});

test("crossing into mobile policy replaces an in-flight desktop hold", () => {
  const runtime = createRuntime(1, { width: 900, height: 844 });
  const [video] = runtime.videos;
  video.setRect({ left: 20, right: 370, top: 300, bottom: 500 });
  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(400);

  const mobileMedia = runtime.mediaQueries.get("(max-width: 820px)");
  mobileMedia.matches = true;
  mobileMedia.dispatch("change", { matches: true });

  runtime.clock.advance(699);
  assert.equal(video.playRequests.length, 0);
  runtime.clock.advance(1);
  assert.equal(video.playRequests.length, 1);
});

test("desktop pointer hover and keyboard focus bypass the passive hold", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;
  const [panel] = runtime.panels;

  runtime.intersect([[video, 0.1]]);
  panel.dispatch("pointerenter", { pointerType: "mouse" });
  assert.equal(video.playRequests.length, 1);
  assert.equal(video.preload, "metadata");
  assert.equal(video.loadCalls, 1);

  panel.dispatch("pointerleave", { pointerType: "mouse" });
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);

  panel.dispatch("focusin", { target: panel });
  assert.equal(video.playRequests.length, 2);
  panel.dispatch("focusout", { target: panel, relatedTarget: null });
  assert.equal(video.paused, true);
});

test("mobile first stationary media tap previews and suppresses only that click", () => {
  const runtime = createRuntime(1, { mobile: true });
  const [video] = runtime.videos;
  const [media] = runtime.mediaFrames;

  runtime.intersect([[video, 0.8]]);
  media.dispatch("pointerdown", {
    pointerType: "touch",
    pointerId: 7,
    clientX: 120,
    clientY: 300,
  });
  media.dispatch("pointerup", {
    pointerType: "touch",
    pointerId: 7,
    clientX: 121,
    clientY: 302,
  });
  const firstClick = media.dispatch("click");

  assert.equal(firstClick.defaultPrevented, true);
  assert.equal(video.playRequests.length, 1);
  assert.equal(video.preload, "metadata");
  assert.equal(video.loadCalls, 1);

  video.dispatch("playing");
  media.dispatch("pointerdown", {
    pointerType: "touch",
    pointerId: 8,
    clientX: 120,
    clientY: 300,
  });
  media.dispatch("pointerup", {
    pointerType: "touch",
    pointerId: 8,
    clientX: 120,
    clientY: 300,
  });
  const secondClick = media.dispatch("click");

  assert.equal(secondClick.defaultPrevented, false);
  assert.equal(video.playRequests.length, 1);
});

test("a failed mobile preview still lets the next tap open the official destination", async () => {
  const runtime = createRuntime(1, { mobile: true });
  const [video] = runtime.videos;
  const [media] = runtime.mediaFrames;

  runtime.intersect([[video, 0.8]]);
  media.dispatch("pointerdown", {
    pointerType: "touch", pointerId: 81, clientX: 120, clientY: 300,
  });
  media.dispatch("pointerup", {
    pointerType: "touch", pointerId: 81, clientX: 120, clientY: 300,
  });
  assert.equal(media.dispatch("click").defaultPrevented, true);

  video.playRequests[0].reject(new Error("preview unavailable"));
  await flushPromises();
  assert.equal(video.paused, true);

  media.dispatch("pointerdown", {
    pointerType: "touch", pointerId: 82, clientX: 120, clientY: 300,
  });
  media.dispatch("pointerup", {
    pointerType: "touch", pointerId: 82, clientX: 120, clientY: 300,
  });
  assert.equal(media.dispatch("click").defaultPrevented, false);
  assert.equal(video.playRequests.length, 1);
});

test("mobile touch movement preserves scrolling without playback or navigation", () => {
  const runtime = createRuntime(1, { mobile: true });
  const [video] = runtime.videos;
  const [media] = runtime.mediaFrames;

  runtime.intersect([[video, 0.8]]);
  media.dispatch("pointerdown", {
    pointerType: "touch",
    pointerId: 9,
    clientX: 120,
    clientY: 300,
  });
  media.dispatch("pointermove", {
    pointerType: "touch",
    pointerId: 9,
    clientX: 122,
    clientY: 326,
  });
  media.dispatch("pointerup", {
    pointerType: "touch",
    pointerId: 9,
    clientX: 122,
    clientY: 326,
  });
  const syntheticClick = media.dispatch("click");

  assert.equal(syntheticClick.defaultPrevented, true);
  assert.equal(video.playRequests.length, 0);
  assert.equal(video.preload, "none");
  assert.equal(video.loadCalls, 0);
});

test("Screening Strip activation primes its exact reel and bypasses hold on arrival", () => {
  const runtime = createRuntime(2, { mobile: true });
  const [first, second] = runtime.videos;
  const [, secondCard] = runtime.screeningCards;
  first.setRect({ left: 0, right: 100, top: 1200, bottom: 1300 });
  second.setRect({ left: 0, right: 100, top: 1400, bottom: 1500 });

  runtime.document.dispatch("pointerdown", {
    target: secondCard,
    pointerType: "touch",
  });
  assert.equal(first.loadCalls, 0);
  assert.equal(second.preload, "metadata");
  assert.equal(second.loadCalls, 1);
  assert.equal(second.playRequests.length, 0);

  runtime.document.dispatch("click", { target: secondCard });
  assert.equal(second.currentTime, 9, "the offscreen primed request must not be reset before arrival");
  second.setRect({ left: 20, right: 370, top: 300, bottom: 500 });
  runtime.intersect([[second, 0.8]]);

  assert.equal(first.playRequests.length, 0);
  assert.equal(second.playRequests.length, 1);
  assert.equal(runtime.clock.pendingCount(), 0);
});

test("an interrupted Screening Strip jump releases its offscreen prime", () => {
  const runtime = createRuntime(1, { mobile: true });
  const [video] = runtime.videos;
  const [card] = runtime.screeningCards;
  video.setRect({ left: 0, right: 100, top: 1400, bottom: 1500 });

  runtime.document.dispatch("pointerdown", { target: card, pointerType: "touch" });
  runtime.document.dispatch("click", { target: card });
  assert.equal(video.preload, "metadata");
  assert.equal(video.loadCalls, 1);

  runtime.clock.advance(2999);
  assert.equal(video.preload, "metadata");
  runtime.clock.advance(1);
  assert.equal(video.preload, "none");
  assert.equal(video.loadCalls, 2);
});

test("an old play rejection cannot reset a rapid exit and re-entry activation", async () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;

  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  const oldRequest = video.playRequests[0];

  runtime.intersect([[video, 0]]);
  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  assert.equal(video.playRequests.length, 2);
  video.currentTime = 6;

  oldRequest.reject(new Error("stale playback rejection"));
  await flushPromises();

  assert.equal(video.paused, false);
  assert.equal(video.currentTime, 6);
});

test("only a current active playing event may reveal a Featured reel", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;
  const [media] = runtime.mediaFrames;

  runtime.intersect([[video, 0.8]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);
  assert.equal(media.classList.contains("is-reel-playing"), false);

  runtime.clock.advance(1400);
  runtime.intersect([[video, 0]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);
  assert.equal(media.classList.contains("is-reel-playing"), false);

  runtime.intersect([[video, 0.8]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);
  assert.equal(media.classList.contains("is-reel-playing"), false);

  runtime.clock.advance(1400);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), true);
  assert.equal(media.classList.contains("is-reel-playing"), true);
});

test("media errors and hidden visibility reset while visible re-entry can replay", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;
  const [media] = runtime.mediaFrames;

  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  video.currentTime = 4;
  video.dispatch("playing");
  assert.equal(media.classList.contains("is-reel-playing"), true);
  video.dispatch("error");
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.classList.contains("is-playing"), false);
  assert.equal(media.classList.contains("is-reel-playing"), false);

  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  assert.equal(video.playRequests.length, 2);

  runtime.document.visibilityState = "hidden";
  runtime.document.dispatch("visibilitychange");
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);

  runtime.document.visibilityState = "visible";
  runtime.document.dispatch("visibilitychange");
  runtime.clock.advance(1400);
  assert.equal(video.playRequests.length, 3);
});

test("persisted BFCache suspension rebinds observation on pageshow", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;

  runtime.intersect([[video, 0.8]]);
  runtime.window.dispatch("pagehide", { persisted: true });
  assert.equal(runtime.featuredObserver.disconnectCalls, 1);
  assert.equal(video.currentTime, 0);
  assert.equal(runtime.document.listenerCount("visibilitychange"), 0);

  runtime.window.dispatch("pageshow", { persisted: true });
  assert.equal(runtime.featuredObserver.observeCounts.get(video), 2);
  assert.equal(runtime.document.listenerCount("visibilitychange"), 1);

  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  assert.equal(video.playRequests.length, 1);
});
