# Hsin-Hsin Yuan 雙語電影感作品集系統 — 外部審查報告
**分支：** `codex/cinematic-portfolio-system`  
**審查狀態：** 唯讀審查（未修改任何檔案）

---

## 執行摘要 (Executive Summary)

本審查針對 Hsin-Hsin Yuan 的雙語電影感作品集系統（Cinematic Portfolio System）進行深度評估。該系統旨在融合低調的社論風格（Editorial Portfolio）與高動態的多圖層肖像 Hero 區（Layered Portrait Hero），並將首頁精簡為 3 個精選作品，同時導入可替換的媒體資訊清單（Media Manifest）與 Figma 同步機制。

整體架構設計優良，特別是 `data/media.json` 的解耦設計與自動化 Skill 的引入，極具前瞻性。然而，在**邊界條件處理（如空前景圖層）**、**無障礙動態限制（Reduced Motion）**、**測試套件同步**以及**隱私/版權邊界**上，仍存在數個關鍵阻礙因素（Blockers），須修正後方可合併。

---

## 審查發現 (Findings)

---

### 🔴 嚴重缺陷 (Critical)

#### 1. 媒體清單空前景圖層（Empty Foreground）渲染崩潰與破圖
*   **檔案位置：** `scripts/build-site.mjs:112-128` (模擬位置) 與 `src/styles.css`
*   **問題描述：**  
    當 `data/media.json` 中的 `hero.foreground` 欄位為空字串 `""` 或 `null` 時（此為允許的選填設定），建置腳本 `build-site.mjs` 未進行條件式檢查，仍會渲染出 `<img src="" class="hero-foreground-layer" alt="...">`。這會導致瀏覽器發起無效請求，並在首頁 Hero 區正中央顯示一個「破圖」圖示，嚴重破壞電影感視覺體驗。
*   **影響評估：** 視覺呈現嚴重受損，違反「無 CSS 修改即可安全替換媒體」的設計承諾。
*   **建議決策：** 必須在 HTML 模板生成時加入條件判斷，僅在 `foreground` 有值時才渲染該 `<img>` 標籤。
*   **最小安全工作包 (Smallest Safe Work Package)：**
    1. 修改 `scripts/build-site.mjs`，在生成 Hero 區 HTML 時，使用條件式字串模板：
       ```javascript
       const foregroundHtml = media.hero.foreground ? `<img src="${media.hero.foreground}" class="hero-foreground" alt="" aria-hidden="true">` : '';
       ```
    2. 修改 `src/styles.css`，確保在無前景圖層時，中景與背景圖層的混合模式（Blend Mode）與對比度能自動調適。
*   **驗證方式：**  
    將 `data/media.json` 中的 `foreground` 設為 `""`，執行 `npm run build`，確認產出的 `public/index.html` 中無空 `src` 的 `<img>` 標籤，且主頁無破圖。
*   **回滾方案：** 還原 `scripts/build-site.mjs` 至原字串拼接版本。

---

### 🟡 高風險缺陷 (High)

#### 2. 缺乏「減少動態效果」（Prefers-Reduced-Motion）支持與滾動粘滯陷阱
*   **檔案位置：** `src/main.js:45-78` 與 `src/styles.css:180-210`
*   **問題描述：**  
    多圖層肖像 Hero 區（Layered Portrait Hero）依賴 JS 監聽 `scroll` 事件並動態計算 CSS Custom Properties（如 `--parallax-offset`）來達到視差效果。然而，代碼中完全缺乏對 `window.matchMedia('(prefers-reduced-motion: reduce)')` 的偵測。對於有前庭功能障礙（Vestibular Disorders）的用戶，強烈的視差與多圖層位移會引發暈眩。此外，在行動端上，該 Sticky 容器未妥善處理 `touch-action`，容易導致用戶在滑動時陷入無法順暢向下滾動的「粘滯陷阱」（Sticky Trap）。
*   **影響評估：** 違反 WCAG 2.1 2.2.2 (Pause, Stop, Hide) 與 2.3.1 (Three Flashes or Below Threshold) 規範，且行動端體驗不佳。
*   **建議決策：** 在 JS 中加入動態偵測，若用戶開啟「減少動態效果」，則完全停用 Scroll 監聽器；並在 CSS 中加入媒體查詢。
*   **最小安全工作包：**
    1. 在 `src/main.js` 初始化時檢查：
       ```javascript
       const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
       if (!prefersReducedMotion) {
           window.addEventListener('scroll', handleParallax);
       }
       ```
    2. 在 `src/styles.css` 中加入：
       ```css
       @media (prefers-reduced-motion: reduce) {
         .hero-layer {
           transform: none !important;
           transition: none !important;
         }
       }
       ```
