import { portraitSceneAt, workSceneAt } from "./scene-state.js";

if ("scrollRestoration" in window.history) {
  window.history.scrollRestoration = "manual";
}

window.addEventListener("pageshow", (event) => {
  if (!event.persisted && !window.location.hash) {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }
});

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const desktopScenes = window.matchMedia("(min-width: 821px)");
const portraitCarrier = document.querySelector("[data-portrait-carrier]");
const workTheatre = document.querySelector("[data-work-theatre]");
const practiceButtons = Array.from(document.querySelectorAll("[data-practice-mode]"));
const practiceScenes = Array.from(document.querySelectorAll("[data-practice-scene]"));
const workScenes = Array.from(document.querySelectorAll("[data-work-scene]"));
const workCurrent = document.querySelector("[data-work-current]");

let activeMode = -1;
let activeWork = -1;
let manualMode = null;
let manualModeScrollY = 0;
let scheduledFrame = 0;

function clampProgress(element) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  const distance = Math.max(1, rect.height - window.innerHeight);
  return Math.min(1, Math.max(0, -rect.top / distance));
}

function setPracticeMode(index) {
  const next = Math.min(Math.max(index, 0), Math.max(0, practiceButtons.length - 1));
  if (next === activeMode) return;
  activeMode = next;

  practiceButtons.forEach((button, buttonIndex) => {
    const isActive = buttonIndex === next;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });

  practiceScenes.forEach((scene, sceneIndex) => {
    const isActive = sceneIndex === next;
    scene.classList.toggle("is-active", isActive);
    if (document.documentElement.classList.contains("has-scene-controller")) {
      scene.setAttribute("aria-hidden", String(!isActive));
    } else {
      scene.removeAttribute("aria-hidden");
    }
  });

  const modeName = practiceButtons[next]?.dataset.practiceMode || "documentary";
  const signalName = practiceScenes[next]?.dataset.signal || "coral";
  portraitCarrier?.setAttribute("data-active-mode", modeName);
  portraitCarrier?.setAttribute("data-signal", signalName);
  portraitCarrier?.style.setProperty("--mode-index", String(next));
}

function setWorkScene(index) {
  const next = Math.min(Math.max(index, 0), Math.max(0, workScenes.length - 1));
  if (next === activeWork) return;
  activeWork = next;

  workScenes.forEach((scene, sceneIndex) => {
    const isActive = sceneIndex === next;
    scene.classList.toggle("is-active", isActive);
    if (document.documentElement.classList.contains("has-scene-controller")) {
      scene.setAttribute("aria-hidden", String(!isActive));
    } else {
      scene.removeAttribute("aria-hidden");
    }
  });

  workTheatre?.setAttribute("data-active-work", String(next));
  if (workCurrent) workCurrent.textContent = String(next + 1).padStart(2, "0");
}

function updateScenes() {
  scheduledFrame = 0;
  if (reducedMotion || !desktopScenes.matches) return;

  if (portraitCarrier) {
    const portraitProgress = clampProgress(portraitCarrier);
    const portraitState = portraitSceneAt(portraitProgress);
    if (manualMode !== null && Math.abs(window.scrollY - manualModeScrollY) > window.innerHeight * 0.25) {
      manualMode = null;
    }
    const mode = portraitState.phase === "practice" && manualMode !== null ? manualMode : portraitState.mode;
    portraitCarrier.style.setProperty("--portrait-progress", portraitProgress.toFixed(4));
    portraitCarrier.dataset.phase = portraitState.phase;
    setPracticeMode(mode);
  }

  if (workTheatre && workScenes.length) {
    const workProgress = clampProgress(workTheatre);
    workTheatre.style.setProperty("--work-progress", workProgress.toFixed(4));
    setWorkScene(workSceneAt(workProgress, workScenes.length));
  }
}

function scheduleSceneUpdate() {
  if (scheduledFrame) return;
  scheduledFrame = window.requestAnimationFrame(updateScenes);
}

practiceButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    manualMode = index;
    manualModeScrollY = window.scrollY;
    setPracticeMode(index);
  });
});

if (!reducedMotion && desktopScenes.matches) {
  document.documentElement.classList.add("has-scene-controller");
  setPracticeMode(0);
  setWorkScene(0);
  updateScenes();
  window.addEventListener("scroll", scheduleSceneUpdate, { passive: true });
  window.addEventListener("resize", scheduleSceneUpdate);
} else {
  setPracticeMode(0);
  setWorkScene(0);
}

desktopScenes.addEventListener?.("change", () => window.location.reload());

const showreelMedia = document.querySelector("#showreel");
const showreelVideo = document.querySelector("[data-showreel-video]");
const showreelControls = Array.from(document.querySelectorAll("[data-showreel-play], [data-showreel-trigger]"));

function playShowreel() {
  if (!showreelVideo) return;
  showreelVideo.muted = true;
  showreelVideo.defaultMuted = true;
  showreelVideo.controls = true;
  showreelMedia?.classList.add("is-playing");
  showreelVideo.play().catch(() => {
    showreelVideo.controls = true;
  });
}

showreelControls.forEach((control) => {
  control.addEventListener("click", (event) => {
    event.stopPropagation();
    playShowreel();
  });
});

showreelMedia?.addEventListener("click", (event) => {
  if (event.target.closest("button")) return;
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
