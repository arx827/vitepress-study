---
title: CSS
---

# CSS 課程規劃
## 第三階段：美化與互動
  - ### 目標
    - 增加互動效果與美觀設計
    - 掌握 CSS 動畫與過渡效果

  - ### 學習內容
    - hover、active、focus 狀態樣式
    - transition、transform、animation
    - 自訂變數（CSS Variables）
    - 圓角、陰影、透明度、背景漸層
    - 文字效果（line-clamp、多行省略）

  - ### 簡報主題建議
    - 響應式網站的概念與重要性
    - @media 基礎語法
    - mobile-first 與 desktop-first 比較
    - 使用百分比、vw/vh、rem 做尺寸控制

  - ### 範例題材
    - 響應式導覽列（小螢幕下變成漢堡選單）
    - 三欄排版在手機變單欄

  - ### 簡報
    - #### 第三階段簡報主題：響應式設計與媒體查詢（Responsive Design & Media Queries）
      - ##### 第 1 頁：什麼是響應式設計（Responsive Design）
        - ##### 定義：
          讓網站畫面能根據不同裝置（手機、平板、桌機）自動調整版面與樣式。

        - ##### 目的：
          - 增強使用者體驗（UX）
          - 支援多裝置瀏覽
          - 提升 SEO 與行動裝置友善度

      - ##### 第 2 頁：媒體查詢（Media Queries）是什麼？
        `Media Query` 是一種 CSS 技術，可以根據不同的螢幕條件套用不同樣式。
        ```css
        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }
        }
        ```

        - 條件可以是：
          - 螢幕寬度（width / max-width / min-width）
          - 裝置類型（screen / print）
          - 解像度、方向（landscape / portrait）

      - ##### 第 3 頁：Mobile First 與 Desktop First
        | 策略           | 寫法說明                      |
        |----------------|---------------------------|
        | Mobile First ✅ | 先寫手機版，再針對大螢幕做擴充 |
        | Desktop First  | 先寫桌機版，再針對小螢幕做調整 |

        ```css
        /* Mobile First */
        .container {
          flex-direction: column;
        }
        @media (min-width: 768px) {
          .container {
            flex-direction: row;
          }
        }
        ```

      - ##### 第 4 頁：常見的 Media Query 寬度範圍
        | 裝置類型    | 寬度範圍       |
        |-----------|----------------|
        | 手機        | 0 – 767px      |
        | 平板        | 768px – 1023px |
        | 筆電 / 桌機 | 1024px – ∞     |

        > 建議使用 min-width 撰寫 media query，利於 mobile-first 開發。

      - ##### 第 5 頁：使用百分比與彈性單位
        為了讓版面「有彈性」，推薦使用：
        - `%`：相對父元素大小
        - `vw / vh`：相對螢幕寬度 / 高度
        - `em / rem`：相對字體大小
        - `max-width`: 100%：避免圖片爆版

      - ##### 第 6 頁：範例：圖片 RWD 寫法
        ```css
        img {
          max-width: 100%;
          height: auto;
        }
        ```

        > 圖片會自動縮放，不會超出容器寬度。

      - ##### 第 7 頁：範例：三欄變一欄（Flexbox）
        ```css
        .cards {
          display: flex;
          gap: 1rem;
        }
        .card {
          flex: 1;
        }

        @media (max-width: 768px) {
          .cards {
            flex-direction: column;
          }
        }
        ```

        > 在手機上變成單欄排版，畫面更友善。

      - ##### 第 8 頁：常見 RWD 元件設計
        - 響應式導覽列（Menu）
        - 圖文左右排 → 上下排
        - 卡片、產品列表變單欄
        - 表格捲動或轉為清單顯示

      - ##### 第 9 頁：進階技巧（搭配 JS 或框架）
        - toggle 顯示隱藏菜單（配合漢堡 icon）
        - 使用 CSS clamp() 動態字體大小
        - 使用框架（如 Tailwind / Bootstrap）內建 RWD 工具

      - ##### 第 10 頁：總結與建議實作練習
        - ##### 重點整理：
          - 響應式設計可提升 UX、SEO
          - 建議 Mobile First 為主
          - 熟悉 Media Query 的條件與單位

        - ##### 建議練習：
          - 製作一個三欄卡片在手機變單欄
          - 嘗試實作一個響應式 Navbar
          - 用不同單位嘗試做排版尺寸控制

