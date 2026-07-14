---
title: '[React官網] React 19.2 教程'
---

# 把一系列 state 更新加入佇列
  設定組件的 `State` 會將一次重新渲染（Re-render）排入佇列。但有時你可能會希望在下一次渲染之前，對同一個 `State` 的值執行多次操作。為此，了解 `React` 如何 `「批次處理」` 更新 `State` 會很有幫助。
  
  :::info 你將學到
  - 什麼是 `「批次處理（Batching）」` 以及 `React` 如何使用它來處理多個 `State` 更新
  - 如何連續多次對同一個 `State` 變數進行更新
  :::
  
## React 會對 State 更新進行批次處理
  在下面的範例中，你可能會認為點擊「+3」按鈕會使計數器遞增三次，因為它呼叫了 `setNumber(number + 1)` 三次：
  
  ```jsx
  import { useState } from 'react';
  export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
      <>
        <h1>{number}</h1>
        <button onClick={() => {
          setNumber(number + 1);
          setNumber(number + 1);
          setNumber(number + 1);
        }}>+3</button>
      </>
    )
  }
  ```

  但是，你可能還記得上一節中的內容，每一次渲染的 `State` 值都是固定的（快照），因此無論你呼叫多少次 `setNumber`，在第一次渲染的事件處理函式內部的 `number` 值總是 `0`：
  
  ```jsx
  setNumber(0 + 1);
  setNumber(0 + 1);
  setNumber(0 + 1);
  ```

  不過這裡還有另外一個影響因素。`React 會等到事件處理函式中的「所有」程式碼都執行完畢，才會處理你的 State 更新`。 這就是為什麼重新渲染只會發生在所有這些 `setNumber()` 呼叫之後。
  
  這可能會讓你想起餐廳裡幫你點菜的服務生。服務生不會在你剛說完第一道菜的時候就直接跑到廚房！相反地，他們會等點單完畢、讓你修改完菜品，甚至幫同桌的其他人點完菜之後，才統一送往廚房。
  
  這讓你可以更新多個 `State` 變數 —— 甚至來自多個不同組件的 `State` 變數 —— 而不會觸發太多次不必要的重新渲染。但這也意味著，只有在你的事件處理函式及其中所有程式碼執行完成之後，`UI` 才會更新。這種特性也就是 `「批次處理（Batching）」`，它能讓你的 `React` 應用程式執行得更快。它還能幫你避免處理只更新了一部分變數、讓人困惑的「半成品」渲染畫面。
  
  `React` 不會跨「多個」需要刻意觸發的獨立事件（例如兩次獨立的點擊）進行批次處理 —— 每次點擊都是單獨且安全地處理的。例如，如果第一次點擊按鈕會停用表單（Disabled），那麼第二次點擊就不會再次送出它。
  
