---
title: '[React官網] React 19.2 教程'
---

# 你可能不需要 Effect
  `Effect` 是 `React` 範式中的一種脫圍機制，它們讓你可以「逃出」`React`，並使組件與一些外部系統同步，例如非 `React` 組件、網路和瀏覽器 DOM。如果沒有涉及外部系統（例如，你想根據 `props` 或 `state` 的變化來更新一個組件的 `state`），就不應該使用 `Effect`。移除不必要的 `Effect` 能讓程式碼更容易理解、執行得更快，也更不容易出錯。

  :::info 你將會學到：
  - 為什麼以及如何從組件中移除 `Effect`
  - 如何在沒有 `Effect` 的情況下快取昂貴的計算
  - 如何在沒有 `Effect` 的情況下重置與調整組件的 `state`
  - 如何在事件處理函式之間共享邏輯
  - 應該把哪些邏輯移到事件處理函式中
  - 如何把發生的變動通知給父組件
  :::

## 如何移除不必要的 Effect
  - 有兩種不必使用 `Effect` 的常見情況：
    - `不必使用 Effect 來轉換渲染所需的資料`。例如，你想在顯示一份清單前先做篩選。直覺可能會讓你寫一個當清單變化時就更新 `state` 變數的 `Effect`，然而這是低效的。當你更新這個 `state` 時，`React` 首先會呼叫你的組件函式來計算應該顯示在畫面上的內容，接著 `React` 會把這些變化「提交」到 `DOM` 中來更新畫面，然後才執行 `Effect`。如果 `Effect` 也立即更新了這個 `state`，就會重新執行整個流程。為了避免不必要的渲染流程，應在組件最上層轉換資料，這些程式碼會在 `props` 或 `state` 變化時自動重新執行。

    - `不必使用 Effect 來處理使用者事件`。例如，你想在使用者購買一項產品時傳送一個 `/api/buy` 的 `POST` 請求並顯示一則提示。在這個購買按鈕的點擊事件處理函式中，你確切地知道會發生什麼；但當一個 `Effect` 執行時，你卻不知道使用者做了什麼（例如點擊了哪個按鈕）。這就是為什麼通常應該在對應的事件處理函式中處理使用者事件。

  - 你確實可以使用 `Effect` 來與外部系統同步。例如，可以寫一個 `Effect` 來保持一個 `jQuery` 元件與 React `state` 之間的同步；也可以使用 `Effect` 來取得資料，例如同步目前的查詢搜尋與查詢結果。請記住，比起直接在組件中寫 `Effect`，現代框架提供了更加高效、內建的資料取得機制。

  - 為了幫助你建立正確的直覺，來看看一些常見的實例吧！

  - ### 根據 props 或 state 來更新 state
    - 假設有一個包含兩個 `state` 變數的組件：`firstName` 和 `lastName`，你想把它們聯結起來計算出 `fullName`，並希望每當 `firstName` 和 `lastName` 變化時，`fullName` 都能更新。第一直覺可能是加入一個 `state` 變數 `fullName`，並在一個 `Effect` 中更新它：
    
      ```jsx {5-9}
      function Form() {
        const [firstName, setFirstName] = useState('Taylor');
        const [lastName, setLastName] = useState('Swift');

        // 🔴 避免：多餘的 state 和不必要的 Effect
        const [fullName, setFullName] = useState('');
        useEffect(() => {
          setFullName(firstName + ' ' + lastName);
        }, [firstName, lastName]);
        // ...
      }
      ```

    - 大可不必這麼複雜，而且這樣效率也不高：它先用 `fullName` 的舊值執行了整個渲染流程，然後又立即使用更新後的值重新渲染了一遍。讓我們移除 `state` 變數和 `Effect`：

      ```jsx {4-5}
        function Form() {
          const [firstName, setFirstName] = useState('Taylor');
          const [lastName, setLastName] = useState('Swift');
          // ✅ 非常好：在渲染期間進行計算
          const fullName = firstName + ' ' + lastName;
          // ...
        }
        ```

    - 如果一個值可以基於現有的 `props` 或 `state` 計算得出，不要把它作為一個 `state`，而是在渲染期間直接計算這個值。這會讓程式碼更快（避免了多餘的「級聯」更新）、更簡潔（移除了一些程式碼），也更少出錯（避免了因不同 `state` 變數之間沒有正確同步而導致的問題）。
    
  - ### 快取昂貴的計算
    - 這個組件使用接收到的 `props` 中的 `filter`，對另一個 `prop` `todos` 進行篩選，計算得出 `visibleTodos`。直覺可能會讓你把結果存到一個 `state` 中，並在 `Effect` 中更新它：
      ```jsx {4-8}
      function TodoList({ todos, filter }) {
        const [newTodo, setNewTodo] = useState('');

        // 🔴 避免：多餘的 state 和不必要的 Effect
        const [visibleTodos, setVisibleTodos] = useState([]);
        useEffect(() => {
          setVisibleTodos(getFilteredTodos(todos, filter));
        }, [todos, filter]);
        // ...
      }
      ```

    - 就像之前的例子一樣，這既沒有必要，也很低效。首先，移除 `state` 和 `Effect`：
      ```jsx {3-4}
      function TodoList({ todos, filter }) {
        const [newTodo, setNewTodo] = useState('');
        // ✅ 如果 getFilteredTodos() 的耗時不長，這樣寫就可以了。
        const visibleTodos = getFilteredTodos(todos, filter);
        // ...
      }
      ```

    - 一般來說，這段程式碼沒有問題!但是，`getFilteredTodos()` 的耗時可能會很長，或者有很多 `todos`。這些情況下，當 `newTodo` 這樣不相關的 `state` 變數變化時，你並不想重新執行 `getFilteredTodos()`。

    - 可以使用 `useMemo` Hook 快取（或稱記憶化）一個昂貴的計算：
      ```jsx
      import { useMemo, useState } from 'react';

      function TodoList({ todos, filter }) {
        const [newTodo, setNewTodo] = useState('');
        const visibleTodos = useMemo(() => {
          // ✅ 除非 todos 或 filter 發生變化，否則不會重新執行
          return getFilteredTodos(todos, filter);
        }, [todos, filter]);
        // ...
      }
      ```

    - 這會告訴 `React`，除非 `todos` 或 `filter` 發生變化，否則不要重新執行傳入的函式。`React` 會在初次渲染時記住 `getFilteredTodos()` 的回傳值。在下一次渲染中，它會檢查 `todos` 或 `filter` 是否發生了變化。如果它們跟上次渲染一樣，`useMemo` 會直接回傳最後保存的結果；若不一樣，`React` 就會再次呼叫傳入的函式（並保存它的結果）。

    - 傳入 `useMemo` 的函式會在渲染期間執行，所以它僅適用於純函式的場景。

    :::info 深入探討：如何判斷計算是否昂貴？
    - 一般來說只有建立或迴圈遍歷成千上萬個物件時才會很耗時。若想確認，可以加入主控台輸出來測量某段程式碼的執行時間：
      ```jsx {1,3}
      console.time('篩選陣列');
      const visibleTodos = getFilteredTodos(todos, filter);
      console.timeEnd('篩選陣列');
      ```

    - 觸發要測量的互動（例如在輸入框中輸入），會在主控台看到類似 `「篩選陣列：0.15ms」` 的輸出日誌。如果總耗時達到一定量級（比方說 `1ms` 或更多），那麼把計算結果記憶化起來可能就有意義。可以把計算傳入 `useMemo` 中，驗證該互動導致的總耗時是否減少。

    - `useMemo` 不會讓第一次渲染變快，它只是幫助你跳過不必要的更新。

    - 請注意，設備效能可能比使用者的更好，因此最好透過人工限制工具來測試效能（例如 `Chrome` 提供的 `CPU 節流工具`）。同時，開發環境測試效能並不能得到最準確的結果（例如開啟嚴格模式時，會看到每個組件渲染兩次而非一次），因此要得到最準確的時間，需要把應用建置為正式模式，並使用與使用者效能相當的設備進行測試。
    :::

  - ### 當 props 變化時重置所有 state
    - `ProfilePage` 組件接收一個 `prop`：`userId`。頁面上有一個評論輸入框，用 `state` `comment` 來保存它的值。有一天，你發現了一個問題：當你從一個人的個人資料導航到另一個時，`comment` 沒有被重置，這很容易導致不小心把評論送到錯誤的個人資料。為了解決這個問題，你想在 `userId` 變化時清除 `comment` 變數：

      ```jsx {4-7}
      export default function ProfilePage({ userId }) {
        const [comment, setComment] = useState('');

        // 🔴 避免：當 prop 變化時，在 Effect 中重置 state
        useEffect(() => {
          setComment('');
        }, [userId]);
        // ...
      }
      ```

    - 但這是低效的，因為 `ProfilePage` 和它的子組件首先會用舊值渲染，然後再用新值重新渲染。而且這樣做也很複雜，因為需要在 `ProfilePage` 裡面所有具有 `state` 的組件中都寫這樣的程式碼。

    - 取而代之的是，可以透過為每個使用者的個人資料組件提供一個明確的 `key`，告訴 `React` 它們原則上是不同的個人資料組件。把組件拆分為兩個組件，並從外部組件傳遞一個 `key` 屬性給內部組件：

      ```jsx {5,11-12}
      export default function ProfilePage({ userId }) {
        return (
          <Profile
            userId={userId}
            key={userId}
          />
        );
      }

      function Profile({ userId }) {
        // ✅ 當 key 變化時，該組件內的 comment 或其他 state 會自動被重置
        const [comment, setComment] = useState('');
        // ...
      }
      ```

    - 通常，當在相同的位置渲染相同的組件時，`React` 會保留狀態。透過把 `userId` 作為 `key` 傳給 `Profile` 組件，能讓 `React` 把具有不同 `userId` 的兩個 `Profile` 組件視為兩個不應共享任何狀態的不同組件。每當 `key`（此處是 `userId`）變化時，`React` 就會重新建立 `DOM`，並重置 `Profile` 組件與其所有子組件的 `state`。這樣一來，在不同個人資料之間導航時，`comment` 區域就會自動被清空。

    - 請注意，在這個例子中，只有外部的 `ProfilePage` 組件被匯出，並在專案中對其他檔案可見。渲染 `ProfilePage` 的那些組件不需要傳遞 `key` 給它，只需把 `userId` 作為一般 `prop` 傳入即可；`ProfilePage` 把它作為 `key` 傳給內部的 `Profile` 組件，只是它自己的實作細節而已。

  - ### 當 prop 變化時調整部分 state
    - 有時候，當 `prop` 變化時，你可能只想重置或調整部分 `state`，而非全部 `state`。

    - `List` 組件接收一個 `items` 清單作為 `prop`，並用 `state` 變數 `selection` 來保持已選取的項目。當 `items` 接收到一個不同的陣列時，你想把 `selection` 重置為 `null`：
      ```jsx {5-8}
      function List({ items }) {
        const [isReverse, setIsReverse] = useState(false);
        const [selection, setSelection] = useState(null);

        // 🔴 避免：當 prop 變化時，在 Effect 中調整 state
        useEffect(() => {
          setSelection(null);
        }, [items]);
        // ...
      }
      ```

    - 這不太理想。每當 `items` 變化時，`List` 及其子組件會先用舊的 `selection` 值渲染，然後 `React` 才更新 `DOM` 並執行 `Effect`，最後呼叫 `setSelection(null)` 會導致 `List` 及其子組件重新渲染，重新啟動整個流程。

    - 讓我們從刪除 `Effect` 開始，改為在渲染期間直接調整 `state`：
      ```jsx {5-10}
      function List({ items }) {
        const [isReverse, setIsReverse] = useState(false);
        const [selection, setSelection] = useState(null);

        // 好一些：在渲染期間調整 state
        const [prevItems, setPrevItems] = useState(items);
        if (items !== prevItems) {
          setPrevItems(items);
          setSelection(null);
        }
        // ...
      }
      ```

    - 像這樣保存前一輪渲染的資訊可能較難理解，但它比在 `Effect` 中更新這個 `state` 要好。上面的例子中，在渲染過程中直接呼叫了 `setSelection`。當它執行到 `return` 陳述句退出後，`React` 會立即重新渲染 `List`。此時 `React` 還沒有渲染 `List` 的子組件或更新 `DOM`，這使得 `List` 的子組件可以跳過渲染舊的 `selection` 值。

    - 在渲染期間更新組件時，`React` 會捨棄已經回傳的 `JSX`，並立即嘗試重新渲染。為避免非常緩慢的級聯重試，`React` 只允許在渲染期間更新同一組件的狀態。如果在渲染期間更新另一個組件的狀態，就會看到一則錯誤訊息。條件判斷 `items !== prevItems` 是必要的，它能避免無限循環。可以像這樣調整 `state`，但任何其他副作用（例如變更 `DOM` 或設定延遲器）應該留在事件處理函式或 `Effect` 中，以保持組件純粹。

    - 雖然這種方式比 `Effect` 更高效，但大多數組件也不需要它。無論如何，根據 `props` 或其他 `state` 來調整 `state`，都會讓資料流更難理解和除錯。務必先檢查是否可以透過加入 `key` 來重置所有 `state`，或是在渲染期間計算所需內容。例如，可以儲存已選取的 `item ID`，而非儲存（並重置）已選取的 `item`：
      ```jsx {3-5}
      function List({ items }) {
        const [isReverse, setIsReverse] = useState(false);
        const [selectedId, setSelectedId] = useState(null);
        // ✅ 非常好：在渲染期間計算所需內容
        const selection = items.find(item => item.id === selectedId) ?? null;
        // ...
      }
      ```

    - 現在完全不需要「調整」`state` 了。如果包含已選取 `ID` 的項目出現在清單中，則仍然保持選取狀態；如果沒有找到匹配的項目，則在渲染期間計算的 `selection` 就會是 `null`。行為不同了，但可以說更好，因為大多數對 `items` 的更改仍可以保持選取狀態。
    
  - ### 在事件處理函式中共享邏輯
    - 假設有一個產品頁面，上面有兩個按鈕（購買和結帳），都可以讓你購買該產品。當使用者把產品加入購物車時，你想顯示一則通知。在兩個按鈕的點擊事件處理函式中都呼叫 `showNotification()` 感覺有點重複，所以你可能想把這個邏輯放在一個 `Effect` 中：

      ```jsx {2-7}
      function ProductPage({ product, addToCart }) {
        // 🔴 避免：在 Effect 中處理屬於事件特定的邏輯
        useEffect(() => {
          if (product.isInCart) {
            showNotification(`已新增 ${product.name} 進購物車！`);
          }
        }, [product]);

        function handleBuyClick() {
          addToCart(product);
        }

        function handleCheckoutClick() {
          addToCart(product);
          navigateTo('/checkout');
        }
        // ...
      }
      ```

    - 這個 `Effect` 是多餘的，而且很可能會導致問題。例如，假設應用在頁面重新載入之前「記住」了購物車中的產品，若把一個產品加入購物車後刷新頁面，通知就會再次出現；每次刷新該產品頁面時它都會出現。這是因為 `product.isInCart` 在頁面載入時已經是 `true` 了，所以上面的 `Effect` 每次都會呼叫 `showNotification()`。

    - 當不確定某些程式碼應該放在 `Effect` 中還是事件處理函式中時，先自問 `「為什麼」` 要執行這些程式碼。`Effect` 只用來執行那些顯示給使用者時組件 `「需要」` 執行的程式碼。在這個例子中，通知應該在使用者 `「按下按鈕」` 後出現，而不是因為頁面顯示出來!刪除 `Effect`，並把共享的邏輯放入一個被兩個事件處理函式呼叫的函式中：

      ```jsx {2-6,9,13}
      function ProductPage({ product, addToCart }) {
        // ✅ 非常好：事件特定的邏輯在事件處理函式中處理
        function buyProduct() {
          addToCart(product);
          showNotification(`已新增 ${product.name} 進購物車！`);
        }

        function handleBuyClick() {
          buyProduct();
        }

        function handleCheckoutClick() {
          buyProduct();
          navigateTo('/checkout');
        }
        // ...
      }
      ```

      - 這既移除了不必要的 `Effect`，又修復了問題。

  - ### 傳送 POST 請求
    - `Form` 組件會傳送兩種 `POST` 請求：它在頁面載入時會傳送一個分析請求；當填寫表格並點擊送出按鈕時，會向 `/api/register` 端點傳送一個 `POST` 請求：
      ```jsx {5-8,10-16}
      function Form() {
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');

        // ✅ 非常好：這個邏輯應該在組件顯示時執行
        useEffect(() => {
          post('/analytics/event', { eventName: 'visit_form' });
        }, []);

        // 🔴 避免：在 Effect 中處理屬於事件特定的邏輯
        const [jsonToSubmit, setJsonToSubmit] = useState(null);
        useEffect(() => {
          if (jsonToSubmit !== null) {
            post('/api/register', jsonToSubmit);
          }
        }, [jsonToSubmit]);

        function handleSubmit(e) {
          e.preventDefault();
          setJsonToSubmit({ firstName, lastName });
        }
        // ...
      }
      ```

    - 讓我們套用與之前範例相同的準則。

    - 分析請求應該保留在 `Effect` 中，因為傳送分析請求是表單顯示時就需要執行的（在開發環境中它會傳送兩次，可以參考先前章節了解如何處理）。

    - 然而，傳送到 `/api/register` 的 `POST` 請求並非由表單「顯示」時引起，只想在一個特定時間點傳送請求：當使用者按下按鈕時。它應該只在這個特定的互動中發生。刪除第二個 `Effect`，把該 `POST` 請求移入事件處理函式中：
      
      ```jsx {12-13}
      function Form() {
        const [firstName, setFirstName] = useState('');
        const [lastName, setLastName] = useState('');

        // ✅ 非常好：這個邏輯應該在組件顯示時執行
        useEffect(() => {
          post('/analytics/event', { eventName: 'visit_form' });
        }, []);

        function handleSubmit(e) {
          e.preventDefault();
          // ✅ 非常好：事件特定的邏輯在事件處理函式中處理
          post('/api/register', { firstName, lastName });
        }
        // ...
      }
      ```

    - 決定該把某些邏輯放入事件處理函式還是 `Effect` 中時，需要回答的主要問題是：`從使用者角度來看，這是「怎樣的邏輯」`。如果邏輯是由某個特定互動引起的，就把它保留在對應的事件處理函式中；如果是由使用者在畫面上「看到」組件時引起的，就把它保留在 `Effect` 中。

  - ### 鏈式計算
    - 有時候你可能想串連多個 `Effect`，每個 `Effect` 都根據某些 `state` 來調整其他的 `state`：
      
      ```jsx {7-29}
      function Game() {
        const [card, setCard] = useState(null);
        const [goldCardCount, setGoldCardCount] = useState(0);
        const [round, setRound] = useState(1);
        const [isGameOver, setIsGameOver] = useState(false);

        // 🔴 避免：串連多個 Effect 僅僅為了相互觸發調整 state
        useEffect(() => {
          if (card !== null && card.gold) {
            setGoldCardCount(c => c + 1);
          }
        }, [card]);

        useEffect(() => {
          if (goldCardCount > 3) {
            setRound(r => r + 1)
            setGoldCardCount(0);
          }
        }, [goldCardCount]);

        useEffect(() => {
          if (round > 5) {
            setIsGameOver(true);
          }
        }, [round]);

        useEffect(() => {
          alert('遊戲結束！');
        }, [isGameOver]);

        function handlePlaceCard(nextCard) {
          if (isGameOver) {
            throw Error('遊戲已經結束了。');
          } else {
            setCard(nextCard);
          }
        }
        // ...
      ```

    - 這段程式碼有兩個問題。

    - 第一個問題是它非常低效：在鏈式的每個 `set` 呼叫之間，組件（及其子組件）都不得不重新渲染。上面的例子中，最壞情況下（`setCard` → `渲染` → `setGoldCardCount` → `渲染` → `setRound` → `渲染` → `setIsGameOver` → `渲染`）有三次不必要的重新渲染。

    - 第二個問題是，即使不考慮渲染效率問題，隨著程式碼不斷擴展，你會遇到這條「鏈式」呼叫不符合新需求的情況。試想需要新增一種方法回溯遊戲歷史紀錄，透過把每個 `state` 變數更新到之前的值來實現。然而，把 `card` 設為之前的某個值會再次觸發 `Effect` 鏈，並更改正在顯示的資料。這樣的程式碼往往僵硬而脆弱。

    - 在這個例子中，更好的做法是：盡可能在渲染期間進行計算，以及在事件處理函式中調整 `state`：

      ```jsx {6-7,14-26}
      function Game() {
        const [card, setCard] = useState(null);
        const [goldCardCount, setGoldCardCount] = useState(0);
        const [round, setRound] = useState(1);

        // ✅ 盡可能在渲染期間進行計算
        const isGameOver = round > 5;

        function handlePlaceCard(nextCard) {
          if (isGameOver) {
            throw Error('遊戲已經結束了。');
          }

          // ✅ 在事件處理函式中計算剩下的所有 state
          setCard(nextCard);
          if (nextCard.gold) {
            if (goldCardCount < 3) {
              setGoldCardCount(goldCardCount + 1);
            } else {
              setGoldCardCount(0);
              setRound(round + 1);
              if (round === 5) {
                alert('遊戲結束！');
              }
            }
          }
        }
        // ...
      ```

    - 這高效得多。此外，如果實作了回溯遊戲歷史的方法，現在可以把每個 `state` 變數設定為之前的任何一個值，而不會觸發每個調整其他值的 `Effect` 鏈。如果需要在多個事件處理函式之間複用邏輯，可以把它抽成一個函式，並在這些事件處理函式中呼叫它。

    - 請記住，在事件處理函式內部，`state` 的行為就像快照。例如，即使呼叫了 `setRound(round + 1)`，`round` 變數仍然是使用者點擊按鈕時的值。若需要用下一個值進行計算，則需要像這樣手動定義它：`const nextRound = round + 1`。

    - 在某些情況下，無法在事件處理函式中直接計算出下一個 `state`。例如，一個具有多個下拉選單的表單，如果下一個下拉選單的選項取決於前一個下拉選單所選的值，這時 `Effect` 鏈就是合適的，因為需要與網路進行同步。

  - ### 初始化應用程式
    - 有些邏輯只需要在應用程式載入時執行一次。

    - 你可能想把它放在一個最上層組件的 `Effect` 中：

      ```jsx {2-6}
      function App() {
        // 🔴 避免：把只需要執行一次的邏輯放在 Effect 中
        useEffect(() => {
          loadDataFromLocalStorage();
          checkAuthToken();
        }, []);
        // ...
      }
      ```

    - 然而，你很快就會發現它在 `開發環境會執行兩次`，這會導致一些問題 —— 例如，它可能使身分驗證 `token` 失效，因為該函式不是為被呼叫兩次而設計的。一般來說，當組件重新掛載時應該具有一致性，包括最上層的 `App` 組件。

    - 儘管在實際的正式環境中它可能永遠不會被重新掛載，但在所有組件中遵循相同的限制條件，能讓移動與複用程式碼變得更容易。如果某些邏輯必須在每次應用程式載入時執行一次，而非每次組件掛載時執行一次，可以加入一個最上層變數來記錄它是否已經執行過：

      ```jsx {1,5-6,10}
      let didInit = false;

      function App() {
        useEffect(() => {
          if (!didInit) {
            didInit = true;
            // ✅ 只在每次應用程式載入時執行一次
            loadDataFromLocalStorage();
            checkAuthToken();
          }
        }, []);
        // ...
      }
      ```

    - 也可以在模組初始化與應用程式渲染之前執行它：

      ```jsx {1,5}
      if (typeof window !== 'undefined') { // 檢測是否在瀏覽器環境
        // ✅ 只在每次應用程式載入時執行一次
        checkAuthToken();
        loadDataFromLocalStorage();
      }

      function App() {
        // ...
      }
      ```

    - 最上層程式碼會在組件被匯入時執行一次 —— 即使它最終並沒有被渲染。為了避免在匯入任意組件時降低效能或產生意外行為，請不要過度使用這種方法。應把應用程式層級的初始化邏輯保留在像 `App.js` 這樣的根組件模組，或是應用程式入口點。

  - ### 通知父組件有關 state 變化的資訊
    - 假設你正在寫一個具有內部 `state` `isOn` 的 `Toggle` 組件，該 `state` 可以是 `true` 或 `false`。有幾種不同的方式可以切換它（點擊或拖曳）。你希望在 `Toggle` 的 `state` 變化時通知父組件，因此暴露了一個 `onChange` 事件，並在 `Effect` 中呼叫它：

      ```jsx {4-7}
      function Toggle({ onChange }) {
        const [isOn, setIsOn] = useState(false);

        // 🔴 避免：onChange 處理函式執行的時間太晚了
        useEffect(() => {
          onChange(isOn);
        }, [isOn, onChange])

        function handleClick() {
          setIsOn(!isOn);
        }

        function handleDragEnd(e) {
          if (isCloserToRightEdge(e)) {
            setIsOn(true);
          } else {
            setIsOn(false);
          }
        }
        // ...
      }
      ```

    - 和之前一樣，這不太理想。`Toggle` 首先更新它的 `state`，然後 `React` 更新畫面；接著 `React` 執行 `Effect` 中的程式碼，呼叫從父組件傳入的 `onChange` 函式，此時父組件才開始更新自己的 `state`，開啟另一個渲染流程。更好的方式是在單一流程中完成所有操作。

    - 刪除 `Effect`，並在同一個事件處理函式中更新兩個組件的 `state`：

      ```jsx {5-7,11,16,18}
      function Toggle({ onChange }) {
        const [isOn, setIsOn] = useState(false);

        function updateToggle(nextIsOn) {
          // ✅ 非常好：在觸發它們的事件中執行所有更新
          setIsOn(nextIsOn);
          onChange(nextIsOn);
        }

        function handleClick() {
          updateToggle(!isOn);
        }

        function handleDragEnd(e) {
          if (isCloserToRightEdge(e)) {
            updateToggle(true);
          } else {
            updateToggle(false);
          }
        }
        // ...
      }
      ```

    - 透過這種方式，`Toggle` 組件與它的父組件都在事件處理期間更新了各自的 `state`。`React` 會批次處理來自不同組件的更新，所以只會有一個渲染流程。

    - 也可以完全移除該 `state`，並從父組件接收 `isOn`：
      
      ```jsx {1-2}
      // ✅ 也很好：該組件完全由它的父組件控制
      function Toggle({ isOn, onChange }) {
        function handleClick() {
          onChange(!isOn);
        }

        function handleDragEnd(e) {
          if (isCloserToRightEdge(e)) {
            onChange(true);
          } else {
            onChange(false);
          }
        }
        // ...
      }
      ```

    - `「狀態提升」` 讓父組件可以透過切換自身的 `state` 來完全控制 `Toggle` 組件。這意味著父組件會包含更多邏輯，但整體上需要關心的狀態變少了。每當嘗試保持兩個不同的 `state` 變數之間的同步時，不妨試試狀態提升!
  
  - ### 將資料傳遞給父組件
    - `Child` 組件取得了一些資料，並在 `Effect` 中傳給 `Parent` 組件：

      ```jsx {9-14}
      function Parent() {
        const [data, setData] = useState(null);
        // ...
        return <Child onFetched={setData} />;
      }

      function Child({ onFetched }) {
        const data = useSomeAPI();
        // 🔴 避免：在 Effect 中傳遞資料給父組件
        useEffect(() => {
          if (data) {
            onFetched(data);
          }
        }, [onFetched, data]);
        // ...
      }
      ```

    - 在 `React` 中，資料是從父組件流向子組件的。當畫面上看到一些錯誤時，可以透過一路追蹤組件樹，尋找錯誤資訊是從哪個組件傳遞下來，找出傳遞了錯誤 `prop` 或有錯誤 `state` 的組件。當子組件在 `Effect` 中更新父組件的 `state` 時，資料流會變得非常難以追蹤。既然子組件和父組件都需要相同的資料，那就讓父組件取得那些資料，並向下傳遞給子組件：

      ```jsx {4-5}
      function Parent() {
        const data = useSomeAPI();
        // ...
        // ✅ 非常好：向子組件傳遞資料
        return <Child data={data} />;
      }

      function Child({ data }) {
        // ...
      }
      ```

    - 這更簡單，也能保持資料流的可預測性：資料是從父組件流向子組件。

  - ### 訂閱外部 store
    - 有時候，組件可能需要訂閱 React `state` 之外的一些資料，這些資料可能來自第三方函式庫或內建瀏覽器 `API`。由於這些資料可能在 `React` 無法感知的情況下發生變化，需要在組件中手動訂閱它們，這經常使用 `Effect` 來實現，例如：

      ```jsx {2-17}
      function useOnlineStatus() {
        // 不理想：在 Effect 中手動訂閱 store
        const [isOnline, setIsOnline] = useState(true);
        useEffect(() => {
          function updateState() {
            setIsOnline(navigator.onLine);
          }

          updateState();

          window.addEventListener('online', updateState);
          window.addEventListener('offline', updateState);
          return () => {
            window.removeEventListener('online', updateState);
            window.removeEventListener('offline', updateState);
          };
        }, []);
        return isOnline;
      }

      function ChatIndicator() {
        const isOnline = useOnlineStatus();
        // ...
      }
      ```

    - 這個組件訂閱了一個外部 `store` 的資料（此處是瀏覽器的 `navigator.onLine API`）。由於這個 `API` 在伺服端不存在（因此不能用於初始的 HTML），因此 `state` 最初被設為 `true`。每當瀏覽器 `store` 中的值發生變化時，組件都會更新它的 `state`。

    - 儘管通常可以使用 `Effect` 來實現此功能，但 `React` 為此特別提供了一個用於訂閱外部 `store` 的 `Hook`。刪除 `Effect`，改用 `useSyncExternalStore`：
      
      ```jsx {11-16}
      function subscribe(callback) {
        window.addEventListener('online', callback);
        window.addEventListener('offline', callback);
        return () => {
          window.removeEventListener('online', callback);
          window.removeEventListener('offline', callback);
        };
      }

      function useOnlineStatus() {
        // ✅ 非常好：用內建的 Hook 訂閱外部 store
        return useSyncExternalStore(
          subscribe, // 只要傳遞的是同一個函式，React 就不會重新訂閱
          () => navigator.onLine, // 如何在客戶端取得值
          () => true // 如何在伺服端取得值
        );
      }

      function ChatIndicator() {
        const isOnline = useOnlineStatus();
        // ...
      }
      ```

    - 與手動使用 `Effect` 把可變資料同步到 React `state` 相比，這種方法能減少錯誤。通常，可以寫一個像上面的 `useOnlineStatus()` 這樣的自訂 `Hook`，這樣就不需要在各個組件中重複寫這些程式碼。
  
  - ### 取得資料
    - 許多應用使用 `Effect` 來發起資料取得請求，像這樣在 `Effect` 中寫一個資料取得請求相當常見：

      ```jsx {5-10}
      function SearchResults({ query }) {
        const [results, setResults] = useState([]);
        const [page, setPage] = useState(1);

        useEffect(() => {
          // 🔴 避免：沒有清理邏輯的取得資料
          fetchResults(query, page).then(json => {
            setResults(json);
          });
        }, [query, page]);

        function handleNextPageClick() {
          setPage(page + 1);
        }
        // ...
      }
      ```

    - 你不需要把這個資料取得邏輯遷移到一個事件處理函式中。

    - 這可能看起來與之前需要把邏輯放入事件處理函式的範例相矛盾!但要注意，這裡觸發取得資料的主要原因並不是打字事件。搜尋輸入框的值通常是從 URL 中預先填入的，使用者也可以在不操作輸入框的情況下，透過點擊「前進」或「後退」導覽頁面。

    - `page` 和 `query` 的來源其實並不重要。只要該組件可見，你就需要透過目前 `page` 和 `query` 的值，保持 `results` 與網路資料的同步，這就是為什麼這裡是一個 `Effect` 的原因。

    - 然而，上面的程式碼有一個問題。假設快速地輸入 `「hello」`， `query` 會從「h」變成「he」、「hel」、「hell」，最後是「hello」，這會觸發一連串不同的資料取得請求，但無法保證對應的回傳順序。例如，「hell」的回應可能在「hello」的回應之後才回傳。由於 `setResults()` 是在最後被呼叫的，就會顯示錯誤的搜尋結果。這種情況稱為「競態條件」：兩個不同的請求「相互競爭」，並以與預期不符的順序回傳。

    - 為了修復這個問題，需要加入一個清理函式來忽略較早的回傳結果：

      ```jsx {5,7,9,11-13}
      function SearchResults({ query }) {
        const [results, setResults] = useState([]);
        const [page, setPage] = useState(1);
        useEffect(() => {
          let ignore = false;
          fetchResults(query, page).then(json => {
            if (!ignore) {
              setResults(json);
            }
          });
          return () => {
            ignore = true;
          };
        }, [query, page]);

        function handleNextPageClick() {
          setPage(page + 1);
        }
        // ...
      }
      ```

    - 這確保了在 `Effect` 中取得資料時，除了最後一次請求的所有回傳結果都會被忽略。

    - 處理競態條件並非實作資料取得的唯一難點。可能還需要考慮快取回應結果（讓使用者點擊返回按鈕時能立即看到先前的畫面內容）、如何在伺服端取得資料（讓伺服端初始渲染的 `HTML` 中包含取得到的內容，而非載入動畫），以及如何避免網路瀑布（讓子組件不必等到每個父組件的資料取得完畢後才開始取得資料）。

    - 這些問題適用於任何 UI 函式庫，而不僅僅是 `React`。解決這些問題並不容易，這也是現代框架提供了比在 `Effect` 中取得資料更有效的內建資料取得機制的原因。

    - 如果不使用框架（也不想開發自己的框架），但希望讓從 `Effect` 中取得資料更符合人類直覺，可以考慮像下面這樣，把取得邏輯抽到一個自訂 `Hook` 中：

      ```jsx {4}
      function SearchResults({ query }) {
        const [page, setPage] = useState(1);
        const params = new URLSearchParams({ query, page });
        const results = useData(`/api/search?${params}`);

        function handleNextPageClick() {
          setPage(page + 1);
        }
        // ...
      }

      function useData(url) {
        const [data, setData] = useState(null);
        useEffect(() => {
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
        }, [url]);
        return data;
      }
      ```

    - 可能還想加入一些錯誤處理邏輯以及追蹤內容是否處於載入中。你可以自己寫這樣的 `Hook`，也可以使用 `React` 生態系中已經存在的許多解決方案。雖然單純使用自訂 `Hook` 不如使用框架內建的資料取得機制高效，但把資料取得邏輯移到自訂 `Hook` 中，能讓後續採用更高效的資料取得策略變得更容易。

    - 一般來說，當不得不撰寫 `Effect` 時，請留意是否可以把某段功能抽到專門的內建 `API` 或一個更具宣告性的自訂 `Hook` 中，例如上面的 `useData`。你會發現組件中原始的 `useEffect` 呼叫越少，維護應用程式就會變得越容易。

