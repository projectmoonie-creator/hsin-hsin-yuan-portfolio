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

window.addEventListener("pageshow", (event) => {
  if (!event.persisted) {
    scrollToTopInstant();
    if (hadInitialHash) {
      window.requestAnimationFrame(scrollToTopInstant);
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

  const FEATURED_REEL_HOLD_MS = 1400;
  const featuredReelVideos = Array.from(
    document.querySelectorAll("[data-featured-reel-video]"),
  );
  const visibleFeaturedReels = new Set();
  const featuredReelTimers = new Map();
  const featuredReelActivationGenerations = new WeakMap();
  const featuredReelPlayGenerations = new WeakMap();
  let activeFeaturedReel = null;
  let featuredReelLifecycleBound = false;

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
      && visibleFeaturedReels.has(video)
      && document.visibilityState === "visible";
  }

  function clearFeaturedReelTimer(video) {
    const timer = featuredReelTimers.get(video);
    if (timer) clearTimeout(timer);
    featuredReelTimers.delete(video);
  }

  function resetFeaturedReel(video) {
    clearFeaturedReelTimer(video);
    invalidateFeaturedReelGeneration(video);
    video.classList.remove("is-playing");
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // The poster remains visible if media metadata is not ready.
    }
  }

  function playFeaturedReel(video, generation) {
    clearFeaturedReelTimer(video);
    if (!isCurrentFeaturedReelActivation(video, generation) || !video.paused) return;
    featuredReelPlayGenerations.set(video, generation);
    video.muted = true;
    video.play().catch(() => {
      if (isCurrentFeaturedReelActivation(video, generation)
        && featuredReelPlayGenerations.get(video) === generation) {
        resetFeaturedReel(video);
      }
    });
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
    }, FEATURED_REEL_HOLD_MS);
    featuredReelTimers.set(video, timer);
  }

  featuredReelVideos.forEach((video) => {
    video.addEventListener("playing", () => {
      const generation = featuredReelPlayGenerations.get(video);
      if (generation != null
        && isCurrentFeaturedReelActivation(video, generation)
        && !video.paused) {
        video.classList.add("is-playing");
      }
    });
    video.addEventListener("error", () => resetFeaturedReel(video));
  });

  function syncActiveFeaturedReel() {
    const nextActiveFeaturedReel = visibleFeaturedReels.size
      ? featuredReelVideos.filter((video) => visibleFeaturedReels.has(video)).at(-1)
      : null;
    activeFeaturedReel = nextActiveFeaturedReel;

    featuredReelVideos.forEach((video) => {
      if (video === activeFeaturedReel) {
        scheduleFeaturedReel(video);
      } else {
        resetFeaturedReel(video);
      }
    });
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

  function handleFeaturedReelVisibility() {
    if (document.visibilityState !== "visible") {
      featuredReelVideos.forEach(resetFeaturedReel);
    } else {
      syncActiveFeaturedReel();
    }
  }

  function bindFeaturedReelLifecycle() {
    if (featuredReelLifecycleBound) return;
    featuredReelLifecycleBound = true;
    document.addEventListener("visibilitychange", handleFeaturedReelVisibility);
    featuredReelVideos.forEach((video) => featuredReelObserver?.observe(video));
  }

  function suspendFeaturedReelLifecycle() {
    activeFeaturedReel = null;
    visibleFeaturedReels.clear();
    featuredReelVideos.forEach(resetFeaturedReel);
    featuredReelObserver?.disconnect();
    if (featuredReelLifecycleBound) {
      document.removeEventListener("visibilitychange", handleFeaturedReelVisibility);
      featuredReelLifecycleBound = false;
    }
  }

  function handleFeaturedReelPageShow(event) {
    if (event.persisted) bindFeaturedReelLifecycle();
  }

  function handleFeaturedReelPageHide(event) {
    suspendFeaturedReelLifecycle();
    if (!event.persisted) {
      window.removeEventListener("pagehide", handleFeaturedReelPageHide);
      window.removeEventListener("pageshow", handleFeaturedReelPageShow);
    }
  }

  bindFeaturedReelLifecycle();
  window.addEventListener("pagehide", handleFeaturedReelPageHide);
  window.addEventListener("pageshow", handleFeaturedReelPageShow);

  const ARCHIVE_REEL_HOLD_MS = 1400;
  const archiveReelVideos = Array.from(
    document.querySelectorAll("[data-archive-reel-video]"),
  );
  const visibleArchiveReels = new Set();
  const archiveReelTimers = new Map();

  function clearArchiveReelTimer(video) {
    const timer = archiveReelTimers.get(video);
    if (timer) clearTimeout(timer);
    archiveReelTimers.delete(video);
  }

  function resetArchiveReel(video) {
    clearArchiveReelTimer(video);
    video.classList.remove("is-playing");
    video.pause();
    try {
      video.currentTime = 0;
    } catch {
      // The poster remains visible if media metadata is not ready.
    }
  }

  function playArchiveReel(video) {
    clearArchiveReelTimer(video);
    if (document.visibilityState !== "visible") {
      resetArchiveReel(video);
      return;
    }
    video.muted = true;
    video.play().catch(() => resetArchiveReel(video));
  }

  function scheduleArchiveReel(video) {
    if (archiveReelTimers.has(video) || !video.paused) return;
    if (document.visibilityState !== "visible") {
      resetArchiveReel(video);
      return;
    }
    const timer = setTimeout(() => playArchiveReel(video), ARCHIVE_REEL_HOLD_MS);
    archiveReelTimers.set(video, timer);
  }

  archiveReelVideos.forEach((video) => {
    video.addEventListener("playing", () => video.classList.add("is-playing"));
    video.addEventListener("error", () => resetArchiveReel(video));
  });

  function syncActiveArchiveReel() {
    const activeArchiveReel = visibleArchiveReels.size
      ? archiveReelVideos.filter((video) => visibleArchiveReels.has(video)).at(-1)
      : null;

    archiveReelVideos.forEach((video) => {
      if (video === activeArchiveReel) {
        scheduleArchiveReel(video);
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

  archiveReelVideos.forEach((video) => archiveReelObserver?.observe(video));

  function handleArchiveReelVisibility() {
    if (document.visibilityState !== "visible") {
      archiveReelVideos.forEach(resetArchiveReel);
    } else {
      syncActiveArchiveReel();
    }
  }

  document.addEventListener("visibilitychange", handleArchiveReelVisibility);
  window.addEventListener("pagehide", () => {
    visibleArchiveReels.clear();
    archiveReelVideos.forEach(resetArchiveReel);
    archiveReelObserver?.disconnect();
    document.removeEventListener("visibilitychange", handleArchiveReelVisibility);
  });
}

const showreelMedia = document.querySelector("#showreel");
const showreelPlay = document.querySelector("[data-showreel-play]");
const showreelVideo = document.querySelector("[data-showreel-video]");

function playShowreel() {
  if (!showreelVideo) return;

  showreelVideo.muted = true;
  showreelVideo.defaultMuted = true;
  showreelVideo.controls = true;
  showreelMedia?.classList.add("is-playing");
  showreelVideo.play().catch(() => {
    // Browser policies can still block scripted play; keep native controls visible.
  });
}

showreelPlay?.addEventListener("click", (event) => {
  event.stopPropagation();
  playShowreel();
});

showreelMedia?.addEventListener("click", (event) => {
  if (event.target === showreelPlay || showreelPlay?.contains(event.target)) return;
  if (!showreelVideo?.paused) return;
  playShowreel();
});

showreelVideo?.addEventListener("play", () => {
  showreelMedia?.classList.add("is-playing");
});

showreelVideo?.addEventListener("pause", () => {
  if (showreelVideo.currentTime === 0 || showreelVideo.ended) {
    showreelMedia?.classList.remove("is-playing");
  }
});

showreelVideo?.addEventListener("ended", () => {
  showreelMedia?.classList.remove("is-playing");
  showreelVideo.currentTime = 0;
  showreelVideo.controls = false;
});

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
