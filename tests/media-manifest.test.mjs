import assert from "node:assert/strict";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import test from "node:test";

import { loadSiteData, loadWorks } from "../scripts/build-site.mjs";
import {
  loadMediaManifest,
  probeMediaAsset,
  resolvePublicAssetPath,
  validateMediaManifest,
  verifyMediaAsset,
  verifyManifestContentLinks,
} from "../scripts/lib/media-manifest.mjs";

const root = process.cwd();

function sampleManifest(overrides = {}) {
  return {
    schemaVersion: 1,
    profiles: {
      "silent-h264-720p-bt709": {
        kind: "video",
        codecName: "h264",
        width: 1280,
        height: 720,
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        colorTransfer: "bt709",
        colorPrimaries: "bt709",
        streamCount: 1,
        audioStreamCount: 0,
        faststart: true,
      },
    },
    assets: [{
      id: "featured.sample.reel",
      publicPath: "/assets/showreel/sample.mp4",
      profile: "silent-h264-720p-bt709",
      owner: { collection: "featured", slug: "sample", field: "featuredReelUrl" },
      size: 123,
      sha256: "a".repeat(64),
      duration: 10,
    }],
    ...overrides,
  };
}

test("media manifest validates one canonical safe asset inventory", () => {
  const manifest = validateMediaManifest(sampleManifest());
  const privateSourcePath = ["", "Users", "person", "Downloads", "source.mp4"].join("/");
  assert.equal(manifest.assets[0].id, "featured.sample.reel");

  assert.throws(
    () => validateMediaManifest(sampleManifest({
      assets: [sampleManifest().assets[0], { ...sampleManifest().assets[0] }],
    })),
    /asset id must be unique/,
  );
  assert.throws(
    () => validateMediaManifest(sampleManifest({
      assets: [{ ...sampleManifest().assets[0], publicPath: "/private/tmp/source.mp4" }],
    })),
    /publicPath must stay under \/assets\//,
  );
  assert.throws(
    () => validateMediaManifest(sampleManifest({
      assets: [{ ...sampleManifest().assets[0], sourcePath: privateSourcePath }],
    })),
    /must not store sourcePath/,
  );
});

test("public media paths resolve inside the repository public directory", () => {
  assert.equal(
    resolvePublicAssetPath("/repo", "/assets/showreel/sample.mp4"),
    join("/repo", "public/assets/showreel/sample.mp4"),
  );
  assert.throws(
    () => resolvePublicAssetPath("/repo", "/assets/../secret.txt"),
    /publicPath must stay under \/assets\//,
  );
});

test("manifest owners and local reel fields stay linked to canonical content", () => {
  const manifest = sampleManifest();
  assert.doesNotThrow(() => verifyManifestContentLinks(manifest, {
    featured: [{ slug: "sample", featuredReelUrl: "/assets/showreel/sample.mp4" }],
    archive: [],
  }));
  assert.throws(
    () => verifyManifestContentLinks(manifest, {
      featured: [{ slug: "sample", featuredReelUrl: "/assets/showreel/other.mp4" }],
      archive: [],
    }),
    /does not match featured sample featuredReelUrl/,
  );
  assert.throws(
    () => verifyManifestContentLinks(manifest, {
      featured: [{ slug: "sample", featuredReelUrl: "/assets/showreel/sample.mp4" }],
      archive: [{ slug: "archive-sample", cardReelUrl: "/assets/showreel/archive.mp4" }],
    }),
    /Archive archive-sample cardReelUrl is missing from media manifest/,
  );
});

test("manifest loads from the repository data directory", () => {
  const repoRoot = mkdtempSync(join(tmpdir(), "portfolio-media-manifest-"));
  const manifestPath = join(repoRoot, "data/media-manifest.json");
  mkdirSync(dirname(manifestPath), { recursive: true });
  writeFileSync(manifestPath, `${JSON.stringify(sampleManifest())}\n`);
  try {
    assert.deepEqual(loadMediaManifest(repoRoot), sampleManifest());
  } finally {
    rmSync(repoRoot, { recursive: true, force: true });
  }
});

test("media probing and verification enforce exact manifest integrity", () => {
  const filePath = join(root, "public/assets/showreel/overclocking-card-reel.mp4");
  const profile = sampleManifest().profiles["silent-h264-720p-bt709"];
  const entry = {
    ...sampleManifest().assets[0],
    id: "archive.overclocking.reel",
    publicPath: "/assets/showreel/overclocking-card-reel.mp4",
    owner: { collection: "archive", slug: "overclocking", field: "cardReelUrl" },
    size: 4085025,
    sha256: "c5b4a2d83454b00edcd24e5ab14f29056f1586d12b79d9aa8a9e58cf51f75a1f",
  };
  const probe = probeMediaAsset(filePath);
  assert.equal(probe.duration, 10);
  assert.equal(probe.video.codecName, "h264");
  assert.equal(probe.faststart, true);
  assert.doesNotThrow(() => verifyMediaAsset({ entry, profile, filePath }));
  assert.throws(
    () => verifyMediaAsset({ entry: { ...entry, size: entry.size + 1 }, profile, filePath }),
    /exact size/,
  );
});

test("repository media manifest stays linked to every registered content owner", () => {
  const manifest = loadMediaManifest(root);
  const siteData = loadSiteData(root);
  const collections = {
    featured: loadWorks(join(root, "content/works")),
    archive: siteData.archive,
  };
  verifyManifestContentLinks(manifest, collections);
});
