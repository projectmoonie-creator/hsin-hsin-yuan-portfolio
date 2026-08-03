import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

test("Featured preview derivatives are complete silent 720p H.264 BT.709 files", () => {
  const expected = new Map([
    ["slow-steps-card-reel.mp4", 30.03],
    ["tech-dreamers-card-reel.mp4", 30.03],
    ["my-art-my-voice-card-reel.mp4", 100.033267],
  ]);

  for (const [filename, expectedDuration] of expected) {
    const filePath = join(process.cwd(), "public/assets/showreel", filename);
    assert.equal(existsSync(filePath), true, filename);

    const probe = JSON.parse(execFileSync("ffprobe", [
      "-v", "error",
      "-show_entries", "format=duration:stream=codec_name,codec_type,width,height,pix_fmt,color_space,color_transfer,color_primaries",
      "-of", "json",
      filePath,
    ], { encoding: "utf8" }));
    const video = probe.streams.find((stream) => stream.codec_type === "video");

    assert.ok(video, `${filename} has a video stream`);
    assert.equal(probe.streams.some((stream) => stream.codec_type === "audio"), false, `${filename} has no audio stream`);
    assert.equal(video.codec_name, "h264", filename);
    assert.equal(video.width, 1280, filename);
    assert.equal(video.height, 720, filename);
    assert.equal(video.pix_fmt, "yuv420p", filename);
    assert.equal(video.color_space, "bt709", filename);
    assert.equal(video.color_transfer, "bt709", filename);
    assert.equal(video.color_primaries, "bt709", filename);
    assert.ok(Math.abs(Number(probe.format.duration) - expectedDuration) < 0.2, filename);
  }
});
