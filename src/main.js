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

const showreelMedia = document.querySelector("#showreel");
const showreelPlay = document.querySelector("[data-showreel-play]");
const showreelVideo = document.querySelector("[data-showreel-video]");

function playShowreel() {
  if (!showreelVideo) return;

  showreelVideo.controls = true;
  showreelVideo.play().catch(() => {
    // Browser autoplay policies can block play; controls remain available.
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

showreelVideo?.addEventListener("ended", () => {
  showreelMedia?.classList.remove("is-playing");
  showreelVideo.currentTime = 0;
});
