### 1. problem_reframe

The core engineering challenge of A1 is not derivative generation—A0 already established media probing and planning. The real challenge is achieving **transactional safety and AST/byte-level preservation** inside a non-database, file-based Git repository using only standard Node.js ESM built-ins.

Specifically, A1 must solve three distinct problems:
1. **Approval Verification**: Proving that the exact proposed media plan matches current media inputs, current repository state, and explicit CLI intent without relying on external state stores or interactive inputs.
2. **Deterministic Frontmatter Mutation**: Updating Markdown JSON frontmatter without reformatting, reordering, or re-indenting human-authored fields or altering the body content below the metadata block.
3. **Atomic Multi-Target Mutation**: Guaranteeing that public derivative creation, `media-manifest.json` ledger append, and Archive Markdown metadata insertion either all succeed or leave zero residual trace, even under mid-execution failure or abrupt process termination.

---

### 2. pragmatic_path

#### Architecture: Direct In-Memory Preflight with Shadow Temp-Staging & Atomic Rollback
- **Approval Contract**:
  - Command pattern: `npm run media:apply -- --plan=<path-to-approved-plan.json> --confirm-slug=<slug> --reel=<reel-path> --poster=<poster-path>`
  - Recomputes the plan in-memory using `media-package-plan.mjs` against the provided inputs and compares the resulting plan payload (via deep-equality check on all non-timestamp/path-redacted fields) against the approved plan file.
  - Fails immediately if the recomputed plan differs from the provided plan file or if `--confirm-slug` does not match `plan.slug`.
- **Frontmatter Patching**:
  - Reads the target Markdown content file as an exact UTF-8 string.
  - Locates frontmatter boundaries (e.g., between opening `---` / `---json` and closing `---`).
  - Uses a localized JSON boundary scanner to parse only the JSON object, inject the approved `media` block key/value pair into a deterministic position (e.g., preceding the closing brace or matching existing key depth), and stringify *only* the new sub-tree rather than round-tripping the entire frontmatter through `JSON.parse` / `JSON.stringify`.
- **Atomic File Mutation Strategy**:
  1. **Preflight Phase**: Validate all source inputs, ensure manifest IDs and derivative output paths do not exist in `media-manifest.json` or on disk. Verify write access to target directories.
  2. **Stage Phase**: Write public derivative files to temporary filenames in the destination folder (`/assets/.../<file>.tmp-<uuid>`).
  3. **Commit Phase**:
     - Synchronously append new entries to `media-manifest.json` via a write-to-temp-and-rename operation.
     - Synchronously overwrite the target Archive `.md` file with the patched frontmatter.
     - Rename derivative temp files to final target filenames.
  4. **Rollback Trigger**: Any exception during Stage or Commit triggers an immediate cleanup handler that unlinks created temp files, restores original manifest bytes from a pre-flight backup buffer, and restores original `.md` bytes.

#### Tradeoffs
- **Pros**: Fast, zero new external dependencies, single CLI invocation, minimal overhead.
- **Cons**: Rolling back after partial write to disk relies on process staying alive through the `catch` block; `SIGKILL` or power loss during the commit phase could leave orphaned `.tmp` files (though canonical outputs remain untainted).

---

### 3. alternative_architecture

#### Path A: Staged Transaction Directory (Two-Stage Apply)
- **Concept**: Split apply into a isolated stage phase (`media:stage`) and commit phase (`media:commit`).
- **Mechanism**:
  - `media:stage` writes all derivative files, the updated manifest, and the updated markdown file into a untracked scratch directory `.a1-transaction/<slug>/`.
  - Generates a `receipt.json` inside the transaction folder with checksums of all prepared files.
  - `media:commit` takes `.a1-transaction/<slug>/`, re-verifies checksums, and performs simple atomic OS renames into `/assets/`, `data/`, and `content/`.
- **Tradeoffs**:
  - **Pros**: Leaves zero temp files in production assets folder; direct inspection of output files before final commit.
  - **Cons**: Adds two-command complexity; risk of stale transaction directories if human abandons execution.

#### Path B: Git Patch Artifact Generation (`media:diff-patch`)
- **Concept**: Treat apply as a dry-run code generator that emits a raw Unified Diff (`.patch`) file and places binary derivatives in a designated staging area.
- **Mechanism**:
  - A1 generates `.assets-staging/` outputs and outputs `patch-media-<slug>.patch`.
  - The developer applies the patch using standard git tooling (`git apply`).
- **Tradeoffs**:
  - **Pros**: Leverages standard Git review workflow; 100% transparent visual diffing of frontmatter changes.
  - **Cons**: Blurs the line between automated apply and manual developer intervention; requires multi-step workflow.

