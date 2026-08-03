# 流程減重修訂案（Process Diet）v1

日期：2026-08-04｜提案：Claude（外部稽核官）｜狀態：**待 Codex 稽核 → 製作人定版**

## 背景（稽核摘要）

製作人委託對本專案 Codex 工時做外部稽核（三路深讀 2026-07 session 思考鏈）。
量化結論：repo 內流程文件 11,832 行 vs 產品程式碼 6,764 行（1.75:1）；
最近 100 個 commit 有 64 個只動文件；為調整卡片順序寫過 1,335 行實施計畫；
雙 AI 交叉審查一輪成本約 USD 5.7＋管線功夫，實測收穫 1 條低優先文案建議；
同時唯一成真的風險（本地 99 commit 無遠端副本）沒有被任何閘擋下（已於
2026-08-04 推 `backup/main-2026-08-04` 止血）。本案目標：**砍防未發生風險的
過重儀式，鎖住已發生過的真風險**。

## 修訂條文（八條；R1–R7 對 PROJECT_BIBLE.md，R8 對 AGENTS.md與STATUS 用語）

### R1 計畫與交付成比例（Roadmap Discipline 增補＋收斂）
- 增：套件計畫以 ≤60 行為上限（目標/檔案/非目標/驗證/回滾）；**計畫行數
  超過它所規劃的 diff 行數＝拆包或砍計畫**。
- 改：**逐包結案報告廢止**，改為在 `docs/reviews/LOG.md` 追加 ≤10 行
  （日期/分支/commit/驗證方式/未盡事項）；正式結案報告保留給**階段**收尾。
- 立案事實：26 份逐包結案報告共 3,305 行；1,335 行計畫規劃一次卡片重排。

### R2 QA 分級（QA Checklist 改寫）
- 每包：`npm test`＋改動面 1 桌面寬＋1 行動寬目視。
- 全案矩陣（雙語 × 多視口 × reduced-motion × no-JS × BFCache）：**只在
  階段收尾與正式部署前跑**。
- 立案事實：全矩陣被當每包例行，為單次文案修改的最大固定成本。

### R3 外部審查改抽查制（Roadmap Discipline 末條改寫）
- 雙 AI 交叉審查僅用於：動到事實宣稱/版權/隱私的階段，或單階段 diff
  超過 500 行。一般文案/版面包：免外審或單審。
- 立案事實：2026-07-19 一輪雙審，六條發現四條事實錯誤，淨收穫 1 條低優先。

### R4 媒體帳目分級（Media Rights 增補一句）
- SHA-256／byte 級帳目只記**第三方或版權敏感媒體**；自有素材記來源與
  時長即可。立案事實：30 秒自有 showreel 記到 8,651,457 bytes/六位小數秒。

### R5 規則退役制（新增於 Roadmap Discipline）
- 每新增一條 Bible 規則，同 commit 檢視一條既有規則是否退役/降級並記錄
  結論；被取代的流程文件移入 `docs/archive/`。**流程文件不是只增不減的。**
- 立案事實：流程文件累計 +10,589 行、−98 行，淨 append-only。

### R6 備份閘機械化（Phase Closeout 增補）
- 任何收尾宣告前必須貼上 `git rev-list --count origin/main..HEAD` 實際輸出；
  大於 0 ⇒ 先推 `backup/<日期>` 分支並回讀遠端，否則一律 `BLOCKED`。
- 立案事實：unpushed-work 條款文字早已存在（現行 §Phase Closeout），但
  91→99 個 commit 連續五週停在本機——文字閘不夠，要機械輸出。

### R7 上位法引用（新增兩行，正文在工作憲章）
- 減法任務禁止重寫（憲章 三-9）：刪/修/精簡指令必須以現有基底出 diff，
  重新架構須製作人明文同意。
- 子代理派工帶摘要不帶全量對話史（憲章 三-10，Codex 具體形＝`fork_turns:
  none`）。

### R8 掛上工作憲章＋備份與上線解綁（AGENTS.md＋STATUS 用語修正）
- AGENTS.md 讀取鏈補一行：`~/Documents/Claude/Projects/_SHARED/WORK-CHARTER.md`
  （上位法）。立案事實：憲章 四-21「備份與審查是兩件事」2026-08-02 已入典
  （TriTrack 42 commit 判例），但本 repo 讀取鏈只有 AGENTS→Bible→STATUS，
  憲章從未被讀到——**法律存在，法域讀不到**。
- 「push／deploy／merge 需明文授權」條款改為只約束 `origin/main` 與正式
  部署；**推 `backup/*` 分支＝憲章要求的義務，不需授權**（`backup/*` 不接
  Vercel production，備份≠上線）。立案事實：STATUS.md 現行第 220–221 行把
  三者綁成同一禁令，導致 99 個 commit 五週無遠端副本。

## 驗收標準（定版時檢查）

1. **PROJECT_BIBLE.md 淨行數不得增加**（新增條文的行數，由收斂 R1/R2/R3
   原有段落與 Roadmap 建議順序段的冗詞抵銷）。
2. R6 的機械輸出在下一次收尾實際出現一次。
3. 本案自身 ≤120 行（治 append-only 的藥不准 append 超量）。

## Codex 稽核派工單（read-only）

依工作憲章 四-1（覆核者≠修正作者）：本案由 Claude 起草，請 Codex 以
唯讀模式稽核，**不代改任何檔案**，輸出到
`docs/reviews/2026-08-04-process-diet-codex-audit.md`：

1. 逐條（R1–R8）判：採納／修文（附具體措辭）／駁回（附理由）。
2. 檢查點：條文是否有歧義、是否機械可檢、是否與既有 Bible 條文或現行
   測試衝突、立案事實是否與 repo 實況相符。
3. 特別驗證 R6：在本 worktree 實跑 `git rev-list --count origin/main..HEAD`
   並記錄輸出。
4. 結尾給單一結論：`可定版` / `修文後定版` / `退回重擬`。
