---
title: '[React官網] React 19.2 教程'
---

# 選擇 State 結構
  建置良好的 `state` 可以讓元件變得易於修改和調試，而不會經常出錯。以下是你在建造 `state` 時應該考慮的一些建議。

  :::info 你將會學習到
  - 使用單一 `state` 變數還是多個 `state` 變數
  - 組織 `state` 時應避免的內容
  - 如何解決 `state` 結構中的常見問題
  :::

## 構建 state 的原則
  - 當你編寫一個存有 `state` 的組件時，你需要選擇使用多少個 `state` 變數以及它們都是怎樣的資料格式。雖然選擇次佳的 `state` 結構也可以編寫出正確的程式，但有幾個原則可以指導你做出更好的決策：
    1. `合併關聯的 state`。如果你總是同時更新兩個或更多的 `state` 變數，請考慮將它們合併為一個單一的 `state` 變數。
    2. `避免互相矛盾的 state`。當 `state` 結構中存在多個相互矛盾或「不一致」的 `state` 時，你就可能為此留下隱患。應儘量避免這種情況。
    3. `避免冗餘的 state`。如果你能在渲染期間從組件的 `props` 或其現有的 `state` 變數中計算出一些資訊，則不應將這些資訊放入該組件的 `state` 中。
    4. `避免重複的 state`。當同一資料在多個 `state` 變數之間或在多個嵌套物件中重複時，這會很難保持它們同步。應儘可能減少重複。
    5. `避免深度嵌套的 state`。深度分層的 `state` 更新起來不是很方便。如果可能的話，最好以扁平化方式構建 `state`。

  - #### 核心思維
    這些原則背後的目標是使 `state` 易於更新而不引入錯誤。從 `state` 中刪除冗餘和重複資料有助於確保所有部分保持同步。這類似於資料庫工程師想要`「規範化（Normalization）資料庫結構」`，以減少出現錯誤的機會。

## 合併關聯的 state
  - 有時候你可能會不確定是要使用單一的 `state` 變數還是多個 `state` 變數。
    ```jsx
    const [x, setX] = useState(0);
    const [y, setY] = useState(0);
    ```

    或

    ```jsx
    const [position, setPosition] = useState({ x: 0, y: 0 });
    ```

  - 從技術上講，獨立分開或整合在一個物件中都是可行的。但是，如果某兩個 `state` 變數總是一起變化，則將它們統一成一個單一的 `state` 變數可能會更好。這樣你就不會忘記讓它們始終保持同步（例如：滑鼠軌跡的 x 和 y 座標）。

  - 另一種你需要將資料整合到一個物件或一個陣列的情況是，你不知道未來需要多少個 `state` 片段。例如，有一個允許使用者動態添加自訂欄位的表單時，這將會很有幫助。

  :::info 陷阱提示
  如果你的 `state` 變數是一個物件，請記住，你不能只更新其中的一個欄位而不顯式複製其他欄位。例如，你不能寫成 `setPosition({ x: 100 })`，因為這會導致 `y` 屬性丟失！相反地，你必須執行 `setPosition({ ...position, x: 100 })`，或者將它們拆分為兩個獨立的 `state` 變數。
  :::

## 避免矛盾的 state
  - 例如在處理表單提交時，如果同時使用 `isSending` 和 `isSent` 兩個布爾值狀態，就會讓一些 `state` 變得「極難處理」。如果你忘記同時更新這兩個變數，就可能會出現兩者同時為 `true` 的矛盾情況。

  - 因為 `isSending` 和 `isSent` 不應同時為 `true`，所以最好用一個 status 變數來代替它们，這個 state 變數可以採取三種有效狀態其中之一：
    - `'typing'（初始）`
    - `'sending'`
    - `'sent'`

  - #### 最佳實踐
    為了保持程式碼的可讀性，你不需要建立多個狀態變數，而是可以直接在組件內部宣告常數（計算屬性）：

    ```jsx
    const isSending = status === 'sending';
    const isSent = status === 'sent';
    ```

    這些常數是在每次渲染時動態計算出來的，它們不是 `state` 變數，因此你完全不必擔心它們彼此之間會失去同步。

