---
title: '[React官網] React 19.2 教程'
---

# 將事件從 Effect 中分開
  事件處理函式只有在你再次執行同樣的互動時才會重新執行。`Effect` 和事件處理函式不一樣,它只有在讀取的 `props` 或 `state` 值和上一次渲染不一樣時才會重新同步。有時你需要這兩種行為的混合體：即一個 `Effect` 只在響應某些值時重新執行，但在其他值變化時不重新執行。本章將教你如何實現這一點。

  :::info 你將會學到：
  - 怎麼在事件處理函式和 `Effect` 之間做選擇
  - 為什麼 `Effect` 是響應式的，而事件處理函式不是
  - 當你想要 `Effect` 的部分程式碼變成非響應式時要做些什麼
  - `Effect Event` 是什麼，以及怎麼從 `Effect` 中提取
  - 怎麼使用 `Effect Event` 讀取最新的 `props` 和 `state`
  :::

## 在事件處理函式和 Effect 中做選擇
  - 首先讓我們回顧一下事件處理函式和 `Effect` 的區別。

  - 假設你正在實作一個聊天室組件，需求如下：
    - 組件應該自動連接選中的聊天室。
    - 每當你點擊 `「Send」` 按鈕，組件應該在目前聊天介面傳送一則訊息。

  - 假設你已經實作了這部分程式碼，但還沒有確定應該放在哪裡。你是應該用事件處理函式還是 `Effect` 呢？每當你需要回答這個問題時，請考慮一下為什麼程式碼需要執行。

  - ### 事件處理函式只在回應特定的互動操作時執行
    - 從使用者角度出發，傳送訊息是因為他點擊了特定的 `「Send」` 按鈕。如果在任意時間或因為其他原因傳送訊息，使用者會覺得非常混亂。這就是為什麼傳送訊息應該使用事件處理函式。事件處理函式是讓你處理特定互動操作的：

      ```jsx {4-6}
      function ChatRoom({ roomId }) {
        const [message, setMessage] = useState('');
        // ...
        function handleSendClick() {
          sendMessage(message);
        }
        // ...
        return (
          <>
            <input value={message} onChange={e => setMessage(e.target.value)} />
            <button onClick={handleSendClick}>Send</button>
          </>
        );
      }
      ```

    - 藉助事件處理函式，你可以確保 `sendMessage(message)` 只在使用者點擊按鈕的時候執行。

  - ### 每當需要同步，Effect 就會執行
    - 回想一下，你還需要讓組件和聊天室保持連接。程式碼放哪裡呢？
    
    - 執行這段程式碼的原因不是特定的互動操作。使用者為什麼或怎麼導航到聊天室畫面都不重要。既然使用者正在看它並且能夠和它互動，組件就要和選中的聊天伺服器保持連接。即使聊天室組件顯示的是應用的初始畫面，使用者根本還沒有執行任何互動，仍然應該需要保持連接。這就是這裡用 `Effect` 的原因：

      ```jsx {3-9}
      function ChatRoom({ roomId }) {
        // ...
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, [roomId]);
        // ...
      }
      ```

    - 無論使用者是否執行指定互動操作，這段程式碼都可以保證目前選中的聊天室伺服器一直有一個活躍連接。使用者是否只啟動了應用、或選中了不同的聊天室、又或者導航到另一個畫面後返回，`Effect` 都可以確保組件和目前選中的聊天室保持同步，並在必要時重新連接。

