# 授權摩擦治理修改方案

日期：2026-08-13
狀態：**建議採用 Option B；跨專案正式條文尚未修改，等待製作人拍板**

## 結論

這次不順不是因為「Production 必須明示授權」這個安全邊界錯了，而是我們在
2026-08-04 把風險邊界誤寫成逐技術步驟的授權節奏，之後又被 Vercel/Git 耦合、
長條文、舊狀態紀錄與過窄的 package 定義放大。

作品集本身與 `portfolio-narrative-builder` 已修成「一個 bounded package、一個
authorization envelope」。跨專案層目前只有一個直接事故案例，不符合 Work
Charter 的兩專案入典門檻。因此現在不應立刻增加一條永久憲法；應在新專案開案
流程加入一次**暫定、可退役的端到端授權演練**，並用下一個適合的專案驗證。

「警告」只有在它是可執行檢查時才會更清楚。單純寫一段「小心不要問太多」會增加
噪音；具名觸發點、一次演練、明確晉升/退役條件，才不會變成另一層規則膨脹。

## 已確認的根因

1. **類別錯置**：把 Git push、Preview、Production、alias、Contact 等執行節點
   當成各自獨立的治理邊界，而不是同一個使用者成果中的可預見步驟。
2. **審查錨定錯誤**：審查只問「是否仍明示授權」，沒有模擬正常完成一個成果時
   製作人會被打斷幾次，也沒有區分風險邊界與授權 cadence。
3. **錯誤代理指標**：以 Bible 淨行數不增加當減重閘，讓條文縮成一個語義過密的
   長行；字面變短，規則複雜度沒有下降。
4. **工具耦合放大**：此 repo 的 Git push 會觸發 Vercel Preview，合理的安全顧慮
   被轉譯成更多相鄰排除與重複確認。
5. **狀態檔角色漂移**：`STATUS.md` 混入大量歷史授權排除，冷啟動 agent 反覆讀到
   舊版本，而不是只看當前 envelope 與 exact next action。
6. **package 切得太低**：Hero release、domain cutover、Contact routing 被當成互不
   相干的技術包；實際使用者成果卻是「自有網域上可用、可聯絡的正式作品集」。
7. **介面差異被誤當治理差異**：沒有選項元件的 session 讓每個閘都落成手打文字，
   但介面模式本來不應創造新的授權要求。

## Gemini 官方 API 審查

### Provenance

- frozen packet：
  `docs/reviews/evidence/authorization-friction-governance/round-1/frozen-problem-frame.md`
- packet SHA-256：
  `678f0156cea6a0d06cdb531191be619ddb94331ca9ba5007b59a15da5853c1a3`
- routing policy：`highest-capability-generally-released-at-execution`
- requested model：`gemini-3.6-flash`
- observed model：`gemini-3.6-flash`
- completed model：`gemini-3.6-flash`
- status：`completed`
- response SHA-256：
  `67717bc388a5f0feb91ff7763ad6967b09fa4f8d1ac61c93c3e9597eeb4063c8`
- 第一個本地受限環境嘗試在 DNS 階段失敗，未連到 provider；解除網路限制後以同一
  frozen packet 完成唯一一次 provider request。
- Claude：依製作人本輪流量優先，`not-dispatched-by-producer-prioritization`；本案
  不是雙審共識。

### 裁決表

| ID | Gemini 意見 | 本地裁決 | 理由 |
|---|---|---|---|
| G1 | 根因是意圖治理邊界與技術步驟的 category error | **採納** | 與 commit、提案與狀態檔證據一致。 |
| G2 | 現在採 Option B，第二專案驗證後才升級 Work Charter | **採納** | 符合兩專案入典門檻，也能避免下一案完全沒有預防。 |
| G3 | 以 `work-charter` skill 作 canonical source | **部分採納** | skill 可承載暫定實驗，但正式正典仍只能是 Work Charter；不能讓 skill 取代它。 |
| G4 | 使用 UIOR ≤ 1.0 當門檻 | **部分採納** | 中斷次數有用，但硬門檻會再度 Goodhart；改成需解釋的診斷警報。 |
| G5 | envelope 必須保留費用、破壞、秘密、收件人與 failed gate 硬停 | **採納** | 防止 envelope 被誤讀成 carte blanche。 |
| G6 | 清理 `STATUS.md` 的舊矛盾宣稱 | **採納為後續專案內整理** | 現況檔應 current-first；歷史移到 LOG/報告，不應無痕刪除。 |

