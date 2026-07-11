import { animate } from "./vendor/anime.esm.min.js";

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
  const sections = Array.from(document.querySelectorAll(".section"));
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

document.querySelectorAll("[data-about-tabs]").forEach((tabs) => {
  const buttons = Array.from(tabs.querySelectorAll("[data-about-tab]"));
  const panels = Array.from(tabs.querySelectorAll("[data-about-panel]"));

  function activateTab(target) {
    buttons.forEach((button) => {
      const isActive = button.dataset.aboutTab === target;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });

    panels.forEach((panel) => {
      const isActive = panel.dataset.aboutPanel === target;
      panel.classList.toggle("is-active", isActive);
      panel.hidden = !isActive;
    });
  }

  buttons.forEach((button, index) => {
    button.addEventListener("click", () => {
      activateTab(button.dataset.aboutTab);
    });

    button.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
      event.preventDefault();
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const next = buttons[(index + direction + buttons.length) % buttons.length];
      next.focus();
      activateTab(next.dataset.aboutTab);
    });
  });
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