## 響應式值和響應式邏輯
  - 直觀上，你可以說事件處理函式總是 `「手動」` 觸發的，例如點擊按鈕。另一方面，`Effect` 是自動觸發：每當需要保持同步時它們就會開始執行和重新執行。

  - 有一個更精確的方式來考慮這個問題。

  - 組件內部宣告的 `state` 和 `props` 變數被稱為響應式值。本範例中的 `serverUrl` 不是響應式值，但 `roomId` 和 `message` 是，它們參與組件的渲染資料流。

  - 像這樣的響應式值可能因為重新渲染而變化。例如使用者可能會編輯 `message`，或在下拉選單中選中不同的 `roomId`。事件處理函式和 `Effect` 對於變化的回應是不一樣的：
    - 事件處理函式內部的邏輯是非響應式的。除非使用者又執行了同樣的操作（例如點擊），否則這段邏輯不會再執行。事件處理函式可以在「不回應」它們變化的情況下讀取響應式值。
    - `Effect` 內部的邏輯是響應式的。如果 `Effect` 要讀取響應式值，你必須把它指定為依賴項。如果接下來的重新渲染引起那個值變化，`React` 就會使用新值重新執行 `Effect` 內的邏輯。

  - ### 事件處理函式內部的邏輯是非響應式的
    - 從使用者角度出發，`message` 的變化並不意味著他們想要傳送訊息。它只能表明使用者正在輸入。換句話說，傳送訊息的邏輯不應該是響應式的，它不應該僅僅因為響應式值變化而再次執行，這就是應該把它歸入事件處理函式的原因：

      ```jsx {2}
      function handleSendClick() {
        sendMessage(message);
      }
      ```

    - 事件處理函式是非響應式的，所以 `sendMessage(message)` 只會在使用者點擊 `「Send」` 按鈕的時候執行。

  - ### Effect 內部的邏輯是響應式的
    - 從使用者角度出發，`roomId` 的變化意味著他們的確想要連接到不同的房間。換句話說，連接房間的邏輯應該是響應式的。你需要這幾行程式碼和響應式值「保持同步」，並在值不同時再次執行，這就是它被歸入 `Effect` 的原因：

      ```jsx {2-3}
      useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => {
          connection.disconnect()
        };
      }, [roomId]);
      ```

    - `Effect` 是響應式的，所以 `createConnection(serverUrl, roomId)` 和 `connection.connect()` 會因為 `roomId` 每個不同的值而執行。`Effect` 讓聊天室連接和目前選中的房間保持了同步。