## 在下一次渲染前多次更新同一個 State
  這是一個較不常見的案例，但如果你想在下一次渲染之前多次更新同一個 `State`，你可以像 `setNumber(n => n + 1)` 這樣傳入一個根據佇列中的前一個 `State` 計算下一個 `State` 的「函式」，而不是像 `setNumber(number + 1)` 這樣傳入特定的下一個 `State` 值。這是一種告訴 `React`「拿當前的 `State` 值去做某事」而不是單純直接替換它的方法。
  
  現在嘗試遞增計數器：
  ```jsx
  import { useState } from 'react';

  export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
      <>
        <h1>{number}</h1>
        <button onClick={() => {
          setNumber(n => n + 1);
          setNumber(n => n + 1);
          setNumber(n => n + 1);
        }}>+3</button>
      </>
    )
  }
  ```

  在這裡，`n => n + 1` 被稱為 `State 更新函式（Updater function）`。當你將它傳遞給一個 `State` 設定函式時：
  1. `React` 會將此函式排入 `佇列（Queue）`，以便在事件處理函式中的所有其他程式碼執行完後進行處理。
  2. 在下一次渲染期間，`React` 會走訪（遍歷）這個佇列並計算出最終的 `State`。
  
  下面是 `React` 在處理這幾行程式碼時的詳細過程：
  1. `setNumber(n => n + 1)`：`n => n + 1` 是一個函式。`React` 將它排入佇列。
  2. `setNumber(n => n + 1)`：同樣是一個函式，`React` 再次將它排入佇列。
  3. `setNumber(n => n + 1)`：同樣是一個函式，`React` 第三次將它排入佇列。
  
  當你在下一次渲染期間呼叫 `useState` 時，`React` 會開始走訪佇列。原本的 `number` 值是 `0`，所以 `React` 會將 `0` 作為參數 `n` 傳遞给第一個更新函式。然後 `React` 會將上一個更新函式的回傳值，作為下一個更新函式的 `n` 傳入，依此類推：
  
  | 更新佇列      | n (前一個 State)  | 回傳值 (下一個 State)  |
  |--------------|------------------|-----------------------|
  | `n => n + 1` | `0`              | `0 + 1 = 1`           |
  | `n => n + 1` | `1`              | `1 + 1 = 2`           |
  | `n => n + 1` | `2`              | `2 + 1 = 3`           |
  
  `React` 最後會將 `3` 儲存為最終結果，並從 `useState` 中回傳。這就是為什麼點擊 `「+3」` 能正確遞增 `3` 的原因。
  
  - ### 如果你在替換 State 後更新 State 會發生什麼
    看看下面這個事件處理函式，你認為下一次渲染時 `number` 的值會是什麼？
    ```jsx
    <button onClick={() => {
      setNumber(number + 5);
      setNumber(n => n + 1);
    }}>
    ```

    這是事件處理函式告訴 React 要做的事情：
    1. `setNumber(number + 5)`：當前 `number` 為 `0`，所以是 `setNumber(0 + 5)`。`React` 將 `「替換為 5」` 的指令放入佇列中。
    2. `setNumber(n => n + 1)`：`n => n + 1` 是一個更新函式。`React` 將 這個函式 放入佇列中。
    
    在下一次渲染期間，`React` 會走訪這個 `State` 佇列：
    | 更新佇列      | n           | 回傳值      |
    |--------------|-------------|-------------|
    | `「替換為 5」` | `0（未使用）` | `5`         |
    | `n => n + 1` | `5`         | `5 + 1 = 6` |
    
    `React` 會將 `6` 儲存為最終結果並由 `useState` 回傳。
    
    :::info 注意
    你可能已經注意到，`setState(x)` 實際上在 `React` 內部的運作就像 `setState(n => x)` 一樣，只是它沒有去使用傳進來的 `n` 而已！
    :::
    
  - ### 如果你在更新 State 後替換 State 會發生什麼
    讓我們再看一個相反的例子。你認為下一次渲染時 `number` 的值會是什麼？
    
    ```jsx
    <button onClick={() => {
      setNumber(number + 5);
      setNumber(n => n + 1);
      setNumber(42);
    }}>
    ```

    以下是 `React` 處理這個佇列的過程：
    1. `setNumber(number + 5)`：將 「替換為 5」 排入佇列。
    2. `setNumber(n => n + 1)`：將 更新函式 排入佇列。
    3. `setNumber(42)`：將 「替換為 42」 排入佇列。
    
    在下一次渲染期間，`React` 走訪 `State` 佇列：
    | 更新佇列        | n           | 回傳值      |
    |---------------|-------------|-------------|
    | `「替換為 5」`  | `0（未使用）` | `5`         |
    | `n => n + 1`  | `5`         | `5 + 1 = 6` |
    | `「替換為 42」` | `6（未使用）` | `42`        |
    
    最後 `React` 會保留 `42` 作為最終結果。
    
    總結來說，傳遞給 `State` 設定函式（如 `setNumber`）的內容可以分成以下兩種：
    - `一個更新函式`（例如：n => n + 1）：會被依序加入佇列中，並在渲染時計算。
    - `任何其他的值`（例如：數字 42）：會將 「替換為 42」 的操作加入佇列，覆蓋、忽略前面算出來的階段值。
    
    事件處理函式執行完畢後，`React` 就會觸發重新渲染並處理這個佇列。由於更新函式是在渲染期間執行的，因此 更新函式必須是 `純函式（Pure function）`，且只能有 `return` 結果的行為。不要嘗試在更新函式內部去設定其他 `State` 或執行任何 `副作用（Side Effects）`。在開發時的 `嚴格模式（Strict Mode）` 下，`React` 會執行每個更新函式兩次（但丟棄第二次的計算結果），以確保你的函式沒有偷偷藏著副作用。
    
  - ### 命名慣例
    通常在命名更新函式的參數時，常見的慣例是使用相對應 `State` 變數的第一個字母：

    ```jsx
    setEnabled(e => !e);
    setLastName(ln => ln.reverse());
    setFriendCount(fc => fc * 2);
    ```
    
    如果你偏好語意更完整的程式碼，另一個常見慣例是重複完整的 `State` 變數名稱，例如 `setEnabled(enabled => !enabled)`，或是加上 `prev` 前綴字，例如 `setEnabled(prevEnabled => !prevEnabled)`。
    
## 重點複習（Recap）
  - 設定 `State` 不會更改當前渲染中的變數，而是向 `React` 請求一次新的渲染快照。
  - `React` 會在事件處理函式中的程式碼全部執行完畢後，才統一處理 `State` 的更新，這被稱為 `批次處理（Batching）`。
  - 若要在單一事件處理函式中，依賴前幾次的操作連續多次更新同一個 `State`，你應該使用 `setNumber(n => n + 1)` 更新函式。
  
