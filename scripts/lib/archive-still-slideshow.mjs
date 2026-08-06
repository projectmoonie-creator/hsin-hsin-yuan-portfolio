const EXPECTED = Object.freeze({
  width: 1280,
  height: 720,
  fps: 30,
  durationFrames: 300,
  frameCount: 6,
  slotFrames: 50,
  dissolveFrames: 8,
});

function requireText(value, label) {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${label} is required`);
}

function requireFocalPoint(value, label = "focal point") {
  if (!value || !Number.isFinite(value.x) || !Number.isFinite(value.y)
    || value.x < 0 || value.x > 1 || value.y < 0 || value.y > 1) {
    throw new Error(`${label} must contain x/y values from 0 to 1`);
  }
}

function requirePositiveInteger(value, label) {
  if (!Number.isInteger(value) || value <= 0) throw new Error(`${label} must be a positive integer`);
}

export function validateArchiveStillSlideshowRecipe(input) {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("recipe must be one object");
  }
  if (input.schemaVersion !== 1) throw new Error("schema version must be 1");
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(input.slug || "")) {
    throw new Error("slug must use lowercase kebab-case");
  }
  if (input.rightsStatus !== "user-supplied-local-source") {
    throw new Error("rights status must be user-supplied-local-source");
  }
  if (input.width !== EXPECTED.width || input.height !== EXPECTED.height) {
    throw new Error("frame dimensions must be 1280x720");
  }
  if (input.fps !== EXPECTED.fps) throw new Error("fps must be 30");
  if (input.durationFrames !== EXPECTED.durationFrames) {
    throw new Error("duration must be exactly 300 frames");
  }
  if (input.outputProfiles?.reel !== "silent-h264-720p-bt709"
    || input.outputProfiles?.poster !== "webp-1280x720") {
    throw new Error("output profiles must match the public media contract");
  }
  const expectedReel = `/assets/showreel/${input.slug}-card-reel.mp4`;
  const expectedPoster = `/assets/showreel/${input.slug}-card-reel-poster.webp`;
  if (input.publicPaths?.reel !== expectedReel || input.publicPaths?.poster !== expectedPoster) {
    throw new Error("public path must match the declared slug");
  }
  requireText(input.posterFrameId, "poster frame id");
  requireFocalPoint(input.posterFocalPoint, "poster focal point");
  requireText(input.alt?.en, "English alt");
  requireText(input.alt?.zh, "Chinese alt");
  if (!Array.isArray(input.frames) || input.frames.length !== EXPECTED.frameCount) {
    throw new Error("recipe must contain exactly six frames");
  }

  const ids = new Set();
  for (const frame of input.frames) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(frame.id || "")) {
      throw new Error("frame id must use lowercase kebab-case");
    }
    if (ids.has(frame.id)) throw new Error("frame ids must be unique");
    ids.add(frame.id);
    if (typeof frame.source !== "string"
      || !/^assets\/stills\/[a-z0-9][a-z0-9-]*\.webp$/.test(frame.source)
      || frame.source.includes("..") || frame.source.includes("\\")) {
      throw new Error("frame source must be a safe relative path under assets/stills");
    }
    if (typeof frame.sourceBasename !== "string"
      || !frame.sourceBasename
      || frame.sourceBasename.includes("/")
      || frame.sourceBasename.includes("\\")) {
      throw new Error("source basename must not contain path separators");
    }
    if (!/^[a-f0-9]{64}$/.test(frame.sourceSha256 || "")) {
      throw new Error("source SHA-256 must be lowercase hexadecimal");
    }
    requirePositiveInteger(frame.sourceDimensions?.width, "source dimensions width");
    requirePositiveInteger(frame.sourceDimensions?.height, "source dimensions height");
    if (frame.cropMode !== "cover") throw new Error("crop mode must be cover");
    requireFocalPoint(frame.focalPoint, "frame focal point");
    if (frame.durationFrames !== EXPECTED.slotFrames) {
      throw new Error("each frame duration must be 50 frames");
    }
    if (frame.scale?.from !== 1 || frame.scale?.to !== 1.035) {
      throw new Error("frame scale must be 1 to 1.035");
    }
    if (frame.transition?.kind !== "dissolve"
      || frame.transition?.frames !== EXPECTED.dissolveFrames) {
      throw new Error("frame transition must be an eight-frame dissolve");
    }
  }
  if (!ids.has(input.posterFrameId)) throw new Error("poster frame id must identify a frame");
  const duration = input.frames.reduce((sum, frame) => sum + frame.durationFrames, 0);
  if (duration !== input.durationFrames) throw new Error("frame duration sum must equal duration");
  return structuredClone(input);
}

export function createArchiveStillSlideshowTimeline(input) {
  const recipe = validateArchiveStillSlideshowRecipe(input);
  let startFrame = 0;
  const frames = recipe.frames.map((item, index) => {
    const endFrame = startFrame + item.durationFrames;
    const fadeOutStartFrame = index === recipe.frames.length - 1
      ? recipe.durationFrames - item.transition.frames
      : endFrame;
    const planned = {
      ...item,
      startFrame,
      endFrame,
      fadeInEndFrame: index === 0 ? 0 : startFrame + item.transition.frames,
      fadeOutStartFrame,
      fadeOutEndFrame: Math.min(recipe.durationFrames, fadeOutStartFrame + item.transition.frames),
    };
    startFrame = endFrame;
    return planned;
  });
  return {
    fps: recipe.fps,
    durationFrames: recipe.durationFrames,
    durationSeconds: recipe.durationFrames / recipe.fps,
    frames,
    loopReturn: {
      frameId: recipe.posterFrameId,
      startFrame: recipe.durationFrames - EXPECTED.dissolveFrames,
      endFrame: recipe.durationFrames,
    },
  };
}
