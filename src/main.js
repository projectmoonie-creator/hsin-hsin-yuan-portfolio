import { selectClosestVisibleReel } from "./archive-reel-selection.js";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

function scrollToTopInstant() {
  window.scrollTo({ top: 0, left: 0, behavior: "instant" });
}

function clearInitialHash() {
  if (!window.location.hash) return false;
  window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
  return true;
}

const hadInitialHash = clearInitialHash();
let hasNavigatedBeforeInitialPageShow = false;
function markNavigationBeforeInitialPageShow() {
  hasNavigatedBeforeInitialPageShow = true;
}
window.addEventListener("scroll", markNavigationBeforeInitialPageShow, {
  passive: true,
  once: true,
});
document.addEventListener("pointerdown", markNavigationBeforeInitialPageShow, {
  capture: true,
  once: true,
});
document.addEventListener("keydown", markNavigationBeforeInitialPageShow, {
  capture: true,
  once: true,
});

window.addEventListener("pageshow", (event) => {
  if (!event.persisted && !hasNavigatedBeforeInitialPageShow) {
    scrollToTopInstant();
    if (hadInitialHash) {
      window.requestAnimationFrame(() => {
        if (!hasNavigatedBeforeInitialPageShow) scrollToTopInstant();
      });
    }
  }
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const stackMedia = window.matchMedia("(min-width: 861px)");
  const scrollStacks = Array.from(document.querySelectorAll("[data-scroll-stack]"));

  function updateScrollStacks() {
    if (!stackMedia.matches) {
      scrollStacks.forEach((stack) => {
        stack.querySelectorAll(".work-panel").forEach((panel) => {
          panel.style.removeProperty("--stack-progress");
        });
      });
      return;
    }

    const viewportAnchor = window.innerHeight * 0.18;
    scrollStacks.forEach((stack) => {
      stack.querySelectorAll(".work-panel").forEach((panel) => {
        const rect = panel.getBoundingClientRect();
        const progress = Math.min(1, Math.max(0, (viewportAnchor - rect.top) / Math.max(rect.height * 0.7, 1)));
        panel.style.setProperty("--stack-progress", progress.toFixed(3));
      });
    });
  }

  let stackFrame = 0;
  function scheduleScrollStackUpdate() {
    if (stackFrame) return;
    stackFrame = window.requestAnimationFrame(() => {
      stackFrame = 0;
      updateScrollStacks();
    });
  }

  updateScrollStacks();
  window.addEventListener("scroll", scheduleScrollStackUpdate, { passive: true });
  window.addEventListener("resize", scheduleScrollStackUpdate);
  stackMedia.addEventListener?.("change", scheduleScrollStackUpdate);

  document.querySelectorAll("[data-watch-loop]").forEach((loop) => {
    const viewport = loop.querySelector(".watch-loop-viewport");
    const track = loop.querySelector("[data-watch-loop-track]");
    const sequence = loop.querySelector("[data-watch-loop-sequence]");
    if (!viewport || !track || !sequence) return;

    let sequenceWidth = 0;
    let offset = 0;
    let velocity = Number(loop.dataset.speed || 32);
    let lastTime = 0;
    let isInteracting = false;
    let animationFrame = 0;
    let isVisible = false;

    function syncLoopCopies() {
      const copies = Array.from(track.querySelectorAll("[data-watch-loop-sequence]"));
      copies.slice(1).forEach((copy) => {
        copy.remove();
      });
      sequenceWidth = sequence.getBoundingClientRect().width;
      if (!sequenceWidth) return;
      offset %= sequenceWidth;
      track.style.transform = `translate3d(${-offset}px, 0, 0)`;

      const targetWidth = Math.max(viewport.clientWidth * 2.5, sequenceWidth * 2);
      let renderedWidth = sequenceWidth;
      while (renderedWidth < targetWidth) {
        const clone = sequence.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.querySelectorAll("a").forEach((link) => {
          link.tabIndex = -1;
        });
        track.append(clone);
        renderedWidth += sequenceWidth;
      }
    }

    function consumeNativeScroll() {
      const nativeOffset = viewport.scrollLeft;
      if (!nativeOffset) return;

      if (sequenceWidth > 0) {
        offset = (offset + nativeOffset) % sequenceWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }
      viewport.scrollLeft = 0;
    }

    function tick(time) {
      if (!lastTime) lastTime = time;
      const deltaSeconds = Math.min((time - lastTime) / 1000, 0.08);
      lastTime = time;

      const hasFocus = document.activeElement?.closest("[data-watch-loop]") === loop;
      const targetVelocity = isInteracting || hasFocus ? 0 : Number(loop.dataset.speed || 32);
      velocity = targetVelocity === 0 ? 0 : velocity + (targetVelocity - velocity) * Math.min(1, deltaSeconds * 5);

      if (sequenceWidth > 0) {
        offset = (offset + velocity * deltaSeconds) % sequenceWidth;
        track.style.transform = `translate3d(${-offset}px, 0, 0)`;
      }

      animationFrame = window.requestAnimationFrame(tick);
    }

    function startLoop() {
      if (animationFrame) return;
      lastTime = 0;
      animationFrame = window.requestAnimationFrame(tick);
    }

    function stopLoop() {
      if (!animationFrame) return;
      window.cancelAnimationFrame(animationFrame);
      animationFrame = 0;
    }

    loop.addEventListener("mouseenter", () => {
      isInteracting = true;
    });

    loop.addEventListener("mouseleave", () => {
      isInteracting = false;
    });

    loop.addEventListener("focusin", () => {
      isInteracting = true;
    });

    loop.addEventListener("focusout", () => {
      isInteracting = false;
    });

    viewport.addEventListener("pointerdown", () => {
      isInteracting = true;
    });

    viewport.addEventListener("pointerup", () => {
      isInteracting = false;
    });

    viewport.addEventListener("pointercancel", () => {
      isInteracting = false;
    });

    const resizeObserver =
      "ResizeObserver" in window
        ? new ResizeObserver(() => {
            syncLoopCopies();
          })
        : null;
    resizeObserver?.observe(viewport);
    syncLoopCopies();
    viewport.addEventListener("scroll", consumeNativeScroll, { passive: true });

    if ("IntersectionObserver" in window) {
      const loopObserver = new IntersectionObserver(
        (entries) => {
          isVisible = entries.some((entry) => entry.isIntersecting);
          if (isVisible) {
            startLoop();
          } else {
            stopLoop();
          }
        },
        { rootMargin: "0px", threshold: 0.01 },
      );
      loopObserver.observe(loop);

      window.addEventListener("pagehide", () => {
        stopLoop();
        loopObserver.disconnect();
        resizeObserver?.disconnect();
      });
    } else {
      isVisible = true;
      startLoop();

      window.addEventListener("pagehide", () => {
        stopLoop();
        resizeObserver?.disconnect();
      });
    }

    if (isVisible) startLoop();
  });

  const REEL_TOUCH_MOVE_PX = 12;

  function bindReelIntentSurface({
    video,
    surface,
    hoverTarget,
    mobileMedia,
    hasDestination,
    activate,
    release,
    isPreviewing,
    consumeFailure,
  }) {
    let touchGesture = null;
    let suppressClick = false;
    let suppressClickTimer = 0;
    let pointerIntent = false;
    let focusIntent = false;

    function suppressNextClick() {
      suppressClick = true;
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
      suppressClickTimer = setTimeout(() => {
        suppressClick = false;
        suppressClickTimer = 0;
      }, 0);
    }

    hoverTarget.addEventListener("pointerenter", (event) => {
      if (mobileMedia.matches || event.pointerType === "touch") return;
      pointerIntent = true;
      activate(video);
    });
    hoverTarget.addEventListener("pointerleave", (event) => {
      if (event.pointerType === "touch") return;
      pointerIntent = false;
      if (!mobileMedia.matches && !focusIntent) release(video);
    });
    hoverTarget.addEventListener("focusin", () => {
      focusIntent = true;
      activate(video);
    });
    hoverTarget.addEventListener("focusout", (event) => {
      if (hoverTarget.contains(event.relatedTarget)) return;
      focusIntent = false;
      if (!pointerIntent) release(video);
    });

    surface.addEventListener("pointerdown", (event) => {
      if (!mobileMedia.matches || event.pointerType !== "touch") return;
      touchGesture = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        moved: false,
      };
    });
    surface.addEventListener("pointermove", (event) => {
      if (!touchGesture || touchGesture.pointerId !== event.pointerId) return;
      if (Math.hypot(
        event.clientX - touchGesture.startX,
        event.clientY - touchGesture.startY,
      ) > REEL_TOUCH_MOVE_PX) {
        touchGesture.moved = true;
      }
    });
    surface.addEventListener("pointerup", (event) => {
      if (!touchGesture || touchGesture.pointerId !== event.pointerId) return;
      const gesture = touchGesture;
      touchGesture = null;
      if (gesture.moved) {
        if (hasDestination) suppressNextClick();
        return;
      }
      const hadFailure = consumeFailure();
      if (hadFailure && hasDestination) return;
      if (isPreviewing(video)) return;
      if (activate(video) && hasDestination) suppressNextClick();
    });
    surface.addEventListener("pointercancel", () => {
      if (touchGesture && hasDestination) suppressNextClick();
      touchGesture = null;
    });
    surface.addEventListener("click", (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      suppressClick = false;
      if (suppressClickTimer) clearTimeout(suppressClickTimer);
      suppressClickTimer = 0;
    });
  }

  const FEATURED_REEL_DESKTOP_HOLD_MS = 1400;
  const FEATURED_REEL_MOBILE_HOLD_MS = 700;
  const FEATURED_REEL_WARM_SETTLE_MS = 180;
  const featuredReelMobileMedia = window.matchMedia("(max-width: 820px)");
  const featuredReelConnection = window.navigator?.connection;
  const featuredReelHeroImage = document.querySelector(".hero-media-image");
  const featuredReelVideos = Array.from(
    document.querySelectorAll("[data-featured-reel-video]"),
  );
  const visibleFeaturedReels = new Set();
  const nearbyFeaturedReels = new Set();
  const featuredReelTimers = new Map();
  const featuredReelActivationGenerations = new WeakMap();
  const featuredReelPlayGenerations = new WeakMap();
  const featuredReelIntentFailures = new WeakSet();
  let activeFeaturedReel = null;
  let explicitFeaturedReel = null;
  let pendingScreeningFeaturedReel = null;
  let warmedFeaturedReel = null;
  let featuredReelLifecycleBound = false;
  let featuredReelViewportFrame = 0;
  let featuredReelWarmTimer = 0;
  let featuredReelScreeningPrimeTimer = 0;
  let featuredReelWarmReady = Boolean(
    featuredReelHeroImage?.complete && featuredReelHeroImage.naturalWidth,
  );

  function getFeaturedReelHoldMs() {
    return featuredReelMobileMedia.matches
      ? FEATURED_REEL_MOBILE_HOLD_MS
      : FEATURED_REEL_DESKTOP_HOLD_MS;
  }

  function getFeaturedReelGeneration(video) {
    return featuredReelActivationGenerations.get(video) || 0;
  }

  function invalidateFeaturedReelGeneration(video) {
    const generation = getFeaturedReelGeneration(video) + 1;
    featuredReelActivationGenerations.set(video, generation);
    featuredReelPlayGenerations.delete(video);
    return generation;
  }

  function isCurrentFeaturedReelActivation(video, generation) {
    return getFeaturedReelGeneration(video) === generation
      && activeFeaturedReel === video
      && (explicitFeaturedReel === video
        ? isFeaturedReelInViewport(video)
        : visibleFeaturedReels.has(video))
      && document.visibilityState === "visible";
  }

  function isFeaturedReelInViewport(video) {
    const rect = video.getBoundingClientRect();
    return rect.bottom > 0
      && rect.right > 0
      && rect.top < window.innerHeight
      && rect.left < window.innerWidth;
  }

  function clearFeaturedReelTimer(video) {
    const timer = featuredReelTimers.get(video);
    if (timer) clearTimeout(timer);
    featuredReelTimers.delete(video);
  }

  function clearFeaturedReelWarmTimer() {
    if (featuredReelWarmTimer) clearTimeout(featuredReelWarmTimer);
    featuredReelWarmTimer = 0;
  }

  function clearFeaturedReelScreeningPrimeTimer() {
    if (featuredReelScreeningPrimeTimer) clearTimeout(featuredReelScreeningPrimeTimer);
    featuredReelScreeningPrimeTimer = 0;
  }

  function restoreFeaturedReelPreload(video) {
    if (video.preload === "none") return;
    video.preload = "none";
    if (video.paused) video.load();
  }

  function releaseWarmedFeaturedReel({ preserveBuffer = false } = {}) {
    clearFeaturedReelWarmTimer();
    const video = warmedFeaturedReel;
    warmedFeaturedReel = null;
    if (video && !preserveBuffer) restoreFeaturedReelPreload(video);
  }

  function primeFeaturedReel(video) {
    if (!video?.paused || warmedFeaturedReel === video) return;
    releaseWarmedFeaturedReel();
    video.preload = "metadata";
    video.load();
    warmedFeaturedReel = video;
  }

  function canWarmFeaturedReel() {
    const effectiveType = featuredReelConnection?.effectiveType;
    return featuredReelWarmReady
      && featuredReelMobileMedia.matches
      && document.visibilityState === "visible"
      && !featuredReelConnection?.saveData
      && effectiveType !== "slow-2g"
      && effectiveType !== "2g"
      && !(activeFeaturedReel && !activeFeaturedReel.paused);
  }

  function getFeaturedReelWarmCandidate() {
    if (activeFeaturedReel?.paused && nearbyFeaturedReels.has(activeFeaturedReel)) {
      return activeFeaturedReel;
    }
    return selectClosestVisibleReel(
      featuredReelVideos,
      nearbyFeaturedReels,
      { width: window.innerWidth, height: window.innerHeight },
    );
  }

  function scheduleFeaturedReelWarm() {
    clearFeaturedReelWarmTimer();
    if (!canWarmFeaturedReel() || !nearbyFeaturedReels.size) {
      releaseWarmedFeaturedReel();
      return;
    }
    const candidate = getFeaturedReelWarmCandidate();
    if (!candidate?.paused) {
      releaseWarmedFeaturedReel();
      return;
    }
    if (candidate === warmedFeaturedReel) return;
    releaseWarmedFeaturedReel();
    featuredReelWarmTimer = setTimeout(() => {
      featuredReelWarmTimer = 0;
      if (!canWarmFeaturedReel()
        || getFeaturedReelWarmCandidate() !== candidate
        || !candidate.paused) return;
      candidate.preload = "metadata";
      candidate.load();
      warmedFeaturedReel = candidate;
    }, FEATURED_REEL_WARM_SETTLE_MS);
  }

  function resetFeaturedReel(video) {
    const shouldRestorePreload = warmedFeaturedReel !== video && video.preload !== "none";
    clearFeaturedReelTimer(video);
    invalidateFeaturedReelGeneration(video);
    if (explicitFeaturedReel === video) explicitFeaturedReel = null;
    video.closest(".media-frame")?.classList.remove("is-reel-playing");
    video.classList.remove("is-playing");
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // The poster remains visible if media metadata is not ready.
    }
    if (shouldRestorePreload) restoreFeaturedReelPreload(video);
  }

  function playFeaturedReel(video, generation) {
    clearFeaturedReelTimer(video);
    if (!isCurrentFeaturedReelActivation(video, generation) || !video.paused) return;
    featuredReelPlayGenerations.set(video, generation);
    video.muted = true;
    if (warmedFeaturedReel === video) {
      releaseWarmedFeaturedReel({ preserveBuffer: true });
    }
    video.play().catch(() => {
      if (isCurrentFeaturedReelActivation(video, generation)
        && featuredReelPlayGenerations.get(video) === generation) {
        if (explicitFeaturedReel === video) featuredReelIntentFailures.add(video);
        resetFeaturedReel(video);
      }
    });
  }

  function activateFeaturedReelIntent(video) {
    if (!video
      || !video.paused
      || !isFeaturedReelInViewport(video)
      || document.visibilityState !== "visible") return false;
    featuredReelIntentFailures.delete(video);
    explicitFeaturedReel = video;
    activeFeaturedReel = video;
    featuredReelVideos.forEach((candidate) => {
      if (candidate !== video) resetFeaturedReel(candidate);
    });
    clearFeaturedReelTimer(video);
    primeFeaturedReel(video);
    const generation = invalidateFeaturedReelGeneration(video);
    playFeaturedReel(video, generation);
    scheduleFeaturedReelWarm();
    return true;
  }

  function releaseFeaturedReelIntent(video) {
    if (explicitFeaturedReel !== video) return;
    explicitFeaturedReel = null;
    activeFeaturedReel = null;
    resetFeaturedReel(video);
    syncActiveFeaturedReel();
  }

  function scheduleFeaturedReel(video) {
    if (featuredReelTimers.has(video) || !video.paused) return;
    if (activeFeaturedReel !== video
      || !visibleFeaturedReels.has(video)
      || document.visibilityState !== "visible") {
      resetFeaturedReel(video);
      return;
    }
    const generation = invalidateFeaturedReelGeneration(video);
    const timer = setTimeout(() => {
      featuredReelTimers.delete(video);
      if (!isCurrentFeaturedReelActivation(video, generation) || !video.paused) return;
      playFeaturedReel(video, generation);
    }, getFeaturedReelHoldMs());
    featuredReelTimers.set(video, timer);
  }

  featuredReelVideos.forEach((video) => {
    video.addEventListener("playing", () => {
      const generation = featuredReelPlayGenerations.get(video);
      if (generation != null
        && isCurrentFeaturedReelActivation(video, generation)
        && !video.paused) {
        video.closest(".media-frame")?.classList.add("is-reel-playing");
        video.classList.add("is-playing");
      }
    });
    video.addEventListener("error", () => {
      if (pendingScreeningFeaturedReel === video) {
        pendingScreeningFeaturedReel = null;
        clearFeaturedReelScreeningPrimeTimer();
      }
      if (explicitFeaturedReel === video) featuredReelIntentFailures.add(video);
      resetFeaturedReel(video);
    });
  });

  function syncActiveFeaturedReel() {
    if (explicitFeaturedReel && !isFeaturedReelInViewport(explicitFeaturedReel)) {
      explicitFeaturedReel = null;
    }
    if (pendingScreeningFeaturedReel
      && visibleFeaturedReels.has(pendingScreeningFeaturedReel)) {
      const target = pendingScreeningFeaturedReel;
      pendingScreeningFeaturedReel = null;
      clearFeaturedReelScreeningPrimeTimer();
      activateFeaturedReelIntent(target);
      return;
    }
    const nextActiveFeaturedReel = explicitFeaturedReel || (!visibleFeaturedReels.size
      ? null
      : featuredReelMobileMedia.matches
        ? selectClosestVisibleReel(
            featuredReelVideos,
            visibleFeaturedReels,
            { width: window.innerWidth, height: window.innerHeight },
          )
        : featuredReelVideos.filter((video) => visibleFeaturedReels.has(video)).at(-1));
    activeFeaturedReel = nextActiveFeaturedReel;

    featuredReelVideos.forEach((video) => {
      if (video === activeFeaturedReel) {
        if (video === explicitFeaturedReel) {
          if (video.paused) activateFeaturedReelIntent(video);
        } else {
          scheduleFeaturedReel(video);
        }
      } else {
        resetFeaturedReel(video);
      }
    });
    scheduleFeaturedReelWarm();
  }

  const featuredReelObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                visibleFeaturedReels.add(entry.target);
              } else {
                visibleFeaturedReels.delete(entry.target);
              }
            });
            syncActiveFeaturedReel();
          },
          { threshold: [0, 0.35] },
        )
      : null;

  const featuredReelWarmObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                nearbyFeaturedReels.add(entry.target);
              } else {
                nearbyFeaturedReels.delete(entry.target);
              }
            });
            scheduleFeaturedReelWarm();
          },
          { rootMargin: "200% 0px", threshold: 0.01 },
        )
      : null;

  function handleFeaturedReelVisibility() {
    if (document.visibilityState !== "visible") {
      releaseWarmedFeaturedReel();
      featuredReelVideos.forEach(resetFeaturedReel);
    } else {
      syncActiveFeaturedReel();
    }
  }

  function handleFeaturedReelViewportChange() {
    if (featuredReelViewportFrame) return;
    featuredReelViewportFrame = window.requestAnimationFrame(() => {
      featuredReelViewportFrame = 0;
      syncActiveFeaturedReel();
    });
  }

  function handleFeaturedReelModeChange() {
    clearFeaturedReelScreeningPrimeTimer();
    activeFeaturedReel = null;
    explicitFeaturedReel = null;
    pendingScreeningFeaturedReel = null;
    featuredReelVideos.forEach(resetFeaturedReel);
    syncActiveFeaturedReel();
  }

  function handleFeaturedReelWarmReady() {
    featuredReelWarmReady = true;
    scheduleFeaturedReelWarm();
  }

  function handleFeaturedReelConnectionChange() {
    scheduleFeaturedReelWarm();
  }

  function getScreeningFeaturedReel(event) {
    const card = event.target?.closest?.('.watch-loop-card[href^="#"]');
    const href = card?.getAttribute("href") || "";
    if (!href.startsWith("#") || href.length < 2) return null;
    return document.getElementById(href.slice(1))
      ?.querySelector("[data-featured-reel-video]") || null;
  }

  function handleScreeningFeaturedReelPointerDown(event) {
    const video = getScreeningFeaturedReel(event);
    if (!video) return;
    clearFeaturedReelScreeningPrimeTimer();
    primeFeaturedReel(video);
    featuredReelScreeningPrimeTimer = setTimeout(() => {
      featuredReelScreeningPrimeTimer = 0;
      if (pendingScreeningFeaturedReel !== video && warmedFeaturedReel === video) {
        releaseWarmedFeaturedReel();
      }
    }, 500);
  }

  function handleScreeningFeaturedReelClick(event) {
    const video = getScreeningFeaturedReel(event);
    if (!video) return;
    clearFeaturedReelScreeningPrimeTimer();
    primeFeaturedReel(video);
    pendingScreeningFeaturedReel = video;
    if (visibleFeaturedReels.has(video)) {
      syncActiveFeaturedReel();
      return;
    }
    featuredReelScreeningPrimeTimer = setTimeout(() => {
      featuredReelScreeningPrimeTimer = 0;
      if (pendingScreeningFeaturedReel === video) pendingScreeningFeaturedReel = null;
      if (warmedFeaturedReel === video) releaseWarmedFeaturedReel();
    }, 3000);
  }

  function bindFeaturedReelIntent(video) {
    const panel = video.closest(".work-panel");
    const mediaFrame = video.closest(".media-frame");
    if (!panel || !mediaFrame) return;

    bindReelIntentSurface({
      video,
      surface: mediaFrame,
      hoverTarget: panel,
      mobileMedia: featuredReelMobileMedia,
      hasDestination: mediaFrame.matches(".media-frame-link"),
      activate: activateFeaturedReelIntent,
      release: releaseFeaturedReelIntent,
      isPreviewing: (candidate) => explicitFeaturedReel === candidate
        || candidate.classList.contains("is-playing")
        || !candidate.paused,
      consumeFailure: () => {
        if (!featuredReelIntentFailures.has(video)) return false;
        featuredReelIntentFailures.delete(video);
        return true;
      },
    });
  }

  function bindFeaturedReelLifecycle() {
    if (featuredReelLifecycleBound) return;
    featuredReelLifecycleBound = true;
    document.addEventListener("visibilitychange", handleFeaturedReelVisibility);
    window.addEventListener("scroll", handleFeaturedReelViewportChange, { passive: true });
    window.addEventListener("resize", handleFeaturedReelViewportChange);
    featuredReelMobileMedia.addEventListener?.("change", handleFeaturedReelModeChange);
    featuredReelConnection?.addEventListener?.("change", handleFeaturedReelConnectionChange);
    featuredReelVideos.forEach((video) => {
      featuredReelObserver?.observe(video);
      featuredReelWarmObserver?.observe(video);
    });
  }

  function suspendFeaturedReelLifecycle() {
    if (featuredReelViewportFrame) window.cancelAnimationFrame(featuredReelViewportFrame);
    featuredReelViewportFrame = 0;
    activeFeaturedReel = null;
    explicitFeaturedReel = null;
    pendingScreeningFeaturedReel = null;
    visibleFeaturedReels.clear();
    nearbyFeaturedReels.clear();
    clearFeaturedReelScreeningPrimeTimer();
    releaseWarmedFeaturedReel();
    featuredReelVideos.forEach(resetFeaturedReel);
    featuredReelObserver?.disconnect();
    featuredReelWarmObserver?.disconnect();
    if (featuredReelLifecycleBound) {
      document.removeEventListener("visibilitychange", handleFeaturedReelVisibility);
      window.removeEventListener("scroll", handleFeaturedReelViewportChange);
      window.removeEventListener("resize", handleFeaturedReelViewportChange);
      featuredReelMobileMedia.removeEventListener?.("change", handleFeaturedReelModeChange);
      featuredReelConnection?.removeEventListener?.("change", handleFeaturedReelConnectionChange);
      featuredReelLifecycleBound = false;
    }
  }

  function handleFeaturedReelPageShow(event) {
    if (event.persisted) {
      featuredReelWarmReady = true;
      bindFeaturedReelLifecycle();
    }
  }

  function handleFeaturedReelPageHide(event) {
    suspendFeaturedReelLifecycle();
    if (!event.persisted) {
      window.removeEventListener("pagehide", handleFeaturedReelPageHide);
      window.removeEventListener("pageshow", handleFeaturedReelPageShow);
      featuredReelHeroImage?.removeEventListener("load", handleFeaturedReelWarmReady);
    }
  }

  bindFeaturedReelLifecycle();
  featuredReelVideos.forEach(bindFeaturedReelIntent);
  document.addEventListener("pointerdown", handleScreeningFeaturedReelPointerDown);
  document.addEventListener("click", handleScreeningFeaturedReelClick);
  if (!featuredReelWarmReady) {
    featuredReelHeroImage?.addEventListener("load", handleFeaturedReelWarmReady, { once: true });
  }
  window.addEventListener("pagehide", handleFeaturedReelPageHide);
  window.addEventListener("pageshow", handleFeaturedReelPageShow);

  const ARCHIVE_REEL_HOLD_MS = 1400;
  const archiveReelMobileMedia = window.matchMedia("(max-width: 820px)");
  const archiveReelVideos = Array.from(
    document.querySelectorAll("[data-archive-reel-video]"),
  );
  const visibleArchiveReels = new Set();
  const archiveReelTimers = new Map();
  const archiveReelActivationGenerations = new WeakMap();
  const archiveReelPlayGenerations = new WeakMap();
  const archiveReelIntentFailures = new WeakSet();
  let activeArchiveReel = null;
  let explicitArchiveReel = null;
  let archiveReelLifecycleBound = false;
  let archiveReelViewportFrame = 0;

  function getArchiveReelGeneration(video) {
    return archiveReelActivationGenerations.get(video) || 0;
  }

  function invalidateArchiveReelGeneration(video) {
    const generation = getArchiveReelGeneration(video) + 1;
    archiveReelActivationGenerations.set(video, generation);
    archiveReelPlayGenerations.delete(video);
    return generation;
  }

  function isArchiveReelInViewport(video) {
    const rect = video.getBoundingClientRect();
    return rect.bottom > 0
      && rect.right > 0
      && rect.top < window.innerHeight
      && rect.left < window.innerWidth;
  }

  function isCurrentArchiveReelActivation(video, generation) {
    return getArchiveReelGeneration(video) === generation
      && activeArchiveReel === video
      && (explicitArchiveReel === video
        ? isArchiveReelInViewport(video)
        : visibleArchiveReels.has(video))
      && document.visibilityState === "visible";
  }

  function clearArchiveReelTimer(video) {
    const timer = archiveReelTimers.get(video);
    if (timer) clearTimeout(timer);
    archiveReelTimers.delete(video);
  }

  function restoreArchiveReelPreload(video) {
    if (video.preload === "none") return;
    video.preload = "none";
    if (video.paused) video.load();
  }

  function primeArchiveReel(video) {
    if (!video?.paused || video.preload === "metadata") return;
    video.preload = "metadata";
    video.load();
  }

  function resetArchiveReel(video) {
    clearArchiveReelTimer(video);
    invalidateArchiveReelGeneration(video);
    if (explicitArchiveReel === video) explicitArchiveReel = null;
    video.classList.remove("is-playing");
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // The poster remains visible if media metadata is not ready.
    }
    restoreArchiveReelPreload(video);
  }

  function playArchiveReel(video, generation) {
    clearArchiveReelTimer(video);
    if (!isCurrentArchiveReelActivation(video, generation) || !video.paused) return;
    archiveReelPlayGenerations.set(video, generation);
    video.muted = true;
    video.play().then(
      () => {
        if (isCurrentArchiveReelActivation(video, generation)
          && archiveReelPlayGenerations.get(video) === generation
          && !video.paused) {
          video.classList.add("is-playing");
        }
      },
      () => {
        if (isCurrentArchiveReelActivation(video, generation)
          && archiveReelPlayGenerations.get(video) === generation) {
          if (explicitArchiveReel === video) archiveReelIntentFailures.add(video);
          activeArchiveReel = null;
          resetArchiveReel(video);
        }
      },
    );
  }

  function scheduleArchiveReel(video) {
    if (archiveReelTimers.has(video) || !video.paused) return;
    if (activeArchiveReel !== video
      || !visibleArchiveReels.has(video)
      || document.visibilityState !== "visible") {
      resetArchiveReel(video);
      return;
    }
    const generation = invalidateArchiveReelGeneration(video);
    const timer = setTimeout(() => {
      archiveReelTimers.delete(video);
      playArchiveReel(video, generation);
    }, ARCHIVE_REEL_HOLD_MS);
    archiveReelTimers.set(video, timer);
  }

  function activateArchiveReelIntent(video) {
    if (!video
      || !video.paused
      || !isArchiveReelInViewport(video)
      || document.visibilityState !== "visible") return false;
    archiveReelIntentFailures.delete(video);
    explicitArchiveReel = video;
    activeArchiveReel = video;
    archiveReelVideos.forEach((candidate) => {
      if (candidate !== video) resetArchiveReel(candidate);
    });
    clearArchiveReelTimer(video);
    primeArchiveReel(video);
    const generation = invalidateArchiveReelGeneration(video);
    playArchiveReel(video, generation);
    return true;
  }

  function releaseArchiveReelIntent(video) {
    if (explicitArchiveReel !== video) return;
    explicitArchiveReel = null;
    activeArchiveReel = null;
    resetArchiveReel(video);
    syncActiveArchiveReel();
  }

  archiveReelVideos.forEach((video) => {
    video.addEventListener("error", () => {
      const ownsPlayback = activeArchiveReel === video;
      if (ownsPlayback && explicitArchiveReel === video) {
        archiveReelIntentFailures.add(video);
      }
      if (ownsPlayback) activeArchiveReel = null;
      resetArchiveReel(video);
    });
  });

  function syncActiveArchiveReel() {
    if (explicitArchiveReel && !isArchiveReelInViewport(explicitArchiveReel)) {
      explicitArchiveReel = null;
    }
    activeArchiveReel = explicitArchiveReel || selectClosestVisibleReel(
      archiveReelVideos,
      visibleArchiveReels,
      { width: window.innerWidth, height: window.innerHeight },
    );

    archiveReelVideos.forEach((video) => {
      if (video === activeArchiveReel) {
        if (video === explicitArchiveReel) {
          if (video.paused) activateArchiveReelIntent(video);
        } else {
          scheduleArchiveReel(video);
        }
      } else {
        resetArchiveReel(video);
      }
    });
  }

  const archiveReelObserver =
    "IntersectionObserver" in window
      ? new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                visibleArchiveReels.add(entry.target);
              } else {
                visibleArchiveReels.delete(entry.target);
              }
            });
            syncActiveArchiveReel();
          },
          { threshold: [0, 0.35] },
        )
      : null;

  function handleArchiveReelViewportChange() {
    if (archiveReelViewportFrame) return;
    archiveReelViewportFrame = window.requestAnimationFrame(() => {
      archiveReelViewportFrame = 0;
      syncActiveArchiveReel();
    });
  }

  function handleArchiveReelVisibility() {
    if (document.visibilityState !== "visible") {
      activeArchiveReel = null;
      explicitArchiveReel = null;
      archiveReelVideos.forEach(resetArchiveReel);
    } else {
      syncActiveArchiveReel();
    }
  }

  function handleArchiveReelModeChange() {
    activeArchiveReel = null;
    explicitArchiveReel = null;
    archiveReelVideos.forEach(resetArchiveReel);
    syncActiveArchiveReel();
  }

  function bindArchiveReelIntent(video) {
    const card = video.closest(".archive-card");
    const media = video.closest(".archive-card-media");
    if (!card || !media) return;

    bindReelIntentSurface({
      video,
      surface: media,
      hoverTarget: card,
      mobileMedia: archiveReelMobileMedia,
      hasDestination: Boolean(media.closest("a[href]")),
      activate: activateArchiveReelIntent,
      release: releaseArchiveReelIntent,
      isPreviewing: (candidate) => explicitArchiveReel === candidate
        || candidate.classList.contains("is-playing")
        || !candidate.paused,
      consumeFailure: () => {
        if (!archiveReelIntentFailures.has(video)) return false;
        archiveReelIntentFailures.delete(video);
        return true;
      },
    });
  }

  function bindArchiveReelLifecycle() {
    if (!archiveReelVideos.length || archiveReelLifecycleBound) return;
    archiveReelLifecycleBound = true;
    document.addEventListener("visibilitychange", handleArchiveReelVisibility);
    window.addEventListener("scroll", handleArchiveReelViewportChange, { passive: true });
    window.addEventListener("resize", handleArchiveReelViewportChange);
    archiveReelMobileMedia.addEventListener?.("change", handleArchiveReelModeChange);
    archiveReelVideos.forEach((video) => archiveReelObserver?.observe(video));
  }

  function suspendArchiveReelLifecycle() {
    visibleArchiveReels.clear();
    activeArchiveReel = null;
    explicitArchiveReel = null;
    archiveReelVideos.forEach(resetArchiveReel);
    archiveReelObserver?.disconnect();
    if (archiveReelViewportFrame) window.cancelAnimationFrame(archiveReelViewportFrame);
    archiveReelViewportFrame = 0;
    if (archiveReelLifecycleBound) {
      window.removeEventListener("scroll", handleArchiveReelViewportChange);
      window.removeEventListener("resize", handleArchiveReelViewportChange);
      document.removeEventListener("visibilitychange", handleArchiveReelVisibility);
      archiveReelMobileMedia.removeEventListener?.("change", handleArchiveReelModeChange);
      archiveReelLifecycleBound = false;
    }
  }

  function handleArchiveReelPageShow(event) {
    if (event.persisted) bindArchiveReelLifecycle();
  }

  function handleArchiveReelPageHide(event) {
    suspendArchiveReelLifecycle();
    if (!event.persisted) {
      window.removeEventListener("pagehide", handleArchiveReelPageHide);
      window.removeEventListener("pageshow", handleArchiveReelPageShow);
    }
  }

  if (archiveReelVideos.length) {
    archiveReelVideos.forEach(bindArchiveReelIntent);
    bindArchiveReelLifecycle();
    window.addEventListener("pagehide", handleArchiveReelPageHide);
    window.addEventListener("pageshow", handleArchiveReelPageShow);
  }
}

document.querySelectorAll("[data-contact-form]").forEach((form) => {
  const startedAt = form.querySelector("[data-contact-started-at]");
  const status = form.querySelector("[data-contact-status]");
  if (startedAt) startedAt.value = String(Date.now());

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const submit = form.querySelector("[type='submit']");
    const formData = new FormData(form);

    submit?.setAttribute("disabled", "disabled");
    if (status) {
      status.textContent = "";
      status.dataset.state = "pending";
    }

    try {
      const response = await fetch(form.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new URLSearchParams(formData),
      });
      const result = await response.json().catch(() => ({ ok: false }));
      if (!response.ok || !result.ok) throw new Error("Contact request failed");

      form.reset();
      if (startedAt) startedAt.value = String(Date.now());
      if (status) {
        status.textContent = status.dataset.success || "Sent.";
        status.dataset.state = "success";
      }
    } catch {
      if (status) {
        status.textContent = status.dataset.error || "Please try again later.";
        status.dataset.state = "error";
      }
    } finally {
      submit?.removeAttribute("disabled");
    }
  });
});
