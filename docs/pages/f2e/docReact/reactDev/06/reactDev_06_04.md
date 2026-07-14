---
title: '[React官網] React 19.2 教學文件'
---

# state 如同一張快照
  也許 `State` 變數看起來和一般可讀寫的 `JavaScript` 變數類似。
  但 `State` 在其表現出的特性上，更像是一張快照。設定它不會更改你已有的 `State` 變數，而是會觸發 `重新渲染（Re-render）`。

  :::info 你將學到
  - 設定 `State` 如何導致重新渲染
  - `State` 在何時以何種方式更新
  - 為什麼 `State` 不在設定後立即更新
  - 事件處理函式如何獲取 `State` 的一張「快照」
  :::

## 設定 State 會觸發渲染
  你可能會認為使用者介面（UI）會直接對點擊之類的使用者輸入做出響應並發生變化。在 `React` 中，它的工作方式與這種思維模型略有不同。
  在上一頁中，你看到了來自 `React` 的 [設定 State 請求重新渲染](/pages/f2e/docReact/reactDev/06/reactDev_06_03.html)。這意味著要使介面對輸入做出反應，你需要設定其 `State`。

  在這個例子中，當你按下 `“Send”` 時，`setIsSent(true)` 會通知 `React` 重新渲染 UI：

  ```jsx
  import { useState } from 'react';

  export default function Form() {
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState('Hi!');
    if (isSent) {
      return <h1>Your message is on its way!</h1>
    }
    return (
      <form onSubmit={(e) => {
        e.preventDefault();
        setIsSent(true);
        sendMessage(message);
      }}>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">Send</button>
      </form>
    );
  }

  function sendMessage(message) {
    // ...
  }
  ```

  當你點擊按鈕時會發生以下情況：
  1. 執行 `onSubmit` 事件處理函式。
  2. `setIsSent(true)` 將 `isSent` 設定為 `true` 並排入一個新的渲染佇列。
  3. `React` 根據新的 `isSent` 值重新渲染組件。

  讓我們仔細看看 `State` 和渲染之間的關係。

## 渲染會及時產生一張快照
  `「正在渲染」` 就意味著 `React` 正在呼叫你的組件 —— 也就是一個函式。你從該函式回傳的 `JSX` 就像是在某個時間點上 `UI` 的快照。它的 `Props`、事件處理函式和內部變數，都是 根據當前渲染時的 `State` 被計算出來的。

  與照片或電影畫面不同，你回傳的 UI「快照」是可互動的。它其中包含了類似事件處理函式的邏輯，這些邏輯用於指定如何對輸入做出響應。`React` 隨後會更新螢幕來匹配這張快照，並綁定事件處理函式。因此，按下按鈕就會觸發你 `JSX` 中的點擊事件處理函式。

  當 `React` 重新渲染一個組件時：
  1. `React` 會再次呼叫你的函式
  2. 函式會回傳新的 `JSX` 快照
  3. `React` 會更新介面以匹配回傳的快照

  作為一個組件的記憶，`State` 不同於在你的函式回傳之後就會消失的普通變數。`State` 實際上「活」在 `React` 本身之中 —— 就像被擺在一個架子上！ —— 位於你的函式之外。
  當 `React` 呼叫你的組件時，它會為特定的那一次渲染提供一張 `State` 快照。你的組件會在其 `JSX` 中回傳一張包含一整套新的 `Props` 和事件處理函式的 UI 快照，其中所有的值都是 `根據那一次渲染中 State 的值` 被計算出來的！

  這裡有個向你展示其運作原理的小例子。在這個例子中，你可能會以為點擊「+3」按鈕會呼叫 `setNumber(number + 1)` 三次，從而使計數器遞增三次。

  看看你點擊「+3」按鈕時會發生什麼：

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

  請注意，每次點擊只會讓 `number` 遞增一次！

  設定 `State` 只會為下一次渲染變更 `State` 的值。在第一次渲染期間，`number` 為 `0`。這也就解釋了為什麼在 那次渲染中的 `onClick` 處理函式中，即便在呼叫了 `setNumber(number + 1)` 之後，`number` 的值也仍然是 0：

  ```jsx
  <button onClick={() => {
    setNumber(number + 1);
    setNumber(number + 1);
    setNumber(number + 1);
  }}>+3</button>
  ```

  以下是這個按鈕的點擊事件處理函式通知 `React` 要做的事情：

  - 1. `setNumber(number + 1)`：`number` 是 `0`，所以是 `setNumber(0 + 1)`。
    - `React` 準備在下一次渲染時將 `number` 變更為 `1`。
  - 2. `setNumber(number + 1)`：`number` 是 `0`，所以是 `setNumber(0 + 1)`。
    - `React` 準備在下一次渲染時將 `number` 變更為 `1`。
  - 3. `setNumber(number + 1)`：`number` 是 `0`，所以是 `setNumber(0 + 1)`。
    - `React` 準備在下一次渲染時將 `number` 變更為 `1`。

  儘管你呼叫了三次 `setNumber(number + 1)`，但在 這次渲染的 事件處理函式中，`number` 會一直是 `0`，所以你會三次將 `State` 設定成 `1`。這就是為什麼在你的事件處理函式執行完以後，`React` 重新渲染的組件中的 `number` 等於 `1` 而不是 3。

  你還可以透過在心中把 `State` 變數替換成它們在你程式碼中的具體數值，來想像這個過程。由於 這次渲染 中的 `State` 變數 `number` 是 `0`，其事件處理函式看起來會像這樣：

  ```jsx
  <button onClick={() => {
    setNumber(0 + 1);
    setNumber(0 + 1);
    setNumber(0 + 1);
  }}>+3</button>
  ```

  對於下一次渲染來說，`number` 是 `1`，因此 那次渲染中的 點擊事件處理函式看起來會像這樣：

  ```jsx
  <button onClick={() => {
    setNumber(1 + 1);
    setNumber(1 + 1);
    setNumber(1 + 1);
  }}>+3</button>
  ```
  
  這就是為什麼再次點擊按鈕會將計數器設定為 `2`，下次點擊時會設為 `3`，依此類推。

