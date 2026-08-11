import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
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
      "silent-h264-540p-mobile-bt709": {
        kind: "video",
        codecName: "h264",
        width: 960,
        height: 540,
        pixelFormat: "yuv420p",
        colorSpace: "bt709",
        colorTransfer: "bt709",
        colorPrimaries: "bt709",
        streamCount: 1,
        audioStreamCount: 0,
        faststart: true,
      },
    },
    featuredReelDelivery: {
      sourceProfile: "silent-h264-720p-bt709",
      mobileProfile: "silent-h264-540p-mobile-bt709",
      directory: "/assets/showreel/mobile",
      suffix: "-mobile",
      media: "(max-width: 820px)",
      encode: {
        crf: 28,
        maxRateKbps: 700,
        bufferKbps: 1400,
        preset: "slow",
        keyframeIntervalSeconds: 2,
        threads: 1,
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
  assert.throws(
    () => validateMediaManifest(sampleManifest({
      featuredReelDelivery: {
        ...sampleManifest().featuredReelDelivery,
        mobileProfile: "missing-mobile-profile",
      },
    })),
    /featuredReelDelivery mobileProfile is unknown/,
  );
  assert.throws(
    () => validateMediaManifest(sampleManifest({
      featuredReelDelivery: {
        ...sampleManifest().featuredReelDelivery,
        directory: "/private/mobile",
      },
    })),
    /featuredReelDelivery directory must stay under \/assets\//,
  );
  assert.throws(
    () => validateMediaManifest(sampleManifest({
      assets: [{ ...sampleManifest().assets[0], mobilePublicPath: "/assets/duplicate.mp4" }],
    })),
    /must derive mobile delivery instead of storing mobilePublicPath/,
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

function runMediaProbeWithoutSystemPath({ mismatch = false } = {}) {
  const moduleUrl = new URL("../scripts/lib/media-manifest.mjs", import.meta.url).href;
  const filePath = join(root, "public/assets/showreel/overclocking-card-reel.mp4");
  const script = `
    import { probeMediaAsset, verifyMediaAsset } from ${JSON.stringify(moduleUrl)};
    const filePath = ${JSON.stringify(filePath)};
    const entry = {
      id: "archive.overclocking.reel",
      size: ${mismatch ? 4085026 : 4085025},
      sha256: "c5b4a2d83454b00edcd24e5ab14f29056f1586d12b79d9aa8a9e58cf51f75a1f",
      duration: 10
    };
    const profile = {
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
      faststart: true
    };
    if (${mismatch}) verifyMediaAsset({ entry, profile, filePath });
    else process.stdout.write(JSON.stringify(probeMediaAsset(filePath)));
  `;
  return spawnSync(process.execPath, ["--input-type=module", "-e", script], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, PATH: "" },
  });
}

test("media probing uses a project-owned inspector when the system PATH has no FFmpeg tools", () => {
  const result = runMediaProbeWithoutSystemPath();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(JSON.parse(result.stdout).video.codecName, "h264");
});

test("project-owned media inspection keeps exact mismatches fail-closed", () => {
  const result = runMediaProbeWithoutSystemPath({ mismatch: true });
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /archive\.overclocking\.reel exact size mismatch/);
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