---

### 4. low_cost_experiment

#### Experiment: Frontmatter Formatting Preservation & Partial-Write Recovery Test
- **Objective**: Falsify whether string-level/targeted frontmatter injection preserves original human formatting while surviving sudden disk write failures.
- **Method**:
  1. Take the existing Three-Minute Archive Markdown file (`content/archive/three-minute.md`).
  2. Implement a 30-line micro-script `scripts/test-patch-frontmatter.mjs` using Node.js string searching / regex slicing to insert a mock `media` patch object into the frontmatter string without invoking `JSON.stringify` on the top-level object.
  3. Run `git diff` against the file to verify that zero whitespace, indentation, key ordering, or body Markdown lines changed outside the inserted `media` block.
  4. Mock a failure mid-write (using an intentional `throw` after derivative creation) and verify that the test runner's cleanup hook cleans 100% of temporary files and restores identical bytes to `media-manifest.json`.
- **Falsification Criteria**:
  - If `git diff` shows reordered keys, lost trailing newlines, or converted tabs/spaces in unedited frontmatter keys, the targeted string injection approach is invalid and requires AST/CST parsing.
  - If temp files remain after an uncaught error in a child process, the direct in-memory rollback mechanism is insufficient and requires transaction directories.

---

### 5. contrarian_challenge

#### "Why allow A1 to modify the Markdown content file at all?"
- **Argument**: Content files (`.md`) are human-authored editorial assets. Automating writes to Markdown files introduces edge cases around character encodings, line endings (`CRLF` vs `LF`), and frontmatter syntax corruption.
- **Alternative**: Keep Markdown files 100% immutable during `media:apply`. Instead, require the Archive page renderer to dynamically join content records with `data/media-manifest.json` at build time based on `slug` or `media_id`.
- **Impact**: Eliminates frontmatter patching entirely. A1 only writes binary derivatives and appends to `data/media-manifest.json`. Frontmatter formatting preservation becomes a non-issue.

---

### 6. unconstrained_possibility

#### In-Memory Git Object Database Injection
Instead of touching working directory files via standard filesystem APIs, A1 uses Node.js `child_process` (or raw zlib inflation) to create Git blob and tree objects directly in `.git/objects/`. It then computes a staged Git tree and presents a ready-to-commit SHA to the developer.

This guarantees absolute atomicity: no target files in `/assets/` or `content/` are ever modified on disk until the developer explicitly merges or checks out the computed tree, completely bypassing OS filesystem write/rollback hazards.

---

### 7. overlooked_risks

1. **Cross-Device OS Rename Errors (`EXDEV`)**: Using `fs.rename` across different physical mounts or Docker volume boundaries throws `EXDEV: cross-device link not permitted`. Staging in temp directories must reside within the exact same parent directory as the target file.
2. **Line Ending Mismatches (`CRLF` vs `LF`)**: Git checkout on Windows may convert `LF` to `CRLF`. String offset matching for frontmatter insertion that hardcodes byte offsets or `\n` regexes can corrupt files on Windows hosts.
3. **Partial Direct Writes on Process Interrupt (`SIGINT`)**: If a user hits `Ctrl+C` exactly while writing to `media-manifest.json`, standard `fs.writeFileSync` will produce a truncated, corrupted JSON file. All writes must go to target-adjacent `.tmp` files before synchronous rename.
4. **Stale Hash Invalidation**: If source media is re-encoded on disk between the plan phase and apply phase without updating file size or modification timestamps, an un-hashed re-probe might pass while generating conflicting derivative output.

---

### 8. assumptions_to_verify

1. **Frontmatter Format Consistency**: Is every Archive `.md` file strictly formatted with `---json` ... `---` or standard `---` boundaries?
   - *Verification*: Scan all `.md` files in `content/` with a script to assert frontmatter structure uniformity.
2. **Re-probe Determinism**: Does calling `media-package-plan.mjs` on identical media inputs yield byte-identical hashes and dimension outputs across OS environments?
   - *Verification*: Run plan probing on macOS and Linux (or CI) against the same fixture files and compare raw JSON outputs.
3. **No-op Behavior Safety**: Does running `media:apply` twice in succession exit cleanly with code `0` and print a "Verified No-Op" status without attempting disk re-writes?
   - *Verification*: Verify during test suite execution by calling apply back-to-back.

---

### 9. recommended_next_decision

**Adopt Pragmatic Path (In-Memory Preflight + Target-Adjacent Temp Staging + Targeted String Boundary Patching)**, validated by the low-cost experiment.

**Action Item**: Execute the **low-cost experiment** (Section 4) immediately to prove or falsify frontmatter string-injection formatting preservation before writing any production CLI or apply library code.