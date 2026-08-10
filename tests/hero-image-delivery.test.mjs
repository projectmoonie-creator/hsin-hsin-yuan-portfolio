import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";

const root = process.cwd();
const helperPath = join(root, "scripts/lib/hero-image-delivery.mjs");
const deliveryModule = existsSync(helperPath)
  ? await import(pathToFileURL(helperPath).href)
  : {};
const rawSite = JSON.parse(readFileSync(join(root, "data/site.json"), "utf8"));

test("Hero delivery helper derives responsive candidates from the canonical source basename", () => {
  assert.equal(typeof deliveryModule.deriveHeroDelivery, "function");
  const delivery = deliveryModule.deriveHeroDelivery({
    src: rawSite.heroMedia.src,
    delivery: rawSite.heroMedia.delivery,
  });

  assert.equal(delivery.profiles.mobile.sources.avif.srcset,
    "/assets/portfolio/hero/hsin-working-white-space-640.avif 640w, /assets/portfolio/hero/hsin-working-white-space-960.avif 960w");
  assert.equal(delivery.profiles.desktop.sources.jpeg.srcset,
    "/assets/portfolio/hero/hsin-working-white-space-960.jpg 960w, /assets/portfolio/hero/hsin-working-white-space-1440.jpg 1440w, /assets/portfolio/hero/hsin-working-white-space-1920.jpg 1920w");
  assert.deepEqual(delivery.profiles.mobile.preload, {
    href: "/assets/portfolio/hero/hsin-working-white-space-960.avif",
    srcset: "/assets/portfolio/hero/hsin-working-white-space-640.avif 640w, /assets/portfolio/hero/hsin-working-white-space-960.avif 960w",
    sizes: "90vw",
    media: "(max-width: 820px)",
    type: "image/avif",
    fetchPriority: "high",
  });
});

test("canonical Hero source hash and generated derivative formats are verified", () => {
  assert.equal(typeof deliveryModule.buildHeroDerivativeInventory, "function");
  assert.equal(typeof deliveryModule.verifyHeroDerivativeSet, "function");
  const sourcePath = join(root, "public", rawSite.heroMedia.src.slice(1));
  const sourceHash = createHash("sha256").update(readFileSync(sourcePath)).digest("hex");
  assert.equal(sourceHash, rawSite.heroMedia.sourceSha256);

  const expected = deliveryModule.buildHeroDerivativeInventory({
    src: rawSite.heroMedia.src,
    dimensions: rawSite.heroMedia.dimensions,
    delivery: rawSite.heroMedia.delivery,
  });
  assert.equal(expected.length, 12);
  assert.deepEqual([...new Set(expected.map((item) => item.width))], [640, 960, 1440, 1920]);
  assert.deepEqual([...new Set(expected.map((item) => item.format))], ["avif", "webp", "jpeg"]);

  const verified = deliveryModule.verifyHeroDerivativeSet({
    root,
    heroMedia: rawSite.heroMedia,
  });
  assert.equal(verified.length, 12);
  assert.deepEqual(
    [...new Set(verified.map((item) => `${item.width}x${item.height}`))],
    ["640x480", "960x720", "1440x1080", "1920x1440"],
  );
  assert.deepEqual([...new Set(verified.map((item) => item.codecName))], ["av1", "webp", "mjpeg"]);
  assert.ok(verified.every((item) => item.bytes > 0));
});

test("generated Hero manifest binds every derivative to the canonical source and recipe", () => {
  assert.equal(typeof deliveryModule.readHeroDerivativeManifest, "function");
  assert.equal(typeof deliveryModule.heroDeliveryRecipeSha256, "function");

  const manifest = deliveryModule.readHeroDerivativeManifest(root);
  assert.equal(manifest.schemaVersion, 1);
  assert.equal(manifest.source.src, rawSite.heroMedia.src);
  assert.equal(manifest.source.sha256, rawSite.heroMedia.sourceSha256);
  assert.equal(
    manifest.recipeSha256,
    deliveryModule.heroDeliveryRecipeSha256(rawSite.heroMedia),
  );
  assert.equal(manifest.derivatives.length, 12);

  for (const derivative of manifest.derivatives) {
    const bytes = readFileSync(join(root, "public", derivative.src.slice(1)));
    assert.equal(createHash("sha256").update(bytes).digest("hex"), derivative.sha256);
    assert.equal(bytes.length, derivative.bytes);
  }

  const changedRecipe = structuredClone(rawSite.heroMedia);
  changedRecipe.delivery.formats.avif.quality += 1;
  assert.throws(
    () => deliveryModule.verifyHeroDerivativeSet({ root, heroMedia: changedRecipe }),
    /recipe SHA-256 mismatch/,
  );
});
