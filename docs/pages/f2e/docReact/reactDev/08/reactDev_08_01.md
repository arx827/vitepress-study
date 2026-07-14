---
title: '[React官網] React 19.2 教學文件'
---

# 使用 ref 引用值
  當你希望組件 `「記住」` 某些資訊，但又不想讓這些資訊觸發新的渲染時，可以使用 `ref`。

  :::info 你將會學到：
  - 如何為組件加入 `ref`
  - 如何更新 `ref` 的值
  - `ref` 與 `state` 有何不同
  - 如何安全地使用 `ref`
  :::

## 為組件加入 ref
  - 可以透過從 `React` 匯入 `useRef` Hook，為組件加入一個 `ref`：
    ```jsx
    import { useRef } from 'react';
    ```

  - 在組件內呼叫 `useRef` Hook，並傳入想要引用的初始值作為唯一參數。例如，這裡的 `ref` 引用值是 `0`：
    ```jsx
    const ref = useRef(0);
    ```
  
  - `useRef` 會回傳一個像這樣的物件：
    ```jsx
    {
      current: 0 // 傳入 useRef 的值
    }
    ```

  - 可以透過 `ref.current` 屬性存取該 `ref` 的目前值。這個值被刻意設計為可變的，代表既可以讀取它，也可以寫入它。它就像一個 `React` 追蹤不到、用來儲存組件資訊的秘密「口袋」（這正是它成為 `React` 單向資料流「脫圍機制」的原因）。

  - 範例中，每次點擊按鈕就會讓 `ref.current` 遞增：
    
    ```jsx
    import { useRef } from 'react';

    export default function Counter() {
      let ref = useRef(0);

      function handleClick() {
        ref.current = ref.current + 1;
        alert('你點擊了 ' + ref.current + ' 次！');
      }

      return (
        <button onClick={handleClick}>
          點擊我！
        </button>
      );
    }
    ```

  - 這裡的 `ref` 指向一個數字，但就像 `state` 一樣，你可以讓它指向任何東西：字串、物件，甚至是函式。與 `state` 不同的是，`ref` 是一個普通的 `JavaScript` 物件，具有一個可以被讀取與修改的 `current` 屬性。

  - 請注意，組件不會在每次遞增時重新渲染。 與 `state` 一樣，`React` 會在每次重新渲染之間保留 `ref`；但設定 `state` 會重新渲染組件，更改 `ref` 則不會！

## 範例：製作碼錶
  - 可以在單一組件中同時使用 `ref` 和 `state`。舉例來說，製作一個碼錶，讓使用者可以按按鈕來啟動或停止它。為了顯示自使用者按下 `「開始」` 以來經過的時間，需要追蹤按下 `「開始」` 按鈕的時間與目前時間。這項資訊會用於渲染，因此需要把它保存在 `state` 中：

    ```jsx
    const [startTime, setStartTime] = useState(null);
    const [now, setNow] = useState(null);
    ```

  - 當使用者按下 `「開始」` 時，會用 `setInterval` 每 `10` 毫秒更新一次時間。

  - 當按下 `「停止」` 按鈕時，需要取消目前的 `interval`，讓它停止更新 `now` 這個 state 變數，這可以透過呼叫 `clearInterval` 來完成。但需要提供 `interval ID`，這個 `ID` 是先前使用者按下 `「開始」`、呼叫 `setInterval` 時所回傳的，因此需要把 `interval ID` 保存在某個地方。由於 `interval ID` 不會用於渲染，可以把它保存在 `ref` 中：

    ```jsx
    import { useState, useRef } from 'react';

    export default function Stopwatch() {
      const [startTime, setStartTime] = useState(null);
      const [now, setNow] = useState(null);
      const intervalRef = useRef(null);

      function handleStart() {
        setStartTime(Date.now());
        setNow(Date.now());

        clearInterval(intervalRef.current);
        intervalRef.current = setInterval(() => {
          setNow(Date.now());
        }, 10);
      }

      function handleStop() {
        clearInterval(intervalRef.current);
      }

      let secondsPassed = 0;
      if (startTime != null && now != null) {
        secondsPassed = (now - startTime) / 1000;
      }

      return (
        <>
          <h1>經過時間：{secondsPassed.toFixed(3)}</h1>
          <button onClick={handleStart}>開始</button>
          <button onClick={handleStop}>停止</button>
        </>
      );
    }
    ```

  - 當一項資訊用於渲染時，應把它保存在 `state` 中；而當一項資訊只被事件處理函式需要、且更改它不需要觸發重新渲染時，使用 `ref` 可能會更有效率。

