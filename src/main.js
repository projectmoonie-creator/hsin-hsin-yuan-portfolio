import { initWatchLoops } from "./watch-loop.js";

initWatchLoops();

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