## 從 Effect 中提取非響應式邏輯
  - 當你想混合使用響應式邏輯和非響應式邏輯時，事情變得更加棘手。

  - 例如，假設你想在使用者連接到聊天室時展示一則通知，並透過從 `props` 中讀取目前 `theme（dark 或 light）` 來展示對應顏色的通知：

    ```jsx {1,4-6}
    function ChatRoom({ roomId, theme }) {
      useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.on('connected', () => {
          showNotification('Connected!', theme);
        });
        connection.connect();
        // ...
    ```

  - 但 `theme` 是一個響應式值（它會因重新渲染而變化），並且 `Effect` 讀取的每一個響應式值都必須在其依賴項中宣告。現在必須把 `theme` 作為 `Effect` 的依賴項之一：

    ```jsx {4,10}
    useEffect(() => {
      const connection = createConnection(serverUrl, roomId);
      connection.on('connected', () => {
        showNotification('Connected!', theme);
      });
      connection.connect();
      return () => {
        connection.disconnect()
      };
    }, [roomId, theme]); // ✅ 宣告所有依賴項
    ```

  - 當 `roomId` 變化時，聊天會如預期重新連接。但由於 `theme` 也是一個依賴項，所以每次在 `dark` 和 `light` 主題間切換時，聊天也會重連，這不是很好!

  - 換言之，即使它在 `Effect` 內部（這是響應式的），你也不想讓這行程式碼變成響應式：

    ```jsx
    showNotification('Connected!', theme);
    ```

  - 你需要一個把這個非響應式邏輯和周圍響應式 `Effect` 隔離開來的方法。

  - ### 宣告一個 Effect Event
    - 使用 `useEffectEvent` 這個特殊的 `Hook` 從 `Effect` 中提取非響應式邏輯：
      ```jsx {1,4-6}
      import { useEffect, useEffectEvent } from 'react';

      function ChatRoom({ roomId, theme }) {
        const onConnected = useEffectEvent(() => {
          showNotification('Connected!', theme);
        });
        // ...
      ```

    - 這裡的 `onConnected` 被稱為 `Effect Event`。它是 `Effect` 邏輯的一部分，但其行為更像事件處理函式。它內部的邏輯不是響應式的，而且能一直「看見」最新的 `props` 和 `state`。

    - 現在你可以在 `Effect` 內部呼叫 `onConnected` 這個 `Effect Event`：
      ```jsx {2-4,9,13}
      function ChatRoom({ roomId, theme }) {
        const onConnected = useEffectEvent(() => {
          showNotification('Connected!', theme);
        });

        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.on('connected', () => {
            onConnected();
          });
          connection.connect();
          return () => connection.disconnect();
        }, [roomId]); // ✅ 宣告所有依賴項
        // ...
      ```

    - 這個方法解決了問題。注意你必須從 `Effect` 依賴項中移除 `theme`，因為 `Effect` 中沒有使用它。你也不需要加入 `onConnected`，因為 `Effect Event` 是非響應式的，並且必須從依賴項中刪除。

    - 你可以把 `Effect Event` 看成和事件處理函式相似的東西。主要區別是事件處理函式只在回應使用者互動的時候執行，而 `Effect Event` 是你在 `Effect` 中觸發的。`Effect Event` 讓你在 `Effect` 響應性和不應是響應式的程式碼間「打破鏈條」。

  - ### 使用 Effect Event 讀取最新的 props 和 state
    - `Effect Event` 可以修復之前許多你可能試圖抑制依賴項檢查工具的地方。

    - 例如，假設你有一個記錄頁面造訪的 `Effect`：
      ```jsx
      function Page() {
        useEffect(() => {
          logVisit();
        }, []);
        // ...
      }
      ```

    - 稍後向你的站點加入多個路由，現在 `Page` 組件接收包含目前路徑的 `url props`。你想把 `url` 作為 `logVisit` 呼叫的一部分傳遞，但依賴項檢查工具會提示缺少依賴項。想想你想要程式碼做什麼：你需要為不同的 `URL` 記錄單獨的造訪，因為每個 `URL` 代表不同的頁面。換言之，`logVisit` 呼叫對於 `url` 應該是響應式的，這就是為什麼在這種情況下，遵循依賴項檢查工具並加入 `url` 作為依賴項很有意義：

      ```jsx {1,3}
      function Page({ url }) {
        useEffect(() => {
          logVisit(url);
        }, [url]); // ✅ 宣告所有依賴項
        // ...
      }
      ```

    - 現在假設你想在每次頁面造訪中包含購物車中的商品數量：
      ```jsx {2-3,6}
      function Page({ url }) {
        const { items } = useContext(ShoppingCartContext);
        const numberOfItems = items.length;

        useEffect(() => {
          logVisit(url, numberOfItems);
        }, [url]); // 🔴 React Hook useEffect 缺少依賴項：'numberOfItems'
        // ...
      }
      ```

    - 你在 `Effect` 內部使用了 `numberOfItems`，所以程式碼檢查工具會讓你把它加到依賴項中。但你不想要 `logVisit` 呼叫回應 `numberOfItems`。如果使用者把某樣東西放入購物車，`numberOfItems` 會變化，這並不意味著使用者再次造訪了這個頁面。換句話說，在某種意義上，造訪頁面是一個 `「事件」`，它發生在某個準確的時刻。

    - 把程式碼分割為兩部分：
      ```jsx {5-7,10}
      function Page({ url }) {
        const { items } = useContext(ShoppingCartContext);
        const numberOfItems = items.length;

        const onVisit = useEffectEvent(visitedUrl => {
          logVisit(visitedUrl, numberOfItems);
        });

        useEffect(() => {
          onVisit(url);
        }, [url]); // ✅ 宣告所有依賴項
        // ...
      }
      ```

    - 這裡的 `onVisit` 是一個 `Effect Event`。裡面的程式碼不是響應式的，這就是為什麼你可以使用 `numberOfItems`（或任意響應式值!）而不用擔心引起周圍程式碼因為變化而重新執行。

    - 另一方面，`Effect` 本身仍然是響應式的。其內部的程式碼使用了 `url props`，所以每次因為不同的 `url` 重新渲染後 `Effect` 都會重新執行，這會依次呼叫 `onVisit` 這個 `Effect Event`。

    - 結果是你會因為 `url` 的變化去呼叫 `logVisit`，並且讀取的一直都是最新的 `numberOfItems`。但若 `numberOfItems` 自己變化，不會引起任何程式碼的重新執行。

    :::info 注意
    你可能想知道是否可以無參數呼叫 `onVisit()` 並讀取內部的 `url`，這可以起作用，但更好的方法是把這個 `url` 明確傳給 `Effect Event`。透過把 `url` 作為參數傳給 `Effect Event`，你可以說從使用者角度來看，使用不同的 `url` 造訪頁面構成了一個獨立的「事件」。由於 `Effect` 明確「要求」`visitedUrl`，所以現在你不會不小心地從 `Effect` 的依賴項中移除 `url`。如果你移除了 `url` 依賴項（導致不同的頁面造訪被認為是一個），程式碼檢查工具會向你提出警告。
    :::

    :::info 深入探討：抑制依賴項檢查是可行的嗎?
    - 在已經存在的程式碼庫中，你可能有時會看見像這樣的檢查規則抑制：
      ```jsx {3-5}
      useEffect(() => {
        logVisit(url, numberOfItems);
        // 🔴 避免像這樣抑制程式碼檢查:
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [url]);
      ```

    - 我們建議永遠不要抑制程式碼檢查工具。

    - 抑制規則的第一個缺點是，當 `Effect` 需要對一個已經在程式碼中出現過的新響應式依賴項做出「回應」時，`React` 不會再發出警告。這會引起 `bug`。

    - 一個範例展示了由抑制程式碼檢查引起的奇怪 `bug`：`handleMove` 應該讀取目前的 `state` 變數 `canMove` 的值來決定這個點是否應該跟隨游標，但 `handleMove` 中的 `canMove` 一直是 `true`。

    - 問題在於抑制依賴項檢查。如果移除，可以看到 `Effect` 應該依賴於 `handleMove` 函式，因為 `handleMove` 是在組件內宣告的響應式值，而每個響應式值都必須被指定為依賴項，否則它可能會隨著時間而過時!

    - 原始程式碼對 `React`「撒謊」說 `Effect` 不依賴於任何響應式值（`[]`）。這就是為什麼 `canMove`（以及 `handleMove`）變化後 `React` 沒有重新同步。因為 `React` 沒有重新同步 `Effect`，附加的監聽器還是初次渲染期間建立的 `handleMove` 函式，而初次渲染期間 `canMove` 的值是 `true`，這就是為什麼來自初次渲染的 `handleMove` 永遠只能看到這個值。

    - 如果你從來沒有抑制程式碼檢查，就永遠不會遇見過期值的問題。 有了 `useEffectEvent`，就不需要對程式碼檢查工具「說謊」，程式碼也能和預期一樣運作：

      ```jsx
      const onMove = useEffectEvent(e => {
        if (canMove) {
          setPosition({ x: e.clientX, y: e.clientY });
        }
      });

      useEffect(() => {
        window.addEventListener('pointermove', onMove);
        return () => window.removeEventListener('pointermove', onMove);
      }, []);
      ```

    - 這不意味著 `useEffectEvent` 總是正確的解決方案，你只能把它用在你不需要變成響應式的程式碼上。

  - ### Effect Event 的局限性
    - `Effect Event` 的局限性在於你如何使用它們：
      - 只在 `Effect` 內部呼叫它們。
      - 永遠不要把它們傳給其他組件或 Hook。

    - 不要像這樣宣告和傳遞 `Effect Event`：
      ```jsx {4-6,8}
      function Timer() {
        const [count, setCount] = useState(0);

        const onTick = useEffectEvent(() => {
          setCount(count + 1);
        });

        useTimer(onTick, 1000); // 🔴 避免：傳遞 Effect Event
        return <h1>{count}</h1>
      }

      function useTimer(callback, delay) {
        useEffect(() => {
          const id = setInterval(() => {
            callback();
          }, delay);
          return () => {
            clearInterval(id);
          };
        }, [delay, callback]); // 需要在依賴項中指定 “callback”
      }
      ```

    - 取而代之的是，永遠直接在使用它們的 `Effect` 旁邊宣告 `Effect Event`：
      ```jsx {2-4,8,13}
      function useTimer(callback, delay) {
        const onTick = useEffectEvent(() => {
          callback();
        });

        useEffect(() => {
          const id = setInterval(() => {
            onTick(); // ✅ 好：只在 Effect 內部局部呼叫
          }, delay);
          return () => {
            clearInterval(id);
          };
        }, [delay]); // 不需要指定「onTick」（Effect Event）作為依賴項
      }
      ```

    - `Effect Event` 是 `Effect` 程式碼的非響應式「片段」，它們應該在使用它們的 `Effect` 旁邊。

