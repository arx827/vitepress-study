---
title: '[React官網] React 19.2 教學文件'
---

# 你的第一個組件
  組件是 `React` 的核心概念之一。它們是建構使用者介面（UI）的基礎，是你開始 `React` 之旅的最佳起點！

  :::info 你將學到
  - 什麼是組件
  - 組件在 React 應用中扮演的角色
  - 如何編寫你的第一個 React 組件
  :::

## 組件：UI 構成要素
  在 `Web` 當中，`HTML` 允許我們使用其內建的標籤集（如 `<h1>` 和 `<li>`）創建豐富的結構化文件。

  ```html
  <article>
    <h1>我的第一个组件</h1>
    <ol>
      <li>组件：UI 构成要素</li>
      <li>定义组件</li>
      <li>使用组件</li>
    </ol>
  </article>
  ```

  我們在網頁上看到的每一個 `UI` 模組（例如側邊欄、大頭貼、強制回應視窗、下拉選單），背後都是結合了`結構（HTML）`、`樣式（CSS）`和`互動（JavaScript）`的標籤。

  `React` 允許你將標籤、`CSS` 和 `JavaScript` 組合成本地端的自訂「組件」，即應用程式中可複用的 `UI` 元素。

  特性：就像使用 `HTML` 標籤一樣，你可以組合、排序和嵌套組件來繪製整個頁面。

  生態圈：隨著專案發展，你可以複用自己完成的組件來加快開發，也可以直接使用開源社群分享的大量組件庫（例如 [Chakra UI](https://chakra-ui.com/) 和 [Material UI](https://material-ui.com/)）。

## 定義組件
  `React` 重視互動性，其核心處理方式為：`React` 組件是一段可以使用標籤進行擴充的 `JavaScript` 函數。

  以下是建構組件的三個步驟：

  - ### 第一步：導出組件
    使用 `export default` 前綴。這是一種 `JavaScript` 標準語法（非 `React` 獨有），允許你導出一個檔案中的主要函數，以便日後可以從其他檔案引入它。

  - ### 第二步：定義函數
    使用 `function Profile() { }` 定義名為 `Profile` 的 `JavaScript` 函數。

  - ### 第三步：添加標籤
    函數返回的 `<img />` 等標籤看起來像 `HTML`，但實際上是 `JavaScript`！這種語法被稱為 `JSX`，它允許你在 `JavaScript` 中嵌入標籤。

  如果返回語句全寫在同一行，可以直接編寫。

  如果標籤和 `return` 關鍵字不在同一行，則必須把它包裹在一對括號 `( )` 當中。

  ```jsx
  export default function Profile() {
    return (
      <img
        src="https://react.dev/images/docs/scientists/MK3eW3Am.jpg"
        alt="Katherine Johnson"
      />
    )
  }
  ```

## 使用組件
  現在你已經定義了 `Profile` 組件，你可以在其他組件中使用它（將其視為自訂標籤 `<Profile />` 來調用）。例如，一個導出的 `Gallery` 組件中可以使用多個 `<Profile />`：

  ```jsx
  function Profile() {
    return (
      <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
    );
  }

  export default function Gallery() {
    return (
      <section>
        <h1>了不起的科學家</h1>
        <Profile />
        <Profile />
        <Profile />
      </section>
    );
  }
  ```

## 瀏覽器所看到的
  - `<section>` 是小寫的，`React` 知道指的是標準 `HTML` 標籤。
  - `<Profile />` 以大寫 `P` 開頭，`React` 知道想要使用自訂組件。

  瀏覽器最後接收到的會是解開後的純 `HTML` 結構（包含三個 `<img />`）。

  ```html
  <section>
    <h1>了不起的科學家</h1>
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
    <img src="https://react.dev/images/docs/scientists/MK3eW3As.jpg" alt="Katherine Johnson" />
  </section>
  ```

## 嵌套和組織組件
  當組件相對較小或彼此緊密相關時，可以將多個組件保存在同一份檔案中；如果檔案變得臃腫，也可以隨時將組件拆分到個別的檔案中。

  因為 `Profile` 在 `Gallery` 當中渲染，我們可以稱 `Gallery` 為父組件，而 `Profile` 為其子組件。你可以只定義組件一次，然後按需多處和多次使用。

  :::info 萬物皆組件（Components All the Way Down）
  你的 `React` 應用程式是從一個「`根（Root）`」組件開始掛載的（例如常見的 `App.js` 或 `index.js`）。

  在 `React` 應用中，大到整個頁面、側邊欄、列表，小到一個按鈕，全部都可以拆解為組件。基於 `React` 的現代框架（如 `Next.js`）甚至會根據 `React` 組件在伺服器端自動生成 `HTML`，讓網頁在 `JavaScript` 載入完成前就能呈現內容。當然，你也可以只在現有網頁的某個小區塊中引入 `React` 來增加互動性。
  :::

## 重點複習（Recap）
  - `React` 允許你創建組件，即應用程式的可複用 `UI` 元素。
  - 在 `React` 應用程式中，每一個 `UI` 模組都是一個組件。
  - `React` 組件是常規的 `JavaScript` 函數，但具備以下兩個特殊點：
    - 它們的名字總是以大寫字母開頭。
    - 它們返回 `JSX` 標籤。

## 挑戰（Challenges）
  - #### 1. 導出組件
    - ##### 錯誤原因
      根組件沒有加上導出關鍵字。

    - ##### 修復方式
      在主要函數前加上 `export default function Profile() { ... }`。

  - #### 2. 修復返回語句
    - ##### 錯誤原因
      `return` 與標籤分行且沒有用括號包裹，導致其下的代碼被忽略。

    - ##### 修復方式
      - 移到同一行：`return <img ... />`
      - 使用括號：`return ( <img ... /> );`

  - #### 3. 發現錯誤
    - ##### 錯誤原因
      組件函數名 `profile` 及其調用標籤 `<profile />` 誤用了小寫字母。

    - ##### 修復方式
      將其全數改為大寫開頭的 `Profile` 與 `<Profile />`。

  - #### 4. 客製化組件
    範例答案：
    ```jsx
    export default function Congratulations() {
      return (
        <h1>幹得漂亮！</h1>
      );
    }
    ```