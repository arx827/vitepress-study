---
title: '[React官網] React 19.2 教學文件'
---

# 響應式 Effect 的生命週期
  `Effect` 與組件有不同的生命週期。組件可以掛載、更新或卸載。`Effect` 只能做兩件事：開始同步某些東西，然後停止同步它。如果 `Effect` 依賴於隨時間變化的 `props` 與 `state`，這個循環可能會發生多次。`React` 提供了程式碼檢查規則來檢查是否正確地指定了 `Effect` 的依賴項，這能使 `Effect` 與最新的 `props` 與 `state` 保持同步。

  :::info 你將會學到：
  - `Effect` 的生命週期與組件的生命週期有何不同
  - 如何獨立地思考每個 `Effect`
  - 何時以及為什麼 `Effect` 需要重新同步
  - 如何確定 `Effect` 的依賴項
  - 值是 `「響應式」` 的含義是什麼
  - 空依賴陣列意味著什麼
  - `React` 如何使用檢查工具驗證依賴關係是否正確
  - 與程式碼檢查工具產生分歧時，該如何處理
  :::

## Effect 的生命週期
  - 每個 `React` 組件都經歷相同的生命週期：
    - 當組件被加入畫面上時，它會進行組件的 `掛載`。
    - 當組件接收到新的 `props` 或 `state` 時，通常是作為對互動的回應，它會進行組件的 `更新`。
    - 當組件從畫面上移除時，它會進行組件的 `卸載`。

  - 這是一種很好的思考組件的方式，但並不適用於 `Effect`。相反，應該嘗試從組件生命週期中跳脫出來，獨立思考 `Effect`。`Effect` 描述了如何把外部系統與目前的 `props` 和 `state` 同步。隨著程式碼的變化，同步的頻率可能會增加或減少。

  - 考慮這個範例，`Effect` 把組件連接到聊天伺服器：
    ```jsx
    const serverUrl = 'https://localhost:1234';

    function ChatRoom({ roomId }) {
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

  - `Effect` 的主體部分指定了如何開始同步，回傳的清理函式則指定了如何停止同步。

  - 你可能會直覺地認為，組件掛載時 `React` 會開始同步，而組件卸載時會停止同步。然而，事情並沒有這麼簡單!有時，在組件保持掛載狀態的同時，可能還需要多次開始和停止同步。

  - ### 為什麼同步可能需要多次進行
    - 想像一下，`ChatRoom` 組件接收 `roomId` 屬性，使用者可以在下拉選單中選擇。假設初始時使用者選擇了 `"general"` 作為 `roomId`，應用程式會顯示「general」聊天室。UI 顯示之後，`React` 會執行 `Effect` 來開始同步，連接到「general」聊天室。

    - 之後，使用者在下拉選單中選擇了不同的房間（例如`「travel」`）。首先，`React` 會更新 UI。此時，使用者在介面中看到「travel」是目前選定的聊天室，然而上次執行的 `Effect` 仍然連接到「general」聊天室。`roomId` 屬性已經發生了變化，所以之前 `Effect` 所做的事情（連接到「general」聊天室）已不再與 UI 匹配。

    - 此時，希望 `React` 執行兩個操作：
      - 停止與舊的 `roomId` 同步（斷開與「general」聊天室的連接）
      - 開始與新的 `roomId` 同步（連接到「travel」聊天室）

    - 幸運的是，已經教會了 `React` 如何執行這兩個操作!`Effect` 的主體部分指定了如何開始同步，而清理函式指定了如何停止同步。現在，`React` 只需要按照正確的順序，以及正確的 `props` 和 `state` 來呼叫它們。

  - ### React 如何重新同步 Effect
    - 為了停止同步，`React` 會呼叫 `Effect` 回傳的清理函式，該函式在連接到「general」聊天室後回傳。由於 `roomId` 為「general」，清理函式會斷開與「general」聊天室的連接。

    - 接著，`React` 會執行這次渲染期間提供的 `Effect`。這次 `roomId` 為「travel」，因此它會開始同步到「travel」聊天室（直到最終也呼叫了清理函式）。

    - 多虧了這一點，現在已經連接到了使用者在 UI 中選擇的同一個聊天室。避免了災難!

    - 每當組件用不同的 `roomId` 重新渲染後，`Effect` 就會重新進行同步。例如，若使用者把 `roomId` 從「travel」改為「music」，`React` 就會再次透過呼叫清理函式停止同步 `Effect`（斷開與「travel」聊天室的連接），然後透過使用新的 `roomId` 屬性再次執行 `Effect` 的主體部分開始同步（連接到「music」聊天室）。

    - 最後，當使用者切換到不同畫面時，`ChatRoom` 組件會被卸載，現在已沒有必要保持連接了。`React` 會最後一次停止同步 `Effect`，並從「music」聊天室斷開連接。

  - ### 從 Effect 的角度思考
    - 讓我們總結一下從 `ChatRoom` 組件的角度所發生的一切：
      - `ChatRoom` 組件掛載，`roomId` 設為「general」
      - `ChatRoom` 組件更新，`roomId` 設為「travel」
      - `ChatRoom` 組件更新，`roomId` 設為「music」
      - `ChatRoom` 組件卸載

    - 在組件生命週期的每個階段，`Effect` 執行了不同的操作：
      - `Effect` 連接到了「general」聊天室
      - `Effect` 斷開了與「general」聊天室的連接，並連接到了「travel」聊天室
      - `Effect` 斷開了與「travel」聊天室的連接，並連接到了「music」聊天室
      - `Effect` 斷開了與「music」聊天室的連接

    - 現在讓我們從 `Effect` 本身的角度來思考所發生的事情，這段程式碼的結構可能會將所發生的事情看作是一系列不重疊的時間段：
      - `Effect` 連接到了「general」聊天室（直到斷開連接）
      - `Effect` 連接到了「travel」聊天室（直到斷開連接）
      - `Effect` 連接到了「music」聊天室（直到斷開連接）

    - 之前，你是從組件的角度思考。當從組件的角度思考時，很容易把 `Effect` 視為在特定時間點觸發的「回呼函式」或「生命週期事件」，例如「渲染後」或「卸載前」，這種思維方式很快就會變得複雜，因此最好避免使用。

    - 相反，始終專注於單一的啟動/停止週期。無論組件是掛載、更新還是卸載，都不應該有影響。只需要描述如何開始同步和如何停止。如果做得好，`Effect` 就能在需要時始終具備啟動和停止的彈性。

    - 這可能會讓你想起撰寫建立 `JSX` 的渲染邏輯時，並不需要考慮組件是掛載還是更新 —— 描述的是應該顯示在畫面上的內容，而 `React` 會解決其餘的問題。

  - ### React 如何驗證 Effect 可以重新進行同步
    - 透過一個可互動的範例：點擊「打開聊天」來掛載 `ChatRoom` 組件，會發現組件首次掛載時看到三個日誌：
      - 連接到「general」聊天室（僅限開發環境）
      - 從「general」聊天室斷開連接（僅限開發環境）
      - 連接到「general」聊天室

    - 前兩個日誌僅適用於開發環境。在開發環境中，React 總是會重新掛載每個組件一次。

    - `React` 透過在開發環境中立即強制 `Effect` 重新進行同步來驗證其是否能夠重新同步。這可能讓你想起打開門並額外關閉它，來檢查門鎖是否有效的情景。`React` 在開發環境中額外啟動和停止 `Effect` 一次，以檢查是否正確實作了清理功能。

    - 實際上，`Effect` 重新進行同步的主要原因，是它所使用的某些資料發生了變化。例如更改所選的聊天室時，`roomId` 發生變化，`Effect` 就會重新進行同步。

    - 然而，還存在其他一些不尋常的情況需要重新進行同步。例如，若在聊天開啟時編輯 `serverUrl`，修改程式碼後 `Effect` 也會重新進行同步。未來，`React` 可能會加入更多依賴於重新同步的功能。

  - ### React 如何知道需要重新進行 Effect 的同步
    - `React` 是如何知道 `roomId` 更改後需要重新同步 `Effect` 呢?這是因為你告訴了 `React`，它的程式碼依賴於 `roomId`，透過將其包含在依賴清單中：

      ```jsx
      function ChatRoom({ roomId }) { // roomId 屬性可能會隨時間變化。
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId); // 這個 Effect 讀取了 roomId
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, [roomId]); // 因此，你告訴 React 這個 Effect「依賴於」roomId
        // ...
      ```

    - 運作原理如下：
      - 你知道 `roomId` 是 `prop`，意味著它可能會隨著時間推移發生變化。
      - 你知道 `Effect` 讀取了 `roomId`（因此其邏輯依賴於可能會之後改變的值）。
      - 這就是為什麼你把它指定為 `Effect` 的依賴項（以便在 `roomId` 發生變化時重新進行同步）。

    - 每次組件重新渲染後，`React` 都會查看傳遞的依賴項陣列。如果陣列中的任何值與上一次渲染時在相同位置傳遞的值不同，`React` 就會重新同步 `Effect`。

    - 例如，若初始渲染時傳遞了 `["general"]`，然後下一次渲染時傳遞了 `["travel"]`，`React` 會比較`「general」`和`「travel」` —— 這些是不同的值（使用 `Object.is` 進行比較），因此 `React` 會重新同步 `Effect`。另一方面，若組件重新渲染但 `roomId` 沒有發生變化，`Effect` 就會繼續連接到相同的房間。

  - ### 每個 Effect 表示一個獨立的同步過程
    - 不要僅僅因為某個邏輯需要和已經寫好的 `Effect` 一起執行，就把它加入 `Effect` 中。例如，假設想在使用者造訪房間時傳送一個分析事件。你已經有一個依賴於 `roomId` 的 `Effect`，所以可能會想把分析呼叫加到那裡：
      
      ```jsx
      function ChatRoom({ roomId }) {
        useEffect(() => {
          logVisit(roomId);
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, [roomId]);
        // ...
      }
      ```

    - 但想像一下，如果之後給這個 `Effect` 加了另一個需要重新建立連接的依賴項。如果這個 `Effect` 重新進行同步，它就會為相同的房間呼叫 `logVisit(roomId)`，而這並非你的意圖。記錄造訪行為是一個獨立的過程，與連接不同。應該把它們寫成兩個獨立的 `Effect`：

      ```jsx
      function ChatRoom({ roomId }) {
        useEffect(() => {
          logVisit(roomId);
        }, [roomId]);

        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          // ...
        }, [roomId]);
        // ...
      }
      ```

    - 程式碼中的每個 `Effect` 都應該代表一個獨立的同步過程。

    - 在上面的範例中，刪除一個 `Effect` 不會影響另一個 `Effect` 的邏輯，這表明它們同步不同的內容，因此把它們拆分開是有意義的。另一方面，若把一個內聚的邏輯拆分成多個獨立的 `Effect`，程式碼可能會看起來更加「清晰」，但維護起來會更加困難。這就是為什麼應該考慮這些過程是相同還是獨立的，而不是只考慮程式碼看起來是否更整潔。

## Effect 會「響應」於響應式值
  - `Effect` 讀取了兩個變數（`serverUrl` 和 `roomId`），但只把 `roomId` 指定為依賴項。為什麼 `serverUrl` 不需要作為依賴項呢?

  - 這是因為 `serverUrl` 永遠不會因為重新渲染而發生變化。無論組件重新渲染多少次以及原因是什麼，`serverUrl` 都保持不變。既然 `serverUrl` 從不變化，把它指定為依賴項就沒有意義，畢竟依賴項只有在隨時間變化時才會起作用!

  - 另一方面，`roomId` 在重新渲染時可能會不同。在組件內部宣告的 `props`、`state` 和其他值都是響應式的，因為它們是在渲染過程中計算的，並參與了 `React` 的資料流。

  - 如果 `serverUrl` 是狀態變數，那麼它就是響應式的，響應式值必須包含在依賴項中：
    ```jsx
    function ChatRoom({ roomId }) { // Props 隨時間變化
      const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // State 可能隨時間變化

      useEffect(() => {
        const connection = createConnection(serverUrl, roomId); // Effect 讀取 props 和 state
        connection.connect();
        return () => {
          connection.disconnect();
        };
      }, [roomId, serverUrl]); // 因此，你告訴 React 這個 Effect「依賴於」props 和 state
      // ...
    }
    ```

  - 透過把 `serverUrl` 包含在依賴項中，能確保 `Effect` 在它發生變化後重新同步。

  - ### 沒有依賴項的 Effect 的含義
    - 如果把 `serverUrl` 和 `roomId` 都移出組件會發生什麼?
      ```jsx
      const serverUrl = 'https://localhost:1234';
      const roomId = 'general';

      function ChatRoom() {
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, []); // ✅ 宣告的所有依賴
        // ...
      }

    - 現在 `Effect` 的程式碼不使用任何響應式值，因此它的依賴可以是空的（`[]`）。

    - 從組件的角度來看，空的 `[]` 依賴陣列意味著這個 `Effect` 僅在組件掛載時連接到聊天室，並在組件卸載時斷開連接（請記住，在開發環境中，`React` 仍會額外執行一次，以對邏輯進行壓力測試）。

    - 然而，若從 `Effect` 的角度思考，根本不需要考慮掛載和卸載。重要的是，你已經指定了 `Effect` 如何開始和停止同步。目前它沒有任何響應式依賴，但如果希望使用者能隨時間改變 `roomId` 或 `serverUrl`（它們將變為響應式），`Effect` 的程式碼不需要改變，只需要把它們加入依賴項即可。

  - ### 在組件主體中宣告的所有變數都是響應式的
    - `Props` 和 `state` 並不是唯一的響應式值。從它們計算出的值也是響應式的。如果 `props` 或 `state` 發生變化，組件就會重新渲染，從中計算出的值也會隨之改變。這就是為什麼 `Effect` 使用的組件主體中的所有變數，都應該在依賴清單中。

    - 假設使用者可以在下拉選單中選擇聊天伺服器，但也能在設定中配置預設伺服器。假設你已經把設定狀態放入了 `context`，因此從該 `context` 中讀取 `settings`。現在，可以根據 `props` 中選擇的伺服器與預設伺服器來計算 `serverUrl`：

      ```jsx
      function ChatRoom({ roomId, selectedServerUrl }) { // roomId 是響應式的
        const settings = useContext(SettingsContext); // settings 是響應式的
        const serverUrl = selectedServerUrl ?? settings.defaultServerUrl; // serverUrl 是響應式的
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId); // Effect 讀取了 roomId 和 serverUrl
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, [roomId, serverUrl]); // 因此，當它們中的任何一個發生變化時，它需要重新同步！
        // ...
      }
      ```

    - 在這個範例中，`serverUrl` 不是 `prop` 或 `state` 變數，它是渲染過程中計算出的普通變數，但因為它是在渲染過程中計算的，所以可能會因為重新渲染而改變，這就是為什麼它是響應式的。

    - 組件內部的所有值（包括 `props`、`state` 和 `組件體內的變數`）都是響應式的。任何響應式值都可能在重新渲染時發生變化，所以需要把響應式值包含在 `Effect` 的依賴項中。

    - 換句話說，`Effect` 對組件體內的所有值都會「react」。

    :::info 深入探討：全域變數或可變值可以作為依賴項嗎?
    - 可變值（包括全域變數）並非響應式。
    - 例如，像 `location.pathname` 這樣的可變值不能作為依賴項 —— 它是可變的，因此可以在 `React` 渲染資料流之外的任何時間發生變化。更改它不會觸發組件的重新渲染，因此即使在依賴項中指定了它，`React` 也無法知道在其變化時重新同步 `Effect`。這也違反了 `React` 的規則，因為在渲染過程中讀取可變資料（也就是在計算依賴項時）會破壞純粹的渲染。相反，應該使用 `useSyncExternalStore` 來讀取和訂閱外部可變值。
    :::

    - 另外，像 `ref.current` 或從中讀取的值也不能作為依賴項。`useRef` 回傳的 `ref` 物件本身可以作為依賴項，但它的 `current` 屬性是刻意可變的，能讓你追蹤某些值而不觸發重新渲染。但由於更改它不會觸發重新渲染，它並非響應式值，`React` 不會知道在其變化時重新執行 `Effect`。

  - ### React 會驗證是否把每個響應式值都指定為了依賴項
    - 如果檢查工具配置了 `React`，它就會檢查 `Effect` 程式碼中使用的每個響應式值，是否已宣告為其依賴項。範例中若 `roomId` 和 `serverUrl` 都是響應式的，卻只寫了空依賴陣列，就會是一個 `lint` 錯誤。

    - 這可能看起來像是 `React` 的錯誤，但實際上 `React` 是在指出程式碼中的 `bug`。`roomId` 和 `serverUrl` 都可能隨時間改變，但卻忘了在它們改變時重新同步 `Effect`，即使使用者在 UI 中選擇了不同的值，仍然會保持連接到初始的 `roomId` 和 `serverUrl`。

    - 要修復這個 `bug`，請按照檢查工具的建議，把 `roomId` 和 `serverUrl` 指定為 `Effect` 的依賴：
      ```jsx
      function ChatRoom({ roomId }) { // roomId 是響應式的
        const [serverUrl, setServerUrl] = useState('https://localhost:1234'); // serverUrl 是響應式的
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, [serverUrl, roomId]); // ✅ 宣告的所有依賴
        // ...
      }
      ```

    :::info 注意
    在某些情況下，`React` 知道一個值永遠不會改變，即使它在組件內部宣告。例如，從 `useState` 回傳的 `set 函式`，以及從 `useRef` 回傳的 `ref 物件` 都是穩定的 —— 它們保證在重新渲染時不會改變。穩定值並非響應式的，因此可以從清單中省略它們，包含它們也是允許的：它們不會改變，所以無關緊要。
    :::

  - ### 當你不想進行重新同步時該怎麼辦
    - 可以透過向檢查工具 `「證明」` 這些值不是響應式值，即它們不會因為重新渲染而改變。例如，若 `serverUrl` 和 `roomId` 不依賴於渲染，並且始終具有相同的值，可以把它們移到組件外部，現在它們就不需要成為依賴項：

      ```jsx
      const serverUrl = 'https://localhost:1234'; // serverUrl 不是響應式的
      const roomId = 'general'; // roomId 不是響應式的

      function ChatRoom() {
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, []); // ✅ 宣告的所有依賴
        // ...
      }
      ```

    - 也可以把它們移到 `Effect` 內部，由於它們不是在渲染過程中計算的，因此它們不是響應式的：
      ```jsx
      function ChatRoom() {
        useEffect(() => {
          const serverUrl = 'https://localhost:1234'; // serverUrl 不是響應式的
          const roomId = 'general'; // roomId 不是響應式的
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => {
            connection.disconnect();
          };
        }, []); // ✅ 宣告的所有依賴
        // ...
      }
      ```

    - `Effect 是一段響應式的程式碼區塊`。它們在讀取的值發生變化時重新進行同步。與事件處理函式不同，事件處理函式只在每次互動時執行一次，而 `Effect` 則是在需要進行同步時執行。

    - `不能「選擇」依賴項`。依賴項必須包括 `Effect` 中讀取的每個響應式值，程式碼檢查工具會強制執行此規則。有時，這可能會導致無限循環的問題，或是 `Effect` 過於頻繁地重新進行同步。不要透過停用程式碼檢查來解決這些問題!以下是一些解決方案:
      - `檢查 Effect 是否表示了獨立的同步過程`。如果 `Effect` 沒有進行任何同步操作，可能是不必要的。如果它同時進行了幾個獨立的同步操作，應把它拆分為多個 `Effect`。
      - `如果想讀取 props 或 state 的最新值，卻不想對其做出反應並重新同步 Effect`，可以把 `Effect` 拆分為具有反應性的部分（保留在 `Effect` 中）和非反應性的部分（抽取為名為「Effect Event」的內容）。
      - `避免把物件和函式作為依賴項`。如果在渲染過程中建立了物件和函式，然後在 `Effect` 中讀取它們，它們每次渲染時都會不同，這會導致 `Effect` 每次都重新同步。

    :::info 注意事項
    檢查工具是你的朋友，但它們的能力是有限的。檢查工具只知道依賴關係是否錯誤，並不知道每種情況下最佳的解決方法。如果靜態程式碼分析工具建議加入某個依賴關係，但加入該依賴關係會導致循環，這並不意味著應該忽略靜態程式碼分析工具，而是需要修改 `Effect` 內部（或外部）的程式碼，讓該值不是響應式的，也不「需要」成為依賴項。
    :::

