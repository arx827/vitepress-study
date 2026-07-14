---
title: '[React官網] React 19.2 教程'
---

# 使用自訂義 Hook 複用邏輯
  `React` 有一些內建 `Hook`，例如 `useState`、`useContext` 和 `useEffect`。有時你需要一個用途更特殊的 `Hook`：例如取得資料、記錄使用者是否在線，或連接聊天室。雖然 `React` 中可能沒有這些 `Hook`，但你可以根據應用需求建立自己的 `Hook`。

  :::info 你將會學到：
  - 什麼是自訂 `Hook`，以及如何撰寫
  - 如何在組件間重複使用邏輯
  - 如何為自訂 `Hook` 命名以及如何架構
  - 提取自訂 `Hook` 的時機和原因
  :::

## 自訂 Hook：組件間共享邏輯
  - 假設你正在開發一款重度依賴網路的應用程式（和大多數應用程式一樣）。當使用者使用應用程式時網路意外斷開，你需要提醒他，你會怎麼處理呢？看上去組件需要兩個東西：
    1. 一個追蹤網路是否在線的 `state`。
    2. 一個訂閱全域 `online` 和 `offline` 事件並更新上述 state 的 `Effect`。

  - 這會讓組件與網路狀態保持同步。你也許可以像這樣開始：
    ```jsx
    import { useState, useEffect } from 'react';

    export default function StatusBar() {
      const [isOnline, setIsOnline] = useState(true);
      useEffect(() => {
        function handleOnline() {
          setIsOnline(true);
        }
        function handleOffline() {
          setIsOnline(false);
        }
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
          window.removeEventListener('online', handleOnline);
          window.removeEventListener('offline', handleOffline);
        };
      }, []);

      return <h1>{isOnline ? '✅ 在線' : '❌ 已斷線'}</h1>;
    }
    ```

  - 假設現在你想在另一個不同的組件裡也使用同樣的邏輯：實作一個儲存按鈕，每當網路斷開，這個按鈕就會不可用並顯示 `「Reconnecting...」` 而不是 `「Save progress」`。你可以從複製貼上 `isOnline state` 和 `Effect` 到 `SaveButton` 組件開始。

  - 這兩個組件都能很好地運作，但不幸的是它們的邏輯重複了。它們有不同的視覺外觀，但你依然想複用它們的邏輯。

  - ### 從組件中提取自訂 Hook
    - 假設有一個內建 Hook `useOnlineStatus`，它與 `useState` 和 `useEffect` 相似，那你就可以簡化這兩個組件並移除它們之間的重複部分：

      ```jsx {2,7}
      function StatusBar() {
        const isOnline = useOnlineStatus();
        return <h1>{isOnline ? '✅ 在線' : '❌ 已斷線'}</h1>;
      }

      function SaveButton() {
        const isOnline = useOnlineStatus();

        function handleSaveClick() {
          console.log('✅ 已儲存進度');
        }

        return (
          <button disabled={!isOnline} onClick={handleSaveClick}>
            {isOnline ? '儲存進度' : '重新連接中...'}
          </button>
        );
      }
      ```

    - 儘管目前還沒有這樣的內建 `Hook`，但你可以自己寫。宣告一個 `useOnlineStatus` 函式，並把組件裡早前寫的所有重複程式碼移入該函式，在函式結尾處回傳 `isOnline`，這能讓組件讀取到該值：

      ```jsx {2-16}
      function useOnlineStatus() {
        const [isOnline, setIsOnline] = useState(true);
        useEffect(() => {
          function handleOnline() {
            setIsOnline(true);
          }
          function handleOffline() {
            setIsOnline(false);
          }
          window.addEventListener('online', handleOnline);
          window.addEventListener('offline', handleOffline);
          return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
          };
        }, []);
        return isOnline;
      }
      ```

    - 現在組件裡沒有那麼多的重複邏輯了。更重要的是，組件內部的程式碼描述的是想要做什麼（使用在線狀態！），而不是怎麼做（透過訂閱瀏覽器事件完成）。

    - 當提取邏輯到自訂 `Hook` 時，你可以隱藏如何處理外部系統或瀏覽器 `API` 這些繁瑣的細節。組件內部的程式碼表達的是目標而不是具體實作。
    
  - ### Hook 的名稱必須永遠以 `use` 開頭
    - `React` 應用程式是由組件構成，而組件由內建或自訂 `Hook` 構成。可能你經常使用別人寫的自訂 `Hook`，但偶爾也要自己寫!

    - 你必須遵循以下這些命名公約：
      1. `React 組件名稱必須以大寫字母開頭`，比如 `StatusBar` 和 `SaveButton`。`React` 組件還需要回傳一些 `React` 能夠顯示的內容，比如一段 `JSX`。

      2. `Hook 的名稱必須以 use 開頭`，然後緊跟一個大寫字母，就像內建的 `useState` 或者本文早前的自訂 `useOnlineStatus` 一樣。`Hook` 可以回傳任意值。

    - 這個公約保證你始終能一眼識別出組件並且知道它的 `state`、`Effect` 以及其他的 `React` 特性可能「隱藏」在哪裡。例如若你在組件內部看見 `getColor()` 函式呼叫，就可以確定它裡面不可能包含 `React` `state`，因為它的名稱沒有以 `use` 開頭；但像 `useOnlineStatus()` 這樣的函式呼叫就很可能包含對內部其他 `Hook` 的呼叫!

    :::info 注意
    如果你為 `React` 配置了程式碼檢查工具，它會強制執行這個命名公約 —— 若把 `useOnlineStatus` 重新命名為 `getOnlineStatus`，程式碼檢查工具將不會再允許你在其內部呼叫 `useState` 或 `useEffect`，只有 `Hook` 和組件可以呼叫其他 `Hook`!
    :::

    :::info 深入探討：渲染期間呼叫的所有函式都應該以 `use` 前綴開頭嗎？
    - 不。沒有呼叫 `Hook` 的函式不需要變成 `Hook`。

    - 如果你建立的函式沒有呼叫任何 `Hook` 方法，在命名時應避免使用 `use` 前綴，把它當成一個常規函式去命名。例如一個沒有呼叫任何 `Hook` 方法的函式，更推薦用 `getSorted` 來命名，而非 `useSorted`：
      ```jsx
      // 🔴 避免：沒有呼叫其他 Hook 的 Hook
      function useSorted(items) {
        return items.slice().sort();
      }

      // ✅ 好：沒有使用 Hook 的常規函式
      function getSorted(items) {
        return items.slice().sort();
      }
      ```

    - 這保證你的程式碼可以在包含條件陳述句在內的任何地方呼叫這個常規函式：
      ```jsx
      function List({ items, shouldSort }) {
        let displayedItems = items;
        if (shouldSort) {
          // ✅ 在條件分支裡呼叫 getSorted() 是沒問題的，因為它不是 Hook
          displayedItems = getSorted(items);
        }
        // ...
      }
      ```

    - 哪怕內部只使用了一個 `Hook`，你也應該給這個函式加 `use` 前綴（讓它成為一個 `Hook`）：
      ```jsx
      // ✅ 好：一個使用了其他 Hook 的 Hook
      function useAuth() {
        return useContext(Auth);
      }
      ```

    - 技術上 `React` 對此並不強制要求。原則上你可以寫出不呼叫其他 `Hook` 的 `Hook`，但這常常會難以理解且受限，所以最好避免這種方式。但它在極少數場景下可能是有益的：例如函式目前也許並沒有使用任何 `Hook`，但你計畫未來在該函式內部加入一些 `Hook` 呼叫。那麼使用 `use` 前綴命名就很有意義，接下來組件就不能在條件陳述句裡呼叫這個函式。如果你（現在或之後）沒有計畫在內部使用 `Hook`，請不要讓它變成 `Hook`。
    :::

  - ### 自訂 Hook 共享的是狀態邏輯，而不是狀態本身
    - 之前的例子裡，當你開啟或關閉網路時，兩個組件一起更新了。但兩個組件共享 `state` 變數 `isOnline` 這種想法是錯的：

      ```jsx {2,7}
      function StatusBar() {
        const isOnline = useOnlineStatus();
        // ...
      }

      function SaveButton() {
        const isOnline = useOnlineStatus();
        // ...
      }
      ```

    - 它的運作方式和你之前提取的重複程式碼一模一樣 —— 這是完全獨立的兩個 `state` 變數和 `Effect`!只是碰巧同一時間值一樣，因為你使用了相同的外部值（網路是否開啟）同步兩個組件。

    - 為了更好地說明這一點，需要一個不同的範例。看下面的 `Form` 組件，每個表單欄位都有一部分重複的邏輯：都有一個 `state`（`firstName` 和 `lastName`）、都有 `change` 事件的處理函式、都有為輸入框指定 `value` 和 `onChange` 屬性的 `JSX`。你可以把重複的邏輯提取到自訂 Hook `useFormInput`：
      
      ```jsx
      export function useFormInput(initialValue) {
        const [value, setValue] = useState(initialValue);

        function handleChange(e) {
          setValue(e.target.value);
        }

        const inputProps = {
          value: value,
          onChange: handleChange
        };

        return inputProps;
      }
      ```

    - 注意它只宣告了一個 `state` 變數，叫做 `value`。但 `Form` 組件呼叫了兩次 `useFormInput`：

      ```jsx
      function Form() {
        const firstNameProps = useFormInput('Mary');
        const lastNameProps = useFormInput('Poppins');
        // ...
      ```

    - 這就是為什麼它運作起來像宣告了兩個單獨的 `state` 變數!

    - 自訂 `Hook` 共享的只是狀態邏輯而不是狀態本身。對 `Hook` 的每個呼叫完全獨立於對同一個 `Hook` 的其他呼叫。當你需要在多個組件之間共享 `state` 本身時，需要把變數提升並向下傳遞。

