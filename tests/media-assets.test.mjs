import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

function topLevelAtomOffsets(bytes) {
  const offsets = new Map();
  let offset = 0;

  while (offset + 8 <= bytes.length) {
    let size = bytes.readUInt32BE(offset);
    const type = bytes.toString("ascii", offset + 4, offset + 8);
    let headerSize = 8;

    if (size === 1) {
      if (offset + 16 > bytes.length) break;
      size = Number(bytes.readBigUInt64BE(offset + 8));
      headerSize = 16;
    } else if (size === 0) {
      size = bytes.length - offset;
    }
    if (!Number.isSafeInteger(size) || size < headerSize || offset + size > bytes.length) break;

    if (!offsets.has(type)) offsets.set(type, offset);
    offset += size;
  }

  return offsets;
}

test("Featured preview derivatives are complete silent 720p H.264 BT.709 files", () => {
  const expected = new Map([
    ["slow-steps-card-reel.mp4", {
      duration: 30.03,
      sha256: "6061dceb6e583a5fc20d695b6cb555f4e02a80970b41bda8ec787acb3f3f1174",
      size: 7427742,
    }],
    ["tech-dreamers-card-reel.mp4", {
      duration: 30.03,
      sha256: "4c6c1070902b9d6dd8b170c8021c3bca303a9e2c9a1abca05a7911264f23835c",
      size: 6441958,
    }],
    ["my-art-my-voice-card-reel.mp4", {
      duration: 100.033267,
      sha256: "f5e79c8e8e13b62b337b75190f25b7d034d6059e297f8044da56d6e00a682e93",
      size: 32662721,
    }],
    ["top-gear-china-uk-special-card-reel.mp4", {
      duration: 29.96,
      sha256: "4d57e75a81e2ebf0e398a08b57c8e99ddcb0973bc1562db8036221b9a014db72",
      size: 8651457,
    }],
  ]);

  for (const [filename, manifest] of expected) {
    const filePath = join(process.cwd(), "public/assets/showreel", filename);
    assert.equal(existsSync(filePath), true, filename);
    const bytes = readFileSync(filePath);

    assert.equal(statSync(filePath).size, manifest.size, `${filename} exact size`);
    assert.equal(
      createHash("sha256").update(bytes).digest("hex"),
      manifest.sha256,
      `${filename} exact SHA-256`,
    );
    const atomOffsets = topLevelAtomOffsets(bytes);
    const moovOffset = atomOffsets.get("moov");
    const mdatOffset = atomOffsets.get("mdat");
    assert.notEqual(moovOffset, undefined, `${filename} contains top-level moov`);
    assert.notEqual(mdatOffset, undefined, `${filename} contains top-level mdat`);
    assert.ok(moovOffset < mdatOffset, `${filename} has faststart atom ordering`);

    const probe = JSON.parse(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries",
      "-of", "json",
      filePath,
    ], { encoding: "utf8" }));
    assert.equal(probe.streams.length, 1, `${filename} has exactly one stream`);
    const [video] = probe.streams;

    assert.equal(video.codec_type, "video", `${filename} only stream is video`);
    assert.equal(video.codec_name, "h264", filename);
    assert.equal(video.width, 1280, filename);
    assert.equal(video.height, 720, filename);
    assert.equal(video.pix_fmt, "yuv420p", filename);
    assert.equal(video.color_space, "bt709", filename);
    assert.equal(video.color_transfer, "bt709", filename);
    assert.equal(video.color_primaries, "bt709", filename);
    assert.ok(Math.abs(Number(probe.format.duration) - manifest.duration) < 0.2, filename);
  }
});
