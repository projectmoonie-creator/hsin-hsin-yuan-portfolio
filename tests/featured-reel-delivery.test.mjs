import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  buildFeaturedReelDerivativeInventory,
  deriveFeaturedReelMobileSource,
  featuredReelDeliveryRecipeSha256,
  verifyFeaturedReelDerivativeManifest,
} from "../scripts/lib/featured-reel-delivery.mjs";
import { loadMediaManifest } from "../scripts/lib/media-manifest.mjs";

const root = process.cwd();

test("one canonical recipe derives all and only Featured mobile reel sources", () => {
  const manifest = loadMediaManifest(root);
  const inventory = buildFeaturedReelDerivativeInventory(manifest);

  assert.equal(inventory.length, 6);
  assert.deepEqual(
    inventory.map(({ sourceAssetId }) => sourceAssetId),
    manifest.assets
      .filter((asset) => asset.owner.collection === "featured")
      .map((asset) => asset.id),
  );
  assert.equal(
    deriveFeaturedReelMobileSource({
      manifest,
      sourcePublicPath: "/assets/showreel/slow-steps-card-reel.mp4",
    }),
    "/assets/showreel/mobile/slow-steps-card-reel-mobile.mp4",
  );
  assert.ok(inventory.every((item) => item.profile === "silent-h264-540p-mobile-bt709"));
  assert.ok(manifest.assets.every((asset) => !Object.hasOwn(asset, "mobilePublicPath")));
});

test("repository Featured mobile derivatives match source fingerprints, recipe, and generated evidence", () => {
  const manifest = loadMediaManifest(root);
  const generated = verifyFeaturedReelDerivativeManifest({ root, manifest });

  assert.equal(generated.schemaVersion, 1);
  assert.equal(generated.recipeSha256, featuredReelDeliveryRecipeSha256(manifest));
  assert.equal(generated.derivatives.length, 6);
  assert.ok(generated.derivatives.every((item) => item.width === 960 && item.height === 540));
  assert.ok(generated.derivatives.every((item) => item.faststart === true));
  assert.ok(generated.derivatives.every((item) => item.audioStreamCount === 0));
});

test("package exposes repeatable prepare and integrity-check commands", () => {
  const pkg = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(pkg.scripts["featured-reels:prepare"], "node scripts/prepare-featured-reels.mjs");
  assert.equal(pkg.scripts["featured-reels:check"], "node scripts/prepare-featured-reels.mjs --check");
});
