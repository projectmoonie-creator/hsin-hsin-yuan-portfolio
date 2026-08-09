import assert from "node:assert/strict";
import test from "node:test";

import * as reelSelection from "../src/archive-reel-selection.js";

const { selectClosestVisibleArchiveReel } = reelSelection;

function video(id, rect) {
  return { id, getBoundingClientRect: () => rect };
}

test("two visible reels in one desktop row choose the one nearest viewport center", () => {
  const left = video("left", { left: 260, right: 655, top: 390, bottom: 610 });
  const right = video("right", { left: 980, right: 1375, top: 390, bottom: 610 });
  const visible = new Set([left, right]);

  assert.equal(
    selectClosestVisibleArchiveReel([left, right], visible, { width: 1440, height: 1000 }),
    left,
  );
});

test("the generic nearest-center selector owns the shared geometry contract", () => {
  assert.equal(typeof reelSelection.selectClosestVisibleReel, "function");

  const near = video("near", { left: 140, right: 250, top: 360, bottom: 480 });
  const far = video("far", { left: 140, right: 250, top: 650, bottom: 770 });
  const videos = [far, near];
  const visible = new Set(videos);
  const viewport = { width: 390, height: 844 };

  assert.equal(reelSelection.selectClosestVisibleReel(videos, visible, viewport), near);
  assert.equal(selectClosestVisibleArchiveReel(videos, visible, viewport), near);
});

test("mobile selection follows the reel nearest the viewport center", () => {
  const first = video("first", { left: 143, right: 390, top: 258, bottom: 405 });
  const second = video("second", { left: 143, right: 390, top: 408, bottom: 554 });
  const visible = new Set([first, second]);

  assert.equal(
    selectClosestVisibleArchiveReel([first, second], visible, { width: 390, height: 664 }),
    first,
  );
  assert.equal(
    selectClosestVisibleArchiveReel([first, second], visible, { width: 390, height: 960 }),
    second,
  );
});

test("selection is null without a qualifying visible reel and stable on exact ties", () => {
  const first = video("first", { left: 0, right: 100, top: 0, bottom: 100 });
  const second = video("second", { left: 100, right: 200, top: 0, bottom: 100 });
  assert.equal(selectClosestVisibleArchiveReel([first, second], new Set(), { width: 200, height: 100 }), null);
  assert.equal(
    selectClosestVisibleArchiveReel([first, second], new Set([first, second]), { width: 200, height: 100 }),
    first,
  );
});
