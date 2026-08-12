# Studio Cue Light And Contact Tally Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add one first-view-only Hero entrance and delayed softbox cue plus a bounded Contact tally interaction without reviving the retired global lighting system or changing portfolio content, media, geometry, Figma truth, or Contact delivery.

**Architecture:** A tiny synchronous inline head bootstrap performs the only runtime decision: when motion is allowed and a guarded `sessionStorage` key is absent, it marks `<html>` with `studio-cue` before CSS can paint. CSS owns every visual state; default, repeat-visit, storage-failure, no-JavaScript, and reduced-motion paths remain fully visible and static. The existing Contact anchor gains the semantic `contact-tally` class, while its dot-to-tally response remains CSS-only.

**Tech Stack:** Node.js static-site generator, semantic HTML, CSS animations/media queries, Node test runner, native Python Playwright, Vercel static Preview packaging.

---

Status: `READY_FOR_PRODUCER_REVIEW / IMPLEMENTATION_NOT_AUTHORIZED`

Design contract:
`docs/superpowers/specs/2026-08-12-studio-cue-light-button-microinteraction-design.md`

## Authorization And Safety Boundary

- Written-spec approval is recorded by the producer's 2026-08-12 instruction
  to continue. This plan does not itself authorize implementation.
- Start implementation only after a separate producer authorization.
- The active-work timebox is 90 minutes from the first runtime or test edit.
- Work only on `codex/hero-portrait-refresh`; do not switch, reset, clean,
  stash, rebase, or discard the retained chain.
- Runtime rollback baseline is Hero F closeout
  `f0c2f9cd48bad123dedc78e27820fa6c0987d0bc`. The approved written-spec
  checkpoint is `8bcd6fa110b23d05d34969d30cd65a21088bee99`.
- `origin/main` remains
  `7d76b891240d2a0850b14d4159052ef5bbca3273` unless a later authorized record
  explicitly says otherwise.
- The following file is user-owned and must remain untracked, unstaged,
  unmoved, unmodified, and uncommitted:
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`.
- Its required SHA-256 is
  `945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc`.
- No Git push, `main`, Production, alias/domain, Contact/API, tag, Figma
  current-reference, media, copy, dependency, or access-policy change belongs
  to this plan.
- After every gate passes, one isolated static `dist/`-only Preview is covered
  by standing authorization. It must contain no Contact function and must not
  be fetched after deployment.

## File Map

- Modify `tests/build-site.test.mjs`: add RED contracts for the head bootstrap,
  Hero-only choreography, responsive/reduced fallbacks, retired-effect absence,
  and Contact tally behavior; update the existing Contact class assertion.
- Modify `scripts/build-site.mjs`: render one static inline bootstrap before
  the stylesheet and add `contact-tally` to the existing header Contact anchor.
- Modify `src/styles.css`: add the Hero-bounded `::before` light surface,
  three-beat entrance, mobile reduction, reduced-motion defenses, and tally
  transforms; remove only `.hero-content` from the existing broad `rise` group.
- Modify `STATUS.md`: record implementation authorization, exact commits,
  observed gate results, Preview identity if created, open items, and exact
  next action.
- Modify `docs/reviews/LOG.md`: replace the current specification-only entry
  with the final bounded package summary, staying within ten lines.
- Keep browser screenshots, request ledgers, timing JSON, and temporary Vercel
  staging under `/private/tmp`; do not add them to Git for this small package.

No new source file, runtime asset, dependency, data field, Figma export,
`src/main.js` behavior, Contact endpoint, or deployment configuration is
needed.

### Task 1: Freeze Safety State And Prove The RED Contract

**Files:**
- Modify: `tests/build-site.test.mjs:1187-1270`
- Read: `scripts/build-site.mjs:729-783`
- Read: `src/styles.css:92-114,127-205,1475-1525`
- Protect: `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`

- [ ] **Step 1: Re-run the read-only implementation preflight**

Run each command separately:

```bash
git branch --show-current
git rev-parse HEAD
git rev-parse origin/main
git status --short --branch --untracked-files=all
git diff --quiet f0c2f9cd48bad123dedc78e27820fa6c0987d0bc -- scripts src tests data public api package.json package-lock.json vercel.json
shasum -a 256 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
git ls-files --error-unmatch 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
```

Expected: branch `codex/hero-portrait-refresh`; `origin/main` is `7d76b891…3273`;
the runtime diff command exits 0; status lists only the protected untracked
file; its hash is exact; `git ls-files --error-unmatch` exits 1 because the
file remains outside Git. Stop on any other state.

- [ ] **Step 2: Capture the matched pre-implementation performance baseline**

Create `/private/tmp/portfolio-studio-cue-perf.py` with `apply_patch` and this
complete content:

```python
import json
import statistics
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
LABEL = sys.argv[1]
OUTPUT = Path(f"/private/tmp/portfolio-studio-cue-{LABEL}-perf.json")
VIEWPORTS = {"desktop": (1440, 900), "mobile": (390, 844)}
results = {}

