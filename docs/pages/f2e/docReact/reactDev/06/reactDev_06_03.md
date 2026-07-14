---
title: '[React官網] React 19.2 教程'
---

# 渲染和提交
  組件顯示到螢幕之前，必須被 `React` 渲染。理解這些處理步驟將幫助你思考程式碼的執行過程，並能解釋其行為。

  :::info 你將學到
  - 在 `React` 中「`渲染`」的含意是什麼
  - 為什麼以及什麼時候 `React` 會渲染一個組件
  - 在螢幕上顯示組件所涉及的步驟
  - 為什麼渲染並不一定會導致 `DOM` 更新
  :::

  想像一下，你的組件是廚房裡的廚師，把食材烹調成美味的佳餚。在這種場景下，`React` 就是一名服務生，他會幫客戶們點單，並為他們送來所點的菜餚。
  這種請求和提供 UI 的過程總共包括三個步驟：
  1. `觸發（Trigger）` 一次渲染（把客人的點單送到廚房）
  2. `渲染（Render）` 組件（在廚房準備訂單）
  3. `提交（Commit）` 到 DOM（將菜餚端到桌子上）

## 步驟 1: 觸發一次渲染
  有兩種原因會導致組件的渲染：
  1. `組件的 初次（首次）渲染`。
  2. `組件（或者其祖先組件之一）的 State（狀態）發生了改變`。

  - ### 初次渲染
    當應用程式（App）啟動時，會觸發初次渲染。框架和沙箱有時會隱藏這部分程式碼，但它是透過呼叫 `createRoot` 方法並傳入目標 `DOM` 節點，然後用你的組件呼叫 `render` 函式來完成的：

    ```jsx
    import Image from './Image.js';
    import { createRoot } from 'react-dom/client';

    const root = createRoot(document.getElementById('root'))
    root.render(<Image />);
    ```

  - ### State 更新時重新渲染（Re-render）
    一旦組件被初次渲染，你就可以透過使用 [set 函式](https://zh-hans.react.dev/reference/react/useState#setstate) 更新其 `State` 來觸發之後的渲染。更新組件的 `State` 會自動將下一次渲染送入佇列（Queue）。（你可以把這種情況想像成餐廳客人在第一次點單之後，又追加點了茶、點心等東西。）

## 步驟 2: React 渲染你的組件
  在你觸發渲染後，`React` 會呼叫你的組件來確定要在螢幕上顯示的內容。`「渲染中」`即代表 `React` 正在呼叫你的組件。

  - `在進行初次渲染時`， React 會呼叫 `根組件（Root component）`。
  - `對於後續的渲染`， React 會呼叫內部因 `State` 更新而觸發了渲染的該個 `功能組件（Function component）`。

  這個過程是 `遞迴（Recursive）`的：如果更新後的組件回傳了另一個組件，那麼 `React` 接下來就會渲染那個組件；
  而如果那個組件又回傳了某個組件，`React` 就會再渲染那個組件，以此類推。
  這個過程會持續下去，直到沒有更多巢狀組件，且 `React` 確切知道哪些東西應該顯示在螢幕上為止。

  ```jsx
  export default function Gallery() {
    return (
      <section>
        <h1>鼓舞人心的雕塑</h1>
        <Image />
        <Image />
        <Image />
      </section>
    );
  }

  function Image() {
    return (
      <img
        src="https://react.dev/images/docs/scientists/ZF6s192.jpg"
        alt="'Floralis Genérica' by Eduardo Catalano: a gigantic metallic flower sculpture with reflective petals"
      />
    );
  }
  ```

  - 在初次渲染中， `React` 會為 `<section>`、`<h1>` 和三個 `<img>` 標籤建立 DOM 節點。
  - 在重新渲染過程中， `React` 將計算它們的哪些屬性（`Props`/`Attributes`，如果有變動的話）自上次渲染以來發生了變更。在下一個步驟（提交階段）之前，它不會對這些資訊執行任何 `DOM` 操作。

  :::info 陷阱
  渲染必須始終是 [一次純粹的計算](/pages/f2e/docReact/reactDev/05/reactDev_05_08.html)（Pure calculation）：
  - ###### 輸入相同，輸出相同
    給定相同的輸入（`Props`/`State`/`Context`），組件應始終回傳相同的 `JSX`。（當有人點了蕃茄沙拉時，他們不應該收到洋蔥沙拉！）

  - ###### 只做它自己的事情
    它不應變更任何存在於渲染之前的物件或變數。（一個訂單不應該更動到其他任何人的訂單，即不可產生 `副作用 Side Effects`。）

  否則，隨著專案複雜度增加，你可能會遇到令人困惑的 `Bug` 和不可預測的行為。在 `「嚴格模式（Strict Mode）」` 下開發時，`React` 會呼叫每個組件的函式兩次，這可以幫助你提早發現由 `不純函式（Impure functions）` 引起的錯誤。
  :::

## 步驟 3: React 把變更提交到 DOM 上
  在渲染（呼叫）你的組件之後，`React` 將會修改 `DOM`。
  - `對於初次渲染`，`React` 會使用 [appendChild()](https://developer.mozilla.org/docs/Web/API/Node/appendChild) DOM API 將其建立的所有 `DOM` 節點放上螢幕。
  - `對於重新渲染`，`React` 將應用最少程度的必要操作（在步驟 2 渲染時計算出來的差異），以使得實際的 `DOM` 與最新的渲染輸出相互匹配。

  `React` 僅在渲染之間存在 `差異（Diff）` 時才會變更 `DOM` 節點。
  例如，有一個組件每秒會接收到來自父組件傳下來的不同 `time` 屬性（`Prop`）並進行重新渲染。
  此時，如果你在 `<input>` 欄位中輸入一些文字，文字不會因為組件每秒重新渲染而消失：

  ```jsx
  export default function Clock({ time }) {
    return (
      <>
        <h1>{time}</h1>
        <input /> {/* 即使外層每秒重繪，你在 input 輸入的內容依然會被保留 */}
      </>
    );
  }
  ```

  這個例子之所以能正常運作，是因為在最後的提交步驟中，`React` 只會更新內容有變動的 `<h1>` 標籤。
  它發現 `<input>` 標籤出現在 `JSX` 中的位置與上次完全相同，因此 `React` 根本不會去觸碰或修改這個 `<input>` 標籤及其 `value`！

## 尾聲：瀏覽器繪製（Paint）
  在渲染完成並且 `React` 更新 `DOM` 之後，瀏覽器就會重新繪製（Repaint）螢幕。
  儘管這個過程在瀏覽器底層通常被稱為 `「瀏覽器渲染（Browser rendering）」`，但我們在 `React` 文件中還是將它稱為 `「繪製（Painting）」`，以避免與 `React` 自身的 `組件渲染（Rendering）` 概念產生混淆。

## 重點複習（Recap）
  - 在一個 `React` 應用程式中，每次的螢幕更新都會經歷以下三個步驟：
    - 觸發（Trigger）
    - 渲染（Render）
    - 提交（Commit）

  - 你可以使用 `嚴格模式（Strict Mode）` 來找出組件中不小心的副作用與錯誤。
  - 如果本次渲染的虛擬結果與上次完全一樣，那麼 `React` 將不會對 `DOM` 進行任何修改。