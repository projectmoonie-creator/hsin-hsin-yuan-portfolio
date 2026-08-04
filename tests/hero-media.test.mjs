import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import {
  assertPublicJpegMetadataSafe,
  stripJpegMetadata,
} from "../scripts/lib/jpeg-metadata.mjs";

const root = process.cwd();

function jpegSegment(marker, payload) {
  const length = payload.length + 2;
  return Buffer.concat([
    Buffer.from([0xff, marker, length >> 8, length & 0xff]),
    payload,
  ]);
}

test("JPEG sanitizer removes private metadata segments without changing image data", () => {
  const soi = Buffer.from([0xff, 0xd8]);
  const jfifPayload = Buffer.from([
    0x4a, 0x46, 0x49, 0x46, 0x00,
    0x01, 0x01,
    0x00,
    0x00, 0x01,
    0x00, 0x01,
    0x00, 0x00,
  ]);
  const app0 = jpegSegment(0xe0, jfifPayload);
  const customApp0 = jpegSegment(0xe0, Buffer.from("custom application data", "ascii"));
  const malformedJfifApp0 = jpegSegment(
    0xe0,
    Buffer.concat([jfifPayload, Buffer.from("hidden tail", "ascii")]),
  );
  const app1 = jpegSegment(0xe1, Buffer.from("Exif\0\0GPS device location", "ascii"));
  const app12 = jpegSegment(0xec, Buffer.from("unclassified application metadata", "ascii"));
  const app13 = jpegSegment(0xed, Buffer.from("Photoshop IPTC creator", "ascii"));
  const comment = jpegSegment(0xfe, Buffer.from("private comment", "ascii"));
  const quantization = jpegSegment(0xdb, Buffer.from([0, 1, 2, 3]));
  const scanHeader = jpegSegment(0xda, Buffer.from([1, 1, 0, 0, 63, 0]));
  const scanDataAndEoi = Buffer.from([0x12, 0xff, 0x00, 0x34, 0xff, 0xd9]);
  const source = Buffer.concat([
    soi,
    app0,
    customApp0,
    app1,
    app12,
    app13,
    comment,
    quantization,
    scanHeader,
    scanDataAndEoi,
  ]);
  const expected = Buffer.concat([
    soi,
    app0,
    quantization,
    scanHeader,
    scanDataAndEoi,
  ]);

  assert.throws(() => assertPublicJpegMetadataSafe(source), /private JPEG metadata/);
  assert.throws(
    () => assertPublicJpegMetadataSafe(Buffer.concat([
      soi,
      app12,
      quantization,
      scanHeader,
      scanDataAndEoi,
    ])),
    /private JPEG metadata/,
  );
  assert.throws(
    () => assertPublicJpegMetadataSafe(Buffer.concat([
      soi,
      malformedJfifApp0,
      quantization,
      scanHeader,
      scanDataAndEoi,
    ])),
    /private JPEG metadata/,
  );
  const sanitized = stripJpegMetadata(source);
  assert.deepEqual(sanitized, expected);
  assert.doesNotThrow(() => assertPublicJpegMetadataSafe(sanitized));
  assert.throws(() => stripJpegMetadata(Buffer.from("not a jpeg")), /valid JPEG/);
});

test("canonical public Hero JPEG contains no private metadata payload", () => {
  const hero = readFileSync(
    join(root, "public/assets/portfolio/hsin-working-white-space.jpg"),
  );
  assert.doesNotThrow(() => assertPublicJpegMetadataSafe(hero));
});

test("package exposes the repeatable Hero sanitizer command", () => {
  const packageJson = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
  assert.equal(
    packageJson.scripts["hero:sanitize"],
    "node scripts/sanitize-public-hero-image.mjs",
  );
});

test("STATUS cold resume names the backup and current remediation decision", () => {
  const status = readFileSync(join(root, "STATUS.md"), "utf8");

  assert.match(status, /backup\/2026-08-04\/e2d75f0/);
  assert.match(status, /codex\/hero-media-closeout-remediation/);
  assert.match(status, /feature Preview/);
  assert.match(status, /Production remains separate/);
  assert.doesNotMatch(status, /Review and accept `codex\/portfolio-studio-a0`/);
  assert.doesNotMatch(status, /Read the A0 implementation plan/);
});
