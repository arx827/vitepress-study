---
title: '[React官網] React 19.2 教程'
---

# 使用 Effect 進行同步
  有些組件需要與外部系統同步。例如，你可能希望根據 React `state` 控制非 `React` 組件、建立伺服器連線，或在組件於頁面顯示時傳送分析日誌。`Effect` 讓你可以在渲染結束後執行一些程式碼，藉此把組件與 `React` 外部的某個系統同步。

  :::info 你將會學到：
  - 什麼是 `Effect`
  - `Effect` 與事件（event）有何不同
  - 如何在組件中宣告 `Effect`
  - 如何避免不必要地重新執行 `Effect`
  - 為什麼 `Effect` 在開發環境中會執行兩次，以及如何處理這個情況
  :::

## 什麼是 Effect，它與事件（event）有何不同？
  - 在接觸 `Effect` 之前，需要先熟悉 `React` 組件中的兩種邏輯類型：
    - ###### 渲染程式碼
      位於組件的最上層，用來處理 `props` 與 `state`，對它們進行轉換，並回傳希望在頁面上顯示的 `JSX`。渲染程式碼必須是純粹的 —— 就像數學公式一樣，只應該 `「計算」` 結果，而不做其他任何事。

    - ###### 事件處理函式
      是組件內部的巢狀函式，它們不只進行計算，還會執行一些操作。事件處理函式可能會更新輸入欄位、送出 `HTTP POST` 請求來購買產品，或把使用者導向另一個頁面。事件處理函式包含由特定使用者操作（例如按鈕點擊或輸入）所引起的「副作用」。

  - 有時這還不夠。考慮一個 `ChatRoom` 組件，它在頁面上顯示時必須連接到聊天伺服器。連接到伺服器並非純粹的計算（這是一個副作用），因此它不能在渲染期間發生。然而，並沒有一個特定的事件（例如點擊）能讓 `ChatRoom` 被顯示。

  - `Effect` 讓你能指定由渲染本身、而非特定事件所引起的副作用。在聊天中送出訊息是一個 `「事件」`，因為它是由使用者點擊特定按鈕直接引起的；然而建立伺服器連線是一個 `Effect`，因為無論是哪種互動促成組件出現，它都應該發生。`Effect` 是在提交結束後、頁面更新後才執行，此時正是把 `React` 組件與外部系統（如網路或第三方函式庫）同步的最佳時機。

  :::info 注意
  在本文與後續文章中，大寫的 `Effect` 是 `React` 中的專有定義 —— 由渲染引起的副作用；至於更廣泛的程式設計概念（任何改變程式狀態或外部系統的行為），則使用 `「副作用（side effect）」` 來指稱。
  :::

## 你可能不需要 Effect
  - 不要急著在組件中使用 `Effect`。記住，`Effect` 通常是用來暫時「跳出」React、並與一些外部系統同步的，這包括瀏覽器 API、第三方元件，以及網路等等。如果你的 `Effect` 只是根據其他狀態調整某些狀態，那麼你可能並不需要一個 `Effect`。

