# 視覺低保真先行＋部署節奏＋動到即抽取 Codex 單審

日期：2026-08-04

稽核標的：`docs/reviews/2026-08-04-visual-lofi-deploy-cadence-proposal.md`
at `479253f87b5c1c7ef1830e564085c6e8bd94f249`

標的 SHA-256：
`978b15003a03028b72f3ab7908467ec5054e034b57bd223f901d9b0a96d6a14c`

角色：Codex 唯讀單審。未修改 `PROJECT_BIBLE.md`、`AGENTS.md`、
`STATUS.md` 或產品程式碼；未呼叫 Claude／Gemini，未執行 push、merge、
Preview 或 Production deployment。

## 結論先行

三個方向都值得保留，但現稿不能直接入典：A 的「先核准再寫」與「時間到仍未
核准便回復」互相打架；B 把日曆逾期直接升為 blocker，超出 Work Charter
§4-23 的阻斷權範圍；C 又把每次 touch 都強制變成 re-architecture，與
Work Charter §3-9 對減法／修正包的範圍閘衝突。`deployable`、計時起點、
feature flag 與 extraction boundary 也都不可機械判定；立案事實中的「網站
五週未部署」及「單一約 2,000 行產生器」均被本機／平台 readback 駁回。

單一結論：**修文後定版**。採用下方替代文字並修正事實口徑後，本覆核者同意
把這個「只改治理文字、不執行部署」的包降為低風險單審；若保留現稿對
Production 行為的直接強制與 closeout blocker，則應回到全輪轉審查。

## 基線與機械證據

- 工作樹基線：`main` at `479253f...`；既有未追蹤檔
  `docs/reviews/screening-strip-media-contract-v1-2026-07-29 2.md` 未碰。
- `npm test`：**61/61 PASS**。
- tracked diff 的 `git diff --check`：PASS；本報告另以
  `git diff --no-index --check /dev/null <audit>` 檢查，無 whitespace diagnostics
  （exit 1 僅因新檔相對 `/dev/null` 有內容）。
- `npx --yes vercel@latest ls hsin-hsin-yuan-portfolio --yes
  --environment production --limit 1`：最新一筆為 **Ready / Production / 6d**，
  對應 `68d61167...`（`Remove portfolio light effects`，平台
  `createdAt=1785322494670`；Git commit time 2026-07-29 18:54 +08）。
- 同一專案的一般 deployment 清單在稽核時另有 5 分鐘至 5 天內的多筆
  **Preview**。因此「五週未部署」無論作泛稱或 Production 口徑都不成立；
  可成立的說法是「Production 約六天未更新，且 local `main` 已累積後續變更」。
- 光效系列的 Git 可見跨度為 2026-07-11 17:33 +08 至 2026-07-29
  18:54 +08，約 18 天；刪除 commit 確為 **15 insertions / 729 deletions**。
  「4.5 小時」與「規則 6 分鐘內反轉」沒有在派工單或 repo 中附可重跑計時
  證據，只能標為外部評估轉述，不能列作已驗證精確量值。
- `scripts/build-site.mjs` 現為 **769 行**，不是約 2,000 行；它已有
  `renderPress`、`renderWork`、`renderArchive`、`renderPage` 等函式邊界，故
  「無元件邊界」只能降級為「尚未拆成檔案級模組」。固定目前最後 158 個 commit
  再逐一數 changed paths，三檔依序是 **57／48／72**；全 175 commit 若把 root
  加檔也算一次則是 **67／59／83**，不算 root 則是 **66／58／82**。提案的
  `67／59／82 within 158 commits` 混用了範圍／root 口徑；三個指定檔同 commit
  出現也只有 **41/158**。原句「任何改動都落同三檔」不成立。

## 逐條裁決

### A — 方向同意，機制需改寫

1. **upgrade：時間盒對象矛盾。** 現文先要求 producer approval，之後才進入
   detail pass，卻又說 1.5 小時到期「without approval」便回復。必須區分
   「低保真提案核准」與「成品接受」，並把 90 分鐘明定為 detail implementation
   的 active work，不含等製作人回覆的時間。