## ref 和 state 的不同之處
  - 或許你會覺得 `ref` 似乎沒有 `state` 那樣 `「嚴謹」` —— 例如可以直接改變它，而不必總是使用 `state` 設定函式。但在大多數情況下，建議使用 `state`。`ref` 是一種「脫圍機制」，不會經常用到它。以下是 `state` 與 `ref` 的比較：

    | ref                                             | state                                                                     |
    |-------------------------------------------------|---------------------------------------------------------------------------|
    | `useRef(initialValue)` 回傳 `{ current: initialValue }` | `useState(initialValue)` 回傳 `state` 變數的目前值與一個 `state 設定函式`（`[value, setValue]`） |
    | 更改時不會觸發重新渲染                            | 更改時會觸發重新渲染                                                           |
    | 可變 —— 可以在渲染過程之外修改並更新 `current` 的值 | 「不可變」—— 必須使用 `state` 設定函式來修改 `state` 變數，藉此排入重新渲染          |
    | 不應在渲染期間讀取（或寫入）`current` 值           | 可以隨時讀取 `state`，但每次渲染都有自己不會改變的 `state` 快照                     |

  - 以下是用 `state` 實作的計數器按鈕：因為 `count` 的值會被顯示出來，所以為它使用 `state` 是合理的。當使用 `setCount()` 設定計數器的值時，`React` 會重新渲染組件，畫面也會更新以顯示新的計數。

    ```jsx
    import { useState } from 'react';

    export default function Counter() {
      const [count, setCount] = useState(0);

      function handleClick() {
        setCount(count + 1);
      }

      return (
        <button onClick={handleClick}>
          你點擊了 {count} 次
        </button>
      );
    }
    ```

  - 如果嘗試改用 `ref` 來實作，`React` 永遠不會重新渲染組件，因此永遠看不到計數的變化！這就是為什麼在渲染期間讀取 `ref.current` 會導致程式碼不可靠的原因。如果需要，請改用 `state`。

  :::info 深入探討：`useRef` 內部是如何運作的？
  - 儘管 `useState` 和 `useRef` 都是由 `React` 提供的，原則上 `useRef` 可以建立在 `useState` 之上來實作，可以想像 `React` 內部是這樣實作 `useRef` 的：

    ```jsx
    // React 內部
    function useRef(initialValue) {
      const [ref, unused] = useState({ current: initialValue });
      return ref;
    }
    ```

  - 第一次渲染期間，`useRef` 會回傳 `{ current: initialValue }`。這個物件由 `React` 儲存，因此在下一次渲染期間會回傳相同的物件。請注意，這個範例中並沒有用到 `state` 設定函式，因為 `useRef` 總是需要回傳相同的物件，所以它是不必要的！

  - `React` 提供了內建版本的 `useRef`，因為它在實務上很常見，但你可以把它視為沒有設定函式的一般 `state` 變數。如果你熟悉物件導向程式設計，`ref` 可能會讓你想起實例欄位 —— 只不過寫的不是 `this.something`，而是 `somethingRef.current`。
  :::

