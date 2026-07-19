# Editorial Watch Loop Hybrid — Visual QA

Date: 2026-07-19  
Hybrid branch: `codex/editorial-watch-loop-hybrid`  
Hybrid baseline: `5cdb842`  
Portrait checkpoint: branch/tag `checkpoint/portrait-scene-v1` at `e05556c`

## Preview identity preflight

Port `4173` was already serving an older portrait-scene build. A ready listener therefore did not prove that the browser was showing the current worktree. The hybrid was rebuilt from this worktree and served on the verified-free port `4387`; the checkpoint was rebuilt from `hsin-hsin-yuan-portfolio-edit` and served separately on the verified-free port `4391`. The checkpoint page fingerprint was the title `Hsin-Hsin Yuan | Documentary Director & AI-Language Creative` plus the first heading `Hsin-Hsin Yuan`.

This failure mode is now part of the reusable portfolio skill: visual QA must record worktree, build output, URL, port, and a served-content fingerprint before trusting screenshots.

## Automated browser matrix

`scripts/visual-qa.py` passed on:

- 1440×900 desktop;
- 1200×900 desktop;
- 834×1112 tablet;
- 390×844 mobile;
- 360×800 mobile;
- 1440×900 with reduced motion;
- 1440×900 without JavaScript;
- 390×844 Chinese output.

Each run verifies six canonical work anchors, five original Watch previews, one readable source sequence, no page-level horizontal overflow, no console or page errors, visible keyboard focus, complete image loading, non-broken media, a visible Works navigation path, legible contact-submit colors, a 16:9 showreel frame, and fixed-navigation clearance for work and Contact anchors. Desktop additionally verifies loop advance and hover/focus pause; mobile, reduced-motion, and no-JavaScript paths verify manual horizontal scrolling without transform-driven autoplay.

Report: `/tmp/hybrid-visual-qa/report.md`  
Machine-readable result: `/tmp/hybrid-visual-qa/report.json`

## Visual findings and corrections

The first screenshot pass exposed three concrete defects that structural tests did not catch:

1. Watch cards linked to work rows whose anchors could land under the fixed topbar. Work rows now have explicit scroll clearance and a regression test.
2. `.contact .button-link` overrode the submit button color, producing white text on a white button. The submit now has an explicit high-specificity dark foreground, and browser QA compares computed foreground/background colors.
3. The 16:9 showreel poster was placed in 16:11, 16:10, and approximately 1.22:1 crops, cutting off its own title treatment. Every breakpoint now preserves the native 16:9 frame.

The mobile topbar now retains a direct Works path alongside Contact and language switching. Supporting images were decoded and captured individually to rule out the blank-frame artefact produced by extra-tall locator screenshots.

## Continuity judgment

The portrait checkpoint and hybrid share the intentional parts of the redesign: Helvetica-led typography, near-black Stage, warm paper, fine borders, rounded media, the existing showreel imagery, and direct bilingual navigation. The hybrid intentionally removes the portrait carrier, layered red treatment, glow, sticky scene, and scroll-to-enter device. It returns to the old site's clearer split opening and horizontal work discovery while keeping the newer visual language.

Checkpoint evidence:

- `/tmp/portrait-checkpoint-desktop-1440.png`
- `/tmp/portrait-checkpoint-mobile-390.png`

Hybrid evidence:

- `/tmp/hybrid-visual-qa/desktop-1440-en-hero.png`
- `/tmp/hybrid-visual-qa/desktop-1440-en-watch.png`
- `/tmp/hybrid-visual-qa/desktop-1440-en-my-art.png`
- `/tmp/hybrid-visual-qa/desktop-1440-en-contact.png`
- `/tmp/hybrid-visual-qa/mobile-390-en-hero.png`
- `/tmp/hybrid-visual-qa/mobile-390-en-watch.png`
- `/tmp/hybrid-visual-qa/mobile-390-en-my-art.png`
- `/tmp/hybrid-visual-qa/mobile-390-en-contact.png`

## Outcome

Visual QA: **PASS**. The hybrid is ready for independent Claude and Gemini review before preview deployment. Production remains untouched.
