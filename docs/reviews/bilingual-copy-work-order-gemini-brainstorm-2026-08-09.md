### 1. problem_reframe

The core engineering challenge is not simply importing text from a spreadsheet into static files. It is constructing a deterministic, conflict-aware transport boundary between two incompatible paradigms:

1. **Human Editorial Workflow:** Non-programmer editorial reviews operating in spreadsheets (Excel), producing fuzzy metadata counts, unversioned cell updates, and non-atomic edits.
2. **Deterministic Repository State:** Strictly versioned, commit-pinned canonical content (`data/site.json`, `content/works/*.md`), schema contracts, and downstream test suites.

The copy update requires applying 31 approved stable-key entries (13 P0 positioning, 18 P1 work descriptions) across Chinese and English without allowing Excel to become an ongoing public source of truth, without corrupting JSON/YAML formatting, without allowing partial writes on conflict, and without breaking downstream build or rendering assumptions.

---

### 2. pragmatic_path

The proposed standard architecture—`Excel → versioned JSON work order → guarded Node CLI → canonical repo write`—defines a tight operational boundary:

*   **Transport Artifact (`work-order.json`):** A machine-readable, schema-validated JSON payload capturing:
    *   `batchId` and target `priority` (`P0`, `P1`).
    *   Source provenance (SHA-256 hashes of input `.xlsx`, `.json`, and `.md`).
    *   Target baseline Git commit SHA (`2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f`).
    *   Explicit key entries containing `stableKey`, `sourceFile`, `expectedCurrent` (per locale), and `targetValue` (per locale).
*   **Guarded Importer CLI (`scripts/apply-copy-work-order.js`):**
    *   **Default Mode:** Dry-run analysis and report generation.
    *   **Preflight Phase:** Loads target repo files (`data/site.json` and `content/works/*.md`), looks up each `stableKey`, and verifies that the live repository content exactly matches `expectedCurrent`.
    *   **Atomic Validation Gate:** If *any* key is missing, stale, or mismatched against `expectedCurrent`, the CLI aborts with a diagnostic report and writes zero files.
    *   **Write Phase (`--write --priority=P0`):** Updates only validated targets in memory, then writes back to disk.
*   **Scope Boundary:** Supports only `site.*` and `featured.<slug>.*` key parsers. Out-of-scope keys trigger explicit rejection rather than fallback processing.

#### Tradeoffs:
*   **Pros:** Dependency-free (standard Node.js `fs`/`path`), full preflight safety, explicit rollback on conflict (write-nothing policy), complete audit trail in git history.
*   **Cons:** Requires maintaining an intermediate JSON work order schema and CLI tool script within the repository footprint.

---

### 3. alternative_architecture

#### Architecture A: Direct Schema-Aware AST Importer (No Intermediate JSON Work Order)
Instead of creating a intermediate transport `work-order.json`, the CLI directly ingests the producer-provided `preview.json` and parses target source files using AST manipulation (`JSON.parse`/`JSON.stringify` with custom space formatting for standard JSON, and a YAML frontmatter parser for Markdown).

*   **Tradeoffs vs. Pragmatic Path:** Eliminates one file artifact (`work-order.json`). However, parsing and re-serializing frontmatter ASTs often strips custom YAML comments, alters line breaks, or reshuffles key ordering across markdown files, leading to noisy git diffs.

#### Architecture B: Inverted Centralized Translation Dictionary
Extract all public copy out of `data/site.json` and `content/works/*.md` frontmatter into a single canonical dictionary file (e.g., `data/locales/zh-TW.json` and `data/locales/en.json`). The website renderer loads strings dynamically or merges them at build time via stable keys.

*   **Tradeoffs vs. Pragmatic Path:** Solves the multi-file scattered source issue permanently by consolidating target files. However, it violates the constraint against layout/architecture refactoring, changes the site's content structure, and requires migrating all site components and build pipelines.

---

### 4. low_cost_experiment

#### Experiment: "Preflight Conflict and Formatting Fidelity Test"
To falsify the proposed guarded CLI mechanism without modifying any canonical public copy or git branch state:

1.  **Fixtures:** Create temporary mock target files (`tests/fixtures/mock-site.json` and `tests/fixtures/mock-work.md`) and a synthetic test work order.
2.  **Scenario A (Conflict Handling):** Mutate one value in `mock-site.json` so it diverges from `expectedCurrent`. Run the CLI with `--write`.
    *   *Falsification Criteria:* If the CLI updates any file prior to aborting, or if exit code is `0`, the transactional boundary is flawed.
