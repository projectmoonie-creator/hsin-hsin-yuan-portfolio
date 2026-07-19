import assert from "node:assert/strict";
import test from "node:test";

import { portraitSceneAt, workSceneAt } from "../src/scene-state.js";

test("portraitSceneAt maps scroll progress to the four narrative phases", () => {
  assert.deepEqual(portraitSceneAt(0), { phase: "opening", mode: 0 });
  assert.deepEqual(portraitSceneAt(0.24), { phase: "opening", mode: 0 });
  assert.deepEqual(portraitSceneAt(0.36), { phase: "release", mode: 0 });
  assert.deepEqual(portraitSceneAt(0.56), { phase: "practice", mode: 0 });
  assert.deepEqual(portraitSceneAt(0.66), { phase: "practice", mode: 1 });
  assert.deepEqual(portraitSceneAt(0.76), { phase: "practice", mode: 2 });
  assert.deepEqual(portraitSceneAt(0.94), { phase: "handoff", mode: 2 });
});

test("portraitSceneAt clamps progress outside the document range", () => {
  assert.deepEqual(portraitSceneAt(-4), { phase: "opening", mode: 0 });
  assert.deepEqual(portraitSceneAt(8), { phase: "handoff", mode: 2 });
});

test("workSceneAt selects one of the available work scenes", () => {
  assert.equal(workSceneAt(0.05, 3), 0);
  assert.equal(workSceneAt(0.5, 3), 1);
  assert.equal(workSceneAt(0.95, 3), 2);
  assert.equal(workSceneAt(-1, 3), 0);
  assert.equal(workSceneAt(2, 3), 2);
  assert.equal(workSceneAt(0.5, 0), 0);
});
