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
    const event = { type, ...detail };
    for (const listener of [...(this.listeners.get(type) || [])]) {
      listener(event);
    }
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
    this.rect = { left: 0, right: 100, top: 0, bottom: 100 };
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
  document.visibilityState = "visible";
  document.querySelector = () => null;
  document.querySelectorAll = (selector) =>
    selector === "[data-featured-reel-video]" ? videos : [];

  const window = new EventHub();
  window.history = {
    scrollRestoration: "auto",
    replaceState() {},
  };
  window.location = { hash: "", pathname: "/en/", search: "" };
  window.innerWidth = options.width || (options.mobile ? 390 : 1440);
  window.innerHeight = options.height || (options.mobile ? 844 : 900);
  window.IntersectionObserver = FakeIntersectionObserver;
  window.matchMedia = (query) => {
    if (!mediaQueries.has(query)) {
      const mediaQuery = new EventHub();
      mediaQuery.matches = query === "(max-width: 820px)" && Boolean(options.mobile);
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
  window.scrollTo = () => {};

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
    videos.some((video) => observer.targets.has(video)));
  assert.ok(featuredObserver, "the real Featured controller observes its videos");

  function intersect(entries) {
    featuredObserver.emit(entries.map(([target, ratio]) => ({
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
    clock,
    document,
    featuredObserver,
    flushAnimationFrames,
    intersect,
    mediaQueries,
    videos,
    window,
  };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

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

  runtime.intersect([[video, 0.8]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);

  runtime.clock.advance(1400);
  runtime.intersect([[video, 0]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);

  runtime.intersect([[video, 0.8]]);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), false);

  runtime.clock.advance(1400);
  video.dispatch("playing");
  assert.equal(video.classList.contains("is-playing"), true);
});

test("media errors and hidden visibility reset while visible re-entry can replay", () => {
  const runtime = createRuntime();
  const [video] = runtime.videos;

  runtime.intersect([[video, 0.8]]);
  runtime.clock.advance(1400);
  video.currentTime = 4;
  video.dispatch("playing");
  video.dispatch("error");
  assert.equal(video.paused, true);
  assert.equal(video.currentTime, 0);
  assert.equal(video.classList.contains("is-playing"), false);

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
