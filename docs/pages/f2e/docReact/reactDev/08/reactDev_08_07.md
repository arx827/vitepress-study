---
title: '[React官網] React 19.2 教學文件'
---

# 移除 Effect 依賴
  當撰寫 `Effect` 時，`linter` 會驗證是否已把 `Effect` 讀取的每一個響應式值（如 `props` 和 `state`）包含在 `Effect` 的依賴中。這能確保 `Effect` 與組件的 `props` 和 `state` 保持同步。不必要的依賴可能會導致 `Effect` 執行過於頻繁，甚至產生無限循環。請按照本指南審查並移除 `Effect` 中不必要的依賴。

  :::info 你將會學到：
  - 修復無限的 `Effect` 依賴性循環
  - 當你想移除依賴時，該怎麼做
  - 從 `Effect` 中讀取值而不對它作出「反應」
  - 為什麼以及如何避免物件和函式的依賴？
  - 為什麼抑制依賴程式碼檢查器的檢查是危險的，以及應該如何做？
  :::

## 依賴應該和程式碼保持一致
  - 當你撰寫 `Effect` 時，無論這個 `Effect` 要做什麼，你首先要明確其生命週期：

    ```jsx {5-7}
    const serverUrl = 'https://localhost:1234';

    function ChatRoom({ roomId }) {
      useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
        // ...
    }
    ```

  - 如果你把 `Effect` 的依賴設為空陣列（`[]`），`linter` 就會建議合適的依賴。按照 `linter` 的建議把它們填進去：
    
    ```jsx {6}
    function ChatRoom({ roomId }) {
      useEffect(() => {
        const connection = createConnection(serverUrl, roomId);
        connection.connect();
        return () => connection.disconnect();
      }, [roomId]); // ✅ 所有依賴已宣告
      // ...
    }
    ```

  - `Effect` 會對響應式值作出「反應」。因為這裡的 `roomId` 是一個響應式值（它可能隨重新渲染而改變），所以 `linter` 會驗證你是否將它指定為依賴。如果 `roomId` 變成不同的值，`React` 就會重新執行 `Effect`，這能確保聊天介面與所選房間保持一致，並把變化「反饋」給下拉選單。

  - ### 當要移除一個依賴時，請證明它不是一個依賴
    - 注意，你不能「選擇」`Effect` 的依賴，每個被 `Effect` 使用的響應式值，都必須在依賴中宣告。依賴是由 `Effect` 的程式碼決定的：

      ```jsx
      const serverUrl = 'https://localhost:1234';

      function ChatRoom({ roomId }) { // 這是一個響應式值
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId); // Effect 在這裡讀取響應式值
          connection.connect();
          return () => connection.disconnect();
        }, [roomId]); // ✅ 所以你必須在依賴中宣告 Effect 使用的響應式值
        // ...
      }
      ```

    - 響應式值包括 `props` 以及所有你直接在組件中宣告的變數和函式。由於 `roomId` 是響應式值，你不能把它從依賴中移除。`linter` 不允許這樣做，因為 `roomId` 可能會隨時間變化，這會在程式碼中引入錯誤。

    - `移除一個依賴`，你需要向 `linter` 證明其不需要這個依賴。例如，你可以把 `roomId` 移出組件，以證明它不是響應式的，也不會在重新渲染時改變：

      ```jsx {2,9}
      const serverUrl = 'https://localhost:1234';
      const roomId = '音樂'; // 不再是響應式值

      function ChatRoom() {
        useEffect(() => {
          const connection = createConnection(serverUrl, roomId);
          connection.connect();
          return () => connection.disconnect();
        }, []); // ✅ 所有依賴已宣告
        // ...
      }
      ```

    - 現在 `roomId` 不是響應式值（並且不會在重新渲染時改變），因此它不需要作為依賴項。這就是為什麼你現在可以指定空（`[]`）依賴。`Effect` 真的不依賴任何響應式值了，也真的不需要在組件的 `props` 或 `state` 改變時重新執行。

  - ### 要改變依賴，請改變程式碼
    - 你可能已經注意到工作流程中有一個模式：
      1. 首先，你改變 `Effect` 的程式碼或響應式值的宣告方式。
      2. 然後，你採納 `linter` 的建議，調整依賴，以匹配你所改變的程式碼。
      3. 如果你對依賴不滿意，你可以回到第一步（並再次修改程式碼）。

    - 最後一部分很重要。如果你想改變依賴，首先要改變所涉及到的程式碼。你可以把依賴看作是 `Effect` 的程式碼所依賴的所有響應式值的清單。你不要選擇把什麼放在這個清單上，該清單描述了程式碼。要改變依賴，請改變程式碼。

    - 這可能感覺就像解方程式一樣。你有一個目標（例如，移除一個依賴），你需要 `「找到」` 與該目標相匹配的程式碼。不是每個人都覺得解方程式很有趣，寫 `Effect` 也是如此!幸運的是，下面有一些常見的解決方案你可以去嘗試。

    :::info 注意事項： 如果你有一個已經存在的程式碼庫，你可能會有一些像這樣抑制 `linter` 的程式碼：
    ```jsx {3-4}
    useEffect(() => {
      // ...
      // 🔴 避免像這樣抑制 linter 的警告或錯誤提示：
      // eslint-ignore-next-line react-hooks/exhaustive-deps
    }, []);
    ```

    - 當依賴與程式碼不匹配時，極有可能引入 `bug`。透過抑制 `linter`，你是在 `Effect` 所依賴的值上對 `React`「撒謊」。
    :::

    :::info 深入探討：為什麼抑制 `linter` 對依賴的檢查如此危險？
    - 抑制 linter 會導致非常不直觀的 `bug`，這將很難發現和修復。舉一個例子：一個計數器範例本應該每秒遞增，遞增量可以透過兩個按鈕來控制。若你「撒謊」告訴 `React` 這個 `Effect` 不依賴於任何東西，`React` 便一直使用初次渲染時的 `onTick` 函式。在後續渲染中，`count` 總是 `0`，`increment` 總是 `1`。為什麼？因為計時器每秒呼叫 `onTick` 函式，實際執行的是 `setCount(0 + 1)`，所以你總是看到 `1`。像這樣的錯誤，當它們分散在多個組件中時，就更難解決了。

    - 這裡有一個比忽略 `linter` 更好的解決方案!那便是把 `onTick` 加入依賴中（為了確保 `interval` 只設定一次，使 `onTick` 成為 `Effect Event`）。

    - 我們建議把依賴性 `lint` 錯誤作為一個編譯錯誤來處理。如果你不抑制它，你將永遠不會遇到像上面這樣的錯誤。
    :::

