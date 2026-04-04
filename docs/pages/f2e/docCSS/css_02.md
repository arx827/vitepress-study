---
title: CSS
---

# CSS 課程規劃
## 第二階段：進階排版與布局
  - ### 目標
    - 學會使用 Flexbox 與 Grid
    - 熟悉常見排版技巧與響應式設計

  - ### 學習內容
    - Flexbox（彈性盒排版）
    - 主軸/副軸、`justify-content`、`align-items`、`flex-grow` 等
    - Grid（網格排版）
    - `grid-template-rows` / `columns、gap、auto-fit` 等
    - 媒體查詢（Media Queries）
    - `@media screen and (max-width: 768px) { ... }`
    - `mobile-first` 設計思維
    
  - ### 簡報主題建議
    - 常見的 display 類型介紹
    - Flexbox 說明與常見排版實作
    - Grid Layout 與 auto-fit、repeat 使用
    - position 定位的實務差異

  - ### 範例題材
    - 商品卡片列表（Flex）
    - 圖文兩欄區塊（Grid）
    - 固定置頂的 header（position: sticky）

  - ### 簡報
    - 了解 display 屬性及其行為
    - 熟悉 Flexbox 的一維彈性排版
    - 掌握 Grid 的二維網格系統
    - 會依據情境選擇 Flex 或 Grid

    - #### 結構
      | 頁數 | 主題           | 說明                                                   |
      | -- | ------------ | ---------------------------------------------------- |
      | 1  | 封面           | 單元標題：「CSS 排版與布局」                                     |
      | 2  | display 概念介紹 | 說明 block、inline、inline-block、none、flex、grid 的行為差異    |
      | 3  | Flexbox 是什麼？ | 一維排版系統，常用於卡片/導覽列等                                    |
      | 4  | Flexbox 父層屬性 | `flex-direction`, `justify-content`, `align-items` 等 |
      | 5  | Flexbox 子層屬性 | `flex-grow`, `flex-shrink`, `flex-basis`             |
      | 6  | Grid 是什麼？    | 二維排版，適合頁面區塊與 RWD 多欄設計                                |
      | 7  | Grid 基礎語法    | `grid-template-columns`, `gap` 等                     |
      | 8  | Grid 進階控制    | `grid-column`, `grid-row`, `auto-fit` 等              |
      | 9  | Flex vs Grid | 比較差異與使用時機                                            |
      | 10 | 實作練習         | 練習題與應用場景引導                                           |

      - 第 1 頁：封面
        - 標題： CSS 排版與布局
        - 副標題： 從 display 到 Flexbox 和 Grid
        - 說明： 本單元將深入理解 CSS 如何排列元素、建立現代響應式版型。

      - 第 2 頁：display 屬性概念
        - display 是什麼？
          - 控制元素「如何呈現在版面上」
          - 每個 HTML 元素都有預設 display 行為

        - 常見值：
          | 屬性值          | 說明               |
          | ------------ | ---------------- |
          | block        | 占一整行，常見於 `<div>` |
          | inline       | 不換行，大小取決內容       |
          | inline-block | 像 inline 但可設定寬高  |
          | none         | 不顯示元素            |
          | flex / grid  | 啟用彈性盒 / 網格布局     |

      - 第 3 頁：什麼是 Flexbox？
        Flexbox 是 CSS 的彈性排版方式，適合「一維排列」：
        - 一條主軸，沿橫向或直向排列子元素
        - 超適合卡片列表、導覽列、按鈕列

        - 啟用方式：
          ```css
          .container {
            display: flex;
          }
          ```

        - 重要概念：
          - 主軸（Main Axis）：預設橫向
          - 副軸（Cross Axis）：預設直向

      - 第 4 頁：Flexbox 常用屬性（父容器）
        | 屬性                | 功能                              |
        | ----------------- | ------------------------------- |
        | `flex-direction`  | 決定排列方向：row / column             |
        | `justify-content` | 主軸對齊：start、center、space-between |
        | `align-items`     | 副軸對齊：start、center、stretch       |
        | `flex-wrap`       | 是否換行（預設不換）                      |

        範例：
        ```css
        .container {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
        }
        ```

      - 第 5 頁：Flexbox 子元素屬性
        每個子元素都可以有：
        - flex-grow: 放大比重
        - flex-shrink: 壓縮比重
        - flex-basis: 初始大小
        - flex: 簡寫 grow shrink basis

        範例：
        ```css
        .item {
          flex: 1;
        }
        ```

        > 三個 `.item` 並排平均寬度

      - 第 6 頁：什麼是 Grid？
        Grid 是「二維排版系統」
        - 同時控制行與列
        - 超適合整頁排版、圖文區塊、儀表板

        啟用方式：
        ```css
        .container {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }
        ```

      - 第 7 頁：Grid 常用屬性（父容器）
        | 屬性                      | 功能               |
        | ----------------------- | ---------------- |
        | `grid-template-columns` | 定義幾欄、欄寬（px、%、fr） |
        | `grid-template-rows`    | 定義幾行             |
        | `gap`                   | 行與列的間距           |
        | `grid-auto-flow`        | 自動填充方式           |

        範例：
        ```css
        .container {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        ```

      - 第 8 頁：Grid 子元素位置控制
        | 屬性            | 說明     |
        | ------------- | ------ |
        | `grid-column` | 控制橫向跨欄 |
        | `grid-row`    | 控制縱向跨行 |
        | `place-self`  | 個別對齊方式 |
        | `grid-area`   | 命名區域排版 |

        範例：
        ```css
        .item1 {
          grid-column: 1 / 3;
        }
        ```

        > 橫跨第一、第二欄

      - 第 9 頁：Flex vs Grid 選擇時機
        | Flexbox     | Grid      |
        | ----------- | --------- |
        | 一維排版        | 二維排版      |
        | 排列項目        | 整體區塊布局    |
        | 不固定欄數（flow） | 固定欄與列設計   |
        | RWD 卡片列表    | 雙欄/三欄圖文區塊 |

        > 實務建議：
        > 先用 Grid 規劃整體區塊，再用 Flex 微調區塊內部元件。

      - 第 10 頁：練習與挑戰
        練習題建議：
        - 用 Flexbox 寫一個左右排版的導覽列（LOGO + 選單）
        - 用 Grid 寫出兩欄排版（左：文字，右：圖片）
        - 用 flex: 2 和 flex: 1 寫出 2:1 的寬度比例欄位
        - 使用 grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) 寫出響應式卡片區塊（挑戰題）

      - 範例一：Flex 導覽列
        ```html
        <nav class="navbar">
          <div class="logo">MySite</div>
          <ul class="menu">
            <li>首頁</li>
            <li>關於</li>
            <li>聯絡</li>
          </ul>
        </nav>
        ```

        ```css
        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          background: #eee;
        }
        .menu {
          display: flex;
          gap: 16px;
          list-style: none;
        }
        ```

        用途說明：

        - justify-content: space-between 讓 Logo 和 Menu 分兩邊
        - menu 用 flex 控制橫向排列

      - 範例二：Grid 雙欄圖文區塊
        ```html
        <section class="section">
          <div class="text">這是文字介紹內容</div>
          <div class="image">圖片區塊</div>
        </section>
        ```

        ```css
        .section {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        .text, .image {
          padding: 20px;
          border: 1px solid #ccc;
        }
        ```

        用途說明：

        - grid-template-columns: 1fr 1fr 建立兩欄等寬排版
        - 可加入 @media 做響應式調整

      - 範例三：自動換行卡片列表（Flex + Wrap）
        ```html
        <div class="card-list">
          <div class="card">1</div>
          <div class="card">2</div>
          <div class="card">3</div>
          <div class="card">4</div>
        </div>
        ```
        
        ```css
        .card-list {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }
        .card {
          width: 150px;
          height: 100px;
          background: lightblue;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        ```

        用途說明：

        - 使用 flex-wrap: wrap 自動換行
        - 每張卡片固定寬度，排列自適應空間

  | 階段          | 小作品建議                     |
  | ------------ | ----------------------------- |
  | 基礎          | 做一個履歷頁、個人介紹卡片         |
  | 進階          | 實作商品卡片、RWD 圖文區塊        |
  | Tailwind 階段 | 製作一個部落格首頁 / Admin Panel |


- ### 簡報題目：從純 CSS 到 Tailwind 的開發演進

- ### 實作專案：
  - 個人簡歷頁（純 CSS）
  - 響應式 `Landing Page（Flex/Grid）`
  - `Tailwind Blog` 首頁（文章預覽 + 標籤）