## 重點複習（Recap）
  - 組件可以掛載、更新和卸載。
  - 每個 `Effect` 與周圍組件有著獨立的生命週期。
  - 每個 `Effect` 描述了一個獨立的同步過程，可以開始和停止。
  - 在撰寫和讀取 `Effect` 時，要獨立地思考每個 `Effect`（如何開始和停止同步），而不是從組件的角度思考（如何掛載、更新或卸載）。
  - 在組件主體內宣告的值是「響應式」的。
  - 響應式值應該重新進行同步 `Effect`，因為它們可能隨著時間推移而發生變化。
  - 檢查工具會驗證 `Effect` 內部使用的所有響應式值，是否都被指定為依賴項。
  - 檢查工具標記的所有錯誤都是合理的。總是有一種方法能修復程式碼，同時不違反規則。

## 挑戰（Challenges）
  - #### 1. 修復每次輸入均重新連接
    `ChatRoom` 組件在組件掛載時連接到聊天室，在卸載時斷開連接，並在選擇不同的聊天室時重新連接，這種行為是正確的，需要保持正常運作。然而，每當在底部的訊息框中輸入時，`ChatRoom` 也會重新連接到聊天室，任務是修復這個問題。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { createConnection } from './chat.js';

      const serverUrl = 'https://localhost:1234';

      function ChatRoom({ roomId }) {
        const [message, setMessage] = useState('');

        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => connection.disconnect();
        });

        return (
          <>
            <h1>歡迎來到 {roomId} 聊天室！</h1>
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
          </>
        );
      }

      export default function App() {
        const [roomId, setRoomId] = useState('general');
        return (
          <>
            <label>
              選擇聊天室：{' '}
              <select
                value={roomId}
                onChange={e => setRoomId(e.target.value)}
              >
                <option value="general">所有</option>
                <option value="travel">旅遊</option>
                <option value="music">音樂</option>
              </select>
            </label>
            <hr />
            <ChatRoom roomId={roomId} />
          </>
        );
      }
      ```

    - ##### 提示
      應該需要為這個 `Effect` 加入依賴陣列，那麼應該包含哪些依賴項呢?

    - ##### 解答
      這個 `Effect` 沒有依賴陣列，所以它在每次重新渲染後都會重新同步。修復方式是加入依賴陣列，並確保每個被 `Effect` 使用的響應式值都在陣列中指定。`roomId` 是響應式的（因為它是 `prop`），所以應該包含在陣列中:
      
      ```jsx
      useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
      }, [roomId]);
      ```

      `serverUrl` 是在組件外部定義的，這就是它不需要在陣列中的原因。

  - #### 2. 打開和關閉狀態同步
    `Effect` 訂閱了 `window` 的 `pointermove` 事件，以在畫面上移動一個粉色的點。有一個核取方塊，勾選會切換 `canMove` 狀態變數，但該變數在程式碼中還沒被使用。任務是修改程式碼，讓 `canMove` 為 `false`（核取方塊未選中）時，點應該停止移動；切換回選中狀態後，點應重新跟隨移動。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function App() {
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [canMove, setCanMove] = useState(true);

        useEffect(() => {
          function handleMove(e) {
            setPosition({ x: e.clientX, y: e.clientY });
          }
          window.addEventListener('pointermove', handleMove);
          return () => window.removeEventListener('pointermove', handleMove);
        }, []);

        return (
          <>
            <label>
              <input type="checkbox"
                checked={canMove}
                onChange={e => setCanMove(e.target.checked)}
              />
              是否允許移動
            </label>
            <hr />
            <div style={{
              position: 'absolute',
              backgroundColor: 'pink',
              borderRadius: '50%',
              opacity: 0.6,
              transform: `translate(${position.x}px, ${position.y}px)`,
              pointerEvents: 'none',
              left: -20,
              top: -20,
              width: 40,
              height: 40,
            }} />
          </>
        );
      }
      ```

    - ##### 提示
      不能在條件陳述句中宣告 `Effect`，但可以在 `Effect` 內部使用條件邏輯來控制其行為!

    - ##### 解答
      - 一個解法是把 `setPosition` 的呼叫包裹在 `if (canMove) { ... }` 條件陳述句中：
        ```jsx
        useEffect(() => {
          function handleMove(e) {
            if (canMove) {
              setPosition({ x: e.clientX, y: e.clientY });
            }
          }
          window.addEventListener('pointermove', handleMove);
          return () => window.removeEventListener('pointermove', handleMove);
        }, [canMove]);
        ```

      - 或者，也可以把事件訂閱的邏輯包裹在 `if (canMove) { ... }` 條件陳述句中：
        ```jsx
        useEffect(() => {
          function handleMove(e) {
            setPosition({ x: e.clientX, y: e.clientY });
          }
          if (canMove) {
            window.addEventListener('pointermove', handleMove);
            return () => window.removeEventListener('pointermove', handleMove);
          }
        }, [canMove]);
        ```

      - 在這兩種情況下，`canMove` 都是響應式變數，並在 `Effect` 中被讀取，這就是為什麼它必須在 `Effect` 的依賴清單中指定，這樣才能確保每次值改變後，`Effect` 都會重新同步。

  - #### 3. 尋找過時值的錯誤
    範例中，勾選核取方塊時粉色的點應該移動，取消勾選時應該停止移動，這個邏輯已經實作了：`handleMove` 事件處理函式檢查 `canMove` 狀態變數。然而問題是，`handleMove` 內部的 `canMove` 狀態變數似乎是「過時的」：即使取消選中核取方塊之後，它始終是 `true`。任務是找出程式碼中的錯誤並修復。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function App() {
        const [position, setPosition] = useState({ x: 0, y: 0 });
        const [canMove, setCanMove] = useState(true);

        function handleMove(e) {
          if (canMove) {
            setPosition({ x: e.clientX, y: e.clientY });
          }
        }

        useEffect(() => {
          window.addEventListener('pointermove', handleMove);
          return () => window.removeEventListener('pointermove', handleMove);
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, []);

        return (
          <>
            <label>
              <input type="checkbox"
                checked={canMove}
                onChange={e => setCanMove(e.target.checked)}
              />
              是否允許移動
            </label>
            <hr />
            <div style={{
              position: 'absolute',
              backgroundColor: 'pink',
              borderRadius: '50%',
              opacity: 0.6,
              transform: `translate(${position.x}px, ${position.y}px)`,
              pointerEvents: 'none',
              left: -20,
              top: -20,
              width: 40,
              height: 40,
            }} />
          </>
        );
      }
      ```

    - ##### 提示
      如果程式碼中有一個被停用的 `linter` 規則，建議考慮移除這個停用，因為停用 `linter` 規則可能隱藏了潛在的錯誤。

    - ##### 解答
      - 原始程式碼的問題在於停用了依賴性檢查的 `linter` 規則。移除停用後會發現，這個 `Effect` 依賴於 `handleMove` 函式 —— 這是有道理的：`handleMove` 是在組件體內宣告的，這使得它成為一個響應式值，每個響應式值都必須在依賴清單中指定，否則可能會隨著時間推移而過時!

      - 原始程式碼透過宣告 `Effect` 不依賴任何響應式值（`[]`）來欺騙 `React`，這就是為什麼 `React` 在 `canMove` 改變後（以及 `handleMove`）沒有重新同步該 `Effect`。因為 `React` 沒有重新同步該 `Effect`，附加的 `handleMove` 監聽器，就是初始渲染期間建立的那個函式，而當時 `canMove` 是 `true`，所以初始渲染時的 `handleMove` 將永遠取得該值。

      - 如果從不停用 `linter`，就不會遇到過時值的問題。更好的解決方案是把 `handleMove` 函式移動到 `Effect` 內部，這樣它就不再是響應式值，`Effect` 就不會依賴於這個函式，而是依賴於 `Effect` 內部的 `canMove`：

        ```jsx
        useEffect(() => {
          function handleMove(e) {
            if (canMove) {
              setPosition({ x: e.clientX, y: e.clientY });
            }
          }

          window.addEventListener('pointermove', handleMove);
          return () => window.removeEventListener('pointermove', handleMove);
        }, [canMove]);
        ```

      - 這符合預期行為，因為 `Effect` 現在會始終與 `canMove` 的值保持同步，並且只在必要時重新訂閱。

  - #### 4. 修復連接開關
    `chat.js` 中的聊天服務提供了兩個不同的 API：`createEncryptedConnection` 和 `createUnencryptedConnection`。根組件 `App` 讓使用者選擇是否使用加密，並把相應的 `API` 方法作為 `createConnection` 屬性傳給子組件 `ChatRoom`。切換核取方塊沒有立即生效，但若在此之後更改所選聊天室，聊天會重新連接並且啟用加密，這是一個錯誤，任務是修復它。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function ChatRoom({ roomId, createConnection }) {
        useEffect(() => {
          const connection = createConnection(roomId);
          connection.connect();
          return () => connection.disconnect();
          // eslint-disable-next-line react-hooks/exhaustive-deps
        }, [roomId]);

        return <h1>歡迎來到 {roomId} 聊天室！</h1>;
      }
      ```

    - ##### 提示
      停用程式碼檢查工具總是令人產生疑問，這可能是一個 `bug` 嗎?

    - ##### 解答
      - 若解除程式碼檢查工具的停用，會看到一個 `lint` 錯誤。問題在於 `createConnection` 是一個 `prop`，因此它是一個響應式的值，可能隨時間改變。修復方式是把它包含在依賴項清單中：

        ```jsx
        useEffect(() => {
          const connection = createConnection(roomId);
          connection.connect();
          return () => connection.disconnect();
        }, [roomId, createConnection]);
        ```

      - 不過，這段程式碼並不夠健壯，因為若在 `App` 組件中把內聯函式作為 `prop` 值傳入，每次 `App` 組件重新渲染時該值都會不同，導致 `Effect` 可能會過於頻繁地重新同步。為避免這種情況，更好的做法是改傳 `isEncrypted` 作為 `prop` 值，並在 `Effect` 內部決定使用哪個函式：

        ```jsx
        useEffect(() => {
          const createConnection = isEncrypted ?
            createEncryptedConnection :
            createUnencryptedConnection;
          const connection = createConnection(roomId);
          connection.connect();
          return () => connection.disconnect();
        }, [roomId, isEncrypted]);
        ```

      - 由於 `createEncryptedConnection` 和 `createUnencryptedConnection` 都是在組件外部宣告的，它們不是響應式的，因此不需要作為依賴項。

  - #### 5. 填充一系列選擇框
    範例中有兩個下拉框：一個讓使用者選擇行星，另一個讓使用者選擇該行星上的地點，但第二個下拉框目前無法正常運作。任務是讓它能顯示所選行星上的地點：選擇行星應填充地點清單，更改行星則應相應改變地點清單。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { fetchData } from './api.js';

      export default function Page() {
        const [planetList, setPlanetList] = useState([])
        const [planetId, setPlanetId] = useState('');

        const [placeList, setPlaceList] = useState([]);
        const [placeId, setPlaceId] = useState('');

        useEffect(() => {
          let ignore = false;
          fetchData('/planets').then(result => {
            if (!ignore) {
              console.log('獲取了一個行星列表。');
              setPlanetList(result);
              setPlanetId(result[0].id); // 選擇第一個行星
            }
          });
          return () => {
            ignore = true;
          }
        }, []);

        return (
          <>
            <label>
              選擇一個行星：{' '}
              <select value={planetId} onChange={e => {
                setPlanetId(e.target.value);
              }}>
                {planetList?.map(planet =>
                  <option key={planet.id} value={planet.id}>{planet.name}</option>
                )}
              </select>
            </label>
            <label>
              選擇一個地點：{' '}
              <select value={placeId} onChange={e => {
                setPlaceId(e.target.value);
              }}>
                {placeList?.map(place =>
                  <option key={place.id} value={place.id}>{place.name}</option>
                )}
              </select>
            </label>
            <hr />
            <p>你將要前往：{planetId || '...'} 的 {placeId || '...'} </p>
          </>
        );
      }
      ```

    - ##### 提示
      如果有兩個獨立的同步過程，需要撰寫兩個獨立的 `Effect`。

    - ##### 解答
      - 這裡有兩個獨立的同步過程：第一個選擇框與遠端的行星清單同步；第二個選擇框則與目前 `planetId` 對應的遠端地點清單同步。因此，把它們寫成兩個獨立的 `Effect` 是合理的：

        ```jsx
        useEffect(() => {
          let ignore = false;
          fetchData('/planets').then(result => {
            if (!ignore) {
              setPlanetList(result);
              setPlanetId(result[0].id);
            }
          });
          return () => { ignore = true; }
        }, []);

        useEffect(() => {
          if (planetId === '') {
            return;
          }
          let ignore = false;
          fetchData('/planets/' + planetId + '/places').then(result => {
            if (!ignore) {
              setPlaceList(result);
              setPlaceId(result[0].id);
            }
          });
          return () => { ignore = true; }
        }, [planetId]);
        ```

      - 這段程式碼有些重複，然而把它們合併為單一 `Effect` 的理由並不充分 —— 如果這樣做，就必須把兩個 `Effect` 的依賴項合併為一個清單，這樣改變行星時會重新取得所有行星的清單。`Effect` 並不是用於程式碼複用的工具，相反，為了減少重複，可以把部分邏輯抽取到一個自訂 `Hook` 中（例如 `useSelectOptions`）。理想情況下，應用程式中的大多數 `Effect`，最終都應該由自訂 `Hook` 取代，無論是自行撰寫還是由社群提供，自訂 `Hook` 隱藏了同步邏輯，因此呼叫端的組件不需要知道 `Effect` 的存在。