## 建議的最小修改

### 現在：一個暫定開案檢查，不修 Work Charter 主文

若製作人拍板，在 `work-charter` skill 的「新計劃第一個 session」執行流程加入下面
四行，並標記 `Provisional — Portfolio 1/2`：

> 先以第一個端到端成果演練一次：列出可預見動作、硬排除與製作人中斷點。
> 同一成果內、已知且有條件的步驟，合併為一個可撤銷 authorization envelope。
> 只有 scope 改變、gate 失敗，或新費用／收件人／秘密／破壞目標才重新詢問。
> 若預計詢問超過一次，記錄每次為何是不同的實質決策；不得用工具步驟本身作理由。

這四行不是跨專案正式規則，只是下一個新專案的實驗指令。Work Charter 主文與
第六節目前保持不變；作品集 skill 保留已落地的完整實作，不再複製這四行。

### 第二個適合的專案：做一次低成本驗證

新案第一個包含外部動作的 bounded outcome 開始前，記錄：

- outcome 是什麼；
- 可預見的 action classes；
- envelope 條件與 hard exclusions；
- 預計的 conversational approval prompts 數；
- product/tool 自己強制的 confirmation 數（分開計，不當成 AI 重複詢問）；
- 實際額外重問次數與原因；
- 是否發生 scope overreach、秘密暴露、錯誤收件人、非預期費用或破壞動作。

「每一個成果預計超過一次 conversational approval」只觸發檢查，不自動判 FAIL。
若多次詢問分別對應真正不同且當時不可預見的實質決策，就是合理例外。

### 驗證後：晉升或退役

- **晉升**：第二個具多步驟外部動作的專案完成驗證，沒有越權事故，且重複詢問確實
  減少。屆時在 Work Charter「製作人主權模型」加入一句通則，從 skill 移除
  provisional 內容，改成一行指標。
- **保留實驗**：第二案不具代表性，例如完全沒有部署、收件人、費用或秘密邊界。
- **退役/修正**：演練增加不必要文件、仍無法辨識 scope expansion，或造成任何
  overreach。移除暫定檢查，不把它入典。

## 正典與指標配置

| 層 | 現在 | 建議 |
|---|---|---|
| Work Charter 主文 | 通用正典 | **暫不修改**；等第二專案驗證。 |
| `work-charter` skill | 只負責開機 | 承載一個標明 1/2 的暫定實驗；不是正式正典。 |
| `portfolio-narrative-builder` | 作品集方法正典 | 保留完整 authorization-envelope 做法；不再加警告副本。 |
| project `AGENTS.md` / Bible | 專案規則 | 只留此專案的 envelope 與 Vercel/Contact 特有邊界。 |
| `STATUS.md` | 當前 package 與 next action | 只顯示 live envelope；歷史判例移到 LOG/dated report。 |
| review packet | 獨立審查問題 | 加入 outcome、預計中斷數、實質決策分界三問。 |

## 除了規則文字，還需要調整的四件事

1. **改 package 起點**：先寫使用者成果，再列技術步驟；不能用工具名稱當 package
   邊界。這比再加一條「不要問太多」更能預防復發。
2. **改審查 prompt**：治理改動必問「走完一個正常 outcome 會打斷製作人幾次？
   哪些真的是不同實質決策？」不能只問安全或一致性。
3. **退役行數 KPI**：規則減重改看 canonical owner、重複副本數、觸發條件、例外、
   stop condition 與 retirement path；不得以壓成長行通過。
4. **整理狀態檔**：另開一個機械性的 project-local compaction package，把舊的授權
   排除敘述移到 LOG/dated evidence，只保留現在生效的 envelope 與下一步。這不是
   刪歷史，也不應和 Contact runtime package 混在一起。

## 建議拍板

採 **Option B（暫定）**：允許下一步只修改 `work-charter` skill，加入上述四行
`Portfolio 1/2` 開案實驗；不改 Work Charter 主文、不擴寫所有 AGENTS/Bible，
不把中斷比變成硬 KPI。第二個適合的專案完成後，再回來決定晉升或退役。
