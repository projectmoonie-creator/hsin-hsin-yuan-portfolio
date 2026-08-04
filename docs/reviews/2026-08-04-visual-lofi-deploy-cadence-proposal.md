# 修訂案 v2：視覺低保真先行＋部署節奏＋動到即抽取（依 Codex 單審修文）

狀態：**待製作人定版**｜稽核：`2026-08-04-visual-lofi-deploy-cadence-codex-audit.md`
（結論「修文後定版」；該報告同時構成本包降級為低風險單審的獨立覆核者
concurrence——**不得稱雙審或全輪轉共識**）

## 定版條文（＝Codex 建議文字逐字採用）

### A. Visual Direction 節尾新增
> - New visual-direction experiments (new layout, motion, effect, or style; not defect repair, responsive parity, or implementation of an approved contract) run lo-fi first: record a text/wireframe or plain structural mock, the baseline commit, and owned paths; obtain producer approval for the proposal, then timebox detailed implementation to 90 minutes of active work. At expiry, stop; without final producer acceptance, keep the result isolated or restore only the owned paths to the recorded baseline, never unrelated work. Log scope, baseline, active minutes, producer decision, and disposition in `docs/reviews/LOG.md`; waiting time does not consume the box and momentum does not extend it.

### B. Contact And Deployment 節尾新增
> - Deployment cadence: when a changed `main` HEAD is releasable under the applicable QA and review gates, surface a Production decision to the producer within seven calendar days; every Production deployment still requires separate explicit producer authorization, and a missed target or silence is never authorization. Unfinished or unapproved work stays off the release candidate (an existing tested default-off flag may be used); a `backup/*` push is not a deploy. After 14 days without a recorded decision, raise a closeout open item to the producer; calendar age alone is not `BLOCKED`.

### C. Roadmap Discipline 節尾新增
> - Extract on touch applies only to an explicitly named feature whose implementation is entangled with unrelated behavior in a shared generator or stylesheet: within the same package, make one smallest-applicable, behavior-preserving extraction in a separate commit, with relevant tests green at baseline and after extraction, then apply the requested change and test again. Use data, template/module, style, and focused-test boundaries only as the feature needs; do not extract untouched features. A subtractive or fix-only task remains a diff against the existing base, and any extraction that materially expands its scope requires explicit producer approval for that package under Work Charter §3-9.

## 行數抵銷（預期定版 164 行，淨 −1）

1. design-reference 兩條併一（補回 `which parts serve the portfolio goal`，
   採稽核給定合併句）：
> - Before implementing a design reference, translate it into project-specific rules — what to borrow, what to avoid, which parts serve the portfolio goal, and how it behaves on desktop and mobile; never copy a reference site's surface style literally when the user's content needs another rhythm. Use references to derive typography, spacing, motion, image, logo, and section-order decisions.
2. Bilingual Voice「For English portfolio-grouping titles…」繞排收單行
   （字元內容不變）。
3. press metadata 兩條併一（補回 `source`，採稽核給定合併句）：
> - When adding press, record enough metadata to audit later: every public press entry must include `source`, `canonicalUrl`, `titleSource`, `imageSource`, and `metadataCheckedAt`. Do not add a press card without those audit fields.

## R5 退役裁決（入 LOG）

- **retire/merge ×2**：design-reference 兩條→一條；press metadata 兩條→一條
  （均保語義，補漏欄位後合併）。
- **keep（附理由）**：「Until a custom domain is confirmed…」與 cadence 不衝突。

## 立案事實（v2 依稽核修正口徑）

- 視覺決策曾靠建了再拆收斂：光效系列 Git 可見跨度 2026-07-11 17:33 至
  07-29 18:54（約 18 天），刪除 commit 為 15 insertions／729 deletions；
  「4.5 小時建成」「規則 6 分鐘反轉」為外部評估轉述，未附可重跑計時證據。
- Production 實況（稽核日 live readback）：最新 Production＝`68d6116`
  （07-29，Remove portfolio light effects），約六天前；另有 5 分鐘至 5 天
  內多筆 Preview。**「五週未部署」不成立**；成立的說法是「Production 約
  六天未更新，local `main` 已累積後續變更」。此前 `origin/main` 曾自
  07-12 停在 `5cdb842` 至 07-29——中段約 17 天無 Production 更新。
- 結構現況：`scripts/build-site.mjs` 為 **769 行**，已有 renderPress／
  renderWork／renderArchive／renderPage 等函式邊界——診斷降級為
  「**尚未拆成檔案級模組**」。共享檔修改頻繁（固定最後 158 commit：
  build-site 57／styles 48／tests 72；全 175 commit 含 root：67／59／83）；
  三檔同 commit 出現為 41/158——「任何改動都落同三檔」全稱句撤回。

## 定版程序（製作人拍板後執行）

1. 依上文改 `PROJECT_BIBLE.md`（A/B/C＋三處合併）；Bible 目標 164 行。
2. docs/governance gate：目標文字搜尋、Bible 行數、`git diff --check`
   （純治理包，無需 browser）；LOG 記兩項 R5＋驗證＋單審降級 concurrence。
3. 任何實際 Production deployment 另開包，走完整 QA／review 與逐次授權。