## 何時使用 ref
  - 通常，當組件需要「跳出」`React` 並與外部 `API` 通訊時，就會用到 `ref` —— 通常是不會影響組件外觀的瀏覽器 `API`。以下是這些少見情況中的幾個例子：
    - 儲存 `timeout ID`
    - 儲存並操作 `DOM` 元素（將在下一頁介紹）
    - 儲存不需要用來計算 `JSX` 的其他物件

  - 如果組件需要儲存某些值，但這些值不影響渲染邏輯，就選擇 `ref`。

## ref 的最佳實踐
  - 遵循以下原則，能讓組件更具可預測性：
    - `把 ref 視為脫圍機制`。 當你使用外部系統或瀏覽器 `API` 時，`ref` 很有用。如果應用程式中有相當大一部分的邏輯與資料流都依賴 `ref`，或許需要重新考慮做法。
    - `不要在渲染過程中讀取或寫入 ref.current`。 如果渲染過程中需要某些資訊，請改用 `state`。由於 `React` 不知道 `ref.current` 何時發生變化，即使只是在渲染時讀取它，也會讓組件的行為變得難以預測。（唯一的例外是像 `if (!ref.current) ref.current = new Thing()` 這樣的程式碼，它只會在第一次渲染期間設定一次 `ref`。）

  - `React` `state` 的限制並不適用於 `ref`。例如，`state` 就像每次渲染的快照，且不會同步更新；但當你改變 `ref` 的 `current` 值時，它會立即改變：
    ```jsx
    ref.current = 5;
    console.log(ref.current); // 5
    ```

  - 這是因為 `ref` 本身是一個普通的 `JavaScript` 物件，所以它的行為就像物件一樣。

  - 使用 `ref` 時，也不需要擔心避免變更。只要你改變的物件不用於渲染，`React` 就不會在意你對 `ref` 或其內容做了什麼。

## ref 和 DOM
  你可以讓 `ref` 指向任何值，但 `ref` 最常見的用法是存取 `DOM` 元素。例如，如果想以程式化方式聚焦一個輸入框，這種用法就會派上用場。當你把 `ref` 傳給 `JSX` 中的 `ref` 屬性時，例如 `<div ref={myRef}>`，`React` 會把對應的 `DOM` 元素放進 `myRef.current` 中。當元素從 `DOM` 中移除時，`React` 會把 `myRef.current` 更新為 `null`。更多相關內容可以在「[使用 ref 操作 DOM](/pages/f2e/docReact/reactDev/08/reactDev_08_02.html)」中閱讀。

## 重點複習（Recap）
  - `ref` 是一種脫圍機制，用來保留不用於渲染的值，不會經常需要用到它們。
  - `ref` 是一個普通的 `JavaScript` 物件，具有一個名為 `current` 的屬性，可以對其進行讀取或設定。
  - 可以透過呼叫 `useRef` Hook 來讓 `React` 給你一個 `ref`。
  - 與 `state` 一樣，`ref` 讓你能在組件的重新渲染之間保留資訊。
  - 與 `state` 不同的是，設定 `ref` 的 `current` 值不會觸發重新渲染。
  - 不要在渲染過程中讀取或寫入 `ref.current`，這會讓組件難以預測。

