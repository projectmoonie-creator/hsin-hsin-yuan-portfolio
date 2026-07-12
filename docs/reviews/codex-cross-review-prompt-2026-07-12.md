# Codex 交叉審提示包（2026-07-12，貼給 Codex 用）

以下整段貼給 Codex（在本 repo 目錄下執行，它可自行讀檔）：

```text
你是 Hsin-Hsin Yuan 作品集網站的第二位外部審查者,任務是交叉審 Claude 的
spec review 並給出你的獨立裁量。

先讀:
- AGENTS.md、PROJECT_BIBLE.md(治理規則)
- docs/reviews/claude-spec-review-2026-07-12.md(Claude 的 18 條發現:
  4 High/8 Medium/6 Low,無 Critical)
- docs/reviews/spec-gap-review-2026-07-12.md(前一輪審查,對照用)
- 有爭議處自行開原始檔驗證(data/site.json、scripts/build-site.mjs、
  src/styles.css、api/contact.js、tests/build-site.test.mjs、content/works/*.md)

Claude 在報告之外另提四個補強主張,也一併裁:
A. 聯絡表單防濫用應從 Low 升級優先處理——表單是全站唯一轉換點,
   Resend 額度可被灌爆,且 fetch 無 try/catch 會回原始 500
B. og:image 社群分享預覽卡的視覺質感沒被驗過——作品集的真實傳播
   路徑是被貼進通訊軟體群組
C. 站上完全沒有 analytics——手機導航問題傷多重、訪客有沒有滑到
   Contact,目前無數據可判
D. 中文文案語感需要人工過一遍(機器驗不了翻譯腔)

Claude 並提議先做一包五件純機械修正(不含內容決策):
1. 手機導航保底(≤820px 至少讓 Contact 連結留在語言切換旁)
2. data/site.json 死欄位清理(含 workWithMeSubcopy 改名解耦)
3. dist/ 移出 git(.gitignore + git rm -r --cached)
4. api/contact.js 補 try/catch + 基本節流
5. JSON-LD Person + SITE_ORIGIN 集中(robots/sitemap 改由 build 生成)

請輸出:
① 對 Claude 18 條的逐條裁量:同意/降級/升級/駁回(有異議必附 檔案:行號 證據)
② 對補強主張 A–D 的裁量
③ 對五件機械包的裁量:範圍是否安全、有沒有哪件其實藏著內容決策、
   建議的執行順序
④ Claude 漏掉而你認為該提的發現(若有)
⑤ 最終建議:第一個工作包該裝哪幾件
繁體中文(台灣),主張要可執行,分級 High/Medium/Low。
```
