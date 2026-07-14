---
title: '[React官網] React 19.2 教學文件'
---

# 在 JSX 中通過大括號使用 JavaScript
  `JSX` 允許你在 `JavaScript` 中編寫類似 `HTML` 的標籤，從而使渲染的邏輯和內容可以寫在一起。
  有時候，你可能想要在標籤中添加一些 `JavaScript` 邏輯或者引用動態的屬性。這種狀況下，你可以在 `JSX` 的大括號內來編寫 `JavaScript`。

  :::info 你將學到
  - 如何使用引號傳遞字串
  - 在 `JSX` 的大括號內引用 `JavaScript` 變數
  - 在 `JSX` 的大括號內調用 `JavaScript` 函數
  - 在 `JSX` 的大括號內使用 `JavaScript` 物件
  :::

## 使用引號傳遞字串
  當你想把一個 `純字串` 屬性傳遞給 `JSX` 時，把它放到單引號或雙引號中：
  ```jsx
  <img className="avatar" src="https://example.com/pic.jpg" alt="Zara" />
  ```

  這裡的 `"https://example.com/pic.jpg"` 和 `"Zara"` 就是被作為字串傳遞的。

  但如果你想要動態地指定 `src` 或 `alt` 的值，你可以用 `{` 和 `}` 替代 `"` 和 `"` 以使用 `JavaScript` 變數：
  ```jsx
  <img className="avatar" src={avatar} alt={description} />
  ```

  - #### 差別對比
    `className="avatar"` 指定了一個就叫 `"avatar"` 的靜態 `CSS` 類名；
    而 `src={avatar}` 這種寫法會去讀取 `JavaScript` 中 `avatar` 這個變數的動態值。
    大括號能讓你直接在標籤中使用 `JavaScript`！

## 使用大括號：一扇進入 JavaScript 世界的窗戶
  大括號 `{ }` 內可以執行任何有效的 `JavaScript` 表達式。

  - #### 1. 嵌入變數
    ```jsx
    <h1>{name}的待辦事項列表</h1>
    ```

  - #### 2. 調用函數
    大括號內的任何 `JavaScript` 表達式都能正常運作，包括函數調用：
    ```jsx
    <h1>To Do List for {formatDate(today)}</h1>
    ```

  - ### 可以在哪裡使用大括號
    在 `JSX` 中，只能在以下兩種場景中使用大括號：

    - #### 用作 JSX 標籤內的「文字」
      例如 `<h1>{name}'s To Do List</h1>` 是有效的（但 `<{tag}>` 這樣用作標籤名是無效的）。

    - #### 用作緊跟在 = 符號後的「屬性」值
      例如 `src={avatar}` 會讀取變數；但是若寫成 `src="{avatar}"`，則只會傳遞一個字面意思為 `"{avatar}"` 的字串。

## 使用「雙大括號」：JSX 中的 CSS 和 物件
  除了字串和數字，你甚至可以在 `JSX` 中傳遞物件。物件在 `JavaScript` 中也用大括號表示，例如 `{ color: 'pink' }`。
  因此，為了能在 `JSX` 屬性中傳遞物件，你必須用另一對外層的大括號包裹該物件：
  ```jsx
  style={{ color: 'pink' }}
  ```

  這在內聯 CSS 樣式（`Inline Styles`）中非常常見。`React` 不強制要求你使用內聯樣式，但當需要時，你可以給 `style` 屬性傳遞一個物件：
  ```jsx
  <ul style={{
    backgroundColor: 'black',
    color: 'pink'
  }}>
  ```

## JavaScript 物件和大括號的更多可能
  你可以將多個表達式合併到一個物件中，並在 JSX 的大括號內分別讀取它們：
  ```jsx
  const person = {
    name: 'Gregorio Y. Zara',
    theme: {
      backgroundColor: 'black',
      color: 'pink'
    }
  };

  // 在組件中使用：
  <div style={person.theme}>
    <h1>{person.name}的待辦事項</h1>
  </div>
  ```
  
  `JSX` 是一種模板語言的最小實現，因為它允許你直接通過 `JavaScript` 來靈活組織數據和邏輯。

## 重點複習（Recap）
  - `JSX` 引號內的值會作為「靜態字串」傳遞給屬性。
  - 大括號 `{}` 讓你可以將 `JavaScript` 的邏輯和變數帶入到標籤中。
  - 大括號只能在 `JSX` 標籤的「內容文字區域」或緊隨屬性的「= 符號後」起作用。
  - `{ {` 和 `} }` 並不是什麼特殊語法：它只是包在 `JSX` 大括號內部的 `JavaScript` 物件（如 style）。

## 挑戰（Challenges）
  - #### 1. 修復錯誤
    ```jsx
    const person = {
      name: 'Gregorio Y. Zara',
      theme: {
        backgroundColor: 'black',
        color: 'pink'
      }
    };
    ```
    - ##### 錯誤原因
      `<h1>{person}'s Todos</h1>` 嘗試直接把整個 `person` 物件渲染在標籤內作為文字，這會觸發 Objects are not valid as a React child 的崩潰。

    - ##### 修復方式
      將其替換為讀取物件的字串屬性：`<h1>{person.name}'s Todos</h1>`。

  - #### 2. 提取信息到物件中
    - ##### 修復方式
      在 `person` 物件中加入 `imageUrl` 欄位，然後在 `<img>` 的 `src` 中以大括號引用：
      ```jsx
      const person = {
        name: 'Gregorio Y. Zara',
        imageUrl: "https://react.dev/images/docs/scientists/7vQD0fPs.jpg",
        // ...
      };

      // JSX 中調用：
      <img src={person.imageUrl} alt={person.name} />
      ```

  - #### 3. 在 JSX 大括號內編寫表達式
    - ##### 錯誤原因
      `src="{baseUrl}{person.imageId}{person.imageSize}.jpg"` 被當成了純字串。

    - ##### 修復方式
      改用大括號並用 + 運算子串接字串，或者使用封裝函數：
      ```jsx
      src={baseUrl + person.imageId + person.imageSize + '.jpg'}
      ```