with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    for name, (width, height) in VIEWPORTS.items():
        runs = []
        for _ in range(3):
            context = browser.new_context(
                viewport={"width": width, "height": height},
                reduced_motion="no-preference",
            )
            page = context.new_page()
            page.add_init_script("""
              window.__portfolioPerf = { lcp: 0, longTaskDuration: 0, longTaskCount: 0 };
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) window.__portfolioPerf.lcp = entry.startTime;
              }).observe({ type: 'largest-contentful-paint', buffered: true });
              new PerformanceObserver((list) => {
                for (const entry of list.getEntries()) {
                  window.__portfolioPerf.longTaskDuration += entry.duration;
                  window.__portfolioPerf.longTaskCount += 1;
                }
              }).observe({ type: 'longtask', buffered: true });
            """)
            page.goto(BASE + "/en/", wait_until="networkidle")
            page.wait_for_timeout(1600)
            run = page.evaluate("""() => ({
              ...window.__portfolioPerf,
              resources: performance.getEntriesByType('resource').map((entry) => entry.name),
            })""")
            assert run["lcp"] > 0, run
            runs.append(run)
            context.close()
        results[name] = {
            "runs": runs,
            "medianLcp": statistics.median(run["lcp"] for run in runs),
            "medianLongTaskDuration": statistics.median(run["longTaskDuration"] for run in runs),
            "resourceCount": len(runs[0]["resources"]),
        }
    browser.close()

OUTPUT.write_text(json.dumps(results, indent=2), encoding="utf-8")
print(json.dumps({"label": LABEL, "output": str(OUTPUT), "results": results}, indent=2))
```

Build and run the baseline from the still-runtime-identical plan checkout:

Resolve `PORTFOLIO_WEBAPP_TESTING_SKILL` to the directory containing the
currently selected `webapp-testing/SKILL.md` from the active skill catalog.
Keep that machine-local value outside Git.

```bash
npm run build
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" --server 'npm run serve' --port 4173 -- python3 /private/tmp/portfolio-studio-cue-perf.py baseline
```

Expected: three usable desktop runs and three usable mobile runs are written to
`/private/tmp/portfolio-studio-cue-baseline-perf.json`. Keep this file outside
Git for the matched post-implementation comparison.

- [ ] **Step 3: Add the bootstrap and visual contract tests**

Insert these tests immediately before
`renderPage creates bilingual page with scroll-stack works and video fallbacks`:

```js
test("Studio Cue opts in once per tab before CSS and fails open", () => {
  const site = loadSiteData(root);
  const works = loadWorks(join(root, "content/works"));
  const html = renderPage({ lang: "en", site, works });
  const zhHtml = renderPage({ lang: "zh", site, works });
  const bootstrapMatch = html.match(
    /<script data-studio-cue-bootstrap>([\s\S]*?)<\/script>/,
  );

  assert.ok(bootstrapMatch, "the synchronous head bootstrap must be present");
  const bootstrap = bootstrapMatch[1];
  assert.ok(
    html.indexOf("data-studio-cue-bootstrap")
      < html.indexOf('rel="stylesheet"'),
    "the opt-in must run before CSS can hide an eligible Hero",
  );
  assert.match(bootstrap, /portfolio:studio-cue:v1/);
  assert.match(bootstrap, /matchMedia\("\(prefers-reduced-motion: reduce\)"\)\.matches/);
  assert.match(bootstrap, /window\.sessionStorage\.getItem\(key\)/);
  assert.match(bootstrap, /window\.sessionStorage\.setItem\(key, "played"\)/);
  assert.match(bootstrap, /root\.classList\.add\("studio-cue"\)/);
  assert.match(bootstrap, /catch \{/);
  assert.match(bootstrap, /root\.classList\.remove\("studio-cue"\)/);
  assert.ok(
    bootstrap.indexOf('setItem(key, "played")')
      < bootstrap.indexOf('classList.add("studio-cue")'),
    "storage must succeed before any content may enter an animated state",
  );
  assert.doesNotMatch(
    bootstrap,
    /addEventListener|requestAnimationFrame|pointer|scroll|resize/,
  );
  assert.doesNotMatch(html, /<html[^>]*class="[^"]*studio-cue/);
  assert.match(html, /class="nav-contact contact-tally" href="#contact"/);
  assert.match(zhHtml, /class="nav-contact contact-tally" href="#contact"/);
  assert.equal(html.match(/contact-tally/g)?.length, 1);
  assert.equal(zhHtml.match(/contact-tally/g)?.length, 1);
});