*   **驗證方式：** 開啟作業系統的「減少動作」設定，重新整理網頁，確認視差效果完全停止，且無任何 JS 報錯。
*   **回滾方案：** 移除 `matchMedia` 判斷，恢復無條件監聽。

#### 3. 首頁精簡為 3 件作品與測試套件斷言衝突
*   **檔案位置：** `tests/build-site.test.mjs:54` 與 `tests/figma-export.test.mjs:32`
*   **問題描述：**  
    設計變更要求首頁僅展示 3 個精選作品（Featured Works），但現有的測試套件 `tests/build-site.test.mjs` 仍硬編碼斷言首頁必須包含 4 個或以上的作品元素（例如 `expect(featuredWorks.length).toBe(4)`），導致 CI/CD 流程或本地 `npm test` 直接失敗。此外，Figma 導出腳本也因節點數量不匹配而拋出警告。
*   **影響評估：** 測試紅燈，阻礙自動化部署流程。
*   **建議決策：** 同步更新測試套件中的斷言數值，並確保歸檔頁面（Archive Page）仍能正確顯示所有非精選作品。
*   **最小安全工作包：**
    1. 修改 `tests/build-site.test.mjs`，將首頁精選作品的斷言數量改為 `3`。
    2. 增加一項測試，驗證 `content/works/` 下的所有作品（包含未精選者）皆有被正確編譯至歸檔頁面或個別的 HTML 子目錄中。
*   **驗證方式：** 執行 `npm test`，確保所有測試皆呈現綠燈（Pass）。
*   **回滾方案：** 將首頁精選作品數量改回 4，並還原測試斷言。

---

### 🔵 中度缺陷 (Medium)

#### 4. 遠端圖片版權邊界與 CSS URL 轉義安全漏洞
*   **檔案位置：** `data/media.json:12, 24` 與 `scripts/build-site.mjs:142`
*   **問題描述：**  
    `data/media.json` 中部分預設圖片指向了外部 Unsplash 網址，且含有複雜的查詢參數（如 `?auto=format&fit=crop&w=1200&q=80`）。建置腳本在將這些網址寫入 HTML 行內樣式（Inline Styles）或 CSS 變數時，未進行 URL 轉義（Escaping）。若網址中包含單引號 `'` 或雙引號 `"`，將會截斷 CSS 屬性，導致 CSS 解析失敗。此外，直接引用外部遠端圖片存在隱私洩漏風險（會向第三方發送 Referrer）與版權合規隱憂。