## 挑戰（Challenges）
  - #### 1. 修正請求計數器
    ```jsx
    import { useState } from 'react';

    export default function RequestTracker() {
      const [pending, setPending] = useState(0);
      const [completed, setCompleted] = useState(0);

      async function handleClick() {
        setPending(pending + 1);
        await delay(3000);
        setPending(pending - 1);
        setCompleted(completed + 1);
      }

      return (
        <>
          <h3>
            等待：{pending}
          </h3>
          <h3>
            完成：{completed}
          </h3>
          <button onClick={handleClick}>
            購買
          </button>
        </>
      );
    }

    function delay(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    ```

    你正在開發一個藝術市場的 `App`，該應用程式允許使用者為一個藝術品同時送出多個訂單。每次使用者按下`「購買」`按鈕，`「等待中（Pending）」` 計數器應該要增加 `1`。三秒鐘後，`「等待中」` 計數器應該減少，而 `「已完成（Completed）」` 計數器應該增加。
    
    然而，目前 `「等待中」` 計數器的行為不符合預期。當你點擊 `「購買」` 時，它甚至會一路減到 `-1`。如果你快速連續點擊兩次，兩個計數器都會出現不可預測的亂象。
    
    為什麼會這樣？請修復這兩個計數器。
    
    ```jsx
    import { useState } from 'react';

    export default function RequestTracker() {
      const [pending, setPending] = useState(0);
      const [completed, setCompleted] = useState(0);

      async function handleClick() {
        setPending(p => p + 1);
        await delay(3000);
        setPending(p => p - 1);
        setCompleted(c => c + 1);
      }

      return (
        <>
          <h3>等待：{pending}</h3>
          <h3>完成：{completed}</h3>
          <button onClick={handleClick}>
            購買
          </button>
        </>
      );
    }

    function delay(ms) {
      return new Promise(resolve => {
        setTimeout(resolve, ms);
      });
    }
    ```

    在原本的 `handleClick` 事件處理函式內部，`pending` 和 `completed` 的數值會被非同步的 `await` 斷開。在三秒過後執行 `setPending(pending - 1)` 時，它手上的 `pending` 依然是三秒前點擊那一刻的舊快照（也就是 `0`），因此 `setPending(pending - 1)` 變成了 `setPending(0 - 1)` 即 `-1`。
    
    因為你想做的是基於當下最新的計數進行「遞增」或「遞減」，你應該傳遞更新函式，而不是傳遞點擊那一刻所抓到的固定值：
    
    ```jsx
    async function handleClick() {
      setPending(p => p + 1);
      await delay(3000);
      setPending(p => p - 1);
      setCompleted(c => c + 1);
    }
    ```

    這樣一來，就能確保你在增減計數器時，是根據 `React` 佇列中 最新、最即時的 狀態來做運算，而不是拿三秒前的舊快照進行覆蓋。
    
  - #### 2. 自己實作狀態佇列
    在這個挑戰中，你將從頭開始重新實作 `React` 計算佇列的一小部分！
    
    你的任務是實作 `getFinalState` 函式，讓它能為各種佇列操作返回正確的最終結果。你將會收到兩個參數：
    1. `baseState`：初始狀態（例如：0）。
    2. `queue`：一個包含了數字（如 5）或是更新函式（如 n => n + 1）的陣列，它們會按照被加入的順序排列。

    ```jsx
    // App.js
    import { getFinalState } from './processQueue.js';

    function increment(n) {
      return n + 1;
    }
    increment.toString = () => 'n => n+1';

    export default function App() {
      return (
        <>
          <TestCase
            baseState={0}
            queue={[1, 1, 1]}
            expected={1}
          />
          <hr />
          <TestCase
            baseState={0}
            queue={[
              increment,
              increment,
              increment
            ]}
            expected={3}
          />
          <hr />
          <TestCase
            baseState={0}
            queue={[
              5,
              increment,
            ]}
            expected={6}
          />
          <hr />
          <TestCase
            baseState={0}
            queue={[
              5,
              increment,
              42,
            ]}
            expected={42}
          />
        </>
      );
    }

    function TestCase({
      baseState,
      queue,
      expected
    }) {
      const actual = getFinalState(baseState, queue);
      return (
        <>
          <p>初始 state：<b>{baseState}</b></p>
          <p>佇列：<b>[{queue.join(', ')}]</b></p>
          <p>預期結果：<b>{expected}</b></p>
          <p style={{
            color: actual === expected ?
            'green' :
            'red'
          }}>
            你的結果：<b>{actual}</b>
            {' '}
            ({actual === expected ?
              '正確' :
              '錯誤'
            })
          </p>
        </>
      );
    }

    ```
    
    ```jsx
    // procaseQueue.js
    export function getFinalState(baseState, queue) {
      let finalState = baseState;

      // TODO: 對佇列做些計算...

      return finalState;
    }
    ```

    這其實就是本頁中所描述的 `React` 用來計算最終 `State` 的核心邏輯：
    
    ```jsx
    // procaseQueue.js
    export function getFinalState(baseState, queue) {
      let finalState = baseState;

      for (let update of queue) {
        if (typeof update === 'function') {
          // 如果是函式，則傳入當前的階段狀態並執行它
          finalState = update(finalState);
        } else {
          // 如果是普通值，則直接替換掉之前的狀態
          finalState = update;
        }
      }

      return finalState;
    }
    ```

  現在你完全明白 React 的這部分佇列是如何在底層運作了吧！
