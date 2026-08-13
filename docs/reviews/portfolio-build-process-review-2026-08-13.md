# Hsin-Hsin Yuan Portfolio — Build Process Review

Date: 2026-08-13 (Asia/Taipei)

Status: Final — Gemini reviewed and locally adjudicated

## Executive conclusion

The portfolio is no longer an exploratory prototype. Its public structure,
content model, responsive behavior, media delivery, interaction rules, Figma
handoff, and release gates are mature enough to freeze as a product baseline.
The producer's concern is nevertheless correct: after several section purposes
had become clear, component and format ownership still lagged behind the visual
and interaction exploration. The middle of the project therefore contains
avoidable leaf-level backtracking and several residual "second truths."

The right next move is not a broad rewrite before Production. It is to:

1. accept or revise the current Hero composition;
2. release only after explicit producer approval;
3. declare the current component contract frozen; and
4. run future requests through a small change router so each request touches
   its owning layer instead of reopening the page as a whole.

## What happened

### 1. Discovery and rapid natural growth — 2026-07-09 to 2026-07-12

The first four days established the international portfolio, Hero, work
positioning, Contact path, collaboration marks, showreel, Featured work
presentation, screening loop, scroll stack, early light treatments, SEO, and
Figma handoff. This was useful discovery: it exposed what the portfolio needed
to communicate and which work evidence mattered.

It was also too early to treat every generated result as a reusable original.
Hero purpose, inline showreel behavior, About/availability, moving work index,
light language, and work-card anatomy were still changing together. A visual
change could therefore alter several unlabelled mechanisms at once.

### 2. Recovery, subtraction, and contract formation — 2026-07-29 to 2026-08-04

The project removed the accumulated light effects, repaired work links and
posters, separated work-specific reels, recovered Archive evidence, closed
privacy leaks, moved motion from the screening strip into Featured panels, and
then formalized the design and media contracts.

This was the turning point. The project introduced:

- one canonical design contract;
- named Featured presentation variants;
- a canonical media manifest;
- the HeroMedia component shared by website and Figma;
- explicit poster/playing ownership and lifecycle rules;
- validation and privacy gates; and
- bounded package and release governance.

The sequence was directionally right but late. The 2026-08-03 history contains
65 first-parent commits, indicating that specification, implementation,
evidence, review remediation, and closeout were fragmented into many small
checkpoints while the system was still being normalized.

### 3. Stabilization and productionization — 2026-08-06 to 2026-08-12

Later work increasingly used the new contracts correctly: collaboration marks,
Archive slideshow media, bilingual copy work orders, intentional localized
blanks, mobile reel ownership, responsive reel derivatives, Hero LCP delivery,
interaction intent, lifecycle safety, Preview access, portable FFmpeg checks,
and Production release all became bounded packages with explicit truth and
rollback paths.

These packages were more reliable because the page was no longer treated as a
single generated artifact. Content, media, presentation variants, playback
state, design export, and deployment had separate owners.

### 4. Current Hero refinement — 2026-08-13

The retouched user-supplied Hero photo was correctly replaced through the
existing canonical media path. The follow-up request to make the person smaller
initially looked like an image-crop problem. Inspection showed the real cause:
the Hero display applied a 1.40 motion-start scale while static CSS separately
declared 142%, 132%, and 136% scales by breakpoint.

An AI outpainting experiment was generated only as a diagnostic and rejected
before integration because it could alter identity. The final change leaves the
producer's edited pixels untouched, reduces the canonical slow-push range from
1.40–1.48 to 1.20–1.26, and makes static output consume that same canonical
start scale. The person is roughly 14–15% smaller linearly while the approved
frame, focal points, gradients, copy, links, and responsive geometry remain.

This small case demonstrates both the improvement and the residual issue: the
Hero had already been componentized, but one presentation value still had
multiple owners. Fixing ownership was cleaner than regenerating the asset.

## Evidence snapshot

- First-parent history through the pre-report checkpoint: 302 commits from
  2026-07-09 through 2026-08-13.
- Heuristic docs/evidence-like commit count: 113. This is not a quality score;
  many commits are legitimate privacy, recovery, Preview, or release evidence.
- Highest daily first-parent count: 65 on 2026-08-03, during design-contract,
  reel, content-cleanup, and governance consolidation.
