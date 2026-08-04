# 流程減重修訂案（Process Diet）Codex 稽核

日期：2026-08-04

稽核標的：`docs/reviews/2026-08-04-process-diet-proposal.md` at
`cfda41b43b6c445911f371b07c08a0fcfb1d6df3`

角色：Codex 唯讀覆核；未修改 `PROJECT_BIBLE.md`、`AGENTS.md`、`STATUS.md`

## 結論先行

方向成立，但背景有數個事實口徑錯誤，R3 與上位憲章衝突，R6 又把「未進
`origin/main`」誤當「沒有任何遠端副本」。本案應先依下列文字修正，再交製作人
定版。單一結論：**修文後定版**。

## 基線與機械證據

- 派工單指定命令實跑：`git rev-list --count origin/main..HEAD` → **`102`**。
- `git rev-list --left-right --count origin/main...HEAD` → **`0  102`**。
- `git rev-list --count HEAD --not --remotes=origin` → **`0`**。
- live remote readback：`origin/backup/main-2026-08-04`＝目前 `HEAD`
  `cfda41b...`；提案前 head `6692aee...` 也精確存在於
  `origin/codex/top-gear-featured-preview-reel`。
- `origin/main`＝`68d6116...`（2026-07-29 18:54 +08）；提案前 head
  `6692aee...`＝2026-08-03 23:15 +08。這段是約五天，不是五週。
- `npm test`：**61/61 PASS**。其中 `tests/media-assets.test.mjs:33-93`
  目前機械檢查四支公開 derivative 的 exact size、SHA-256、faststart、duration
  與編碼屬性。