## 重點複習（Recap）
  - 事件處理函式在回應特定互動時執行。
  - `Effect` 在需要同步的時候執行。
  - 事件處理函式內部的邏輯是非響應式的。
  - `Effect` 內部的邏輯是響應式的。
  - 你可以把非響應式邏輯從 `Effect` 移到 `Effect Event` 中。
  - 只在 `Effect` 內部呼叫 `Effect Event`。
  - 不要把 `Effect Event` 傳給其他組件或 `Hook`。

## 挑戰（Challenges）
  - #### 1. 修復一個不更新的變數
    `Timer` 組件保存了一個 `count` 的 `state` 變數，這個變數每秒增加一次，每次增加的值儲存在 `increment state` 變數中，可以用加減按鈕控制。但無論點擊加號按鈕多少次，計數器每秒都只增加 `1`，任務是找出並修復這個問題。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function Timer() {
        const [count, setCount] = useState(0);
        const [increment, setIncrement] = useState(1);

        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + increment);
          }, 1000);
          return () => {
            clearInterval(id);
          };
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
          <>
            <h1>
              Counter: {count}
              <button onClick={() => setCount(0)}>Reset</button>
            </h1>
            <hr />
            <p>
              Every second, increment by:
              <button disabled={increment === 0} onClick={() => {
                setIncrement(i => i - 1);
              }}>–</button>
              <b>{increment}</b>
              <button onClick={() => {
                setIncrement(i => i + 1);
              }}>+</button>
            </p>
          </>
        );
      }
      ```
      
    - ##### 提示
      修復這段程式碼，必須充分遵循這些規則。

    - ##### 解答
      - 若移除抑制注解，`React` 就會告訴你這個 `Effect` 的程式碼依賴於 `increment`，但你透過宣稱這個 `Effect` 不依賴於響應式值（`[]`）「欺騙」了 `React`。修復方式是把 `increment` 加入依賴項陣列：

        ```jsx
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + increment);
          }, 1000);
          return () => {
            clearInterval(id);
          };
        }, [increment]);
        ```

      - 現在當 `increment` 變化時，`React` 會重新同步這個 `Effect`，這會重啟 `interval`。

  - #### 2. 修復一個凍結的計數器
    `Timer` 組件的計時器有一個小問題：如果每秒內按壓加減按鈕不止一次，計時器本身似乎就會暫停，只在最後一次按壓按鈕的一秒後恢復。任務是找出原因並修復，讓計時器能每秒滴答作響而不中斷。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { useEffectEvent } from 'react';

      export default function Timer() {
        const [count, setCount] = useState(0);
        const [increment, setIncrement] = useState(1);

        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + increment);
          }, 1000);
          return () => {
            clearInterval(id);
          };
        }, [increment]);

        return (
          <>
            <h1>
              Counter: {count}
              <button onClick={() => setCount(0)}>Reset</button>
            </h1>
            <hr />
            <p>
              Every second, increment by:
              <button disabled={increment === 0} onClick={() => {
                setIncrement(i => i - 1);
              }}>–</button>
              <b>{increment}</b>
              <button onClick={() => {
                setIncrement(i => i + 1);
              }}>+</button>
            </p>
          </>
        );
      }
      ```

    - ##### 提示
      似乎設定計時器的 `Effect` 對 `increment` 值的變化做出了「回應」。為了呼叫 `setCount` 而使用目前 `increment` 值的程式碼行真的需要是響應式嗎?

    - ##### 解答
      - 問題在於 `Effect` 內部的程式碼使用了 `increment` 這個 `state` 變數。因為它是 `Effect` 的一個依賴項，每次 `increment` 變化都會引起 `Effect` 重新同步，這引起了 `interval` 清理。解法是從 `Effect` 中提取一個 `Effect Event` `onTick`：

        ```jsx
        const onTick = useEffectEvent(() => {
          setCount(c => c + increment);
        });

        useEffect(() => {
          const id = setInterval(() => {
            onTick();
          }, 1000);
          return () => {
            clearInterval(id);
          };
        }, []);
        ```
  
      - 由於 `onTick` 是一個 `Effect Event`，所以內部的程式碼是非響應式的，`increment` 的變化不會觸發任何 `Effect`。  

  - #### 3. 修復不可調整的延遲
    範例中可以自訂 `interval` 延遲，但即使把 `delay` 調到 `1000 毫秒`，計時器仍然 `每 100 ms` 快速增加，對 `delay` 的修改好像被忽略了。任務是找出並修復這個 `bug`。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { useEffectEvent } from 'react';

      export default function Timer() {
        const [count, setCount] = useState(0);
        const [increment, setIncrement] = useState(1);
        const [delay, setDelay] = useState(100);

        const onTick = useEffectEvent(() => {
          setCount(c => c + increment);
        });

        const onMount = useEffectEvent(() => {
          return setInterval(() => {
            onTick();
          }, delay);
        });

        useEffect(() => {
          const id = onMount();
          return () => {
            clearInterval(id);
          }
        }, []);

        return (
          <>
            <h1>
              Counter: {count}
              <button onClick={() => setCount(0)}>Reset</button>
            </h1>
            <hr />
            <p>
              Increment by:
              <button disabled={increment === 0} onClick={() => {
                setIncrement(i => i - 1);
              }}>–</button>
              <b>{increment}</b>
              <button onClick={() => {
                setIncrement(i => i + 1);
              }}>+</button>
            </p>
            <p>
              Increment delay:
              <button disabled={delay === 100} onClick={() => {
                setDelay(d => d - 100);
              }}>–100 ms</button>
              <b>{delay} ms</b>
              <button onClick={() => {
                setDelay(d => d + 100);
              }}>+100 ms</button>
            </p>
          </>
        );
      }
      ```

    - ##### 提示
      `Effect Event` 內部的程式碼是非響應式的。哪些情況下你會想要 `setInterval` 呼叫重新執行呢?

    - ##### 解答
      - 問題在於範例沒有考慮程式碼實際正在做什麼，就直接提取了一個叫做 `onMount` 的 `Effect Event`。你應該只為特定的原因提取 `Effect Event`：想讓程式碼的一部分成為非響應式。但 `setInterval` 呼叫對 `state` 變數 `delay` 的變化應該是響應式的 —— 若 `delay` 變化了，就該想重新設定 `interval`!修復方式是把所有響應式程式碼放回 `Effect` 內部：

        ```jsx
        const onTick = useEffectEvent(() => {
          setCount(c => c + increment);
        });

        useEffect(() => {
          const id = setInterval(() => {
            onTick();
          }, delay);
          return () => {
            clearInterval(id);
          }
        }, [delay]);
        ```

      - 總的來說，應該對像 `onMount` 這樣主要關注執行時機而非目的的函式持懷疑態度。根據經驗來說，`Effect Event` 應該對應從「使用者的」角度發生的事情，例如 `onMessage`、`onTick`、`onVisit` 或 `onConnected` 是優秀的 `Effect Event` 名稱；而 `onMount`、`onUpdate`、`onUnmount` 或 `onAfterRender` 太通用，容易不小心把應該是響應式的程式碼放入其中。因此應該用使用者想要什麼發生來為 `Effect Event` 命名，而不是用某些程式碼正好執行的時機命名。

  - #### 4. 修復延遲通知
    當你加入一個聊天室時，組件會展示一則通知，但會人工延遲 `2 秒鐘`。若快速將下拉選單從 `「general」` 變成 `「travel」` 再變成 `「music」`，雖然會看到兩個通知，但兩個都顯示`「Welcome to music」`。任務是修復它，讓快速切換時能看見正確的兩個通知：第一個是 `「Welcome to travel」`，第二個是 `「Welcome to music」`（額外挑戰:假設已讓通知顯示正確房間，請修改程式碼只展示後面的通知）。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { useEffectEvent } from 'react';
      import { createConnection, sendMessage } from './chat.js';
      import { showNotification } from './notifications.js';

      const serverUrl = 'https://localhost:1234';

      function ChatRoom({ roomId, theme }) {
        const onConnected = useEffectEvent(() => {
          showNotification('Welcome to ' + roomId, theme);
        });

        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.on('connected', () => {
            setTimeout(() => {
              onConnected();
            }, 2000);
          });
          connection.connect();
          return () => connection.disconnect();
        }, [roomId]);

        return <h1>Welcome to the {roomId} room!</h1>
      }

      export default function App() {
        const [roomId, setRoomId] = useState('general');
        const [isDark, setIsDark] = useState(false);
        return (
          <>
            <label>
              Choose the chat room:{' '}
              <select
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              >
                <option value="general">general</option>
                <option value="travel">travel</option>
                <option value="music">music</option>
              </select>
            </label>
            <label>
              <input
                type="checkbox"
                checked={isDark}
                onChange={e => setIsDark(e.target.checked)}
              />
              Use dark theme
            </label>
            <hr />
            <ChatRoom
              roomId={roomId}
              theme={isDark ? 'dark' : 'light'}
            />
          </>
        );
      }
      ```

    - ##### 提示
      你的 `Effect` 知道它連接的是哪一個房間，有沒有任何你可能想要傳給 `Effect Event` 的資訊?

    - ##### 解答
      - 在 `Effect Event` 內部，`roomId` 是 `Effect Event` 被呼叫時刻的值。`Effect Event` 伴隨著兩秒的延遲被呼叫，若快速從 `travel` 切換到 `music` 聊天室，直到 `travel` 聊天室的通知顯示出來，`roomId` 已經是 `「music」` 了，這就是為什麼兩個通知都是 `「Welcome to music」`。

      - 修復方式是不要在 `Effect Event` 裡面讀取最新的 `roomId`，而是讓它成為 `Effect Event` 的參數，透過呼叫 `onConnected(roomId)` 把 `roomId` 從 `Effect` 中傳入：

        ```jsx
        const onConnected = useEffectEvent(connectedRoomId => {
          showNotification('Welcome to ' + connectedRoomId, theme);
        });

        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.on('connected', () => {
            setTimeout(() => {
              onConnected(roomId);
            }, 2000);
          });
          connection.connect();
          return () => connection.disconnect();
        }, [roomId]);
        ```

      - 額外挑戰的解法，是保存通知的 `timeout ID`，並在 `Effect` 的清理函式中清理它：

        ```jsx
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          let notificationTimeoutId;
          connection.on('connected', () => {
            notificationTimeoutId = setTimeout(() => {
              onConnected(roomId);
            }, 2000);
          });
          connection.connect();
          return () => {
            connection.disconnect();
            if (notificationTimeoutId !== undefined) {
              clearTimeout(notificationTimeoutId);
            }
          };
        }, [roomId]);
        ```

      - 這確保了當你修改聊天室時，已經排定（但還沒展示）的通知會被取消。