## 在 Hook 之間傳遞響應值
  - 每當組件重新渲染，自訂 `Hook` 中的程式碼就會重新執行。這就是組件和自訂 `Hook` 都需要是純函式的原因。應該把自訂 `Hook` 的程式碼看作組件主體的一部分。

  - 由於自訂 `Hook` 會隨著組件一起重新渲染，所以組件可以一直接收到最新的 `props` 和 `state`。透過一個聊天室的範例，當你修改 `serverUrl` 或 `roomId` 時，`Effect` 會對你的修改做出「反應」並重新同步 —— 你可以透過每次修改 `Effect` 依賴項時聊天室重連的主控台訊息來區分。
  
  - 現在把 `Effect` 程式碼移入自訂 `Hook`：
    ```jsx {2-13}
    export function useChatRoom({ serverUrl, roomId }) {
      useEffect(() => {
        const options = {
          serverUrl: serverUrl,
          roomId: roomId
        };
        const connection = createConnection(options);
        connection.connect();
        connection.on('message', (msg) => {
          showNotification('New message: ' + msg);
        });
        return () => connection.disconnect();
      }, [roomId, serverUrl]);
    }
    ```

  - 這讓 `ChatRoom` 組件呼叫自訂 `Hook`，而不需要擔心內部怎麼運作：
    ```jsx {4-7}
    export default function ChatRoom({ roomId }) {
      const [serverUrl, setServerUrl] = useState('https://localhost:1234');

      useChatRoom({
        roomId: roomId,
        serverUrl: serverUrl
      });
      // ...
    }
    ```

  - 這看上去簡潔多了（但它做的是同一件事）!注意邏輯仍然回應 `props` 和 `state` 的變化。

  - 每次 `ChatRoom` 組件重新渲染，它就會傳最新的 `roomId` 和 `serverUrl` 到你的 `Hook`。這就是每當重新渲染後它們的值不一樣時，你的 `Effect` 會重連聊天室的原因（如果你曾使用過音視訊處理軟體，像這樣的 `Hook` 鏈也許會讓你想起音視訊效果鏈，好似 `useState` 的輸出作為 `useChatRoom` 的輸入）。

  - ### 把事件處理函式傳到自訂 Hook 中
    - 當你在更多組件中使用 `useChatRoom` 時，你可能希望組件能自訂它的行為。例如現在 `Hook` 內部收到訊息的處理邏輯是寫死的。假設你想把這個邏輯移回到組件中，完成這個工作需要修改自訂 `Hook`，把 `onReceiveMessage` 作為其命名選項之一：

      ```jsx {9-11}
      export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
        useEffect(() => {
          const options = {
            serverUrl: serverUrl,
            roomId: roomId
          };
          const connection = createConnection(options);
          connection.connect();
          connection.on('message', (msg) => {
            onReceiveMessage(msg);
          });
          return () => connection.disconnect();
        }, [roomId, serverUrl, onReceiveMessage]); // ✅ 宣告了所有的依賴
      }
      ```

    - 這個修改有效果，但當自訂 `Hook` 接受事件處理函式時，你還可以進一步改進。加入對 `onReceiveMessage` 的依賴並不理想，因為每次組件重新渲染時聊天室就會重新連接。透過把這個事件處理函式包裹到 `Effect Event` 中將它從依賴中移除：

      ```jsx {1,3-4,14,17}
      import { useEffect, useEffectEvent } from 'react';

      export function useChatRoom({ serverUrl, roomId, onReceiveMessage }) {
        const onMessage = useEffectEvent(onReceiveMessage);

        useEffect(() => {
          const options = {
            serverUrl: serverUrl,
            roomId: roomId
          };
          const connection = createConnection(options);
          connection.connect();
          connection.on('message', (msg) => {
            onMessage(msg);
          });
          return () => connection.disconnect();
        }, [roomId, serverUrl]); // ✅ 宣告所有依賴
      }
      ```

    - 現在每次 `ChatRoom` 組件重新渲染時聊天室都不會重連。注意你不再需要為了使用它而去了解 `useChatRoom` 是如何運作的，可以把它加入到其他任意組件，傳遞其他任意選項，而它會以同樣的方式運作。這就是自訂 `Hook` 的強大之處。