3.  **Scenario B (Formatting Preservation):** Pass a valid match set to the CLI. Run a diff between the updated file and the baseline file using whitespace-sensitive comparison.
    *   *Falsification Criteria:* If unaffected fields lose quotes, change indent spacing (e.g., 2 spaces vs 4 spaces), or alter line endings (`\n` vs `\r\n`), targeted replacement failed formatting preservation.

**Cost:** ~1 hour of script/test drafting; 0 risk to baseline repository files.

---

### 5. contrarian_challenge

**Is a dedicated CLI and work order pipeline over-engineering for a 31-key update?**

Applying 31 copy keys manually via pull request takes less time than building and testing a CLI importer script. The argument for automation rests on future scalability, but if copy changes occur infrequently, the CLI itself becomes unmaintained technical debt that may break on future schema changes.

Furthermore, relying on **targeted string-token replacement** without full AST parsing is fragile. If string replacement searches for a text value without strict structural context, it risks false-positive collisions (replacing identical text in an unapproved field or comment). Conversely, if AST parsing is used, formatting churn is guaranteed unless complex layout-preserving formatters are integrated. 

**Alternative Minimal Approach:** Perform a manual, single-commit edit of the 31 keys directly in `data/site.json` and `content/works/*.md`, update the 4 test expectations, and rely entirely on `git diff` and standard CI test runs for review.

---

### 6. unconstrained_possibility

If constraints on tooling and external dependencies were removed, the ideal architecture would eliminate offline spreadsheet synchronization entirely:

*   **Git-Native CMS or Visual Review Environment:** Bind repository frontmatter and `site.json` directly to an inline visual editor (e.g., Decap/Tina CMS or custom Preview Webhooks).
*   **Automated visual regression pipelines:** On every editorial draft commit, GitHub Actions builds the preview site, captures full-page localized DOM snapshots, compares them against Figma design tokens, and flags clipping, line-clamp overflows, or spacing collisions directly on the PR before human approval.

---

### 7. overlooked_risks

1.  **YAML Scalar Escaping and Multiline Breakage:** Markdown frontmatter values containing double quotes, single quotes, colons, or line breaks in Chinese/English text can invalidate YAML parsing if inserted as raw string replacements without proper YAML escaping or quotes.
2.  **Partial File Write Scenarios:** If Node's `fs.writeFileSync` fails mid-sequence (e.g., file lock, permission error, disk issue) after writing 2 out of 7 files, the working tree is left in a corrupted intermediate state unless an explicit rollback mechanism or staged staging folder is used.
3.  **Downstream Assertion Pinning:** Four copy-contract tests are known to pin old values, but secondary build scripts, search indexing generators, or Figma export generators may also contain hardcoded regex/string matching that will silently break downstream processes upon text modification.

---

### 8. assumptions_to_verify

1.  **Target File Content Immutability:** Verify that no concurrent branch or uncommitted local work has altered `data/site.json` or `content/works/*.md` relative to baseline commit `2f56352cb3049ab8fb535c0ae3c1d0fa57cb599f`.
2.  **Exact Matching of `expectedCurrent`:** Confirm that every `expectedCurrent` entry in `preview.json` matches character-for-character (including whitespace and punctuation) with canonical file contents.
3.  **Encoding Consistency:** Ensure all source files and proposed strings are UTF-8 compliant without byte-order marks (BOM) that could disrupt Node `fs` parsing.

---

### 9. recommended_next_decision

**Decision:** Proceed with the **Guarded Node Importer CLI with Work Order Validation**, bounded strictly to the preflight-first, write-nothing-on-conflict pattern.

#### Immediate Action Sequence for Implementing Lane (Codex):
1.  **Build Phase 1 (Dry-Run Importer):** Implement `scripts/apply-copy-work-order.js` supporting `--dry-run` and `--write` flags, scoped exclusively to `site.*` and `featured.<slug>.*` key paths.
2.  **Validation Phase:** Construct `work-orders/P0-P1-bilingual-2026-08-09.json` containing all 31 entries, baseline hashes, and exact `expectedCurrent` values.
3.  **Execution Phase:** Run dry-run validation to verify zero mismatches across all 31 entries. Apply P0 first, run test suite, then apply P1, updating the 4 copy-contract tests in lockstep.