## 挑戰（Challenges）
  - #### 1. 修復壞掉的聊天輸入框
    輸入訊息並點擊 `「發送」`，會注意到在看到 `「已發送！」` 提示框之前有 3 秒的延遲，在此延遲期間可以看到一個 `「撤銷」` 按鈕。點擊它，這個`「撤銷」` 按鈕應該要阻止 `「已發送！」` 訊息跳出，它是透過呼叫 `clearTimeout` 來做到這點，這需要使用在 `handleSend` 時保存的 `timeout ID`。但是，即使點擊了「撤銷」，「已發送！」訊息仍然會出現。找出原因並修復它。

    - ##### 原始程式碼
      ```jsx
      import { useState } from 'react';

      export default function Chat() {
        const [text, setText] = useState('');
        const [isSending, setIsSending] = useState(false);
        let timeoutID = null;

        function handleSend() {
          setIsSending(true);
          timeoutID = setTimeout(() => {
            alert('已發送！');
            setIsSending(false);
          }, 3000);
        }

        function handleUndo() {
          setIsSending(false);
          clearTimeout(timeoutID);
        }

        return (
          <>
            <input
              disabled={isSending}
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              disabled={isSending}
              onClick={handleSend}>
              {isSending ? '發送中……' : '發送'}
            </button>
            {isSending &&
              <button onClick={handleUndo}>
                撤销
              </button>
            }
          </>
        );
      }
      ```

    - ##### 提示
      像 `let timeoutID` 這樣的一般變數不會在重新渲染之間 `「存活」` 下來，因為每次渲染都是從頭開始執行組件（並初始化其變數）。 `timeout ID` 是否應該保存在別的地方？

    - ##### 解答
      每當組件重新渲染時（例如設定 `state` 時），所有區域變數都會從頭開始初始化，這就是為什麼不能把 `timeout ID` 保存在像 `timeoutID` 這樣的區域變數中，並期望日後另一個事件處理函式能 `「看到」` 它。正確做法是把它儲存在一個 `ref` 中，`React` 會在渲染之間保留它：

      ```jsx
      import { useState, useRef } from 'react';

      export default function Chat() {
        const [text, setText] = useState('');
        const [isSending, setIsSending] = useState(false);
        const timeoutRef = useRef(null);

        function handleSend() {
          setIsSending(true);
          timeoutRef.current = setTimeout(() => {
            alert('已發送!');
            setIsSending(false);
          }, 3000);
        }

        function handleUndo() {
          setIsSending(false);
          clearTimeout(timeoutRef.current);
        }

        return (
          <>
            <input
              disabled={isSending}
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              disabled={isSending}
              onClick={handleSend}>
              {isSending ? '發送中……' : '發送'}
            </button>
            {isSending &&
              <button onClick={handleUndo}>
                撤銷
              </button>
            }
          </>
        );
      }
      ```

  - #### 2. 修復無法重新渲染的組件
    這個按鈕本該在顯示 `「開」` 和 `「關」` 之間切換，但它卻一直顯示 `「關」`。這段程式碼有什麼問題？請修復它。

    - ##### 原始程式碼
      ```jsx
      import { useRef } from 'react';

      export default function Toggle() {
        const isOnRef = useRef(false);

        return (
          <button onClick={() => {
            isOnRef.current = !isOnRef.current;
          }}>
            {isOnRef.current ? '開' : '關'}
          </button>
        );
      }
      ```

    - ##### 解答
      在這個範例中，`ref` 的 `current` 值被用於計算渲染輸出：`{isOnRef.current ? '開' : '關'}`。這表示這項資訊本來就不該放在 `ref` 中，而應該放在 `state` 裡。修復方式是移除 `ref`，改用 `state`：
      ```jsx
      jsimport { useState } from 'react';

      export default function Toggle() {
        const [isOn, setIsOn] = useState(false);

        return (
          <button onClick={() => {
            setIsOn(!isOn);
          }}>
            {isOn ? '開' : '關'}
          </button>
        );
      }
      ```

  - #### 3. 修復防抖
    - 範例中，所有按鈕的點擊事件處理函式都是 `「防抖的」` 。要理解這代表什麼，請按下其中一個按鈕，會注意到訊息在一秒後才顯示；如果在等待訊息時再次按下按鈕，計時器會重新開始，因此若快速多次點擊同一個按鈕，訊息要等到停止點擊之後的 `1` 秒才會顯示。防抖能讓你把某些動作延後到使用者 `「停止動作」` 之後才執行。

    - 這個範例雖然能運作，但並不完全符合預期。按鈕之間並非各自獨立：點擊其中一個按鈕，接著立即點擊另一個按鈕，本來預期延遲之後會看到兩個按鈕各自的訊息，但只出現了最後一個按鈕的訊息，第一個按鈕的訊息不見了。

    - 為什麼按鈕會互相干擾？請找出並修復問題。
    
    - ##### 原始程式碼
      ```jsx
      let timeoutID;

      function DebouncedButton({ onClick, children }) {
        return (
          <button onClick={() => {
            clearTimeout(timeoutID);
            timeoutID = setTimeout(() => {
              onClick();
            }, 1000);
          }}>
            {children}
          </button>
        );
      }

      export default function Dashboard() {
        return (
          <>
            <DebouncedButton
              onClick={() => alert('宇宙飛船已發射！')}
            >
              發射宇宙飛船
            </DebouncedButton>
            <DebouncedButton
              onClick={() => alert('湯煮好了！')}
            >
              煮點兒湯
            </DebouncedButton>
            <DebouncedButton
              onClick={() => alert('搖籃曲唱完了！')}
            >
              唱首搖籃曲
            </DebouncedButton>
          </>
        )
      }
      ```

    - ##### 提示
      最後一個 `timeout ID` 變數是被所有 `DebouncedButton` 組件共享的，這就是為什麼點擊一個按鈕會重置另一個按鈕的 `timeout` 時間。能否為每個按鈕各自保存一個獨立的 `timeout ID`？

    - ##### 解答
      像 `timeoutID` 這樣的變數是被所有組件共享的，這就是點擊第二個按鈕會重置第一個按鈕尚未完成的 `timeout` 的原因。解決方法是把 `timeout` 保存在 `ref` 中，讓每個按鈕都擁有自己的 `ref`，這樣它們就不會互相衝突：

      ```jsx
      import { useRef } from 'react';

      function DebouncedButton({ onClick, children }) {
        const timeoutRef = useRef(null);
        return (
          <button onClick={() => {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = setTimeout(() => {
              onClick();
            }, 1000);
          }}>
            {children}
          </button>
        );
      }
      ```

      快速點擊兩個按鈕就會發現，兩則訊息都能正確顯示。

  - #### 4. 讀取最新的 state
    - 在這個範例中，按下 `「發送」` 後，訊息顯示前會有一小段延遲。輸入 `「你好」`，按下發送，然後快速地再次修改輸入框內容。儘管進行了編輯，提示框仍會顯示 `「你好」`（也就是按鈕被點擊那一刻 `state` 的值）。

    - 通常這種行為正是應用程式中所需要的，但有時可能需要讓某些非同步程式碼讀取某個 `state` 的最新版本。能否想出一種方法，讓提示框顯示目前的輸入文字，而不是點擊當下的內容？

    - ##### 原始程式碼
      ```jsx
      import { useState, useRef } from 'react';

      export default function Chat() {
        const [text, setText] = useState('');

        function handleSend() {
          setTimeout(() => {
            alert('正在發送：' + text);
          }, 3000);
        }

        return (
          <>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
            />
            <button
              onClick={handleSend}>
              發送
            </button>
          </>
        );
      }

      ```

    - ##### 解答
      `state` 的運作方式就像快照，因此無法從 `timeout` 等非同步操作中讀取最新的 `state`。不過，可以把最新的輸入文字保存在 `ref` 中 —— `ref` 是可變的，因此可以隨時讀取它的 `current` 屬性。由於目前的文字同時也用於渲染，在這個範例中，需要同時使用一個 `state` 變數（用於渲染）和一個 `ref`（供 `timeout` 時讀取），並手動更新目前的 `ref` 值：

      ```jsx
      import { useState, useRef } from 'react';

      export default function Chat() {
        const [text, setText] = useState('');
        const textRef = useRef(text);

        function handleChange(e) {
          setText(e.target.value);
          textRef.current = e.target.value;
        }

        function handleSend() {
          setTimeout(() => {
            alert('正在發送：' + textRef.current);
          }, 3000);
        }

        return (
          <>
            <input
              value={text}
              onChange={handleChange}
            />
            <button onClick={handleSend}>
              發送
            </button>
          </>
        );
      }
      ```
