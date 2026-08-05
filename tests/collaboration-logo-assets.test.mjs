import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";

import * as logoAssets from "../scripts/prepare-collaboration-logos.mjs";

const root = process.cwd();

test("package exposes the offline collaboration logo preparation command", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));

  assert.equal(packageJson.scripts["collabs:prepare"], "node scripts/prepare-collaboration-logos.mjs");
  assert.equal(existsSync(join(root, "scripts/prepare-collaboration-logos.mjs")), true);
});

test("monochrome derivatives are deterministic, self-contained, and preserve alpha", () => {
  assert.equal(typeof logoAssets.buildMonochromeSvg, "function");

  const input = {
    source: Buffer.from("safe raster bytes"),
    mime: "image/png",
    width: 160,
    height: 40,
  };
  const first = logoAssets.buildMonochromeSvg(input);
  const second = logoAssets.buildMonochromeSvg(input);

  assert.equal(first, second);
  assert.match(first, /<feColorMatrix/);
  assert.match(first, /data:image\/png;base64/);
  assert.match(first, /0 0 0 1 0/);
  assert.doesNotMatch(first, /(?:href|src)=["']https?:\/\//);
});

test("SVG source guard rejects executable and externally referenced content", () => {
  assert.equal(typeof logoAssets.assertSafeSvg, "function");

  for (const unsafe of [
    '<svg><script>alert(1)</script></svg>',
    '<svg onload="alert(1)"></svg>',
    '<svg><image href="https://example.test/a.png"/></svg>',
    '<svg><foreignObject><p>unsafe</p></foreignObject></svg>',
    '<svg><style>@import url(https://example.test/a.css)</style></svg>',
  ]) {
    assert.throws(() => logoAssets.assertSafeSvg(unsafe), /unsafe SVG source/);
  }
  assert.doesNotThrow(() => logoAssets.assertSafeSvg('<svg><use href="#mark"/></svg>'));
});

test("source verification fails closed on a SHA-256 mismatch", () => {
  assert.equal(typeof logoAssets.verifySourceSha256, "function");
  assert.throws(
    () => logoAssets.verifySourceSha256(Buffer.from("source"), "a".repeat(64), "example"),
    /example source SHA-256 mismatch/,
  );
});

test("offline preparation reads verified sources and writes only public derivatives", () => {
  assert.equal(typeof logoAssets.prepareCollaborationLogos, "function");
  const fixtureRoot = mkdtempSync(join(tmpdir(), "collaboration-logo-assets-"));
  const source = Buffer.from("fixture png bytes");
  const sourceFile = "assets/collaboration-logos/sources/example.png";
  mkdirSync(join(fixtureRoot, "assets/collaboration-logos/sources"), { recursive: true });
  writeFileSync(join(fixtureRoot, sourceFile), source);

  try {
    const prepared = logoAssets.prepareCollaborationLogos({
      baseDir: fixtureRoot,
      collaborations: [{
        id: "example",
        name: "Example",
        label: "EXAMPLE",
        logo: {
          src: "/assets/logos/example-mono.svg",
          sourceFile,
          dimensions: { width: 160, height: 40 },
          opticalSize: "wide",
          sourceUrl: "https://example.test/example.png",
          sourceSha256: createHash("sha256").update(source).digest("hex"),
          sourceCheckedAt: "2026-08-06",
          rightsStatus: "official-mark-nominative-use",
        },
      }],
    });

    assert.deepEqual(prepared, ["public/assets/logos/example-mono.svg"]);
    const output = readFileSync(join(fixtureRoot, prepared[0]), "utf8");
    assert.match(output, /data:image\/png;base64/);
    assert.equal(existsSync(join(fixtureRoot, "assets/logos/example-mono.svg")), false);
  } finally {
    rmSync(fixtureRoot, { recursive: true, force: true });
  }
});

test("canonical data registers four verified sources and three honest fallbacks", () => {
  const collaborations = JSON.parse(
    readFileSync(join(root, "data/collaborations.json"), "utf8"),
  );

  assert.deepEqual(
    collaborations.filter((item) => item.logo).map((item) => item.id),
    ["taiwanplus", "pts", "ticff", "gorgeous-space"],
  );
  assert.deepEqual(
    collaborations.filter((item) => !item.logo).map((item) => item.id),
    ["dragon-tv", "women-make-waves", "screenhouse"],
  );
  for (const item of collaborations.filter((record) => record.logo)) {
    const source = readFileSync(join(root, item.logo.sourceFile));
    const actual = createHash("sha256").update(source).digest("hex");
    assert.equal(actual, item.logo.sourceSha256, item.id);
  }
});