## 隨時間變化的 State
  好的，剛才那些很有意思。試著猜猜點擊這個按鈕會跳出什麼 `Alert` 訊息：

  ```jsx
  import { useState } from 'react';

  export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
      <>
        <h1>{number}</h1>
        <button onClick={() => {
          setNumber(number + 5);
          alert(number);
        }}>+5</button>
      </>
    )
  }
  ```

  如果你使用之前代入數值的方法，你就能猜到這個 `Alert` 將會顯示 `"0"`：

  ```jsx
  setNumber(0 + 5);
  alert(0);
  ```

  但如果你在這個 `Alert` 上加上一個計時器，使得它在組件重新渲染 `之後` 才觸發，又會怎樣呢？是會顯示 `“0”` 還是 `“5”` ？猜一猜！

  ```jsx
  import { useState } from 'react';

  export default function Counter() {
    const [number, setNumber] = useState(0);

    return (
      <>
        <h1>{number}</h1>
        <button onClick={() => {
          setNumber(number + 5);
          setTimeout(() => {
            alert(number);
          }, 3000);
        }}>+5</button>
      </>
    )
  }
  ```

  驚訝嗎？你如果使用數值代入法，就能看到被傳入 `Alert` 的 `State`「快照」：

  ```jsx
  setNumber(0 + 5);
  setTimeout(() => {
    alert(0);
  }, 3000);
  ```

  到 `Alert` 執行時，`React` 中儲存的 `State` 可能已經發生了變更，但它是使用使用者當時與之互動那一刻的狀態快照進行排程的！

  一個 `State` 變數的值永遠不會在單次渲染的內部發生變化， 即使其事件處理函式的程式碼是 `同步` 或 `非同步（Async）` 的。在 那次渲染的 `onClick` 內部，`number` 的值即使在呼叫 `setNumber(number + 5)` 之後也還是 `0`。它的值在 `React` 透過呼叫你的組件「獲取 UI 的快照」時就被「固定」了。

  這裡有個範例能夠說明上述特性會使你的事件處理函式更不容易出現時間差錯誤（Timing errors）。下面是一個會在五秒延遲之後送出一條訊息的表單。想像以下場景：
  1. 你按下 `「Send」` 按鈕，向 `Alice` 送出「你好」。
  2. 在五秒延遲結束之前，將 `「To」` 欄位的值更改為「Bob」。

  你覺得 `alert` 會顯示什麼？它是會顯示 `「你向 Alice 說了你好」` 還是會顯示 `「你向 Bob 說了你好」` ？動手試一試：

  ```jsx
  import { useState } from 'react';

  export default function Form() {
    const [to, setTo] = useState('Alice');
    const [message, setMessage] = useState('你好');

    function handleSubmit(e) {
      e.preventDefault();
      setTimeout(() => {
        alert(`你向 ${to} 說了 ${message}`);
      }, 5000);
    }

    return (
      <form onSubmit={handleSubmit}>
        <label>
          To:{' '}
          <select
            value={to}
            onChange={e => setTo(e.target.value)}>
            <option value="Alice">Alice</option>
            <option value="Bob">Bob</option>
          </select>
        </label>
        <textarea
          placeholder="Message"
          value={message}
          onChange={e => setMessage(e.target.value)}
        />
        <button type="submit">發送</button>
      </form>
    );
  }
  ```

  `React` 會使 `State` 的值始終「`固定`」在單次渲染的各個事件處理函式內部。你無需擔心程式碼執行時 `State` 是否發生了變化。

  但是，萬一你想在重新渲染之前讀取最新、最即時的 `State` 怎麼辦？你應該使用 [State 更新函式](/pages/f2e/docReact/reactDev/06/reactDev_06_05.html)（Updater function），下一頁將會介紹！

