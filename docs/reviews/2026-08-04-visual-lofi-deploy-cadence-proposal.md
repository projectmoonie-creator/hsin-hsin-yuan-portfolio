# 修訂案：視覺低保真先行＋部署節奏＋動到即抽取（源：2026-08-04 Gemini 評估＋製作人架構討論）

狀態：**待 Codex 單審（低風險治理包，新分級制首用）→ 製作人定版**

## 新增條文（各一行，Bible 風格長行）

### A. Visual Direction 節尾新增
> - Visual experiments run lo-fi first: propose the layout or effect as text or plain structural blocks, get producer approval, then code the detail pass. Each visual experiment is timeboxed at 1.5 hours — when the box expires without approval, revert to the last approved state and log the attempt in `docs/reviews/LOG.md`; do not extend by momentum.

### B. Contact And Deployment 節尾新增
> - Deployment cadence: once `main` is deployable, target at least one producer-authorized Production deploy per week; unfinished features ship behind flags or stay on branches. A `backup/*` push is not a deploy. Going more than two weeks undeployed becomes a closeout blocker raised explicitly to the producer.

### C. Roadmap Discipline 節尾新增（動到即抽取）
> - Extract on touch: no big-bang refactors, but when a package modifies a feature that lives inline in the shared generator or stylesheet, first extract that feature into its own bounded unit (data field + template/module block + focused test), then apply the change in the same package with tests green before and after. One feature per extraction; features never touched are never extracted preemptively.

## 行數抵銷（Bible 淨行數不得增加；+3 需 ≥−3）

1. Visual Direction 兩條 design-reference 條文合併為一（−1）：
   - 原：「Before implementing a design reference, translate it into
     project-specific rules…」＋「Do not copy a reference site's surface
     style literally…」
   - 併：「Before implementing a design reference, translate it into project-specific rules — what to borrow, what to avoid, how it behaves on desktop and mobile; never copy a reference site's surface style literally when the content needs another rhythm. Use references to derive typography, spacing, motion, image, logo, and section-order decisions.」
2. Bilingual Voice「For English portfolio-grouping titles…」三行繞排收單行（−2，語義不變）。
3. Press Cards「When adding press, record enough metadata…」與「Every public
   press entry must include `canonicalUrl`…」兩條合併為一（−1，欄位清單
   以必填條為準，語義不變）。

## R5 退役裁決（入 LOG）

- **retire/merge**：兩條 design-reference 條文 → 一條（抵銷項 1）；兩條
  press metadata 條文 → 一條（抵銷項 3）。
- **keep（附理由）**：「Until a custom domain is confirmed, Vercel's project
  domain is acceptable」——部署節奏條生效後此條仍有效，不衝突。

## 立案事實

- 光效 4.5 小時建、18 天後 −729 行全刪；規則 6 分鐘內寫入又反轉——
  病根是視覺規格在動工前不存在（Gemini 指出的「修法管了 AI 的手、
  沒管指令模糊度」缺口）。
- 備份已機械化但站點五週未部署；備份閘不治部署停滯。
- 全站由單一 ~2,000 行產生器輸出：158 commit 內 build-site.mjs 改 67 次、
  styles.css 59 次、測試檔 82 次——無元件邊界，任何改動都落同三檔
  （製作人 2026-08-04 拍板「動到即抽取」，禁止大爆炸重構）。

## Codex 派工單（read-only）

單審本案（A/B/C 三條）：條文歧義／機械可檢性／與現行 Bible、61 測試、
AGENTS.md 授權條款的衝突；特別驗證 B 條與「Production 需製作人授權」
不矛盾（節奏=浮上檯面的義務，非自動部署授權）；C 條與「減法任務禁止
重寫」（憲章三-9）不矛盾（抽取=同包內結構搬移，測試前後全綠，非重寫）。
輸出 `docs/reviews/2026-08-04-visual-lofi-deploy-cadence-codex-audit.md`，
結論：可定版／修文後定版／退回。
