# Frozen Problem Frame — Authorization Friction Governance

Date: 2026-08-13

Purpose: independent architecture/governance consultation. This is not an
implementation request. The reviewer cannot edit the repository.

Please respond in Traditional Chinese. Be concise but explicit. Challenge the
diagnosis instead of merely agreeing with it.

## Decision To Make

One portfolio project accumulated many separate typed approval requests for
Git push, `main`, Preview, Shareable Link, Production, domain/alias, Contact,
and external-AI review. The project has now been corrected locally to use one
bounded authorization envelope per package. We must decide whether the lesson
should remain portfolio-specific, become a provisional warning/check for new
projects, or become a permanent cross-project rule now.

The desired outcome is lower producer interruption without weakening consent,
cost, privacy, security, external-recipient, or destructive-action boundaries.

## Confirmed Governance Baseline

The cross-project Work Charter currently says:

1. Stop for three decision classes: content/taste, irreversible actions, and
   external actions. Other execution and permission work should proceed and be
   reported afterward.
2. A cross-project rule is admitted only after validation in at least two
   projects.
3. Once a rule is canonical, duplicate copies should collapse to pointers.
4. New projects use a startup checklist: define the experience goal and grade,
   choose the workflow engine, scaffold records, define protected source files,
   establish an end-to-end steel thread, choose minimum gates, create a project
   skill, define memory placement, and write the first journal.

Only this portfolio currently provides direct incident evidence for the
authorization-friction failure. The generic risk is plausible but has not yet
been observed in a second project.

## Incident Timeline And Evidence

### 1. The original boundary was strengthened into a cadence

On 2026-08-04, a deployment-cadence proposal introduced this exact idea:

> every Production deployment still requires separate explicit producer
> authorization

It also required every actual Production deployment to open a separate package
with full QA/review and per-deployment authorization.

An independent Codex audit reinforced it:

> 每一筆 Production deployment 仍須各自取得明示授權

and described every Production deployment as another full-rotation,
per-operation authorization package. The final wording was adopted verbatim in
commit `829b428` after the audit. The producer approved the governance proposal,
but did not originate or explicitly request a typed confirmation for every
technical sub-step.

### 2. A proxy metric hid semantic complexity

The same process-diet proposal required the Project Bible's net line count not
to increase. The rule therefore became one very long line while still carrying
many conditions. Line count decreased, but decision complexity did not.

### 3. Tool coupling amplified the conservative interpretation

In this repository, any GitHub `origin` push can trigger a Vercel Preview.
Later corrections therefore added more distinctions and exclusions:

- backup pushes can create Preview deployments;
- routine static Preview became standing-authorized;
- Shareable Link creation/replacement became automatic;
- Git push, `main`, Production, domain/alias, and Contact remained separately
  excluded unless explicitly approved.

The safety intent was legitimate. The operational result was repeated approval
requests for adjacent steps in one user outcome.

### 4. Current state repeated history instead of only stating the live decision

Before correction, `STATUS.md` had 1,665 lines and at least 13 historical
statements using variants of separate approval/separate gating. Cold-started
agents repeatedly re-learned those exclusions even after later standing
authorizations existed.

### 5. Packages were defined around technical steps, not the user outcome

Packages such as Hero release and domain cutover were bounded locally, while
the actual product outcome was closer to:

> launch-ready portfolio with custom domain and a working Contact route

Domain, email forwarding, Contact activation, Git integration, Production, and
review therefore surfaced serially as new approval moments instead of being
forecast together in one outcome-level envelope.

### 6. The review question was safety-anchored

The review focused on whether a cadence rule conflicted with explicit
Production authorization. It did not simulate a normal end-to-end user journey,
count producer interruptions, distinguish risk boundary from approval cadence,
or ask whether the same consent could cover several foreseeable actions.

## Current Local Correction

Portfolio project commit `88b322c` now states:

- one bounded package has one authorization envelope;
- the envelope records goal, action classes, conditions, exclusions, and end;
- natural-language approval is sufficient; no prescribed phrase;
- covered review, Git, Preview, Production, domain, and Contact actions are not
  re-approved one by one;
- ask again only for scope expansion, a failed gate, or an unresolved material
  cost, recipient, secret destination, or destructive target;
- silence is never authorization and standing authorization is revocable.

Shared portfolio-skill commit `eb1c812` applies the same mechanism to future
portfolio projects. Neither commit has been pushed as part of this consultation.

## Candidate Cross-Project Responses

### Option A — Project/portfolio layer only

Keep the Work Charter unchanged. The repaired portfolio project and reusable
portfolio skill own the rule. Revisit only if a second project exhibits the
same failure.

### Option B — Provisional startup check, not a new permanent law

Add one small diagnostic question to the new-project startup template or its
reusable skill/checklist, marked provisional until a second project validates
it. Example concept:

> Before ratifying approval rules, simulate one normal end-to-end package and
> count producer interruptions. A risk boundary is not automatically an
> approval cadence; group foreseeable covered actions into one revocable
> envelope, and reopen only for material change or failed conditions.

The portfolio skill retains the implementation detail. After validation in a
second project, promote a concise universal principle and replace duplicates
with pointers.

### Option C — Permanent Charter rule now

Immediately add a universal authorization-envelope rule to the producer
sovereignty section and a matching startup item, despite having only one direct
project incident.

## Constraints

- Do not recommend silent or inferred authorization.
- Do not weaken mandatory product/tool confirmations, consent, purchases,
  private destinations, external recipients, secrets, destructive targets, or
  failed-gate stops.
- Do not require magic approval wording.
- Do not create another append-only status ledger.
- Avoid duplicating one full rule across Charter, AGENTS, Bible, skill, and
  STATUS; specify one canonical owner and pointer strategy.
- The Work Charter's current two-project admission criterion is binding unless
  you explicitly argue why this case justifies an exception.
- Prefer a mechanism that prevents recurrence over a generic warning banner.
- Rule count and line count are not acceptable sole complexity metrics.
- No canonical file edits occur until the producer chooses an option.
- Claude was intentionally not dispatched for this round due producer quota
  prioritization. Do not describe this as a dual-review consensus.

## Questions

1. Is the root cause best classified as portfolio-specific, a generic approval
   anti-pattern, or a mixture? Identify any missing causal link.
2. Rank Options A, B, and C. Which is the minimum sufficient response now?
3. Would a warning make the system clearer or noisier? If a warning is useful,
   turn it into an operational check with an owner, trigger, and retirement or
   promotion condition.
4. Where should it live now: Work Charter producer-sovereignty rules, Work
   Charter new-project startup template, work-charter skill, portfolio skill,
   project AGENTS/Bible, STATUS template, or review checklist? Separate the
   canonical source from pointers.
5. What review question or lightweight metric would have caught this before
   adoption? Include a producer-interruption measure that cannot be gamed by
   compressing prose into long lines.
6. What else, beyond this portfolio's current correction, should change?
7. Supply exact minimal wording, at most four short lines total, for the
   recommended provisional or permanent cross-project change.

## Required Response Schema

Use these headings exactly:

1. `problem_reframe`
2. `pragmatic_path`
3. `alternative_architecture`
4. `low_cost_experiment`
5. `contrarian_challenge`
6. `unconstrained_possibility`
7. `overlooked_risks`
8. `assumptions_to_verify`
9. `recommended_next_decision`
10. `option_ranking`
11. `canonical_placement_and_pointers`
12. `exact_minimal_wording`

Under `recommended_next_decision`, explicitly say `A`, `B`, or `C` and state
whether the recommendation is provisional or permanent.
