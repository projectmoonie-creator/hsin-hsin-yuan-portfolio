import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";

import { loadWorks } from "../scripts/build-site.mjs";
import * as mediaContract from "../scripts/media-manifest.mjs";

const root = process.cwd();

test("hybrid media uses a replaceable split-showreel contract", () => {
  const media = JSON.parse(readFileSync(join(root, "data/media.json"), "utf8"));

  assert.equal(media.hero.treatment, "split-showreel");
  assert.equal(media.hero.poster, "/assets/showreel/website-visual-reel-poster.png");
  assert.equal(media.hero.video, "/assets/showreel/website-visual-reel.mp4");
  assert.deepEqual(media.hero.dimensions, { width: 1920, height: 1080 });
  assert.match(media.hero.desktopFocalPoint, /^\d{1,3}% \d{1,3}%$/);
  assert.match(media.hero.mobileFocalPoint, /^\d{1,3}% \d{1,3}%$/);
  assert.ok(media.hero.alt.en.length > 10);
  assert.ok(media.hero.alt.zh.length > 6);
});

test("every work reserves desktop and mobile crop metadata for replacement", () => {
  const works = loadWorks(join(root, "content/works"));
  const posterWorks = works.filter((work) => work.posterImage);

  for (const work of works) {
    assert.match(work.focalPoint, /^\d{1,3}% \d{1,3}%$/, `${work.slug} desktop focal point`);
    assert.match(work.mobileFocalPoint, /^\d{1,3}% \d{1,3}%$/, `${work.slug} mobile focal point`);
    for (const image of work.supportingImages || []) {
      assert.ok(image.alt.en.trim(), `${work.slug} supporting English alt`);
      assert.ok(image.alt.zh.trim(), `${work.slug} supporting Chinese alt`);
      assert.match(image.focalPoint, /^\d{1,3}% \d{1,3}%$/, `${work.slug} supporting desktop focal point`);
      assert.match(image.mobileFocalPoint, /^\d{1,3}% \d{1,3}%$/, `${work.slug} supporting mobile focal point`);
      assert.ok(image.dimensions.width > 0, `${work.slug} supporting width`);
      assert.ok(image.dimensions.height > 0, `${work.slug} supporting height`);
    }
  }

  assert.deepEqual(
    posterWorks.map((work) => work.slug),
    ["tech-dreamers", "my-art-my-voice", "pts-taigi-bus", "top-gear-china-uk-special"],
  );
  for (const work of posterWorks) {
    assert.ok(work.posterAlt.en.trim());
    assert.ok(work.posterAlt.zh.trim());
    assert.ok(work.posterDimensions.width > 0);
    assert.ok(work.posterDimensions.height > 0);
  }
});

test("the shared media module rejects incomplete work replacement metadata", () => {
  assert.equal(typeof mediaContract.validateWorkMediaContract, "function");
  const works = loadWorks(join(root, "content/works"));
  assert.doesNotThrow(() => mediaContract.validateWorkMediaContract(works));

  const invalid = structuredClone(works);
  invalid[1].mobileFocalPoint = "";
  assert.throws(
    () => mediaContract.validateWorkMediaContract(invalid),
    /tech-dreamers\.mobileFocalPoint/,
  );
});

test("the shared validator accepts the hybrid manifest", () => {
  execFileSync(
    process.execPath,
    ["scripts/validate-media-manifest.mjs", "data/media.json", "public"],
    { cwd: root, stdio: "pipe" },
  );
});
