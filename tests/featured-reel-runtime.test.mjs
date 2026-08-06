import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import vm from "node:vm";

import { selectClosestVisibleArchiveReel } from "../src/archive-reel-selection.js";

const mainSource = readFileSync(join(process.cwd(), "src/main.js"), "utf8")
  .replace(/^import \{ selectClosestVisibleArchiveReel \} from "\.\/archive-reel-selection\.js";\n\n/, "");

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

function createRuntime(videoCount = 1) {
  const videos = Array.from({ length: videoCount }, (_, index) => new FakeVideo(`video-${index + 1}`));
  const clock = new FakeClock();
  const observers = [];

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
  window.innerWidth = 1440;
  window.innerHeight = 900;
  window.IntersectionObserver = FakeIntersectionObserver;
  window.matchMedia = () => ({
    matches: false,
    addEventListener() {},
  });
  window.requestAnimationFrame = () => 1;
  window.cancelAnimationFrame = () => {};
  window.scrollTo = () => {};

  vm.runInNewContext(mainSource, {
    clearTimeout: (id) => clock.clearTimeout(id),
    console,
    document,
    IntersectionObserver: FakeIntersectionObserver,
    selectClosestVisibleArchiveReel,
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

  return { clock, document, featuredObserver, intersect, videos, window };
}

async function flushPromises() {
  await Promise.resolve();
  await Promise.resolve();
}

test("35% entry holds for 1400ms and an early exit cancels playback", () => {
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