## 移除非必需的依賴
  - 每當你調整 `Effect` 的依賴以適配程式碼時，請注意一下目前的依賴。當這些依賴發生變化時，讓 `Effect` 重新執行是否有意義？有時，答案是 `「不」`：
    - 你可能想在不同的條件下重新執行 `Effect` 的不同部分。
    - 你可能想只讀取某個依賴的最新值，而不是對其變化做出 `「反應」`。
    - 依賴可能會因為它的類型是物件或函式而無意間改變太頻繁。

  - 為了找到正確的解決方案，你需要回答關於 `Effect` 的幾個問題。

  - ### 這段程式碼應該移到事件處理函式中嗎？
    - 你應該考慮的第一件事是，這段程式碼是否應該成為 `Effect`。

    - 想像一個表單，在提交時把 `submitted` 狀態變數設為 `true`，並在 `submitted` 為 `true` 時，需要傳送 `POST` 請求並顯示通知。若你把這個邏輯放在 `Effect` 內，並根據 `submitted` 為 `true` 「反應」，之後你想透過讀取目前的主題值來調整通知訊息的樣式，因為 `theme` 是在組件中宣告的，所以是響應式值，你決定把它作為依賴加入。

    - 如果這麼做，你會引入一個錯誤：想像一下，你先提交表單，然後切換暗亮主題。當 `theme` 改變後，`Effect` 重新執行，這會導致顯示兩次相同的通知!

    - 首先，這裡的問題是，程式碼不應該以 `Effect` 實作。你想傳送這個 `POST` 請求，並在提交表單時顯示通知，這是一個特定的互動。請將該邏輯直接放到相應的事件處理函式中：

      ```jsx {2,5-7}
      function Form() {
        const theme = useContext(ThemeContext);

        function handleSubmit() {
          // ✅ 好：從事件處理函式呼叫特定於事件的邏輯
          post('/api/register');
          showNotification('Successfully registered!', theme);
        }
        // ...
      }
      ```

    - 現在，程式碼在事件處理函式中，它不是響應式的 —— 所以它只在使用者提交表單時執行。

  - ### Effect 是否在做幾件不相關的事情？
    - 下一個應該問自己的問題是，`Effect` 是否在做幾件不相關的事情。

    - 如下例子，你正在實作運輸表單，使用者需要選擇他們的城市和地區。你根據所選的 `「國家」` 從伺服器上取得 `「城市」` 清單，然後在下拉選單中顯示。這是一個在 `Effect` 中取得資料的好例子：`cities state` 透過網路和 `country props` 進行「同步」。但你不能在事件處理函式中這樣做，因為你需要在 `ShippingForm` 顯示時和 `country` 發生變化時（不管是哪個互動導致的）立即取得。

    - 現在假設你要為城市區域加入第二個選擇框，它應該取得目前選擇的 `city` 的 `areas`。你也許會在同一個 `Effect` 中加入第二個 `fetch` 呼叫來取得地區清單。然而，由於 `Effect` 現在使用 `city state` 變數，你不得不把 `city` 加入到依賴中，這又帶來一個問題：當使用者選擇不同的城市時，`Effect` 將重新執行並呼叫 `fetchCities(country)`，這將導致不必要地多次取得城市清單。

    - 這段程式碼的問題在於，你在同步兩個不同的、不相關的東西：
      1. 你想要根據 `country props` 透過網路同步 `city state`。
      2. 你想要根據 `city` 狀態透過網路同步 `areas state`。

    - 把邏輯分到 2 個 `Effect` 中，每個 `Effect` 僅回應其需要同步回應的 `props`：
      
      ```jsx {19-33}
      function ShippingForm({ country }) {
        const [cities, setCities] = useState(null);
        useEffect(() => {
          let ignore = false;
          fetch(`/api/cities?country=${country}`)
            .then(response => response.json())
            .then(json => {
              if (!ignore) {
                setCities(json);
              }
            });
          return () => {
            ignore = true;
          };
        }, [country]); // ✅ 所有依賴已宣告

        const [city, setCity] = useState(null);
        const [areas, setAreas] = useState(null);
        useEffect(() => {
          if (city) {
            let ignore = false;
            fetch(`/api/areas?city=${city}`)
              .then(response => response.json())
              .then(json => {
                if (!ignore) {
                  setAreas(json);
                }
              });
            return () => {
              ignore = true;
            };
          }
        }, [city]); // ✅ 所有依賴已宣告
        // ...
      ```

    - 現在，第一個 `Effect` 只在 `country` 改變時重新執行，而第二個 `Effect` 在 `city` 改變時重新執行。你已經按目的把它們分開了：兩件不同的事情由兩個獨立的 `Effect` 來同步。兩個獨立的 `Effect` 有兩個獨立的依賴，所以它們不會在無意中互相觸發。

    - 最終完成的程式碼比最初的要長，但拆分這些 `Effect` 是非常正確的。每個 `Effect` 應該代表一個獨立的同步過程。若你擔心重複程式碼的問題，可以透過抽取相同邏輯到自訂 `Hook` 來提升程式碼品質。

  - ### 是否在讀取一些狀態來計算下一個狀態？
    - 每次有新的訊息到達時，一個範例 `Effect` 會用新建立的陣列更新 `messages state`。它使用 `messages` 變數來建立一個新的陣列，然而由於 `messages` 是一個由 `Effect` 讀取的響應式值，它必須是一個依賴 —— 但讓 `messages` 成為依賴會帶來問題：每當你收到一條訊息，`setMessages()` 就會使該組件重新渲染出一個新的 `messages` 陣列，而由於該 `Effect` 現在依賴於 `messages`，這也將重新同步該 `Effect`。所以每條新訊息都會使聊天重新連接，使用者不會喜歡這樣!

    - 為了解決這個問題，不要在 `Effect` 裡面讀取 `messages`，相反，應該把一個 `state` 更新函式傳給 `setMessages`：

      ```jsx
      function ChatRoom({ roomId }) {
        const [messages, setMessages] = useState([]);
        useEffect(() => {
          const connection = createConnection();
          connection.connect();
          connection.on('message', (receivedMessage) => {
            setMessages(msgs => [...msgs, receivedMessage]);
          });
          return () => connection.disconnect();
        }, [roomId]); // ✅ 所有依賴已宣告
        // ...
      ```

    - 注意 `Effect` 現在根本不讀取 `messages` 變數。你只需要傳遞一個更新函式，例如 `msgs => [...msgs, receivedMessage]`。`React` 會把更新程式函式放入佇列，並在下一次渲染期間向其提供 `msgs` 參數，這就是為什麼 `Effect` 本身不再需要依賴 `messages` 的原因。修復後，接收聊天訊息將不再使聊天重新連接。

  - ### 你想讀取一個值而不對其變化做出「反應」嗎？
    - 假設你希望在使用者收到新訊息時播放聲音，`isMuted` 為 `true` 時除外。由於 `Effect` 現在在其程式碼中使用了 `isMuted`，因此必須把它加到依賴中。問題是每次 `isMuted` 改變時（例如，當使用者按下「靜音」開關時），`Effect` 就會重新同步，並重新連接到聊天，這不是理想的使用者體驗!（在此範例中，即使停用 `linter` 也不起作用 —— 若你這樣做，`isMuted` 將「保持」其舊值。）

    - 要解決這個問題，需要把不應該響應式的邏輯從 `Effect` 中抽取出來。你不希望此 `Effect` 對 `isMuted` 中的變化做出「反應」。把這段非響應式邏輯移至 `Effect Event` 中：

      ```jsx {1,7-12,18,21}
      import { useState, useEffect, useEffectEvent } from 'react';

      function ChatRoom({ roomId }) {
        const [messages, setMessages] = useState([]);
        const [isMuted, setIsMuted] = useState(false);

        const onMessage = useEffectEvent(receivedMessage => {
          setMessages(msgs => [...msgs, receivedMessage]);
          if (!isMuted) {
            playSound();
          }
        });

        useEffect(() => {
          const connection = createConnection();
          connection.connect();
          connection.on('message', (receivedMessage) => {
            onMessage(receivedMessage);
          });
          return () => connection.disconnect();
        }, [roomId]); // ✅ 所有依賴已宣告
        // ...
      ```

    - `Effect Events` 讓你可以把 `Effect` 分成響應式部分（應該「反應」響應式值，如 `roomId` 及其變化）和非響應式部分（只讀取它們的最新值，如 `onMessage` 讀取 `isMuted`）。現在你在 `Effect Event` 中讀取了 `isMuted`，它不需要加入到 `Effect` 依賴中。因此，當你打開或關閉「靜音」設定時，聊天不會重新連接。
  
    - #### 包裝來自 props 的事件處理函式
      - 當組件接收事件處理函式作為 `props` 時，你可能會遇到類似的問題。假設父組件在每次渲染時都傳遞了一個不同的 `onReceiveMessage` 函式，由於 `onReceiveMessage` 是依賴，它會導致 `Effect` 在每次父級重新渲染後重新同步，這將導致聊天重新連接。要解決此問題，請用 `Effect Event` 包裹之後再呼叫：

        ```jsx {1,4-6,12,15}
        function ChatRoom({ roomId, onReceiveMessage }) {
          const [messages, setMessages] = useState([]);

          const onMessage = useEffectEvent(receivedMessage => {
            onReceiveMessage(receivedMessage);
          });

          useEffect(() => {
            const connection = createConnection();
            connection.connect();
            connection.on('message', (receivedMessage) => {
              onMessage(receivedMessage);
            });
            return () => connection.disconnect();
          }, [roomId]); // ✅ 所有依賴已宣告
          // ...
        ```

      - `Effect Events` 不是響應式的，因此你不需要把它們指定為依賴。因此，即使父組件傳遞的函式在每次重新渲染時都不同，聊天也將不再重新連接。

    - #### 分離響應式和非響應式程式碼
      - 在一個範例中，你希望在每次 `roomId` 更改時記錄一次日誌，並希望每個日誌中包含目前的 `notificationCount`，但你不希望因更改 `notificationCount` 而觸發日誌事件。解決方案還是把非響應式程式碼拆分，放到 `Effect Event` 內：

        ```jsx {2-4,7}
        function Chat({ roomId, notificationCount }) {
          const onVisit = useEffectEvent(visitedRoomId => {
            logVisit(visitedRoomId, notificationCount);
          });

          useEffect(() => {
            onVisit(roomId);
          }, [roomId]); // ✅ 所有依賴已宣告
          // ...
        }
        ```

      - 你希望邏輯對 `roomId` 做出回應，因此你在 `Effect` 中讀取 `roomId`。但你不希望更改 `notificationCount` 來記錄額外的日誌輸出，因此可以在 `Effect Event` 中讀取 `notificationCount`。

  - ### 一些響應式值是否無意中改變了？
    - 有時，你確實希望 `Effect` 對某個值「做出反應」，但該值的變化比你希望的更頻繁 —— 並且可能不會從使用者的角度反映任何實際變化。例如，假設你在組件中建立了 `options` 物件，然後從 `Effect` 內部讀取該物件。該物件在組件中宣告，因此它是響應式值，當你在 `Effect` 中讀取這樣的響應式值時，把它宣告為依賴很重要，例如可確保若 `roomId` 發生變化，`Effect` 就會使用新的 `options` 重新連接到聊天。

    - 但是，若嘗試在輸入框中輸入內容，會發現連接不斷重新建立。輸入僅更新 `message` 狀態變數，從使用者的角度來看，這不應該影響聊天連接。然而每次更新 `message` 時，組件都會重新渲染，而每次重新渲染 `ChatRoom` 組件時，都會從頭開始建立一個新的 `options` 物件。`React` 發現 `options` 物件與上次渲染期間建立的 `options` 物件是不同的物件，這就是為什麼它會重新同步依賴 `options` 的 `Effect`，並在你輸入時重新連接聊天。

    - 此問題僅影響物件和函式。在 `JavaScript` 中，每個新建立的物件和函式都被認為與其他所有物件和函式不同，即使它們的值相同也沒關係!

      ```jsx {7-8}
      // 第一次渲染
      const options1 = { serverUrl: 'https://localhost:1234', roomId: '音樂' };

      // 下一次渲染
      const options2 = { serverUrl: 'https://localhost:1234', roomId: '音樂' };

      // 這是 2 個不同的物件
      console.log(Object.is(options1, options2)); // false
      ```

    - 把物件和函式作為依賴，會使 `Effect` 比你需要的更頻繁地重新同步。

    - 這就是為什麼你應該儘可能避免把物件和函式作為 `Effect` 的依賴，應嘗試把它們移到組件外部、`Effect` 內部，或從中提取原始值。

    - #### 把靜態物件和函式移出組件
      - 如果該物件不依賴於任何 `props` 和 `state`，你可以把該物件移到組件之外：

        ```jsx {1-4,13}
        const options = {
          serverUrl: 'https://localhost:1234',
          roomId: '音樂'
        };

        function ChatRoom() {
          const [message, setMessage] = useState('');

          useEffect(() => {
            const connection = createConnection(options);
            connection.connect();
            return () => connection.disconnect();
          }, []); // ✅ 所有依賴已宣告
          // ...
        ```

      - 這樣，你向 `linter` 證明它不是響應式的，它不會因為重新渲染而改變，所以它不是依賴。現在重新渲染 `ChatRoom` 不會導致 `Effect` 重新同步。

      - 這也適用於函式場景：
        ```jsx {1-6,12}
        function createOptions() {
          return {
            serverUrl: 'https://localhost:1234',
            roomId: '音樂'
          };
        }

        function ChatRoom() {
          const [message, setMessage] = useState('');

          useEffect(() => {
            const options = createOptions();
            const connection = createConnection(options);
            connection.connect();
            return () => connection.disconnect();
          }, []); // ✅ 所有依賴已宣告
          // ...
        ```

      - 由於 `createOptions` 是在組件外部宣告的，因此它不是響應式值，這就是為什麼它不需要在 `Effect` 的依賴中指定，以及為什麼它永遠不會導致 `Effect` 重新同步。

    - #### 把動態物件和函式移動到 Effect 中
      - 若物件依賴於一些可能因重新渲染而改變的響應式值，例如 `roomId props`，那麼你不能將它放置於組件外部。你可以在 `Effect` 內部建立它：

        ```jsx {7-11,14}
        const serverUrl = 'https://localhost:1234';

        function ChatRoom({ roomId }) {
          const [message, setMessage] = useState('');

          useEffect(() => {
            const options = {
              serverUrl: serverUrl,
              roomId: roomId
            };
            const connection = createConnection(options);
            connection.connect();
            return () => connection.disconnect();
          }, [roomId]); // ✅ 所有依賴已宣告
          // ...
        ```

      - 現在 `options` 已在 `Effect` 中宣告，它不再是 `Effect` 的依賴。相反，`Effect` 使用的唯一響應式值是 `roomId`。由於 `roomId` 不是物件或函式，你可以確定它不會無意間變不同。在 `JavaScript` 中，數字和字串是根據它們的內容進行比較的。

      - 得益於此修復，當你編輯輸入框時，聊天將不再重新連接；然而，當你更改 `roomId` 下拉選單時，它確實重新連接，正如你所期望的那樣。

      - 這也適用於函式的場景。你可以撰寫自己的函式來組織 `Effect` 中的邏輯，只要把這些函式宣告在 `Effect` 內部，它們就不是響應式值，因此它們也不是 `Effect` 的依賴。
  
    - #### 從物件中讀取原始值
      - 有時，你可能會透過 `props` 接收到類型為物件的值。這裡的風險是父組件會在渲染過程中建立物件，這將導致 `Effect` 在每次父組件重新渲染時重新連接。要解決此問題，請從 `Effect` 外部讀取物件資訊，並避免依賴物件和函式類型：

        ```jsx {4,7-8,12}
        function ChatRoom({ options }) {
          const [message, setMessage] = useState('');

          const { roomId, serverUrl } = options;
          useEffect(() => {
            const connection = createConnection({
              roomId: roomId,
              serverUrl: serverUrl
            });
            connection.connect();
            return () => connection.disconnect();
          }, [roomId, serverUrl]); // ✅ 所有依賴已宣告
          // ...
        ```

      - 邏輯有點重複（你從 `Effect` 外部的物件讀取一些值，然後在 `Effect` 內部建立具有相同值的物件），但這使得 `Effect` 實際依賴的資訊非常明確。若物件被父組件無意中重新建立，聊天也不會重新連接。但若 `options.roomId` 或 `options.serverUrl` 確實不同，聊天將重新連接。

    - #### 從函式中計算原始值
      - 同樣的方法也適用於函式。例如，假設父組件傳遞了一個函式，為避免使其成為依賴（並導致重新渲染時重新連接），請在 `Effect` 外部呼叫它，這能取得不是物件的 `roomId` 和 `serverUrl` 值，再從 `Effect` 中讀取它們。這僅適用於純函式，因為它們在渲染期間可以安全呼叫。若函式是一個事件處理函式，但你不希望它的更改重新同步 `Effect`，可以把它包裝到 `Effect Event` 中。

