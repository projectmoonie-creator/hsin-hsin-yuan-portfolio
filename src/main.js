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
    const observedVideos = new WeakSet();
    const videoObserver =
      "IntersectionObserver" in window
        ? new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                const video = entry.target;
                if (
                  entry.isIntersecting &&
                  entry.intersectionRatio >= 0.35 &&
                  document.visibilityState === "visible"
                ) {
                  video.play().catch(() => {});
                } else {
                  video.pause();
                }
              });
            },
            { root: viewport, threshold: [0, 0.35] },
          )
        : null;

    function observeWatchLoopVideos(root) {
      root.querySelectorAll("[data-watch-loop-video]").forEach((video) => {
        if (observedVideos.has(video)) return;
        video.muted = true;
        observedVideos.add(video);
        videoObserver?.observe(video);
      });
    }

    function pauseWatchLoopVideos() {
      track.querySelectorAll("[data-watch-loop-video]").forEach((video) => video.pause());
    }

    function handleDocumentVisibility() {
      if (document.visibilityState !== "visible") {
        pauseWatchLoopVideos();
        return;
      }

      track.querySelectorAll("[data-watch-loop-video]").forEach((video) => {
        videoObserver?.unobserve(video);
        videoObserver?.observe(video);
      });
    }

    function syncLoopCopies() {
      const copies = Array.from(track.querySelectorAll("[data-watch-loop-sequence]"));
      copies.slice(1).forEach((copy) => {
        copy.querySelectorAll("[data-watch-loop-video]").forEach((video) => {
          videoObserver?.unobserve(video);
          video.pause();
        });
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
        clone.querySelectorAll("[data-watch-loop-video]").forEach((video) => {
          video.preload = "none";
        });
        track.append(clone);
        observeWatchLoopVideos(clone);
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
    observeWatchLoopVideos(sequence);
    syncLoopCopies();
    viewport.addEventListener("scroll", consumeNativeScroll, { passive: true });
    document.addEventListener("visibilitychange", handleDocumentVisibility);

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
        { rootMargin: "20% 0px", threshold: 0.01 },
      );
      loopObserver.observe(loop);

      window.addEventListener("pagehide", () => {
        stopLoop();
        pauseWatchLoopVideos();
        document.removeEventListener("visibilitychange", handleDocumentVisibility);
        videoObserver?.disconnect();
        loopObserver.disconnect();
        resizeObserver?.disconnect();
      });
    } else {
      isVisible = true;
      startLoop();

      window.addEventListener("pagehide", () => {
        stopLoop();
        pauseWatchLoopVideos();
        document.removeEventListener("visibilitychange", handleDocumentVisibility);
        resizeObserver?.disconnect();
      });
    }

    if (isVisible) startLoop();
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
