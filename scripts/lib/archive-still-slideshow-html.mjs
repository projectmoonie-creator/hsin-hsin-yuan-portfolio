import {
  createArchiveStillSlideshowTimeline,
  validateArchiveStillSlideshowRecipe,
} from "./archive-still-slideshow.mjs";

function escapeAttribute(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function percent(value) {
  return Number((value * 100).toFixed(4));
}

export function renderArchiveStillSlideshowHtml(input) {
  const recipe = validateArchiveStillSlideshowRecipe(input);
  const timeline = createArchiveStillSlideshowTimeline(recipe);
  const posterFrame = recipe.frames.find((frame) => frame.id === recipe.posterFrameId);
  const images = recipe.frames.map((frame, index) => `
      <img
        id="frame-${escapeAttribute(frame.id)}"
        class="still-frame"
        src="${escapeAttribute(frame.source)}"
        alt=""
        style="opacity:${index === 0 ? 1 : 0};object-position:${percent(frame.focalPoint.x)}% ${percent(frame.focalPoint.y)}%;z-index:${index + 1}"
      >`).join("");
  const transitionTweens = timeline.frames.slice(0, -1).map((frame, index) => {
    const next = timeline.frames[index + 1];
    const start = frame.fadeOutStartFrame / recipe.fps;
    const duration = frame.transition.frames / recipe.fps;
    return `
      tl.to("#frame-${frame.id}", { opacity: 0, duration: ${duration}, ease: "sine.inOut" }, ${start});
      tl.fromTo("#frame-${next.id}", { opacity: 0 }, { opacity: 1, duration: ${duration}, ease: "sine.inOut", immediateRender: false }, ${start});`;
  }).join("");
  const scaleTweens = timeline.frames.map((frame) => `
      tl.fromTo("#frame-${frame.id}", { scale: ${frame.scale.from} }, { scale: ${frame.scale.to}, duration: ${frame.durationFrames / recipe.fps}, ease: "none", immediateRender: false }, ${frame.startFrame / recipe.fps});`).join("");
  const loopStart = timeline.loopReturn.startFrame / recipe.fps;
  const loopDuration = (timeline.loopReturn.endFrame - timeline.loopReturn.startFrame) / recipe.fps;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=${recipe.width}, height=${recipe.height}">
    <title>Archive still slideshow</title>
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.14.2/dist/gsap.min.js"></script>
    <style>
      html, body { margin: 0; width: ${recipe.width}px; height: ${recipe.height}px; overflow: hidden; background: #000; }
      #root { position: relative; width: ${recipe.width}px; height: ${recipe.height}px; overflow: hidden; background: #000; }
      .still-frame { position: absolute; inset: 0; display: block; width: 100%; height: 100%; object-fit: cover; transform-origin: center; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="archive-still-slideshow" data-start="0" data-duration="${timeline.durationSeconds}" data-fps="${recipe.fps}" data-width="${recipe.width}" data-height="${recipe.height}">${images}
      <img
        id="loop-return-frame"
        class="still-frame"
        src="${escapeAttribute(posterFrame.source)}"
        alt=""
        style="opacity:0;object-position:${percent(posterFrame.focalPoint.x)}% ${percent(posterFrame.focalPoint.y)}%;z-index:${recipe.frames.length + 1}"
      >
    </div>
    <script>
      window.__timelines = window.__timelines || {};
      const tl = gsap.timeline({ paused: true });${scaleTweens}${transitionTweens}
      tl.to("#frame-${timeline.frames.at(-1).id}", { opacity: 0, duration: ${loopDuration}, ease: "sine.inOut" }, ${loopStart});
      tl.fromTo("#loop-return-frame", { opacity: 0 }, { opacity: 1, duration: ${loopDuration}, ease: "sine.inOut", immediateRender: false }, ${loopStart});
      window.__timelines["archive-still-slideshow"] = tl;
    </script>
  </body>
</html>
`;
}