- Current deterministic suite: 179/179 passing.
- Current Hero browser matrix: English desktop, Chinese mobile, mobile reduced
  motion, and desktop no-JavaScript all pass with zero overflow or relevant
  page/image/console failure.
- Separate incremental Hero review requested/observed/completed
  `gpt-5.6-sol`, returned `PASS` with no P0/P1/P2, and confirmed full frame
  coverage plus one scale truth across runtime, CSS, reduced motion, no-JS, and
  Figma output.
- Design audit: no active contract drift.
- Hero and Featured media integrity: 9/9 and 6/6.
- Protected user-owned document remains untracked and byte-identical at
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.

## What worked well

### Producer feedback remained authoritative

The project repeatedly changed direction when the producer identified the real
reading problem: too much light, duplicated actions, overly tall reel geometry,
incorrect screening behavior, wording that did not sound right, or a Hero that
felt too face-forward. This prevented an internally consistent but personally
wrong portfolio.

### Safety and evidence became unusually strong

Privacy classification, protected-file checks, source rights, no-Contact
submission, explicit Preview/Production boundaries, reduced motion,
no-JavaScript, lifecycle/reset coverage, and exact media validation are durable
strengths. They should be retained.

### The system now has real originals

The current site is substantially componentized:

- `data/site.json.heroMedia` owns the Hero source contract;
- `docs/design-contract.md` owns current public component anatomy and variants;
- Featured and Archive are normalized separately;
- the media manifest owns derivative recipes and integrity;
- Figma consumes the same content/media contracts;
- bilingual edits use stable keys and guarded work orders; and
- Preview and Production have explicit authorization boundaries.

The claim that "nothing became an original" would therefore be inaccurate.
The accurate diagnosis is that originalization happened after exploration and
some residual values remained split across layers.

## Where time was lost

### Contract consolidation lagged behind stabilized purpose

Hero moving among portrait, showreel, Play interaction, still image, and a
lighting cue, and the screening strip moving between motion and navigation,
were legitimate discovery. The inefficiency began after those jobs had become
clear but scale, crop, runtime state, breakpoint CSS, and design output were not
yet promoted into one shared contract. The project lacked an explicit moment
saying: "discovery has ended; further changes are content, asset, composition,
or behavior changes inside this component."

### Fidelity stages were not labelled consistently

Generated candidate, approved visual direction, canonical asset, and final
production source were sometimes discussed as if they were the same level of
commitment. That made the producer reasonably unsure whether a section was
still being AI-generated or had become a stable reusable original.

### Ownership occasionally remained duplicated

The current Hero scale bug is concrete evidence: motion scale belonged to the
normalized Hero contract while static breakpoint scales lived separately in
CSS. Earlier versions also had duplicated site/Figma arrays, inferred variants,
slug-specific behavior, and repeated work destinations. Many were fixed, but
the pattern explains part of the middle-stage friction.

### Evidence work was sometimes more granular than the decision

The project frequently created separate spec, plan, RED, GREEN, review,
Preview, access, and closeout commits for very small packages. Auditability is
valuable, but the resulting history and STATUS burden made the current decision
harder to see. The process began correcting this on 2026-08-04, but historical
weight remains.

### External-review failures added secondary operational friction

Several Claude/Gemini attempts were incomplete because of timeout, empty
candidates, or tooling state. They were recorded honestly, which is good, but
some packages paid coordination cost without gaining a usable independent
finding. This was not a primary design cause, but it increased record weight.
External AI should be concentrated at the risk and architecture boundaries
where its marginal value is highest.

## Recommended fixed framework

### A. Three maturity states and one promotion action

- **Exploratory:** purpose and form may change; results are candidates, not
  reusable originals.
- **Provisional:** purpose is likely stable; use a one-page role/asset/token
  brief and one responsive candidate, without a heavyweight component schema.
- **Contract-bound:** purpose, anatomy, owners, variants, fallbacks, and release
  evidence are fixed until the producer explicitly opens a new structural
  phase.

A section moves to contract-bound through one explicit promotion action, not by
counting consecutive Previews. Promotion occurs when either:

- the producer says its purpose/anatomy is final; or
- the producer accepts a Preview as the release candidate and the package
  records its component/media contract.

Generating a manifest alone does not prove design acceptance. After promotion,
a request must be classified before work begins. A structural change reopens
the component only with an explicit lo-fi proposal.

