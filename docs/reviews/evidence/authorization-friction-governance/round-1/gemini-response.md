### 1. problem_reframe

本事故根因非單純的「授權摩擦」，而是**「技術執行步驟」與「意圖治理邊界」的類別混淆（Category Error）**，並受到指標造假與工具耦合的加劇：

1. **意圖與步驟解耦失敗**：將單一用戶成果（如「上線並套用網域」）拆解為微觀技術動作（Git Push, Preview, Domain Cutover），將「技術執行節點」誤判為「獨立治理邊界」。
2. **指標反噬（Proxy Metric Goodhart's Law）**：強制限制「淨行數」導致規則語義被高度壓縮至單一行， cold-start Agent 對高密度複雜條件產生保守過度解讀（Hyper-conservative Over-gating）。
3. **無邊界審查**：審查過程僅問「是否安全」，未量化「生產者中斷率（Producer Interruption Rate）」，致使安全機制淪為官僚儀式。

---

### 2. pragmatic_path

採用 **Option B**（暫定啟動檢查點）：
1. **不修改 Work Charter 主文**：嚴格遵守「須經兩個專案驗證」之憲章約束，避免治理膨脹。
2. **引入暫定啟動診斷**：於專案啟動 Skill / Checklist 中加入「授權封包與中斷模擬」診斷題。
3. **第二專案驗證**：在下一個新專案中試行此診斷，若成功抑制中斷且無越權事件，再提升至 Work Charter 正式條款。

---

### 3. alternative_architecture

建立**「成果導向意圖合約（Outcome-based Intent Contract）」**機制，取代技術步驟審查：

* **指標**：**成果中斷比（UIOR, User-Interruption-to-Outcome Ratio）**
  $$UIOR = \frac{\text{交付單一成果過程中的授權詢問次數}}{\text{預期交付成果數}} \le 1.0$$
* **機制**：在封包建立時明確劃定「涵蓋邊界（In-scope actions）」與「硬性排除（Hard exclusions）」。邊界內技術動作自動執行，僅在觸發硬邊界（費用、破壞性變更、外部收件人、閘道失敗）時中斷。

---

### 4. low_cost_experiment

在下一個新專案啟動時，執行 15 分鐘的「紙上演練（Dry-run）」：
* **觸發條件**：新專案建立階段。
* **演練內容**：列出第一個端到端 Feature（如 Landing Page 上線），計算若按預設流程會觸發幾次詢問。
* **退場/晉升條件**：若 UIOR $\le 1.0$ 且無安全越界，則紀錄為第二個成功案例，觸發 Option C 晉升為 Work Charter 正式條款。

---

### 5. contrarian_challenge

1. **授權蔓延風險（Scope Creep in Envelope）**：「單一授權封包」極易讓 Agent 產生「獲得盲用授權（Carte Blanche）」的幻覺。若封包定義模糊，Agent 可能在「套用網域」名義下誤刪 DNS 紀錄或覆蓋敏感變數。
2. **行數限制是偽安全**：為了減少 `STATUS.md` 行數而壓縮語意，是導致 LLM 理解混亂的罪魁禍首。**語意明確性（Semantic Clarity）應優先於行數指標**。

---

### 6. unconstrained_possibility

完全解耦「授權」與「部署流程」，改採**「聲明式期望狀態（Declarative Target State）」**：
生產者僅宣告 `Target: Portfolio live at domain.com`，系統自動生成「變更 Diff 與風險清單」，生產者進行**一次性數位簽名（One-shot Signature）**。後續所有 CI/CD/Preview/Domain 自動編排，完全消除步驟級中斷。

---

### 7. overlooked_risks

1. **Agent 語意擴張**：LLM 可能將「授權封包」錯誤推論為「可隱晦跳過未預期的破壞性步驟」。
2. **歷史檔案污染**：若未清理舊專案 `STATUS.md` 中 13 處歷史矛盾聲明，Cold-started Agent 仍會抓取舊規則產生行為分裂。

---

### 8. assumptions_to_verify

1. **假設 1**：Agent 在面對「自然語言授權」時，能否百分之百準確識別「範疇擴張（Scope Expansion）」而主動停止？（需透過測試驗證）
2. **假設 2**：第二個專案是否真的具有多步驟部署複雜度？（若第二專案極簡，則無法作為驗證案例）

---

### 9. recommended_next_decision

* **選擇**：**B**
* **狀態**：**暫定（Provisional）**

---

### 10. option_ranking

**排序：B > A > C**

* **理由**：
  * **Option B（首選）**：在不破壞憲章「兩專案驗證」原則下，提供了防復發的營運檢查點，成本最低、邊界清晰。
  * **Option A（次選）**：過於保守，會讓第二專案重複踩坑，失去跨專案學習價值。
  * **Option C（不推薦）**：直接違反憲章治理規則，打破元治理（Meta-governance）的一致性，且缺乏第二專案實證。

---

### 11. canonical_placement_and_pointers

* **Canonical Source（規範源頭）**：`work-charter` skill 中的 「New Project Startup Checklist」（標註為 Provisional）。
* **Pointers（引用指標）**：
  * `portfolio-skill` $\rightarrow$ 指向 `work-charter` skill 啟動檢查點。
  * 專案 `AGENTS.md` / `Review Checklist` $\rightarrow$ 指向 canonical startup rule。
* **Work Charter 主文**：保持不變，待第二專案驗證後再行寫入。

---

### 12. exact_minimal_wording

```markdown
[Provisional Check] 專案啟動時須演練端到端交付並計算 producer 中斷次數。
同成果之預見技術步驟應歸納為單一可撤銷授權封包（UIOR <= 1.0）。
僅在範疇擴張、破壞性變更、新增費用/秘密/收件人或閘道失敗時方可重新中斷詢問。
```