## 避免冗餘的 state
  如果你能在渲染期間從組件的 `props` 或其現有的 `state` 變數中計算出一些資訊，則不應該把這些資訊放到該組件的 `state` 中。

  - #### 錯誤範例：將計算結果存在 State 中
    在一個表單中同時定義了 `firstName`、`lastName` 和 `fullName` 三個狀態變數。然而，`fullName` 是多餘的。因為在更新 `firstName` 或 `lastName` 時，如果忘記連動更新 `fullName`，就會導致介面資訊不同步。

  - #### 正確範例：在渲染期間即時計算
    在渲染期間，你始終可以從 `firstName` 和 `lastName` 中計算出 `fullName`，因此需要把它從 `state` 中刪除。

    ```jsx
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // 這裡的 fullName 不是一個 state 變數，而是在渲染期間動態計算出來的
    const fullName = firstName + ' ' + lastName;
    ```

  - 當呼叫 `setFirstName` 或 `setLastName` 時，會觸發 `重新渲染（Re-render`），下一次的 `fullName` 就會直接從新資料中計算出來，事件處理常式不需要做任何額外操作。

  :::info 不要在 state 中鏡像（Mirror）props
  以下代碼是體現 `state` 冗餘的一個常見例子：

  ```jsx
  function Message({ messageColor }) {
    const [color, setColor] = useState(messageColor);
  ```

  - 這裡將 `color` 狀態初始化為 `messageColor` 的 `prop` 值。這段代碼的問題在於，如果父組件稍後傳遞了不同的 `messageColor` 值（例如從 `'blue'` 更改為 `'red'`），則 `color` 狀態變數將不會更新！ 因為 `state` 僅在第一次渲染（組件掛載）期間初始化。

  - 正確的做法： 應該在代碼中直接使用 `messageColor` 屬性。如果你想給它起一個更短的名稱，請使用常數：

  ```jsx
  function Message({ messageColor }) {
    const color = messageColor;
  ```
  
  - 例外情況： 只有當你「刻意」想要忽略後續的 `props` 更新時，這種鏡像才有意義。按照 `React` 社群慣例，此時 `prop` 名稱應以 `initial` 或 `default` 開頭：

  ```jsx
  function Message({ initialColor }) {
    // color 狀態變數僅保存 initialColor 的「初始值」，後續的更改將被忽略。
    const [color, setColor] = useState(initialColor);
  ```
  :::

## 避免重複的 state
  在設計列表組件（例如：零食清單）並允許使用者點擊 `「選取（Choose）」` 其中一項時，常見的錯誤是將選取的完整物件存入狀態中。

  - #### 錯誤範例：在兩個狀態中儲存同一個物件
    ```jsx
    items = [{ id: 0, title: 'pretzels'}, ...]
    selectedItem = { id: 0, title: 'pretzels' }
    ```

    - 這意味著該項目的資訊在兩個地方產生了 `重複`。如果此時清單中的資料允許被編輯（例如透過 `<input>` 修改標題），你會發現輸入框的文字更新了，但底部顯示選取結果的標籤卻沒有變。這是因為你更新了 `items` 陣列，卻忘記更新 `selectedItem` 物件。

  - #### 正確範例：只儲存必要的 ID
    更簡單且不易出錯的解決方法是消除重複項。在狀態中只保留選取項目的 `selectedId`，而實際的項目物件則在渲染期間透過 `find()` 計算出來：
    ```jsx
    items = [{ id: 0, title: 'pretzels'}, ...]
    selectedId = 0
    ```

    ```jsx
    const [items, setItems] = useState(initialItems);
    const [selectedId, setSelectedId] = useState(0);

    // 在渲染期間動態尋找對應的項目物件
    const selectedItem = items.find(item => item.id === selectedId);
    ```

    這樣做的好處： 刪除了重複的 `state`，只保留了最核心的資料。現在當你編輯被選取的元素時，底部的標籤會立即更新。因為 `setItems` 觸發重新渲染後，`items.find()` 會自動抓到最新修改後的文本，狀態之間永遠不會失去同步。