## 什麼時候使用自訂 Hook
  - 你沒必要對每段重複的程式碼都提取自訂 `Hook`，一些重複是好的。例如像早前提取的包裹單個 `useState` 呼叫的 `useFormInput` Hook 就沒有必要。

  - 但每當你寫 `Effect` 時，考慮一下把它包裹在自訂 `Hook` 是否更清晰。你不應該經常使用 `Effect`，所以如果你正在寫 `Effect`，就意味著你需要 `「走出 React」` 和某些外部系統同步，或需要做一些 `React` 中沒有對應內建 `API` 的事。把 `Effect` 包裹進自訂 `Hook` 可以準確表達你的目標以及資料在裡面是如何流動的。

  - 例如，假設 `ShippingForm` 組件展示兩個下拉選單：一個顯示城市清單，另一個顯示選中城市的區域清單。儘管這部分程式碼是重複的，但把這些 `Effect` 各自分開是正確的 —— 它們同步兩件不同的事情，所以不應該把它們合併到同一個 `Effect`。而是提取其中的通用邏輯到自己的 `useData` Hook 來簡化上面的 `ShippingForm` 組件：

    ```jsx {2-18}
    function useData(url) {
      const [data, setData] = useState(null);
      useEffect(() => {
        if (url) {
          let ignore = false;
          fetch(url)
            .then(response => response.json())
            .then(json => {
              if (!ignore) {
                setData(json);
              }
            });
          return () => {
            ignore = true;
          };
        }
      }, [url]);
      return data;
    }
    ```

  - 現在你可以在 `ShippingForm` 組件中呼叫 `useData` 取代兩個 `Effect`：
    ```jsx {2,4}
    function ShippingForm({ country }) {
      const cities = useData(`/api/cities?country=${country}`);
      const [city, setCity] = useState(null);
      const areas = useData(city ? `/api/areas?city=${city}` : null);
      // ...
    ```

  - 提取自訂 `Hook` 讓資料流清晰：輸入 `url`，就會輸出 `data`。透過把 `Effect`「隱藏」在 `useData` 內部，你也可以防止一些正在處理 `ShippingForm` 組件的人向裡面加入不必要的依賴。隨著時間的推移，應用程式中大部分 `Effect` 都會存在於自訂 `Hook` 內部。

  :::info 深入探討：讓自訂 Hook 專注於具體的高階用例
  - 從選擇自訂 `Hook` 名稱開始。如果你難以選擇一個清晰的名稱，這可能意味著你的 `Effect` 和組件邏輯剩餘的部分耦合度太高，還沒有做好被提取的準備。

  - 理想情況下，自訂 `Hook` 名稱應該清晰到即使一個不經常寫程式碼的人也能很好地猜中自訂 `Hook` 的功能、輸入和回傳：
    - ✅ `useData`(url)
    - ✅ `useImpressionLog`(eventName, extraData)
    - ✅ `useChatRoom`(options)

  - 當你和外部系統同步的時候，自訂 `Hook` 名稱可能會更加專業，並使用該系統特定的術語：
    - ✅ `useMediaQuery`(query)
    - ✅ `useSocket`(url)
    - ✅ `useIntersectionObserver`(ref, options)

  - 保持自訂 `Hook` 專注於具體的高階用例。避免建立和使用作為 `useEffect` API 本身的替代品和 `wrapper` 的自訂「生命週期」Hook：
    - 🔴 `useMount`(fn)
    - 🔴 `useEffectOnce`(fn)
    - 🔴 `useUpdateEffect`(fn)

  - 例如一個 `useMount` Hook 試圖保證一些程式碼只在「載入」時執行，像 `useMount` 這樣的自訂「生命週期」`Hook` 不是很適合 `React` 範式。這類程式碼常有一個錯誤（它沒有對相依值的變化做出「回應」），但程式碼檢查工具並不會向你發出對應的警告，因為它只能偵測 `useEffect` 的直接呼叫，並不了解你的 `Hook`。

  - 如果你正在撰寫 `Effect`，請從直接使用 `React` API 開始，然後你可以（但不是必須的）為不同的高階用例提取自訂 `Hook`。好的自訂 `Hook` 透過限制功能使程式碼呼叫更具宣告性。如果你的自訂 `Hook` API 沒有約束用例且非常抽象，那麼在長期的運行中，它引入的問題可能比解決的問題更多。
  :::
  
  - ### 自訂 Hook 幫助你遷移到更好的模式
    - `Effect` 是一個脫圍機制：當需要「走出 React」且用例沒有更好的內建解決方案時，你可以使用它們。隨著時間的推移，`React` 團隊的目標是透過給更具體的問題，提供更具體的解決方案，來最小化應用程式中的 `Effect` 數量。把你的 `Effect` 包裹進自訂 `Hook`，當這些解決方案可用時升級程式碼會更加容易。

    - 例如，在早前的範例中，`useOnlineStatus` 借助一組 `useState` 和 `useEffect` 實作，但這不是最好的解決方案：它有許多邊界用例沒有考慮到，例如它認為當組件載入時 `isOnline` 已經為 `true`，但若網路已經離線的話這就是錯誤的。`React` 包含了一個叫做 `useSyncExternalStore` 的專用 API，可以解決這些問題：

      ```jsx
      import { useSyncExternalStore } from 'react';

      function subscribe(callback) {
        window.addEventListener('online', callback);
        window.addEventListener('offline', callback);
        return () => {
          window.removeEventListener('online', callback);
          window.removeEventListener('offline', callback);
        };
      }

      export function useOnlineStatus() {
        return useSyncExternalStore(
          subscribe,
          () => navigator.onLine, // 如何在客戶端取得值
          () => true // 如何在伺服端取得值
        );
      }
      ```

    - 注意你不需要修改任何組件就能完成這次遷移。這是把 `Effect` 包裹進自訂 `Hook` 有益的另一個原因：
      - 你讓進出 `Effect` 的資料流非常清晰。
      - 你讓組件專注於目標，而不是 `Effect` 的準確實作。
      - 當 `React` 增加新特性時，你可以在不修改任何組件的情況下移除這些 `Effect`。

    - 和設計系統相似，你可能會發現從應用程式的組件中提取通用邏輯到自訂 `Hook` 是非常有幫助的。這會讓組件程式碼專注於目標，並避免經常寫原始 `Effect`。許多很棒的自訂 `Hook` 是由 `React` 社群維護的。

  - ### 不止一個方法可以做到
    - 假設你想使用瀏覽器的 `requestAnimationFrame` API 從頭開始實作一個 `fade-in` 動畫。你可以將這樣的邏輯提取到自訂 Hook `useFadeIn` 中讓組件更具可讀性，你也可以進一步重構，把設定動畫循環的邏輯進一步提取到自訂 Hook `useAnimationLoop` 中，甚至可以把大部分必要的邏輯移入一個 `JavaScript` 類別，而不是把邏輯保留在 `Effect` 中。

    - 但這沒有必要這樣做。和常規函式一樣，最終是由你決定在哪裡劃分程式碼不同部分之間的邊界，你也可以採取不一樣的方法。`Effect` 可以連接 `React` 和外部系統。`Effect` 之間的配合越多（例如連結多個動畫），像這樣完整地從 `Effect` 和 `Hook` 中提取邏輯就越有意義，然後你提取的程式碼變成 `「外部系統」`。這會讓你的 `Effect` 保持簡潔，因為它們只需要向已經被你移動到 `React` 外部的系統傳送訊息。

    - 上面這個範例假設需要使用 `JavaScript` 寫 `fade-in` 邏輯，但使用純 `CSS` 動畫實作這個特定的 `fade-in` 動畫會更加簡單和高效。某些時候你甚至不需要 `Hook`!

