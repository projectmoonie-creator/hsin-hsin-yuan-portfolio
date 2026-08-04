# 流程減重修訂案（Process Diet）v2（依 Codex 稽核修文）

日期：2026-08-04｜起草：Claude｜稽核：Codex（`2026-08-04-process-diet-codex-audit.md`，
結論「修文後定版」）｜狀態：**待製作人定版**

## 背景（v2 已依稽核更正）

製作人委託對本專案工時做外部稽核。修正後的量化基礎：

- 流程文件 `docs/**/*.md` 於稽核基線為 11,809 行；產品碼（`src/`、`scripts/`、
  `tests/` 之 JS/MJS/CSS）6,764 行。
- 以提案前 `6692aee` 為終點，最近 100 commit 中 **48** 個只動 `docs/`／`*.md`。
- `docs/superpowers/plans/2026-08-03-archive-uniformity-and-english-copy.md` 為
  1,335 行，涵蓋文案/媒體/幾何/Figma/測試多項（非單一排序任務）——問題是
  計畫體積，不是任務單一性。
- 2026-07-19 外審輪：Claude 撞 monthly spend limit 未完成、無可用發現；Gemini
  六條中四條被現地證據駁回、一條低優先、一條待證。成本應記
  `apiEquivalentCostUsd`，且 status（5.675496）與 raw artifact（6.722925）不一致。
- 備份：local `main` 曾比 `origin/main` 超前 99 commit，HEAD 存在於 remote
  feature branch 但未以 main/backup 命名集中回讀；2026-08-04 已補 backup ref，
  實際曝險窗約五天。**「只在本機」的舊敘述不成立，已撤回。**

## 修訂條文（定版文字＝Codex 建議條文）

### R1 計畫與交付成比例 — 修文採納
> 一般工作包的 implementation plan 以 60 個 nonblank logical lines 為上限，
> 只含目標、affected files、非目標、驗證與回滾；壓不進 60 行就拆包，例外須由
> 製作人明文批准。不得以預估 diff 行數作 pass/fail。普通包結束後只在
> `docs/reviews/LOG.md` 追加至多 10 行（日期、branch/commit、驗證、外審使用或
> skip reason、未盡事項）。只有 phase closeout，以及涉及 production 部署、
> 隱私/權利/安全、破壞性遷移或需保存 frozen external-review evidence 的包，
> 才另建 dated report。

### R2 QA 分級 — 修文採納
> 會影響 runtime/public output 的包跑 `npm test`，並目視一個相關桌面寬與一個
> 相關行動寬；純文件/治理包跑 targeted validation 與 `git diff --check`，免瀏覽器。
> 若改動直接碰 bilingual、reduced-motion、no-JS、BFCache 或 media lifecycle，
> 同包加跑該 focused scenario。完整雙語×多視口×fallback 矩陣只在 phase closeout
> 與正式部署前跑。

### R3 外部審查抽查制 — **自本案撤下**
Codex 判定：只改 Bible 會靜默牴觸工作憲章四-19（三 AI 輪轉收斂制）。
本條撤出本案；是否於憲章層增設風險分級（四-19/四-23 同步修法，低風險
user-visible 包固定一位獨立覆核者、docs-only 才可免審記 skip reason），
**另案請製作人裁決**。

### R4 媒體帳目分級 — 修文採納
> 權利帳：第三方或權利敏感媒體記 canonical source、rights basis/status；若本地化
> 或重製，再記 SHA-256。使用者自有/提供素材只記 approved basename/source、
> rights basis 與 duration。技術完整性帳另論：凡 checked-in runtime asset 已由
> 測試以 size/hash/codec 保護者，保留該機械回歸；不得以權利帳減重為由移除。

### R5 規則退役制 — 修文採納
> 新增 Bible 規則時，同一 change 在 `docs/reviews/LOG.md` 記錄一條既有規則的
> `retire`／`downgrade`／`keep（附理由）` 裁決。被取代的 active instruction 直接
> 刪除或收斂，Git history 即為歷史；只有仍有查考價值且不屬 dated review 的材料
> 才移入 `docs/archive/`。不得搬動既有 dated review 來製造減量表象。

### R6 備份閘機械化 — 修文採納
> 每個 coherent commit 後、phase closeout 前再檢一次：先記
> `git status --short`；再跑 `git rev-list --count HEAD --not --remotes=origin`。
> 大於 0 才代表目前沒有已知 origin ref 可達的 commit，須以 non-force push 推到
> 唯一命名的 `backup/YYYY-MM-DD/<shortsha>`，再用 `git ls-remote` 回讀並逐字比對
> remote tip＝`HEAD`；不等即 `BLOCKED`。`git rev-list --count origin/main..HEAD`
> 另記為 main divergence，只管 merge/release 狀態，不得冒充備份計數。

### R7 上位法引用 — 採納（pointer-only）
Bible 加兩行指向工作憲章 三-9（減法任務禁止重寫）、三-10（子代理帶摘要
不帶全量對話史），不複製上位法全文。

### R8 掛上憲章＋備份與上線解綁 — 修文採納
`AGENTS.md` 加入（durable rule 住 AGENTS，不住可變的 STATUS）：
> Read `~/Documents/Claude/Projects/_SHARED/WORK-CHARTER.md` before the Bible and
> Status. Pushes to `origin/main`, merges, aliases, and Production deployments
> require explicit producer authorization. A non-force push of the current
> privacy-checked committed `HEAD` to a uniquely named `backup/*` ref is the
> charter-mandated durability action, not a deployment, and requires live remote
> tip readback.

`STATUS.md` 只記本次事實（backup ref 回讀結果；`origin/main`／Preview／
Production 未變），不另立永久規則副本。

## 定版程序（製作人拍板後執行）

1. 依 R1/R2/R4/R5/R6/R7/R8 修 `PROJECT_BIBLE.md` 與 `AGENTS.md`；
   **Bible 淨行數不得增加**。
2. 修後跑 `npm test`＋`git diff --check`；以 R6 新命令驗證 backup reachability
   並回讀 remote tip。
3. R3 另案：製作人裁決是否修憲章四-19/四-23。