## 重點複習（Recap）
  - 設定 `State` 會請求一次新的渲染。
  - `React` 將 `State` 儲存在組件之外，就像放在架子上游離於組件函式之外。
  - 當你呼叫 `useState` 時，`React` 會為你提供該次渲染 的一張 `State` 快照。
  - 變數和事件處理函式不會在重新渲染中「存活」。每次渲染都有它自己專屬的事件處理函式。
  - 每次渲染（以及其中的函式）始終「看到」的是 `React` 提供給這一次 渲染的 `State` 快照。
  - 你可以在心中替换事件處理函式中的 `State`，類似於替換渲染出來的 `JSX` 內部的常數。
  - 過去建立的事件處理函式所擁有的，是當初建立它們的那次渲染中的 `State` 值。

## 挑戰（Challenges）
  - #### 實現紅綠燈組件
    以下是一個行人紅綠燈組件，在按下按鈕時會切換狀態：

    ```jsx
    import { useState } from 'react';

    export default function TrafficLight() {
      const [walk, setWalk] = useState(true);

      function handleClick() {
        setWalk(!walk);
      }

      return (
        <>
          <button onClick={handleClick}>
            Change to {walk ? 'Stop' : 'Walk'}
          </button>
          <h1 style={{
            color: walk ? 'darkgreen' : 'darkred'
          }}>
            {walk ? 'Walk' : 'Stop'}
          </h1>
        </>
      );
    }
    ```

    請向 `click` 事件處理函式添加一個 `alert`。當燈號為綠色且顯示 `“Walk”` 時，按一下按鈕應顯示 `“Stop is next”`。當燈號為紅色並顯示 `“Stop”` 時，按一下按鈕應顯示 `“Walk is next”`。  

    把 `alert` 方法放在 `setWalk` 方法之前或之後有差別嗎？

  - #### 解答
    你的 `alert` 看起來應該像是這樣：

    ```jsx
    import { useState } from 'react';

    export default function TrafficLight() {
      const [walk, setWalk] = useState(true);

      function handleClick() {
        setWalk(!walk);
        alert(walk ? 'Stop is next' : 'Walk is next');
      }

      return (
        <>
          <button onClick={handleClick}>
            Change to {walk ? 'Stop' : 'Walk'}
          </button>
          <h1 style={{
            color: walk ? 'darkgreen' : 'darkred'
          }}>
            {walk ? 'Walk' : 'Stop'}
          </h1>
        </>
      );
    }
    ```

    無論你是將它放在 `setWalk` 呼叫之前還是之後都完全沒有區別。那次渲染中 `walk` 的值是固定的（如同快照）。呼叫 `setWalk` 只會為 下一次 渲染準備變更，而不會影響來自當前這一次渲染的事件處理函式內部環境。

    這行程式碼乍看之下似乎有違直覺：
    ```jsx
    alert(walk ? 'Stop is next' : 'Walk is next');
    ```

    但如果你將其解讀為： `「如果目前交通燈顯示『現在可以走（Walk）』，則訊息應提示『接下來是停（Stop）』。」` 就很容易理解了。你事件處理函式中的 `walk` 變數與畫面上渲染出來的 `walk` 值是一致的，並且在該次執行中不會發生改變。