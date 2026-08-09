export function selectClosestVisibleReel(
  videos,
  visibleVideos,
  viewport,
) {
  const centerX = viewport.width / 2;
  const centerY = viewport.height / 2;
  let selected = null;
  let selectedDistance = Number.POSITIVE_INFINITY;

  for (const video of videos) {
    if (!visibleVideos.has(video)) continue;
    const rect = video.getBoundingClientRect();
    const videoCenterX = (rect.left + rect.right) / 2;
    const videoCenterY = (rect.top + rect.bottom) / 2;
    const distance = ((videoCenterX - centerX) ** 2) + ((videoCenterY - centerY) ** 2);
    if (distance < selectedDistance) {
      selected = video;
      selectedDistance = distance;
    }
  }

  return selected;
}

export const selectClosestVisibleArchiveReel = selectClosestVisibleReel;