## 重點複習（Recap）
  - 如果可以在渲染期間計算某些內容，就不需要使用 `Effect`。
  - 想要快取昂貴的計算，請使用 `useMemo` 而非 `useEffect`。
  - 想要重置整個組件樹的 `state`，請傳入不同的 `key`。
  - 想要在 `prop` 變化時重置某些特定的 `state`，請在渲染期間處理。
  - 組件顯示時就需要執行的程式碼應該放在 `Effect` 中，否則應該放在事件處理函式中。
  - 如果需要更新多個組件的 `state`，最好在單一事件處理函式中處理。
  - 當嘗試在不同組件中同步 `state` 變數時，請考慮狀態提升。
  - 可以使用 `Effect` 取得資料，但需要實作清理邏輯以避免競態條件。

## 挑戰（Challenges）
  - #### 1. 不用 Effect 轉換資料
    `TodoList` 組件顯示一份待辦事項清單。當 `「只顯示未完成的事項」` 核取方塊被勾選時，已完成的待辦事項不會顯示在清單中；不論哪些待辦事項可見，頁尾都會顯示尚未完成的待辦事項數量。任務是透過移除不必要的 `state` 和 `Effect` 來簡化這個組件。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { initialTodos, createTodo } from './todos.js';

      export default function TodoList() {
        const [todos, setTodos] = useState(initialTodos);
        const [showActive, setShowActive] = useState(false);
        const [activeTodos, setActiveTodos] = useState([]);
        const [visibleTodos, setVisibleTodos] = useState([]);
        const [footer, setFooter] = useState(null);

        useEffect(() => {
          setActiveTodos(todos.filter(todo => !todo.completed));
        }, [todos]);

        useEffect(() => {
          setVisibleTodos(showActive ? activeTodos : todos);
        }, [showActive, todos, activeTodos]);

        useEffect(() => {
          setFooter(
            <footer>
              {activeTodos.length} 項待辦
            </footer>
          );
        }, [activeTodos]);

        return (
          <>
            <label>
              <input
                type="checkbox"
                checked={showActive}
                onChange={e => setShowActive(e.target.checked)}
              />
              只顯示未完成的事項
            </label>
            <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
            <ul>
              {visibleTodos.map(todo => (
                <li key={todo.id}>
                  {todo.completed ? <s>{todo.text}</s> : todo.text}
                </li>
              ))}
            </ul>
            {footer}
          </>
        );
      }

      function NewTodo({ onAdd }) {
        const [text, setText] = useState('');

        function handleAddClick() {
          setText('');
          onAdd(createTodo(text));
        }

        return (
          <>
            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleAddClick}>
              添加
            </button>
          </>
        );
      }
      ```

    - ##### 提示
      如果可以在渲染期間計算出某些值，就不需要用 `state` 或 `Effect` 來更新它。
      
    - ##### 解答
      這個例子中只有兩個必要的 `state` 變數：`todos` 清單與代表核取方塊是否勾選的 `showActive`，其他所有 `state` 變數都是多餘的，可以在渲染期間計算得出，包括 `footer`，可以直接移到包含它的 `JSX` 中：

      ```jsx
      export default function TodoList() {
        const [todos, setTodos] = useState(initialTodos);
        const [showActive, setShowActive] = useState(false);
        const activeTodos = todos.filter(todo => !todo.completed);
        const visibleTodos = showActive ? activeTodos : todos;

        return (
          <>
            <label>
              <input
                type="checkbox"
                checked={showActive}
                onChange={e => setShowActive(e.target.checked)}
              />
              只顯示未完成的事項
            </label>
            <NewTodo onAdd={newTodo => setTodos([...todos, newTodo])} />
            <ul>
              {visibleTodos.map(todo => (
                <li key={todo.id}>
                  {todo.completed ? <s>{todo.text}</s> : todo.text}
                </li>
              ))}
            </ul>
            <footer>
              {activeTodos.length} 項待辦
            </footer>
          </>
        );
      }
      ```

  - #### 2. 不用 Effect 快取計算結果
    篩選 `todos` 的邏輯被抽到一個叫做 `getVisibleTodos()` 的函式中，內部包含一個 `console.log()`，可以幫助了解函式的呼叫情況。切換 `「只顯示未完成的事項」` 會導致 `getVisibleTodos()` 重新執行，這符合預期。任務是移除 `TodoList` 組件中重複計算 `visibleTodos` 清單的 `Effect`，但需要確保在輸入框中輸入時，`getVisibleTodos()` 不會重新執行（因此不會印出任何日誌）。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';
      import { initialTodos, createTodo, getVisibleTodos } from './todos.js';

      export default function TodoList() {
        const [todos, setTodos] = useState(initialTodos);
        const [showActive, setShowActive] = useState(false);
        const [text, setText] = useState('');
        const [visibleTodos, setVisibleTodos] = useState([]);

        useEffect(() => {
          setVisibleTodos(getVisibleTodos(todos, showActive));
        }, [todos, showActive]);

        function handleAddClick() {
          setText('');
          setTodos([...todos, createTodo(text)]);
        }

        return (
          <>
            <label>
              <input
                type="checkbox"
                checked={showActive}
                onChange={e => setShowActive(e.target.checked)}
              />
              只顯示未完成的事項
            </label>
            <input value={text} onChange={e => setText(e.target.value)} />
            <button onClick={handleAddClick}>
              添加
            </button>
            <ul>
              {visibleTodos.map(todo => (
                <li key={todo.id}>
                  {todo.completed ? <s>{todo.text}</s> : todo.text}
                </li>
              ))}
            </ul>
          </>
        );
      }
      ```

    - ##### 提示
      一個解法是透過加入 useMemo 來快取可見的 todos，還有另一種不那麼明顯的解法。

    - ##### 解答
      - 移除 `state` 變數和 `Effect`，改為加入一個 `useMemo` 來快取呼叫 `getVisibleTodos()` 的結果：

        ```jsx
        const visibleTodos = useMemo(
          () => getVisibleTodos(todos, showActive),
          [todos, showActive]
        );
        ```

      - 透過這些改動，`getVisibleTodos()` 只有在 `todos` 或 `showActive` 變化時才會被呼叫。在輸入框中輸入只會更改 `text` 變數的值，並不會觸發 `getVisibleTodos()` 的呼叫。

      - 還有一個不使用 `useMemo` 的解法。由於 `text` 變數不可能影響待辦事項清單，可以把 `NewTodo` 表單抽到一個獨立的組件中，並把 `text` 變數移到其中：

        ```jsx
        function NewTodo({ onAdd }) {
          const [text, setText] = useState('');

          function handleAddClick() {
            setText('');
            onAdd(createTodo(text));
          }

          return (
            <>
              <input value={text} onChange={e => setText(e.target.value)} />
              <button onClick={handleAddClick}>新增</button>
            </>
          );
        }
        ```

      - 這種方法也滿足要求。輸入時只有 `text` 變數會更新，由於 `text` 變數在子組件 `NewTodo` 中，父組件 `TodoList` 不會重新渲染，這就是輸入時 `getVisibleTodos()` 不會被呼叫的原因（如果 `TodoList` 因其他原因重新渲染，它仍然會被呼叫）。

  - #### 3. 不用 Effect 重置 state
    `EditContact` 組件的 prop `savedContact` 接收一個類似 `{ id, name, email }` 這樣的聯絡人物件。當用頂部按鈕選擇一個聯絡人時，該表單會重置並展示該聯絡人的詳細資訊，這是在 `EditContact.js` 內部使用 `Effect` 實現的。任務是移除該 `Effect`，找到另一種方式在 `savedContact.id` 變化時重置表單。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function EditContact({ savedContact, onSave }) {
        const [name, setName] = useState(savedContact.name);
        const [email, setEmail] = useState(savedContact.email);

        useEffect(() => {
          setName(savedContact.name);
          setEmail(savedContact.email);
        }, [savedContact]);

        return (
          <section>
            <label>
              姓名：{' '}
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
              />
            </label>
            <label>
              信箱：{' '}
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </label>
            <button onClick={() => {
              const updatedData = {
                id: savedContact.id,
                name: name,
                email: email
              };
              onSave(updatedData);
            }}>
              保存
            </button>
            <button onClick={() => {
              setName(savedContact.name);
              setEmail(savedContact.email);
            }}>
              重置
            </button>
          </section>
        );
      }
      ```

    - ##### 提示
      如果有一種方式可以告訴 `React`，當 `savedContact.id` 變化時，`EditContact` 表單本質上是一個不同的聯絡人表單，不應保留狀態，那就太好了。還記得這樣的方式嗎?

    - ##### 解答
      把 `EditContact` 組件拆分為兩個組件。把所有表單 `state` 移到內部的 `EditForm` 組件中，匯出外部的 `EditContact` 組件，並把 `savedContact.id` 作為 `key` 傳給內部的 `EditForm` 組件。結果是，每當選擇不同的聯絡人時，內部的 `EditForm` 組件就會重置所有表單狀態並重新建立 `DOM`：
      
      ```jsx
      export default function EditContact(props) {
        return (
          <EditForm
            {...props}
            key={props.savedContact.id}
          />
        );
      }

      function EditForm({ savedContact, onSave }) {
        const [name, setName] = useState(savedContact.name);
        const [email, setEmail] = useState(savedContact.email);
        // ...
      }
      ```

  - #### 4. 不用 Effect 提交表單
    `Form` 組件能讓你向朋友傳送訊息。當提交表單時，`state` 變數 `showForm` 會被設為 `false`，這會觸發一個 `Effect` 呼叫 `sendMessage(message)` 傳送訊息。任務背景是：若把 `showForm` 的初始值改為 `false`，控制台會傳送一則空訊息，需要找出根本原因並修復。

    - ##### 原始程式碼
      ```jsx
      import { useState, useEffect } from 'react';

      export default function Form() {
        const [showForm, setShowForm] = useState(true);
        const [message, setMessage] = useState('');

        useEffect(() => {
          if (!showForm) {
            sendMessage(message);
          }
        }, [showForm, message]);

        function handleSubmit(e) {
          e.preventDefault();
          setShowForm(false);
        }

        if (!showForm) {
          return (
            <>
              <h1>謝謝使用我們的服務！</h1>
              <button onClick={() => {
                setMessage('');
                setShowForm(true);
              }}>
                打開聊天
              </button>
            </>
          );
        }

        return (
          <form onSubmit={handleSubmit}>
            <textarea
              placeholder="消息"
              value={message}
              onChange={e => setMessage(e.target.value)}
            />
            <button type="submit" disabled={message === ''}>
              發送
            </button>
          </form>
        );
      }

      function sendMessage(message) {
        console.log('發送的消息：' + message);
      }
      ```

    - ##### 提示
      是因為使用者看到了「謝謝」提示語，才應該傳送訊息嗎?還是其他原因?

    - ##### 解答
      `state` 變數 `showForm` 決定了顯示表單還是「謝謝」提示語。然而，並不是因為「謝謝」提示語被顯示才傳送訊息的，而是希望在使用者提交表單時傳送訊息。刪除誤導性的 `Effect`，把 `sendMessage` 呼叫移到 `handleSubmit` 事件處理函式中：

      ```jsx
      function handleSubmit(e) {
        e.preventDefault();
        setShowForm(false);
        sendMessage(message);
      }
      ```

      在這個版本中，只有提交表單（這是一個事件）才會導致訊息被傳送。採用這種方案，無論 `showForm` 最初被設為 `true` 還是 `false` 都同樣有效。