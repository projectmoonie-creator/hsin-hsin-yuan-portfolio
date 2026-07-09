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