## 避免深度嵌套的 state
  想像一下，一個由行星、大陸和國家組成的旅行計畫。你可能會嘗試使用 `嵌套（Nested）` 物件和陣列來構建它的 `state`，就像一個樹狀結構：

  ```jsx
  // 嵌套結構的缺點：更新其中一個節點需要一路向上複製所有的祖先物件
  export const initialTravelPlan = {
    id: 0,
    title: '(Root)',
    childPlaces: [{
      id: 1,
      title: 'Earth',
      childPlaces: [{
        id: 2,
        title: 'Africa',
        childPlaces: [/* ... */]
      }]
    }]
  };
  ```

  - #### 嵌套狀態的痛點
    如果想添加一個按鈕來刪除一個你已經去過的地方，更新嵌套的 `state` 需要從被更改的部分一路向上複製所有的父級物件。刪除一個深度嵌套的地點將涉及複製其整個父級地點鏈，這樣的程式碼會變得非常冗長、繁瑣且容易出錯。

  - #### 最佳解法：將狀態「扁平化」（Flatten）或「規範化」（Normalize）
    如果 `state` 嵌套太深而難以輕鬆更新，可以考慮將其「扁平化」。 這種類似於資料庫表格（Database Table）的設計重組，不再讓每個節點直接包含完整的子節點物件，而是僅保存其子節點的 ID 陣列。接著，再儲存一個將 `「節點 ID」` 對應到 `「節點內容」` 的 `獨立映射物件（Map/Dictionary）`。

  - #### 扁平化後的資料結構範例：
    ```jsx
    export const initialTravelPlan = {
      0: {
        id: 0,
        title: '(Root)',
        childIds: [1, 42, 46],
      },
      1: {
        id: 1,
        title: 'Earth',
        childIds: [2, 10, 19, 26, 34]
      },
      2: {
        id: 2,
        title: 'Africa',
        childIds: [3, 4, 5, 6, 7, 8, 9]
      },
      // 每個地點都是獨立、扁平的一層
    };
    ```

  - #### 實現更容易的狀態更新
    現在狀態已經規範化，要刪除或修改某個地點時，你只需要更新兩個 `state` 層級，而不需要動到整棵樹：
    - `父級地點`：建立一個父級地點的新版本，並在它的 `childIds` 陣列中過濾掉（排除）被刪除的子級 `ID`。
    - `根級物件`：更新整體的 `plan` 物件，使其包含該更新後的父級地點即可。

  - #### 狀態更新邏輯示範
    ```jsx
    function handleComplete(parentId, childId) {
      const parent = plan[parentId];
      
      // 1. 建立父級地點的新版本（排除該子級 ID）
      const nextParent = {
        ...parent,
        childIds: parent.childIds.filter(id => id !== childId)
      };
      
      // 2. 更新根 state 物件，替換掉該父級節點
      setPlan({
        ...plan,
        [parentId]: nextParent
      });
    }
    ```

  - #### 總結
    雖然 `React` 允許你隨心所欲地嵌套物件，但將狀態扁平化可以解決絕大多數的深度更新難題。它不僅讓程式碼更簡潔、更易維護，也能有效確保資料在不同嵌套層級中不會產生重複。

  :::info 改善記憶體使用
  - 在先前的扁平化範例中，雖然我們將被刪除的地點 `ID` 從父級的 `childIds` 陣列中移除，但該地點物件本身（以及它的所有子節點物件）依然保留在樹狀「表」物件中。

  - 理想情況下，你還應該從「表」物件中刪除已刪除的項目（以及它們的子項目！）以改善記憶體使用。否則這些無用的舊資料會一直佔用記憶體（即記憶體洩漏）。

  - ###### 最佳實踐：使用 Immer 簡化更新邏輯
    當需要遞迴刪除某個節點及其所有子節點時，原生 `React` 的展開運算子（Spread Operator）會變得極度複雜。此時可以 使用 `Immer` 提供的 `useImmer`，讓你直接在 `draft（草稿）` 上進行變更，大大簡化撰寫難度：

  - ###### 使用 Immer 的更新邏輯示範：
    ```jsx
    import { useImmer } from 'use-immer';

    // 在組件內部
    const [plan, updatePlan] = useImmer(initialTravelPlan);

    function handleComplete(parentId, childId) {
      updatePlan(draft => {
        // 1. 從父級地點的子 ID 陣列中移除該 ID
        const parent = draft[parentId];
        parent.childIds = parent.childIds.filter(id => id !== childId);

        // 2. 遞迴刪除這個地點和它的所有子目錄，以釋放記憶體
        deleteAllChildren(childId);

        function deleteAllChildren(id) {
          const place = draft[id];
          if (!place) return;
          
          // 先遞迴走訪並刪除所有子節點
          place.childIds.forEach(deleteAllChildren);
          
          // 接著從草稿物件中刪除自己
          delete draft[id];
        }
      });
    }
    ```
  - ###### 另一個減輕嵌套的技巧：將狀態下放至子組件
    有時候，你也可以透過將一些嵌套的 `state` 移動到子組件中來減少主狀態的嵌套深度。

    這個方法非常適合用來處理不需要保存的短暫 UI 狀態。例如：
    - 某個選單列表項目前是否被滑鼠懸停（Hover）
    - 某個樹狀節點目前是否展開（Expanded/Collapsed）

    如果把這些短暫的 UI 開關全部塞在父組件的全域 `plan` 狀態裡，會讓資料結構變得無謂地複雜。
    將它們拆分並宣告在子組件內部的 `useState` 中，可以維持資料源（Single Source of Truth）的乾淨與純粹。
  :::

