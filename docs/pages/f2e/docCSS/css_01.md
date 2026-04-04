---
title: CSS
---

# CSS 課程規劃
## 第一階段：CSS 基礎（語法、選擇器、排版）
  - ### 目標
    - 熟悉 CSS 語法與基本選擇器
    - 學會控制文字與區塊外觀
    - 掌握盒模型與排版基礎

  - ### 學習內容
    - CSS 基礎語法、註解、引入方式（內嵌、內部、外部）
    - 選擇器（元素、類別、ID、後代、兄弟）
    - 顏色、字體、邊框、內外距（margin / padding）
    - display: block / inline / inline-block / none
    - position: static / relative / absolute / fixed / sticky
    - 盒模型（box model）
    - box-sizing、overflow、z-index

  - ### 簡報主題建議
    - CSS 是什麼？它的角色與運作方式
    - 如何將 CSS 加入 HTML
    - 各種選擇器介紹與優先順序
    - 盒模型與 box-sizing 說明

  - ### 範例題材
    - HTML + CSS 個人介紹卡片
    - 比較不同選擇器（類別 vs ID vs 標籤）
    - 改變文字顏色、背景、邊框

  - ### 簡報
    - 知道 CSS 是什麼、如何引入
    - 熟悉 CSS 基本語法格式
    - 掌握常見選擇器（元素、類別、ID、群組、巢狀）
    - 了解 CSS 優先順序（Specificity）
    - 認識盒模型（Box Model）

    - #### 結構
      頁數	主題	說明
      - 1	封面
        單元標題：「CSS 基礎語法與選擇器」
        - 標題： CSS 基礎語法與選擇器
        - 副標題： 從零開始學會控制網頁外觀
        - 說明： 本單元將學會如何使用 CSS 美化 HTML 元素，掌握常見選擇器與盒模型概念。

      - 2	CSS 是什麼？
        簡介 CSS 的作用與用途，與 HTML、JS 的關係
        - 什麼是 CSS？
          - CSS 全名：Cascading Style Sheets（階層樣式表）
          - 用來「美化」HTML 結構，控制外觀與排版
          - 和 HTML 負責內容、JS 負責互動互補
        - 應用舉例：
          - 設定文字大小、顏色
          - 改變版面排列方式
          - 加陰影、動畫、響應式設計

      - 3	如何使用 CSS？
        介紹三種寫法：行內、內部、外部
        - 三種使用方式：
          - 行內樣式：
            ```html
            <h1 style="color: red;">標題</h1>
            ```
          - 內部樣式表：
            ```html
            <style>
              h1 { color: red; }
            </style>
            ```
          - 外部樣式表（最佳實踐）：
            ```html
            <link rel="stylesheet" href="style.css" />
            ```

      - 4	CSS 語法結構
        屬性 / 值，冒號與分號的語法規則
        - 基本語法：
          ```css
          選擇器 {
            屬性: 值;
            屬性: 值;
          }
          ```
        - 範例：
          ```css
          p {
            color: blue;
            font-size: 16px;
          }
          ```

        - 語法重點：
          - 冒號 : 用來連接屬性與值
          - 每行以分號 ; 結尾
          - 花括號包住所有樣式

      - 5	常見 CSS 選擇器
        元素、class、ID、群組、多層選擇
        | 選擇器    | 說明                | 範例             |
        | ------ | ----------------- | -------------- |
        | 元素選擇器  | 直接選 HTML 元素       | `p {}`         |
        | 類別選擇器  | 用 `.className` 選取 | `.card {}`     |
        | ID 選擇器 | 用 `#idName` 選取    | `#header {}`   |
        | 群組選擇器  | 多個元素一起選           | `h1, h2, p {}` |

      - 6	進階選擇器應用
        子選擇器、後代選擇器、兄弟選擇器
        | 選擇器   | 說明         | 範例             |
        | ----- | ---------- | -------------- |
        | 後代選擇器 | 選取巢狀中的子元素  | `.card p {}`   |
        | 子選擇器  | 僅選直系子元素    | `.card > p {}` |
        | 相鄰兄弟  | 同層下一個元素    | `h1 + p {}`    |
        | 所有兄弟  | 選取所有同層之後元素 | `h1 ~ p {}`    |

      - 7	樣式衝突與優先順序
        說明 specificity 計算方式與 !important
        - 樣式衝突與優先順序
          - 優先順序（Specificity）規則：
            | 選擇器    | 分數  |
            | ------ | --- |
            | 元素選擇器  | 1   |
            | 類別選擇器  | 10  |
            | ID 選擇器 | 100 |
          - 注意事項：
            - ID > Class > Element
            - !important 可強制套用（不建議常用）
            - 越後面寫的規則也可能覆蓋前面（若優先順序相同）

      - 8	CSS 盒模型介紹
        content / padding / border / margin 說明
        - 盒模型四層結構：
          ```css
          [ margin ]
            [ border ]
              [ padding ]
                [ content ]
          ```
        - 屬性：
          - margin：元素與外部距離
          - border：邊框
          - padding：內容與邊框間距
          - content：實際文字或圖片區域
      
        - box-sizing: border-box
          - 讓 padding 和 border 包含在 width 高度內

      - 9	整合範例：卡片樣式
        結合語法與選擇器製作一個卡片 UI
        ```html
        <div class="card">
          <h2>商品標題</h2>
          <p class="price">$99</p>
          <button>加入購物車</button>
        </div>
        ```

        ```css
        .card {
          border: 1px solid #ccc;
          padding: 16px;
          margin: 16px;
        }
        .price {
          color: green;
          font-weight: bold;
        }
        ```

        這個範例整合：
        - class 選擇器
        - margin/padding
        - 邊框與文字樣式

      - 10 課後練習與互動
        引導實作，或附上 CodePen 練習網址
        
        練習題：
        - 1. 使用 CSS 把 `<h1>` 文字改為紅色並加底線。
        - 2. 撰寫一段樣式讓 .card .btn 背景變藍色。
        - 3. 解釋 .wrapper p 和 .wrapper > p 差異。
        - 4. 哪個優先順序最高？
            - `#title`
            - `.title`
            - `h1`

    - #### 搭配範例設計（共 3 個）
      - ##### 範例 1：HTML + CSS 基礎樣式
        ```html
        <h1>我的第一個標題</h1>
        <p class="intro">這是一段簡單的段落。</p>
        ```

        ```css
        h1 {
          color: blue;
          font-size: 24px;
        }
        .intro {
          color: gray;
          line-height: 1.5;
        }
        ```

      - ##### 範例 2：選擇器應用卡片
        ```html
        <div class="card">
          <h2 class="title">商品名稱</h2>
          <p class="price">$100</p>
          <button class="buy-btn">立即購買</button>
        </div>
        ```

        ```css
        .card {
          border: 1px solid #ccc;
          padding: 16px;
        }
        .card .title {
          font-weight: bold;
        }
        .card .price {
          color: green;
        }
        .card .buy-btn {
          background-color: blue;
          color: white;
        }
        ```

      - ##### 範例 3：盒模型視覺化
        ```html
        <div class="box">Box</div>
        ```

        ```css
        .box {
          padding: 20px;
          border: 5px solid red;
          margin: 15px;
          background-color: lightyellow;
        }
        ```

        > 搭配圖解介紹 content / padding / border / margin 的結構
    
    - #### 練習題（可做為簡報最後一頁）
      - 請寫出一段 CSS，讓 `<h1>` 文字變紅色，並加底線。
      - 試著讓 .card 底下的 .buy-btn 背景變黑色、文字白色。
      - 請解釋以下選擇器差異：.a b vs .a > b
      - 請問以下哪個選擇器優先順序最高？
        - #btn
        - .btn
        - button
        - .wrapper .btn