2. **upgrade：範圍與起算不可檢。** `visual experiment` 目前會把缺陷修復、
   responsive parity、已核准 design contract 的照表施工也捲入。需限定為新 layout、
   motion、effect 或 style 方向，並在開始時記錄 baseline commit、owned paths 與
   active-work 起迄；否則 1.5 小時只能憑印象申報。
3. **reject：不得把模糊的 `revert` 變成 repo-wide 回復。** 工作樹可能含別人的
   dirty path；不得用 reset 或整包 revert 傷及非實驗變更。未接受的結果應留在
   隔離分支／commit，或只還原事前登記的 owned paths。
4. **agree：LOG 留痕可行。** 一次實驗用一行記 scope、baseline、active minutes、
   producer decision 與 disposition，可留在既有普通包 10 行上限內。

建議 A 入典文字（一個 Bible bullet）：

> - New visual-direction experiments (new layout, motion, effect, or style; not defect repair, responsive parity, or implementation of an approved contract) run lo-fi first: record a text/wireframe or plain structural mock, the baseline commit, and owned paths; obtain producer approval for the proposal, then timebox detailed implementation to 90 minutes of active work. At expiry, stop; without final producer acceptance, keep the result isolated or restore only the owned paths to the recorded baseline, never unrelated work. Log scope, baseline, active minutes, producer decision, and disposition in `docs/reviews/LOG.md`; waiting time does not consume the box and momentum does not extend it.

### B — 授權方向不衝突，節奏與 blocker 必須改寫

1. **agree：不是自動部署授權。** `producer-authorized Production deploy` 與
   `AGENTS.md:9-13` 的明示授權原則方向相容。但 weekly target 不能成為持續授權；
   每一筆 Production deployment 仍須各自取得明示授權，沉默或逾期不算授權。
2. **reject：日曆逾期不是 blocker。** Work Charter §4-23 只允許資料遺失、
   安全／隱私、崩潰／壞軌、記錄與事實矛盾升為 blocker。單純 14 天未部署不在
   清單內；`PROJECT_BIBLE.md:152` 的 deployment blocker 應解讀為真實部署故障，
   不是 cadence KPI。應改為 closeout open item／producer escalation。
3. **upgrade：`once main is deployable` 不可判定。** 至少要綁定「有 changed
   release candidate、適用 QA 與 review gates 已過、無既知 blocker」；沒有新
   releasable change 時，不應為達週指標重部署同一份內容。
4. **upgrade：feature flag 不是免驗捷徑。** Repo 目前沒有一套由本案證明的 flag
   contract。未完成／未核准功能預設留在 branch；只有既存、tested、default-off
   的 flag 才可進 release candidate，不能為追 cadence 臨時增加旗標基礎設施。
5. **agree：`backup/*` 不是 deploy。** 此句與 `AGENTS.md:10-13`、
   `PROJECT_BIBLE.md:156` 完全一致，保留。

建議 B 入典文字（一個 Bible bullet）：

> - Deployment cadence: when a changed `main` HEAD is releasable under the applicable QA and review gates, surface a Production decision to the producer within seven calendar days; every Production deployment still requires separate explicit producer authorization, and a missed target or silence is never authorization. Unfinished or unapproved work stays off the release candidate (an existing tested default-off flag may be used); a `backup/*` push is not a deploy. After 14 days without a recorded decision, raise a closeout open item to the producer; calendar age alone is not `BLOCKED`.

### C — 漸進抽取同意，無條件 first-extract 駁回

1. **agree：拒絕 big-bang 與預先抽取。** `one feature per extraction`、未 touch
   不抽取，符合小步演進，也沒有自行授權全站重構。
2. **reject：同包結構搬移仍是 re-architecture。** Work Charter §3-9 不只禁止
   「重寫」；它明定刪／修／精簡要對現有基底出 diff，改走重新架構是範圍變更，
   須先取得製作人對該包的明示同意。測試前後綠、搬移而非改寫，都不能消除這個
   scope change。現文的 `when a package modifies ... first extract` 會讓一行 CSS
   修正或純刪除也自動擴包，故與上位規則衝突。
3. **upgrade：`data field + template/module block + focused test` 不是每種 feature
   都適用。** 純 CSS 表現不一定需要 data field；資料正規化也不一定需要新 template；
   為湊三件套創造空欄位／空 module 會增加假邊界。應改成 smallest applicable
   boundary，並先證明現況確實和 unrelated concern 糾纏。
