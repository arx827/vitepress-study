---
title: CSS
---

# CSS 課程規劃
## 第四階段：CSS 架構與實戰
  - ### 目標
    - 學會寫出模組化、可維護的 CSS
    - 認識命名規範與架構設計

  - ### 學習內容
    - 命名規範（BEM）
    - 分離樣式檔、模組化 SCSS（選用）
    - 使用 CSS 預處理器（如 SCSS）
    - 設計系統概念（spacing、color palette、typography）

  - ### 簡報主題建議
    - 常用的 CSS 樣式設計（顏色、字體、陰影）
    - 偽類（hover、focus）應用
    - transition、transform、animation 動畫基礎
    - CSS 變數與樣式管理

  - ### 範例題材
    - hover 換色按鈕
    - 簡單的滑入動畫區塊
    - 使用 CSS animation 做 loading spinner

  - ### 簡報
    - #### 第四階段簡報主題：CSS 架構與實戰（模組化、維護性、專案應用）
      - ##### 第 1 頁：第四階段目標與概念
        - ##### 階段目標：
          - 瞭解如何組織大型專案的 CSS
          - 增加可維護性與可擴展性
          - 進入元件化開發思維

        - ##### 學習重點：
          - CSS 架構方式（BEM、OOCSS、SMACSS）
          - SCSS / PostCSS 模組化支援
          - 元件導向的設計實踐

      - ##### 第 2 頁：為何需要 CSS 架構？
        - ##### 當專案變大時，常見問題：
          - CSS 命名混亂、樣式互相覆蓋
          - 不知道哪段 CSS 有作用 / 可刪除
          - 同樣功能重複寫好幾次

          > 解法：建立有規則的 CSS 架構與命名規則，讓團隊協作更有效率。

      - ##### 第 3 頁：BEM 命名規則（Block Element Modifier）
        ```css
        /* 範例 */
        .card {}
        .card__title {}
        .card__button {}
        .card__button--primary {}
        ```
        - ##### 優點：
          - 清楚描述結構與狀態
          - 命名一致好管理
          - 可維護性高、避免干擾

      - ##### 第 4 頁：CSS 架構策略簡介
        | 架構名稱     | 核心理念                           | 特點                   |
        | ---------- | --------------------------------- | ---------------------- |
        | **BEM**    | Block-Element-Modifier            | 命名系統清楚，適合大型專案 |
        | **OOCSS**  | Object Oriented CSS               | 抽離樣式與內容，注重重用性 |
        | **SMACSS** | Scalable and Modular Architecture | 分類清楚，模組化強        |

        > 建議小型專案可用 BEM，大型專案可結合 SCSS + SMACSS。

      - ##### 第 5 頁：SCSS 分檔與模組化
        - ##### SCSS 標準目錄範例：
          ```csharp
          styles/
          ├─ base/
          │  ├─ _reset.scss
          │  ├─ _typography.scss
          ├─ components/
          │  ├─ _button.scss
          │  ├─ _card.scss
          ├─ layout/
          │  ├─ _header.scss
          │  ├─ _footer.scss
          ├─ pages/
          │  ├─ _home.scss
          │  ├─ _about.scss
          ├─ main.scss
          ```
          - 使用 `@import`（舊）或 `@use`（新）匯入
          - 維護方便、方便多人開發

      - ##### 第 6 頁：實戰設計思維：元件導向設計（Component-based Design）
        - ##### 每個 UI 元素都當成獨立元件來設計與管理：
          - 按鈕（button）
          - 卡片（card）
          - 表單欄位（input-field）
          - 導覽列（navbar）

          > 建議每個元件擁有專屬的 CSS（或 SCSS）檔案，搭配 BEM 命名。

      - ##### 第 7 頁：避免全域污染的 CSS 技巧
        - 不直接覆寫 `body`、`a`、`p` 等元素樣式
        - 使用命名空間（如 `.app-`）作為前綴
        - 儘量避免 `!important`，以提高可維護性
        - 使用 CSS 層疊順序策略

      - ##### 第 8 頁：整合 CSS 架構到前端框架中
        - ##### `Vue` / `React` 開發中如何整合：
          - 元件中使用 scoped CSS / module CSS
          - 利用變數、mixin、function 提高樣式重用性
          - 配合 CSS-in-JS（如 styled-components / emotion）也可應用同樣的命名與元件思維

      - ##### 第 9 頁：實戰範例：設計一個卡片元件
        ```html
        <div class="card">
          <img class="card__image" src="..." />
          <div class="card__body">
            <h2 class="card__title">標題</h2>
            <p class="card__text">內文段落</p>
            <button class="card__button card__button--primary">更多</button>
          </div>
        </div>
        ```

        ```scss
        .card {
          border-radius: 8px;
          box-shadow: ...;

          &__title { font-size: 1.25rem; }
          &__button--primary { background: blue; color: white; }
        }
        ```

      - ##### 第 10 頁：第四階段總結與建議實作
        - ##### 重點回顧：
          - 避免混亂：建立命名規則（推薦 `BEM`）
          - 模組化管理：使用 `SCSS` 分檔
          - 元件導向：CSS = 每個 UI 元件的外觀定義
          - 搭配框架：與 `Vue`/`React` 結合是趨勢

        - ##### 建議練習：
          - 嘗試使用 BEM 寫一個完整的卡片 UI
          - 用 SCSS 建立一個簡單的樣式目錄架構
          - 在一個實務專案中實踐模組化 CSS