## 如何撰寫 Effect
  - 要撰寫一個 `Effect`，請遵循以下三個步驟：
    - `宣告 Effect`。通常 `Effect` 會在每次提交後執行。
    - `指定 Effect 的依賴項`。大多數 `Effect` 應該按需執行，而非每次渲染後都執行。例如，淡入動畫應該只在組件出現時觸發；連接與斷開伺服器的操作，應該只在組件出現、消失，或切換聊天室時才執行 —— 你將透過指定依賴項來學會如何控制這一點。
    - `必要時加入清理操作`。有些 `Effect` 需要指定該如何停止、撤銷或清除它們所執行的操作。例如「連線」需要 `「斷線」`、「訂閱」需要 `「退訂」`，而「取得資料」需要 `「取消」` 或 `「忽略」`。你將學會如何透過回傳一個清理函式來實現這些。

  - ### 第一步：宣告 Effect
    - 先從 `React` 匯入 `useEffect` Hook：
      ```jsx
      import { useEffect } from 'react';
      ```

    - 再於組件最上層呼叫它，並在其中加入一些程式碼：
      ```jsx {2-4}
      function MyComponent() {
        useEffect(() => {
          // 每次渲染後都會執行此處的程式碼
        });
        return <div />;
      }
      ```

    - 每當組件渲染時，`React` 會先更新頁面，接著才執行 `useEffect` 中的程式碼。換句話說，`useEffect` 會 `「延遲」` 一段程式碼的執行，直到渲染結果反映在頁面上。

    - 考慮一個 `<VideoPlayer>` React 組件，透過傳入 `isPlaying prop` 來控制它播放或暫停。但瀏覽器的 `<video>` 標籤沒有 `isPlaying` 屬性，控制它的唯一方式是在 `DOM` 元素上呼叫 `play()` 和 `pause()` 方法。因此，需要把 `isPlaying prop` 的值與 `play()`、`pause()` 等函式的呼叫進行同步。

      ```jsx
      function VideoPlayer({ src, isPlaying }) {
        // TODO：使用 isPlaying 做一些事情
        return <video src={src} />;
      }
      ```

    - 若嘗試在渲染期間呼叫 `play()` 或 `pause()`，這樣做是不對的，因為這試圖在渲染期間對 `DOM` 節點進行操作 —— 渲染應該是純粹的計算 `JSX`，不應該包含像修改 `DOM` 這樣的副作用。而且，第一次呼叫 `VideoPlayer` 時，對應的 `DOM` 節點根本還不存在！

    - 解決辦法是用 `useEffect` 包裹副作用，把它從渲染邏輯的計算過程中分離出來：
      ```jsx
      import { useEffect, useRef } from 'react';

      function VideoPlayer({ src, isPlaying }) {
        const ref = useRef(null);

        useEffect(() => {
          if (isPlaying) {
            ref.current.play();
          } else {
            ref.current.pause();
          }
        });

        return <video ref={ref} src={src} loop playsInline />;
      }
      ```

    - 把 `DOM` 更新封裝在 `Effect` 中，就能讓 `React` 先更新頁面，然後才執行 `Effect`。
      ```jsx
      import { useState, useRef, useEffect } from 'react';

      function VideoPlayer({ src, isPlaying }) {
        const ref = useRef(null);

        useEffect(() => {
          if (isPlaying) {
            ref.current.play();
          } else {
            ref.current.pause();
          }
        });

        return <video ref={ref} src={src} loop playsInline />;
      }

      export default function App() {
        const [isPlaying, setIsPlaying] = useState(false);
        return (
          <>
            <button onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? '暂停' : '播放'}
            </button>
            <VideoPlayer
              isPlaying={isPlaying}
              src="https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4"
            />
          </>
        );
      }
      ```

    - 在這個範例中，同步到 React `state` 的「外部系統」是瀏覽器的媒體 API，也可以用類似的方法把傳統的非 React 程式碼（例如 jQuery 外掛）封裝成宣告式的 React 組件。

    :::info 陷阱
    預設情況下，`Effect` 會在每次渲染後執行，正因如此，以下程式碼會陷入死循環：
    
    ```jsx
    const [count, setCount] = useState(0);
    useEffect(() => {
      setCount(count + 1);
    });
    ```

    - `Effect` 在渲染結束後執行，更新 `state` 會觸發重新渲染，在 `Effect` 中直接更新 `state`，就像把電源插頭插回自己身上：`Effect` 執行、更新 `state`、觸發重新渲染、進而再次觸發 `Effect`、再次更新 `state`……如此反覆，形成死循環。
    
    - `Effect` 應該用於把組件與外部系統保持同步；如果沒有外部系統、只是想根據其他狀態調整某些狀態，那你或許不需要 `Effect`。
    :::

  - ### 第二步：指定 Effect 的依賴項
    - 預設情況下，`Effect` 會在每次渲染後執行，但這往往並非所需要的行為：
      - `有時它可能很慢` —— 與外部系統的同步並非總是即時的，因此不必要時應該跳過它。例如，不會想在每次打字時都重新連接聊天伺服器。
      - `有時它可能會出錯`，例如，不會想在每次按鍵時都觸發組件的淡入動畫，動畫應該只在組件首次出現時播放。

    - 透過在呼叫 `useEffect` 時指定一個依賴陣列作為第二個參數，可以讓 `React` 跳過不必要的重新執行：
      ```jsx
      useEffect(() => {
        if (isPlaying) {
          ref.current.play();
        } else {
          ref.current.pause();
        }
      }, [isPlaying]);
      ```

    - 指定 `[isPlaying]` 作為依賴陣列，是告訴 `React`：如果 `isPlaying` 與上次渲染時相同，就跳過重新執行這個 `Effect`。如此一來，輸入框的輸入不會觸發 `Effect` 重新執行，只有按下播放／暫停按鈕才會。

    - 依賴陣列可以包含多個依賴項，只有當指定的所有依賴項的值都與上一次渲染完全相同時，`React` 才會跳過重新執行該 `Effect`（React 使用 Object.is 來比較依賴項的值）。

    - 請注意，不能隨意 `「選擇」` 依賴項。如果指定的依賴項與 `React` 依照 `Effect` 內部程式碼所推斷出的依賴項不符，就會收到 `linter` 的錯誤提示，這有助於捕捉許多程式碼中的 `bug`。如果不希望某段程式碼重新執行，那麼應該修改 `Effect` 程式碼本身，讓它不再「需要」該依賴項。

    :::info 注意事項
    沒有依賴陣列，與使用空陣列 `[]` 作為依賴陣列，兩者行為並不相同：

    ```jsx
    jsuseEffect(() => {
      // 這裡的程式碼會在每次渲染後執行
    });

    useEffect(() => {
      // 這裡的程式碼只會在組件掛載（首次出現）時執行
    }, []);

    useEffect(() => {
      // 這裡的程式碼不但會在組件掛載時執行，當 a 或 b 的值自上次渲染後改變時也會執行
    }, [a, b]);
    ```
    :::

    :::info 深入探討：為什麼依賴陣列中可以省略 ref？
    - `Effect` 若同時使用了 `ref` 與 `isPlaying prop`，卻只把 `isPlaying` 宣告為依賴項，這是因為 `ref` 具有穩定的識別性：`React` 確保每輪渲染中呼叫同一個 `useRef` 時，總能取得相同的物件。`ref` 不會改變，因此不會導致 `Effect` 重新執行，所以在依賴陣列中它可有可無（加進去也沒問題）。`useState` 回傳的 `set` 函式同樣具有穩定的識別性，因此通常也會被省略。

    - 省略「始終穩定」的依賴項，僅在 `linter` 能 `「看出」` 該物件是穩定的時候才有效。例如，如果 `ref` 是從父組件傳入的，就必須在依賴陣列中指定它，因為無法確定父組件是否一直傳遞同一個 `ref`。
    :::

  - ### 第三步：按需加入清理（cleanup）函式
    - 考慮一個 `ChatRoom` 組件，它在顯示時需要連接到聊天伺服器。若每次重新渲染後都得重新連線會很慢，所以需要加入依賴陣列。由於 `Effect` 中的程式碼沒有使用任何 `props` 或 `state`，依賴陣列為空陣列 []，這是在告訴 `React` 只在組件 `「掛載」`（首次顯示在頁面上）時執行這段程式碼。

      ```jsx
      useEffect(() => {
        const connection = createConnection();
        connection.connect();
      }, []);
      ```
  
    - 然而，即使是只在掛載時執行的 `Effect`，在開發環境下也會看到日誌被印出兩次。這是因為 `React` 在開發環境中，會在組件首次掛載後立即重新掛載一次，藉此幫助你快速發現「組件被卸載時沒有關閉連線」這類 `bug` —— 若沒有清理機制，隨著使用者在應用中來回切換，連線就會不斷累積。

    - 要解決這個問題，可以在 `Effect` 中回傳一個清理函式：
      ```jsx {4-6}
      useEffect(() => {
        const connection = createConnection();
        connection.connect();
        return () => {
          connection.disconnect();
        };
      }, []);
      ```

    - `React` 會在每次 `Effect` 重新執行之前呼叫清理函式，並在組件卸載（被移除）時最後一次呼叫它。實作清理函式後，在開發環境下會看到三條日誌：連線中……、斷開連線、連線中……。在開發環境下，這是正確的行為：透過重新掛載組件，`React` 驗證了離開頁面再返回不會導致程式碼出錯 —— 因為本就應該先斷開再重新連接！如果清理函式實作得當，那麼「只執行一次 `Effect`」與「執行、清理、再執行」之間，就不應該有任何使用者可見的差異。

    - 在正式環境下，只會看到連線中被印出一次，因為重新掛載組件只會在開發環境下發生，目的是幫助找出需要清理的 `Effect`。雖然可以透過關閉嚴格模式來停用這個行為，但建議保留它，因為它能幫助找出許多類似的 `bug`。

