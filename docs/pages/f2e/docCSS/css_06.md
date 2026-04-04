---
title: CSS
---

# CSS 課程規劃
## 第六階段：高階實戰與架構優化
  - ### 目標
    - 能根據設計稿快速實作 UI
    - 熟悉原子化 CSS 框架的哲學

  - ### 學習內容
    - Tailwind + Component Lib（如 shadcn/ui、Headless UI）
    - 抽出共用樣式（@apply）
    - CSS-in-JS vs Utility-First vs 傳統 CSS 的比較
    - 結合 Nuxt、React、Astro 的應用範例
    - 整合 CMS、Blog、Landing Page 實作

  - ### 簡報主題建議
    - 為何選擇 Utility-First 的 CSS 框架？
    - Tailwind 基礎語法與常用 class 類型
    - 客製化 config、設定斷點與顏色系統
    - @apply、variant、Dark mode 等進階技巧

  - ### 範例題材
    - Tailwind 商品列表頁
    - 結合 Tailwind + Markdown Blog 模板
    - Dark Mode 切換器實作

  - ### 簡報
    - #### Slide 1：第六階段目標
      - 高階實戰與架構優化
      - 整合 CSS 所學，實作中大型專案
      - 學習模組化與可維護 CSS 架構
      - 導入 `PostCSS` / `SCSS` / `Tailwind` 的進階技巧
      - 探討 CSS 工程化與團隊合作策略

    - #### Slide 2：專案實戰與挑戰
      - 從設計稿切版到響應式實作
      - 多元頁面佈局管理
      - 樣式重用與元件化策略
      - 版本控制與多人協作流程
      - 需求變動下的快速調整能力

    - #### Slide 3：模組化 CSS 架構策略
      | 技術                | 說明                           |
      | ----------------- | ------------------------------- |
      | BEM               | Block Element Modifier 命名策略   |
      | SCSS / Sass       | 可變數、巢狀、Mixin、Function       |
      | PostCSS           | 自動前綴、壓縮、變數處理等           |
      | CSS Modules       | 在 Vue / React 封裝組件樣式        |
      | Tailwind + @apply | 結合 Utility-First 與元件化       |

    - #### Slide 4：CSS 檔案結構規劃建議
      ```csharp
      src/
      ├── assets/
      │   └── styles/
      │       ├── base.css / reset.css
      │       ├── variables.css / scss
      │       ├── components/
      │       │   └── button.css
      │       ├── layout/
      │       │   └── header.css
      │       └── utilities/
      │           └── spacing.css
      ```

      - 明確分類基礎樣式、元件樣式與工具類別
      - 有利於專案成長與團隊協作

    - #### Slide 5：CSS 工程化思維
      - 將 CSS 當成「可維護的程式碼」
      - 規範命名與一致結構
      - 建立變數與混入（mixin）統一設計語言
      - 善用 `Linter`、`Formatter`、`Build` 工具輔助維護

    - #### Slide 6：整合自動化與工具鏈
      | 工具             | 功能                           |
      | --------------- | ------------------------------ |
      | PostCSS         | 自動前綴、嵌套、變數等功能          |
      | autoprefixer    | 自動加上 CSS 相容前綴             |
      | stylelint       | 樣式代碼檢查、風格一致性           |
      | cssnano         | CSS 壓縮工具                    |
      | Prettier        | 自動排版統一風格                  |
      | Tailwind Plugin | 自訂 Utility / Component 套件   |


    - #### Slide 7：高階實作練習方向
      - 實作一個「後台管理系統」或「電商前台」
      - 練習模組化樣式結構
      - 為頁面設計響應式行為與互動細節
      - 加入狀態切換、過場動畫（Transition/Animation）

    - #### Slide 8：CSS 效能與最佳化
      - 減少 `DOM` 選擇器複雜度
      - 精簡樣式，避免無用 `CSS`
      - 預處理與 `Purge` 工具刪除未用樣式（`Tailwind Purge`）
      - 合理使用 `CSS Variables` / `SCSS Function` 實現主題切換

    - #### Slide 9：團隊開發與樣式規範
      - 撰寫樣式風格指南（`Style Guide`）
      - 設計 Token 與主題系統（`Dark/Light Mode`）
      - 萬用元件命名（例如：`Button`、`Card`、`Modal`）
      - `Review CSS` 時檢查命名一致與語意清晰

    - #### Slide 10：結訓與前往全端之路
      - 完整掌握 CSS 開發各階段技能
      - 實際打造可維護、可拓展的前端架構
      - 準備好進入進階前端或全端開發旅程（如學習 JS 框架、後端）