### B. Five-way change router

| Request type | Owning layer | Normal allowed change |
| --- | --- | --- |
| Copy/content | Canonical data | Stable-key/data edit only |
| Asset | Media contract | Source + metadata + derivatives only |
| Composition | Named presentation contract | Focal/scale/fit/variant token |
| Behavior | Component state machine | Focus/touch/lifecycle logic + tests |
| Structure | Section/component architecture | Lo-fi proposal and producer approval first |

If a normal request needs more than two owning layers, stop and identify the
missing contract before implementing. Do not patch every consumer separately.

### C. Component definition of done

Every reusable section needs one compact contract that names:

1. purpose and reading moment;
2. required anatomy and field order;
3. optional modules and omission behavior;
4. named visual variants;
5. desktop/mobile/reduced-motion/no-JS invariants;
6. canonical data/media owner;
7. all consumers, including Figma;
8. replacement recipe;
9. positive and negative regression checks; and
10. rollback checkpoint.

The current `docs/design-contract.md` already contains most of this. Future
work should extend it only when a genuinely new component capability appears,
not for every content edit.

### D. One decision, one candidate, one Preview

For normal refinements:

1. diagnose the owning layer;
2. present or implement one bounded candidate;
3. run focused tests and one desktop/mobile visual pair;
4. create one Shareable Preview; and
5. receive one producer ruling.

Do not create a second mechanism before the first candidate is judged. Do not
deploy separate Previews for documentation-only follow-ups.

### E. Leaner durable records

- Prefer one implementation commit and one evidence/closeout commit per normal
  package; use a third only for independently meaningful remediation.
- Keep `STATUS.md` limited to the current package, accepted production
  baseline, protected item, exact next action, and cold-resume facts.
- Keep historical package summaries in `docs/reviews/LOG.md` and dated reports;
  do not duplicate them in STATUS.
- Run Gemini/Claude at major architecture, phase-closeout, truth/privacy, and
  Production boundaries. Routine contract-preserving asset swaps need only the
  risk-tier reviewer required by the Bible.

## Proposed operating rule for the next phase

The current portfolio should enter **maintenance mode** after the Hero is
accepted:

- no visual redesign without a named new phase;
- no broad component-library rewrite before Production;
- routine copy and media replacements remain data-only;
- composition adjustments use existing named contracts;
- behavior changes remain bounded state-machine packages; and
- any repeated exception is converted into one explicit variant before a third
  record adopts it.

This keeps the creative gains of natural growth while making future changes
predictable, faster, and easier for the producer to understand.

## Independent Gemini review

The first proposed packet included local paths and the current Hero screenshot;
the privacy gate rejected it before transmission. A materially safer,
process-only packet removed all repository paths, images, access URLs,
credentials, and private evidence. Gemini then requested, observed, and
completed `gemini-3.6-flash` through the shared REST reviewer with 1,238 input,
889 output, and 4,111 total tokens.

Gemini returned `PASS_WITH_REVISIONS`. Its strongest conclusions were that
early exploration bought real knowledge, residual dual-truth ownership was the
main technical friction, maintenance mode is safer than a broad rewrite, and a
single explicit promotion is better than tracking two consecutive Previews.

### Local adjudication

| Finding | Ruling | Result |
| --- | --- | --- |
| The draft over-attributed friction to late purpose freeze | `agree` | Reframed the cause as delayed contract/token consolidation after purpose stabilized. |
| Two-Preview freeze tracking adds meta-process | `agree` | Replaced it with one explicit producer/release-candidate promotion action. |
| External-AI failures were overstated | `agree` | Reclassified them as secondary operational friction. |
| External AI should be restricted only to automated diff/privacy checks | `reject` | The current Bible also requires risk-tier independent review for user-visible, architecture, truth/privacy, and Production packages. |
| Every package must have an absolute two-commit cap | `downgrade` | Two commits remains the default; one independently meaningful remediation commit stays allowed. |
| A lightweight intermediate state was missing | `agree` | Added the provisional role/asset/token brief between exploration and a full contract. |

No Gemini finding blocks the Hero refinement, maintenance-mode recommendation,
or a producer-approved release. The exact raw result and provenance are in
`docs/reviews/portfolio-build-process-review-gemini-2026-08-13.md`.