test("Studio Cue and Contact tally keep motion bounded and accessible", () => {
  const css = readFileSync(join(root, "src/styles.css"), "utf8");
  const rise = css.match(
    /@keyframes studioCueRise \{[\s\S]*?\n  \}/,
  )?.[0] || "";
  const light = css.match(
    /@keyframes studioCueLight \{[\s\S]*?\n  \}/,
  )?.[0] || "";

  assert.match(
    css,
    /\.hero::before \{[\s\S]*?rgba\(247, 242, 232, 0\.07\)[\s\S]*?at 100% 0%[\s\S]*?opacity: 0;[\s\S]*?pointer-events: none;[\s\S]*?position: absolute;/,
  );
  assert.match(
    css,
    /html\.studio-cue \.hero-media \{[^}]*animation: studioCueRise 320ms cubic-bezier\(0\.22, 1, 0\.36, 1\) 0ms both;/,
  );
  assert.match(
    css,
    /html\.studio-cue \.hero-content > \.eyebrow,\s*html\.studio-cue \.hero-content > h1 \{[^}]*animation: studioCueRise 320ms cubic-bezier\(0\.22, 1, 0\.36, 1\) 60ms both;/,
  );
  assert.match(
    css,
    /html\.studio-cue \.hero-roles,\s*html\.studio-cue \.hero-subcopy \{[^}]*animation: studioCueRise 320ms cubic-bezier\(0\.22, 1, 0\.36, 1\) 120ms both;/,
  );
  assert.match(
    css,
    /html\.studio-cue \.hero::before \{[^}]*animation: studioCueLight 480ms ease-out 940ms both;/,
  );
  assert.match(rise, /opacity: 0;/);
  assert.match(rise, /transform: translateY\(8px\);/);
  assert.match(rise, /opacity: 1;/);
  assert.match(rise, /transform: translateY\(0\);/);
  assert.match(light, /opacity: 0;/);
  assert.match(light, /opacity: 1;/);
  assert.doesNotMatch(rise + light, /filter|background|box-shadow|infinite/);
  assert.doesNotMatch(css, /\.hero-content,\s*\.work-panel/);
  assert.match(
    css,
    /\.work-panel,\s*\.archive-card,\s*\.collab-item,\s*\.contact-content \{[^}]*animation: rise 700ms ease both;/,
  );
  assert.match(
    css,
    /@media \(max-width: 820px\) \{[\s\S]*?\.hero::before \{[\s\S]*?at 0% 0%[\s\S]*?rgba\(247, 242, 232, 0\.045\)[\s\S]*?\}/,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?html\.studio-cue \.hero-media,[\s\S]*?animation: none;[\s\S]*?opacity: 1;[\s\S]*?transform: none;[\s\S]*?html\.studio-cue \.hero::before \{[^}]*animation: none;[^}]*opacity: 0;/,
  );
  assert.match(
    css,
    /\.contact-tally::before \{[^}]*transform-origin: center;[^}]*transition: transform 180ms/,
  );
  assert.match(
    css,
    /\.contact-tally:focus-visible::before \{[^}]*transform: scaleX\(1\.9\);[^}]*transition-duration: 160ms;/,
  );
  assert.match(
    css,
    /@media \(hover: hover\) and \(pointer: fine\) \{[\s\S]*?\.contact-tally:hover::before \{[^}]*transform: scaleX\(1\.9\);[^}]*transition-duration: 160ms;/,
  );
  assert.match(
    css,
    /@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\.contact-tally::before \{[^}]*transition: none;/,
  );
  assert.doesNotMatch(
    css,
    /\.light-beam-layer|\.light-beam|\.ambient-canvas|\.edge-glow-card|\.edge-light|is-lit|is-guided|mix-blend-mode/,
  );
  assert.doesNotMatch(css, /animation: studioCue[^;]*infinite/);
});
```

- [ ] **Step 4: Update the existing Contact markup assertion**

Change the existing assertion near line 1265 from:

```js
assert.match(html, /class="nav-contact" href="#contact"/);
```

to:

```js
assert.match(html, /class="nav-contact contact-tally" href="#contact"/);
```

- [ ] **Step 5: Run the focused RED gate**

Run:

```bash
node --test --test-name-pattern='Studio Cue' tests/build-site.test.mjs
```

Expected: two named tests fail because the baseline has no synchronous
bootstrap, `contact-tally`, `studioCueRise`, or `studioCueLight`, and still
includes `.hero-content` in the broad rise selector. Existing unrelated tests
selected by the runner remain skipped rather than failing.

- [ ] **Step 6: Commit the reproducible RED checkpoint**

```bash
git add -- tests/build-site.test.mjs
git diff --cached --check
git commit -m "test: define Studio Cue interaction contract"
```

Before committing, confirm the staged list contains only
`tests/build-site.test.mjs` and the protected file is still untracked with the
exact SHA-256.

### Task 2: Implement The Smallest Progressive Enhancement

**Files:**
- Modify: `scripts/build-site.mjs:120-130,738-775`
- Modify: `src/styles.css:92-114,127-205,1270-1290,1475-1525`
- Test: `tests/build-site.test.mjs`

- [ ] **Step 1: Add the synchronous fail-open bootstrap renderer**

Add this function immediately after `renderHeroPreloads()`:

```js
function renderStudioCueBootstrap() {
  return `<script data-studio-cue-bootstrap>(() => {
      const root = document.documentElement;
      try {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        const key = "portfolio:studio-cue:v1";
        if (window.sessionStorage.getItem(key) === "played") return;
        window.sessionStorage.setItem(key, "played");
        root.classList.add("studio-cue");
      } catch {
        root.classList.remove("studio-cue");
      }
    })();</script>`;
}
```

In `renderPage()`, place it after Hero preloads and before the stylesheet:

```js
    ${renderHeroPreloads(heroMedia)}
    ${renderStudioCueBootstrap()}
    <link rel="stylesheet" href="/styles.css?v=${ASSET_VERSION}">