## 重點複習（Recap）
  - 依賴應始終與程式碼匹配。
  - 當你對依賴不滿意時，你需要編輯的是程式碼。
  - 抑制 `linter` 會導致非常混亂的錯誤，應始終避免它。
  - 要移除依賴，你需要向 `linter`「證明」它不是必需的。
  - 若某些程式碼是為了回應特定互動，請將該程式碼移至事件處理的地方。
  - 若 `Effect` 的不同部分，因不同原因需要重新執行，請將其拆分為多個 `Effect`。
  - 若想根據以前的狀態更新一些狀態，傳遞一個更新函式。
  - 若想讀取最新值而不「反應」它，請從 `Effect` 中提取出一個 `Effect Event`。
  - 在 `JavaScript` 中，若物件和函式是在不同時間建立的，則它們被認為是不同的。
  - 儘量避免物件和函式依賴，把它們移到組件外或 `Effect` 內。

## 挑戰（Challenges）
  - #### 1. 修復重置 interval
    `Effect` 設定了一個每秒執行的 `interval`，但每次 `interval` 都會被銷毀並重新建立，任務是修復程式碼，使 `interval` 不會被不斷重新建立。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function Timer() {
        const [count, setCount] = useState(0);

        useEffect(() => {
          console.log('✅ 創建定時器');
          const id = setInterval(() => {
            console.log('⏰ Interval');
            setCount(count + 1);
          }, 1000);
          return () => {
            console.log('❌ 清除定時器');
            clearInterval(id);
          };
        }, [count]);

        return <h1>計數器: {count}</h1>
      }
      ```

    - ##### 提示
      看起來這個 `Effect` 的程式碼依賴於 `count`。有什麼方法不需要這依賴嗎?有，那就是根據其之前的值更新 `count state`，從而避免加入對該值的依賴。

    - ##### 解答
      - 使用更新函式，寫 `setCount(c => c + 1)` 而不是 `setCount(count + 1)`：

        ```jsx
        useEffect(() => {
          const id = setInterval(() => {
            setCount(c => c + 1);
          }, 1000);
          return () => {
            clearInterval(id);
          };
        }, []);
        ```
        
      - 不應在 `Effect` 中讀取 `count`，而是把 `c => c + 1` 指令（「增加此數字!」）傳給 `React`，`React` 將在下一次渲染時執行它。由於不再需要讀取 `Effect` 中 `count` 的值，因此可以把 `Effect` 的依賴保持為空（`[]`），防止 `Effect` 在每次執行時重新建立計時器 `interval`。

  - #### 2. 修復重新觸發動畫的問題
    範例中，當你按下 `「顯示」` 時，歡迎訊息淡入，動畫持續一秒鐘。但目前移動控制 `duration` 狀態變數的滑桿時，會重新觸發動畫。任務是改變行為，讓 `Effect` 不會對 `duration` 變數做出「反應」—— 按下 `「顯示」` 時 `Effect` 應使用滑桿上目前的 `duration` 值，但移動滑桿本身不應重新觸發動畫。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect, useRef } from 'react';
      import { useEffectEvent } from 'react';
      import { FadeInAnimation } from './animation.js';

      function Welcome({ duration }) {
        const ref = useRef(null);

        useEffect(() => {
          const animation = new FadeInAnimation(ref.current);
          animation.start(duration);
          return () => {
            animation.stop();
          };
        }, [duration]);

        return (
          <h1
            ref={ref}
            style={{
              opacity: 0,
              color: 'white',
              padding: 50,
              textAlign: 'center',
              fontSize: 50,
              backgroundImage: 'radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%)'
            }}
          >
            歡迎
          </h1>
        );
      }

      export default function App() {
        const [duration, setDuration] = useState(1000);
        const [show, setShow] = useState(false);

        return (
          <>
            <label>
              <input
                type="range"
                min="100"
                max="3000"
                value={duration}
                onChange={e => setDuration(Number(e.target.value))}
              />
              <br />
              淡入 interval: {duration} ms
            </label>
            <button onClick={() => setShow(!show)}>
              {show ? '移除' : '顯示'}
            </button>
            <hr />
            {show && <Welcome duration={duration} />}
          </>
        );
      }
      ```

    - ##### 提示
      `Effect` 中是否有一行程式碼不應該是響應式的? 如何把非響應式程式碼移出 `Effect`?
      
    - ##### 解答
      `Effect` 需要讀取 `duration` 的最新值，但不希望它對 `duration` 的變化做出「反應」，把非響應式程式碼行提取到 `Effect Event` 中：

        ```jsx
        const onAppear = useEffectEvent(animation => {
          animation.start(duration);
        });

        useEffect(() => {
          const animation = new FadeInAnimation(ref.current);
          onAppear(animation);
          return () => {
            animation.stop();
          };
        }, []);
        ```

      像 `onAppear` 這樣的 `Effect Events` 不是響應式的，因此可以在不重新觸發動畫的情況下讀取內部的 `duration`。

  - #### 3. 修復聊天重新連接的問題
    範例中，每次按 `「切換主題」` 時，聊天都會重新連接，任務是修復它，只有當編輯伺服器 `URL` 或選擇不同的聊天室時，聊天才會重新連接。

    - ##### 原始程式碼
      ```jsx
      import { useEffect } from 'react';
      import { createConnection } from './chat.js';

      export default function ChatRoom({ options }) {
        useEffect(() => {
          const connection = createConnection(options);
          connection.connect();
          return () => connection.disconnect();
        }, [options]);

        return <h1>歡迎來到 {options.roomId} 房間！</h1>;
      }
      ```

    - ##### 提示
      解決這個問題的方法不止一種，但最終你希望避免把物件作為依賴。

    - ##### 解答
      `Effect` 因依賴於 `options` 物件，導致其重新執行。侵入性最小的修復方法是在 `Effect` 外部讀取 `roomId` 和 `serverUrl`，然後使 `Effect` 依賴於這些原始值（不能無意地更改），在 `Effect` 內部建立一個物件並傳給 `createConnection`：

      ```jsx
      export default function ChatRoom({ options }) {
        const { roomId, serverUrl } = options;
        useEffect(() => {
          const connection = createConnection({
            roomId: roomId,
            serverUrl: serverUrl
          });
          connection.connect();
          return () => connection.disconnect();
        }, [roomId, serverUrl]);
        // ...
      }
      ```

      更好的做法是用更具體的 `roomId` 和 `serverUrl props` 取代物件 `options props`，儘可能堅持使用原始 `props`，以便日後更容易優化組件。

  - #### 4. 再次修復聊天重新連接的問題
    範例每次嘗試更改主題時聊天都會重新連接，任務是修復這個問題，更改主題不應重新連接聊天，但切換加密設定或更改房間應重新連接。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { useEffectEvent } from 'react';

      export default function ChatRoom({ roomId, createConnection, onMessage }) {
        useEffect(() => {
          const connection = createConnection();
          connection.on('message', (msg) => onMessage(msg));
          connection.connect();
          return () => connection.disconnect();
        }, [createConnection, onMessage]);

        return <h1>歡迎來到 {roomId} 房間！</h1>;
      }
      ```

    - ##### 提示
      傳遞的兩個函式 `onMessage` 和 `createConnection`，每次 `App` 重新渲染時都是從頭建立的，每次都被視為新值，這就是它們重新觸發 `Effect` 的原因。前者是事件處理函式，可以想想不對新的事件處理函式「做出反應」的方法；後者僅用於把某些狀態傳給匯入的 `API` 方法，這個函式真的有必要嗎?
      
    - ##### 解答
      - 針對 `onMessage`，把它包裝到 `Effect Event` 中：
        ```jsx
        const onReceiveMessage = useEffectEvent(onMessage);
        ```

      - 與 `onMessage props` 不同，`onReceiveMessage Effect Event` 不是響應式的，不需要成為 `Effect` 的依賴。

      - 對於 `createConnection`，由於它應該是響應式的（若使用者切換加密設定或房間，你希望重新觸發 `Effect`），但因為它是函式，你無法檢查它讀取的資訊是否實際發生了變化。解決方法是傳遞原始的 `roomId` 和 `isEncrypted` 值，而不是從 `App` 組件向下傳遞 `createConnection`，並把 `createConnection` 函式移到 `Effect` 裡面：

        ```jsx
        export default function ChatRoom({ roomId, isEncrypted, onMessage }) {
          const onReceiveMessage = useEffectEvent(onMessage);

          useEffect(() => {
            function createConnection() {
              const options = {
                serverUrl: 'https://localhost:1234',
                roomId: roomId
              };
              if (isEncrypted) {
                return createEncryptedConnection(options);
              } else {
                return createUnencryptedConnection(options);
              }
            }

            const connection = createConnection();
            connection.on('message', (msg) => onReceiveMessage(msg));
            connection.connect();
            return () => connection.disconnect();
          }, [roomId, isEncrypted]); // ✅ 所有依賴已宣告
        }
        ```

      - 經過這些更改，`Effect` 不再依賴於任何函式值，因此僅當有意義的內容（`roomId` 或 `isEncrypted`）發生變化時，聊天才會重新連接。