---
title: '[React官網] React 19.2 教程'
---

# state：組件的記憶
  組件通常需要根據互動變更螢幕上顯示的內容。輸入表單應該更新輸入欄位，點擊輪播圖上的「下一個」應該變更顯示的圖片，點擊「購買」應該將商品放入購物車。組件需要「記住」某些東西：目前輸入值、目前圖片、購物車。在 `React` 中，這種組件特有的記憶被稱為 `state`。

  :::info 你將學到
  - 如何使用 `useState` Hook 添加 `state` 變數
  - `useState` Hook 回傳哪一對值
  - 如何添加多個 `state` 變數
  - 為什麼 `state` 被稱作是區域（局部）的
  :::

## 當普通的變數無法滿足時
  以下是一個渲染雕塑圖片的組件。點擊 「`Next`」 按鈕應該顯示下一個雕塑並將 `index` 變更為 `1`，再次點擊又變更為 `2`，以此類推。但這個組件現在不起作用：
  
  ```jsx
  import { sculptureList } from './data.js';

  export default function Gallery() {
    let index = 0;

    function handleClick() {
      index = index + 1;
    }

    let sculpture = sculptureList[index];
    return (
      <>
        <button onClick={handleClick}>
          Next
        </button>
        <h2>
          <i>{sculpture.name} </i>
          by {sculpture.artist}
        </h2>
        <h3>
          ({index + 1} of {sculptureList.length})
        </h3>
        <img
          src={sculpture.url}
          alt={sculpture.alt}
        />
        <p>
          {sculpture.description}
        </p>
      </>
    );
  }
  ```

  `handleClick()` 事件處理函式正在更新區域變數 `index`。但存在兩個原因使得畫面沒有發生變化：
  - #### 1. 區域變數無法在多次渲染（Render）中持久保存。
    當 `React` 再次渲染這個組件時，它會從頭開始執行 —— 不會保留之前對區域變數的任何變更。

  - #### 2. 變更區域變數不會觸發渲染。
    `React` 沒有意識到它需要使用新資料再次渲染組件。

  要使用新資料更新組件，需要做兩件事：
  - #### 1. `保留` 渲染之間的資料。
  - #### 2. `觸發` React 使用新資料重新渲染組件。

  [useState](https://zh-hans.react.dev/reference/react/useState) Hook 提供了這兩個功能：
  - #### 1. State 變數
    用於保存渲染之間的資料。
  - #### 2. State setter 函式
    更新變數並觸發 `React` 再次渲染組件。

## 添加一個 state 變數
  要添加 `state` 變數，先從檔案頂部的 `React` 中導入 `useState`：
  ```jsx
  import { useState } from 'react';
  ```

  然後，將 `let index = 0;` 修改為：
  ```jsx
  const [index, setIndex] = useState(0);
  ```

  `index` 是一個 `state` 變數，而 `setIndex` 是對應的 `setter` 函式。

  > 這裡的 `[` 和 `]` 語法稱為 [陣列解構（Destructuring assignment）](https://zh.javascript.info/destructuring-assignment)，它允許你從陣列中讀取值。`useState` 回傳的陣列總是正好有兩項。

  它們在 `handleClick()` 中運作如下：
  ```jsx
  function handleClick() {
    setIndex(index + 1);
  }
  ```

  - ### 遇見你的第一個 Hook
    - 在 `React` 中，`useState` 以及任何其他以「`use`」開頭的函式都被稱為 `Hook`。

    - `Hook` 是特殊的函式，只在 `React` 渲染時有效。它們能讓你 「`hook`」 到不同的 `React` 特性中去。
    
    - `State` 只是這些特性中的其中一個。

    :::info 陷阱
    `Hooks` —— 以 `use` 開頭的函式 —— 只能在組件或[`自訂 Hook`]的最頂層呼叫。
    你不能在條件語句、迴圈語句或其他巢狀函式內呼叫 `Hook`。
    :::

  - ### 剖析 useState
    ```jsx
    const [index, setIndex] = useState(0);
    ```

    - #### 1. 組件進行第一次渲染。
      因為你將 `0` 作為初始值傳遞給 `useState`，它將回傳 `[0, setIndex]`。
      React 記住 `0` 是最新的 `state` 值。

    - #### 2. 你更新了 state。
      當使用者點擊按鈕時，呼叫 `setIndex(index + 1)`。此時 `index` 是 `0`，所以是 `setIndex(1)`。
      這告訴 `React` 記住 `index` 現在是 `1` 並觸發下一次渲染。

    - #### 3. 組件進行第二次渲染。
      `React` 仍然看到 `useState(0)`，但因為 `React` 記住了你將 `index` 設定為了 `1`，它這一次會回傳 `[1, setIndex]`。

## 賦予一個組件多個 state 變數
  你可以在一個組件中擁有任意多種類型的 `state` 變數。例如同時擁有數字 `index` 和布林值 `showMore`：

  ```jsx
  const [index, setIndex] = useState(0);
  const [showMore, setShowMore] = useState(false);
  ```

  如果兩個變數之間的關聯性不高，拆分成多個 `state` 變數是很好的做法。
  但如果你發現經常同時變更兩個 `state` 變數，最好將它們合併為一個物件。

  :::info React 如何知道回傳哪個 state
  - `useState` 呼叫時並沒有傳入任何`識別碼（Identifier）`，`React` 是如何知道該回傳哪一個 `state` 變數呢？

  - 答案是：`Hooks` 仰賴於在同一個組件每次渲染中，擁有完全穩定的「呼叫順序」。

  - 在 `React` 內部，每個組件都有一個儲存 `state` 對（pair）的陣列。`React` 會維護一個「`目前 Hook 索引值`」，在渲染前重設為 `0`。每次呼叫 `useState` 時，`React` 就會回傳當前索引的 `state` 並將索引值加 `1`。這就是為什麼 `Hook` 絕對不能寫在條件句或迴圈裡的原因。
  :::

## State 是隔離且私有的
  - #### 核心概念
    - ##### State 屬於組件實例內部
      `State` 是屏幕上組件實例內部的狀態。

    - ##### 完全隔離
      如果將同一個組件渲染兩次，每個副本都會擁有完全隔離的 `state`。改變其中一個組件的 `state`，並不會影響到另一個。

    - ##### 與普通變數的不同
      `State` 與聲明在模組頂部的普通變數不同，它不依賴特定函數調用或代碼位置，其作用域只限於屏幕上的某塊特定區域（例如渲染兩個 `<Gallery />`，其 state 是分別獨立存儲的）。

    - ##### 完全私有
      與 `props` 不同，`state` 完全私有於聲明它的組件。父組件無法更改它，也「不知道」子組件的 `state` 資訊。這讓開發者可以自由在組件內添加或刪除 `state`，而不影響其他組件。

    ```jsx
    // App.js
    import Gallery from './Gallery.js';

    export default function Page() {
      return (
        <div className="Page">
          <Gallery />
          <Gallery />
        </div>
      );
    }
    ```

    ```jsx
    // Gallery.js
    import { useState } from 'react';
    import { sculptureList } from './data.js';

    export default function Gallery() {
      const [index, setIndex] = useState(0);
      const [showMore, setShowMore] = useState(false);

      function handleNextClick() {
        setIndex(index + 1);
      }

      function handleMoreClick() {
        setShowMore(!showMore);
      }

      let sculpture = sculptureList[index];
      return (
        <section>
          <button onClick={handleNextClick}>
            Next
          </button>
          <h2>
            <i>{sculpture.name} </i>
            by {sculpture.artist}
          </h2>
          <h3>
            ({index + 1} of {sculptureList.length})
          </h3>
          <button onClick={handleMoreClick}>
            {showMore ? 'Hide' : 'Show'} details
          </button>
          {showMore && <p>{sculpture.description}</p>}
          <img
            src={sculpture.url}
            alt={sculpture.alt}
          />
        </section>
      );
    }
    ```

  - #### 程式碼範例結構說明
    - ##### Page 組件
      渲染了兩個 `<Gallery />` 組件副本（放在同一個頁面中，透過 CSS 設定各佔 50% 寬度）。

    - ##### Gallery 組件
      - 使用 `useState(0)` 管理 `index` 狀態。
      - 使用 `useState(false)` 管理 `showMore`（顯示詳情）狀態。
      - 擁有 `handleNextClick`（切換下一張）與 `handleMoreClick`（切換顯示/隱藏詳情）的事件處理函數。
      - 點擊各別畫廊的按鈕時，其狀態互不干擾。

    - ##### data.js
      包含一組雕塑作品的資料陣列（sculptureList），供 `Gallery` 根據 `index` 讀取並渲染名稱、藝術家、描述、圖片網址與替代文字（alt）。
    
  - #### 進階延伸提示
    如果想要讓兩個組件的 `states` 保持同步，`React` 的正確做法是將 `state` 從子組件中刪除，並將其提升（添加）到距離它們最近的共享父組件中 (這個概念稱為 `狀態提升 Lifting State Up`）)（詳細做法參考「[組件間共享 state](/pages/f2e/docReact/reactDev/07/reactDev_07_03.html)」章節）。

## 重點複習（Recap）
  - 當一個組件需要在多次渲染間「記住」某些資訊時使用 `state` 變數。
  - `State` 變數是透過呼叫 `useState` Hook 來聲明的。
  - `Hook` 是以 `use` 開頭的特殊函式。它們能讓你「`hook`」到像 `state` 這樣的 `React` 特性中。
  - `Hook` 可能會讓你聯想到 `import`：它們需要在非條件語句中呼叫。呼叫 `Hook` 時，包括 `useState`，僅在組件或另一個 `Hook` 的頂層被呼叫才有效。
  - `useState` Hook 回傳一對值：`當前 state` 和`更新它的函式`。
  - 你可以擁有多個 `state` 變數。在內部，`React` 按順序匹配它們。
  - `State` 是組件私有的。如果你在兩個地方渲染它，則每個副本都有獨屬於自己的 `state`。

## 挑戰（Challenges）
  - #### 1. 完成畫廊組件
    ```jsx
    // App.js
    import { useState } from 'react';
    import { sculptureList } from './data.js';

    export default function Gallery() {
      const [index, setIndex] = useState(0);
      const [showMore, setShowMore] = useState(false);

      function handleNextClick() {
        setIndex(index + 1);
      }

      function handleMoreClick() {
        setShowMore(!showMore);
      }

      let sculpture = sculptureList[index];
      return (
        <>
          <button onClick={handleNextClick}>
            Next
          </button>
          <h2>
            <i>{sculpture.name} </i>
            by {sculpture.artist}
          </h2>
          <h3>
            ({index + 1} of {sculptureList.length})
          </h3>
          <button onClick={handleMoreClick}>
            {showMore ? 'Hide' : 'Show'} details
          </button>
          {showMore && <p>{sculpture.description}</p>}
          <img
            src={sculpture.url}
            alt={sculpture.alt}
          />
        </>
      );
    }  
    ```

    - ##### 問題描述
      當在最後一個雕塑上點擊「`Next`」時，程式碼會發生崩潰。

    - ##### 解決目標
      - 修復邏輯以防止崩潰（可嘗試在事件處理函式中添加額外邏輯，或在操作無法執行時將按鈕禁用）。
      - 修復崩潰後，添加一個顯示上一個雕塑的「`Previous`」按鈕，並確保它在第一個雕塑時不會發生崩潰。

    - ##### 原程式碼問題
      未限制 `index` 的邊界，導致超出陣列索引時讀取 `sculptureList[index]` 為 `undefined` 而引發錯誤。

    - ##### 解決方案
      - ###### 邊界判斷與按鈕狀態
        - 宣告 `hasPrev = index > 0` 與 `hasNext = index < sculptureList.length - 1` 作為保護條件。
        - 將這兩個布林值同時應用於按鈕的 `disabled` 屬性，以及事件處理函式（`handlePrevClick`、`handleNextClick`）內部的 `if` 條件判斷。

      - ###### 運作模式說明
        此模式之所以有效，是因為事件處理函式透過「`閉包`」記住了渲染時宣告的變數。

      ```jsx
      // App.js

      import { useState } from 'react';
      import { sculptureList } from './data.js';

      export default function Gallery() {
        const [index, setIndex] = useState(0);
        const [showMore, setShowMore] = useState(false);

        let hasPrev = index > 0;
        let hasNext = index < sculptureList.length - 1;

        function handlePrevClick() {
          if (hasPrev) {
            setIndex(index - 1);
          }
        }

        function handleNextClick() {
          if (hasNext) {
            setIndex(index + 1);
          }
        }

        function handleMoreClick() {
          setShowMore(!showMore);
        }

        let sculpture = sculptureList[index];
        return (
          <>
            <button
              onClick={handlePrevClick}
              disabled={!hasPrev}
            >
              Previous
            </button>
            <button
              onClick={handleNextClick}
              disabled={!hasNext}
            >
              Next
            </button>
            <h2>
              <i>{sculpture.name} </i>
              by {sculpture.artist}
            </h2>
            <h3>
              ({index + 1} of {sculptureList.length})
            </h3>
            <button onClick={handleMoreClick}>
              {showMore ? 'Hide' : 'Show'} details
            </button>
            {showMore && <p>{sculpture.description}</p>}
            <img
              src={sculpture.url}
              alt={sculpture.alt}
            />
          </>
        );
      }
      ```

  - #### 2. 修復卡住的輸入表單
    ```jsx
    export default function Form() {
      let firstName = '';
      let lastName = '';

      function handleFirstNameChange(e) {
        firstName = e.target.value;
      }

      function handleLastNameChange(e) {
        lastName = e.target.value;
      }

      function handleReset() {
        firstName = '';
        lastName = '';
      }

      return (
        <form onSubmit={e => e.preventDefault()}>
          <input
            placeholder="First name"
            value={firstName}
            onChange={handleFirstNameChange}
          />
          <input
            placeholder="Last name"
            value={lastName}
            onChange={handleLastNameChange}
          />
          <h1>Hi, {firstName} {lastName}</h1>
          <button onClick={handleReset}>Reset</button>
        </form>
      );
    }
    ```

    - ##### 問題描述
      在輸入欄位輸入內容時，畫面上什麼也沒有出現，輸入值像是被空字串「卡住」了一樣。

    - ##### 原程式碼問題
      原程式碼使用普通變數（`let firstName = ''`）來儲存輸入值。雖然 `onChange` 事件會嘗試更新該變數，但普通變數無法在組件重新渲染時「記住」它們的值，且修改普通變數不會觸發 `React` 重新渲染。

    - ##### 解決方案
      - ###### 改用 State 管理
        - 從 `React` 導入 `useState`。
        - 用 `useState` 宣告的 `state` 變數取代原本的 `firstName` 和 `lastName`。
        - 在 `onChange` 處理函式中，用 `setFirstName(e.target.value)` 與 `setLastName(e.target.value)` 取代原本的賦值操作。
        - 更新 `handleReset` 函式，呼叫 `setFirstName('')` 與 `setLastName('')` 以使重置按鈕生效。

      ```jsx
      import { useState } from 'react';

      export default function Form() {
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');

        function handleFirstNameChange(e) {
          setFirstName(e.target.value);
        }

        function handleLastNameChange(e) {
          setLastName(e.target.value);
        }

        function handleReset() {
          setFirstName('');
          setLastName('');
        }

        return (
          <form onSubmit={e => e.preventDefault()}>
            <input
              placeholder="First name"
              value={firstName}
              onChange={handleFirstNameChange}
            />
            <input
              placeholder="Last name"
              value={lastName}
              onChange={handleLastNameChange}
            />
            <h1>Hi, {firstName} {lastName}</h1>
            <button onClick={handleReset}>Reset</button>
          </form>
        );
      }
      ```

  - #### 3. 修復一個錯誤
    ```jsx
    import { useState } from 'react';

    export default function FeedbackForm() {
      const [isSent, setIsSent] = useState(false);
      if (isSent) {
        return <h1>Thank you!</h1>;
      } else {
        // eslint-disable-next-line
        const [message, setMessage] = useState('');
        return (
          <form onSubmit={e => {
            e.preventDefault();
            alert(`Sending: "${message}"`);
            setIsSent(true);
          }}>
            <textarea
              placeholder="Message"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <br />
            <button type="submit">Send</button>
          </form>
        );
      }
    }
    ```

    - ##### 問題描述
      這是一個收集用戶回饋的小表單。提交回饋時應該顯示感謝訊息，但目前會發生崩潰並顯示錯誤訊息：「`渲染的 hooks 比預期的少`」。

    - ##### 原程式碼問題
      違反了 `Hook` 的呼叫規則。原程式碼將 `const [message, setMessage] = useState('')` 放在了 `if (isSent)` 的 `else` 條件分支語句中。

    - ##### 解決方案
      - ###### 遵守 Hook 規則
        - `Hook` 只能在組件函數的頂層呼叫，不允許放在條件語句、迴圈或巢狀函數中。
        - 修正做法： 將 `message` 的 `useState` 呼叫移出條件語句，放在組件的最頂層（`isSent` 的下方）。

        ```jsx
        import { useState } from 'react';

        export default function FeedbackForm() {
          const [isSent, setIsSent] = useState(false);
          const [message, setMessage] = useState('');

          if (isSent) {
            return <h1>Thank you!</h1>;
          } else {
            return (
              <form onSubmit={e => {
                e.preventDefault();
                alert(`Sending: "${message}"`);
                setIsSent(true);
              }}>
                <textarea
                  placeholder="Message"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                />
                <br />
                <button type="submit">Send</button>
              </form>
            );
          }
        }
        ```

      - ###### 程式碼優化
        可以進一步刪除不必要的 `else` 分支以減少巢狀層級，但必須保證所有對 `Hook` 的呼叫都發生在第一個 `return` 之前。如果項目配置了針對 `React` 的 `linter`，這類錯誤會直接被回報。

        ```jsx
        import { useState } from 'react';

        export default function FeedbackForm() {
          const [isSent, setIsSent] = useState(false);
          const [message, setMessage] = useState('');

          if (isSent) {
            return <h1>Thank you!</h1>;
          }

          return (
            <form onSubmit={e => {
              e.preventDefault();
              alert(`Sending: "${message}"`);
              setIsSent(true);
            }}>
              <textarea
                placeholder="Message"
                value={message}
                onChange={e => setMessage(e.target.value)}
              />
              <br />
              <button type="submit">Send</button>
            </form>
          );
        }
        ```

  - #### 4. 移除不必要的 state
    ```jsx
    import { useState } from 'react';

    export default function FeedbackForm() {
      const [name, setName] = useState('');

      function handleClick() {
        setName(prompt('What is your name?'));
        alert(`Hello, ${name}!`);
      }

      return (
        <button onClick={handleClick}>
          Greet
        </button>
      );
    }
    ```

    - ##### 問題描述
      點擊按鈕時會詢問用戶名字並彈出歡迎視窗。原程式碼嘗試使用 `state` 來儲存名字，但畫面會先顯示「`Hello, !`」，下一次才會顯示「`Hello, [name]!`」（每次都使用到上一次的輸入）。

    - ##### 原因解釋
      `State` 變數僅用於在組件重新渲染之間保存資訊。在單個事件處理函式中，設定 `state` 並不會立即使目前的變數值改變（因為 `state` 像是快照），且該操作根本不需要觸發組件重新渲染來保持畫面同步。

    - ##### 解決方案
      - ###### 使用普通局部變數
        - 直接刪除 `const [name, setName] = useState('')` 這個不必要的 `state`。
        - 在 `handleClick` 事件處理函式中，直接使用區域普通變數來接收值：`const name = prompt('What is your name?');`。
        - 核心原則： 當普通變數運行良好時，不要盲目引入 `state` 變數。

      ```jsx
      export default function FeedbackForm() {
        function handleClick() {
          const name = prompt('What is your name?');
          alert(`Hello, ${name}!`);
        }

        return (
          <button onClick={handleClick}>
            Greet
          </button>
        );
      }
      ```