- 工作樹原有一個使用者持有的未追蹤檔
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md`；本稽核未碰。

## 背景量化主張裁決

1. **6,764 行產品程式碼：成立。** `src/`、`scripts/`、`tests/` 內目前的
   JS/MJS/CSS 合計可重現為 6,764。
2. **11,832 行流程文件／1.75:1：缺口。** 提案未列 inclusion/exclusion 或命令；
   在 audited `HEAD`、尚未建立本稽核檔時，`docs/**/*.md`（含提案）是 11,809 行；
   另有 root governance、content、
   source-materials 與 showreel 文件。補上固定檔案集合與命令前，不應保留精確比率。
3. **最近 100 commit 有 64 個只動文件：不成立於通常口徑。** 以提案前
   `6692aee` 為終點、把「只動文件」定為所有 changed paths 皆在 `docs/` 或為
   `*.md`，結果是 **48/100**；含本案三 commit 的目前值是 **51/100**。
   若 64 使用另一分類，必須把分類器與輸出附上。
4. **1,335 行計畫：成立；「只為調整卡片順序」不成立。** 該檔確為 1,335 行，
   但 `docs/superpowers/plans/2026-08-03-archive-uniformity-and-english-copy.md:5-9`
   同時涵蓋多項文案、媒體、Archive 幾何、Figma、測試與 Preview，不是單一排序。
5. **26 份逐包報告共 3,305 行：差一至兩行。** 排除本提案與正式 phase closeout
   後確為 26 檔；目前是 **3,304 logical lines／3,303 newline-count lines**。
   定版請選定一種計數法並附命令。
6. **「雙 AI 一輪約 USD 5.7、淨收穫一條」：需改名與更正 provenance。**
   `b92ac6e:docs/reviews/2026-07-19-cinematic-portfolio-external-review-status.md:13-20`
   記載 Claude 最後撞 monthly spend limit，`completed model: none`、無 usable
   findings；這不是完成的雙審。Gemini 六條中四條被現地證據駁回／判 already-fixed，
   一條是低優先診斷改善，一條待編輯證據。`USD 5.7` 依 review contract 應稱
   `apiEquivalentCostUsd`，且 status 的 `5.675496` 與 raw artifact 的
   `total_cost_usd: 6.722925` 不一致，不能挑一個當實際花費。
7. **「99 commit 無遠端副本／連續五週」：駁回。** 提案前
   `git rev-list --count origin/main..6692aee` 確為 99，但同一 `6692aee` 已在 live
   remote feature branch；它量到的是 main divergence，不是 off-device durability。
   可改寫為：「local `main` 曾比 `origin/main` 超前 99，但未以 main/backup
   命名集中回讀；2026-08-04 新增 backup ref。」不得再稱 99 個 commit 只在本機。

## R1–R8 逐條裁決

### R1 — 修文

採納「短計畫＋普通包改記 LOG」方向；駁回「計畫行數不得超過預估 diff 行數」。
後者在施工前不可量測，且 binary/generated media 沒有可比的 line diff，會誘發錯誤
最佳化。

建議條文：

> 一般工作包的 implementation plan 以 60 個 nonblank logical lines 為上限，
> 只含目標、affected files、非目標、驗證與回滾；壓不進 60 行就拆包，例外須由
> 製作人明文批准。不得以預估 diff 行數作 pass/fail。普通包結束後只在
> `docs/reviews/LOG.md` 追加至多 10 行（日期、branch/commit、驗證、外審使用或
> skip reason、未盡事項）。只有 phase closeout，以及涉及 production 部署、
> 隱私/權利/安全、破壞性遷移或需保存 frozen external-review evidence 的包，
> 才另建 dated report。

### R2 — 修文

「每包」會讓純文件包也跑瀏覽器；「全矩陣只在收尾」又會讓改到 reduced-motion、
no-JS、BFCache 的包太晚驗證。現有 61 tests 已含 BFCache 與媒體生命週期回歸，不能
因減重刪掉。

建議條文：

> 會影響 runtime/public output 的包跑 `npm test`，並目視一個相關桌面寬與一個
> 相關行動寬；純文件/治理包跑 targeted validation 與 `git diff --check`，免瀏覽器。
> 若改動直接碰 bilingual、reduced-motion、no-JS、BFCache 或 media lifecycle，
> 同包加跑該 focused scenario。完整雙語×多視口×fallback 矩陣只在 phase closeout
> 與正式部署前跑。

### R3 — 駁回（以本案目前範圍）

`WORK-CHARTER.md` 四-19 明定任何工作包一主導、另外兩者收斂審查；四-23 只替明確
標示的工作草稿 lane 放寬為單審＋抽查。只改 `PROJECT_BIBLE.md` 不能把一般正式
文案/版面包改成免審或單審。若製作人要採此風險分級，須同一修法包明文修正上位法
四-19/四-23；在那之前，本條無效。上位法若同步放寬，建議把低風險 user-visible 包
固定為「一位獨立覆核者」，只有 docs-only 且不影響 current rules/public output
才可免外審並記 skip reason，避免「免外審或單審」由實作者任選。

### R4 — 修文

權利帳與 artifact integrity 是兩件事。提案若照字面刪掉自有素材的 SHA/bytes，會與
`tests/media-assets.test.mjs:33-93` 的公開檔完整性回歸衝突。

建議條文：

> 權利帳：第三方或權利敏感媒體記 canonical source、rights basis/status；若本地化
> 或重製，再記 SHA-256。使用者自有/提供素材只記 approved basename/source、
> rights basis 與 duration。技術完整性帳另論：凡 checked-in runtime asset 已由
> 測試以 size/hash/codec 保護者，保留該機械回歸；不得以權利帳減重為由移除。

### R5 — 修文

採納規則退役檢視；但把舊檔搬到 `docs/archive/` 只換位置、不減行數，還可能破壞
歷史引用，並與 `PROJECT_BIBLE.md:156`「不重寫 historical closeout reports」的精神
衝突。

建議條文：

> 新增 Bible 規則時，同一 change 在 `docs/reviews/LOG.md` 記錄一條既有規則的
> `retire`／`downgrade`／`keep（附理由）` 裁決。被取代的 active instruction 直接
> 刪除或收斂，Git history 即為歷史；只有仍有查考價值且不屬 dated review 的材料
> 才移入 `docs/archive/`。不得搬動既有 dated review 來製造減量表象。

### R6 — 修文

方向採納，但現有 command 量錯命題，且「收尾才推」晚於憲章四-21 的「每個 coherent
commit 就備份」。

建議條文：

> 每個 coherent commit 後、phase closeout 前再檢一次：先記
> `git status --short`；再跑 `git rev-list --count HEAD --not --remotes=origin`。
> 大於 0 才代表目前沒有已知 origin ref 可達的 commit，須以 non-force push 推到
> 唯一命名的 `backup/YYYY-MM-DD/<shortsha>`，再用 `git ls-remote` 回讀並逐字比對
> remote tip＝`HEAD`；不等即 `BLOCKED`。`git rev-list --count origin/main..HEAD`
> 另記為 main divergence，只管 merge/release 狀態，不得冒充備份計數。

### R7 — 採納

Bible 只加兩行指向 `WORK-CHARTER.md` 三-9、三-10 即可；不要複製上位法全文。

### R8 — 修文

掛上憲章讀取鏈正確；備份與上線解綁也符合憲章四-21。但 durable rule 不應只寫在
可變的 `STATUS.md`，且 `backup/*` 例外必須限縮為 non-force、current committed
work、無 merge/deploy side effect。

建議 `AGENTS.md` 文字：

> Read `~/Documents/Claude/Projects/_SHARED/WORK-CHARTER.md` before the Bible and
> Status. Pushes to `origin/main`, merges, aliases, and Production deployments
> require explicit producer authorization. A non-force push of the current
> privacy-checked committed `HEAD` to a uniquely named `backup/*` ref is the
> charter-mandated durability action, not a deployment, and requires live remote
> tip readback.

`STATUS.md` 只記本次事實：backup ref 已回讀到 `cfda41b...`；`origin/main`、merge、
Preview/Production 均未變，仍需另行授權。不要在 STATUS 另立永久規則副本。

## 定版前最小修正清單

1. 改正背景七項量化／provenance 敘述，附可重跑命令或拿掉精確數字。
2. 依上文修 R1、R2、R4、R5、R6、R8；R7 保持 pointer-only。
3. R3 要嘛同步修上位憲章，要嘛自本案撤下；不可讓下位法靜默抵觸上位法。
4. 實際修法仍須符合 `PROJECT_BIBLE.md` 淨行數不增加；修後跑 `npm test`、
   `git diff --check`，並以新 R6 驗證 backup reachability。

## 稽核 provenance

- Provider/lane：Codex current root runtime。
- Requested model：使用者未 exact-pin；依當前 runtime。
- Observed/completed exact model ID：介面未暴露，不臆造。
- External Claude/Gemini calls：本輪未發送；本報告由現地 source、Git、live remote
  readback 與 tests 裁決。
