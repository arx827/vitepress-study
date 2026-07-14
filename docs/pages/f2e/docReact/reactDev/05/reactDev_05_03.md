---
title: '[React官網] React 19.2 教程'
---

# 使用 JSX 書寫標籤語言
  `JSX` 是 `JavaScript` 語法擴充，可以讓你在 `JavaScript` 檔案中書寫類似 `HTML` 的標籤。
  雖然還有其它方式可以編寫組件，但大部分 `React` 開發者更喜歡 `JSX` 的簡潔性，並且在大部分代碼庫中使用它。

  :::info 你將學到
  - 為什麼 `React` 將標籤和渲染邏輯耦合在一起
  - `JSX` 與 `HTML` 有什麼區別
  - 如何通過 `JSX` 展示信息
  :::

## JSX: 將標籤引入 JavaScript
  傳統的 `Web` 開發者都是將網頁內容存放在 `HTML` 中，樣式放在 `CSS` 中，而邏輯則單獨存放在 `JavaScript` 文件中。

  但隨著 `Web` 的交互性越來越強，`JavaScript` 控制著 `HTML` 的內容。這也是為什麼在 `React` 中，渲染邏輯和標籤共同存在於同一個地方——組件。

  - #### 同步與安全
    將一個按鈕的渲染邏輯和標籤放在一起，可以確保它們在每次編輯時都能保持互相同步。反之，彼此無關的細節是互相隔離的（例如按鈕的標籤和側邊欄的標籤），這使得修改組件時更加安全。

  - #### 嚴格與動態
    `JSX` 看起來和 `HTML` 很像，但它的語法更加嚴格並且可以動態展示信息。

## 將 HTML 轉化為 JSX
  如果直接將完全有效的 `HTML` 標籤（如未閉合的 `<img>` 或 `<li>`）複製到 `React` 組件的 `return` 中，程式並不能正常工作。
  這是因為 `JSX` 語法更加嚴格，並且相比 `HTML` 有更多的規則。

## JSX 規則
  - ### 1. 只能返回一個根元素
    如果想要在一個組件中包含多個元素，需要用一個父標籤把它們包裹起來。

    - 可以使用一個外層 `<div>` 標籤包裹。

    - 如果不想在標籤中增加一個額外的 `<div>` 節點，可以用空標籤 `<>` 和 `</>`（被稱作 `Fragment`）來代替，它允許你將子元素分組而不會在 `HTML` 結構中添加額外節點。

    :::info 為什麼多個 JSX 標籤需要被一個父元素包裹？
    `JSX` 雖然看起來很像 `HTML`，但在底層其實被轉化為了 `JavaScript` 物件。你不能在一個函數中返回多個物件，除非用一個陣列把他們包裝起來。這就是為什麼多個 `JSX` 標籤必須要用一個父元素或者 `Fragment` 來包裹。
    :::

  - ### 2. 標籤必須閉合
    `JSX` 要求標籤必須正確閉合。

    - 像 `<img>` 這樣的自閉合標籤必須書寫成 `<img />`。

    - 像 `<li>oranges` 這樣只有開始標籤的元素必須帶有閉合標籤，改為 `<li>oranges</li>`。

  - ### 3. 使用駝峰式命名法（camelCase）給大部分屬性命名
    `JSX` 最終會被轉化為 `JavaScript`，而 `JSX` 中的屬性也會變成 `JavaScript` 物件中的鍵值對（`Key-Value pairs`）。
    由於 `JavaScript` 對變數命名有限制（例如不能包含 `-` 符號或保留字），因此在 `React` 中，大部分 `HTML` 和 `SVG` 屬性都用駝峰式命名法表示。

    - 例如：使用 `strokeWidth` 代替 `stroke-width`。

    - 例如：由於 `class` 是 `JavaScript` 的保留字，在 `React` 中需要用 `className` 來代替。

  - ### 進階提示：使用 JSX 轉化器
    手動轉化現有 `HTML` 的屬性到 `JSX` 格式很繁瑣。建議在實務上使用線上轉換工具（如 `transform.tools/html-to-jsx`）將 `HTML` 和 `SVG` 標籤快速轉化為 `JSX`。

## 重點複習（Recap）
  - 由於渲染邏輯和標籤緊密相關，`React` 將它們存放在同一個組件中。
  - `JSX` 類似 `HTML`，不過有一些語法區別（`單一根元素`、`標籤閉合`、`駝峰命名`）。
  - 當編寫出錯時，`React` 的錯誤提示通常會指引你將標籤修改為正確的格式。

## 課後挑戰：將 HTML 轉化為 JSX
  ```jsx
  export default function Bio() {
    return (
      <div class="intro">
        <h1>欢迎来到我的站点！</h1>
      </div>
      <p class="summary">
        你可以在这里了解我的想法。
        <br><br>
        <b>还有科学家们的<i>照片</b></i>！
      </p>
    );
  }
  ```

  - #### 錯誤程式碼特性
    直接包含了兩個並列根元素、使用了 `class` 屬性、以及 `<br>` 標籤未閉合。

  - #### 正確修復後的 JSX 解答：
    ```jsx
    export default function Bio() {
      return (
        <div>
          <div className="intro">
            <h1>歡迎來到我的站點！</h1>
          </div>
          <p className="summary">
            你可以在這裡了解我的想法。
            <br /><br />
            <b>還有科學家們的<i>照片</i></b>！
          </p>
        </div>
      );
    }
    ```