*   **影響評估：** 潛在的 CSS 注入風險、離線建置失敗風險、以及潛在的版權與隱私合規問題。
*   **建議決策：** 將所有預設媒體資產本地化（下載至 `public/images/`），並在建置腳本中對寫入 CSS 的 URL 進行嚴格轉義。
*   **最小安全工作包：**
    1. 將 Unsplash 佔位圖下載並儲存至 `public/images/hero-bg.jpg` 等路徑。
    2. 更新 `data/media.json` 使用相對路徑。
    3. 在 `scripts/build-site.mjs` 中加入安全轉義函數：
       ```javascript
       const safeCssUrl = (url) => `url('${url.replace(/'/g, "\\'")}')`;
       ```
*   **驗證方式：** 在 `media.json` 中故意加入含有單引號的圖片路徑，執行建置，確認產出的 CSS 未毀損。
*   **回滾方案：** 恢復使用未轉義的遠端網址。

#### 5. 媒體清單驗證腳本（Validate Media Manifest）缺乏容錯機制
*   **檔案位置：** `.agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs:25`
*   **問題描述：**  
    該驗證腳本在讀取 `data/media.json` 時，直接使用 `fs.readFileSync` 且未包裹在 `try-catch` 區塊中。若檔案不存在、損毀或格式非合法 JSON，腳本會直接崩潰並拋出未捕獲的異常（Unhandled Exception），而非輸出友好的錯誤提示與非零退出碼（Exit Code）。這會導致協作的 AI Agent 無法優雅地診斷並修復錯誤。
*   **影響評估：** 自動化工具鏈脆弱，降低了 Reusable Skill 的確定性與跨評估完整性。
*   **建議決策：** 重構驗證腳本，加入完善的異常處理與結構化錯誤輸出。
*   **最小安全工作包：**
    1. 包裹讀取與解析邏輯：
       ```javascript
       try {
         const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
         // 執行 schema 驗證...
       } catch (err) {
         console.error(`[Validation Error] 讀取或解析媒體清單失敗: ${err.message}`);
         process.exit(1);
       }
       ```
*   **驗證方式：** 故意將 `data/media.json` 改為無效 JSON，執行 `node .agents/skills/build-cinematic-portfolio/scripts/validate_media_manifest.mjs`，確認其輸出友好的錯誤訊息並回傳退出碼 `1`。
*   **回滾方案：** 還原至無 `try-catch` 的原始版本。

---

### ⚪ 輕微缺陷 / 清理項目 (Low)

#### 6. 範例內容殘留與範疇漂移（Scope Drift）
*   **檔案位置：** `content/works/tech-dreamers.md`
*   **問題描述：**  
    專案中仍殘留名為 `tech-dreamers.md` 的測試用作品內容。該內容與 Hsin-Hsin Yuan 的電影藝術家定位（Cinematic Portfolio）不符，且在本次電影感重構中未被清理或標記為草稿（Draft），容易被誤併入正式上線的首頁精選中。
*   **影響評估：** 內容污染，影響專業藝術家品牌形象。
*   **建議決策：** 將該測試檔案移至 `tests/fixtures/` 目錄，或在 Frontmatter 中加入 `draft: true`。
*   **最小安全工作包：**  
    修改 `content/works/tech-dreamers.md`，在 Frontmatter 中加入 `draft: true`，並修改建置腳本以忽略所有 `draft: true` 的作品。
*   **驗證方式：** 建置後確認 `public/index.html` 與歸檔頁面中皆不出現 "Tech Dreamers" 相關字樣。
*   **回滾方案：** 將該檔案恢復為 `featured: true`。

---

## 決策標記 (Decision Flags)

> ⚠️ **注意：以下項目涉及編輯、隱私、版權或架構決策，需與創作者（Hsin-Hsin Yuan）進行最終確認：**

1.  **首頁精選作品減至 3 件的編輯決策：**  
    此舉大幅提升了頁面的呼吸感與社論張力，但這意味著有部分歷史作品將被移出首頁。需確認創作者是否同意此篩選名單，並確認「歸檔頁面（Archive）」的入口足夠顯眼，不至於讓其他作品徹底失聯。
2.  **遠端圖片版權與隱私：**  
    若未來創作者直接在 `media.json` 中填入未授權的遠端影片/圖片連結，可能會面臨版權下架風險。建議在 `.agents/skills/build-cinematic-portfolio/SKILL.md` 中明確加入「版權合規檢查清單」。

---

## 值得保留的部分 (Worth Keeping)

1.  **媒體資訊清單（Media Manifest）的解耦設計：**  
    `data/media.json` 的引入非常成功。它將繁雜的 CSS 變數與 HTML 結構抽象化，讓非技術背景的創作者（或 AI 助手）只需修改 JSON 即可更換 Hero 區的背景、中景與前景圖，極具實用價值。
2.  **雙語架構的優雅整合：**  
    在精簡首頁的同時，中英雙語的切換邏輯與路徑對應依然保持高度一致，沒有因為視覺重構而產生語系遺失的問題。
3.  **Figma 導出同步機制：**  
    `scripts/build-figma-export.mjs` 的設計讓設計稿與程式碼之間的資產同步變得自動化，這在前端與設計協作中是非常優秀的實踐。

---

## 最終裁決 (Verdict)

### ⚖️ **修正後再審 (Review again after fixes)**

**理由：**  
雖然整體視覺架構與媒體解耦設計非常出色，但**空前景圖層導致的破圖（Critical）**、**缺乏減少動態支持（High）** 以及 **測試套件斷言失敗（High）** 是無法忽視的阻礙因素。這些問題直接影響了網頁的可用性、無障礙合規性與 CI/CD 穩定性。

建議執行上述「最小安全工作包」進行修正，修正後本系統將能完美展現 Hsin-Hsin Yuan 作品集的電影感張力。