## 重點複習（Recap）
  - 自訂 `Hook` 讓你可以在組件間共享邏輯。
  - 自訂 `Hook` 命名必須以 `use` 開頭，後面跟一個大寫字母。
  - 自訂 `Hook` 共享的只是狀態邏輯，不是狀態本身。
  - 你可以將響應值從一個 `Hook` 傳到另一個，並且它們會保持最新。
  - 每次組件重新渲染時，所有的 `Hook` 會重新執行。
  - 自訂 `Hook` 的程式碼應該和組件程式碼一樣保持純粹。
  - 把自訂 `Hook` 收到的事件處理函式包裹到 `Effect Event`。
  - 不要建立像 `useMount` 這樣的自訂 `Hook`，保持目標具體化。
  - 如何以及在哪裡選擇程式碼邊界取決於你。

## 挑戰（Challenges）
  - #### 1. 提取 useCounter Hook
    - 這個組件使用了一個 `state` 變數和一個 `Effect` 來展示每秒遞增的一個數字，任務是把這個邏輯提取到一個 `useCounter` 的自訂 `Hook` 中，讓 `Counter` 組件的實作看上去像這樣：

      ```jsx
      export default function Counter() {
        const count = useCounter();
        return <h1>Seconds passed: {count}</h1>;
      }
      ```

    - ##### 解答
      ```jsx
      // useCounter.js
      import { useState, useEffect } from 'react';

      export function useCounter() {
        const [count, setCount] = useState(0);
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + 1);
          }, 1000);
          return () => clearInterval(id);
        }, []);
        return count;
      }
      ```
    
  - #### 2. 讓計時器的 delay 變為可配置項
    範例中有一個由滑桿控制的 `state` 變數 `delay`，但它的值沒有被使用，任務是將 `delay` 值傳給自訂 Hook `useCounter`，修改 `useCounter` Hook，用傳過去的 `delay` 取代寫死的 `1000 毫秒`。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export function useCounter() {
        const [count, setCount] = useState(0);
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + 1);
          }, 1000);
          return () => clearInterval(id);
        }, []);
        return count;
      }
      ```
      
    - ##### 解答
      使用 `useCounter(delay)` 把 `delay` 傳入 `Hook`，在 `Hook` 內部用 `delay` 取代寫死值 1000，並在 `Effect` 依賴項中加入 `delay`，確保 `delay` 的變化會重置 `interval`：
      
      ```jsx
      export function useCounter(delay) {
        const [count, setCount] = useState(0);
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + 1);
          }, delay);
          return () => clearInterval(id);
        }, [delay]);
        return count;
      }
      ```

  - #### 3. 從 useCounter 中提取 useInterval
    現在 `useCounter` Hook 做兩件事：設定一個 `interval`，並在每個 `interval tick` 內遞增一次 `state` 變數。任務是將設定 `interval` 的邏輯拆分到一個獨立 Hook `useInterval`，它應該有兩個參數：`onTick` 回呼函式和 `delay`。

    - ##### 原始程式碼
      ```jsx
      // useCounter.js
      import { useState, useEffect } from 'react';

      export function useCounter(delay) {
        const [count, setCount] = useState(0);
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + 1);
          }, delay);
          return () => clearInterval(id);
        }, [delay]);
        return count;
      }
      ```

    - ##### 解答
      ```jsx {3,7-9}
      // useCounter.js
      import { useState, useEffect } from 'react';
      import { useInterval } from './useInterval.js';

      export function useCounter(delay) {
        const [count, setCount] = useState(0);
        useInterval(() => {
          setCount(c => c + 1);
        }, delay);
        return count;
      }
      ```

      ```jsx
      // useInterval.js
      import { useEffect } from 'react';

      export function useInterval(onTick, delay) {
        useEffect(() => {
          const id = setInterval(onTick, delay);
          return () => clearInterval(id);
        }, [onTick, delay]);
      }
      ```

      注意這個解決方案有一些問題，將在下一個挑戰中解決它們。

  - #### 4. 修復計時器重置
    範例有兩個獨立的計時器：`App` 組件呼叫 `useCounter`，這個 `Hook` 呼叫 `useInterval` 來每秒更新一次計數器；但 `App` 組件也呼叫 `useInterval` 每兩秒隨機更新一次頁面背景色，而更新頁面背景色的回呼函式因為一些原因從未執行過，任務是找出並修復問題。

    - ##### 原始程式碼
      ```jsx
      import { useEffect } from 'react';
      import { useEffectEvent } from 'react';

      export function useInterval(onTick, delay) {
        useEffect(() => {
          const id = setInterval(onTick, delay);
          return () => {
            clearInterval(id);
          };
        }, [onTick, delay]);
      }
      ```

    - ##### 提示
      看上去 `useInterval` Hook 接受事件監聽器作為參數，能否想到一些包裹事件監聽器的方法，讓它不需要成為 `Effect` 的依賴項?

    - ##### 解答
      在 `useInterval` 內部把 `tick` 回呼函式包裹進一個 `Effect Event`，這讓你可以從 `Effect` 的依賴項中刪掉 `onTick`：

      ```jsx
      import { useEffect } from 'react';
      import { useEffectEvent } from 'react';

      export function useInterval(callback, delay) {
        const onTick = useEffectEvent(callback);
        useEffect(() => {
          const id = setInterval(onTick, delay);
          return () => clearInterval(id);
        }, [delay]);
      }
      ```

      每次組件重新渲染時，`Effect` 將不會重新同步，所以兩個 `interval` 都會像預期一樣運作並且不會互相干擾。

  - #### 5. 實作交錯運動
    範例中，`usePointerPosition()` Hook 追蹤目前指標位置，但有 5 個正在被渲染的不同紅點目前都顯示在同一位置，需要實作一個 `「交錯」` 運動：每個圓點應該 `「跟隨」` 它前一個點的路徑。任務是實作自訂 Hook `useDelayedValue`，它應該從 `delay` 毫秒之前回傳 `value`。

    - ##### 原始程式碼
      ```jsx
      import { usePointerPosition } from './usePointerPosition.js';

      function useDelayedValue(value, delay) {
        // TODO: 實現這個 Hook
        return value;
      }

      export default function Canvas() {
        const pos1 = usePointerPosition();
        const pos2 = useDelayedValue(pos1, 100);
        const pos3 = useDelayedValue(pos2, 200);
        const pos4 = useDelayedValue(pos3, 100);
        const pos5 = useDelayedValue(pos3, 50);
        return (
          <>
            <Dot position={pos1} opacity={1} />
            <Dot position={pos2} opacity={0.8} />
            <Dot position={pos3} opacity={0.6} />
            <Dot position={pos4} opacity={0.4} />
            <Dot position={pos5} opacity={0.2} />
          </>
        );
      }

      function Dot({ position, opacity }) {
        return (
          <div style={{
            position: 'absolute',
            backgroundColor: 'pink',
            borderRadius: '50%',
            opacity,
            transform: `translate(${position.x}px, ${position.y}px)`,
            pointerEvents: 'none',
            left: -20,
            top: -20,
            width: 40,
            height: 40,
          }} />
        );
      }
      ```

    - ##### 提示
      你需要在自訂 `Hook` 內部儲存一個 `state` 變數 `delayedValue`，當 `value` 變化時執行一個 `Effect`，該 `Effect` 應該在 `delay` 毫秒後更新 `delayedValue`。這個 `Effect` 需要清理嗎?為什麼?

    - ##### 解答
      ```jsx
      function useDelayedValue(value, delay) {
        const [delayedValue, setDelayedValue] = useState(value);

        useEffect(() => {
          setTimeout(() => {
            setDelayedValue(value);
          }, delay);
        }, [value, delay]);

        return delayedValue;
      }
      ```

      注意這個 `Effect` 不需要清理。如果在清理函式中呼叫了 `clearTimeout`，那每次 `value` 變化時，就會終止已經排定好的 `timeout`。為了保持運動連續，需要觸發所有 `timeout`。