## 重點複習（Recap）
  - 如果兩個 `state` 變數總是同時更新，請考慮將它們合併為一個。
  - 仔細選擇你的 `state` 變數，以避免建立「極難處理」的 `state`。
  - 用一種減少出錯與非同步更新機會的方式來建構你的 `state`。
  - 避免冗餘（Redundant）和重複的 `state`，這樣你就不需要費心維持同步。
  - 除非你特別想防止更新，否則不要將 `props` 放入 `state` 中。
  - 對於選擇類型的 UI 模式，請在 `state` 中儲存 ID 或索引（Index），而不是物件本身。
  - 如果深度嵌套（Deeply Nested）的 `state` 更新很複雜，請嘗試將其展開並扁平化。

## 挑戰（Challenges）
  - #### 1. 修復一個未更新的組件
    - ##### 題目描述
      `Clock` 組件接收兩個屬性：`color` 和 `time`。當你在選擇方塊（Select）中選擇不同的顏色時，`Clock` 組件將從其父組件接收到一個不同的 `color` 屬性。然而，顯示的顏色卻沒有更新。為什麼？請修復這個問題。
      
    - ##### 錯誤程式碼原因分析
      在舊的程式碼中，`color` 狀態是使用 `props.color` 的初始值進行初始化的：
      ```jsx
      // 錯誤示範
      import { useState } from 'react';

      export default function Clock(props) {
        const [color, setColor] = useState(props.color);
        return (
          <h1 style={{ color: color }}>
            {props.time}
          </h1>
        );
      }
      ```

      這就是所謂的將 `Props` 鏡像到 `State（Mirroring props into state）`。當父組件傳入的 color `prop` 發生更改時，並不會主動觸發這個內部 `state` 變數的更新！兩者因此失去了同步。
    
    - ##### 官方正解（直接使用 `Prop`）
      完全刪除重複的內部 `state` 變數，直接讀取 `props.color`：

      ```jsx
      export default function Clock(props) {
        return (
          <h1 style={{ color: props.color }}>
            {props.time}
          </h1>
        );
      }
      ```

      或者使用更精簡的解構語法（Destructuring）：

      ```jsx
      export default function Clock({ color, time }) {
        return (
          <h1 style={{ color: color }}>
            {time}
          </h1>
        );
      }

  - #### 2. 修復一個損壞的打包清單
    - ##### 題目描述
      這個打包清單有一個頁腳，顯示了「已打包的物品數量」和「總共的物品數量」。一開始看起來似乎很好用，但是它存在漏洞。例如，如果你將一個物品標記為已打包然後刪除它，計數器就不會正確更新。請修復計數器。
      
    - ##### 錯誤程式碼原因分析
      原程式碼為 `total` 和 `packed` 各自獨立宣告了額外的 `useState`，並在每次新增、修改、刪除事件中手動去作加減法運算。這種狀態是 `冗餘（Redundant）` 的，因為它們完全可以透過現有的 `items` 陣列直接計算出來。一旦某個事件忘記同步更新，就會產生 `Bug`。

      ```jsx
      import { useState } from 'react';
      import AddItem from './AddItem.js';
      import PackingList from './PackingList.js';

      let nextId = 3;
      const initialItems = [
        { id: 0, title: 'Warm socks', packed: true },
        { id: 1, title: 'Travel journal', packed: false },
        { id: 2, title: 'Watercolors', packed: false },
      ];

      export default function TravelPlan() {
        const [items, setItems] = useState(initialItems);
        const [total, setTotal] = useState(3);
        const [packed, setPacked] = useState(1);

        function handleAddItem(title) {
          setTotal(total + 1);
          setItems([
            ...items,
            {
              id: nextId++,
              title: title,
              packed: false
            }
          ]);
        }

        function handleChangeItem(nextItem) {
          if (nextItem.packed) {
            setPacked(packed + 1);
          } else {
            setPacked(packed - 1);
          }
          setItems(items.map(item => {
            if (item.id === nextItem.id) {
              return nextItem;
            } else {
              return item;
            }
          }));
        }

        function handleDeleteItem(itemId) {
          setTotal(total - 1);
          setItems(
            items.filter(item => item.id !== itemId)
          );
        }

        return (
          <>
            <AddItem
              onAddItem={handleAddItem}
            />
            <PackingList
              items={items}
              onChangeItem={handleChangeItem}
              onDeleteItem={handleDeleteItem}
            />
            <hr />
            <b>{packed} out of {total} packed!</b>
          </>
        );
      }
      ```
      
    - ##### 官方正解（刪除冗餘 State，即時計算）
      刪除額外的計數器狀態，改在每次渲染時直接透過 `items` 計算出來：
      
      ```jsx
      import { useState } from 'react';
      import AddItem from './AddItem.js';
      import PackingList from './PackingList.js';

      export default function TravelPlan() {
        const [items, setItems] = useState(initialItems);

        // 在渲染期間動態計算，永遠是最準確的資料！
        const total = items.length;
        const packed = items.filter(item => item.packed).length;

        function handleAddItem(title) {
          setItems([
            ...items,
            { id: nextId++, title: title, packed: false }
          ]);
        }

        function handleChangeItem(nextItem) {
          setItems(items.map(item => item.id === nextItem.id ? nextItem : item));
        }

        function handleDeleteItem(itemId) {
          setItems(items.filter(item => item.id !== itemId));
        }

        return (
          <>
            <AddItem onAddItem={handleAddItem} />
            <PackingList items={items} onChangeItem={handleChangeItem} onDeleteItem={handleDeleteItem} />
            <hr />
            <b>{packed} out of {total} packed!</b>
          </>
        );
      }
      ```

  - #### 3. 修復消失的選項
    - ##### 題目描述
      當你懸停（Hover）或聚焦到特定的信件時，它會被藍色高亮。目前高亮的信件儲存在 `highlightedLetter` 狀態中。你可以點擊 `“Star”` 按鈕來收藏信件。但是有一個 UI 問題：當你點擊 `“Star”` 時，高亮會短暫消失，直到你重新移動滑鼠。為什麼會這樣？
      
    - ##### 錯誤程式碼原因分析
      原程式碼將整個信件物件本身儲存在 `highlightedLetter` 中。當點擊 `“Star”` 時，我們會拷貝並建立一個全新參照的信件物件 `（return { ...letter, isStarred: !letter.isStarred }）` 更新到 `letters` 陣列。這時，陣列裡的新物件與先前存在 `highlightedLetter` 的舊物件雖然 `id` 相同，但物件參照位址（Reference）已經不同了！導致 `letter === highlightedLetter` 的比對結果變成 `false`，高亮因而消失。

      ```jsx
      import { useState } from 'react';
      import { initialLetters } from './data.js';
      import Letter from './Letter.js';

      export default function MailClient() {
        const [letters, setLetters] = useState(initialLetters);
        const [highlightedLetter, setHighlightedLetter] = useState(null);

        function handleHover(letter) {
          setHighlightedLetter(letter);
        }

        function handleStar(starred) {
          setLetters(letters.map(letter => {
            if (letter.id === starred.id) {
              return {
                ...letter,
                isStarred: !letter.isStarred
              };
            } else {
              return letter;
            }
          }));
        }

        return (
          <>
            <h2>Inbox</h2>
            <ul>
              {letters.map(letter => (
                <Letter
                  key={letter.id}
                  letter={letter}
                  isHighlighted={
                    letter === highlightedLetter
                  }
                  onHover={handleHover}
                  onToggleStar={handleStar}
                />
              ))}
            </ul>
          </>
        );
      }

      ```
      
    - ##### 官方正解（儲存 ID 而非儲存整個物件）
      不要在兩個地方儲存相同的物件，改為儲存 `highlightedId`：
      
      ```jsx
      export default function MailClient() {
        const [letters, setLetters] = useState(initialLetters);
        // 儲存 ID 即可
        const [highlightedId, setHighlightedId] = useState(null);

        function handleHover(letterId) {
          setHighlightedId(letterId);
        }

        function handleStar(starredId) {
          setLetters(letters.map(letter => {
            if (letter.id === starredId) {
              return { ...letter, isStarred: !letter.isStarred };
            }
            return letter;
          }));
        }

        return (
          <>
            <h2>Inbox</h2>
            <ul>
              {letters.map(letter => (
                <Letter
                  key={letter.id}
                  letter={letter}
                  // 即使物件重新拷貝，ID 比對依然恆真
                  isHighlighted={letter.id === highlightedId}
                  onHover={handleHover}
                  onToggleStar={handleStar}
                />
              ))}
            </ul>
          </>
        );
      }
      ```
  
  - #### 4. 實現多選功能
    - ##### 題目描述
      目前的信件列表只能 `單選（selectedId 只能是單一 ID 或 null）`。請將狀態結構更改為支援 `多選（Multiple Selection）` 功能。每個核取方塊（Checkbox）應該可以獨立勾選，且頁腳要能顯示正確的選取總數。

      ```jsx
      import { useState } from 'react';
      import { letters } from './data.js';
      import Letter from './Letter.js';

      export default function MailClient() {
        const [selectedId, setSelectedId] = useState(null);

        // TODO: 支持多選
        const selectedCount = 1;

        function handleToggle(toggledId) {
          // TODO: 支持多選
          setSelectedId(toggledId);
        }

        return (
          <>
            <h2>Inbox</h2>
            <ul>
              {letters.map(letter => (
                <Letter
                  key={letter.id}
                  letter={letter}
                  isSelected={
                    // TODO: 支持多選
                    letter.id === selectedId
                  }
                  onToggle={handleToggle}
                />
              ))}
              <hr />
              <p>
                <b>
                  You selected {selectedCount} letters
                </b>
              </p>
            </ul>
          </>
        );
      }
      ```
      
    - ##### 官方正解 A
      使用 `「陣列」` 結構在狀態中保留一個 `selectedIds` 陣列：

      ```jsx
      const [selectedIds, setSelectedIds] = useState([]);

      const selectedCount = selectedIds.length;

      function handleToggle(toggledId) {
        if (selectedIds.includes(toggledId)) {
          // 如果已被選取，則移除
          setSelectedIds(selectedIds.filter(id => id !== toggledId));
        } else {
          // 否則，將 ID 加進陣列
          setSelectedIds([...selectedIds, toggledId]);
        }
      }
      ```

    - ##### 官方正解 B
      使用 `「Set」` 優化效能使用陣列的缺點是每次渲染每個項目都需要呼叫 `includes()`，這需要線性時間 `$O(N)$`。如果資料量非常大，改用 `JavaScript` 的 `Set` 物件進行 `has()` 操作，能將時間複雜度降到常数時間 `$O(1)$`，效能更佳：
      
      ```jsx
      import { useState } from 'react';
      import { letters } from './data.js';
      import Letter from './Letter.js';

      export default function MailClient() {
        // 使用 Set 結構
        const [selectedIds, setSelectedIds] = useState(new Set());

        const selectedCount = selectedIds.size;

        function handleToggle(toggledId) {
          // 記住：不可直接修改原本的 state 物件！必須先建立一個複本（Copy）
          const nextIds = new Set(selectedIds);
          if (nextIds.has(toggledId)) {
            nextIds.delete(toggledId);
          } else {
            nextIds.add(toggledId);
          }
          setSelectedIds(nextIds);
        }

        return (
          <>
            <h2>Inbox</h2>
            <ul>
              {letters.map(letter => (
                <Letter
                  key={letter.id}
                  letter={letter}
                  isSelected={selectedIds.has(letter.id)}
                  onToggle={handleToggle}
                />
              ))}
              <hr />
              <p><b>You selected {selectedCount} letters</b></p>
            </ul>
          </>
        );
      }
      ```