## 如何處理開發環境下 Effect 執行兩次的情況？
  - `React` 刻意在開發環境下重新掛載組件，以找出類似上述的 `bug`。需要思考的不是「如何讓 Effect 只執行一次」，而是`「如何修復 Effect，讓它在重新掛載後也能正常運作」`。

  - 通常，答案是實作清理函式。清理函式應該停止或撤銷 `Effect` 所做的一切。原則是：使用者不應該感受到「Effect 只執行一次（正式環境）」與「連續執行『掛載 → 清理 → 掛載』（開發環境）」之間的差異。

  :::info 注意事項：不要用 `ref` 來防止 `Effect` 觸發
  - 為了防止 `Effect` 在開發環境中觸發兩次，一個常見的錯誤是用 `ref` 讓 `Effect` 只執行一次：

    ```jsx
    const connectionRef = useRef(null);
    useEffect(() => {
      // 🚩 這並不能修復這個 bug！！！
      if (!connectionRef.current) {
        connectionRef.current = createConnection();
        connectionRef.current.connect();
      }
    }, []);
    ```

  - 這雖然讓你在開發環境下只看到一次日誌，但並沒有修復 `bug`：使用者離開時連線沒有關閉，返回時又會建立一個新連線，連線依然會不斷累積。要修復這個 `bug`，光讓 `Effect` 只執行一次是不夠的 —— 想要 `Effect` 在重新掛載後正常運作，就必須依前述方法清理連線。
  :::

  - 以下是幾種常見模式的處理方式：
    - ### 管理非 React 元件
      - 有時需要加入非 `React` 實作的 UI 元件，例如地圖元件，它有一個 `setZoomLevel()` 方法，需要讓地圖縮放比例與 `zoomLevel` state 同步：
        ```jsx
        useEffect(() => {
          const map = mapRef.current;
          map.setZoomLevel(zoomLevel);
        }, [zoomLevel]);
        ```

      - 這種情況不需要清理操作。在開發環境中，即使 `React` 呼叫 `Effect` 兩次也沒關係，因為用相同的值呼叫 `setZoomLevel` 兩次不會造成任何影響。
    
      - 有些 `API` 可能不允許連續呼叫兩次，例如內建的 `<dialog>` 元素的 `showModal` 方法連續呼叫兩次會拋出例外，此時可以透過實作清理函式來關閉對話框：
        ```jsx {4}
        useEffect(() => {
          const dialog = dialogRef.current;
          dialog.showModal();
          return () => dialog.close();
        }, []);
        ```

    - ### 訂閱事件
      - 如果 `Effect` 訂閱了某些事件，清理函式應該取消訂閱這些事件：
        ```jsx {6}
        useEffect(() => {
          function handleScroll(e) {
            console.log(window.scrollX, window.scrollY);
          }
          window.addEventListener('scroll', handleScroll);
          return () => window.removeEventListener('scroll', handleScroll);
        }, []);
        ```

    - ### 觸發動畫
      - 如果 `Effect` 觸發了一些動畫，清理函式應該把動畫重置回初始狀態：
        ```jsx {4-6}
        useEffect(() => {
          const node = ref.current;
          node.style.opacity = 1; // 觸發動畫
          return () => {
            node.style.opacity = 0; // 重置為初始值
          };
        }, []);
        ```
      
    - ### 取得資料
      - 如果 `Effect` 需要取得資料，清理函式應該中止請求或忽略其結果：
        ```jsx {2,6,13-15}
        useEffect(() => {
          let ignore = false;

          async function startFetching() {
            const json = await fetchTodos(userId);
            if (!ignore) {
              setTodos(json);
            }
          }

          startFetching();

          return () => {
            ignore = true;
          };
        }, [userId]);
        ```

      - 無法 `「撤銷」` 已經發生的網路請求，但清理函式應該確保不再相關的請求，不會繼續影響應用程式。若 `userId` 從 `'Alice'` 變成 `'Bob'`，需要確保 `'Alice'` 的回應資料被忽略，即使它是在 `'Bob'` 之後才抵達。

      - 在開發環境中，會在瀏覽器的「網路」分頁中看到兩筆請求，這是正常的；
      
      - 在正式環境中，則只會有一筆請求。如果開發環境中的第二次請求造成困擾，最好的做法是使用能對請求去重並快取回應的解決方案，例如把資料抓取邏輯抽成自訂 `Hook`。
        ```jsx
        function TodoList() {
          const todos = useSomeDataLibrary(`/api/user/${userId}/todos`);
          // ...
        ```

      :::info 深入探討：在 Effect 中取得資料的替代方案
      - 在 `Effect` 中直接撰寫 `fetch` 請求，是一種常見但相當手動、有明顯缺點的做法：
        - `Effect` 不會在伺服端執行，這意味著最初由伺服器渲染的 `HTML` 只會包含載入狀態，而沒有實際資料。
        - 容易產生 `「網路瀑布（network waterfall）」`，父組件先請求資料、渲染子組件後，子組件才開始請求自己的資料，若網路速度不快，會比並行取得所有資料慢得多。
        - 往往無法預先載入或快取資料，例如組件卸載後重新掛載，就得重新取得資料。
        - 不夠簡潔，為了避免競態條件等問題，需要撰寫大量樣板程式碼。

      - 建議的做法：
        - 若使用框架，請使用其內建的資料取得機制，現代 `React` 框架已整合了高效的資料取得機制，不會出現上述問題。
        - 否則，請考慮使用或建置客戶端快取，例如 `TanStack Query`、`useSWR` 或 `React Router v6.4+`，也可以自行在底層使用 `Effect`，並加入請求去重、快取回應與避免網路瀑布的邏輯。
      :::

    - ### 傳送分析報告
      - 範例中，每次頁面造訪都會傳送一個分析事件。在開發環境中，`logVisit` 對每個 `URL` 都會被呼叫兩次，建議保持不動 —— 與前述範例類似，執行一次或兩次在使用者可見的行為上並無差異。實際上，`logVisit` 不應該在開發環境中執行任何操作，因為不會想讓開發時的日誌影響正式環境的統計數據。在正式環境中，不會有重複的造訪日誌。
    
      - 若要偵錯所傳送的分析事件，可以把應用部署到以正式模式執行的暫存環境，或暫時停用嚴格模式的重新掛載檢查，也可以改在路由變更的事件處理函式中傳送分析資料，而非放在 `Effect` 中。

    - ### 不適用於 Effect：初始化應用程式
      - 某些邏輯應該只在應用程式啟動時執行一次，可以把它放在組件外部：
        ```jsx
        if (typeof window !== 'undefined') { // 檢查是否在瀏覽器中執行
          checkAuthToken();
          loadDataFromLocalStorage();
        }

        function App() {
          // ……
        }
      
      - 這能確保此類邏輯只在瀏覽器載入頁面後執行一次。

    - ### 不適用於 Effect：購買商品
      - 有時即使撰寫了清理函式，也無法避免使用者觀察到 `Effect` 執行兩次，例如 `Effect` 送出了像購買商品這樣的 `POST` 請求。你肯定不希望使用者購買兩次商品，這也是為什麼這種邏輯不應該放在 `Effect` 中 —— 若使用者跳轉到另一個頁面再按下「返回」，`Effect` 就會再次執行。
    
      - 購買操作並非由渲染引起，而是由特定互動引起的，它應該只在使用者按下按鈕時執行。因此，它不應該寫在 `Effect` 中，而應該把請求移到 `「購買」` 按鈕的事件處理函式中：
        ```jsx
        function handleClick() {
          // ✅ 購買行為是一個事件，因為它是由特定的互動引起的。
          fetch('/api/buy', { method: 'POST' });
        }
        ```
    
      - 這說明了：如果重新掛載破壞了應用程式的邏輯，通常就是暴露了既存的 `bug`。對使用者而言，造訪一個頁面，不應該與造訪頁面後點擊連結、再按「返回」查看頁面有所不同。`React` 透過在開發環境中重新掛載組件，來驗證組件是否遵守這一原則。

## 綜合以上內容
  - 透過一個計時器範例（使用 `setTimeout` 排程日誌記錄，並在清理函式中取消延遲器）可以觀察到：
    - React 總是會在執行下一輪渲染的 `Effect` 之前，先清理上一輪渲染的 `Effect`，因此即使快速輸入，最多也只會有一個延遲器被排程。
    - 若卸載組件，會清理最後一輪渲染的 `Effect`。
    - 若移除清理函式，讓延遲器不被取消，快速輸入時，最終會依序看到每一次輸入時的值各自被印出（而非全部印出最新值），這是因為每個 `Effect` 都會「捕獲」它對應渲染時的值。即使該值後續發生變化，某次渲染時的 `Effect` 永遠會拿到當時的值 —— 換句話說，每次渲染的 `Effect` 都是彼此獨立的。

  :::info 深入探討：每一輪渲染都有自己的 Effect
  - 可以把 `useEffect` 理解成把一段行為「附加」到渲染輸出上。以一個依賴 `roomId` 的聊天室 `Effect` 為例：
    - `首次渲染（roomId 為 'general'）`：Effect 連接到 'general' 聊天室。
    - `依賴項相同的重新渲染`：React 發現依賴項未變，因此忽略這次渲染的 Effect，不會呼叫它。
    - `依賴項不同的重新渲染（roomId 變為 'travel'）`：React 發現依賴項不同，因此在執行這次渲染的 Effect 之前，需要先清理上一個「有執行」的 Effect（也就是首次渲染時的 Effect），斷開與 'general' 的連線，再連接到 'travel' 聊天室。
    - `組件卸載`：React 執行上一個有執行的 Effect 的清理函式，斷開與 'travel' 的連線。
    - `僅開發環境下的行為`：開啟嚴格模式時，React 會在每次掛載組件後重新掛載一次（組件的 state 與建立的 DOM 都會被保留），這有助於找出需要清理函式的 Effect，並提早發現類似競態條件的 bug；此外，每當在開發環境中儲存檔案時，React 也會重新掛載 Effect。這些行為都僅限於開發環境。
  :::

## 重點複習（Recap）
  - 與事件不同，`Effect` 是由渲染本身引起，而非特定的互動。
  - `Effect` 讓你能把組件與某些外部系統（第三方 API、網路等）同步。
  - 預設情況下，`Effect` 會在每次渲染（包括初次渲染）後執行。
  - 如果所有依賴項都與上一次渲染相同，React 會跳過這次 `Effect`。
  - 不能「選擇」依賴項，它們是由 `Effect` 內部的程式碼所決定的。
  - 空的依賴陣列（[]）對應於組件的「掛載」，也就是組件被加入頁面時。
  - 僅在嚴格模式的開發環境中，React 會掛載組件兩次，以對 `Effect` 進行壓力測試。
  - 如果 `Effect` 因重新掛載而出現問題，就需要實作清理函式。
  - React 會在 `Effect` 再次執行之前，以及組件卸載時呼叫清理函式。

## 挑戰（Challenges）
  - #### 1. 掛載後聚焦於表單欄位
    - 表單渲染了一個 `<MyInput />` 組件，任務是使用輸入框的 `focus()` 方法，讓 `MyInput` 在頁面上出現時自動取得焦點；範例中已有一段被註解掉的實作，但無法正常運作，需要找出原因並修復。

    - ##### 原始程式碼
      ```jsx
      import { useEffect, useRef } from 'react';

      export default function MyInput({ value, onChange }) {
        const ref = useRef(null);

        // TODO：下面的這種做法不會生效，請修復。
        // ref.current.focus()

        return (
          <input
            ref={ref}
            value={value}
            onChange={onChange}
          />
        );
      }
      ```

    - ##### 解答
      在渲染期間呼叫 `ref.current.focus()` 是錯誤的，因為這是一個「副作用」，副作用應該放在事件處理函式中或透過 `useEffect` 來宣告。由於這個副作用是由組件渲染引起的，而非任何特定互動，因此應該放進 `Effect` 中，並加入空依賴陣列 `[]`，確保它只在組件掛載時執行一次：

      ```jsx
      import { useEffect, useRef } from 'react';

      export default function MyInput({ value, onChange }) {
        const ref = useRef(null);

        useEffect(() => {
          ref.current.focus();
        }, []);

        return (
          <input
            ref={ref}
            value={value}
            onChange={onChange}
          />
        );
      }
      ```

  - #### 2. 有條件地聚焦於表單欄位
    表單渲染兩個 `<MyInput />` 組件，兩者都會在掛載時搶占焦點，導致最後一個總是「獲勝」。任務是修改邏輯，讓組件只有在接收到的 `shouldFocus` 屬性為 `true` 時才呼叫 `focus()`。

    - ##### 原始程式碼
      ```jsx
      import { useEffect, useRef } from 'react';

      export default function MyInput({ shouldFocus, value, onChange }) {
        const ref = useRef(null);

        // TODO：只在 shouldFocus 為 true 時才調用 focus()
        useEffect(() => {
          ref.current.focus();
        }, []);

        return (
          <input
            ref={ref}
            value={value}
            onChange={onChange}
          />
        );
      }
      ```

    - ##### 提示
      不能有條件地宣告 `Effect`，但 `Effect` 中可以包含條件邏輯。

    - ##### 解答
      在 `Effect` 中加入條件判斷，並把 `shouldFocus` 指定為依賴項：

      ```jsx
      import { useEffect, useRef } from 'react';

      export default function MyInput({ shouldFocus, value, onChange }) {
        const ref = useRef(null);

        useEffect(() => {
          if (shouldFocus) {
            ref.current.focus();
          }
        }, [shouldFocus]);

        return (
          <input
            ref={ref}
            value={value}
            onChange={onChange}
          />
        );
      }
      ```

  - #### 3. 修復會觸發兩次的定時器
    `Counter` 組件展示一個每秒遞增的計數器，但實際上每秒遞增了兩次，需要找出原因並修復。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function Counter() {
        const [count, setCount] = useState(0);

        useEffect(() => {
          function onTick() {
            setCount(c => c + 1);
          }

          setInterval(onTick, 1000);
        }, []);

        return <h1>{count}</h1>;
      }
      ```

    - ##### 解答
      - 開啟嚴格模式時，`React` 在開發環境中會把每個組件重新掛載一次，導致計時器被設定了兩次。真正的原因是這個 `Effect` 開啟了一個進程，卻沒有提供清理它的方式。修復方式是保存 `setInterval` 回傳的 `interval ID`，並用 `clearInterval` 實作清理函式：

      ```jsx
      import { useState, useEffect } from 'react';

      export default function Counter() {
        const [count, setCount] = useState(0);

        useEffect(() => {
          function onTick() {
            setCount(c => c + 1);
          }

          setInterval(onTick, 1000);
        }, []);

        return <h1>{count}</h1>;
      }
      ```

      - 在開發環境中，`React` 仍會重新掛載一次組件，藉此確認清理函式已正確實作；在正式環境中則只會呼叫一次 `setInterval`，兩種情況下使用者可見的行為都是相同的：計數器每秒遞增一次。

  - #### 4. 解決在 Effect 中取得資料的問題
    - 組件會依所選人物載入傳記，快速切換選項時（例如先選 `Bob`、再立刻選 `Taylor`）可能出現 `bug`：明明選中了 `Taylor`，畫面卻顯示 `Bob` 的傳記。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { fetchBio } from './api.js';

      export default function Page() {
        const [person, setPerson] = useState('Alice');
        const [bio, setBio] = useState(null);

        useEffect(() => {
          setBio(null);
          fetchBio(person).then(result => {
            setBio(result);
          });
        }, [person]);

        return (
          <>
            <select value={person} onChange={e => {
              setPerson(e.target.value);
            }}>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Taylor">Taylor</option>
            </select>
            <hr />
            <p><i>{bio ?? '加載中……'}</i></p>
          </>
        );
      }
      ```

    - ##### 提示
      若 `Effect` 需要非同步取得某些資料，通常需要清理函式。

    - ##### 解答
      這類 `bug` 稱為競態條件，因為兩個非同步操作在「競速」，可能以非預期的順序完成。修復方式是加入一個清理函式，並用一個 `ignore` 旗標來判斷結果是否仍然有效：

      ```jsx
      import { useState, useEffect } from 'react';
      import { fetchBio } from './api.js';

      export default function Page() {
        const [person, setPerson] = useState('Alice');
        const [bio, setBio] = useState(null);
        useEffect(() => {
          let ignore = false;
          setBio(null);
          fetchBio(person).then(result => {
            if (!ignore) {
              setBio(result);
            }
          });
          return () => {
            ignore = true;
          }
        }, [person]);

        return (
          <>
            <select value={person} onChange={e => {
              setPerson(e.target.value);
            }}>
              <option value="Alice">Alice</option>
              <option value="Bob">Bob</option>
              <option value="Taylor">Taylor</option>
            </select>
            <hr />
            <p><i>{bio ?? '加載中……'}</i></p>
          </>
        );
      }
      ```

      - 每輪渲染的 `Effect` 都有各自獨立的 `ignore` 變數：一旦某個 `Effect` 被清理（例如切換到不同的人），它的 `ignore` 就會變為 `true`，因此請求完成的先後順序 已不再重要 —— 只有最後選中的人所對應的 `Effect`，其 `ignore` 仍為 `false`，因此只有它會呼叫 `setBio(result)`。

      - 除了忽略過時 `API` 呼叫的結果外，也可以搭配 `AbortController` 來取消不再需要的請求，不過單靠這一點還不足以防止競態條件，因為 `fetch` 之後可能還有更多非同步操作，因此使用像 `ignore` 這樣明確的旗標，是解決此類問題最可靠的方法。