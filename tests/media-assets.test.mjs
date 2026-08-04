import assert from "node:assert/strict";
import test from "node:test";

import {
  loadMediaManifest,
  resolvePublicAssetPath,
  verifyMediaAsset,
} from "../scripts/lib/media-manifest.mjs";

const root = process.cwd();

test("manifest-listed public derivatives match exact integrity profiles", () => {
  const manifest = loadMediaManifest(root);
  for (const entry of manifest.assets) {
    assert.doesNotThrow(() => verifyMediaAsset({
      entry,
      profile: manifest.profiles[entry.profile],
      filePath: resolvePublicAssetPath(root, entry.publicPath),
    }), entry.id);
  }
});
