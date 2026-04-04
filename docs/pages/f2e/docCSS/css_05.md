---
title: CSS
---

# CSS 課程規劃
## 第五階段：Tailwind CSS 與 Utility-First 思維
  - ### 目標
    - 掌握 Tailwind CSS 的用法與客製化技巧
    - 學會快速開發並維護大型專案

  - ### 學習內容
    - 安裝 Tailwind（Vite、Vue/Nuxt 專案）
    - Utility class 使用方式
    - padding、margin、flex、bg-color、text-size 等
    - 客製化 tailwind.config.js
    - Responsive、Dark Mode、Plugin 使用
    - 搭配 Prettier + PostCSS + VS Code 工具鏈

  - ### 簡報主題建議
    - 為什麼需要 CSS 結構規劃？
    - 命名方式（BEM、SMACSS）
    - SCSS / PostCSS 與變數、巢狀語法
    - Component-based 的樣式管理思維

  - ### 範例題材
    - 模組化卡片元件（SCSS 分檔）
    - 使用 SCSS 寫出一致的按鈕樣式
    - BEM 實作一個留言區

  - ### 簡報
    - #### Slide 1：階段目標
      - ##### 第五階段：Tailwind CSS 與 Utility-First 思維
        - 學會使用 `Tailwind CSS` 建構網頁
        - 理解 `Utility-First` 的設計概念
        - 實作實際專案，提升開發效率與維護性

    - #### Slide 2：什麼是 Tailwind CSS？
      - 一套 `Utility-First` 的 CSS 框架
      - 提供大量預設的 class（例如 `bg-blue-500`、`text-center`）
      - 讓你不需寫自訂 CSS 就能快速排版
      - 專注於組合 class，而非編寫樣式

    - #### Slide 3：Tailwind CSS 的優點
      - 高效率開發：快速開發 UI，免寫樣式
      - 可預測性：所有樣式來自 class 名稱
      - 低命名負擔：不用再想 `.card-title`、`.btn-primary` 名稱
      - 良好維護性：多人協作更易閱讀與修改

    - #### Slide 4：Utility-First 的設計哲學
      - 將 UI 元素拆解為最小的功能單元（Utility）
      - 每個 class 負責一個單一功能（如 `margin`、`padding`、`font size`）
      - 使用組合而非覆寫的方式實現樣式
      - 例如：
        ```html
        <div class="p-4 bg-white rounded shadow-md">
          <h1 class="text-lg font-bold text-gray-800">Hello Tailwind</h1>
        </div>
        ```

    - #### Slide 5：Tailwind 的核心概念
      - 原子化 class（Atomic Classes）
      - 響應式設計（sm:、md:、lg: 前綴）
      - 狀態變化（hover:、focus: 等）
      - 自定義主題（使用 tailwind.config.js）
      - 插件與擴充（Typography、Forms、Aspect Ratio 等）

    - #### Slide 6：常用 Utility 範例
      | 類別 | 範例                                 | 說明               |
      | --- | ----------------------------------- | ------------------ |
      | 排版 | `text-xl font-bold`                 | 文字大小與粗體       |
      | 顏色 | `bg-blue-500 text-white`            | 背景與文字色         |
      | 間距 | `p-4 m-2`                           | padding 與 margin   |
      | 排版 | `flex items-center justify-between` | Flexbox            |
      | 邊框 | `border border-gray-300 rounded`    | 加邊框與圓角         |


    - #### Slide 7：實作練習方向
      - 轉換前端元件為 `Tailwind` 語法
      - 重構現有 CSS 為 `Utility-first` 寫法
      - 練習響應式與狀態變化 `class` 的組合應用

    - #### Slide 8：何時使用 Tailwind？
      - ##### 適合：
        - 快速原型製作
        - 與設計稿高度一致的開發
        - 專案規模大、多人開發需求強的情境

      - ##### 不適合：
        - 需嚴格遵循 BEM 或客製化命名規範的團隊

    - #### Slide 9：延伸學習方向
      - 探索 `Tailwind Plugin` 系統
        - 使用 `@apply` 建立元件化 class
        - 搭配 `React`、`Vue`、`Nuxt` 等框架應用
        - 使用 `Tailwind UI` 元件庫加速開發
