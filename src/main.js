const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (!prefersReducedMotion) {
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
}

const showreelOpen = document.querySelector("[data-showreel-open]");
const showreelModal = document.querySelector("[data-showreel-modal]");
const showreelClose = document.querySelector("[data-showreel-close]");
const showreelVideo = showreelModal?.querySelector("video");

function closeShowreel() {
  if (!showreelModal) return;

  showreelVideo?.pause();
  if (showreelVideo) showreelVideo.currentTime = 0;

  if (typeof showreelModal.close === "function" && showreelModal.open) {
    showreelModal.close();
  } else {
    showreelModal.removeAttribute("open");
  }
}

showreelOpen?.addEventListener("click", () => {
  if (!showreelModal) return;

  if (typeof showreelModal.showModal === "function") {
    showreelModal.showModal();
  } else {
    showreelModal.setAttribute("open", "");
  }

  showreelVideo?.play().catch(() => {
    // Browser autoplay policies can block play; controls remain available.
  });
});

showreelClose?.addEventListener("click", closeShowreel);

showreelModal?.addEventListener("click", (event) => {
  if (event.target === showreelModal) closeShowreel();
});

showreelModal?.addEventListener("close", () => {
  showreelVideo?.pause();
});