```

Do not move the preload or module-script tags.

- [ ] **Step 2: Give the existing Contact anchor its bounded class**

Change only the Contact `navItems` record:

```js
{ href: "#contact", label: lang === "en" ? "Contact" : "聯絡", className: "nav-contact contact-tally" },
```

Do not add a wrapper, label, event listener, or second link.

- [ ] **Step 3: Add the tally transform without changing pill geometry**

Keep the existing `.nav-contact` and `.nav-contact::before` declarations. Add
the following directly after `.nav-contact::before`:

```css
.contact-tally::before {
  transform-origin: center;
  transition: transform 180ms cubic-bezier(0.22, 1, 0.36, 1);
}

.contact-tally:focus-visible::before {
  transform: scaleX(1.9);
  transition-duration: 160ms;
}

@media (hover: hover) and (pointer: fine) {
  .contact-tally:hover::before {
    transform: scaleX(1.9);
    transition-duration: 160ms;
  }
}
```

At the existing reduced-motion block, add:

```css
  .contact-tally::before {
    transition: none;
  }
```

The existing dot is `0.45rem`; `scaleX(1.9)` yields a visual width of about
13.7px at the root size without changing layout, gap, label position, or pill
width. Hover is declared only for a fine pointer; keyboard `:focus-visible`
remains independent and keeps the existing 2px/3px outline.

- [ ] **Step 4: Add the static Hero-bounded light surface**

Insert this immediately before the existing `.hero::after` rule:

```css
.hero::before {
  background:
    radial-gradient(ellipse 52% 40% at 0% 0%, rgba(247, 242, 232, 0.07), transparent 72%),
    radial-gradient(ellipse 52% 40% at 100% 0%, rgba(247, 242, 232, 0.07), transparent 72%);
  content: "";
  inset: 0;
  opacity: 0;
  pointer-events: none;
  position: absolute;
}
```

Do not alter `.hero::after`; because `::before` is generated first and the
Hero children follow it in painting order, the light remains behind the media
and copy while the bottom fade stays intact.

Inside the existing `@media (max-width: 820px)` block, add:

```css
  .hero::before {
    background: radial-gradient(
      ellipse 68% 42% at 0% 0%,
      rgba(247, 242, 232, 0.045),
      transparent 72%
    );
  }
