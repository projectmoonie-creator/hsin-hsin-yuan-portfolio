function clamp01(value) {
  const number = Number.isFinite(Number(value)) ? Number(value) : 0;
  return Math.min(1, Math.max(0, number));
}

export function portraitSceneAt(progress) {
  const value = clamp01(progress);
  if (value < 0.25) return { phase: "opening", mode: 0 };
  if (value < 0.48) return { phase: "release", mode: 0 };
  if (value < 0.82) {
    const mode = Math.min(2, Math.floor(((value - 0.48) / 0.34) * 3));
    return { phase: "practice", mode };
  }
  return { phase: "handoff", mode: 2 };
}

export function workSceneAt(progress, count) {
  const sceneCount = Math.max(0, Math.floor(Number(count) || 0));
  if (!sceneCount) return 0;
  return Math.min(sceneCount - 1, Math.floor(clamp01(progress) * sceneCount));
}
