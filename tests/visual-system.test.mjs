import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const css = readFileSync(new URL("../src/styles.css", import.meta.url), "utf8");

test("editorial hybrid exposes the approved flat palette and type system", () => {
  for (const token of ["#050807", "#dddcd7", "#f6f4ee", "#f0645a", "#4867d9", "#4d9259"]) {
    assert.match(css, new RegExp(token, "i"), token);
  }
  assert.match(css, /"Helvetica Neue"/);
  assert.match(css, /"Iowan Old Style"[^;]+italic|font-family:[^;]+"Iowan Old Style"/s);
  assert.match(css, /border:\s*1px solid/);
  assert.match(css, /border-radius:\s*(?:1\.5rem|24px|var\(--radius\))/);
});

test("retired ambient and sticky visual fingerprints are absent", () => {
  assert.doesNotMatch(css, /radial-gradient|box-shadow|text-shadow|mix-blend-mode/i);
  assert.doesNotMatch(css, /ambient|light-beam|edge-glow|heroStillPush|frameReflection|sectionReflection/i);
  assert.doesNotMatch(css, /position:\s*sticky/i);
  assert.doesNotMatch(css, /--acid|#d8ff3e/i);
});

test("mobile and reduced-motion paths keep the watch row manual", () => {
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.watch-loop-viewport[\s\S]*?scroll-snap-type:\s*x mandatory/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.watch-loop-track[\s\S]*?transform:\s*none\s*!important/);
  assert.match(css, /@media\s*\(prefers-reduced-motion:\s*reduce\)[\s\S]*?\.watch-loop-track[\s\S]*?transform:\s*none\s*!important/);
  assert.match(css, /:focus-visible/);
});

test("assigned supporting images use the same replaceable crop contract", () => {
  assert.match(css, /\.work-supporting-media\s*\{/);
  assert.match(css, /\.work-supporting-image\s*\{[\s\S]*object-position:\s*var\(--media-focal/);
  assert.match(css, /@media\s*\(max-width:\s*820px\)[\s\S]*?\.work-supporting-image[\s\S]*?var\(--media-mobile-focal/);
});