```

This is the single neutral mobile spill; do not add an acid fringe.

- [ ] **Step 5: Replace only the Hero's old broad rise with Studio Cue timing**

In `@media (prefers-reduced-motion: no-preference)`, retain the existing
18-second portrait rule and replace the broad animation group with:

```css
  html.studio-cue .hero-media {
    animation: studioCueRise 320ms cubic-bezier(0.22, 1, 0.36, 1) 0ms both;
  }

  html.studio-cue .hero-content > .eyebrow,
  html.studio-cue .hero-content > h1 {
    animation: studioCueRise 320ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both;
  }

  html.studio-cue .hero-roles,
  html.studio-cue .hero-subcopy {
    animation: studioCueRise 320ms cubic-bezier(0.22, 1, 0.36, 1) 120ms both;
  }

  html.studio-cue .hero::before {
    animation: studioCueLight 480ms ease-out 940ms both;
  }

  .work-panel,
  .archive-card,
  .collab-item,
  .contact-content {
    animation: rise 700ms ease both;
  }

  @keyframes studioCueRise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes studioCueLight {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
```

Keep the existing `rise` and `heroStillPush` keyframes unchanged. Removing
`.hero-content` from the shared group makes repeat visits and no-JavaScript
Hero content immediately visible while preserving every non-Hero entrance.

- [ ] **Step 6: Add a defensive reduced-motion override**

Add this inside the existing `@media (prefers-reduced-motion: reduce)` block:

```css
  html.studio-cue .hero-media,
  html.studio-cue .hero-content > .eyebrow,
  html.studio-cue .hero-content > h1,
  html.studio-cue .hero-roles,
  html.studio-cue .hero-subcopy {
    animation: none;
    opacity: 1;
    transform: none;
  }

  html.studio-cue .hero::before {
    animation: none;
    opacity: 0;
  }
```

This handles a preference change after load even though the head bootstrap
already declines the cue when reduced motion is active.

- [ ] **Step 7: Run focused GREEN and full unit gates**

```bash
node --test --test-name-pattern='Studio Cue' tests/build-site.test.mjs
npm test
git diff --check
```

Expected: both Studio Cue tests pass; the full suite passes with the prior 177
tests plus the two new tests; the only new runtime names are `studio-cue` and
`contact-tally`.

- [ ] **Step 8: Inspect the generated output before committing**

```bash
npm run build
rg -n 'data-studio-cue-bootstrap|contact-tally' dist/en/index.html dist/zh/index.html
rg -n 'studioCueRise|studioCueLight|contact-tally' dist/styles.css
rg -n 'light-beam-layer|light-beam|ambient-canvas|edge-glow-card|edge-light|is-lit|is-guided|mix-blend-mode' scripts src dist/en/index.html dist/zh/index.html dist/styles.css
```

Expected: the first two scans find the new bounded contract; the retired-name
scan exits 1 with no matches. Verify the inline bootstrap precedes the
stylesheet in both generated languages.

- [ ] **Step 9: Commit the GREEN implementation**

```bash
git add -- scripts/build-site.mjs src/styles.css
git diff --cached --check
git commit -m "feat: add bounded Studio Cue motion"
```

The staged list must contain exactly those two runtime files. Do not stage
`dist/`, the plan/spec, status records, or the protected document in this
commit.

### Task 3: Run Browser And Visual Gates

**Files:**
- Create temporarily: `/private/tmp/portfolio-studio-cue-qa.py`
- Output temporarily: `/private/tmp/portfolio-studio-cue-qa/`
- Read only: generated `dist/`

- [ ] **Step 1: Check the server helper contract and rebuild**

```bash
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" --help
npm run build
```

Expected: helper usage requires one `--server`, one `--port`, and a trailing
command; build passes before any browser is opened.

- [ ] **Step 2: Create the native Python Playwright probe**

Create `/private/tmp/portfolio-studio-cue-qa.py` with `apply_patch` and this
complete content:

```python
import json
from pathlib import Path
from playwright.sync_api import sync_playwright

BASE = "http://127.0.0.1:4173"
OUT = Path("/private/tmp/portfolio-studio-cue-qa")
OUT.mkdir(parents=True, exist_ok=True)
results = []


def visible_state(page):
    return page.evaluate("""() => {
      const root = document.documentElement;
      const pick = (selector, pseudo = null) => {
        const node = document.querySelector(selector);
        const style = getComputedStyle(node, pseudo);
        return {
          opacity: style.opacity,
          transform: style.transform,
          animationName: style.animationName,
          animationDelay: style.animationDelay,
          animationDuration: style.animationDuration,
          backgroundImage: style.backgroundImage,
          outline: style.outline,
          outlineOffset: style.outlineOffset,
          offset: [node.offsetLeft, node.offsetTop, node.offsetWidth, node.offsetHeight],
        };
      };
      return {
        optedIn: root.classList.contains('studio-cue'),
        media: pick('.hero-media'),
        eyebrow: pick('.hero-content > .eyebrow'),
        title: pick('.hero-content > h1'),
        roles: pick('.hero-roles'),
        subcopy: pick('.hero-subcopy'),
        light: pick('.hero', '::before'),
        contact: pick('.contact-tally'),
        tally: pick('.contact-tally', '::before'),
        overflow: document.documentElement.scrollWidth - window.innerWidth,
        resourceNames: performance.getEntriesByType('resource').map((entry) => entry.name),
        animationStarts: window.__studioCueStarts || 0,
      };
    }""")


def open_case(
    browser,
    name,
    path,
    viewport,
    reduced=False,
    javascript=True,
    mobile=False,
    storage_failure=False,
):
    context = browser.new_context(
        viewport={"width": viewport[0], "height": viewport[1]},
        reduced_motion="reduce" if reduced else "no-preference",
        java_script_enabled=javascript,
        has_touch=mobile,
        is_mobile=mobile,
    )
    page = context.new_page()
    errors = []
    contact_posts = []
    page.on("console", lambda message: errors.append(f"console:{message.text}") if message.type == "error" else None)
    page.on("pageerror", lambda error: errors.append(f"page:{error}"))
    page.on(
        "request",
        lambda request: contact_posts.append(request.url)
        if request.method == "POST" or "/api/contact" in request.url
        else None,
    )
    if storage_failure:
        page.add_init_script("""
          Object.defineProperty(window, 'sessionStorage', {
            configurable: true,
            get() { throw new Error('synthetic storage failure'); },
          });
        """)
    if javascript:
        page.add_init_script("""
          window.__studioCueStarts = 0;
          document.addEventListener('animationstart', (event) => {
            if (event.animationName.startsWith('studioCue')) window.__studioCueStarts += 1;
          });
        """)
    page.goto(BASE + path, wait_until="domcontentloaded")
    started = page.evaluate("performance.now()")

    def wait_to(target_ms):
        elapsed = page.evaluate("performance.now()") - started
        page.wait_for_timeout(max(0, target_ms - elapsed))

    phase0 = visible_state(page)
    page.screenshot(path=str(OUT / f"{name}-0000.png"), full_page=False)
    wait_to(440)
    phase440 = visible_state(page)
    page.screenshot(path=str(OUT / f"{name}-0440.png"), full_page=False)
    wait_to(940)
    phase940 = visible_state(page)
    page.screenshot(path=str(OUT / f"{name}-0940.png"), full_page=False)
    wait_to(1420)
    phase1420 = visible_state(page)
    page.screenshot(path=str(OUT / f"{name}-1420.png"), full_page=False)
    result = {
        "name": name,
        "phases": {"0": phase0, "440": phase440, "940": phase940, "1420": phase1420},
        "errors": errors,
        "contactPosts": contact_posts,
    }
    results.append(result)
    return context, page, result


with sync_playwright() as playwright:
    browser = playwright.chromium.launch(headless=True)
    cases = [
        ("en-desktop", "/en/", (1440, 900), False, True, False, False),
        ("zh-desktop", "/zh/", (1200, 900), False, True, False, False),
        ("zh-tablet", "/zh/", (834, 1112), False, True, False, False),
        ("en-mobile", "/en/", (390, 844), False, True, True, False),
        ("zh-narrow", "/zh/", (360, 800), False, True, True, False),
        ("en-reduced", "/en/", (1440, 900), True, True, False, False),
        ("zh-no-js", "/zh/", (390, 844), False, False, True, False),
        ("en-storage-failure", "/en/", (1440, 900), False, True, False, True),
    ]
    live_pages = []
    for case in cases:
        context, page, result = open_case(browser, *case)
        live_pages.append((context, page, result))

    desktop_context, desktop_page, desktop = live_pages[0]
    first_starts = desktop["phases"]["1420"]["animationStarts"]
    desktop_page.locator(".contact-tally").click()
    anchor_state = visible_state(desktop_page)
    desktop_page.goto(BASE + "/zh/", wait_until="networkidle")
    language_state = visible_state(desktop_page)
    desktop_page.go_back(wait_until="networkidle")
    bfcache_state = visible_state(desktop_page)
    desktop_page.reload(wait_until="networkidle")
    reload_state = visible_state(desktop_page)
    desktop["repeat"] = {
        "firstStarts": first_starts,
        "anchor": anchor_state,
        "reload": reload_state,
        "language": language_state,
        "back": bfcache_state,
    }
    contact = desktop_page.locator(".contact-tally")
    contact.focus()
    desktop["focus"] = visible_state(desktop_page)
    contact.evaluate("element => element.blur()")
    contact.hover()
    desktop["hover"] = visible_state(desktop_page)
    mobile_page = live_pages[3][1]
    mobile_page.locator(".contact-tally").tap()
    live_pages[3][2]["tap"] = visible_state(mobile_page)

    for context, _, _ in live_pages:
        context.close()
    browser.close()

for result in results:
    final = result["phases"]["1420"]
    assert not result["errors"], result
    assert not result["contactPosts"], result
    assert final["overflow"] <= 0, result
    assert not any("studio" in name.lower() or "light" in name.lower() for name in final["resourceNames"]), result

for result in results[:5]:
    phases = result["phases"]
    assert phases["0"]["optedIn"], result
    assert phases["0"]["media"]["animationName"] == "studioCueRise", result
    assert phases["440"]["light"]["opacity"] == "0", result
    assert float(phases["1420"]["light"]["opacity"]) > 0.95, result
    offsets = [tuple(phases[key]["media"]["offset"]) for key in ("0", "440", "940", "1420")]
    assert len(set(offsets)) == 1, result

assert "100% 0%" in results[0]["phases"]["1420"]["light"]["backgroundImage"]
assert "100% 0%" not in results[3]["phases"]["1420"]["light"]["backgroundImage"]
for index in (5, 6, 7):
    static = results[index]["phases"]["0"]
    assert not static["optedIn"]
    assert static["light"]["opacity"] == "0"
    for anatomy in ("media", "eyebrow", "title", "roles", "subcopy"):
        assert static[anatomy]["opacity"] == "1", (index, anatomy, static)
        assert static[anatomy]["animationName"] == "none", (index, anatomy, static)
assert results[0]["repeat"]["anchor"]["animationStarts"] == results[0]["repeat"]["firstStarts"]
assert not results[0]["repeat"]["reload"]["optedIn"]
assert not results[0]["repeat"]["language"]["optedIn"]
assert results[0]["repeat"]["back"]["animationStarts"] == results[0]["repeat"]["firstStarts"]
assert results[0]["focus"]["contact"]["outline"] != "none"
assert results[0]["focus"]["contact"]["outlineOffset"] == "3px"
assert results[0]["focus"]["tally"]["transform"] != "none"
assert results[0]["hover"]["tally"]["transform"] != "none"
assert results[0]["focus"]["contact"]["offset"] == results[0]["repeat"]["reload"]["contact"]["offset"]
assert results[0]["hover"]["contact"]["offset"] == results[0]["repeat"]["reload"]["contact"]["offset"]
assert results[3]["tap"]["tally"]["transform"] == "none"

(OUT / "results.json").write_text(json.dumps(results, indent=2), encoding="utf-8")
print(json.dumps({"cases": len(results), "result": "PASS", "output": str(OUT)}, indent=2))
```

- [ ] **Step 3: Run the managed local browser matrix**

```bash
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" --server 'npm run serve' --port 4173 -- python3 /private/tmp/portfolio-studio-cue-qa.py
```

Expected: `8` cases and `PASS`; English/Chinese desktop, tablet, mobile,
narrow, reduced-motion, no-JavaScript, and storage-failure states have no
error, overflow, extra light request, or Contact request. Anchor navigation,
reload, and language navigation do not replay the cue; BFCache return does not
increment Studio Cue animation starts; a coarse-pointer tap does not retain a
tally transform. Every case records the four requested phase captures near
0ms, 440ms, 940ms, and 1420ms.

- [ ] **Step 4: Compare matched performance and request behavior**

Run the identical three-run probe against the implementation:

```bash
python3 "$PORTFOLIO_WEBAPP_TESTING_SKILL/scripts/with_server.py" --server 'npm run serve' --port 4173 -- python3 /private/tmp/portfolio-studio-cue-perf.py implementation
```

Create `/private/tmp/portfolio-studio-cue-perf-compare.py` with `apply_patch`
and this complete content:

```python
import json
from pathlib import Path

baseline = json.loads(Path("/private/tmp/portfolio-studio-cue-baseline-perf.json").read_text())
implementation = json.loads(Path("/private/tmp/portfolio-studio-cue-implementation-perf.json").read_text())

for viewport in ("desktop", "mobile"):
    before = baseline[viewport]
    after = implementation[viewport]
    assert after["resourceCount"] == before["resourceCount"], (viewport, before, after)
    assert after["medianLcp"] <= before["medianLcp"] * 1.20 + 50, (viewport, before, after)
    assert after["medianLongTaskDuration"] <= before["medianLongTaskDuration"] + 10, (viewport, before, after)

print(json.dumps({"result": "PASS", "baseline": baseline, "implementation": implementation}, indent=2))
```

Run:

```bash
python3 /private/tmp/portfolio-studio-cue-perf-compare.py
```

Expected: `PASS`; resource counts are identical, matched three-run median LCP
stays within 20% plus 50ms of baseline, and median long-task duration adds no
more than 10ms. Treat a failure as a blocker until the bootstrap/CSS work is
reduced or the variance is reproduced with another matched three-run pair.

- [ ] **Step 5: Visually inspect the normal-motion captures**

Open these with the local image viewer:

```text
/private/tmp/portfolio-studio-cue-qa/en-desktop-0000.png
/private/tmp/portfolio-studio-cue-qa/en-desktop-0440.png
/private/tmp/portfolio-studio-cue-qa/en-desktop-0940.png
/private/tmp/portfolio-studio-cue-qa/en-desktop-1420.png
/private/tmp/portfolio-studio-cue-qa/zh-desktop-1420.png
/private/tmp/portfolio-studio-cue-qa/zh-tablet-1420.png
/private/tmp/portfolio-studio-cue-qa/en-mobile-1420.png
/private/tmp/portfolio-studio-cue-qa/zh-narrow-1420.png
```

Accept only when the paired desktop/tablet spill is quiet and neutral, mobile
shows one upper-left spill, portrait F skin tone and copy contrast remain
natural, the bottom fade has no seam, the tally does not move its label or pill,
and no light reads as a neon beam. If opacity requires adjustment, change only
the two documented alpha values within the spec ceilings, rerun Task 2 tests
and all of Task 3, and include that remediation in the implementation commit.

### Task 4: Run Full Gates And Close The Local Implementation

**Files:**
- Modify: `STATUS.md:1-35,1258-1285`
- Modify: `docs/reviews/LOG.md:7-16`
- Verify: all owned runtime and test paths

- [ ] **Step 1: Run every repository gate**

Run separately:

```bash
npm test
npm run build
npm run audit:design-contract
npm run figma:export
npm run featured-reels:check
node --test tests/hero-image-delivery.test.mjs tests/hero-media.test.mjs
git diff --check
shasum -a 256 'docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md'
```

Expected: all tests and generation gates pass; Figma export creates no tracked
drift; Hero delivery remains exact; the protected hash is unchanged.

- [ ] **Step 2: Run privacy, dependency, and scope checks**

```bash
git diff --name-only f0c2f9cd48bad123dedc78e27820fa6c0987d0bc -- scripts src tests data public api package.json package-lock.json vercel.json
rg -n '/(Users|home)/[^/[:space:]]+/|screening-strip-media-contract|945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc' dist
npm audit --omit=dev
git status --short --branch --untracked-files=all
```

Expected: runtime diff lists only `scripts/build-site.mjs`, `src/styles.css`,
and `tests/build-site.test.mjs`; the privacy scan exits 1; audit reports zero
vulnerabilities; status contains no unplanned tracked change and still lists
the protected file as untracked.

- [ ] **Step 3: Record the exact implementation outcome**

Update `STATUS.md` so the current package records:

- producer authorization wording and timestamp from the implementation turn;
- RED commit and GREEN implementation commit copied from `git log`;
- exact focused/full test counts and each passed command;
- 8/8 browser matrix, phase captures, first-view/repeat/BFCache results, zero
  Contact requests/errors/overflow, matched LCP/request/long-task comparison,
  and visual inspection verdict;
- exact protected-file hash and local-only durability state;
- a `PASS_WITH_OPEN_ITEMS` verdict until Preview creation/readback and producer
  inspection are complete;
- exact next action: construct and deploy the one standing-authorized static
  Preview, then hand its URL to the producer without touching Production.

Replace the specification entry at the top of `docs/reviews/LOG.md` with at
most eight bullets covering the same facts. Do not create a dated closeout
report for this small package.

- [ ] **Step 4: Commit local closeout records**

```bash
git add -- STATUS.md docs/reviews/LOG.md
git diff --cached --check
git commit -m "docs: record Studio Cue local validation"
```

Confirm the protected document is absent from the staged list and retains the
exact hash.

### Task 5: Create The Standing-Authorized Static Preview

**Files:**
- Read: fresh `dist/`
- Create temporarily: one `/private/tmp/portfolio-studio-cue-preview.*` staging
  directory
- Modify after readback: `STATUS.md`, `docs/reviews/LOG.md`

- [ ] **Step 1: Build a fresh isolated static package**

Run `npm run build`, then create and retain an explicit shell variable with:

```bash
preview_stage="$(mktemp -d /private/tmp/portfolio-studio-cue-preview.XXXXXX)"
```

Confirm `$preview_stage` begins with
`/private/tmp/portfolio-studio-cue-preview.` before using it. Copy `dist/.`
into that exact directory. Add only this `vercel.json` to that staging root
using `apply_patch`:

```json
{
  "cleanUrls": true
}
```

Do not copy repository `vercel.json`, `api/`, `.git`, `.env*`, source, tests,
reviews, package manifests, or the protected document.

- [ ] **Step 2: Audit the exact staging payload**

Run these commands in the same shell that owns `$preview_stage`:

```bash
find "$preview_stage" -type f -print
rg -n '/(Users|home)/[^/[:space:]]+/|screening-strip-media-contract|945d4df9a06f33b55d843afed34d65d4e42b527d07c7b64629712f3f251d28fc|RESEND_API_KEY|api/contact|\.env' "$preview_stage"
python3 -c 'import hashlib,pathlib,sys; root=pathlib.Path(sys.argv[1]); files=sorted(p.relative_to(root).as_posix() for p in root.rglob("*") if p.is_file() and ".vercel" not in p.parts); print(len(files)); print(sum((root/p).stat().st_size for p in files)); print(hashlib.sha256("\n".join(files).encode()).hexdigest())' "$preview_stage"
```

Expected: the privacy scan exits 1; the inventory contains generated public
files plus the minimal static config, and contains no function.

- [ ] **Step 3: Link only to the existing portfolio project**

From the isolated staging directory, run:

```bash
npx --yes vercel@latest link --yes --scope projectmoonie-creators-projects --project hsin-hsin-yuan-portfolio
```

If Vercel cannot prove that exact existing project, stop. Remove any temporary
`.env.local` and generated `.gitignore` from the staging directory only after
recording their presence and without reading or printing the environment
content; never operate on the repository. Re-run the payload audit before
deployment. `.vercel/project.json` is local CLI linkage and must not be counted
as a public deployment file.

After confirming the already-validated `$preview_stage` prefix, remove only
those two CLI-generated staging files:

```bash
rm -f -- "$preview_stage/.env.local" "$preview_stage/.gitignore"
```

- [ ] **Step 4: Deploy one Preview and read back metadata**

From the isolated staging directory, run:

```bash
npx --yes vercel@latest deploy --yes --target=preview --scope projectmoonie-creators-projects --meta packageClass=dist-only
```

Never add `--prod`. Do not use Git push to obtain a Preview. Inspect the
returned deployment with `vercel inspect`; require target `preview`, status
`Ready`, a static root, and no functions. Per deployment policy, do not curl,
open, or fetch the deployed URL.

- [ ] **Step 5: Record Preview identity and finish the handoff**

Update `STATUS.md` and the existing LOG entry with the exact deployment ID,
Ready/Preview state, origin URL, file count, byte count, path-list hash,
function-free result, and explicit no-fetch/no-Contact statement. Keep the
access URL out of Git. Set the package verdict to `PASS_WITH_OPEN_ITEMS` only
for producer visual inspection; Production, alias, `main`, Git push, Contact,
and share-link replacement remain outside this plan.

Commit only the two current-state records:

```bash
git add -- STATUS.md docs/reviews/LOG.md
git diff --cached --check
git commit -m "docs: record Studio Cue Preview"
```

Final status must list only the protected untracked document, whose SHA-256 is
still exact. Report how many local commits are unreachable from origin with:

```bash
git rev-list --count HEAD --not --remotes=origin
```

## Rollback

If implementation is not producer-accepted by the 90-minute boundary, do not
touch the protected file or reset the branch. Restore only these future-owned
paths to the approved specification checkpoint by applying explicit reverse
patches or reverting the owned implementation commits:

```text
tests/build-site.test.mjs
scripts/build-site.mjs
src/styles.css
STATUS.md
docs/reviews/LOG.md
```

Do not alter Hero F media or commit `f0c2f9c`, the specification/plan history,
unrelated site behavior, remote refs, deployments, aliases, or Production.

## Completion Criteria

- New cue plays once per tab only when JavaScript, storage, and motion policy
  permit it.
- Three Hero beats finish by 440ms; paired light starts at 940ms and finishes
  at 1420ms; mobile uses one neutral spill.
- Default, reload, language switch, no-JavaScript, storage failure, and reduced
  paths are immediately complete; BFCache return adds no animation start.
- Contact dot becomes a 12–14px tally only on keyboard focus-visible or a fine
  pointer hover, with unchanged visible focus and no sticky coarse hover.
- Only opacity and transform animate; no new request, asset, dependency,
  listener, global layer, blur, blend mode, loop, pointer tracking, scroll
  tracking, or retired fingerprint exists.
- Hero F delivery, preload, crop, slow push, content, layout, Figma output,
  reels, privacy, and Contact delivery remain unchanged.
- Full automated, browser, visual, protected-file, and static packaging gates
  pass before the single Preview is created.
- No Git push, `main`, Production, alias, Contact submission, protected-file
  action, or deployed-page fetch occurs.
