import { animate } from "./vendor/anime.esm.min.js";
import { initAmbientBackground } from "./ambient-background.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const sections = Array.from(document.querySelectorAll(".section"));
  initAmbientBackground(document.querySelector(".light-beam-layer"));
  const lightState = {
    x: 56,
    y: 24,
    beamOpacity: 0,
    beamLeftX: -10,
    beamRightX: 58,
    beamY: -20,
    beamScale: 1,
  };
  let lightAnimation;

  function renderLightState() {
    const rootStyle = document.documentElement.style;
    rootStyle.setProperty("--light-x", `${lightState.x}%`);
    rootStyle.setProperty("--light-y", `${lightState.y}%`);
    rootStyle.setProperty("--beam-opacity", String(lightState.beamOpacity));
    rootStyle.setProperty("--beam-left-x", `${lightState.beamLeftX}vw`);
    rootStyle.setProperty("--beam-right-x", `${lightState.beamRightX}vw`);
    rootStyle.setProperty("--beam-y", `${lightState.beamY}vh`);
    rootStyle.setProperty("--beam-scale", String(lightState.beamScale));
  }

  function animateLightState(target, duration = 1200) {
    lightAnimation?.pause();
    lightAnimation = animate(lightState, {
      ...target,
      duration,
      ease: "outCubic",
      onUpdate: renderLightState,
    });
  }

  window.setTimeout(() => {
    animateLightState({ beamOpacity: 0.72, beamY: -13, beamScale: 1.03 }, 1800);
  }, 500);

  document.querySelectorAll("[data-horizontal-scroll]").forEach((section) => {
    const track = section.querySelector(".works-track");
    if (!track) return;

    section.addEventListener(
      "wheel",
      (event) => {
        const canScrollHorizontally = track.scrollWidth > track.clientWidth;
        if (!canScrollHorizontally) return;

        const atStart = track.scrollLeft <= 0;
        const atEnd = Math.ceil(track.scrollLeft + track.clientWidth) >= track.scrollWidth;
        const goingLeft = event.deltaY < 0;
        const goingRight = event.deltaY > 0;

        if ((goingLeft && atStart) || (goingRight && atEnd)) return;

        event.preventDefault();
        track.scrollLeft += event.deltaY;
      },
      { passive: false },
    );
  });

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
      copies.slice(1).forEach((copy) => copy.remove());
      sequenceWidth = sequence.getBoundingClientRect().width;
      if (!sequenceWidth) return;

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

  if ("IntersectionObserver" in window) {
    const lightObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-lit", entry.isIntersecting);
        });
      },
      {
        rootMargin: "-18% 0px -32%",
        threshold: 0.18,
      },
    );

    sections.forEach((section) => {
      lightObserver.observe(section);
    });
  } else {
    sections.forEach((section) => {
      section.classList.add("is-lit");
    });
  }

  function updateGuidingLight() {
    if (!sections.length) return;

    const viewportCenter = window.innerHeight * 0.48;
    let activeSection = sections[0];
    let closestDistance = Infinity;

    sections.forEach((section) => {
      const rect = section.getBoundingClientRect();
      const sectionCenter = rect.top + rect.height * 0.38;
      const distance = Math.abs(sectionCenter - viewportCenter);
      if (distance < closestDistance) {
        closestDistance = distance;
        activeSection = section;
      }
    });

    const activeIndex = Math.max(0, sections.indexOf(activeSection));
    const lightY = Math.min(76, Math.max(22, 24 + activeIndex * 8));
    const lightX = activeSection.classList.contains("works-section") ? 82 : 56;
    const isWorks = activeSection.classList.contains("works-section");

    sections.forEach((section) => {
      section.classList.toggle("is-guided", section === activeSection);
    });
    activeSection.classList.add("is-lit");
    animateLightState(
      {
        x: lightX,
        y: lightY,
        beamOpacity: isWorks ? 0.82 : 0.7,
        beamLeftX: isWorks ? -18 : -10,
        beamRightX: isWorks ? 52 : 58,
        beamY: isWorks ? -8 : -13,
        beamScale: isWorks ? 1.08 : 1.03,
      },
      950,
    );
  }

  let lightFrame = 0;
  function scheduleGuidingLight() {
    if (lightFrame) return;
    lightFrame = window.requestAnimationFrame(() => {
      lightFrame = 0;
      updateGuidingLight();
    });
  }

  updateGuidingLight();
  window.addEventListener("scroll", scheduleGuidingLight, { passive: true });
  window.addEventListener("resize", scheduleGuidingLight);

  const supportsPointerGlow = window.matchMedia("(pointer: fine)").matches;
  if (supportsPointerGlow) {
    const glowTargets = Array.from(document.querySelectorAll(".hero-media, .work-panel, .contact-form"));

    function getEdgeProximity(element, x, y) {
      const { width, height } = element.getBoundingClientRect();
      const cx = width / 2;
      const cy = height / 2;
      const dx = x - cx;
      const dy = y - cy;
      const kx = dx === 0 ? Infinity : cx / Math.abs(dx);
      const ky = dy === 0 ? Infinity : cy / Math.abs(dy);
      return Math.min(Math.max(1 / Math.min(kx, ky), 0), 1);
    }

    function getCursorAngle(element, x, y) {
      const { width, height } = element.getBoundingClientRect();
      const dx = x - width / 2;
      const dy = y - height / 2;
      if (dx === 0 && dy === 0) return 0;
      const degrees = (Math.atan2(dy, dx) * 180) / Math.PI + 90;
      return degrees < 0 ? degrees + 360 : degrees;
    }

    glowTargets.forEach((target) => {
      target.classList.add("edge-glow-card");
      target.style.setProperty("--edge-proximity", "0");
      target.style.setProperty("--cursor-angle", "120deg");
      if (!target.querySelector(":scope > .edge-light")) {
        const light = document.createElement("span");
        light.className = "edge-light";
        light.setAttribute("aria-hidden", "true");
        target.append(light);
      }

      let edgeFade;
      target.addEventListener("pointermove", (event) => {
        const rect = target.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const edge = getEdgeProximity(target, x, y);
        const angle = getCursorAngle(target, x, y);
        edgeFade?.pause();
        target.style.setProperty("--edge-proximity", `${(edge * 100).toFixed(3)}`);
        target.style.setProperty("--cursor-angle", `${angle.toFixed(3)}deg`);
      });

      target.addEventListener("pointerleave", () => {
        const state = {
          edge: Number.parseFloat(target.style.getPropertyValue("--edge-proximity")) || 0,
        };
        edgeFade = animate(state, {
          edge: 0,
          duration: 520,
          ease: "outCubic",
          onUpdate: () => {
            target.style.setProperty("--edge-proximity", state.edge.toFixed(3));
          },
        });
      });
    });
  }
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