4. **upgrade：需要三個綠燈，不是模糊的 before/after。** 機械證據應為 baseline
   綠 → behavior-preserving extraction 後綠且 public output 不變 → requested change
   後綠；抽取最好獨立 commit，才可檢查 parity 與單獨 rollback。
5. **reject：立案量化需改。** 可保留「共享 generator／stylesheet 修改頻繁」的
   診斷，但須附固定 commit 範圍與 root 計數法；若保留「最後 158 commit」，
   應使用本審可重現的 769 行、57／48／72，並移除「任何改動都落同三檔」的
   全稱句。

建議 C 入典文字（一個 Bible bullet）：

> - Extract on touch applies only to an explicitly named feature whose implementation is entangled with unrelated behavior in a shared generator or stylesheet: within the same package, make one smallest-applicable, behavior-preserving extraction in a separate commit, with relevant tests green at baseline and after extraction, then apply the requested change and test again. Use data, template/module, style, and focused-test boundaries only as the feature needs; do not extract untouched features. A subtractive or fix-only task remains a diff against the existing base, and any extraction that materially expands its scope requires explicit producer approval for that package under Work Charter §3-9.

## 審查分級裁決

- **upgrade（現稿）**：本案直接新增 Production cadence 與 blocker，依
  `PROJECT_BIBLE.md:143`／Work Charter §4-23 預設屬「動到 production 部署」；
  提案自行標示「低風險」不構成降級證據。
- **conditional agree（修文後）**：若逐字採用或等義採用上方 B，使義務限於
  「定期把部署決策浮上檯面」，同一包不執行 deployment、alias、merge 或 push，
  本 Codex 單審同意降為低風險治理包。這份報告可作獨立覆核者的降級 concurrence；
  任何實際 Production deployment 仍是另一個全輪轉、逐次授權的工作包。

## 行數抵銷與 R5

- 現行 Bible 為 165 行。design-reference 兩條併一為 −1、Bilingual Voice 三行
  重排一行為 −2、press metadata 兩條併一為 −1、A/B/C 各一行為 +3，預期
  定版為 164 行，**淨 −1，成立**。
- **upgrade**：提案的合併句漏掉原條文的 `which parts serve the portfolio goal`；
  不能把語義刪除偽裝成純合併。建議合併句補回：

> - Before implementing a design reference, translate it into project-specific rules — what to borrow, what to avoid, which parts serve the portfolio goal, and how it behaves on desktop and mobile; never copy a reference site's surface style literally when the user's content needs another rhythm. Use references to derive typography, spacing, motion, image, logo, and section-order decisions.

- **agree**：Bilingual Voice 只改物理繞行、不改字元內容，可以作抵銷。
- **upgrade**：press 兩條可合併，但「欄位清單以必填條為準」會漏掉原規則的
  source name，不能宣稱語義不變。依目前資料 contract，應明列欄位 `source`：

> - When adding press, record enough metadata to audit later: every public press entry must include `source`, `canonicalUrl`, `titleSource`, `imageSource`, and `metadataCheckedAt`. Do not add a press card without those audit fields.

- **agree**：兩條 design-reference 規則以保語義方式 retire/merge，符合
  `PROJECT_BIBLE.md:144`；press 規則補回 `source` 後亦可 retire/merge。
- **agree**：`Until a custom domain is confirmed...` 與 cadence 無衝突，
  `keep-with-reason` 裁決成立。

## 定版前最小閘門

1. 用上方或等義文字改 A、B、C，並把「五週未部署」改成可回讀的 Production
   日期／commit；把 generator 量值改成可重跑口徑或刪除精確數字。
2. design-reference 合併句補回 `which parts serve the portfolio goal`；press
   合併句補回 `source`。
3. 同一變更在 `docs/reviews/LOG.md` 記兩項 R5、驗證、單審降級 concurrence；
   不要把本報告誤稱雙審或全輪轉共識。
4. 定版包跑 docs/governance gate：目標文字搜尋、Bible 行數、
   `git diff --check`；若只動治理文件，無需 browser。任何實際 Production
   deployment 另開包，走完整 QA／review 與逐次 producer authorization。
